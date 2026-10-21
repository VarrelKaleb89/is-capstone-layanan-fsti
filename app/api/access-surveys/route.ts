import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * POST /api/access-surveys
 * Survei umum akses portal (docs/db.md §4.9) — tanpa relasi ke permohonan.
 * Setara dengan submitAccessSurvey lama yang menyimpan ke localStorage.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      rating: number;
      helpfulness: string;
      satisfactionAspects?: string[];
      feedback?: string;
    };

    if (!body.rating || !body.helpfulness) {
      return NextResponse.json(
        { error: 'rating dan helpfulness wajib diisi' },
        { status: 400 }
      );
    }

    const survey = await prisma.accessSurvey.create({
      data: {
        rating: body.rating,
        helpfulness: body.helpfulness,
        satisfactionAspects: body.satisfactionAspects ?? [],
        feedback: body.feedback,
      },
    });

    return NextResponse.json(
      { id: survey.id, submittedAt: survey.submittedAt.toISOString() },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menyimpan survei akses';
    console.error('POST /api/access-surveys error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
