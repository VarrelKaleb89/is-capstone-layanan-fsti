import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { toLetterRequestDTO, STATUS_LABELS } from '@/lib/request-mapper';
import { getAdminSession } from '@/lib/auth';
import { MOCK_REQUESTS } from '@/lib/mock-requests';

const REQUEST_INCLUDE = {
  student: true,
  letterType: true,
  verifiedBy: true,
  signedBy: true,
  attachments: true,
  survey: true,
} as const;

const BASE_DATE = new Date('2026-10-14T09:00:00');

/**
 * POST /api/requests/reset
 * Fitur "Reset Data Demo" portal admin: kosongkan letter_requests lalu
 * isi ulang dengan 6 permohonan mock (lib/mock-requests.ts).
 * letter_types & users tidak disentuh.
 */
export async function POST() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Tidak terautentikasi.' }, { status: 401 });
    }

    const pimpinan = await prisma.user.findFirst({ where: { role: 'pimpinan' } });

    await prisma.$transaction(async (tx) => {
      // Survei & lampiran ikut terhapus via ON DELETE CASCADE.
      await tx.letterRequest.deleteMany({});

      for (let index = 0; index < MOCK_REQUESTS.length; index++) {
        const mock = MOCK_REQUESTS[index];
        const letterType = await tx.letterType.findUnique({
          where: { code: mock.serviceType },
        });
        if (!letterType) continue;

        const student = await tx.student.upsert({
          where: { nim: mock.nim },
          update: {
            fullName: mock.fullName,
            studyProgram: mock.studyProgram,
            degree: mock.degree,
            phone: mock.whatsapp,
            email: mock.email,
          },
          create: {
            nim: mock.nim,
            fullName: mock.fullName,
            studyProgram: mock.studyProgram,
            degree: mock.degree,
            phone: mock.whatsapp,
            email: mock.email,
          },
        });

        const createdAt = new Date(BASE_DATE);
        createdAt.setDate(createdAt.getDate() + (mock.createdDayOffset ?? 0));
        createdAt.setHours(9 + (index % 4), 15 + (index * 7) % 40, 0, 0);
        const updatedAt = new Date(createdAt);
        updatedAt.setHours(updatedAt.getHours() + 2);

        await tx.letterRequest.create({
          data: {
            ticketNumber: mock.ticketNumber,
            studentId: student.id,
            letterTypeId: letterType.id,
            status: mock.status,
            statusLabel: STATUS_LABELS[mock.status],
            semester: mock.semester,
            academicYear: mock.academicYear,
            purpose: mock.purpose,
            extraData: {
              parentName: mock.parentName,
              parentJob: mock.parentJob,
              parentAddress: mock.parentAddress,
              academicDocTypes: mock.academicDocTypes,
              targetSemester: mock.targetSemester,
              outputFormat: mock.outputFormat,
            },
            letterNumber: mock.letterNumber,
            letterDate: mock.letterNumber ? new Date('2026-10-15') : null,
            signedById:
              mock.status === 'siap_diunduh' || mock.status === 'menunggu_pimpinan'
                ? pimpinan?.id
                : null,
            signedPosition: mock.letterNumber
              ? 'Dekan Fakultas Sains dan Teknologi Informasi'
              : null,
            adminNotes: mock.adminNotes,
            createdAt,
            updatedAt,
            ...(mock.attachmentName
              ? { attachments: { create: { fileName: mock.attachmentName } } }
              : {}),
            statusHistories: {
              create: {
                fromStatus: null,
                toStatus: 'diajukan',
                note: 'Permohonan dibuat oleh mahasiswa',
                createdAt,
              },
            },
          },
        });
      }
    });

    const requests = await prisma.letterRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: REQUEST_INCLUDE,
    });

    return NextResponse.json({ requests: requests.map(toLetterRequestDTO) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal reset data demo';
    console.error('POST /api/requests/reset error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
