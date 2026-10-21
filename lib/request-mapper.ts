import { Prisma } from '@prisma/client';

/**
 * DTO shape identik dengan interface `LetterRequest` lama di
 * lib/letter-service.ts — semua komponen frontend tetap kompatibel.
 * Mapping: docs/db.md §7 (Field Mapping)
 */

export interface ExtraData {
  parentName?: string;
  parentJob?: string;
  parentAddress?: string;
  academicDocTypes?: string[];
  targetSemester?: string;
  outputFormat?: 'digital_pdf' | 'cetak_hardcopy';
  copiesCount?: number;
  legalizationDocs?: string[];
}

export type RequestRow = Prisma.LetterRequestGetPayload<{
  include: {
    student: true;
    letterType: true;
    verifiedBy: true;
    signedBy: true;
    attachments: true;
    survey: true;
  };
}>;

export function toLetterRequestDTO(row: RequestRow) {
  const extra = (row.extraData ?? {}) as Record<string, unknown>;
  const pickStr = (key: string): string | undefined =>
    typeof extra[key] === 'string' ? (extra[key] as string) : undefined;

  return {
    id: row.id,
    ticketNumber: row.ticketNumber,
    serviceType: row.letterType.code as string,
    serviceName: row.letterType.name,
    fullName: row.student.fullName,
    nim: row.student.nim,
    studyProgram: row.student.studyProgram,
    degree: row.student.degree,
    semester: row.semester,
    academicYear: row.academicYear,
    purpose: row.purpose,
    parentName: pickStr('parentName'),
    parentJob: pickStr('parentJob'),
    parentAddress: pickStr('parentAddress'),
    whatsapp: row.student.phone ?? '',
    email: row.student.email ?? '',
    attachmentName: row.attachments[0]?.fileName,
    academicDocTypes: Array.isArray(extra.academicDocTypes)
      ? (extra.academicDocTypes as string[])
      : undefined,
    targetSemester: pickStr('targetSemester'),
    outputFormat: (pickStr('outputFormat') as 'digital_pdf' | 'cetak_hardcopy' | undefined),
    copiesCount: typeof extra.copiesCount === 'number' ? extra.copiesCount : undefined,
    legalizationDocs: Array.isArray(extra.legalizationDocs)
      ? (extra.legalizationDocs as string[])
      : undefined,
    kpData: row.letterType.code === 'surat-pengantar-kp'
      ? {
          registrationType: (pickStr('registrationType') as 'individu' | 'kelompok') ?? 'individu',
          jurusan: pickStr('jurusan') ?? '',
          sksLulus: typeof extra.sksLulus === 'number' ? extra.sksLulus : 0,
          pemohon2Nama: pickStr('pemohon2Nama'),
          pemohon2Nim: pickStr('pemohon2Nim'),
          mitraNama: pickStr('mitraNama') ?? '',
          mitraAlamat: pickStr('mitraAlamat') ?? '',
          durasiBulan: typeof extra.durasiBulan === 'number' ? extra.durasiBulan : 0,
          periodeMulai: pickStr('periodeMulai') ?? '',
          periodeSelesai: pickStr('periodeSelesai') ?? '',
          tenggatBalasan: pickStr('tenggatBalasan'),
        }
      : undefined,
    aktifStudiData: row.letterType.code === 'surat-aktif-studi'
      ? {
          jurusan: pickStr('jurusan') ?? '',
          angkatan: pickStr('angkatan') ?? '',
          keperluan: row.purpose,
          catatanTambahan: pickStr('catatanTambahan'),
        }
      : undefined,
    kpDataAccepted: row.letterType.code === 'kp-setelah-diterima'
      ? {
          mitraNama: pickStr('mitraNama') ?? '',
          mitraAlamat: pickStr('mitraAlamat') ?? '',
          periodeMulai: pickStr('periodeMulai') ?? '',
          periodeSelesai: pickStr('periodeSelesai') ?? '',
          durasiBulan: typeof extra.durasiBulan === 'number' ? extra.durasiBulan : 0,
          suratBalasanNomor: pickStr('suratBalasanNomor'),
          suratBalasanTanggal: pickStr('suratBalasanTanggal'),
          pemohon2Nama: pickStr('pemohon2Nama'),
          pemohon2Nim: pickStr('pemohon2Nim'),
        }
      : undefined,
    attachments: row.attachments.map((a) => ({
      id: a.id,
      fileName: a.fileName,
      kind: a.kind ?? undefined,
    })),
    status: row.status,
    statusLabel: row.statusLabel,
    createdAt: formatDateTime(row.createdAt),
    updatedAt: formatDateTime(row.updatedAt),
    letterNumber: row.letterNumber,
    letterDate: row.letterDate ? formatDateIndo(row.letterDate) : undefined,
    signedBy: row.signedBy?.name,
    signedNip: row.signedBy?.nip,
    signedPosition: row.signedPosition,
    isSurveyCompleted: row.survey !== null,
    surveyRating: row.survey?.rating,
    surveyHelpfulness: row.survey?.helpfulness,
    surveyFeedback: row.survey?.feedback,
    adminNotes: row.adminNotes,
  };
}

/** Format "YYYY-MM-DD HH:mm" — sama dengan format lama di localStorage. */
export function formatDateTime(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}`;
}

const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

/** Format "15 Oktober 2026" — sama dengan format letterDate lama. */
export function formatDateIndo(date: Date): string {
  return `${date.getDate()} ${MONTHS_ID[date.getMonth()]} ${date.getFullYear()}`;
}

export const STATUS_LABELS: Record<string, string> = {
  diajukan: 'Diajukan',
  diverifikasi_tendik: 'Diverifikasi Tendik',
  menunggu_pimpinan: 'Menunggu Pengesahan Pimpinan',
  siap_diunduh: 'Siap Diunduh',
  ditolak: 'Perlu Revisi / Ditolak',
};
