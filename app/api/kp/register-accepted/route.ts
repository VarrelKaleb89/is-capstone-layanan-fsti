import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { toLetterRequestDTO, STATUS_LABELS } from '@/lib/request-mapper';
import { KP_ACCEPTED_DOC_RULES, hitungDurasiBulan } from '@/lib/kp-utils';
import type { FieldError } from '@/app/api/kp/register/route';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

/**
 * POST /api/kp/register-accepted
 * "Pendaftaran Setelah Diterima Kerja Praktik" — fase berikutnya setelah
 * mitra menerima mahasiswa (surat balasan mitra sudah ada di tangan).
 * UI mengikuti formulir referensi Google Forms; struktur field:
 * Nama/NIM Pemohon 1 (wajib), Pemohon 2 (opsional), Nama & Alamat Mitra,
 * Waktu Pelaksanaan KP (periode), unggah Surat Balasan Mitra + Surat Pernyataan (PDF, maks 10 MB).
 * Validasi lengkap di server; file disimpan dengan nama acak di uploads/.
 */

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const NIM_RE = /^10\d{6}$/;

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const fullName = ((form.get('fullName') as string) || '').trim();
    const nim = ((form.get('nim') as string) || '').trim();
    const pemohon2Nama = ((form.get('pemohon2Nama') as string) || '').trim();
    const pemohon2Nim = ((form.get('pemohon2Nim') as string) || '').trim();
    const mitraNama = ((form.get('mitraNama') as string) || '').trim();
    const mitraAlamat = ((form.get('mitraAlamat') as string) || '').trim();
    const periodeMulai = ((form.get('periodeMulai') as string) || '').trim();
    const periodeSelesai = ((form.get('periodeSelesai') as string) || '').trim();
    const suratBalasanNomor = ((form.get('suratBalasanNomor') as string) || '').trim();
    const suratBalasanTanggal = ((form.get('suratBalasanTanggal') as string) || '').trim();

    const errors: FieldError[] = [];

    // ---------- Validasi field ----------
    if (!fullName) errors.push({ field: 'fullName', message: 'Nama Pemohon 1 wajib diisi.' });
    if (!nim || !NIM_RE.test(nim))
      errors.push({ field: 'nim', message: 'NIM Pemohon 1 wajib diisi (format: 10XXXXXXX).' });

    // Pemohon 2 opsional — tapi jika salah satu diisi, keduanya harus diisi & valid.
    if (pemohon2Nama || pemohon2Nim) {
      if (!pemohon2Nama) errors.push({ field: 'pemohon2Nama', message: 'Nama Pemohon 2 belum lengkap.' });
      if (!pemohon2Nim || !NIM_RE.test(pemohon2Nim))
        errors.push({ field: 'pemohon2Nim', message: 'NIM Pemohon 2 wajib format 10XXXXXXX.' });
      else if (nim && nim === pemohon2Nim)
        errors.push({ field: 'pemohon2Nim', message: 'NIM Pemohon 2 tidak boleh sama dengan Pemohon 1.' });
    }

    if (!mitraNama) errors.push({ field: 'mitraNama', message: 'Nama Mitra KP wajib diisi.' });
    if (!mitraAlamat) errors.push({ field: 'mitraAlamat', message: 'Alamat Mitra KP wajib diisi.' });

    const dMulai = periodeMulai ? new Date(`${periodeMulai}T00:00:00`) : null;
    const dSelesai = periodeSelesai ? new Date(`${periodeSelesai}T00:00:00`) : null;
    if (!dMulai || Number.isNaN(dMulai.getTime()))
      errors.push({ field: 'periodeMulai', message: 'Tanggal mulai KP wajib dipilih.' });
    if (!dSelesai || Number.isNaN(dSelesai.getTime()))
      errors.push({ field: 'periodeSelesai', message: 'Tanggal selesai KP wajib dipilih.' });
    if (dMulai && dSelesai) {
      if (dSelesai < dMulai)
        errors.push({ field: 'periodeSelesai', message: 'Tanggal selesai tidak boleh lebih awal daripada tanggal mulai.' });
      else if (dSelesai.getTime() === dMulai.getTime())
        errors.push({ field: 'periodeSelesai', message: 'Periode KP minimal berdurasi 1 bulan.' });
    }

    const durasiBulan =
      dMulai && dSelesai && dSelesai > dMulai ? hitungDurasiBulan(dMulai, dSelesai) : 0;
    if (dMulai && dSelesai && dSelesai > dMulai && durasiBulan < 1)
      errors.push({ field: 'periodeSelesai', message: 'Durasi KP minimal 1 bulan penuh.' });

    if (!suratBalasanNomor)
      errors.push({ field: 'suratBalasanNomor', message: 'Nomor surat balasan mitra wajib diisi.' });
    if (!suratBalasanTanggal)
      errors.push({ field: 'suratBalasanTanggal', message: 'Tanggal surat balasan mitra wajib diisi.' });

    // ---------- Validasi file ----------
    const files: { kind: string; file: File }[] = [];
    form.forEach((value, field) => {
      if (value instanceof File && value.size > 0) {
        files.push({ kind: field, file: value });
      }
    });

    const savedPlans: { kind: string; fileName: string; storedName: string; size: number; mime: string; file: File }[] = [];
    for (const { kind, file } of files) {
      const rule = KP_ACCEPTED_DOC_RULES[kind as keyof typeof KP_ACCEPTED_DOC_RULES];
      if (!rule) continue;
      if (!(rule.accept as readonly string[]).includes(file.type)) {
        errors.push({ field: kind, message: `${rule.label}: format ${file.type || 'tidak dikenal'} tidak diizinkan (harus PDF).` });
        continue;
      }
      const maxBytes = rule.maxMB * 1024 * 1024;
      if (file.size > maxBytes) {
        errors.push({ field: kind, message: `${rule.label}: melebihi batas ${rule.maxMB} MB.` });
        continue;
      }
      const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
      const storedName = `${randomUUID()}.${ext}`;
      savedPlans.push({ kind, fileName: file.name, storedName, size: file.size, mime: file.type, file });
    }

    // Kedua dokumen wajib.
    const wajib = Object.keys(KP_ACCEPTED_DOC_RULES);
    for (const w of wajib) {
      if (!files.some((f) => f.kind === w)) {
        errors.push({ field: w, message: `${KP_ACCEPTED_DOC_RULES[w as keyof typeof KP_ACCEPTED_DOC_RULES].label} wajib diunggah.` });
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { errors, message: 'Periksa kembali isian formulir Anda.' },
        { status: 400 }
      );
    }

    // ---------- Simpan file fisik + transaksi DB ----------
    await mkdir(UPLOAD_DIR, { recursive: true });

    const letterType = await prisma.letterType.findUnique({ where: { code: 'kp-setelah-diterima' } });
    if (!letterType) {
      return NextResponse.json({ error: 'Katalog layanan belum ter-seed.' }, { status: 500 });
    }
    const created = await prisma.$transaction(async (tx) => {
      // Fase ini tidak menanyakan prodi; pertahankan data prodi yang sudah ada
      // (mahasiswa biasanya sudah terdaftar dari fase "Sebelum Diterima").
      const existingStudent = await tx.student.findUnique({ where: { nim } });
      const studyProgram = existingStudent?.studyProgram ?? '';
      const student = await tx.student.upsert({
        where: { nim },
        update: { fullName },
        create: { nim, fullName, studyProgram },
      });

      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
      const suffix = Math.floor(100 + Math.random() * 900);
      const isKelompok = Boolean(pemohon2Nama && pemohon2Nim);

      return tx.letterRequest.create({
        data: {
          ticketNumber: `${letterType.ticketPrefix}-${dateStr}-${suffix}`,
          studentId: student.id,
          letterTypeId: letterType.id,
          status: 'diajukan',
          statusLabel: STATUS_LABELS.diajukan,
          semester: '-',
          academicYear: `${dMulai!.getFullYear()}/${dMulai!.getFullYear() + 1}`,
          purpose: `Pendaftaran Setelah Diterima KP di ${mitraNama} (${durasiBulan} bulan, ${periodeMulai} s.d. ${periodeSelesai})`,
          extraData: {
            mitraNama,
            mitraAlamat,
            periodeMulai,
            periodeSelesai,
            durasiBulan,
            suratBalasanNomor,
            suratBalasanTanggal,
            pemohon2Nama: pemohon2Nama || undefined,
            pemohon2Nim: pemohon2Nim || undefined,
            registrationType: isKelompok ? 'kelompok' : 'individu',
          },
          adminNotes: 'Pendaftaran KP (setelah diterima mitra) berhasil dikirim oleh mahasiswa.',
          statusHistories: {
            create: { fromStatus: null, toStatus: 'diajukan', note: 'Pendaftaran KP fase diterima dibuat oleh mahasiswa' },
          },
          attachments: {
            create: savedPlans.map((p) => ({
              fileName: p.fileName,
              fileUrl: `uploads/${p.storedName}`,
              fileSize: BigInt(p.size),
              mimeType: p.mime,
              kind: p.kind,
            })),
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
    });

    for (const p of savedPlans) {
      const buf = Buffer.from(await p.file.arrayBuffer());
      await writeFile(path.join(UPLOAD_DIR, p.storedName), buf);
    }

    return NextResponse.json({ request: toLetterRequestDTO(created) }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Pendaftaran KP gagal disimpan.';
    console.error('POST /api/kp/register-accepted error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
