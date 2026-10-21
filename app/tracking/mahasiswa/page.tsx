"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import {
  Search,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Lock,
  ChevronLeft,
  ShieldAlert,
  ShieldCheck,
  User,
  GraduationCap,
  Calendar,
  Sparkles,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import {
  LetterRequest,
  getAllRequests,
  getRequestsByNim,
  getRequestByTicket,
  getStatusBadge,
  resetToDefaultMockData
} from '@/lib/letter-service';
import SurveyGatekeeperModal from '@/components/letter/SurveyGatekeeperModal';
import OfficialLetterView from '@/components/letter/OfficialLetterView';

function MahasiswaTrackingContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('nim') || searchParams.get('tiket') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [results, setResults] = useState<LetterRequest[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Modal States
  const [surveyTarget, setSurveyTarget] = useState<LetterRequest | null>(null);
  const [previewTarget, setPreviewTarget] = useState<LetterRequest | null>(null);

  const performSearch = async (query: string) => {
    const q = query.trim();
    setActiveQuery(q);
    setHasSearched(true);
    if (!q) {
      setResults([]);
      return;
    }

    const byTicket = await getRequestByTicket(q);
    if (byTicket) {
      // Find all requests belonging to the same NIM to provide complete personal history
      const byNim = await getRequestsByNim(byTicket.nim);
      setResults(byNim.length > 0 ? byNim : [byTicket]);
    } else {
      const byNim = await getRequestsByNim(q);
      setResults(byNim);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      void performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void performSearch(searchQuery);
  };


  const handleDownloadClick = (item: LetterRequest) => {
    if (item.status !== 'siap_diunduh') return;

    if (!item.isSurveyCompleted) {
      setSurveyTarget(item);
    } else {
      setPreviewTarget(item);
    }
  };

  const handleSurveyCompleted = (updated: LetterRequest) => {
    setSurveyTarget(null);
    // Refresh results list
    void performSearch(activeQuery);
    // Automatically open the official letter for printing/downloading
    setPreviewTarget(updated);
  };

  const stepList = [
    { key: 'diajukan', label: 'Diajukan' },
    { key: 'diverifikasi_tendik', label: 'Verifikasi Tendik' },
    { key: 'menunggu_pimpinan', label: 'Pengesahan Pimpinan' },
    { key: 'siap_diunduh', label: 'Siap Diunduh' },
  ];

  const getStepProgress = (status: string) => {
    switch (status) {
      case 'diajukan':
        return 1;
      case 'diverifikasi_tendik':
        return 2;
      case 'menunggu_pimpinan':
        return 3;
      case 'siap_diunduh':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <MainLayout>
      {/* Header */}
      <section className="relative py-12 md:py-16 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <AnimatedSection animation="slideUp">
            <Link
              href="/tracking"
              className="inline-flex items-center text-xs font-semibold text-slate-300 hover:text-white transition-colors mb-4 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Kembali ke Menu Tracking
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold mb-3">
              <ShieldCheck className="w-4 h-4" />
              Portal Tracking Mandiri Mahasiswa FSTI
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-white mb-3">
              Pelacakan Permohonan Surat Mahasiswa
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Sesuai standar privasi data FSTI, Anda hanya dapat melihat riwayat dan progres dokumen milik Anda sendiri. Masukkan NIM atau Nomor Tiket permohonan Anda.
            </p>

            {/* Search Box */}
            <form onSubmit={handleSearchSubmit} className="mt-8 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-2 bg-slate-800/90 p-2 rounded-2xl border border-slate-700 shadow-xl">
                <div className="flex-1 flex items-center px-4 bg-white rounded-xl">
                  <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Masukkan NIM Anda (contoh: 10211001) atau Nomor Tiket..."
                    className="w-full py-3.5 text-xs sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-slate-400 hover:text-slate-600 p-1"
                      title="Hapus"
                    >
                      <ExternalLink className="w-3.5 h-3.5 hidden" />
                      <span className="text-xs font-bold">✕</span>
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
                >
                  Cari Permohonan
                </button>
              </div>
            </form>

            {/* Demo Quick Chips for Evaluation */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
              <span className="font-semibold text-slate-200">Uji Coba Cepat (Data Demo):</span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('10211001');
                  performSearch('10211001');
                }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-amber-300 transition-colors border border-slate-700"
              >
                NIM 10211001 (Siap Diunduh & Test Survei)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('10211045');
                  performSearch('10211045');
                }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-blue-300 transition-colors border border-slate-700"
              >
                NIM 10211045 (Diproses Tendik)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('10211088');
                  performSearch('10211088');
                }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-purple-300 transition-colors border border-slate-700"
              >
                NIM 10211088 (Menunggu Pimpinan)
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 bg-slate-50 min-h-[500px]">
        <div className="container mx-auto px-4 max-w-4xl">
          {hasSearched ? (
            results.length > 0 ? (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
                  <h2 className="text-base sm:text-lg font-bold text-slate-800">
                    Ditemukan <span className="text-primary-600 font-extrabold">{results.length}</span> Permohonan untuk: <span className="font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{activeQuery}</span>
                  </h2>
                  <Link
                    href="/layanan-administrasi/ajukan"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-800 bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-200"
                  >
                    + Buat Pengajuan Baru
                  </Link>
                </div>

                {results.map((item) => {
                  const badge = getStatusBadge(item.status);
                  const progress = getStepProgress(item.status);

                  return (
                    <AnimatedSection key={item.id} animation="slideUp">
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:border-primary-400 hover:shadow-md transition-all">
                        {/* Header Permohonan */}
                        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-wrap items-start justify-between gap-4 bg-white">
                          <div className="space-y-1">
                            <span className="text-xs font-mono font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-200 inline-block">
                              {item.ticketNumber}
                            </span>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-2 font-display">
                              {item.serviceName}
                            </h3>
                            <p className="text-xs text-slate-500 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Diajukan pada: {item.createdAt}</span>
                            </p>
                          </div>

                          <div className={`px-3 py-1.5 rounded-full border text-xs font-bold inline-flex items-center gap-1.5 ${badge.bg}`}>
                            <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span>
                            <span>{badge.label}</span>
                          </div>
                        </div>

                        {/* Progress Stepper */}
                        <div className="px-6 py-5 bg-slate-50/70 border-b border-slate-100">
                          <div className="relative">
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-slate-200">
                              <div
                                style={{ width: `${(progress / 4) * 100}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-600 transition-all duration-500 rounded-full"
                              ></div>
                            </div>
                            <div className="grid grid-cols-4 gap-1 text-center">
                              {stepList.map((step, idx) => {
                                const isPassed = progress >= idx + 1;
                                const isCurrent = progress === idx + 1;
                                return (
                                  <div key={step.key} className="space-y-1">
                                    <div
                                      className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs font-bold transition-all ${
                                        isPassed
                                          ? 'bg-primary-600 text-white'
                                          : 'bg-slate-200 text-slate-500'
                                      } ${isCurrent ? 'ring-4 ring-primary-100 font-extrabold' : ''}`}
                                    >
                                      {idx + 1}
                                    </div>
                                    <p
                                      className={`text-[11px] font-medium leading-tight ${
                                        isPassed ? 'text-primary-800 font-semibold' : 'text-slate-400'
                                      }`}
                                    >
                                      {step.label}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Detail Info Pemohon */}
                        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="space-y-2.5 text-slate-700">
                            <div>
                              <span className="text-slate-400 block text-[11px]">Nama Pemohon:</span>
                              <span className="font-semibold text-slate-900 text-sm">{item.fullName}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[11px]">NIM:</span>
                              <span className="font-mono font-medium text-slate-900">{item.nim}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[11px]">Program Studi / Semester:</span>
                              <span className="text-slate-800">{item.studyProgram} · Semester {item.semester}</span>
                            </div>
                          </div>

                          <div className="space-y-2.5 text-slate-700">
                            <div>
                              <span className="text-slate-400 block text-[11px]">Keperluan Dokumen/Surat:</span>
                              <span className="font-medium text-slate-900">{item.purpose}</span>
                            </div>
                            {item.academicDocTypes && item.academicDocTypes.length > 0 && (
                              <div className="pt-2 border-t border-slate-100">
                                <span className="text-slate-400 block mb-1 text-[11px]">Dokumen yang Diajukan:</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {item.academicDocTypes.map((doc, idx) => (
                                    <span key={idx} className="bg-primary-50 border border-primary-200 text-primary-800 font-semibold px-2 py-0.5 rounded text-[11px]">
                                      {doc}
                                    </span>
                                  ))}
                                </div>
                                <span className="text-[11px] text-slate-500 block mt-1">
                                  Cakupan: {item.targetSemester || 'Semua Semester'} · Format: {item.outputFormat === 'cetak_hardcopy' ? 'Cetak Fisik TU' : 'Digital PDF'}
                                </span>
                              </div>
                            )}
                            {item.adminNotes && (
                              <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-amber-900">
                                <span className="font-bold block text-[11px]">Catatan Petugas:</span>
                                <span>{item.adminNotes}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Bar (Download & Survey Gate) */}
                        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                          <div className="text-xs text-slate-600 flex items-center gap-1.5">
                            {item.status === 'siap_diunduh' ? (
                              item.isSurveyCompleted ? (
                                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  Survei Selesai · Akses Dokumen Terbuka
                                </span>
                              ) : (
                                <span className="text-amber-800 font-medium flex items-center gap-1">
                                  <Lock className="w-4 h-4 text-amber-600" />
                                  Wajib mengisi survei kepuasan singkat untuk mengunduh
                                </span>
                              )
                            ) : (
                              <span className="text-slate-500 flex items-center gap-1">
                                <Clock className="w-4 h-4 text-slate-400" />
                                Surat sedang diproses oleh staf dan pimpinan FSTI
                              </span>
                            )}
                          </div>

                          <div>
                            {item.status === 'siap_diunduh' ? (
                              <button
                                onClick={() => handleDownloadClick(item)}
                                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition-all ${
                                  item.isSurveyCompleted
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-200'
                                    : 'bg-primary-600 hover:bg-primary-500 text-white shadow-primary-200'
                                }`}
                              >
                                {item.isSurveyCompleted ? (
                                  <>
                                    <Download className="w-4 h-4" />
                                    <span>Unduh Surat Resmi (PDF)</span>
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-4 h-4 text-amber-300" />
                                    <span>Isi Survei & Buka Unduh Surat</span>
                                  </>
                                )}
                              </button>
                            ) : (
                              <button
                                disabled
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-200 text-slate-400 rounded-xl text-xs font-semibold cursor-not-allowed"
                              >
                                <Lock className="w-3.5 h-3.5" />
                                Dokumen Belum Siap
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </AnimatedSection>
                  );
                })}
              </div>
            ) : (
              /* Not Found State */
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto space-y-4">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                  Permohonan Tidak Ditemukan
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Tidak ditemukan riwayat permohonan dengan kata kunci <span className="font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">&quot;{activeQuery}&quot;</span>. Pastikan Anda memasukkan NIM dengan benar atau gunakan nomor tiket lengkap.
                </p>
                <div className="pt-2">
                  <Link
                    href="/layanan-administrasi/ajukan"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors"
                  >
                    Buat Permohonan Surat Sekarang
                  </Link>
                </div>
              </div>
            )
          ) : (
            /* Initial State */
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-10 text-center max-w-lg mx-auto space-y-4">
              <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto border border-primary-100">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                Lacak Status Surat Anda
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Ketikkan NIM (contoh: 10211001) pada kolom pencarian di atas untuk melihat status verifikasi berkas, pengesahan pimpinan, dan mengunduh berkas surat resmi.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Survey Gatekeeper Modal */}
      {surveyTarget && (
        <SurveyGatekeeperModal
          request={surveyTarget}
          isOpen={Boolean(surveyTarget)}
          onClose={() => setSurveyTarget(null)}
          onSurveyCompleted={handleSurveyCompleted}
        />
      )}

      {/* Official Letter Preview (tampilan pembaca penuh, bukan PDF yang ditempel) */}
      {previewTarget && (
        <div
          className="letter-reader z-50 bg-white"
          role="dialog"
          aria-modal="true"
          aria-label="Pratinjau surat resmi"
        >
          <OfficialLetterView
            request={previewTarget}
            onClose={() => setPreviewTarget(null)}
            showPrintButton={true}
          />
        </div>
      )}
    </MainLayout>
  );
}

export default function MahasiswaTrackingPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">Memuat tracking...</div>}>
      <MahasiswaTrackingContent />
    </Suspense>
  );
}
