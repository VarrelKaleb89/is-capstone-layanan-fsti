import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: Request) {
  try {
    const body = await req.json() as { sheetHtml?: string; ticketNumber?: string };
    const { sheetHtml, ticketNumber } = body;

    if (!sheetHtml) {
      return NextResponse.json({ error: 'Sheet HTML is required' }, { status: 400 });
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Dokumen Resmi FSTI ITK</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 14mm;
    }
    body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .official-letter-sheet {
      width: 100% !important;
      max-width: none !important;
      box-shadow: none !important;
      border: none !important;
      margin: 0 !important;
      padding: 0 !important;
    }
  </style>
</head>
<body>
  <div class="official-letter-sheet bg-white text-gray-900 font-serif text-[13.5px] leading-relaxed">
    ${sheetHtml}
  </div>
</body>
</html>
    `;

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
    // Give Tailwind CDN a brief moment to evaluate classes using Promise.withResolvers
    const { promise, resolve } = Promise.withResolvers<void>();
    setTimeout(resolve, 600);
    await promise;

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '10mm', bottom: '10mm', left: '14mm', right: '14mm' },
    });
    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${ticketNumber || 'surat-fsti'}.pdf"`,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate PDF';
    console.error('Puppeteer PDF Generation Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
