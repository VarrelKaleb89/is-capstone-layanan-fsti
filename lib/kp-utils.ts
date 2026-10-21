/**
 * Helpers spesifik Pendaftaran Kerja Praktik (KP):
 * - perhitungan durasi bulan kalender (bukan asumsi 30 hari),
 * - format tanggal locale Indonesia,
 * - katalog dokumen persyaratan & batas ukurannya.
 */

export const KP_DOC_RULES = {
  form_kp_001: { label: 'Formulir Pendaftaran KP (Form KP-001)', maxMB: 10, accept: ['application/pdf'] },
  transkrip: { label: 'Fotokopi Transkrip Nilai (disahkan/legalisir)', maxMB: 10, accept: ['application/pdf'] },
  proposal: { label: 'Proposal KP (disahkan Dosen Pembimbing & Koorpro)', maxMB: 1, accept: ['application/pdf'] },
  persetujuan_mitra: { label: 'Screenshot Persetujuan Mitra / Surat Khusus', maxMB: 10, accept: ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'] },
  pengunduran_diri: { label: 'Surat Pengunduran Diri dari Mitra Sebelumnya', maxMB: 10, accept: ['application/pdf'] },
} as const;

/** Dokumen fase "Pendaftaran Setelah Diterima KP" (blueprint UI Google Forms). */
export const KP_ACCEPTED_DOC_RULES = {
  surat_balasan: { label: 'Unggah surat balasan dari Mitra KP', maxMB: 10, accept: ['application/pdf'] },
  surat_pernyataan: { label: 'Unggah Surat Pernyataan', maxMB: 10, accept: ['application/pdf'] },
} as const;

export type KpAcceptedDocKind = keyof typeof KP_ACCEPTED_DOC_RULES;

/** Field teks yang wajib ada pada pengajuan KP. */
export interface KpExtraData {
  registrationType?: 'individu' | 'kelompok';
  jurusan?: string;
  sksLulus?: number;
  pemohon2Nama?: string;
  pemohon2Nim?: string;
  mitraNama?: string;
  mitraAlamat?: string;
  durasiBulan?: number;
  periodeMulai?: string; // ISO date (yyyy-mm-dd)
  periodeSelesai?: string; // ISO date
  tenggatBalasan?: string; // ISO date
}

/**
 * Durasi antara dua tanggal dalam BULAN KALENDER penuh (locale-aware),
 * bukan asumsi 30 hari — sesuai blueprint §4.
 * Contoh: 1 Jan – 31 Mar = 2 bulan penuh (belum genap 3).
 */
export function hitungDurasiBulan(mulai: Date, selesai: Date): number {
  let months =
    (selesai.getFullYear() - mulai.getFullYear()) * 12 +
    (selesai.getMonth() - mulai.getMonth());
  // Koreksi: tanggal "selesai" belum melewati hari yang sama bulan depan → belum bulan penuh
  if (selesai.getDate() < mulai.getDate()) months -= 1;
  return Math.max(0, months);
}

const BULAN_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

/** "2026-01-01" → "1 Januari 2026" (locale Indonesia, blueprint §4). */
export function formatTanggalIndo(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${BULAN_ID[d.getMonth()]} ${d.getFullYear()}`;
}

/** Gabungan periode: "1 Januari 2026 s.d. 30 Maret 2026". */
export function formatPeriodeIndo(mulai?: string, selesai?: string): string {
  if (!mulai || !selesai) return '-';
  return `${formatTanggalIndo(mulai)} s.d. ${formatTanggalIndo(selesai)}`;
}

/**
 * Jurusan & Program Studi resmi FSTI ITK (satu-satunya sumber untuk semua
 * dropdown jurusan/prodi di form-form pendaftaran).
 */
export const JURUSAN_PRODI: Record<string, string[]> = {
  'Sains dan Analitika Data': ['Matematika', 'Ilmu Aktuaria', 'Statistika', 'Fisika'],
  'Teknik Elektro, Informatika, dan Bisnis': [
    'Informatika',
    'Sistem Informasi',
    'Bisnis Digital',
    'Elektro',
    'Teknik Biomedis',
  ],
};

/** Seluruh prodi FSTI (flat) — untuk dropdown prodi tunggal. */
export const ALL_PRODI: string[] = Object.values(JURUSAN_PRODI).flat();

/** Nama bulan pendek Indonesia — untuk rentang gaya "6 Juli - 11 September 2026"
 *  sesuai template surat Diterima KP. */
export const BULAN_PENDEK_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

/** Rentang periode gaya template: "6 Juli - 11 September 2026". */
export function formatRentangBulanIndo(mulai: string, selesai: string): string {
  const a = new Date(`${mulai}T00:00:00`);
  const b = new Date(`${selesai}T00:00:00`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return `${mulai} - ${selesai}`;
  const awal = `${a.getDate()} ${BULAN_PENDEK_ID[a.getMonth()]}`;
  const akhir = `${b.getDate()} ${BULAN_PENDEK_ID[b.getMonth()]} ${b.getFullYear()}`;
  return `${awal} - ${akhir}`;
}
