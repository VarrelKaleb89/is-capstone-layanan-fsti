'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowRight,
  FileText,
  Briefcase,
  GraduationCap,
  CheckCircle,
  Users,
  DollarSign,
  Globe,
  Laptop,
  FileSignature,
  Folder,
  Award,
  ExternalLink,
  Clock,
  ShieldCheck,
  BookOpen,
  Phone,
  Download,
  Search as SearchIcon,
  Ban,
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import AnimatedSection from '@/components/ui/AnimatedSection';
import {
  SERVICES,
  CATEGORY_BY_AUDIENCE,
  ACTION_LABELS,
  countByAudience,
  searchServices,
  type CatalogService,
  type Audience,
} from '@/lib/services-catalog';

const QUICK_ACCESS_IDS = [
  'surat-pengantar-kp',
  'pendaftaran-kp',
  'kp-setelah-diterima',
  'seminar-kp',
  'surat-aktif-studi',
  'legalisasi-dokumen',
  'surat-tugas-dosen',
  'sidang-ta',
];

const FREQUENT_IDS = [
  'surat-aktif-studi',
  'surat-pengantar-kp',
  'legalisasi-dokumen',
  'keringanan-ukt',
  'surat-tugas-mahasiswa',
  'sidang-ta',
  'mbkm-fsti',
  'surat-rekomendasi',
];

const POPULAR_KEYWORDS = [
  'Kerja Praktik',
  'Surat Aktif Studi',
  'Legalisasi',
  'Sidang TA',
  'Surat Tugas',
  'UKT',
];

const AUDIENCE_META: {
  audience: Audience;
  label: string;
  target: string;
  description: string;
  href: string;
  bigNumber: string;
  chips: string[];
}[] = [
  {
    audience: 's1',
    label: 'Layanan S1',
    target: 'Mahasiswa Sarjana',
    description: 'Surat, kerja praktik, magang, tugas akhir, keuangan, kegiatan mahasiswa, dan humas.',
    href: '/layanan-s1',
    bigNumber: 'S1',
    chips: CATEGORY_BY_AUDIENCE.s1,
  },
  {
    audience: 's2',
    label: 'Layanan S2',
    target: 'Mahasiswa MMT',
    description: 'Layanan akademik dan administrasi mahasiswa pascasarjana Magister Manajemen Teknologi.',
    href: '/layanan-s2',
    bigNumber: 'S2',
    chips: CATEGORY_BY_AUDIENCE.s2,
  },
  {
    audience: 'dosen',
    label: 'Layanan Dosen',
    target: 'Dosen FSTI',
    description: 'Surat tugas, pengesahan, keuangan, sarana, template, dan sistem informasi.',
    href: '/layanan-dosen',
    bigNumber: 'D',
    chips: CATEGORY_BY_AUDIENCE.dosen,
  },
];

const SERVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'surat-aktif-studi': FileText,
  'surat-pengantar-kp': Briefcase,
  'surat-rekomendasi': Award,
  'legalisasi-dokumen': CheckCircle,
  'dokumen-akademik': GraduationCap,
  'pendaftaran-kp': Briefcase,
  'kp-setelah-diterima': Briefcase,
  'seminar-kp': Briefcase,
  'sidang-ta': GraduationCap,
  'seminar-hasil-ta': GraduationCap,
  'seminar-proposal-ta': GraduationCap,
  'keringanan-ukt': DollarSign,
  'uang-muka-kegiatan': DollarSign,
  'nomor-sertifikat-kegiatan': Users,
  'surat-tugas-mahasiswa': Users,
  'ttd-kegiatan': Users,
  'upload-feed-ig': Globe,
  'upload-tiktok': Globe,
  'upload-website': Globe,
  'pengantar-magang': Briefcase,
  'seminar-hasil-magang': Briefcase,
  'mbkm-fsti': Award,
  'permohonan-surat-s2': FileText,
  'surat-aktif-studi-s2': FileText,
  'surat-tugas-dosen': FileText,
  'surat-keterangan-kerja': FileText,
  'cek-plagiasi': CheckCircle,
  'pengesahan-dekan': CheckCircle,
  'sk-rektor': Award,
  'uang-muka-dosen': DollarSign,
  'peminjaman-sarana': Laptop,
  'inisiasi-kerjasama': Laptop,
  'template-cuti': FileSignature,
  'template-kp4': FileSignature,
  'kumpulan-sk': Folder,
  siakad: Laptop,
  simpas: Laptop,
  sipeka: Laptop,
  kuliah: Laptop,
  simhki: Laptop,
  sister: Laptop,
  'open-data-fsti': Folder,
};

const INFO_SYSTEM_IDS = ['siakad', 'simpas', 'sipeka', 'kuliah', 'simhki', 'sister', 'open-data-fsti'];
const DOC_TEMPLATE_IDS = ['template-cuti', 'template-kp4', 'kumpulan-sk'];

function ServiceIcon({ id }: { id: string }) {
  const Icon = SERVICE_ICONS[id] ?? FileText;
  return <Icon className="w-5 h-5" />;
}

