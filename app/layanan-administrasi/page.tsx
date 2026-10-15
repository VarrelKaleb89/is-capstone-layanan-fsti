"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import WorkflowDiagram from '@/components/ui/WorkflowDiagram';
import SectionDivider from '@/components/ui/SectionDivider';
import { hasCompletedAccessSurvey } from '@/lib/letter-service';
import ServiceAccessSurveyModal from '@/components/survey/ServiceAccessSurveyModal';

// Import icons
import {
  FileText,
  Briefcase,
  CheckCircle,
  Award,
  Users,
  ChevronDown,
  GraduationCap,
  ArrowRight,
  BookOpen,
  Folder,
  Edit,
  Search,
  FileSignature,
  Laptop,
  Database,
  PieChart,
  Heart,
  Globe,
  DollarSign,
  Bookmark,
  Calendar,
  FilePlus,
  Download,
  ExternalLink,
  Sparkles,
  Lock
} from 'lucide-react';

const LayananAdministrasiPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [expandedAccordions, setExpandedAccordions] = useState<Record<string, boolean>>({});
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string>('/layanan-administrasi/ajukan?jenis=surat-aktif-studi');
  const [pendingServiceName, setPendingServiceName] = useState<string>('Surat Keterangan Aktif Studi');
  const { t, language } = useLanguage();

  const handleApplyClick = (e: React.MouseEvent, url: string, serviceTitle: string) => {
    if (url.startsWith('/layanan-administrasi/ajukan')) {
      if (!hasCompletedAccessSurvey()) {
        e.preventDefault();
        setPendingUrl(url);
        setPendingServiceName(serviceTitle);
        setShowSurveyModal(true);
      }
    }
  };

  // Banner Zona Integritas (carousel otomatis)
  const ziBanners = [
    { src: "/images/zi.png", alt: language === 'en' ? "You are entering an Integrity Zone — students are prohibited from giving gifts to lecturers, staff, supervisors, examiners, or study program management" : "Anda memasuki Zona Integritas — mahasiswa dilarang memberi hadiah/bingkisan kepada Dosen, Tendik, Pembimbing, Penguji, dan Manajemen Program Studi" },
    { src: "/images/zi2.png", alt: language === 'en' ? "All our services are free — report to Fsti@itk.ac.id if there is any charge" : "Semua layanan kami gratis — laporkan ke Fsti@itk.ac.id jika ada pungutan" },
  ];
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % ziBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ziBanners.length]);

  const toggleAccordion = (id: string) => {
    setExpandedAccordions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Data layanan mahasiswa
  const mahasiswaLayananList = [
    {
      id: "surat",
      title: language === 'en' ? "Letter Services" : "Layanan Surat",
      description: language === 'en'
        ? "Service for creating cover letters and general administrative documents for student needs."
        : "Layanan pembuatan surat pengantar dan dokumen administratif umum untuk keperluan mahasiswa.",
      icon: <FileText className="h-6 w-6" />,
      subLayanan: [
        {
          title: language === 'en' ? "Cover Letter Services" : "Layanan Surat Pengantar & Aktif Studi",
          items: [
            {
              text: language === 'en' ? "Active Study Certificate (Online Form - Instant)" : "Surat Keterangan Aktif Studi (Online Mandiri - Otomatis)",
              url: "/layanan-administrasi/ajukan?jenis=surat-aktif-studi"
            },
            {
              text: language === 'en' ? "Cover Letter Request (KP / General)" : "Permohonan Surat Pengantar (KP / Umum)",
              url: "/layanan-administrasi/ajukan?jenis=surat-pengantar-kp"
            },
            {
              text: language === 'en' ? "Recommendation Letter Request (Online Form)" : "Permohonan Surat Rekomendasi Kegiatan/Beasiswa",
              url: "/layanan-administrasi/ajukan?jenis=surat-rekomendasi"
            },
            {
              text: language === 'en'
                ? "Letter Request (Postgraduate / MMT)"
                : "Permohonan Surat (Pascasarjana / MMT)",
              url: "https://s.itk.ac.id/permohonansurats2"
            }
          ]
        }
      ],
      category: "mahasiswa",
      url: "#"
    },
    {
      id: "kp-ta",
      title: language === 'en' ? "Internship / Apprenticeship and Final Projects" : "Kerja Praktek / Magang dan Tugas Akhir",
      description: language === 'en'
        ? "Administrative services related to the application and implementation of Internships, Apprenticeships, and Final Projects."
        : "Layanan administrasi terkait pengajuan dan pelaksanaan Kerja Praktek, Magang, dan Tugas Akhir.",
      icon: <Briefcase className="h-6 w-6" />,
      subLayanan: [
        {
          title: language === 'en' ? "Practical Work" : "Kerja Praktik",
          items: [
            { text: language === 'en' ? "Practical Work Registration" : "Pendaftaran Kerja Praktik", url: "https://docs.google.com/forms/d/e/1FAIpQLSdq1GExnTNwAodG_NbZTskZE0SUZDycsArf7_2ybU2Qa61R4w/viewform?usp=dialog" },
            { text: language === 'en' ? "Registration Before Practical Work Acceptance" : "Pendaftaran Sebelum diterima Kerja Praktik", url: "https://forms.gle/XLPQbtTQatE4dgYN7" },
            { text: language === 'en' ? "Registration After Practical Work Acceptance" : "Pendaftaran Setelah diterima Kerja Praktik", url: "https://forms.gle/nQ85jfeA9L39NstL8" },
            { text: language === 'en' ? "Practical Work Seminar Registration" : "Pendaftaran Seminar Kerja Praktik", url: "https://forms.gle/KWrKUTqQG5uWbPQW6" },
            { text: language === 'en' ? "Upload Student Results Form" : "Upload Formulir Hasil Mahasiswa", url: "https://docs.google.com/forms/d/e/1FAIpQLSfdRvocwHRo7F1EPPNjZVMYEK8oQzRlLB4WPx5Cx-8kCjphpw/viewform?usp=preview" }
          ]
        },
        {
          title: language === 'en' ? "Internship" : "Magang",
          items: [
            { text: language === 'en' ? "Internship Introduction Registration" : "Pendaftaran Pengantar Magang", url: "https://docs.google.com/forms/d/e/1FAIpQLSevJWaWZJ7sBEqRtr2DQpPvQ2U8h7-Bo3LzZKB40Lt5-WZ6og/viewform" },
            { text: language === 'en' ? "Internship Results Seminar Registration" : "Pendaftaran Seminar Hasil Magang", url: "https://forms.gle/gWQLGqz3GXpYXJrXA" },
            { text: language === 'en' ? "Upload Student Results Form" : "Upload Formulir Hasil Mahasiswa", url: "https://docs.google.com/forms/d/e/1FAIpQLSfdRvocwHRo7F1EPPNjZVMYEK8oQzRlLB4WPx5Cx-8kCjphpw/viewform?usp=preview" }
          ]
        },
        {
          title: language === 'en' ? "Final Project" : "Tugas Akhir",
          items: [
            { text: language === 'en' ? "Final Project Proposal Seminar Registration" : "Pendaftaran Seminar Proposal Tugas Akhir (TA)", url: "https://forms.gle/Kprni4wLMBeEvhEx5" },
            { text: language === 'en' ? "Upload Student Results Form" : "Upload Formulir Hasil Mahasiswa", url: "https://docs.google.com/forms/d/e/1FAIpQLSfdRvocwHRo7F1EPPNjZVMYEK8oQzRlLB4WPx5Cx-8kCjphpw/viewform?usp=preview" },
            { text: language === 'en' ? "Final Project Results Seminar Registration" : "Pendaftaran Seminar Hasil Tugas Akhir", url: "http://s.itk.ac.id/seminarhasilta" },
            { text: language === 'en' ? "Final Project Defense Registration" : "Pendaftaran Sidang Tugas Akhir (TA)", url: "https://forms.gle/XtPfYYyuCJgPkgW68" },
            { text: language === 'en' ? "Request for Final Project Defense Certificate" : "Permohonan Surat Keterangan Sidang TA", url: "https://docs.google.com/forms/d/e/1FAIpQLSfGMptnRk3vrXLxLAEZGbqrCp5WvwF7POlhAT5rMALPew30Nw/viewform" },
            { text: language === 'en' ? "Collection of Final Project Document Receipt" : "Pengumpulan Bukti Tanda Terima Berkas Tugas Akhir", url: "https://docs.google.com/forms/d/e/1FAIpQLSe5apOobV_VL4CJKSG0HtMLFsclxktmt7sNl0hyRllxq-xfKw/viewform?usp=preview" }
          ]
        },
        {
          title: language === 'en' ? "MBKM" : "MBKM",
          items: [
            { text: language === 'en' ? "Faculty of Science and Information Technology MBKM Registration" : "Pendaftaran MBKM Fakultas Sains dan Teknologi Informasi", url: "https://s.itk.ac.id/mbkmfsti" },
            { text: language === 'en' ? "FSTI MBKM Final Report / Results Seminar Registration" : "Pendaftaran Seminar Hasil / Laporan Akhir MBKM FSTI", url: "https://forms.gle/ogruDmFg6yiQtFLC6" }
          ]
        }
      ],
      category: "mahasiswa",
      url: "#"
    },
    {
      id: "akademik",
      title: language === 'en' ? "Academic Services" : "Layanan Akademik",
      description: language === 'en'
        ? "Academic administrative services for students including active student certificates, graduation letters, and more."
        : "Layanan administrasi akademik untuk mahasiswa termasuk surat keterangan aktif, surat keterangan lulus, dan lainnya.",
      icon: <GraduationCap className="h-6 w-6" />,
      subLayanan: [
        {
          title: language === 'en' ? "Academic Documents" : "Dokumen Akademik",
          items: [
            {
              text: language === 'en' ? "Active Student Certificate Request" : "Permohonan Surat Keterangan Aktif Studi",
              url: "https://forms.gle/XG1TVHAG7cNkpKEG7"
            },
            {
              text: language === 'en'
                ? "Active Student Certificate Request (Postgraduate / MMT)"
                : "Permohonan Surat Keterangan Aktif Studi (Pascasarjana / MMT)",
              url: "https://s.itk.ac.id/surataktifstudis2"
            },
            { text: language === 'en' ? "Graduation Certificate Request" : "Permohonan Surat Keterangan Lulus (SKL)", url: "https://forms.gle/njqaU8cs81KwVHiJ9" },
            { text: language === 'en' ? "Academic Document Service Request" : "Permohonan Layanan Dokumen Akademik (Transkip Mata Kuliah, KHS dan FRS)", url: "https://forms.gle/YbWMvtHvbgKAQPkS7" },
            { text: language === 'en' ? "Class Attendance Dispensation Request" : "Permohonan Dispensasi Perkuliahan", url: "https://docs.google.com/forms/u/0/d/1KgPpebd-SnQsAbTCvkn27H4JNBXS_05Amfd2kUw6YUA/viewform?edit_requested=true" },
            { text: language === 'en' ? "Resignation Request" : "Permohonan Pengunduran Diri", url: "https://docs.google.com/forms/d/e/1FAIpQLSdgfezuRykiiFUqAqTE7ZnvtYFX-UhFuYfeD0WtULXBRPme6w/viewform" }
          ]
        }
      ],
      category: "mahasiswa",
      url: "#"
    },
    {
      id: "legalisasi",
      title: language === 'en' ? "Document Legalization" : "Legalisasi Dokumen",
      description: language === 'en'
        ? "Legalization service for official faculty academic documents such as transcripts, diplomas, and certificates."
        : "Layanan legalisasi untuk dokumen akademik resmi fakultas seperti transkrip, ijazah, dan sertifikat.",
      icon: <CheckCircle className="h-6 w-6" />,
      subLayanan: [
        {
          title: language === 'en' ? "Document Legalization" : "Legalisasi Dokumen",
          items: [
            { text: language === 'en' ? "Document Legalization (Grade Report, Temporary Transcript, Graduation Letter, Student ID, FRS, Active Student Certificate, Accreditation Certificate)" : "Legalisasi Dokumen (KHS, Transkrip Sementara, SKL, KTM, FRS, Surat Keterangan Aktif Studi, Sertifikat Akreditasi)", url: "https://forms.gle/Z7FiBx4B2zMRuUGQ7" }
          ]
        }
      ],
      category: "mahasiswa",
      url: "#"
    },
    {
      id: "perubahan-matkul",
      title: language === 'en' ? "Course Changes/Additions/Removals" : "Layanan Perubahan/Penambahan/Penghapusan Mata Kuliah",
      description: language === 'en'
        ? "Services related to changing, adding, or removing courses in student study plans."
        : "Layanan terkait perubahan, penambahan, atau penghapusan mata kuliah dalam rencana studi mahasiswa.",
      icon: <Edit className="h-6 w-6" />,
      subLayanan: [
        {
          title: language === 'en' ? "Course Modification Forms" : "Formulir Perubahan Mata Kuliah",
          items: [
            { text: language === 'en' ? "Course Change Request Form" : "Formulir Permohonan Perubahan Mata Kuliah", url: "https://docs.google.com/document/d/1CSE6CAujsTgXA9GUMVi-Axq9aBxThnuC/edit" },
            { text: language === 'en' ? "Course Request Form" : "Formulir Permohonan Mata Kuliah", url: "https://docs.google.com/document/d/1HqhobeyBaDlOkuSqmltCETpP3vW1jJLO/edit" },
            { text: language === 'en' ? "Late Registration/FRS Form" : "Formulir Permohonan Terlambat Perwalian/FRS", url: "https://docs.google.com/document/d/1Iwjr2MURBQJd1LHZCXFMkzhDoDzOlidn/edit" },
            { text: language === 'en' ? "FRS Deletion Request Form" : "Formulir Permohonan Penghapusan FRS", url: "https://docs.google.com/document/d/1mDCfOePs_XZdmhSp3aMhfo_o7Q-3R4Ix/edit" },
            { text: language === 'en' ? "FRS Change Form Collection" : "Pengumpulan Formulir Perubahan FRS", url: "https://forms.gle/EH7tDdrxKaPVAnzN9" }
          ]
        }
      ],
      category: "mahasiswa",
      url: "#"
    },
    {
      id: "kemahasiswaan",
      title: language === 'en' ? "Student Affairs" : "Layanan Kemahasiswaan",
      description: language === 'en'
        ? "Administrative services for student activities, certificates, and other student affairs."
        : "Layanan administrasi untuk kegiatan mahasiswa, sertifikat, dan urusan kemahasiswaan lainnya.",
      icon: <Users className="h-6 w-6" />,
      subLayanan: [
        {
          title: language === 'en' ? "Student Affairs Services" : "Layanan Kemahasiswaan",
          items: [
            { text: language === 'en' ? "Student Activity Certificate Number Request" : "Permohonan Nomor Sertifikat Kegiatan Mahasiswa", url: "https://docs.google.com/forms/d/1youLu99r0g6uLTEAgX8rNJF5t3b8id-MKk6KsPi_nko/viewform?edit_requested=true" },
            { text: language === 'en' ? "Activity/Proposal Signature Request" : "Permohonan Tanda Tangan Kegiatan/Proposal", url: "https://forms.gle/aiYkVXLen6jThVJf8" },
            { text: language === 'en' ? "Student Assignment Letter Request" : "Permohonan Surat Tugas Mahasiswa", url: "https://forms.gle/7pDSng1cQVmvyWEP9" }
          ]
        }
      ],
      category: "mahasiswa",
      url: "#"
    },
    {
      id: "keuangan",
      title: language === 'en' ? "Financial Services" : "Layanan Keuangan",
      description: language === 'en'
        ? "Financial administrative services for students, including tuition fee related requests."
        : "Layanan administrasi keuangan untuk mahasiswa, termasuk permohonan terkait UKT.",
      icon: <DollarSign className="h-6 w-6" />,
      subLayanan: [
        {
          title: language === 'en' ? "Financial Services" : "Layanan Keuangan",
          items: [
            { text: language === 'en' ? "Tuition Fee Relief Request" : "Permohonan Keringanan UKT", url: "http://s.itk.ac.id/ukttafsti" },
            { text: language === 'en' ? "Activity Advance Payment Service" : "Pengajuan Uang Muka Kegiatan", url: "https://docs.google.com/forms/d/e/1FAIpQLSfpuV0Yb-fOfhfl5hhhVbsUfFW2pUb6LONB4TPGPCKh6ZpchQ/viewform?usp=header" }
          ]
        }
      ],
      category: "mahasiswa",
      url: "#"
    },
    {
      id: "humas",
      title: language === 'en' ? "Public Relations" : "Layanan Humas",
      description: language === 'en'
        ? "Services related to FSTI public relations and official social media content."
        : "Layanan terkait hubungan masyarakat FSTI dan konten media sosial resmi.",
      icon: <Globe className="h-6 w-6" />,
      subLayanan: [
        {
          title: language === 'en' ? "Public Relations Services" : "Layanan Humas",
          items: [
            { text: language === 'en' ? "Official FSTI Instagram Feed Upload Request" : "Permohonan Upload Feed Instagram Official FSTI", url: "http://s.itk.ac.id/fstiprestasi" },
            { text: language === 'en' ? "Official FSTI TikTok Content Upload Request" : "Permohonan Upload Konten Tiktok Official FSTI", url: "https://docs.google.com/forms/d/e/1FAIpQLSf9wlLtNU6pHNfpO20SdFOxUmCpDVBo9CtdVrWwJ1QZX03-Vg/viewform" },
            { text: language === 'en' ? "FSTI ITK Profile Website Content Upload Request" : "Permohonan Upload Konten Website Profil FSTI ITK", url: "https://docs.google.com/forms/d/e/1FAIpQLScljlNNYgOFA3pAeGocG1cXtZ1O9N9zrQ8_RKi5-QsNEtRZNA/viewform" }
          ]
        }
      ],
      category: "mahasiswa",
      url: "#"
    },
  ];

  // Data layanan dosen
  const dosenLayananList = [
    {
      id: "keuangan-dosen",
      title: language === 'en' ? "Financial Services" : "Layanan Keuangan",
      description: language === 'en'
        ? "Financial administrative services for lecturers."
        : "Layanan administrasi keuangan untuk dosen.",
      icon: <DollarSign className="h-6 w-6" />,
      subLayanan: [
        {
          title: language === 'en' ? "Financial Services" : "Layanan Keuangan",
          items: [
            { text: language === 'en' ? "Activity Advance Payment Service" : "Pengajuan Uang Muka Kegiatan", url: "https://docs.google.com/forms/d/e/1FAIpQLSfpuV0Yb-fOfhfl5hhhVbsUfFW2pUb6LONB4TPGPCKh6ZpchQ/viewform?usp=header" }
          ]
        }
      ],
      category: "dosen",
      url: "#"
    },
    {
      id: "sistem-informasi-dosen",
      title: language === 'en' ? "Lecturer Information Systems" : "Sistem Informasi Dosen",
      description: language === 'en'
        ? "Access to various academic and administrative information systems for lecturers."
        : "Akses ke berbagai sistem informasi akademik dan administrasi untuk dosen.",
      icon: <Laptop className="h-6 w-6" />,
      subLayanan: [
        {
          title: language === 'en' ? "Information Systems" : "Sistem Informasi",
          items: [
            { text: "SIAKAD", url: "http://gerbang.itk.ac.id/" },
            { text: "SIMPAS", url: "http://simpas.itk.ac.id/" },
            { text: "SIPEKA", url: "http://sipeka.itk.ac.id/" },
            { text: "KULIAH", url: "http://kuliah.itk.ac.id/" },
            { text: "SIMHKI", url: "http://hki.itk.ac.id/" },
            { text: "SISTER", url: "http://sister.itk.ac.id/" },
            { text: language === 'en' ? "Open Data FSTI" : "Open Data FSTI", url: "https://docs.google.com/spreadsheets/d/1Djh8lifyazItpv8tuC2XWYF32kBkueCQaM43x6yEDiU/edit?gid=1389139501#gid=1389139501" }
          ]
        }
      ],
      category: "dosen",
      url: "#"
    },
    {
      id: "pengajuan-surat-keterangan-kerja",
      title: language === 'en' ? "Employment Certificate Letter" : "Pengajuan Surat Keterangan Kerja",
      description: language === 'en'
        ? "Service for requesting employment certificate letters."
        : "Layanan pengajuan surat keterangan kerja untuk keperluan administrasi.",
      icon: <FileText className="h-6 w-6" />,
      url: "https://forms.gle/HUhx1fmpUSJwvziRA",
      category: "dosen" // atau "tendik" atau "umum" sesuai kebutuhan
    },
    {
      id: "pengajuan-surat-cek-plagiat",
      title: language === 'en' ? "Plagiarism Check Letter" : "Pengajuan Surat Ket. Cek Plagiasi Dosen",
      description: language === 'en'
        ? "Service for requesting plagiarism check certificates for lecturer documents."
        : "Layanan pengajuan surat keterangan cek plagiarisme untuk dokumen dosen.",
      icon: <FileText className="h-6 w-6" />,
      url: "https://docs.google.com/forms/d/e/1FAIpQLSersKFA0Nkw_AwSLN1H00MpAkg_2JI1XgX3l39WRcDAPupNHg/viewform",
      category: "dosen"
    },
    {
      id: "template-form-cuti",
      title: language === 'en' ? "Leave Form Template" : "Template Form Cuti",
      description: language === 'en'
        ? "Template forms for lecturer leave requests."
        : "Template formulir untuk pengajuan cuti dosen.",
      icon: <FileSignature className="h-6 w-6" />,
      url: "https://docs.google.com/spreadsheets/d/1dIxHGXbtxJNw13_GY0NFxq580x2OOPMH/edit?usp=sharing&ouid=106706954680118435553&rtpof=true&sd=true",
      category: "dosen"
    },
    {
      id: "layanan-surat-tugas",
      title: language === 'en' ? "Assignment Letter Service" : "Layanan Pengajuan Surat Tugas",
      description: language === 'en'
        ? "Service for requesting assignment letters for lecturers."
        : "Layanan pengajuan surat tugas untuk dosen.",
      icon: <FileText className="h-6 w-6" />,
      url: "https://forms.gle/Cqmep7rLAinZcgjx5",
      category: "dosen"
    },
    {
      id: "peminjaman-sarana",
      title: language === 'en' ? "ITK Facilities and Infrastructure Borrowing" : "Layanan Peminjaman Sarana dan Prasarana ITK",
      description: language === 'en'
        ? "Service for borrowing ITK facilities and infrastructure."
        : "Layanan peminjaman sarana dan prasarana ITK.",
      icon: <Laptop className="h-6 w-6" />,
      url: "https://forms.gle/9E3ddzEHB35xSgjc9",
      category: "dosen"
    },
    {
      id: "pengesahan-dekan",
      title: language === 'en' ? "Dean's Approval" : "Layanan Pengesahan Dekan",
      description: language === 'en'
        ? "Service for requesting dean's approval for academic documents."
        : "Layanan pengajuan pengesahan dekan untuk dokumen akademik.",
      icon: <CheckCircle className="h-6 w-6" />,
      url: "https://forms.gle/P4S93zfuZLjdZkaa9",
      category: "dosen"
    },
    {
      id: "inisiasi-kerjasama",
      title: language === 'en' ? "Cooperation Initiation" : "Layanan Pengajuan Inisiasi Kerjasama",
      description: language === 'en'
        ? "Service for initiating cooperation with external institutions."
        : "Layanan pengajuan inisiasi kerjasama dengan institusi eksternal.",
      icon: <Briefcase className="h-6 w-6" />,
      url: "https://drive.google.com/drive/folders/1vMFpudK1LX3g1ywcOECLE_5S7HgA3vse?usp=sharing",
      category: "dosen"
    },
    {
      id: "kumpulan-sk",
      title: language === 'en' ? "Academic-Non Academic Decrees Collection" : "Kumpulan SK Akademik-Non Akademik",
      description: language === 'en'
        ? "Collection of academic and non-academic decree documents."
        : "Kumpulan dokumen SK akademik dan non-akademik.",
      icon: <Folder className="h-6 w-6" />,
      url: "https://drive.google.com/drive/folders/1vMFpudK1LX3g1ywcOECLE_5S7HgA3vse?usp=sharing",
      category: "dosen"
    },
    {
      id: "template-kp4",
      title: language === 'en' ? "KP4 Form Template" : "Template Form KP4",
      description: language === 'en'
        ? "Template forms for KP4 documentation."
        : "Template formulir untuk dokumentasi KP4.",
      icon: <FileSignature className="h-6 w-6" />,
      url: "https://docs.google.com/document/d/1kkdVJyegHSSDVpgR2bfqlHBxRfQyIT1p/edit?usp=sharing&ouid=106706954680118435553&rtpof=true&sd=true",
      category: "dosen"
    },
    {
      id: "pengajuan-sk-rektor",
      title: language === 'en' ? "Rector's Decree Request" : "Layanan Pengajuan SK Rektor",
      description: language === 'en'
        ? "Service for requesting rector's decree for academic activities."
        : "Layanan pengajuan SK Rektor untuk kegiatan akademik.",
      icon: <Award className="h-6 w-6" />,
      url: "https://docs.google.com/forms/d/e/1FAIpQLSe9fYni6UDE8ipSnycheBaqaLyJyAoizqmUmBWuzwifx4auJQ/viewform?usp=sharing",
      category: "dosen"
    },
  ];

  // Gabungkan semua layanan
  const layananList = [...mahasiswaLayananList, ...dosenLayananList];

  // Filter layanan berdasarkan pencarian
  const filteredServices = layananList.filter(layanan => {
    const matchesSearch = layanan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      layanan.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'all') return matchesSearch;
    return matchesSearch && layanan.category === filter;
  });

  return (
    <MainLayout>
      {/* Header Section with Animated Gradient Background */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="slideUp">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-gradient">{t('services.title')}</h1>
              <p className="text-gray-700 text-lg mb-6">
                {t('services.description')}
              </p>

              {/* Highlight Fitur Baru: Otomasi Persuratan Mandiri */}
              <div className="bg-gradient-to-r from-primary-700 via-primary-800 to-indigo-900 text-white rounded-2xl p-6 shadow-xl text-left max-w-3xl mx-auto mb-8 border border-primary-500/30">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      Layanan Persuratan Otomatis
                    </span>
                    <h3 className="text-xl font-bold font-display text-white">
                      Pengajuan Surat Mandiri Mahasiswa FSTI
                    </h3>
                    <p className="text-xs sm:text-sm text-primary-100 max-w-lg leading-relaxed">
                      Ajukan Surat Keterangan Aktif Studi, Surat Pengantar KP, dan Rekomendasi langsung melalui sistem. Data terformat otomatis ke template surat resmi, pelacakan privat berbasis NIM, dan unduh berkas PDF resmi setelah survei.
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-full sm:w-auto">
                    <Link
                      href="/layanan-administrasi/ajukan?jenis=surat-aktif-studi"
                      onClick={(e) => handleApplyClick(e, '/layanan-administrasi/ajukan?jenis=surat-aktif-studi', 'Surat Keterangan Aktif Studi')}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-primary-900 hover:bg-primary-50 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all hover:scale-105 w-full sm:w-auto"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Ajukan Surat Sekarang</span>
                    </Link>
                    <p className="text-[11px] text-primary-200 mt-2 text-center sm:text-left flex items-center gap-1 justify-center sm:justify-start">
                      <Lock className="w-3 h-3 text-amber-300" />
                      <span>Wajib isi survei singkat sebelum isi form</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Template Dokumen */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4 text-center">
                <div className="text-gray-700">
                  <span className="font-medium">
                    {language === 'en' ? 'Document Templates:' : 'Template Dokumen:'}
                  </span>
                  <span className="ml-2">
                    <a
                      href="https://s.itk.ac.id/templateformulir"
                      className="font-semibold text-primary-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      download="Format Surat Akademik 2024.pdf"
                    >
                      {language === 'en' ? 'Student Academic Form Template' : 'Template Formulir Akademik Mahasiswa'}
                    </a>
                  </span>
                </div>
              </div>

              {/* Estimasi Waktu Proses */}
              <div className="bg-gray-50 rounded-xl p-4 mb-10 text-center">
                <div className="text-gray-700">
                  <span className="font-medium">
                    {language === 'en' ? 'Estimated Processing Time:' : 'Estimasi Waktu Proses:'}
                  </span>
                  <span className="font-semibold text-primary-600 ml-2">
                    {language === 'en' ? '1-2 working days' : '1-2 hari kerja'}
                  </span>
                </div>
              </div>

            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Divider: Hero → Daftar Layanan */}
      <SectionDivider type="slant" fillColor="#f8fafc" bgColor="transparent" />

      {/* Banner Zona Integritas (Carousel) */}
      <section className="relative bg-[#f8fafc] pt-4 pb-10">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fadeIn">
            <div className="max-w-4xl mx-auto">
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-lg bg-white">
                {ziBanners.map((banner, index) => (
                  <Image
                    key={banner.src}
                    src={banner.src}
                    alt={banner.alt}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 896px) 100vw, 896px"
                    className={`object-contain transition-opacity duration-700 ease-in-out ${index === currentBanner ? 'opacity-100' : 'opacity-0'}`}
                  />
                ))}
              </div>
              {/* Indikator / navigasi */}
              <div className="flex justify-center gap-2 mt-4">
                {ziBanners.map((banner, index) => (
                  <button
                    key={banner.src}
                    onClick={() => setCurrentBanner(index)}
                    aria-label={`Banner ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${index === currentBanner ? 'w-6 bg-primary-600' : 'w-2.5 bg-gray-300 hover:bg-gray-400'}`}
                  />
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Daftar Layanan Section */}
      <section className="relative py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="slideUp">
            <h2 className="text-3xl font-display font-bold text-center mb-12 text-gradient relative z-10">
              {t('services.servicesList')}
              {filter !== 'all' && ` ${filter === 'mahasiswa' ? t('services.students') : t('services.lecturers')}`}
              {searchTerm && ` - ${t('services.searchResultsFor')} "${searchTerm}"`}
            </h2>
          </AnimatedSection>

          {/* Search and Filter (Dipindahkan dari atas) */}
          <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md rounded-xl shadow-md p-6 mb-10 mt-2 relative z-10">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder={t('services.search')}
                  className="w-full bg-gray-50/80 text-gray-800 py-3 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  className={`px-4 py-3 rounded-lg transition-colors ${filter === 'all'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-50/80 text-gray-600 hover:bg-gray-100/90 border border-gray-100'
                    }`}
                  onClick={() => setFilter('all')}
                >
                  {t('services.all')}
                </button>
                <button
                  className={`px-4 py-3 rounded-lg transition-colors ${filter === 'mahasiswa'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-50/80 text-gray-600 hover:bg-gray-100/90 border border-gray-100'
                    }`}
                  onClick={() => setFilter('mahasiswa')}
                >
                  {t('services.students')}
                </button>
                <button
                  className={`px-4 py-3 rounded-lg transition-colors ${filter === 'dosen'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-50/80 text-gray-600 hover:bg-gray-100/90 border border-gray-100'
                    }`}
                  onClick={() => setFilter('dosen')}
                >
                  {t('services.lecturers')}
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start relative z-10">
            {filteredServices.length > 0 ? (
              filteredServices.map((layanan, index) => (
                <AnimatedSection
                  key={layanan.id}
                  animation="slideUp"
                  delay={index * 0.1}
                  className="h-full"
                >
                  <div id={layanan.id} className={`bg-white/95 backdrop-blur-sm rounded-xl shadow-md overflow-hidden hover-card h-full flex flex-col ${layanan.category === 'mahasiswa' ? 'border-t-4 border-t-primary-600' : 'border-t-4 border-t-accent'
                    }`}>
                    <div className={`p-5 flex items-center ${layanan.category === 'mahasiswa' ? 'bg-gradient-to-r from-primary-50/80 to-white' : 'bg-gradient-to-r from-accent/10 to-white'
                      }`}>
                      <div className={`mr-4 service-icon text-2xl ${layanan.category === 'mahasiswa' ? 'text-primary-600' : 'text-accent'
                        }`}>
                        {layanan.icon}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-xl font-semibold text-gray-800">{layanan.title}</h3>
                          <span className={`ml-3 text-xs px-2 py-1 rounded-full ${layanan.category === 'mahasiswa'
                            ? 'bg-primary-50 text-primary-600 border border-primary-100'
                            : 'bg-accent/10 text-accent border border-accent/20'
                            }`}>
                            {layanan.category === 'mahasiswa' ? t('services.students') : t('services.lecturers')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <p className="text-gray-700 mb-6">{layanan.description}</p>

                      {/* Kode untuk menampilkan daftar sub-layanan atau tombol untuk layanan tanpa subLayanan */}
                      {layanan.hasOwnProperty('subLayanan') && 'subLayanan' in layanan ? (
                        <div className="mt-2">
                          <div className="space-y-4">
                            {(layanan as any).subLayanan.map((sub: { title: string; items: any[] }, idx: number) => {
                              const accId = `${layanan.id}-${idx}`;
                              const isOpen = expandedAccordions[accId];
                              return (
                                <div key={idx} className={`bg-gray-50/80 backdrop-blur-sm rounded-lg overflow-hidden border transition-all duration-300 ${isOpen ? 'border-primary-200 shadow-sm' : 'border-gray-100'}`}>
                                  <button
                                    onClick={() => toggleAccordion(accId)}
                                    className={`w-full text-left px-5 py-4 flex justify-between items-center transition-colors ${isOpen
                                      ? (layanan.category === 'mahasiswa' ? 'bg-primary-50/80 text-primary-700' : 'bg-accent/10 text-accent')
                                      : 'hover:bg-gray-100/90 text-gray-800'
                                      }`}
                                  >
                                    <h5 className="font-semibold text-base select-none">{sub.title}</h5>
                                    <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                  </button>

                                  <div className={`transition-all duration-300 ease-in-out origin-top ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                    <ul className="p-4 space-y-3 bg-white/90">
                                      {sub.items.map((item: { text: string; url: string }, itemIdx: number) => (
                                        <li key={itemIdx} className="group">
                                          <a
                                            href={item.url}
                                            target={item.url.startsWith('http') ? "_blank" : undefined}
                                            rel={item.url.startsWith('http') ? "noopener noreferrer" : undefined}
                                            onClick={(e) => handleApplyClick(e, item.url, item.text)}
                                            className="flex items-start p-3 bg-white hover:bg-primary-50/80 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-300 transition-all duration-300 group-hover:translate-x-1"
                                          >
                                            <div className={`p-2 rounded-lg mr-3 mt-0.5 transition-colors ${layanan.category === 'mahasiswa' ? 'bg-primary-100 group-hover:bg-primary-600' : 'bg-accent/20 group-hover:bg-accent'
                                              }`}>
                                              <FileText className={`h-4 w-4 ${layanan.category === 'mahasiswa' ? 'text-primary-600 group-hover:text-white' : 'text-accent group-hover:text-white'
                                                }`} />
                                            </div>
                                            <span className="text-gray-700 text-sm group-hover:text-gray-900 transition-colors leading-relaxed break-words pr-2">
                                              {item.text}
                                            </span>
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ) : layanan.url && layanan.url !== '#' ? (
                        <div className="mt-2 pt-4">
                          <a
                            href={layanan.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 hover:shadow-md transition-all duration-300 group"
                          >
                            <span>{language === 'en' ? 'Access Service' : 'Akses Layanan'}</span>
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </a>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </AnimatedSection>
              ))
            ) : (
              <AnimatedSection animation="fadeIn">
                <div className="text-center py-12 bg-white/80 backdrop-blur-md rounded-xl">
                  <div className="mb-6 text-gray-500">
                    <Search className="h-16 w-16 mx-auto opacity-30 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{t('services.notFound')}</h3>
                    <p>{t('services.noServicesMatch')}</p>
                  </div>
                  <Button
                    onClick={() => {
                      setSearchTerm('');
                      setFilter('all');
                    }}
                    variant="outline"
                  >
                    {t('services.resetSearch')}
                  </Button>
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </section>

      {/* Alur Kerja Section */}
      <section className="relative py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="slideUp">
            <h2 className="text-3xl font-display font-bold text-center mb-6 text-gradient">{t('services.workflow.title')}</h2>
            <p className="text-center text-gray-700 mb-8 max-w-3xl mx-auto">
              {language === 'en'
                ? 'Below is the service request workflow for FSTI services from submission to completion, including status checking mechanism and improvement process if needed.'
                : 'Berikut adalah alur proses permohonan layanan FSTI dari tahap pengajuan hingga penyelesaian, termasuk mekanisme pengecekan status dan perbaikan jika diperlukan.'}
            </p>
          </AnimatedSection>

          {/* Alur Kerja Diagram */}
          <AnimatedSection animation="fadeIn" delay={0.3} className="mb-12">
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 hover-card max-w-5xl mx-auto">
              <div className="overflow-auto">
                {/* Ganti baris ini: */}
                {/* <img 
                  src="/images/alur-kerja-fsti.png" 
                  alt={language === 'en' ? 'FSTI Service Workflow' : 'Alur Kerja Layanan FSTI'} 
                  className="w-full h-auto object-contain" 
                /> */}

                {/* Dengan komponen WorkflowDiagram: */}
                <WorkflowDiagram language={language} />
              </div>
            </div>
          </AnimatedSection>

          {/* Ringkasan Tahapan */}
          <div className="mt-10">
            <AnimatedSection animation="slideUp">
              <h3 className="text-2xl font-display font-semibold text-center mb-8 text-gradient">
                {language === 'en' ? 'Service Request Steps Summary' : 'Ringkasan Tahapan Layanan'}
              </h3>
            </AnimatedSection>

            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap justify-center">
                {/* Step 1 */}
                <AnimatedSection
                  className="w-full md:w-1/2 lg:w-1/5 px-4 mb-6 md:mb-0"
                  animation="slideUp"
                  delay={0.1}
                >
                  <div className="bg-white rounded-xl shadow-md p-6 text-center h-full flex flex-col items-center hover-card">
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 font-bold text-2xl mb-4 shadow-md">1</div>
                    <h3 className="font-semibold mb-2 text-gray-800 text-lg">
                      {language === 'en' ? 'Service Request Prerequisites' : 'Prasarat Permohonan'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {language === 'en'
                        ? 'Prepare required documents and select FSTI service via portal'
                        : 'Menyiapkan surat/tanda tangan dan memilih layanan FSTI via portal'
                      }
                    </p>
                  </div>
                </AnimatedSection>

                {/* Step 2 */}
                <AnimatedSection
                  className="w-full md:w-1/2 lg:w-1/5 px-4 mb-6 md:mb-0"
                  animation="slideUp"
                  delay={0.2}
                >
                  <div className="bg-white rounded-xl shadow-md p-6 text-center h-full flex flex-col items-center hover-card">
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 font-bold text-2xl mb-4 shadow-md">2</div>
                    <h3 className="font-semibold mb-2 text-gray-800 text-lg">
                      {language === 'en' ? 'Form Filling & Submit' : 'Pengisian Formulir & Submit'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {language === 'en'
                        ? 'Fill out complete form and submit request'
                        : 'Mengisi formulir lengkap dan menekan tombol Submit'
                      }
                    </p>
                  </div>
                </AnimatedSection>

                {/* Step 3 */}
                <AnimatedSection
                  className="w-full md:w-1/2 lg:w-1/5 px-4 mb-6 md:mb-0"
                  animation="slideUp"
                  delay={0.3}
                >
                  <div className="bg-white rounded-xl shadow-md p-6 text-center h-full flex flex-col items-center hover-card">
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 font-bold text-2xl mb-4 shadow-md">3</div>
                    <h3 className="font-semibold mb-2 text-gray-800 text-lg">
                      {language === 'en' ? 'Form Verification by Staff' : 'Pemeriksaan Formulir oleh Tendik'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {language === 'en'
                        ? 'Staff checks document completeness and data accuracy'
                        : 'Tendik memeriksa kelengkapan dan keabsahan data'
                      }
                    </p>
                  </div>
                </AnimatedSection>

                {/* Step 4 */}
                <AnimatedSection
                  className="w-full md:w-1/2 lg:w-1/5 px-4 mb-6 md:mb-0"
                  animation="slideUp"
                  delay={0.4}
                >
                  <div className="bg-white rounded-xl shadow-md p-6 text-center h-full flex flex-col items-center hover-card">
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 font-bold text-2xl mb-4 shadow-md">4</div>
                    <h3 className="font-semibold mb-2 text-gray-800 text-lg">
                      {language === 'en' ? 'Verification Decision' : 'Keputusan Verifikasi'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {language === 'en'
                        ? 'Document approved or requires revision'
                        : 'Dokumen disetujui atau perlu perbaikan'
                      }
                    </p>
                  </div>
                </AnimatedSection>

                {/* Step 5 */}
                <AnimatedSection
                  className="w-full md:w-1/2 lg:w-1/5 px-4"
                  animation="slideUp"
                  delay={0.5}
                >
                  <div className="bg-white rounded-xl shadow-md p-6 text-center h-full flex flex-col items-center hover-card">
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 font-bold text-2xl mb-4 shadow-md">5</div>
                    <h3 className="font-semibold mb-2 text-gray-800 text-lg">
                      {language === 'en' ? 'Update Request (Optional)' : 'Permintaan Update (Opsional)'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {language === 'en'
                        ? 'Contact via WhatsApp Business if no update within 2x24 hours'
                        : 'Jika tidak ada update dalam 2×24 jam kerja, hubungi via WhatsApp Business'
                      }
                    </p>
                  </div>
                </AnimatedSection>
              </div>

              {/* Status Information */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <AnimatedSection animation="slideUp" delay={0.6}>
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-400 rounded-full mr-3"></div>
                      <h4 className="font-semibold text-red-800">
                        {language === 'en' ? 'Not Suitable' : 'Tidak Sesuai'}
                      </h4>
                    </div>
                    <p className="text-red-700 text-sm mt-2">
                      {language === 'en'
                        ? 'Status: Needs Improvement - Please resubmit form'
                        : 'Status: Perlu Perbaikan - Kembali mengisi formulir'
                      }
                    </p>
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="slideUp" delay={0.7}>
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                      <h4 className="font-semibold text-green-800">
                        {language === 'en' ? 'Suitable' : 'Sesuai'}
                      </h4>
                    </div>
                    <p className="text-green-700 text-sm mt-2">
                      {language === 'en'
                        ? 'Status: Completed - Document can be viewed in Document Tracking Menu'
                        : 'Status: Selesai - Dokumen dapat dilihat di Menu Tracking Dokumen'
                      }
                    </p>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </div>

          {/* Petunjuk Tambahan */}
          <AnimatedSection animation="fadeIn" delay={0.7} className="mt-12">
            <div className="bg-gray-50 rounded-xl p-6 max-w-3xl mx-auto">
              <h4 className="font-semibold text-lg mb-3 text-center text-gray-800">
                {language === 'en' ? 'Additional Information' : 'Informasi Tambahan'}
              </h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  {language === 'en'
                    ? 'For document status inquiries, you can contact FSTI admin via WhatsApp Business within 24 hours after submission'
                    : 'Untuk menanyakan status dokumen, Anda dapat menghubungi admin FSTI melalui WhatsApp Business dalam waktu 24 jam setelah pengajuan'}
                </li>
                <li>
                  {language === 'en'
                    ? 'If a revision is required, you can check it through the document tracking system.'
                    : 'Jika diperlukan revisi, Anda dapat memeriksanya melalui sistem tracking dokumen'}
                </li>
                <li>
                  {language === 'en'
                    ? 'Please ensure all required documents are complete to avoid processing delays'
                    : 'Pastikan semua dokumen yang diperlukan lengkap untuk menghindari keterlambatan pemrosesan'}
                </li>
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-light-bg to-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection animation="slideUp">
            <h2 className="text-2xl font-display font-bold mb-6 text-gray-800">{t('services.needHelp.title')}</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              {t('services.needHelp.description')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                href="mailto:fsti@itk.ac.id"
                variant="primary"
                icon={<svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>}
                animate
              >
                {t('common.email')}
              </Button>
              <Button
                href="#kontak"
                variant="outline"
                icon={<svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>}
                animate
              >
                {t('common.contact')}
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Survey Gatekeeper Modal */}
      <ServiceAccessSurveyModal
        isOpen={showSurveyModal}
        onClose={() => setShowSurveyModal(false)}
        onSuccess={() => {
          setShowSurveyModal(false);
          router.push(pendingUrl);
        }}
        targetServiceName={pendingServiceName}
      />
    </MainLayout >
  );
};

export default LayananAdministrasiPage;