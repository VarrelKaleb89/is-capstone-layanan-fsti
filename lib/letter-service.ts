export type LetterType = 
  | 'surat-aktif-studi' 
  | 'surat-pengantar-kp' 
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
  // Specific fields for Academic Documents (Transkrip, KHS, FRS, SKL, Legalisasi)
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
  signedBy?: string;
  signedNip?: string;
  signedPosition?: string;
  isSurveyCompleted: boolean;
  surveyRating?: number;
  surveyHelpfulness?: string;
  surveyFeedback?: string;
  adminNotes?: string;
}

const STORAGE_KEY = 'layanan_fsti_requests_v1';

// Initial realistic mock data for immediate demonstration
const INITIAL_REQUESTS: LetterRequest[] = [
  {
    id: 'req-001',
    ticketNumber: 'FSTI-AKTIF-20261015-001',
    serviceType: 'surat-aktif-studi',
    serviceName: 'Surat Keterangan Aktif Studi',
    fullName: 'Ahmad Fauzi',
    nim: '10211001',
    studyProgram: 'Informatika',
    degree: 'S1',
    semester: '7 (Tujuh)',
    academicYear: '2026/2027',
    purpose: 'Persyaratan Pengurusan BPJS Kesehatan dan Tunjangan Belajar',
    parentName: 'Bambang Sutrisno',
    parentJob: 'PNS / Guru',
    parentAddress: 'Jl. Ahmad Yani No. 45, Balikpapan',
    whatsapp: '081234567890',
    email: 'ahmad.fauzi@student.itk.ac.id',
    attachmentName: 'KRS_Semester_7_AhmadFauzi.pdf',
    status: 'siap_diunduh',
    statusLabel: 'Siap Diunduh',
    createdAt: '2026-10-14 09:15',
    updatedAt: '2026-10-15 10:30',
    letterNumber: '142/IT10.FSTI/KM/2026',
    letterDate: '15 Oktober 2026',
    signedBy: 'Adi Mahmud Jaya Marindra, S.T., M.Eng., Ph.D.',
    signedNip: '198506152014041001',
    signedPosition: 'Dekan Fakultas Sains dan Teknologi Informasi',
    isSurveyCompleted: false, // Ready to test Survey Gatekeeper!
    adminNotes: 'Berkas dan status akademik aktif telah diverifikasi lengkap.',
  },
  {
    id: 'req-002',
    ticketNumber: 'FSTI-KP-20261015-002',
    serviceType: 'surat-pengantar-kp',
    serviceName: 'Surat Pengantar Kerja Praktik (KP)',
    fullName: 'Siti Nurhaliza',
    nim: '10211045',
    studyProgram: 'Sistem Informasi',
    degree: 'S1',
    semester: '7 (Tujuh)',
    academicYear: '2026/2027',
    purpose: 'Pengantar Pelaksanaan Kerja Praktik di PT Pertamina Hulu Mahakam Balikpapan',
    whatsapp: '085298765432',
    email: 'siti.nurhaliza@student.itk.ac.id',
    attachmentName: 'Proposal_KP_SitiNurhaliza.pdf',
    status: 'diverifikasi_tendik',
    statusLabel: 'Diverifikasi Tendik',
    createdAt: '2026-10-15 08:00',
    updatedAt: '2026-10-15 11:20',
    letterNumber: '143/IT10.FSTI/KM/2026',
    letterDate: '15 Oktober 2026',
    signedBy: 'Adi Mahmud Jaya Marindra, S.T., M.Eng., Ph.D.',
    signedNip: '198506152014041001',
    signedPosition: 'Dekan Fakultas Sains dan Teknologi Informasi',
    isSurveyCompleted: false,
    adminNotes: 'Data pemohon valid, draft surat siap dialirkan ke pimpinan untuk pengesahan.',
  },
  {
    id: 'req-003',
    ticketNumber: 'FSTI-REK-20261015-003',
    serviceType: 'surat-rekomendasi',
    serviceName: 'Surat Rekomendasi Kegiatan / Beasiswa',
    fullName: 'Budi Pratama',
    nim: '10211088',
    studyProgram: 'Sains Data',
    degree: 'S1',
    semester: '5 (Lima)',
    academicYear: '2026/2027',
    purpose: 'Pemberkasan Beasiswa Indonesia Maju (BIM) Angkatan 2026',
    whatsapp: '081344556677',
    email: 'budi.pratama@student.itk.ac.id',
    attachmentName: 'Transkrip_KTM_BudiPratama.pdf',
    status: 'menunggu_pimpinan',
    statusLabel: 'Menunggu Pengesahan Pimpinan',
    createdAt: '2026-10-14 14:20',
    updatedAt: '2026-10-15 09:40',
    letterNumber: '144/IT10.FSTI/KM/2026',
    letterDate: '15 Oktober 2026',
    signedBy: 'Adi Mahmud Jaya Marindra, S.T., M.Eng., Ph.D.',
    signedNip: '198506152014041001',
    signedPosition: 'Dekan Fakultas Sains dan Teknologi Informasi',
    isSurveyCompleted: false,
    adminNotes: 'Draft surat telah disiapkan tendik, menunggu persetujuan dan tanda tangan Dekan.',
  },
  {
    id: 'req-004',
    ticketNumber: 'FSTI-AKTIF-20261015-004',
    serviceType: 'surat-aktif-studi',
    serviceName: 'Surat Keterangan Aktif Studi',
    fullName: 'Dewi Lestari',
    nim: '10211099',
    studyProgram: 'Teknik Elektro',
    degree: 'S1',
    semester: '3 (Tiga)',
    academicYear: '2026/2027',
    purpose: 'Pengajuan Lomba Inovasi Teknologi Kemendiktisaintek Nasional',
    whatsapp: '089677889900',
    email: 'dewi.lestari@student.itk.ac.id',
    attachmentName: 'Bukti_KRS_DewiLestari.pdf',
    status: 'diajukan',
    statusLabel: 'Diajukan',
    createdAt: '2026-10-15 13:10',
    updatedAt: '2026-10-15 13:10',
    isSurveyCompleted: false,
    adminNotes: 'Menunggu penelaahan berkas oleh staf tendik FSTI.',
  },
  {
    id: 'req-005',
    ticketNumber: 'FSTI-AKAD-20261015-005',
    serviceType: 'dokumen-akademik',
    serviceName: 'Permohonan Dokumen Akademik (Transkrip Nilai & KHS)',
    fullName: 'Rizky Ramadhan',
    nim: '10211050',
    studyProgram: 'Informatika',
    degree: 'S1',
    semester: '7 (Tujuh)',
    academicYear: '2026/2027',
    purpose: 'Pemberkasan Magang dan Studi Independen Bersertifikat (MSIB / MBKM Kampus Merdeka)',
    academicDocTypes: ['Transkrip Nilai Sementara (Kumulatif)', 'Kartu Hasil Studi (KHS) Semester 6'],
    targetSemester: 'Semua Semester (Kumulatif s/d Semester 6)',
    outputFormat: 'digital_pdf',
    whatsapp: '081255667788',
    email: 'rizky.ramadhan@student.itk.ac.id',
    attachmentName: 'KTM_Dan_KRS_RizkyRamadhan.pdf',
    status: 'siap_diunduh',
    statusLabel: 'Siap Diunduh',
    createdAt: '2026-10-14 11:00',
    updatedAt: '2026-10-15 14:15',
    letterNumber: '145/IT10.FSTI/AKAD/2026',
    letterDate: '15 Oktober 2026',
    signedBy: 'Adi Mahmud Jaya Marindra, S.T., M.Eng., Ph.D.',
    signedNip: '198506152014041001',
    signedPosition: 'Dekan Fakultas Sains dan Teknologi Informasi',
    isSurveyCompleted: false,
    adminNotes: 'Dokumen transkrip dan KHS telah diverifikasi dari pangkalan data akademik dan disahkan Dekan.',
  },
  {
    id: 'req-006',
    ticketNumber: 'FSTI-AKAD-20261015-006',
    serviceType: 'dokumen-akademik',
    serviceName: 'Permohonan Dokumen Akademik (KHS & FRS)',
    fullName: 'Nadia Putri Rahmawati',
    nim: '10221012',
    studyProgram: 'Sistem Informasi',
    degree: 'S1',
    semester: '5 (Lima)',
    academicYear: '2026/2027',
    purpose: 'Pengajuan Beasiswa Djarum Plus & Asuransi Pendidikan',
    academicDocTypes: ['Kartu Hasil Studi (KHS)', 'Formulir Rencana Studi (FRS)'],
    targetSemester: 'Semester Genap 2025/2026',
    outputFormat: 'digital_pdf',
    whatsapp: '082199887766',
    email: 'nadia.putri@student.itk.ac.id',
    attachmentName: 'KTM_NadiaPutri.pdf',
    status: 'diverifikasi_tendik',
    statusLabel: 'Diverifikasi Tendik',
    createdAt: '2026-10-15 10:20',
    updatedAt: '2026-10-15 11:45',
    isSurveyCompleted: false,
    adminNotes: 'Data pemohon cocok, berkas permohonan sedang ditelaah tendik untuk dialirkan ke pimpinan.',
  }
];

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

