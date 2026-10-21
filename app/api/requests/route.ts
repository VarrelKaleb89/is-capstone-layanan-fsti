import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { toLetterRequestDTO, STATUS_LABELS } from '@/lib/request-mapper';
import type { ExtraData } from '@/lib/request-mapper';
import { getAdminSession } from '@/lib/auth';

/**
 * GET /api/requests
 * Query: ?nim= (filter per NIM), ?limit=
 * - Dengan ?nim= : publik (fitur tracking mahasiswa, hanya data NIM itu).
 * - Tanpa ?nim= : daftar lengkap semua permohonan — wajib sesi admin.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const nim = searchParams.get('nim');
    const limit = Number(searchParams.get('limit')) || undefined;

    if (!nim) {
      const session = await getAdminSession();
      if (!session) {
        return NextResponse.json(
          { error: 'Tidak terautentikasi. Daftar lengkap permohonan hanya untuk admin.' },
          { status: 401 }
        );
      }
    }

    const requests = await prisma.letterRequest.findMany({
      where: nim ? { student: { nim } } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        student: true,
        letterType: true,
        verifiedBy: true,
        signedBy: true,
        attachments: true,
        survey: true,
      },
    });

    return NextResponse.json({ requests: requests.map(toLetterRequestDTO) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal memuat permohonan';
    console.error('GET /api/requests error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

interface CreateRequestBody {
  serviceType: string;
  fullName: string;
  nim: string;
  studyProgram: string;
  degree?: string;
  semester: string;
  academicYear: string;
  purpose: string;
  whatsapp?: string;
  email?: string;
  parentName?: string;
  parentJob?: string;
  parentAddress?: string;
  attachmentName?: string;
  academicDocTypes?: string[];
  targetSemester?: string;
  outputFormat?: 'digital_pdf' | 'cetak_hardcopy';
  copiesCount?: number;
  legalizationDocs?: string[];
}

/**
 * POST /api/requests
 * Membuat permohonan baru: student di-upsert per NIM, ticket digenerate
 * dari prefix letter_type (FSTI-AKTIF-20261019-123), status awal `diajukan`
 * + entri pertama letter_status_histories.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateRequestBody;

    if (!body.serviceType || !body.fullName || !body.nim || !body.semester) {
      return NextResponse.json(
        { error: 'serviceType, fullName, nim, dan semester wajib diisi' },
        { status: 400 }
      );
    }

    const letterType = await prisma.letterType.findUnique({
      where: { code: body.serviceType },
    });
    if (!letterType) {
      return NextResponse.json(
        { error: `Jenis layanan "${body.serviceType}" tidak ditemukan` },
        { status: 400 }
      );
    }

    // Upsert student berdasarkan NIM (identitas bisa berubah: prodi/kontak)
    const student = await prisma.student.upsert({
      where: { nim: body.nim },
      update: {
        fullName: body.fullName,
        studyProgram: body.studyProgram,
        degree: body.degree || 'S1',
        phone: body.whatsapp,
        email: body.email,
      },
      create: {
        nim: body.nim,
        fullName: body.fullName,
        studyProgram: body.studyProgram,
        degree: body.degree || 'S1',
        phone: body.whatsapp,
        email: body.email,
      },
    });

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const ticketNumber = `${letterType.ticketPrefix}-${dateStr}-${randomSuffix}`;

    const extraData: ExtraData = {
      parentName: body.parentName,
      parentJob: body.parentJob,
      parentAddress: body.parentAddress,
      academicDocTypes: body.academicDocTypes,
      targetSemester: body.targetSemester,
      outputFormat: body.outputFormat,
      copiesCount: body.copiesCount,
      legalizationDocs: body.legalizationDocs,
    };

    const created = await prisma.letterRequest.create({
      data: {
        ticketNumber,
        studentId: student.id,
        letterTypeId: letterType.id,
        status: 'diajukan',
        statusLabel: STATUS_LABELS.diajukan,
        semester: body.semester,
        academicYear: body.academicYear,
        purpose: body.purpose,
        extraData: extraData as object,
        adminNotes: 'Permohonan baru berhasil dikirim oleh mahasiswa.',
        ...(body.attachmentName
          ? {
              attachments: {
                create: { fileName: body.attachmentName },
              },
            }
          : {}),
        statusHistories: {
          create: {
            fromStatus: null,
            toStatus: 'diajukan',
            note: 'Permohonan dibuat oleh mahasiswa',
          },
        },
      },
      include: {
        student: true,
        letterType: true,
        verifiedBy: true,
        signedBy: true,
        attachments: true,
        survey: true,
      },
    });

    return NextResponse.json({ request: toLetterRequestDTO(created) }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal membuat permohonan';
    console.error('POST /api/requests error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
