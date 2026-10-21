/**
 * Layanan data permohonan surat — API-backed (docs/db.md F2/F4/F5).
 * Seluruh data kini tersimpan di PostgreSQL via Prisma; fungsi-fungsi
 * di file ini adalah pembungkus (wrapper) fetch ke /api/*.
 *
 * Catatan: fungsi-fungsi ini kini ASYNC. Konsumen lama yang memanggil
 * secara sinkron harus di-update (lihat app/admin, app/tracking, app/layanan-administrasi/ajukan,
 * components/letter/*, components/survey/*).
 */

export type LetterType =
  | 'surat-aktif-studi'
  | 'surat-pengantar-kp'
  | 'kp-setelah-diterima'
  | 'surat-rekomendasi'
  | 'dokumen-akademik'
  | 'legalisasi-dokumen';

export type LetterStatus =
  | 'diajukan'
  | 'diverifikasi_tendik'
  | 'menunggu_pimpinan'
  | 'siap_diunduh'
  | 'ditolak';

export interface LetterRequest {
  id: string;
  ticketNumber: string;
  serviceType: LetterType;
  serviceName: string;
  fullName: string;
  nim: string;
  studyProgram: string;
  degree: string;
  semester: string;
  academicYear: string;
  purpose: string;
  parentName?: string;
  parentJob?: string;
  parentAddress?: string;
  whatsapp: string;
  email: string;
  attachmentName?: string;
  academicDocTypes?: string[];
  targetSemester?: string;
  outputFormat?: 'digital_pdf' | 'cetak_hardcopy';
  copiesCount?: number;
  legalizationDocs?: string[];
  status: LetterStatus;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
  letterNumber?: string;
  letterDate?: string;
  // ---- Pendaftaran Kerja Praktik ----
  kpData?: {
    registrationType: 'individu' | 'kelompok';
    jurusan: string;
    sksLulus: number;
    pemohon2Nama?: string;
    pemohon2Nim?: string;
    mitraNama: string;
    mitraAlamat: string;
    durasiBulan: number;
    periodeMulai: string;
    periodeSelesai: string;
    tenggatBalasan?: string;
  };
  aktifStudiData?: {
    jurusan: string;
    angkatan: string;
    keperluan: string;
    catatanTambahan?: string;
  };
  kpDataAccepted?: {
    mitraNama: string;
    mitraAlamat: string;
    periodeMulai: string;
    periodeSelesai: string;
    durasiBulan: number;
    suratBalasanNomor?: string;
    suratBalasanTanggal?: string;
    pemohon2Nama?: string;
    pemohon2Nim?: string;
  };
  attachments?: { id: string; fileName: string; kind?: string }[];
  signedBy?: string;
  signedNip?: string;
  signedPosition?: string;
  isSurveyCompleted: boolean;
  surveyRating?: number;
  surveyHelpfulness?: string;
  surveyFeedback?: string;
  adminNotes?: string;
}

export type NewLetterRequest = Omit<
  LetterRequest,
  | 'id'
  | 'ticketNumber'
  | 'status'
  | 'statusLabel'
  | 'createdAt'
  | 'updatedAt'
  | 'isSurveyCompleted'
>;

export function getStatusBadge(status: LetterStatus) {
  switch (status) {
    case 'diajukan':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        label: 'Diajukan (Menunggu Tendik)',
      };
    case 'diverifikasi_tendik':
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
        label: 'Diverifikasi Tendik',
      };
    case 'menunggu_pimpinan':
      return {
        bg: 'bg-purple-50 text-purple-700 border-purple-200',
        dot: 'bg-purple-500',
        label: 'Menunggu Pengesahan Pimpinan',
      };
    case 'siap_diunduh':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        label: 'Siap Diunduh',
      };
    case 'ditolak':
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
        label: 'Perlu Revisi / Ditolak',
      };
  }
}

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    throw new Error(data.error || `Request gagal (${res.status})`);
  }
  return data;
}

// ---------------------------------------------------------------------------
// Permohonan
// ---------------------------------------------------------------------------

/** Ambil semua permohonan. */
export async function getAllRequests(): Promise<LetterRequest[]> {
  const data = await apiFetch<{ requests: LetterRequest[] }>('/api/requests');
  return data.requests;
}

/** Ambil permohonan milik satu NIM. */
export async function getRequestsByNim(nim: string): Promise<LetterRequest[]> {
  const data = await apiFetch<{ requests: LetterRequest[] }>(
    `/api/requests?nim=${encodeURIComponent(nim.trim())}`
  );
  return data.requests;
}

/** Cari permohonan berdasarkan nomor tiket atau NIM (permohonan terakhir). */
export async function getRequestByTicket(
  ticketOrNim: string
): Promise<LetterRequest | undefined> {
  try {
    const data = await apiFetch<{ request: LetterRequest }>(
      `/api/requests/${encodeURIComponent(ticketOrNim.trim())}`
    );
    return data.request;
  } catch {
    return undefined;
  }
}

