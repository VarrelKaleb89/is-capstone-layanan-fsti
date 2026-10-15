"use client";

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import SectionDivider from '@/components/ui/SectionDivider';
import { Search, Download, ExternalLink, FileText, TrendingUp, FileType } from 'lucide-react';

// Encode URL file (menangani spasi & kurung siku pada nama file)
const encodeFileUrl = (url: string) =>
  encodeURI(url).replace(/\[/g, '%5B').replace(/\]/g, '%5D');

type LocalizedText = { id: string; en: string };

interface DocItem {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  fileName?: string;
  fileUrl: string;
  coverImage: string;
  fileSize?: string;
  downloads?: number;
  badge?: string;
  files?: { label: LocalizedText; fileUrl: string }[];
}

// Daftar dokumen peraturan dan kebijakan
const documentsList: DocItem[] = [
  {
    id: 'akademik',
    title: {
      id: 'Akademik',
      en: 'Academic',
    },
    description: {
      id: 'Panduan dan peraturan akademik untuk mahasiswa FSTI ITK (Peraturan Nomor 4 Tahun 2025 dan Peraturan Nomor 9 Tahun 2024)',
      en: 'Academic guidelines and regulations for FSTI ITK students (Regulation Number 4 of 2025 and Regulation Number 9 of 2024)',
    },
    fileName: 'PERATURAN-AKADEMIK.pdf',
    fileUrl: '/file/PERATURAN-AKADEMIK.pdf',
    coverImage: 'https://picsum.photos/seed/akademik/800/600',
    fileSize: '2.1 MB',
    downloads: 3245,
  },
  {
    id: 'kemahasiswaan',
    title: {
      id: 'Kemahasiswaan',
      en: 'Student Affairs',
    },
    description: {
      id: 'Panduan kegiatan, organisasi, dan peraturan kemahasiswaan',
      en: 'Guidelines for activities, organizations, and student regulations',
    },
    fileName: 'KEMAHASISWAAN.pdf',
    fileUrl: '/file/KEMAHASISWAAN.pdf',
    coverImage: 'https://picsum.photos/seed/kemahasiswaan/800/600',
    fileSize: '1.8 MB',
    downloads: 2891,
  },
  {
    id: 'biayaPendidikan',
    title: {
      id: 'Biaya Pendidikan Mahasiswa',
      en: 'Student Tuition Fees',
    },
    description: {
      id: 'Informasi lengkap mengenai biaya pendidikan, UKT, dan komponen biaya lainnya untuk mahasiswa ITK',
      en: 'Complete information about tuition fees, UKT, and other fee components for ITK students',
    },
    fileName: 'BIAYA-PENDIDIKAN.pdf',
    fileUrl: '/file/BIAYA-PENDIDIKAN.pdf',
    coverImage: 'https://picsum.photos/seed/biaya/800/600',
    fileSize: '1.5 MB',
    downloads: 4567,
  },
  {
    id: 'tugasAkhir',
    title: {
      id: 'Tugas Akhir',
      en: 'Final Project',
    },
    description: {
      id: 'Panduan pelaksanaan dan penulisan Tugas Akhir mahasiswa',
      en: 'Guidelines for implementation and writing of student Final Projects',
    },
    fileUrl: '/file/A-Panduan Tugas Akhir/[2025] A PEDOMAN PELAKSANAAN TUGAS AKHIR ITK.pdf',
    coverImage: '/images/docs/tugas-akhir.jpg',
    fileSize: 'PDF',
    downloads: 5123,
    badge: 'New',
    files: [
      {
        label: { id: 'Pedoman Pelaksanaan', en: 'Implementation Guidelines' },
        fileUrl: '/file/A-Panduan Tugas Akhir/[2025] A PEDOMAN PELAKSANAAN TUGAS AKHIR ITK.pdf',
      },
      {
        label: { id: 'Panduan Kepenulisan', en: 'Writing Guidelines' },
        fileUrl: '/file/A-Panduan Tugas Akhir/[2025] B PANDUAN KEPENULISAN TUGAS AKHIR ITK.pdf',
      },
    ],
  },
  {
    id: 'magang',
    title: {
      id: 'Magang',
      en: 'Internship',
    },
    description: {
      id: 'Panduan pelaksanaan dan pelaporan kegiatan Magang',
      en: 'Guidelines for implementation and reporting of Internship activities',
    },
    fileName: 'MAGANG.pdf',
    fileUrl: '/file/MAGANG.pdf',
    coverImage: '/images/docs/magang.jpg',
    fileSize: '1.9 MB',
    downloads: 3678,
  },
  {
    id: 'kerjaPraktik',
    title: {
      id: 'Kerja Praktik',
      en: 'Practical Work',
    },
    description: {
      id: 'Panduan pelaksanaan dan pelaporan kegiatan Kerja Praktik',
      en: 'Guidelines for implementation and reporting of Practical Work activities',
    },
    fileUrl: '/file/B-Panduan Kerja Praktik/[2025] A PANDUAN KERJA PRAKTIK ITK.pdf',
    coverImage: '/images/docs/kerja-praktik.jpg',
    fileSize: 'PDF',
    downloads: 2934,
    badge: 'New',
  },
  {
    id: 'mbkm',
    title: {
      id: 'MBKM',
      en: 'MBKM',
    },
    description: {
      id: 'Panduan Merdeka Belajar Kampus Merdeka (MBKM) FSTI ITK',
      en: 'Independent Learning Campus (MBKM) guidelines for FSTI ITK',
    },
    fileName: 'MBKM.pdf',
    fileUrl: '/file/MBKM.pdf',
    coverImage: 'https://picsum.photos/seed/mbkm/800/600',
    fileSize: '2.5 MB',
    downloads: 4012,
  },
  {
    id: 'tataKehidupan',
    title: {
      id: 'Tata Kehidupan Kampus',
      en: 'Campus Life Code',
    },
    description: {
      id: 'Pedoman tata kehidupan dan etika di lingkungan kampus',
      en: 'Guidelines for campus life and ethics',
    },
    fileName: 'TATA-KEHIDUPAN.pdf',
    fileUrl: '/file/TATA-KEHIDUPAN.pdf',
    coverImage: 'https://picsum.photos/seed/tatakehidupan/800/600',
    fileSize: '1.7 MB',
    downloads: 2456,
  },
  {
    id: 'kalenderAkademik',
    title: {
      id: 'Kalender Akademik',
      en: 'Academic Calendar',
    },
    description: {
      id: 'Jadwal kegiatan akademik selama tahun ajaran',
      en: 'Schedule of academic activities throughout the academic year',
    },
    fileName: 'KALENDER-AKADEMIK.pdf',
    fileUrl: '/file/KALENDER-AKADEMIK.pdf',
    coverImage: 'https://picsum.photos/seed/kalender/800/600',
    fileSize: '1.2 MB',
    downloads: 6789,
  },
  // ============= 8 FILE BARU (dengan badge "New") =============
  {
    id: 'pembelajaranDiluarProdi',
    title: {
      id: 'Pembelajaran di Luar Program Studi',
      en: 'Learning Outside Study Program',
    },
    description: {
      id: 'Panduan pembelajaran di luar program studi untuk memperluas wawasan dan kompetensi mahasiswa',
      en: 'Guidelines for learning outside the study program to broaden student insights and competencies',
    },
    fileUrl: '/file/C-Panduan Pembelajaran di Luar Program Studi/[2025] 1 BUKU PANDUAN PEMBELAJARAN DI LUAR PROGRAM STUDI INSTITUT TEKNOLOGI KALIMANTAN.pdf',
    coverImage: '/images/docs/pembelajaran-diluar-prodi.jpg',
    fileSize: '2.2 MB',
    downloads: 156,
    badge: 'New',
  },
  {
    id: 'magangRiset',
    title: {
      id: 'Magang Riset',
      en: 'Research Internship',
    },
    description: {
      id: 'Panduan pelaksanaan magang riset untuk mahasiswa yang ingin mengembangkan kemampuan penelitian',
      en: 'Guidelines for research internships for students who want to develop research skills',
    },
    fileUrl: '/file/C-Panduan Pembelajaran di Luar Program Studi/[2025] 2 BUKU PANDUAN MAGANG RISET INSTITUT TEKNOLOGI KALIMANTAN.pdf',
    coverImage: '/images/docs/magang-riset.jpg',
    fileSize: '1.9 MB',
    downloads: 203,
    badge: 'New',
  },
  {
    id: 'kknTematik',
    title: {
      id: 'Kuliah Kerja Nyata Tematik',
      en: 'Thematic Community Service',
    },
    description: {
      id: 'Panduan pelaksanaan KKN Tematik sebagai bentuk pengabdian kepada masyarakat',
      en: 'Guidelines for implementing Thematic Community Service as a form of service to the community',
    },
    fileUrl: '/file/C-Panduan Pembelajaran di Luar Program Studi/[2025] 3 BUKU PANDUAN KULIAH KERJA NYATA TEMATIK INSTITUT TEKNOLOGI KALIMANTAN.pdf',
    coverImage: '/images/docs/kkn-tematik.jpg',
    fileSize: '2.4 MB',
    downloads: 178,
    badge: 'New',
  },
  {
    id: 'pertukaranMahasiswa',
    title: {
      id: 'Pertukaran Mahasiswa',
      en: 'Student Exchange',
    },
    description: {
      id: 'Panduan program pertukaran mahasiswa untuk pengalaman belajar di institusi lain',
      en: 'Guidelines for student exchange programs for learning experiences at other institutions',
    },
    fileUrl: '/file/C-Panduan Pembelajaran di Luar Program Studi/[2025] 4 BUKU PANDUAN PERTUKARAN MAHASISWA INSTITUT TEKNOLOGI KALIMANTAN.pdf',
    coverImage: '/images/docs/pertukaran-mahasiswa.jpg',
    fileSize: '2.1 MB',
    downloads: 234,
    badge: 'New',
  },
  {
    id: 'kewirausahaan',
    title: {
      id: 'Kewirausahaan',
      en: 'Entrepreneurship',
    },
    description: {
      id: 'Panduan kegiatan kewirausahaan untuk mengembangkan jiwa entrepreneur mahasiswa',
      en: 'Entrepreneurship guidelines to develop student entrepreneurial spirit',
    },
    fileUrl: '/file/C-Panduan Pembelajaran di Luar Program Studi/[2025] 5 BUKU PANDUAN KEWIRAUSAHAAN INSTITUT TEKNOLOGI KALIMANTAN.pdf',
    coverImage: '/images/docs/kewirausahaan.jpg',
    fileSize: '1.8 MB',
    downloads: 289,
    badge: 'New',
  },
  {
    id: 'magangKeprofesian',
    title: {
      id: 'Magang Keprofesian',
      en: 'Professional Internship',
    },
    description: {
      id: 'Panduan magang keprofesian untuk pengalaman kerja di bidang profesi tertentu',
      en: 'Professional internship guidelines for work experience in specific professional fields',
    },
    fileUrl: '/file/C-Panduan Pembelajaran di Luar Program Studi/[2025] 6 BUKU PANDUAN MAGANG KEPROFESIAN INSTITUT TEKNOLOGI KALIMANTAN.pdf',
    coverImage: '/images/docs/magang-keprofesian.jpg',
    fileSize: '2.0 MB',
    downloads: 167,
    badge: 'New',
  },
  {
    id: 'proyekKemanusiaan',
    title: {
      id: 'Proyek Kemanusiaan',
      en: 'Humanitarian Project',
    },
    description: {
      id: 'Panduan proyek kemanusiaan untuk berkontribusi dalam isu-isu sosial dan kemanusiaan',
      en: 'Humanitarian project guidelines to contribute to social and humanitarian issues',
    },
    fileUrl: '/file/C-Panduan Pembelajaran di Luar Program Studi/[2025] 7 BUKU PANDUAN PROYEK KEMANUSIAAN INSTITUT TEKNOLOGI KALIMANTAN.pdf',
    coverImage: '/images/docs/proyek-kemanusiaan.jpg',
    fileSize: '2.3 MB',
    downloads: 145,
    badge: 'New',
  },
  {
    id: 'studiProyekIndependen',
    title: {
      id: 'Studi Proyek Independen',
      en: 'Independent Project Study',
    },
    description: {
      id: 'Panduan studi proyek independen untuk mengembangkan proyek secara mandiri',
      en: 'Independent project study guidelines to develop projects independently',
    },
    fileUrl: '/file/C-Panduan Pembelajaran di Luar Program Studi/[2025] 8 BUKU PANDUAN STUDI PROYEK INDEPENDEN INSTITUT TEKNOLOGI KALIMANTAN.pdf',
    coverImage: '/images/docs/studi-proyek-independen.jpg',
    fileSize: '2.2 MB',
    downloads: 198,
    badge: 'New',
  },
  {
    id: 'inovasiSosial',
    title: {
      id: 'Inovasi Sosial',
      en: 'Social Innovation',
    },
    description: {
      id: 'Panduan inovasi sosial untuk mendorong kontribusi mahasiswa terhadap pemecahan masalah di masyarakat',
      en: 'Social innovation guidelines to encourage student contributions to solving problems in society',
    },
    fileUrl: '/file/D-Panduan Inovasi Sosial/[2026] PANDUAN INOVASI SOSIAL TAHUN 2026 INSTITUT TEKNOLOGI KAILIMANTAN.pdf',
    coverImage: '/images/docs/pertukaran-mahasiswa.jpg',
    fileSize: 'PDF',
    downloads: 0,
    badge: 'New',
  },
];

const PeraturanKebijakanPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { language } = useLanguage();

  // Filter dokumen berdasarkan pencarian
  const filteredDocuments = documentsList.filter(doc => {
    const searchLower = searchTerm.toLowerCase();
    return doc.title[language as 'id' | 'en'].toLowerCase().includes(searchLower) ||
      doc.description[language as 'id' | 'en'].toLowerCase().includes(searchLower);
  });

  return (
    <MainLayout>
      {/* Header Section dengan Animated Gradient Background */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="slideUp">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-gradient">
                {language === 'id' ? 'Peraturan, Kebijakan, dan Panduan Mahasiswa' : 'Regulations, Policies, and Student Guidelines'}
              </h1>
              <p className="text-gray-700 text-lg mb-10">
                {language === 'id'
                  ? 'Dokumen-dokumen terkait aturan dan panduan untuk aktifitas mahasiswa di lingkungan FSTI'
                  : 'Documents related to rules and guidelines for student activities within FSTI'}
              </p>

            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Divider: Hero → Dokumen Grid */}
      <SectionDivider type="tilt" fillColor="#f8fafc" bgColor="transparent" />

      {/* Dokumen Grid Section - GLASSMORPHISM WITH FULL BACKGROUND IMAGE */}
      <section className="relative py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="slideUp">
            <h2 className="text-3xl font-display font-bold text-center mb-12 text-gradient">
              {language === 'id' ? 'Daftar Dokumen' : 'Document List'}
            </h2>
          </AnimatedSection>

          {/* Search (Dipindahkan dari atas untuk konsistensi UI) */}
          <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-6 mb-10 mt-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={language === 'id' ? 'Cari dokumen...' : 'Search documents...'}
                className="w-full bg-gray-50 text-gray-800 py-3 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {searchTerm && (
              <div className="mt-3 text-sm text-gray-600 font-medium">
                {filteredDocuments.length} {language === 'id' ? 'dokumen ditemukan' : 'documents found'}
              </div>
            )}
          </div>

          {filteredDocuments.length > 0 ? (
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((doc, index) => (
                  <AnimatedSection
                    key={doc.id}
                    animation="slideUp"
                    delay={index * 0.05}
                  >
                    {/* GLASSMORPHISM CARD WITH FULL BACKGROUND IMAGE */}
                    <div className="group relative h-full">
                      {/* Background blur effect */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>

                      <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">

                        {/* Background Image Header */}
                        <div className="relative h-48 overflow-hidden bg-gray-50">
                          {/* Main Image */}
                          <img
                            src={doc.coverImage}
                            alt={doc.title[language as 'id' | 'en']}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              // Fallback ke gambar base64 SVG jika gagal
                              const target = e.target as HTMLImageElement;
                              target.onerror = null; // Prevent infinite loop
                              target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22600%22%20viewBox%3D%220%200%20800%20600%22%3E%3Crect%20fill%3D%22%23e2e8f0%22%20width%3D%22800%22%20height%3D%22600%22%2F%3E%3Ctext%20fill%3D%22%2394a3b8%22%20font-family%3D%22sans-serif%22%20font-size%3D%2230%22%20dy%3D%2210.5%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3EDokumen%3C%2Ftext%3E%3C%2Fsvg%3E';
                            }}
                          />

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                          {/* Badge "New" */}
                          {doc.badge && (
                            <div className="absolute top-4 right-4 z-10">
                              <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm animate-pulse">
                                {doc.badge}
                              </span>
                            </div>
                          )}

                          {/* Icon floating bottom left */}
                          <div className="absolute bottom-4 left-4 z-10">
                            <div className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <FileText className="h-7 w-7 text-primary-600" />
                            </div>
                          </div>
                        </div>

                        {/* Content with glass effect */}
                        <div className="p-6 bg-white/80 backdrop-blur-sm flex-grow">
                          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                            {doc.title[language as 'id' | 'en']}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {doc.description[language as 'id' | 'en']}
                          </p>

                          {/* Stats */}
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              <span>{doc.downloads ? doc.downloads : 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FileType className="h-3 w-3" />
                              <span>{doc.fileSize || 'PDF'}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          {doc.files && doc.files.length > 0 ? (
                            <div className="flex flex-col gap-2 mt-auto">
                              {doc.files.map((file, fileIdx) => (
                                <button
                                  key={fileIdx}
                                  onClick={() => window.open(encodeFileUrl(file.fileUrl), '_blank')}
                                  className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white hover:border-primary-500 hover:bg-primary-50 transition-all text-left group/file"
                                >
                                  <span className="text-sm font-medium text-gray-700 group-hover/file:text-primary-700 line-clamp-1">
                                    {file.label[language as 'id' | 'en']}
                                  </span>
                                  <Download className="h-4 w-4 text-primary-600 flex-shrink-0" />
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="flex gap-2 mt-auto">
                              <button
                                onClick={() => window.open(encodeFileUrl(doc.fileUrl), '_blank')}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 text-white hover:from-primary-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                              >
                                <Download className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  {language === 'id' ? 'Unduh' : 'Download'}
                                </span>
                              </button>
                              <button
                                onClick={() => window.open(encodeFileUrl(doc.fileUrl), '_blank')}
                                className="p-2.5 rounded-xl border-2 border-gray-200 bg-white hover:border-primary-500 hover:bg-primary-50 transition-all"
                              >
                                <ExternalLink className="h-4 w-4 text-gray-600" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          ) : (
            <AnimatedSection animation="fadeIn">
              <div className="text-center py-12">
                <div className="mb-6 text-gray-500">
                  <Search className="h-16 w-16 mx-auto opacity-30 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {language === 'id' ? 'Tidak Ditemukan' : 'Not Found'}
                  </h3>
                  <p>
                    {language === 'id'
                      ? 'Tidak ada dokumen yang sesuai dengan pencarian Anda.'
                      : 'No documents match your search.'}
                  </p>
                </div>
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {language === 'id' ? 'Reset Pencarian' : 'Reset Search'}
                </button>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="relative py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection animation="slideUp">
              <div className="bg-gradient-to-r from-primary-50/90 to-purple-50/90 backdrop-blur-sm rounded-xl p-8 shadow-md border border-primary-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  {language === 'id' ? '💡 Informasi Penting' : '💡 Important Information'}
                </h3>
                <div className="text-gray-700 space-y-4 leading-relaxed">
                  <p>
                    {language === 'id'
                      ? 'Dokumen-dokumen ini merupakan pedoman resmi yang ditetapkan oleh Institut Teknologi Kalimantan dan Fakultas Sains dan Teknologi Informasi. Mahasiswa diharapkan untuk membaca dan memahami dokumen-dokumen ini untuk kelancaran kegiatan akademik.'
                      : 'These documents are official guidelines established by Kalimantan Institute of Technology and the Faculty of Science and Information Technology. Students are expected to read and understand these documents for the smooth running of academic activities.'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {language === 'id'
                      ? '📥 Seluruh dokumen dapat diunduh dan disimpan untuk referensi. Jika terdapat pertanyaan atau hal yang perlu diklarifikasi, silakan hubungi admin FSTI.'
                      : '📥 All documents can be downloaded and saved for reference. If there are questions or matters that need clarification, please contact the FSTI admin.'}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default PeraturanKebijakanPage;