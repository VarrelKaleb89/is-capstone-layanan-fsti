import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { toLetterRequestDTO, STATUS_LABELS } from '@/lib/request-mapper';
import { KP_DOC_RULES, hitungDurasiBulan } from '@/lib/kp-utils';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

/**
 * POST /api/kp/register
 * Pendaftaran Kerja Praktik (menggantikan alur lama yang mengarah ke gform).
 * Multipart form-data. Validasi lengkap di sisi server (blueprint §5):
 * field wajib, NIM, telepon, SKS >= 72, tipe & ukuran file, durasi vs periode.
 * Semua ditulis dalam SATU transaksi DB; file fisik disimpan di uploads/
 * dengan nama acak (tidak mempercayai nama file asli) dan hanya path-nya
 * yang disimpan ke database.
 */

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const NIM_RE = /^10\d{6}$/;
const PHONE_RE = /^(\+62|62|0)8\d{7,12}$/;
/** Error validasi per-field — dikembalikan sebagai array agar UI bisa
 *  menampilkan pesan tepat di samping field yang bermasalah. */
export interface FieldError {
  field: string;
  message: string;
}

function badField(field: string, message: string): FieldError {
  return { field, message };
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    // ---------- 1. Informasi Pemohon ----------
    const registrationType = (form.get('registrationType') as string) || 'individu';
    const fullName = ((form.get('fullName') as string) || '').trim();
    const nim = ((form.get('nim') as string) || '').trim();
    const pemohon2Nama = ((form.get('pemohon2Nama') as string) || '').trim();
    const pemohon2Nim = ((form.get('pemohon2Nim') as string) || '').trim();
    const jurusan = ((form.get('jurusan') as string) || '').trim();
    const studyProgram = ((form.get('studyProgram') as string) || '').trim();
    const whatsapp = ((form.get('whatsapp') as string) || '').trim();
    const email = ((form.get('email') as string) || '').trim();
    const sksLulus = Number(form.get('sksLulus') ?? NaN);

    // ---------- 3. Rencana Mitra KP ----------
    const mitraNama = ((form.get('mitraNama') as string) || '').trim();
    const mitraAlamat = ((form.get('mitraAlamat') as string) || '').trim();
    const periodeMulai = ((form.get('periodeMulai') as string) || '').trim();
    const periodeSelesai = ((form.get('periodeSelesai') as string) || '').trim();

    // ---------- Validasi field ----------
    const errors: FieldError[] = [];

    if (!fullName) errors.push(badField('fullName', 'Nama Pemohon 1 wajib diisi.'));
    if (!nim || !NIM_RE.test(nim))
      errors.push(badField('nim', 'NIM Pemohon 1 wajib diisi (format: 10XXXXXXX).'));
    if (!jurusan) errors.push(badField('jurusan', 'Jurusan wajib dipilih.'));
    if (!studyProgram) errors.push(badField('studyProgram', 'Program Studi wajib dipilih.'));
    if (!whatsapp || !PHONE_RE.test(whatsapp.replace(/[\s-]/g, '')))
      errors.push(badField('whatsapp', 'Nomor telepon tidak valid (contoh: 081234567890).'));
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.push(badField('email', 'Email ITK tidak valid.'));

    if (registrationType === 'kelompok') {
      if (!pemohon2Nama) errors.push(badField('pemohon2Nama', 'Nama Pemohon 2 wajib diisi untuk KP kelompok.'));
      if (!pemohon2Nim || !NIM_RE.test(pemohon2Nim))
        errors.push(badField('pemohon2Nim', 'NIM Pemohon 2 wajib diisi (format: 10XXXXXXX).'));
      if (nim && pemohon2Nim && nim === pemohon2Nim)
        errors.push(badField('pemohon2Nim', 'NIM Pemohon 2 tidak boleh sama dengan Pemohon 1.'));
    }

    // ---------- 2. Persyaratan: SKS ----------
    if (!Number.isInteger(sksLulus) || sksLulus < 72)
      errors.push(badField('sksLulus', 'Jumlah SKS lulus minimal 72 (angka bulat).'));

    // ---------- Mitra & periode ----------
    if (!mitraNama) errors.push(badField('mitraNama', 'Nama Mitra wajib diisi.'));
    if (!mitraAlamat) errors.push(badField('mitraAlamat', 'Alamat Mitra wajib diisi.'));

    const dMulai = periodeMulai ? new Date(`${periodeMulai}T00:00:00`) : null;
    const dSelesai = periodeSelesai ? new Date(`${periodeSelesai}T00:00:00`) : null;
    if (!dMulai || Number.isNaN(dMulai.getTime()))
      errors.push(badField('periodeMulai', 'Tanggal mulai KP wajib dipilih.'));
    if (!dSelesai || Number.isNaN(dSelesai.getTime()))
      errors.push(badField('periodeSelesai', 'Tanggal selesai KP wajib dipilih.'));
    if (dMulai && dSelesai) {
      if (dSelesai < dMulai)
        errors.push(badField('periodeSelesai', 'Tanggal selesai tidak boleh lebih awal daripada tanggal mulai.'));
      else if (dSelesai.getTime() === dMulai.getTime())
        errors.push(badField('periodeSelesai', 'Periode KP minimal berdurasi 1 bulan.'));
    }

    // Durasi = sumber utama, dihitung server dari periode (blueprint §4).
    const durasiBulan = dMulai && dSelesai && dSelesai > dMulai ? hitungDurasiBulan(dMulai, dSelesai) : 0;
    if (dMulai && dSelesai && dSelesai > dMulai && durasiBulan < 1)
      errors.push(badField('periodeSelesai', 'Durasi KP minimal 1 bulan penuh.'));

    // ---------- Validasi file ----------
    const files: { kind: string; file: File }[] = [];
    form.forEach((value, field) => {
      if (value instanceof File && value.size > 0) {
        files.push({ kind: field, file: value });
      }
    });

    const savedPlans: { kind: string; fileName: string; storedName: string; size: number; mime: string; file: File }[] = [];
    for (const { kind, file } of files) {
      const rule = KP_DOC_RULES[kind as keyof typeof KP_DOC_RULES];
      if (!rule) continue;
      if (!(rule.accept as readonly string[]).includes(file.type)) {
        errors.push(badField(kind, `${rule.label}: format ${file.type || 'tidak dikenal'} tidak diizinkan.`));
        continue;
      }
      const maxBytes = rule.maxMB * 1024 * 1024;
      if (file.size > maxBytes) {
        errors.push(badField(kind, `${rule.label}: melebihi batas ${rule.maxMB} MB.`));
        continue;
      }
      const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
      const storedName = `${randomUUID()}.${ext}`;
      savedPlans.push({ kind, fileName: file.name, storedName, size: file.size, mime: file.type, file });
    }

    // Dokumen wajib (pengunduran_diri opsional)
    const wajib: (keyof typeof KP_DOC_RULES)[] = ['form_kp_001', 'transkrip', 'proposal', 'persetujuan_mitra'];
    for (const w of wajib) {
      if (!files.some((f) => f.kind === w)) {
        errors.push(badField(w, `${KP_DOC_RULES[w].label} wajib diunggah.`));
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

    const letterType = await prisma.letterType.findUnique({ where: { code: 'surat-pengantar-kp' } });
    if (!letterType) {
      return NextResponse.json({ error: 'Katalog layanan KP belum ter-seed.' }, { status: 500 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const student = await tx.student.upsert({
        where: { nim },
        update: { fullName, studyProgram, phone: whatsapp, email },
        create: { nim, fullName, studyProgram, phone: whatsapp, email },
      });

      // Tenggat balasan mitra: +14 hari dari pengajuan (kebijakan default).
      const now = new Date();
      const tenggat = new Date(now);
      tenggat.setDate(tenggat.getDate() + 14);

      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
      const suffix = Math.floor(100 + Math.random() * 900);

      const created = await tx.letterRequest.create({
        data: {
          ticketNumber: `${letterType.ticketPrefix}-${dateStr}-${suffix}`,
          studentId: student.id,
          letterTypeId: letterType.id,
          status: 'diajukan',
          statusLabel: STATUS_LABELS.diajukan,
          semester: '-',
          academicYear: `${dMulai!.getFullYear()}/${dMulai!.getFullYear() + 1}`,
          purpose: `Permohonan Kerja Praktik di ${mitraNama} (${durasiBulan} bulan, ${periodeMulai} s.d. ${periodeSelesai})`,
          extraData: {
            registrationType,
            jurusan,
            sksLulus,
            pemohon2Nama: pemohon2Nama || undefined,
            pemohon2Nim: pemohon2Nim || undefined,
            mitraNama,
            mitraAlamat,
            durasiBulan,
            periodeMulai,
            periodeSelesai,
            tenggatBalasan: tenggat.toISOString().slice(0, 10),
          },
          adminNotes: 'Pendaftaran KP baru berhasil dikirim oleh mahasiswa.',
          statusHistories: {
            create: { fromStatus: null, toStatus: 'diajukan', note: 'Pendaftaran KP dibuat oleh mahasiswa' },
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
      return created;
    });

    // Tulis file fisik SETELAH transaksi DB sukses (hindari file yatim saat DB gagal).
    for (const p of savedPlans) {
      const buf = Buffer.from(await p.file.arrayBuffer());
      await writeFile(path.join(UPLOAD_DIR, p.storedName), buf);
    }

    return NextResponse.json({ request: toLetterRequestDTO(result) }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Pendaftaran KP gagal disimpan.';
    console.error('POST /api/kp/register error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