/** Cari permohonan berdasarkan ID. */
export async function getRequestById(id: string): Promise<LetterRequest | undefined> {
  try {
    const data = await apiFetch<{ request: LetterRequest }>(`/api/requests/${id}`);
    return data.request;
  } catch {
    return undefined;
  }
}

/** Ajukan permohonan baru (mahasiswa). */
export async function createLetterRequest(data: NewLetterRequest): Promise<LetterRequest> {
  const result = await apiFetch<{ request: LetterRequest }>('/api/requests', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return result.request;
}

/**
 * Perbarui status permohonan (alur tendik → pimpinan) + audit trail.
 * Error autentikasi (401) / otorisasi (403) diteruskan ke pemanggil
 * supaya UI bisa bereaksi (mis. memaksa logout).
 */
export async function updateLetterStatus(
  id: string,
  newStatus: LetterStatus,
  extra: Partial<LetterRequest> = {}
): Promise<LetterRequest | undefined> {
  const result = await apiFetch<{ request: LetterRequest }>(`/api/requests/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({
      status: newStatus,
      adminNotes: extra.adminNotes,
    }),
  });
  return result.request;
}

/** Perbarui nomor surat (fitur staf tendik, unik per tiket). */
export async function updateLetterNumber(
  id: string,
  letterNumber: string
): Promise<LetterRequest | undefined> {
  const result = await apiFetch<{ request: LetterRequest }>(`/api/requests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ letterNumber }),
  });
  return result.request;
}

/** Reset data demo: kembalikan database ke 6 permohonan mock. */
export async function resetToDefaultMockData(): Promise<LetterRequest[]> {
  const result = await apiFetch<{ requests: LetterRequest[] }>('/api/requests/reset', {
    method: 'POST',
  });
  return result.requests;
}

// ---------------------------------------------------------------------------
// Survei per permohonan
// ---------------------------------------------------------------------------

/** Kirim survei kepuasan untuk satu permohonan (gatekeeper modal). */
export async function submitSurveyForRequest(
  id: string,
  rating: number,
  helpfulness: string,
  feedback: string
): Promise<LetterRequest | undefined> {
  try {
    await apiFetch('/api/surveys', {
      method: 'POST',
      body: JSON.stringify({ requestId: id, rating, helpfulness, feedback }),
    });
    return await getRequestById(id);
  } catch (err: unknown) {
    console.error('submitSurveyForRequest gagal:', err);
    return undefined;
  }
}

// ---------------------------------------------------------------------------
// Survei akses umum (portal)
// ---------------------------------------------------------------------------

const ACCESS_SURVEY_FLAG = 'layanan_fsti_access_survey_completed_v1';

/**
 * Status survei akses: gabungan flag lokal (agar modal tidak muncul terus)
 * — data survei sendiri tersimpan di database saat dikirim.
 */
export function hasCompletedAccessSurvey(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(ACCESS_SURVEY_FLAG) === 'true';
  } catch {
    return false;
  }
}

export async function submitAccessSurvey(data: {
  rating: number;
  helpfulness: string;
  satisfactionAspects?: string[];
  feedback?: string;
}): Promise<void> {
  try {
    await apiFetch('/api/access-surveys', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (err: unknown) {
    // Survei tidak boleh menghalangi pengguna: gagal kirim tetap lanjut.
    console.error('submitAccessSurvey gagal:', err);
  } finally {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(ACCESS_SURVEY_FLAG, 'true');
      } catch {
        /* abaikan */
      }
    }
  }
}

export function resetAccessSurvey(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(ACCESS_SURVEY_FLAG);
    } catch {
      /* abaikan */
    }
  }
}

// ---------------------------------------------------------------------------
// Manajemen Tanda Tangan Digital Pimpinan / Dekan (docs/db.md §4.7)
// ---------------------------------------------------------------------------

export interface SignatureData {
  dataUrl: string;
  fileName: string;
  size: number;
  uploadedAt: string;
  signerName?: string;
  signerNip?: string;
  widthPercent?: number;
  offsetXPercent?: number;
  offsetYPercent?: number;
}

/** Nilai default pengaturan tampilan tanda tangan (dipakai bila field kosong). */
export const DEFAULT_SIGNATURE_LAYOUT = {
  widthPercent: 55,
  offsetXPercent: 0,
  offsetYPercent: 0,
};

/** Mengambil tanda tangan aktif pimpinan dari database, atau null. */
export async function getSignature(): Promise<SignatureData | null> {
  try {
    const data = await apiFetch<{ signature: SignatureData | null }>('/api/signatures');
    return data.signature;
  } catch (err: unknown) {
    console.error('getSignature gagal:', err);
    return null;
  }
}

/** Menyimpan tanda tangan pimpinan (menimpa yang lama bila ada). */
export async function saveSignature(data: SignatureData): Promise<SignatureData> {
  await apiFetch('/api/signatures', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return data;
}

/** Menghapus tanda tangan aktif pimpinan. */
export async function removeSignature(): Promise<void> {
  await apiFetch('/api/signatures', { method: 'DELETE' });
}
