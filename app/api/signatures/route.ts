import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

/**
 * Mengambil tanda tangan AKTIF milik pimpinan (bentuk SignatureData
 * yang kompatibel dengan komponen OfficialLetterView & SignatureManager).
 */
export async function GET() {
  try {
    const signature = await prisma.signature.findFirst({
      where: { isActive: true, user: { role: 'pimpinan' } },
      orderBy: { uploadedAt: 'desc' },
    });

    if (!signature) {
      return NextResponse.json({ signature: null });
    }

    return NextResponse.json({
      signature: {
        dataUrl: signature.dataUrl,
        fileName: signature.fileName,
        size: signature.fileSize ?? 0,
        uploadedAt: signature.uploadedAt.toISOString(),
        signerName: signature.signerName ?? undefined,
        signerNip: signature.signerNip ?? undefined,
        widthPercent: signature.widthPercent,
        offsetXPercent: signature.offsetXPercent,
        offsetYPercent: signature.offsetYPercent,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal memuat tanda tangan';
    console.error('GET /api/signatures error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

interface PutBody {
  dataUrl?: string;
  fileName: string;
  size?: number;
  signerName?: string;
  signerNip?: string;
  widthPercent?: number;
  offsetXPercent?: number;
  offsetYPercent?: number;
}

/**
 * PUT /api/signatures
 * Simpan tanda tangan pimpinan (upsert): nonaktifkan yang lama, aktifkan yang baru.
 * Hanya satu tanda tangan aktif per pimpinan (partial unique index di schema).
 */
export async function PUT(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Tidak terautentikasi.' }, { status: 401 });
    }
    if (session.role !== 'pimpinan') {
      return NextResponse.json(
        { error: 'Hanya pimpinan yang dapat mengelola tanda tangan.' },
        { status: 403 }
      );
    }

    const body = (await req.json()) as PutBody;

    const pimpinan = await prisma.user.findFirst({ where: { role: 'pimpinan' } });
    if (!pimpinan) {
      return NextResponse.json(
        { error: 'User pimpinan belum ada — jalankan seed terlebih dahulu' },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.signature.updateMany({
        where: { userId: pimpinan.id, isActive: true },
        data: { isActive: false },
      });
      return tx.signature.create({
        data: {
          userId: pimpinan.id,
          dataUrl: body.dataUrl,
          fileName: body.fileName,
          fileSize: body.size,
          signerName: body.signerName,
          signerNip: body.signerNip,
          widthPercent: body.widthPercent ?? 55,
          offsetXPercent: body.offsetXPercent ?? 0,
          offsetYPercent: body.offsetYPercent ?? 0,
          isActive: true,
        },
      });
    });

    return NextResponse.json({
      signature: {
        dataUrl: result.dataUrl,
        fileName: result.fileName,
        size: result.fileSize ?? 0,
        uploadedAt: result.uploadedAt.toISOString(),
        signerName: result.signerName ?? undefined,
        signerNip: result.signerNip ?? undefined,
        widthPercent: result.widthPercent,
        offsetXPercent: result.offsetXPercent,
        offsetYPercent: result.offsetYPercent,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menyimpan tanda tangan';
    console.error('PUT /api/signatures error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/signatures
 * Hapus tanda tangan aktif pimpinan.
 */
export async function DELETE() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Tidak terautentikasi.' }, { status: 401 });
    }
    if (session.role !== 'pimpinan') {
      return NextResponse.json(
        { error: 'Hanya pimpinan yang dapat menghapus tanda tangan.' },
        { status: 403 }
      );
    }

    const deleted = await prisma.signature.deleteMany({
      where: { isActive: true, user: { role: 'pimpinan' } },
    });

    return NextResponse.json({ deleted: deleted.count });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menghapus tanda tangan';
    console.error('DELETE /api/signatures error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
