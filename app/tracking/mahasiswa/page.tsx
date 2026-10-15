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

  const performSearch = (query: string) => {
    const q = query.trim();
    setActiveQuery(q);
    setHasSearched(true);
    if (!q) {
      setResults([]);
      return;
    }

    const byTicket = getRequestByTicket(q);
    if (byTicket) {
      // Find all requests belonging to the same NIM to provide complete personal history
      const byNim = getRequestsByNim(byTicket.nim);
      setResults(byNim.length > 0 ? byNim : [byTicket]);
    } else {
      const byNim = getRequestsByNim(q);
      setResults(byNim);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
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
    performSearch(activeQuery);
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
      <section className="relative py-12 md:py-16 bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 text-white overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <AnimatedSection animation="slideUp">
            <Link
              href="/tracking"
              className="inline-flex items-center text-primary-200 hover:text-white transition-colors mb-4 text-sm"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Kembali ke Menu Tracking
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold mb-3">
              <ShieldCheck className="w-4 h-4" />
              Portal Tracking Mandiri & Privasi Terisolasi
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold">
              Pelacakan Permohonan Surat Mahasiswa
            </h1>
            <p className="text-primary-100 mt-3 text-sm md:text-base max-w-2xl mx-auto">
              Sesuai standar privasi data FSTI, Anda hanya dapat melihat riwayat dan progres dokumen milik Anda sendiri. Masukkan NIM atau Nomor Tiket permohonan Anda.
            </p>

            {/* Search Box */}
            <form onSubmit={handleSearchSubmit} className="mt-8 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl">
                <div className="flex-1 flex items-center px-4 bg-white rounded-xl">
                  <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Masukkan NIM Anda (contoh: 10211001) atau Nomor Tiket..."
                    className="w-full py-3.5 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="px-6 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl shadow-lg transition-all"
                >
                  Cari Permohonan
                </Button>
              </div>
            </form>

            {/* Demo Quick Chips for Evaluation */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-primary-200">
              <span className="font-semibold text-white/90">Uji Coba Cepat (Data Demo):</span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('10211001');
                  performSearch('10211001');
                }}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-amber-200 transition-colors border border-white/10"
              >
                NIM 10211001 (Siap Diunduh & Test Survei)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('10211045');
                  performSearch('10211045');
                }}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-blue-200 transition-colors border border-white/10"
              >
                NIM 10211045 (Diproses Tendik)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('10211088');
                  performSearch('10211088');
                }}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-purple-200 transition-colors border border-white/10"
              >
                NIM 10211088 (Menunggu Pimpinan)
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 bg-gray-50 min-h-[500px]">
        <div className="container mx-auto px-4 max-w-4xl">
          {hasSearched ? (
            results.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">
                    Ditemukan {results.length} Permohonan untuk: <span className="text-primary-700 font-mono">{activeQuery}</span>
                  </h2>
                  <Link
                    href="/layanan-administrasi/ajukan"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-800 bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100"
                  >
                    + Buat Pengajuan Baru
                  </Link>
                </div>

                {results.map((item) => {
                  const badge = getStatusBadge(item.status);
                  const progress = getStepProgress(item.status);

                  return (
                    <AnimatedSection key={item.id} animation="slideUp">
                      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                        {/* Header Permohonan */}
                        <div className="p-6 border-b border-gray-100 flex flex-wrap items-start justify-between gap-4 bg-gradient-to-r from-gray-50/50 to-white">
                          <div className="space-y-1">
                            <span className="text-xs font-mono font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-200">
                              {item.ticketNumber}
                            </span>
                            <h3 className="text-lg font-bold text-gray-900 mt-2">
                              {item.serviceName}
                            </h3>
                            <p className="text-xs text-gray-500 flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5" />
                              Diajukan pada: {item.createdAt}
                            </p>
                          </div>

                          <div className={`px-3 py-1.5 rounded-full border text-xs font-bold inline-flex items-center gap-1.5 ${badge.bg}`}>
                            <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span>
                            {badge.label}
                          </div>
                        </div>

                        {/* Progress Stepper */}
                        <div className="px-6 py-5 bg-primary-50/20 border-b border-gray-100">
                          <div className="relative">
                            <div className="overflow-hidden h-1.5 mb-4 text-xs flex rounded bg-gray-200">
                              <div
                                style={{ width: `${(progress / 4) * 100}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-600 transition-all duration-500"
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
                                          : 'bg-gray-200 text-gray-500'
                                      } ${isCurrent ? 'ring-4 ring-primary-100' : ''}`}
                                    >
                                      {idx + 1}
                                    </div>
                                    <p
                                      className={`text-[11px] font-medium leading-tight ${
                                        isPassed ? 'text-primary-800 font-semibold' : 'text-gray-400'
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
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="space-y-2 text-gray-700">
                            <div>
                              <span className="text-gray-400 block">Nama Pemohon:</span>
                              <span className="font-semibold text-gray-900">{item.fullName}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 block">NIM:</span>
                              <span className="font-mono font-medium text-gray-900">{item.nim}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 block">Program Studi / Semester:</span>
                              <span>{item.studyProgram} - Semester {item.semester}</span>
                            </div>
                          </div>

                          <div className="space-y-2 text-gray-700">
                            <div>
                              <span className="text-gray-400 block">Keperluan Surat:</span>
                              <span className="font-medium text-gray-900">{item.purpose}</span>
                            </div>
                            {item.adminNotes && (
                              <div className="bg-amber-50/70 p-2.5 rounded-lg border border-amber-200 text-amber-900">
                                <span className="font-bold block text-[11px]">Catatan Petugas:</span>
                                <span>{item.adminNotes}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Bar (Download & Survey Gate) */}
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                          <div className="text-xs text-gray-500 flex items-center gap-1.5">
                            {item.status === 'siap_diunduh' ? (
                              item.isSurveyCompleted ? (
                                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                  <CheckCircle2 className="w-4 h-4" />
                                  Survei Selesai · Akses Dokumen Terbuka
                                </span>
                              ) : (
                                <span className="text-amber-700 font-medium flex items-center gap-1">
                                  <Lock className="w-4 h-4" />
                                  Wajib mengisi survei kepuasan singkat untuk mengunduh
                                </span>
                              )
                            ) : (
                              <span className="text-gray-500 flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Surat sedang diproses oleh staf dan pimpinan FSTI
                              </span>
                            )}
                          </div>

                          <div>
                            {item.status === 'siap_diunduh' ? (
                              <button
                                onClick={() => handleDownloadClick(item)}
                                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all ${
                                  item.isSurveyCompleted
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                                    : 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-200'
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
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-200 text-gray-400 rounded-xl text-xs font-semibold cursor-not-allowed"
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
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-lg mx-auto space-y-4">
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  Permohonan Tidak Ditemukan
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Tidak ditemukan riwayat permohonan dengan kata kunci <span className="font-mono font-bold text-gray-700">"{activeQuery}"</span>. Pastikan Anda memasukkan NIM dengan benar atau gunakan nomor tiket lengkap.
                </p>
                <div className="pt-2">
                  <Link href="/layanan-administrasi/ajukan">
                    <Button variant="primary" className="text-xs">
                      Buat Permohonan Surat Sekarang
                    </Button>
                  </Link>
                </div>
              </div>
            )
          ) : (
            /* Initial State */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center max-w-lg mx-auto space-y-4">
              <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                Lacak Status Surat Anda
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
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

      {/* Official Letter Preview Modal */}
      {previewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-gray-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-6 overflow-hidden">
            <OfficialLetterView
              request={previewTarget}
              onClose={() => setPreviewTarget(null)}
              showPrintButton={true}
            />
          </div>
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