export function getAllRequests(): LetterRequest[] {
  if (typeof window === 'undefined') return INITIAL_REQUESTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REQUESTS));
      return INITIAL_REQUESTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse requests from storage', err);
    return INITIAL_REQUESTS;
  }
}

export function getRequestsByNim(nim: string): LetterRequest[] {
  const all = getAllRequests();
  const cleanNim = nim.trim().toLowerCase();
  return all.filter((r) => r.nim.toLowerCase() === cleanNim);
}

export function getRequestByTicket(ticketOrNim: string): LetterRequest | undefined {
  const all = getAllRequests();
  const clean = ticketOrNim.trim().toLowerCase();
  return all.find(
    (r) => r.ticketNumber.toLowerCase() === clean || r.nim.toLowerCase() === clean
  );
}

export function getRequestById(id: string): LetterRequest | undefined {
  const all = getAllRequests();
  return all.find((r) => r.id === id);
}

export function createLetterRequest(
  data: Omit<
    LetterRequest,
    | 'id'
    | 'ticketNumber'
    | 'status'
    | 'statusLabel'
    | 'createdAt'
    | 'updatedAt'
    | 'isSurveyCompleted'
  >
): LetterRequest {
  const all = getAllRequests();
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  
  const prefixMap: Record<LetterType, string> = {
    'surat-aktif-studi': 'FSTI-AKTIF',
    'surat-pengantar-kp': 'FSTI-KP',
    'surat-rekomendasi': 'FSTI-REK',
    'dokumen-akademik': 'FSTI-AKAD',
    'legalisasi-dokumen': 'FSTI-LEGAL',
  };

  const ticketNumber = `${prefixMap[data.serviceType] || 'FSTI'}-${dateStr}-${randomSuffix}`;
  const id = `req-${Date.now()}`;

  const timeFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const newRequest: LetterRequest = {
    ...data,
    id,
    ticketNumber,
    status: 'diajukan',
    statusLabel: 'Diajukan',
    createdAt: timeFormatted,
    updatedAt: timeFormatted,
    isSurveyCompleted: false,
    adminNotes: 'Permohonan baru berhasil dikirim oleh mahasiswa.',
  };

  const updatedList = [newRequest, ...all];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  }
  return newRequest;
}

