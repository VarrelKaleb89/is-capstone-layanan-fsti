"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Eye,
  Check,
  X,
  UserCheck,
  ShieldCheck,
  Printer,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Lock,
  ChevronRight,
  Calendar,
  Layers,
  GraduationCap,
  Building2,
  PenTool,
  ChevronLeft
} from 'lucide-react';
import {
  LetterRequest,
  LetterStatus,
  getAllRequests,
  updateLetterStatus,
  getStatusBadge,
  resetToDefaultMockData
} from '@/lib/letter-service';
import OfficialLetterView from '@/components/letter/OfficialLetterView';
import SignatureManager from '@/components/letter/SignatureManager';
import Button from '@/components/ui/Button';

export default function AdminPortalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [loginRole, setLoginRole] = useState<'tendik' | 'pimpinan'>('tendik');
  const [requests, setRequests] = useState<LetterRequest[]>([]);
  const [role, setRole] = useState<'tendik' | 'pimpinan'>('tendik');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<LetterRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [showSignatureManager, setShowSignatureManager] = useState(false);
  const [signatureVersion, setSignatureVersion] = useState(0);

  const loadData = () => {
    setRequests(getAllRequests());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogin = (selectedRole: 'tendik' | 'pimpinan') => {
    setRole(selectedRole);
    setIsAuthenticated(true);
    showNotification(`Berhasil masuk sebagai ${selectedRole === 'tendik' ? 'Staf Tendik (Verifikator L1)' : 'Dekan / Pimpinan (Approver L2)'}`);
  };

  const handleResetData = () => {
    if (confirm('Kembalikan data permohonan ke data awal simulasi?')) {
      const reset = resetToDefaultMockData();
      setRequests(reset);
      setSelectedRequest(null);
      showNotification('Data permohonan berhasil direset ke data simulasi.');
    }
  };

  const showNotification = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  // Tendik Action: Verify & Forward to Leader
  const handleTendikVerify = (id: string) => {
    const updated = updateLetterStatus(id, 'menunggu_pimpinan', {
      adminNotes: 'Telah diverifikasi oleh staf tendik, berkas lengkap dan siap disahkan pimpinan.',
    });
    if (updated) {
      loadData();
      setSelectedRequest(updated);
      showNotification(`Permohonan ${updated.ticketNumber} berhasil diverifikasi dan dialirkan ke Dekan/Pimpinan.`);
    }
  };

  // Pimpinan Action: Sign and Publish
  const handlePimpinanApprove = (id: string) => {
    const updated = updateLetterStatus(id, 'siap_diunduh', {
      adminNotes: 'Surat resmi telah disahkan dan ditandatangani Dekan FSTI. Dokumen terkunci dan siap diunduh mahasiswa.',
    });
    if (updated) {
      loadData();
      setSelectedRequest(updated);
      showNotification(`Surat resmi ${updated.ticketNumber} telah disahkan dan berstatus SIAP DIUNDUH.`);
    }
  };

  // Reject / Request Revision Action
  const handleReject = (id: string) => {
    if (!rejectReason.trim()) {
      alert('Mohon cantumkan catatan perbaikan atau alasan penolakan.');
      return;
    }

    const updated = updateLetterStatus(id, 'ditolak', {
      adminNotes: `Catatan perbaikan (${role === 'tendik' ? 'Tendik' : 'Pimpinan'}): ${rejectReason.trim()}`,
    });
    if (updated) {
      loadData();
      setSelectedRequest(updated);
      setShowRejectInput(false);
      setRejectReason('');
      showNotification(`Status permohonan ${updated.ticketNumber} diperbarui menjadi PERLU REVISI.`);
    }
  };

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.nim.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'all') return true;
    if (filterStatus === 'perlu_tindakan') {
      if (role === 'tendik') return r.status === 'diajukan';
      if (role === 'pimpinan') return r.status === 'menunggu_pimpinan';
    }
    return r.status === filterStatus;
  });

  // Metric counts
  const totalCount = requests.length;
  const pendingTendik = requests.filter((r) => r.status === 'diajukan').length;
  const pendingPimpinan = requests.filter((r) => r.status === 'menunggu_pimpinan').length;
  const completedCount = requests.filter((r) => r.status === 'siap_diunduh').length;
  const rejectedCount = requests.filter((r) => r.status === 'ditolak').length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-md w-full relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 relative mx-auto mb-3">
              <Image
                src="/images/logofsti.png"
                alt="Logo FSTI"
                fill
                className="object-contain"
                sizes="64px"
              />
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              PORTAL INTERNAL FSTI ITK
            </span>
            <h1 className="text-2xl font-bold font-display text-white">
              Login Admin & Pimpinan
            </h1>
            <p className="text-xs text-slate-400">
              Akses khusus Tenaga Kependidikan (Tendik) dan Pimpinan Fakultas Sains dan Teknologi Informasi
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider text-center">
                Pilih Akses Cepat (Mode Demo / Pengujian):
              </p>
              
              <button
                type="button"
                onClick={() => handleLogin('tendik')}
                className="w-full p-4 rounded-xl border border-blue-500/40 bg-blue-950/40 hover:bg-blue-900/50 text-left transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span className="font-bold text-sm text-white group-hover:text-blue-300">
                      1. Staf Tendik (Bu Desy)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 pl-4">
                    Verifikator Lapis 1 · Pemeriksaan data pemohon & pembuatan draft
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => handleLogin('pimpinan')}
                className="w-full p-4 rounded-xl border border-purple-500/40 bg-purple-950/40 hover:bg-purple-900/50 text-left transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    <span className="font-bold text-sm text-white group-hover:text-purple-300">
                      2. Dekan / Pimpinan FSTI
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 pl-4">
                    Approver Lapis 2 · Pembubuhan TTD & Pengesahan Surat Resmi
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="pt-3 border-t border-slate-800 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Portal Publik Mahasiswa</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Header Panel Admin (Terpisah dari Portal Mahasiswa) */}
      <header className="bg-slate-950/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 relative flex-shrink-0">
              <Image
                src="/images/logofsti.png"
                alt="Logo FSTI"
                fill
                className="object-contain"
                sizes="40px"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  PORTAL INTERNAL ADMIN
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Back-Office Layanan Terpadu FSTI
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white leading-tight">
                Panel Verifikasi & Pengesahan Persuratan
              </h1>
            </div>
          </div>

          {/* Role Switcher & Back to Portal */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Simulation Role Selector */}
            <div className="bg-slate-800/90 p-1 rounded-xl border border-slate-700 flex items-center text-xs">
              <span className="px-2 text-slate-400 font-medium hidden md:inline">Peran:</span>
              <button
                type="button"
                onClick={() => setRole('tendik')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  role === 'tendik'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                1. Staf Tendik (L1)
              </button>
              <button
                type="button"
                onClick={() => setRole('pimpinan')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  role === 'pimpinan'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                2. Dekan / Pimpinan (L2)
              </button>
            </div>

            {role === 'pimpinan' && (
              <button
                type="button"
                onClick={() => setShowSignatureManager(true)}
                className="px-3 py-1.5 bg-purple-950/50 hover:bg-purple-900/70 text-purple-200 hover:text-white rounded-lg text-xs font-semibold border border-purple-700/50 transition-colors flex items-center gap-1.5"
                title="Kelola tanda tangan digital pimpinan"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kelola Tanda Tangan</span>
                <span className="sm:hidden">TTD</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAuthenticated(false)}
              className="px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-200 rounded-lg text-xs font-medium border border-rose-800/40 transition-colors"
              title="Keluar dari Panel Admin"
            >
              Logout
            </button>

            <Link
              href="/"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Portal Publik</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto px-4 py-8 flex-1">
        {/* Toast Notification */}
        {actionSuccessMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-sm flex items-center justify-between shadow-lg animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{actionSuccessMsg}</span>
            </div>
            <button
              onClick={() => setActionSuccessMsg(null)}
              className="text-emerald-400 hover:text-emerald-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Status Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl">
            <p className="text-xs text-slate-400 font-medium">Total Pengajuan</p>
            <p className="text-2xl font-bold text-white mt-1">{totalCount}</p>
          </div>
          <div
            className={`border p-4 rounded-xl transition-all ${
              role === 'tendik' && pendingTendik > 0
                ? 'bg-blue-900/30 border-blue-500/60 ring-2 ring-blue-500/20'
                : 'bg-slate-800/60 border-slate-700/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-blue-300 font-medium">Verifikasi Tendik (L1)</p>
              {role === 'tendik' && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500 text-white font-bold">Tugas Anda</span>
              )}
            </div>
            <p className="text-2xl font-bold text-blue-400 mt-1">{pendingTendik}</p>
          </div>
          <div
            className={`border p-4 rounded-xl transition-all ${
              role === 'pimpinan' && pendingPimpinan > 0
                ? 'bg-purple-900/30 border-purple-500/60 ring-2 ring-purple-500/20'
                : 'bg-slate-800/60 border-slate-700/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-purple-300 font-medium">Pengesahan Pimpinan (L2)</p>
              {role === 'pimpinan' && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500 text-white font-bold">Tugas Anda</span>
              )}
            </div>
            <p className="text-2xl font-bold text-purple-400 mt-1">{pendingPimpinan}</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl">
            <p className="text-xs text-emerald-300 font-medium">Siap Diunduh (Selesai)</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{completedCount}</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl col-span-2 sm:col-span-1">
            <p className="text-xs text-rose-300 font-medium">Perlu Revisi / Ditolak</p>
            <p className="text-2xl font-bold text-rose-400 mt-1">{rejectedCount}</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-800/70 border border-slate-700/70 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterStatus === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Semua ({totalCount})
            </button>
            <button
              onClick={() => setFilterStatus('perlu_tindakan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterStatus === 'perlu_tindakan'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Perlu Tindakan Saya (
              {role === 'tendik' ? pendingTendik : pendingPimpinan})
            </button>
            <button
              onClick={() => setFilterStatus('siap_diunduh')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterStatus === 'siap_diunduh'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Selesai ({completedCount})
            </button>
            <button
              onClick={() => setFilterStatus('ditolak')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterStatus === 'ditolak'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Ditolak ({rejectedCount})
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari NIM, Nama, Tiket..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <button
              onClick={handleResetData}
              title="Reset data ke default simulasi"
              className="p-2 bg-slate-700/70 hover:bg-slate-600 text-slate-300 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset Data Demo</span>
            </button>
          </div>
        </div>

        {/* Permohonan Table */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">No. Tiket & Tanggal</th>
                  <th className="py-3 px-4">Pemohon</th>
                  <th className="py-3 px-4">Jenis Surat</th>
                  <th className="py-3 px-4">Keperluan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((item) => {
                    const badge = getStatusBadge(item.status);
                    const isMyTurn =
                      (role === 'tendik' && item.status === 'diajukan') ||
                      (role === 'pimpinan' && item.status === 'menunggu_pimpinan');

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-slate-700/40 transition-colors ${
                          isMyTurn ? 'bg-blue-950/20' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-white block">{item.ticketNumber}</span>
                          <span className="text-[11px] text-slate-400">{item.createdAt}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-white block">{item.fullName}</span>
                          <span className="text-slate-400">
                            NIM: {item.nim} · {item.studyProgram}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-slate-200 font-medium block">{item.serviceName}</span>
                          <span className="text-[11px] text-slate-400">Semester {item.semester}</span>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs truncate text-slate-300">
                          {item.purpose}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border inline-flex items-center gap-1.5 ${badge.bg}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedRequest(item);
                              setShowRejectInput(false);
                            }}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                              isMyTurn
                                ? 'bg-primary-600 hover:bg-primary-500 text-white ring-2 ring-primary-400/30'
                                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{isMyTurn ? 'Proses Sekarang' : 'Detail & Draft'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      Tidak ada permohonan yang sesuai kriteria pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Detail & Mail Merge Preview */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl max-w-5xl w-full my-6 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    Detail Permohonan & Pratinjau Surat Auto-Fill
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Tiket: {selectedRequest.ticketNumber} · Status: {selectedRequest.statusLabel}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Split between Data Pemohon & Generated Official Letter */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50">
              {/* Kolom Kiri: Ringkasan Verifikasi */}
              <div className="lg:col-span-4 space-y-4 text-xs">
                {/* Data Mahasiswa */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2.5">
                  <h4 className="font-bold text-gray-900 border-b pb-2 text-sm">
                    Data Input Mahasiswa
                  </h4>
                  <div>
                    <span className="text-gray-500 block">Nama Lengkap:</span>
                    <span className="font-semibold text-gray-900">{selectedRequest.fullName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">NIM:</span>
                    <span className="font-mono font-medium text-gray-900">{selectedRequest.nim}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Program Studi:</span>
                    <span>{selectedRequest.studyProgram} ({selectedRequest.degree})</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Semester & Tahun:</span>
                    <span>{selectedRequest.semester} / {selectedRequest.academicYear}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Kontak:</span>
                    <span>WA: {selectedRequest.whatsapp}</span>
                    <span className="block text-gray-400">{selectedRequest.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Keperluan:</span>
                    <span className="font-medium text-gray-800">{selectedRequest.purpose}</span>
                  </div>
                  {selectedRequest.serviceType === 'dokumen-akademik' && (
                    <div className="pt-2 border-t border-gray-100 bg-primary-50/70 p-2.5 rounded-lg space-y-1">
                      <span className="font-bold text-primary-950 block">Dokumen Akademik Diminta:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedRequest.academicDocTypes?.map((doc, idx) => (
                          <span key={idx} className="bg-white border border-primary-300 text-primary-900 font-semibold px-2 py-0.5 rounded text-[10px]">
                            {doc}
                          </span>
                        ))}
                      </div>
                      <div className="text-[11px] text-primary-800 pt-1">
                        <span>Periode: <strong>{selectedRequest.targetSemester || 'Semua Semester'}</strong></span>
                        <span className="block">Format: <strong>{selectedRequest.outputFormat === 'cetak_hardcopy' ? 'Cetak Cap Basah (TU)' : 'Digital PDF'}</strong></span>
                      </div>
                    </div>
                  )}
                  {selectedRequest.parentName && (
                    <div className="pt-1 border-t border-gray-100">
                      <span className="text-gray-500 block">Orang Tua / Wali:</span>
                      <span>{selectedRequest.parentName} ({selectedRequest.parentJob || '-'})</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-gray-500 block">Berkas Lampiran:</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                      <FileText className="w-3.5 h-3.5" />
                      {selectedRequest.attachmentName || 'KRS_Mahasiswa.pdf'}
                    </span>
                  </div>
                </div>

                {/* Status & Catatan */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2">
                  <h4 className="font-bold text-gray-900 text-sm">Status Alur Berjenjang</h4>
                  <div className="space-y-1.5 text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${selectedRequest.status !== 'diajukan' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span>Verifikasi Tendik (L1): {selectedRequest.status === 'diajukan' ? 'Menunggu' : 'Selesai'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${selectedRequest.status === 'siap_diunduh' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                      <span>Pengesahan Dekan (L2): {selectedRequest.status === 'siap_diunduh' ? 'Disahkan & Terkunci' : 'Belum'}</span>
                    </div>
                  </div>
                  {selectedRequest.adminNotes && (
                    <div className="mt-3 p-2 bg-amber-50 rounded border border-amber-200 text-amber-900 text-[11px]">
                      <span className="font-bold block">Log Catatan:</span>
                      {selectedRequest.adminNotes}
                    </div>
                  )}
                </div>

                {/* Form Input Alasan Penolakan */}
                {showRejectInput && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 space-y-2">
                    <label className="block text-xs font-bold text-rose-900">
                      Alasan Penolakan / Catatan Perbaikan:
                    </label>
                    <textarea
                      rows={2}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Contoh: Berkas KRS tidak terbaca, mohon unggah ulang..."
                      className="w-full p-2 border border-rose-300 rounded text-xs bg-white text-gray-900"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setShowRejectInput(false)}
                        className="px-2.5 py-1 text-gray-500 hover:text-gray-700 text-xs"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => handleReject(selectedRequest.id)}
                        className="px-3 py-1 bg-rose-600 text-white rounded text-xs font-semibold hover:bg-rose-700"
                      >
                        Kirim Penolakan
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Kolom Kanan: Pratinjau Surat Auto-fill (Mail Merge Result) */}
              <div className="lg:col-span-8 flex flex-col">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex-1">
                  <div className="bg-gray-100 p-2.5 border-b border-gray-200 text-xs text-gray-700 font-semibold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-primary-600" />
                      Pratinjau Hasil Mail Merge Template Resmi FSTI
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Otomatis terisi data pemohon
                    </span>
                  </div>

                  <div className="p-2 sm:p-4 max-h-[580px] overflow-y-auto bg-gray-200/50">
                    <OfficialLetterView
                      key={signatureVersion}
                      request={selectedRequest}
                      showPrintButton={false}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer: Action Buttons Based on Role */}
            <div className="bg-white border-t border-gray-200 p-4 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
              <div className="text-xs text-gray-500">
                Mode aktif:{' '}
                <span className="font-bold text-gray-800">
                  {role === 'tendik' ? '1. Tendik Administrasi' : '2. Dekan / Pimpinan'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {!showRejectInput && (
                  <button
                    onClick={() => setShowRejectInput(true)}
                    className="px-4 py-2 border border-rose-300 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Minta Revisi / Tolak
                  </button>
                )}

                {/* Tendik Button */}
                {role === 'tendik' && (
                  <button
                    onClick={() => handleTendikVerify(selectedRequest.id)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verifikasi Berkas & Teruskan ke Pimpinan</span>
                  </button>
                )}

                {/* Pimpinan Button */}
                {role === 'pimpinan' && (
                  <button
                    onClick={() => handlePimpinanApprove(selectedRequest.id)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-200" />
                    <span>Setujui & Sahkan Surat Resmi (Kunci PDF)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Kelola Tanda Tangan Digital Pimpinan */}
      {showSignatureManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-50 text-slate-900 rounded-2xl shadow-2xl max-w-lg w-full my-6 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center text-white">
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    Kelola Tanda Tangan Pimpinan
                  </h3>
                  <p className="text-xs text-slate-400">
                    Tanda tangan otomatis ditempelkan ke seluruh surat yang disahkan
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSignatureManager(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <SignatureManager
                signerName={selectedRequest?.signedBy || 'Adi Mahmud Jaya Marindra, S.T., M.Eng., Ph.D.'}
                signerNip={selectedRequest?.signedNip || '198506152014041001'}
                onChange={() => setSignatureVersion((v) => v + 1)}
              />
            </div>

            <div className="bg-white border-t border-gray-200 p-4 flex justify-end flex-shrink-0">
              <button
                onClick={() => setShowSignatureManager(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
