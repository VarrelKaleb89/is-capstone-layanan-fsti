import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { toLetterRequestDTO, STATUS_LABELS } from '@/lib/request-mapper';
import type { FieldError } from '@/app/api/kp/register/route';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

/**
 * POST /api/aktif-studi/register
 * Permohonan Surat Keterangan Aktif Studi (template resmi WD1).
 * Multipart form-data; dokumen pendukung OPSIONAL (PDF maks 10 MB).
 * Validasi lengkap server-side; file disimpan dengan nama acak di uploads/.
 */

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const NIM_RE = /^10\d{6}$/;
const PHONE_RE = /^(\+62|62|0)8\d{7,12}$/;
const DOKUMEN_MAX_MB = 10;

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const fullName = ((form.get('fullName') as string) || '').trim();
    const nim = ((form.get('nim') as string) || '').trim();
    const jurusan = ((form.get('jurusan') as string) || '').trim();
    const studyProgram = ((form.get('studyProgram') as string) || '').trim();
    const semester = ((form.get('semester') as string) || '').trim();
    const academicYear = ((form.get('academicYear') as string) || '').trim();
    const angkatan = ((form.get('angkatan') as string) || '').trim();
    const whatsapp = ((form.get('whatsapp') as string) || '').trim();
    const email = ((form.get('email') as string) || '').trim();
    const keperluan = ((form.get('keperluan') as string) || '').trim();
    const catatanTambahan = ((form.get('catatanTambahan') as string) || '').trim();

    const errors: FieldError[] = [];

    if (!fullName) errors.push({ field: 'fullName', message: 'Nama mahasiswa wajib diisi.' });
    if (!nim || !NIM_RE.test(nim))
      errors.push({ field: 'nim', message: 'NIM wajib diisi (format: 10XXXXXXX).' });
    if (!jurusan) errors.push({ field: 'jurusan', message: 'Jurusan wajib dipilih.' });
    if (!studyProgram) errors.push({ field: 'studyProgram', message: 'Program Studi wajib dipilih.' });
    if (!semester) errors.push({ field: 'semester', message: 'Semester wajib diisi.' });
    if (!academicYear || !/^\d{4}\/\d{4}$/.test(academicYear))
      errors.push({ field: 'academicYear', message: 'Tahun akademik wajib format 2026/2027.' });
    if (!angkatan || !/^(19|20)\d{2}$/.test(angkatan))
      errors.push({ field: 'angkatan', message: 'Angkatan wajib 4 digit (contoh: 2023).' });
    if (!whatsapp || !PHONE_RE.test(whatsapp.replace(/[\s-]/g, '')))
      errors.push({ field: 'whatsapp', message: 'Nomor telepon tidak valid (contoh: 081234567890).' });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.push({ field: 'email', message: 'Email tidak valid.' });
    if (!keperluan) errors.push({ field: 'keperluan', message: 'Keperluan permohonan wajib diisi.' });

    // Dokumen pendukung opsional — validasi hanya bila dikirim.
    const doc = form.get('dokumen_pendukung');
    let savedPlan: { fileName: string; storedName: string; size: number; mime: string; file: File } | null = null;
    if (doc instanceof File && doc.size > 0) {
      if (doc.type !== 'application/pdf') {
        errors.push({ field: 'dokumen_pendukung', message: 'Dokumen pendukung harus berformat PDF.' });
      } else if (doc.size > DOKUMEN_MAX_MB * 1024 * 1024) {
        errors.push({ field: 'dokumen_pendukung', message: `Dokumen pendukung melebihi ${DOKUMEN_MAX_MB} MB.` });
      } else {
        const ext = (doc.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
        savedPlan = {
          fileName: doc.name,
          storedName: `${randomUUID()}.${ext}`,
          size: doc.size,
          mime: doc.type,
          file: doc,
        };
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { errors, message: 'Periksa kembali isian formulir Anda.' },
        { status: 400 }
      );
    }

    if (savedPlan) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    const letterType = await prisma.letterType.findUnique({ where: { code: 'surat-aktif-studi' } });
    if (!letterType) {
      return NextResponse.json({ error: 'Katalog layanan belum ter-seed.' }, { status: 500 });
    }

    const created = await prisma.$transaction(async (tx) => {
      const student = await tx.student.upsert({
        where: { nim },
        update: {
          fullName,
          studyProgram,
          phone: whatsapp,
          email,
        },
        create: {
          nim,
          fullName,
          studyProgram,
          phone: whatsapp,
          email,
        },
      });

      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
      const suffix = Math.floor(100 + Math.random() * 900);

      return tx.letterRequest.create({
        data: {
          ticketNumber: `${letterType.ticketPrefix}-${dateStr}-${suffix}`,
          studentId: student.id,
          letterTypeId: letterType.id,
          status: 'diajukan',
          statusLabel: STATUS_LABELS.diajukan,
          semester,
          academicYear,
          purpose: keperluan,
          extraData: {
            jurusan,
            angkatan,
            catatanTambahan: catatanTambahan || undefined,
          },
          adminNotes: 'Permohonan Surat Keterangan Aktif Studi dikirim oleh mahasiswa.',
          statusHistories: {
            create: {
              fromStatus: null,
              toStatus: 'diajukan',
              note: 'Permohonan surat aktif studi dibuat oleh mahasiswa',
            },
          },
          ...(savedPlan
            ? {
                attachments: {
                  create: {
                    fileName: savedPlan.fileName,
                    fileUrl: `uploads/${savedPlan.storedName}`,
                    fileSize: BigInt(savedPlan.size),
                    mimeType: savedPlan.mime,
                    kind: 'dokumen_pendukung',
                  },
                },
              }
            : {}),
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
    });

    if (savedPlan) {
      const buf = Buffer.from(await savedPlan.file.arrayBuffer());
      await writeFile(path.join(UPLOAD_DIR, savedPlan.storedName), buf);
    }

    return NextResponse.json({ request: toLetterRequestDTO(created) }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Permohonan gagal disimpan.';
    console.error('POST /api/aktif-studi/register error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