export function updateLetterStatus(
  id: string,
  newStatus: LetterStatus,
  extra: Partial<LetterRequest> = {}
): LetterRequest | undefined {
  const all = getAllRequests();
  const index = all.findIndex((r) => r.id === id);
  if (index === -1) return undefined;

  const now = new Date();
  const timeFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const labelMap: Record<LetterStatus, string> = {
    diajukan: 'Diajukan',
    diverifikasi_tendik: 'Diverifikasi Tendik',
    menunggu_pimpinan: 'Menunggu Pengesahan Pimpinan',
    siap_diunduh: 'Siap Diunduh',
    ditolak: 'Perlu Revisi / Ditolak',
  };

  const updated: LetterRequest = {
    ...all[index],
    ...extra,
    status: newStatus,
    statusLabel: labelMap[newStatus],
    updatedAt: timeFormatted,
  };

  // If status is moved to siap_diunduh or approved, ensure letter metadata
  if (newStatus === 'siap_diunduh' || newStatus === 'menunggu_pimpinan') {
    if (!updated.letterNumber) {
      const serial = Math.floor(140 + Math.random() * 50);
      updated.letterNumber = `${serial}/IT10.FSTI/KM/${now.getFullYear()}`;
    }
    if (!updated.letterDate) {
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      updated.letterDate = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    }
    if (!updated.signedBy) {
      updated.signedBy = 'Adi Mahmud Jaya Marindra, S.T., M.Eng., Ph.D.';
      updated.signedNip = '198506152014041001';
      updated.signedPosition = 'Dekan Fakultas Sains dan Teknologi Informasi';
    }
  }

  all[index] = updated;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }
  return updated;
}