/** Kartu layanan: link tunggal, target eksternal diberi _blank, label tombol sesuai jenis aksi. */
function ServiceLink({ service, ctaLabel }: { service: CatalogService; ctaLabel?: string }) {
  const isExternal = service.url.startsWith('http');
  return (
    <a
      href={service.url}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200 p-5 hover:border-primary-400 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center flex-shrink-0">
          <ServiceIcon id={service.id} />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-slate-100 text-slate-600">
          {service.category}
        </span>
      </div>
      <h3 className="font-bold text-slate-900 text-sm mb-1.5 group-hover:text-primary-800 transition-colors">
        {service.name}
      </h3>
      <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1">{service.description}</p>
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700">
        {ctaLabel ?? (service.actionType === 'form' ? ACTION_LABELS.form.id : ACTION_LABELS[service.actionType].id)}
        {isExternal ? (
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        ) : (
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
        )}
      </span>
    </a>
  );
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const results = useMemo(() => searchServices(searchTerm), [searchTerm]);
  const hasQuery = searchTerm.trim().length > 0;

  const quickAccess = QUICK_ACCESS_IDS.map((id) => SERVICES.find((s) => s.id === id)).filter(
    (s): s is CatalogService => Boolean(s)
  );
  const frequent = FREQUENT_IDS.map((id) => SERVICES.find((s) => s.id === id)).filter(
    (s): s is CatalogService => Boolean(s)
  );
  const infoSystems = INFO_SYSTEM_IDS.map((id) => SERVICES.find((s) => s.id === id)).filter(
    (s): s is CatalogService => Boolean(s)
  );
  const docTemplates = DOC_TEMPLATE_IDS.map((id) => SERVICES.find((s) => s.id === id)).filter(
    (s): s is CatalogService => Boolean(s)
  );

  return (
    <MainLayout>
      {/* ============ 1. HERO + SEARCH ============ */}
      <section className="relative py-14 md:py-20 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="container mx-auto px-4 relative z-10 max-w-4xl text-center">
          <AnimatedSection animation="slideUp">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 border border-primary-500/30 text-xs font-semibold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              Layanan FSTI
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight text-white mb-4">
              Semua Layanan FSTI, Lebih Mudah Diakses
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Temukan layanan akademik, administrasi, dan sistem informasi sesuai kebutuhan Anda.
            </p>

            {/* Search bar */}
            <div className="relative max-w-2xl mx-auto mb-4" role="search">
              <Search
                className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari layanan… (mis. Kerja Praktik, UKT, Legalisasi)"
                aria-label="Cari layanan FSTI"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-slate-900 text-sm sm:text-base placeholder-slate-400 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-primary-400 shadow-xl"
              />
            </div>

            {/* Popular keyword chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              <span className="text-xs text-slate-400 mr-1">Populer:</span>
              {POPULAR_KEYWORDS.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => setSearchTerm(kw)}
                  className="px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-300 hover:border-primary-400 hover:text-primary-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  {kw}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <Clock className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <span>Proses: 1-2 Hari Kerja</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <CheckCircle className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span>100% Bebas Biaya Layanan</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Search results (live, tanpa reload) */}
      {hasQuery && (
        <section className="py-8 bg-light-bg border-b border-slate-200" aria-live="polite">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-sm font-bold text-slate-700 mb-4">
              Hasil pencarian untuk &ldquo;{searchTerm.trim()}&rdquo;{' '}
              <span className="font-normal text-slate-500">({results.length} layanan)</span>
            </h2>
            {results.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
                <Ban className="w-10 h-10 text-slate-300 mx-auto mb-3" aria-hidden="true" />
                <p className="font-semibold text-slate-700 mb-1">Tidak ada layanan yang cocok</p>
                <p className="text-sm text-slate-500">
                  Coba kata kunci lain, pilih chip populer di atas, atau telusuri per pintu layanan di bawah.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {results.map((service) => (
                  <ServiceLink key={service.id} service={service} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ============ 2. AKSES CEPAT ============ */}
      <section className="py-12 bg-light-bg">
        <div className="container mx-auto px-4 max-w-6xl">
          <AnimatedSection animation="slideUp">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-slate-900">Akses Cepat</h2>
                <p className="text-sm text-slate-500 mt-1">Layanan yang paling sering dibutuhkan mahasiswa dan dosen.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickAccess.map((service) => (
                <ServiceLink key={service.id} service={service} />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============ 3. PILIH PINTU LAYANAN ============ */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <AnimatedSection animation="slideUp">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-2xl font-display font-bold text-slate-900">Pilih Pintu Layanan Anda</h2>
              <p className="text-sm text-slate-500 mt-2">
                Telusuri katalog layanan sesuai status Anda sebagai mahasiswa atau dosen.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {AUDIENCE_META.map((meta) => (
                <Link
                  key={meta.audience}
                  href={meta.href}
                  className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-primary-400 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300"
                >
                  {/* Header biru + angka besar */}
                  <div className="relative bg-primary-700 p-5 pb-4 overflow-hidden">
                    <div
                      className="absolute -right-2 -top-4 text-[92px] font-black font-display text-white/10 select-none leading-none"
                      aria-hidden="true"
                    >
                      {meta.bigNumber}
                    </div>
                    <span className="relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 border border-white/25 text-[10px] font-bold uppercase tracking-wider text-white">
                      {meta.label}
                    </span>
                    <p className="relative text-white/80 text-xs mt-3">{meta.target}</p>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-slate-900 text-lg mb-2">{meta.label}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1">{meta.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {meta.chips.map((chip) => (
                        <span
                          key={chip}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-xs text-slate-500">
                        <strong className="text-primary-700 text-sm">{countByAudience(meta.audience)}</strong> layanan
                        tersedia
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 group-hover:gap-2.5 transition-all">
                        Jelajahi
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============ 4. JELAJAHI BERDASARKAN KATEGORI ============ */}
      <section className="py-12 bg-light-bg">
        <div className="container mx-auto px-4 max-w-6xl">
          <AnimatedSection animation="slideUp">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-2xl font-display font-bold text-slate-900">Jelajahi Berdasarkan Kategori</h2>
              <p className="text-sm text-slate-500 mt-2">
                Klik kategori untuk membuka katalog pintu layanan yang sesuai.
              </p>
            </div>
            <div className="space-y-6">
              {AUDIENCE_META.map((meta) => (
                <div key={meta.audience}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">{meta.label}</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {meta.chips.map((cat) => (
                      <Link
                        key={cat}
                        href={`${meta.href}#katalog`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:border-primary-400 hover:text-primary-700 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-300"
                      >
                        <Folder className="w-4 h-4 text-primary-600" aria-hidden="true" />
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============ 5. SERING DIGUNAKAN ============ */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <AnimatedSection animation="slideUp">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-slate-900">Sering Digunakan</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Delapan layanan yang paling sering dibutuhkan dalam kegiatan akademik sehari-hari.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {frequent.map((service) => (
                <ServiceLink key={service.id} service={service} />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============ 6. SISTEM INFORMASI & DOKUMEN ============ */}
      <section className="py-12 bg-light-bg">
        <div className="container mx-auto px-4 max-w-6xl">
          <AnimatedSection animation="slideUp">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sistem Informasi */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Laptop className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="font-bold text-slate-900">Sistem Informasi</h2>
                    <p className="text-xs text-slate-500">Akses portal sistem ITK untuk dosen dan tendik.</p>
                  </div>
                </div>
                <ul className="space-y-1">
                  {infoSystems.map((sys) => (
                    <li key={sys.id}>
                      <a
                        href={sys.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50/60 transition-colors group"
                      >
                        <span className="flex-1 text-sm font-medium text-slate-700 group-hover:text-blue-800">
                          {sys.name}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                          Buka
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dokumen & Template */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <FileSignature className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="font-bold text-slate-900">Dokumen &amp; Template</h2>
                    <p className="text-xs text-slate-500">Formulir baku dan arsip dokumen resmi.</p>
                  </div>
                </div>
                <ul className="space-y-1">
                  {docTemplates.map((doc) => (
                    <li key={doc.id}>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-50/60 transition-colors group"
                      >
                        <span className="flex-1 text-sm font-medium text-slate-700 group-hover:text-amber-800">
                          {doc.name}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                          Unduh
                        </span>
                        <Download className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
                <a
                  href="https://s.itk.ac.id/templateformulir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl text-xs transition-colors"
                >
                  <Folder className="w-4 h-4" aria-hidden="true" />
                  Semua Template Formulir FSTI
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" aria-hidden="true" />
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============ 7 + 8. CEK STATUS & PANDUAN ============ */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <AnimatedSection animation="slideUp">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cek Status Permohonan */}
              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <span className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                    <SearchIcon className="w-5 h-5" />
                  </span>
                  <h2 className="text-lg font-bold text-white mb-2">Cek Status Permohonan</h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    Pantau tahapan verifikasi tendik, pengesahan pimpinan, hingga surat siap diunduh — cukup
                    dengan nomor tiket atau NIM Anda.
                  </p>
                </div>
                <Link
                  href="/tracking"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  Cek Status Sekarang
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>

              {/* Panduan & Informasi */}
              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6">
                <span className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center mb-4">
                  <BookOpen className="w-5 h-5" />
                </span>
                <h2 className="text-lg font-bold text-white mb-4">Panduan &amp; Informasi</h2>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <Link
                      href="/panduan"
                      className="inline-flex items-center gap-2 text-slate-300 hover:text-amber-300 transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-amber-400" aria-hidden="true" />
                      Panduan &amp; video penggunaan layanan
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/peraturan-kebijakan"
                      className="inline-flex items-center gap-2 text-slate-300 hover:text-amber-300 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400" aria-hidden="true" />
                      SOP &amp; standar pelayanan
                    </Link>
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-4 h-4 text-amber-400" aria-hidden="true" />
                    Jam layanan: Senin–Jumat, 08.00–16.00 WITA
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-4 h-4 text-amber-400" aria-hidden="true" />
                    (0542) 8530801 · fsti@itk.ac.id
                  </li>
                </ul>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </MainLayout>
  );
}
