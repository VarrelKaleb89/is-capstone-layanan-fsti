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
      <section className="relative py-12 md:py-14 overflow-hidden bg-gradient-to-br from-primary-50 to-gray-50">
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="slideUp">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-3 text-gradient">{t(`${i18nPrefix}.title`)}</h1>
              <p className="text-gray-700 text-lg mb-6">{t(`${i18nPrefix}.description`)}</p>
              <Link href="/tracking" className="inline-flex items-center text-primary-600 hover:text-primary-800 transition-colors">
                <ChevronLeft className="w-4 h-4 mr-1" />
                {t(`${i18nPrefix}.backToMain`)}
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Cara menggunakan */}
      <section className="relative pt-10 bg-white/80">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="slideUp">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      <span className="text-primary-600 mr-1">{i + 1}.</span>{step.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Spreadsheet embed */}
      <section className="relative py-8 bg-white/80">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="slideUp">
            <div
              className={
                isFullscreen
                  ? 'fixed inset-0 z-50 bg-white flex flex-col'
                  : 'max-w-6xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col'
              }
            >
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-primary-50 to-primary-100/60 border-b border-gray-100">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
                    <Sheet className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{en ? sheetTitle.en : sheetTitle.id}</p>
                    <p className="text-xs text-gray-500">
                      {en ? 'Read-only · updated live from the service desk' : 'Hanya-baca · diperbarui langsung oleh layanan'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReload}
                    title={en ? 'Reload' : 'Muat ulang'}
                    className="p-2 rounded-lg bg-white/80 border border-gray-200 text-gray-600 hover:bg-white hover:text-primary-700 transition-colors"
                  >
                    <RotateCw className={`w-4 h-4 ${isFrameLoading ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={() => setIsFullscreen((v) => !v)}
                    title={isFullscreen ? (en ? 'Exit full screen' : 'Keluar layar penuh') : (en ? 'Full screen' : 'Layar penuh')}
                    className="p-2 rounded-lg bg-white/80 border border-gray-200 text-gray-600 hover:bg-white hover:text-primary-700 transition-colors"
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                  <Button onClick={handleOpenInSheets} className="flex items-center text-sm !py-2">
                    <ExternalLink className="w-4 h-4 mr-1.5" />
                    <span className="hidden sm:inline">{en ? 'Open in Google Sheets' : 'Buka di Google Sheets'}</span>
                    <span className="sm:hidden">{en ? 'Open' : 'Buka'}</span>
                  </Button>
                </div>
              </div>

              {/* Frame */}
              <div className={`relative bg-gray-50 ${isFullscreen ? 'flex-1' : 'h-[75vh] min-h-[480px]'}`}>
                {isFrameLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-50 z-10">
                    <RotateCw className="w-8 h-8 text-primary-600 animate-spin" />
                    <p className="text-sm text-gray-500">{en ? 'Loading spreadsheet...' : 'Memuat spreadsheet...'}</p>
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
                <div className="px-4 py-3 text-xs text-gray-500 border-t border-gray-100 bg-white">
                  {en
                    ? 'Table not showing or hard to read on your phone? Use "Open in Google Sheets".'
                    : 'Tabel tidak muncul atau sulit dibaca di HP? Gunakan tombol "Buka di Google Sheets".'}
                </div>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Survey modal setelah membuka spreadsheet */}
      <AnimatePresence>
        {showSurveyModal && (
          <motion.div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white/95 backdrop-blur-md rounded-xl p-6 max-w-md mx-auto relative shadow-2xl border border-gray-200" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
              <button className="absolute top-3 right-3 text-gray-500 hover:bg-gray-100 p-1 rounded-full transition-colors" onClick={() => setShowSurveyModal(false)}><X className="w-5 h-5" /></button>
              <h2 className="text-xl font-bold mb-4">
                {en ? '🥺 Help us with a quick survey!' : '🥺 Bantu kami dengan survey singkat!'}
              </h2>
              <p className="mb-6 text-gray-600">
                {en
                  ? 'Your feedback means the world to us! It only takes 30 seconds...'
                  : 'Masukan Anda sangat berharga bagi kami! Hanya butuh 30 detik...'}
              </p>
              <div className="flex justify-end space-x-3 mt-2">
                <Button
                  variant="outline"
                  className="text-gray-600 border-gray-300 hover:bg-gray-50"
                  onClick={() => setShowSurveyModal(false)}
                >
                  {en ? '💔 Break Our Hearts' : '💔 Hancurkan Hati Kami'}
                </Button>
                <Button onClick={() => { setShowSurveyModal(false); router.push('/survey-kepuasan'); }}>
                  ❤️ Isi Survey
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ */}
      <section className="relative py-12 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="slideUp">
            <h2 className="text-2xl font-display font-bold text-center mb-8 text-gradient">{t(`${i18nPrefix}.faq.title`)}</h2>
          </AnimatedSection>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {['whatTypes', 'howToFind', 'processingTime', 'statusNotChanging'].map((key, i) => (
                <AnimatedSection key={key} animation="slideUp" delay={0.1 * (i + 1)}>
                  <details className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-4 group border border-gray-100 hover:border-primary-200 transition-colors">
                    <summary className="flex items-center justify-between cursor-pointer font-medium">
                      <div className="flex items-center text-gray-800">
                        <HelpCircle className="w-5 h-5 mr-3 text-primary-600" />
                        <span>{t(`${i18nPrefix}.faq.${key}.question`)}</span>
                      </div>
                      <div className="transition group-open:rotate-180">
                        <ChevronLeft className="w-5 h-5 -rotate-90 text-gray-500" />
                      </div>
                    </summary>
                    <div className="mt-4 ml-8 text-gray-600">
                      <p>{t(`${i18nPrefix}.faq.${key}.answer`)}</p>
                    </div>
                  </details>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default SpreadsheetTrackingPage;
