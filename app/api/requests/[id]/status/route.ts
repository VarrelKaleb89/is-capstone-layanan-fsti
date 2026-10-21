import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { toLetterRequestDTO, formatDateIndo, formatDateTime, STATUS_LABELS } from '@/lib/request-mapper';
import type { RequestStatus } from '@prisma/client';
import { getAdminSession } from '@/lib/auth';

const REQUEST_INCLUDE = {
  student: true,
  letterType: true,
  verifiedBy: true,
  signedBy: true,
  attachments: true,
  survey: true,
} as const;

/** Transisi valid sesuai state machine docs/db.md §2. */
const VALID_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  diajukan: ['diverifikasi_tendik', 'menunggu_pimpinan', 'ditolak'],
  diverifikasi_tendik: ['menunggu_pimpinan', 'ditolak'],
  menunggu_pimpinan: ['siap_diunduh', 'ditolak'],
  siap_diunduh: [],
  ditolak: ['diajukan'],
};

interface StatusBody {
  status: RequestStatus;
  adminNotes?: string;
  note?: string;
  actorRole?: 'tendik' | 'pimpinan';
}

/**
 * PUT /api/requests/[id]/status
 * Transisi status + audit trail ke letter_status_histories.
 * - `menunggu_pimpinan`/`siap_diunduh`: auto isi letter_number/letter_date bila kosong
 * - `siap_diunduh`: mengunci status akhir (tidak bisa transisi lagi)
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Peran diverifikasi dari SESI (server-side), bukan input klien.
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Tidak terautentikasi.' }, { status: 401 });
    }

    const { id } = await params;
    const body = (await req.json()) as StatusBody;

    const existing = await prisma.letterRequest.findUnique({
      where: { id },
      include: { letterType: true },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Permohonan tidak ditemukan' }, { status: 404 });
    }

    const newStatus = body.status;
    if (!newStatus || !(newStatus in STATUS_LABELS)) {
      return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 });
    }

    const validTargets = VALID_TRANSITIONS[existing.status];
    if (!validTargets.includes(newStatus)) {
      return NextResponse.json(
        {
          error: `Transisi "${existing.status}" → "${newStatus}" tidak diizinkan`,
        },
        { status: 400 }
      );
    }

    // Pemisahan peran (keamanan nyata): pimpinan tidak boleh memproses
    // permohonan yang belum diverifikasi tendik.
    if (session.role === 'pimpinan' && existing.status === 'diajukan') {
      return NextResponse.json(
        { error: 'Permohonan harus diverifikasi tendik terlebih dahulu' },
        { status: 403 }
      );
    }

    const now = new Date();
    const updateData: Record<string, unknown> = {
      status: newStatus,
      statusLabel: STATUS_LABELS[newStatus],
      updatedAt: now,
    };

    // Auto-generate metadata surat saat masuk ke alur pengesahan
    if (newStatus === 'menunggu_pimpinan' || newStatus === 'siap_diunduh') {
      if (!existing.letterNumber) {
        const serial = Math.floor(140 + Math.random() * 50);
        updateData.letterNumber = `${serial}/IT10.FSTI/KM/${now.getFullYear()}`;
        updateData.letterDate = now;
      } else if (!existing.letterDate) {
        updateData.letterDate = now;
      }
      if (newStatus === 'siap_diunduh') {
        // Surat keluarga KP & Surat Keterangan Aktif Studi ditandatangani WD1
        // (sesuai template resmi), lainnya Dekan.
        const isWd1Family =
          existing.letterType.code === 'surat-pengantar-kp' ||
          existing.letterType.code === 'kp-setelah-diterima' ||
          existing.letterType.code === 'surat-aktif-studi';
        const signer = isWd1Family
          ? await prisma.user.findFirst({ where: { role: 'pimpinan', nip: '199303232022032016' } })
          : await prisma.user.findFirst({ where: { role: 'pimpinan' } });
        if (signer) {
          updateData.signedById = signer.id;
          updateData.signedPosition = isWd1Family
            ? 'Wakil Dekan Bidang Akademik dan Kemahasiswaan'
            : 'Dekan Fakultas Sains dan Teknologi Informasi';
        }
      }
    }
    if (body.adminNotes !== undefined) {
      updateData.adminNotes = body.adminNotes;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const row = await tx.letterRequest.update({
        where: { id },
        data: updateData,
        include: REQUEST_INCLUDE,
      });
      await tx.letterStatusHistory.create({
        data: {
          requestId: id,
          fromStatus: existing.status,
          toStatus: newStatus,
          actorId: session.id,
          note: body.note ?? body.adminNotes ?? null,
        },
      });
      return row;
    });

    return NextResponse.json({ request: toLetterRequestDTO(updated) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal memperbarui status';
    console.error('PUT /api/requests/[id]/status error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/requests/[id]/status
 * Audit trail lengkap (letter_status_histories) untuk permohonan.
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
    const histories = await prisma.letterStatusHistory.findMany({
      where: { requestId: id },
      orderBy: { createdAt: 'desc' },
      include: { actor: true },
    });

    return NextResponse.json({
      histories: histories.map((h) => ({
        id: h.id,
        from: h.fromStatus,
        to: h.toStatus,
        note: h.note,
        actorName: h.actor?.name,
        createdAt: formatDateTime(h.createdAt),
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal memuat riwayat status';
    console.error('GET /api/requests/[id]/status error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
