"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  GraduationCap,
  Briefcase,
  ArrowRight,
  Search,
  ShieldCheck,
  Clock,
  CheckCircle2,
  FileText,
  ExternalLink,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

const TrackingSelectionPage = () => {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [quickQuery, setQuickQuery] = useState('');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = quickQuery.trim();
    if (q) {
      router.push(`/tracking/mahasiswa?nim=${encodeURIComponent(q)}`);
    } else {
      router.push('/tracking/mahasiswa');
    }
  };

  return (
    <MainLayout>
      {/* Header Section */}
      <section className="relative py-14 md:py-20 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="container mx-auto px-4 relative z-10 max-w-5xl text-center">
          <AnimatedSection animation="slideUp">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 border border-primary-500/30 text-xs font-semibold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Pusat Pelacakan Dokumen FSTI ITK
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight text-white mb-4">
              {t('tracking.title')}
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              {t('tracking.description')}
            </p>

            {/* Quick Search Form for Students */}
            <form onSubmit={handleQuickSearch} className="max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-2 bg-slate-800/90 p-2 rounded-2xl border border-slate-700 shadow-xl">
                <div className="relative flex-1 flex items-center bg-white rounded-xl px-3.5">
                  <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    value={quickQuery}
                    onChange={(e) => setQuickQuery(e.target.value)}
                    placeholder={language === 'en' ? 'Quick check NIM (e.g. 10211001) or Ticket...' : 'Cek cepat NIM mahasiswa (cth: 10211001) atau Tiket...'}
                    className="w-full py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Cari Berkas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Masukkan NIM Anda untuk melihat langsung riwayat dan tahapan permohonan surat.
              </p>
            </form>
          </AnimatedSection>
        </div>
      </section>

      {/* Selection Cards Section */}
      <section className="relative py-14 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Card Mahasiswa */}
            <AnimatedSection animation="slideUp" delay={0.1} className="h-full">
              <div className="bg-white rounded-2xl border border-slate-200 hover:border-primary-400 hover:shadow-lg transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primary-600">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      Khusus Mahasiswa
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 mb-2">
                    {t('tracking.students')}
                  </h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    {t('tracking.studentDesc')}
                  </p>

                  {/* Fitur Utama */}
                  <div className="space-y-3 mb-8 pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-700">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Pelacakan berkas privat terisolasi berdasarkan NIM atau Nomor Tiket</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Surat Keterangan Aktif Studi, Pengantar KP, dan Rekomendasi</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Unduh langsung berkas resmi format PDF dengan tanda tangan dan barcode</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Link
                    href="/tracking/mahasiswa"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl text-sm transition-colors group"
                  >
                    <span>Buka Portal Tracking Mahasiswa</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            {/* Card Dosen & Tendik */}
            <AnimatedSection animation="slideUp" delay={0.2} className="h-full">
              <div className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Khusus Dosen & Tendik
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 mb-2">
                    {t('tracking.lecturerStaff')}
                  </h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    {t('tracking.lecturerDesc')}
                  </p>

                  {/* Fitur Utama */}
                  <div className="space-y-3 mb-8 pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-700">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Akses tabel live spreadsheet surat tugas dan nota dinas dekanat</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Pembaruan status disposisi langsung dari bagian Tata Usaha FSTI</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Pencarian cepat nama dosen atau perihal via Ctrl+F / Cmd+F</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Link
                    href="/tracking/dosen"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm transition-colors group"
                  >
                    <span>Buka Spreadsheet Tracking Dosen</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* 4 Standard Stages Explanation */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
              Arti 4 Tahapan Status Permohonan
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm">
              Memahami progres alur dokumen Anda dari pengajuan awal hingga berkas resmi selesai diterbitkan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">1</span>
                <h4 className="font-bold text-slate-800 text-sm">Diajukan</h4>
              </div>
              <p className="text-xs text-slate-600">
                Permohonan baru masuk ke sistem dan masuk ke dalam daftar antrean verifikasi TU.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-primary-700 text-xs font-bold flex items-center justify-center">2</span>
                <h4 className="font-bold text-slate-800 text-sm">Verifikasi Tendik</h4>
              </div>
              <p className="text-xs text-slate-600">
                Staf Tata Usaha memeriksa kelengkapan lampiran, keabsahan data, dan membubuhkan paraf.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center">3</span>
                <h4 className="font-bold text-slate-800 text-sm">Pengesahan Pimpinan</h4>
              </div>
              <p className="text-xs text-slate-600">
                Dokumen diajukan kepada Dekan atau Wakil Dekan untuk validasi akhir dan tanda tangan.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">4</span>
                <h4 className="font-bold text-slate-800 text-sm">Siap Diunduh / Selesai</h4>
              </div>
              <p className="text-xs text-slate-600">
                Dokumen sah telah terbit. Mahasiswa dapat mengunduh berkas PDF ber-barcode langsung di sistem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-14 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <AnimatedSection animation="slideUp">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight mb-2">
                {t('tracking.faq.title')}
              </h2>
              <p className="text-slate-600 text-sm">
                Pertanyaan seputar mekanisme pelacakan dan estimasi waktu proses berkas di FSTI ITK.
              </p>
            </div>
          </AnimatedSection>

          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-2">
                {t('tracking.faq.whatIs.question')}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {t('tracking.faq.whatIs.answer')}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-2">
                {t('tracking.faq.howToUse.question')}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {t('tracking.faq.howToUse.answer')}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-2">
                {t('tracking.faq.processingTime.question')}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {t('tracking.faq.processingTime.answer')}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-2">
                {t('tracking.faq.statusNotChanging.question')}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {t('tracking.faq.statusNotChanging.answer')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default TrackingSelectionPage;