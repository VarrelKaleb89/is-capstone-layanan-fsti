import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { toLetterRequestDTO } from '@/lib/request-mapper';
import { getAdminSession } from '@/lib/auth';

const REQUEST_INCLUDE = {
  student: true,
  letterType: true,
  verifiedBy: true,
  signedBy: true,
  attachments: true,
  survey: true,
} as const;

/**
 * GET /api/requests/[id]
 * `id` bisa berupa UUID, ticket number, atau NIM (kompatibel dengan
 * getRequestByTicket lama di tracking mahasiswa).
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const clean = id.trim().toLowerCase();

    const row = await prisma.letterRequest.findFirst({
      where: {
        OR: [{ id: id }, { ticketNumber: { equals: id, mode: 'insensitive' } }],
      },
      include: REQUEST_INCLUDE,
    });

    // Fallback: cari via NIM (permohonan terbaru milik NIM tersebut)
    const request =
      row ??
      (await prisma.letterRequest.findFirst({
        where: { student: { nim: { equals: clean, mode: 'insensitive' } } },
        orderBy: { createdAt: 'desc' },
        include: REQUEST_INCLUDE,
      }));

    if (!request) {
      return NextResponse.json({ error: 'Permohonan tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ request: toLetterRequestDTO(request) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal memuat permohonan';
    console.error('GET /api/requests/[id] error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

interface PatchBody {
  letterNumber?: string;
  adminNotes?: string;
}

/**
 * PATCH /api/requests/[id]
 * Memperbarui nomor surat (fitur staf tendik: nomor surat unik per tiket)
 * dan/atau catatan admin.
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Tidak terautentikasi.' }, { status: 401 });
    }

    const { id } = await params;
    const body = (await req.json()) as PatchBody;

    const existing = await prisma.letterRequest.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Permohonan tidak ditemukan' }, { status: 404 });
    }

    const updated = await prisma.letterRequest.update({
      where: { id },
      data: {
        ...(body.letterNumber !== undefined ? { letterNumber: body.letterNumber } : {}),
        ...(body.adminNotes !== undefined ? { adminNotes: body.adminNotes } : {}),
      },
      include: REQUEST_INCLUDE,
    });

    return NextResponse.json({ request: toLetterRequestDTO(updated) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal memperbarui permohonan';
    console.error('PATCH /api/requests/[id] error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
