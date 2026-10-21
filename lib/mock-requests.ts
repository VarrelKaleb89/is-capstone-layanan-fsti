/**
 * Data permohonan demo (dipakai oleh prisma/seed.ts untuk mengisi database
 * dan oleh POST /api/requests/reset untuk fitur "Reset Data Demo").
 * Bentuk: sama dengan DTO LetterRequest hasil /api/requests.
 */

export interface MockRequest {
  ticketNumber: string;
  serviceType: string;
  fullName: string;
  nim: string;
  studyProgram: string;
  degree: string;
  semester: string;
  academicYear: string;
  purpose: string;
  whatsapp: string;
  email: string;
  status:
    | 'diajukan'
    | 'diverifikasi_tendik'
    | 'menunggu_pimpinan'
    | 'siap_diunduh'
    | 'ditolak';
  letterNumber?: string;
  adminNotes?: string;
  attachmentName?: string;
  parentName?: string;
  parentJob?: string;
  parentAddress?: string;
  academicDocTypes?: string[];
  targetSemester?: string;
  outputFormat?: 'digital_pdf' | 'cetak_hardcopy';
  /** Offset hari dari 2026-10-14 untuk createdAt (informal, hanya urutan). */
  createdDayOffset?: number;
}

export const MOCK_REQUESTS: MockRequest[] = [
  {
    ticketNumber: 'FSTI-AKTIF-20261015-001',
    serviceType: 'surat-aktif-studi',
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
    letterNumber: '142/IT10.FSTI/KM/2026',
    adminNotes: 'Berkas dan status akademik aktif telah diverifikasi lengkap.',
    createdDayOffset: 0,
  },
  {
    ticketNumber: 'FSTI-KP-20261015-002',
    serviceType: 'surat-pengantar-kp',
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
    letterNumber: '143/IT10.FSTI/KM/2026',
    adminNotes: 'Data pemohon valid, draft surat siap dialirkan ke pimpinan untuk pengesahan.',
    createdDayOffset: 1,
  },
  {
    ticketNumber: 'FSTI-REK-20261015-003',
    serviceType: 'surat-rekomendasi',
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
    letterNumber: '144/IT10.FSTI/KM/2026',
    adminNotes: 'Draft surat telah disiapkan tendik, menunggu persetujuan dan tanda tangan Dekan.',
    createdDayOffset: 0,
  },
  {
    ticketNumber: 'FSTI-AKTIF-20261015-004',
    serviceType: 'surat-aktif-studi',
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
    adminNotes: 'Menunggu penelaahan berkas oleh staf tendik FSTI.',
    createdDayOffset: 1,
  },
  {
    ticketNumber: 'FSTI-AKAD-20261015-005',
    serviceType: 'dokumen-akademik',
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
    letterNumber: '145/IT10.FSTI/AKAD/2026',
    adminNotes: 'Dokumen transkrip dan KHS telah diverifikasi dari pangkalan data akademik dan disahkan Dekan.',
    createdDayOffset: 0,
  },
  {
    ticketNumber: 'FSTI-AKAD-20261015-006',
    serviceType: 'dokumen-akademik',
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
    adminNotes: 'Data pemohon cocok, berkas permohonan sedang ditelaah tendik untuk dialirkan ke pimpinan.',
    createdDayOffset: 1,
  },
];
