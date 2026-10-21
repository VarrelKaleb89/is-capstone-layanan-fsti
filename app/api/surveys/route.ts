import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * POST /api/surveys
 * Simpan survei kepuasan untuk satu permohonan (relasi 1:1, docs/db.md §4.8).
 * Sekaligus menandai request terkait melalui relasi survey.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      requestId: string;
      rating: number;
      helpfulness: string;
      feedback?: string;
    };

    if (!body.requestId || !body.rating || !body.helpfulness) {
      return NextResponse.json(
        { error: 'requestId, rating, dan helpfulness wajib diisi' },
        { status: 400 }
      );
    }

    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json({ error: 'Rating harus 1–5' }, { status: 400 });
    }

    const request = await prisma.letterRequest.findUnique({
      where: { id: body.requestId },
    });
    if (!request) {
      return NextResponse.json({ error: 'Permohonan tidak ditemukan' }, { status: 404 });
    }

    const survey = await prisma.survey.upsert({
      where: { requestId: body.requestId },
      update: {
        rating: body.rating,
        helpfulness: body.helpfulness,
        feedback: body.feedback,
        completedAt: new Date(),
      },
      create: {
        requestId: body.requestId,
        rating: body.rating,
        helpfulness: body.helpfulness,
        feedback: body.feedback,
      },
    });

    return NextResponse.json({ survey }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menyimpan survei';
    console.error('POST /api/surveys error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/surveys
 * Ringkasan survei untuk laporan (rata-rata rating + total respon).
 */
export async function GET() {
  try {
    const [total, avgRating] = await Promise.all([
      prisma.survey.count(),
      prisma.survey.aggregate({ _avg: { rating: true } }),
    ]);

    const byHelpfulness = await prisma.survey.groupBy({
      by: ['helpfulness'],
      _count: { helpfulness: true },
    });

    return NextResponse.json({
      total,
      averageRating: avgRating._avg.rating ?? 0,
      byHelpfulness: byHelpfulness.map((g) => ({
        helpfulness: g.helpfulness,
        count: g._count.helpfulness,
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal memuat laporan survei';
    console.error('GET /api/surveys error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