export function submitSurveyForRequest(
  id: string,
  rating: number,
  helpfulness: string,
  feedback: string
): LetterRequest | undefined {
  const all = getAllRequests();
  const index = all.findIndex((r) => r.id === id);
  if (index === -1) return undefined;

  all[index] = {
    ...all[index],
    isSurveyCompleted: true,
    surveyRating: rating,
    surveyHelpfulness: helpfulness,
    surveyFeedback: feedback,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }
  return all[index];
}

const GENERAL_SURVEY_KEY = 'layanan_fsti_access_survey_completed_v1';

export function hasCompletedAccessSurvey(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(GENERAL_SURVEY_KEY) === 'true';
  } catch {
    return false;
  }
}

export function submitAccessSurvey(data: {
  rating: number;
  helpfulness: string;
  satisfactionAspects?: string[];
  feedback?: string;
}): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(GENERAL_SURVEY_KEY, 'true');
    localStorage.setItem('layanan_fsti_access_survey_data', JSON.stringify({
      ...data,
      submittedAt: new Date().toISOString(),
    }));
  }
}

export function resetAccessSurvey(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(GENERAL_SURVEY_KEY);
    localStorage.removeItem('layanan_fsti_access_survey_data');
  }
}

export function resetToDefaultMockData(): LetterRequest[] {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REQUESTS));
  }
  return INITIAL_REQUESTS;
}

// ---------------------------------------------------------------------------
// Manajemen Tanda Tangan Digital Pimpinan / Dekan
// Tanda tangan diunggah sekali sebagai gambar PNG (base64 data URL) dan
// otomatis ditempelkan ke setiap surat resmi yang disahkan pimpinan.
// ---------------------------------------------------------------------------

const SIGNATURE_KEY = 'layanan_fsti_pimpinan_signature_v1';

export interface SignatureData {
  /** Data URL (data:image/png;base64,...) dari gambar tanda tangan. */
  dataUrl: string;
  /** Nama file asli yang diunggah, untuk ditampilkan di panel. */
  fileName: string;
  /** Ukuran file dalam byte. */
  size: number;
  /** Waktu unggah (ISO string). */
  uploadedAt: string;
  /** Nama pejabat penanda tangan. */
  signerName?: string;
  /** NIP pejabat penanda tangan. */
  signerNip?: string;
  /** Lebar tanda tangan dalam persen (%) terhadap area tanda tangan. Default 55. */
  widthPercent?: number;
  /** Geser horizontal dalam persen (%) relatif terhadap tengah area. Negatif = kiri. Default 0. */
  offsetXPercent?: number;
  /** Geser vertikal dalam persen (%) relatif terhadap tengah area. Negatif = atas. Default 0. */
  offsetYPercent?: number;
}

/** Nilai default pengaturan tampilan tanda tangan (dipakai bila field kosong). */
export const DEFAULT_SIGNATURE_LAYOUT = {
  widthPercent: 55,
  offsetXPercent: 0,
  offsetYPercent: 0,
};

/** Mengambil tanda tangan pimpinan yang tersimpan, atau null jika belum ada. */
export function getSignature(): SignatureData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SIGNATURE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SignatureData;
  } catch (err) {
    console.error('Failed to parse signature from storage', err);
    return null;
  }
}

/** Menyimpan tanda tangan pimpinan (menimpa yang lama bila ada). */
export function saveSignature(data: SignatureData): SignatureData {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SIGNATURE_KEY, JSON.stringify(data));
  }
  return data;
}

/** Menghapus tanda tangan pimpinan yang tersimpan. */
export function removeSignature(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SIGNATURE_KEY);
  }
}
