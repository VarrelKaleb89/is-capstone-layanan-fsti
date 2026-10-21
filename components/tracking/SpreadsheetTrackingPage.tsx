"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useRouter } from 'next/navigation';
import {
  HelpCircle,
  RotateCw,
  ChevronLeft,
  ExternalLink,
  X,
  Maximize2,
  Minimize2,
  Search,
  Layers,
  FileText,
  Sheet,
} from 'lucide-react';

interface Bilingual {
  id: string;
  en: string;
}

interface SpreadsheetTrackingPageProps {
  /** Spreadsheet harus dibagikan "Siapa saja yang memiliki link: Viewer" */
  spreadsheetId: string;
  /** Prefix key i18n, mis. 'studentTracking' atau 'lecturerTracking' */
  i18nPrefix: string;
  sheetTitle: Bilingual;
  searchHint: Bilingual;
}

const SpreadsheetTrackingPage = ({ spreadsheetId, i18nPrefix, sheetTitle, searchHint }: SpreadsheetTrackingPageProps) => {
  const [isFrameLoading, setIsFrameLoading] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [frameKey, setFrameKey] = useState<number>(0);
  const [showSurveyModal, setShowSurveyModal] = useState(false);

  const { t, language } = useLanguage();
  const router = useRouter();
  const en = language === 'en';

  const embedUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/htmlview?rm=minimal`;
  const openUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?usp=sharing`;

  // Tutup mode layar penuh dengan tombol Escape
  useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsFullscreen(false); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  const handleReload = () => {
    setIsFrameLoading(true);
    setFrameKey((k) => k + 1);
  };

  const handleOpenInSheets = () => {
    window.open(openUrl, '_blank', 'noopener,noreferrer');
    setShowSurveyModal(true);
  };

  const steps = [
    {
      icon: <Layers className="w-5 h-5 text-primary-600" />,
      title: en ? 'Choose the tab' : 'Pilih tab',
      desc: en ? 'Pick your document type from the tabs at the top of the sheet.' : 'Pilih jenis dokumen Anda dari tab di bagian atas tabel.',
    },
    {
      icon: <Search className="w-5 h-5 text-primary-600" />,
      title: en ? 'Find your request' : 'Cari permohonan Anda',
      desc: en ? searchHint.en : searchHint.id,
    },
    {
      icon: <FileText className="w-5 h-5 text-primary-600" />,
      title: en ? 'Check status & link' : 'Cek status & link',
      desc: en ? 'See the Status, Keterangan, and LINK columns on your row.' : 'Lihat kolom Status, Keterangan, dan LINK pada baris Anda.',
    },
  ];

  return (
    <MainLayout>
      {/* Header */}
      <section className="relative py-12 md:py-16 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="container mx-auto px-4 relative z-10 max-w-5xl">
          <AnimatedSection animation="slideUp">
            <div className="text-center max-w-3xl mx-auto">
              <Link
                href="/tracking"
                className="inline-flex items-center text-xs font-semibold text-slate-300 hover:text-white transition-colors mb-3 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                {t(`${i18nPrefix}.backToMain`)}
              </Link>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold tracking-tight text-white mb-3">
                {t(`${i18nPrefix}.title`)}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {t(`${i18nPrefix}.description`)}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Cara menggunakan */}
      <section className="relative py-8 bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <AnimatedSection animation="slideUp">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100">
                    {step.icon}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">
                      <span className="text-primary-600 mr-1.5">{i + 1}.</span>{step.title}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Spreadsheet embed */}
      <section className="relative py-8 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <AnimatedSection animation="slideUp">
            <div
              className={
                isFullscreen
                  ? 'fixed inset-0 z-50 bg-white flex flex-col'
                  : 'bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col'
              }
            >
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                    <Sheet className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-sm truncate">{en ? sheetTitle.en : sheetTitle.id}</p>
                    <p className="text-xs text-slate-500">
                      {en ? 'Live read-only register from FSTI Service Desk' : 'Register live hanya-baca diperbarui langsung oleh TU FSTI'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReload}
                    title={en ? 'Reload' : 'Muat ulang'}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-primary-600 hover:border-primary-300 transition-colors"
                  >
                    <RotateCw className={`w-4 h-4 ${isFrameLoading ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={() => setIsFullscreen((v) => !v)}
                    title={isFullscreen ? (en ? 'Exit full screen' : 'Keluar layar penuh') : (en ? 'Full screen' : 'Layar penuh')}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-primary-600 hover:border-primary-300 transition-colors"
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleOpenInSheets}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-lg text-xs sm:text-sm transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="hidden sm:inline">{en ? 'Open in Google Sheets' : 'Buka di Google Sheets'}</span>
                    <span className="sm:hidden">{en ? 'Sheets' : 'Buka'}</span>
                  </button>
                </div>
              </div>

              {/* Frame */}
              <div className={`relative bg-slate-100 ${isFullscreen ? 'flex-1' : 'h-[75vh] min-h-[480px]'}`}>
                {isFrameLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-50/90 z-10">
                    <RotateCw className="w-8 h-8 text-primary-600 animate-spin" />
                    <p className="text-xs sm:text-sm font-medium text-slate-600">{en ? 'Loading spreadsheet...' : 'Memuat data spreadsheet...'}</p>
                  </div>
                )}
                <iframe
                  key={frameKey}
                  src={embedUrl}
                  title={en ? sheetTitle.en : sheetTitle.id}
                  className="w-full h-full border-0"
                  onLoad={() => setIsFrameLoading(false)}
                  loading="lazy"
                />
              </div>

              {!isFullscreen && (
                <div className="px-4 py-2.5 text-xs text-slate-500 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span>
                    {en
                      ? 'Tips: Click the spreadsheet area and press Ctrl+F to search by name or NIP.'
                      : 'Tips: Klik area tabel lalu tekan Ctrl+F (Cmd+F di Mac) untuk mencari permohonan.'}
                  </span>
                  <button
                    onClick={handleOpenInSheets}
                    className="text-primary-600 font-semibold hover:underline hidden sm:inline"
                  >
                    {en ? 'Trouble viewing? Open in new tab' : 'Sulit membaca di HP? Buka di tab baru'}
                  </button>
                </div>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Professional Survey Modal */}
      <AnimatePresence>
        {showSurveyModal && (
          <motion.div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-[60] px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 sm:p-7 max-w-md mx-auto relative shadow-2xl border border-slate-200 w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                onClick={() => setShowSurveyModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-primary-600 mb-3">
                <Sheet className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Evaluasi Pelayanan FSTI</span>
              </div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 mb-2">
                {en ? 'Help Us Improve FSTI Services' : 'Bantu Evaluasi Layanan FSTI ITK'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                {en
                  ? 'Your feedback helps us continuously improve the administration and service quality at FSTI ITK. It only takes 30 seconds.'
                  : 'Masukan dan evaluasi Anda sangat berharga untuk perbaikan kualitas layanan administrasi terpadu di FSTI ITK. Hanya membutuhkan waktu 30 detik.'}
              </p>
              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
                <button
                  type="button"
                  className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors text-center"
                  onClick={() => setShowSurveyModal(false)}
                >
                  {en ? 'Maybe Later' : 'Nanti Saja'}
                </button>
                <button
                  type="button"
                  className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-semibold bg-primary-600 hover:bg-primary-500 text-white rounded-xl shadow-sm transition-colors text-center"
                  onClick={() => {
                    setShowSurveyModal(false);
                    router.push('/survey-kepuasan');
                  }}
                >
                  {en ? 'Take Quick Survey' : 'Isi Survei Kepuasan'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* FAQ */}
      <section className="relative py-12 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <AnimatedSection animation="slideUp">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-center mb-8 text-slate-900">{t(`${i18nPrefix}.faq.title`)}</h2>
          </AnimatedSection>

          <div className="space-y-3">
            {['whatTypes', 'howToFind', 'processingTime', 'statusNotChanging'].map((key, i) => (
              <AnimatedSection key={key} animation="slideUp" delay={0.05 * (i + 1)}>
                <details className="bg-white rounded-xl shadow-sm p-4 group border border-slate-200 hover:border-primary-300 transition-colors">
                  <summary className="flex items-center justify-between cursor-pointer font-semibold text-slate-800 text-sm">
                    <div className="flex items-center pr-3">
                      <HelpCircle className="w-4 h-4 mr-2.5 text-primary-600 flex-shrink-0" />
                      <span>{t(`${i18nPrefix}.faq.${key}.question`)}</span>
                    </div>
                    <div className="transition group-open:rotate-180 flex-shrink-0">
                      <ChevronLeft className="w-4 h-4 -rotate-90 text-slate-400" />
                    </div>
                  </summary>
                  <div className="mt-3 pl-6.5 text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
                    <p>{t(`${i18nPrefix}.faq.${key}.answer`)}</p>
                  </div>
                </details>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default SpreadsheetTrackingPage;
