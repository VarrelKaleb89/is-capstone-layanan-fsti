import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { readFile } from 'fs/promises';
import path from 'path';

const UPLOAD_ROOT = path.join(process.cwd(), 'uploads');

/**
 * GET /api/attachments/[id]
 * Mengirim isi file lampiran pengajuan. Hanya untuk sesi admin
 * (tendik/pimpinan) — otorisasi blueprint §6.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Tidak terautentikasi.' }, { status: 401 });
    }

    const { id } = await params;
    const attachment = await prisma.attachment.findUnique({ where: { id } });
    if (!attachment || !attachment.fileUrl) {
      return NextResponse.json({ error: 'Lampiran tidak ditemukan.' }, { status: 404 });
    }

    // Path traversal guard: hanya file di dalam uploads/ yang boleh dibaca.
    const stored = path.basename(attachment.fileUrl);
    const filePath = path.join(UPLOAD_ROOT, stored);
    if (!filePath.startsWith(UPLOAD_ROOT)) {
      return NextResponse.json({ error: 'Path tidak valid.' }, { status: 400 });
    }

    const buffer = await readFile(filePath);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': attachment.mimeType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(attachment.fileName)}"`,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal memuat lampiran.';
    console.error('GET /api/attachments/[id] error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
