/**
 * Seed awal sesuai docs/db.md (Fase F3):
 * - letter_types: katalog 5 layanan surat (menggantikan map statis di kode)
 * - users: akun demo staf tendik (L1) dan pimpinan (L2)
 *
 * Idempoten: upsert berdasarkan unique key, aman dijalankan berulang.
 * Jalankan: npx prisma db seed
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // ----- letter_types (katalog layanan) -----
  const letterTypes = [
    { code: 'surat-aktif-studi', name: 'Surat Keterangan Aktif Studi', ticketPrefix: 'FSTI-AKTIF' },
    { code: 'surat-pengantar-kp', name: 'Pendaftaran Kerja Praktik (Permohonan KP)', ticketPrefix: 'FSTI-PKP' },
    { code: 'kp-setelah-diterima', name: 'Pendaftaran Setelah Diterima Kerja Praktik', ticketPrefix: 'FSTI-PKD' },
    { code: 'dokumen-akademik', name: 'Pengesahan Dokumen Akademik', ticketPrefix: 'FSTI-AKAD' },
    { code: 'legalisasi-dokumen', name: 'Legalisasi Dokumen', ticketPrefix: 'FSTI-LEGAL' },
  ];

  for (const lt of letterTypes) {
    await prisma.letterType.upsert({
      where: { code: lt.code },
      update: { name: lt.name, ticketPrefix: lt.ticketPrefix, isActive: true },
      create: lt,
    });
  }

  // ----- users (akun demo internal) -----
  // Password demo keduanya: "demo1234" — di-hash bcryptjs saat seed agar
  // selalu valid (bukan hash statis yang bisa basi).
  const demoPasswordHash = bcrypt.hashSync('demo1234', 10);

  await prisma.user.upsert({
    where: { email: 'desy.tendik@fsti.itk.ac.id' },
    update: { passwordHash: demoPasswordHash },
    create: {
      email: 'desy.tendik@fsti.itk.ac.id',
      name: 'Desy Ratnasari',
      role: 'tendik',
      passwordHash: demoPasswordHash,
    },
  });

  await prisma.user.upsert({
    where: { email: 'dekan@fsti.itk.ac.id' },
    update: { passwordHash: demoPasswordHash },
    create: {
      email: 'dekan@fsti.itk.ac.id',
      name: 'Adi Mahmud Jaya Marindra, S.T., M.Eng., Ph.D.',
      role: 'pimpinan',
      nip: '198506152014041001',
      passwordHash: demoPasswordHash,
    },
  });

  // WD1 — penanda tangan surat permohonan KP (sesuai template PDF resmi).
  await prisma.user.upsert({
    where: { email: 'wd1.akademik@fsti.itk.ac.id' },
    update: { passwordHash: demoPasswordHash },
    create: {
      email: 'wd1.akademik@fsti.itk.ac.id',
      name: 'Irma Fitria, S.Si., M.Si.',
      role: 'pimpinan',
      nip: '199303232022032016',
      passwordHash: demoPasswordHash,
    },
  });
  console.log('Seed selesai: letter_types + users demo terbuat.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
