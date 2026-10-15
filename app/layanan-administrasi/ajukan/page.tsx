"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import {
  FileText,
  CheckCircle2,
  ChevronLeft,
  ArrowRight,
  Upload,
  AlertCircle,
  Copy,
  Check,
  Building,
  User,
  GraduationCap,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  Clock,
  Sparkles,
  Lock
} from 'lucide-react';
import { createLetterRequest, LetterType, hasCompletedAccessSurvey } from '@/lib/letter-service';
import ServiceAccessSurveyModal from '@/components/survey/ServiceAccessSurveyModal';

function AjukanSuratContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialType = (searchParams.get('jenis') as LetterType) || 'surat-aktif-studi';

  const [serviceType, setServiceType] = useState<LetterType>(initialType);
  const [showAccessSurveyModal, setShowAccessSurveyModal] = useState(false);
  const [isSurveyVerified, setIsSurveyVerified] = useState(false);

  useEffect(() => {
    const verified = hasCompletedAccessSurvey();
    setIsSurveyVerified(verified);
    if (!verified) {
      setShowAccessSurveyModal(true);
    }
  }, []);

  const serviceNames: Record<LetterType, string> = {
    'surat-aktif-studi': 'Surat Keterangan Aktif Studi',
    'surat-pengantar-kp': 'Surat Pengantar Kerja Praktik (KP)',
    'surat-rekomendasi': 'Surat Rekomendasi Kemahasiswaan / Beasiswa',
    'dokumen-akademik': 'Permohonan Dokumen Akademik (Transkrip, KHS, FRS, SKL)',
    'legalisasi-dokumen': 'Permohonan Legalisasi Dokumen Akademik',
  };

  const initialSub = searchParams.get('sub');
  const getInitialDocs = () => {
    if (initialSub === 'transkrip') return ['Transkrip Nilai Sementara (Kumulatif)'];
    if (initialSub === 'khs') return ['Kartu Hasil Studi (KHS)'];
    if (initialSub === 'frs') return ['Formulir Rencana Studi (FRS)'];
    if (initialSub === 'skl') return ['Surat Keterangan Lulus (SKL)'];
    return ['Transkrip Nilai Sementara (Kumulatif)'];
  };

  const [fullName, setFullName] = useState('');
  const [nim, setNim] = useState('');
  const [studyProgram, setStudyProgram] = useState('Informatika');
  const [degree, setDegree] = useState('S1');
  const [semester, setSemester] = useState('7 (Tujuh)');
  const [academicYear, setAcademicYear] = useState('2026/2027');
  const [purpose, setPurpose] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentJob, setParentJob] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);

  // Specialized fields for Dokumen Akademik & Legalisasi
  const [academicDocTypes, setAcademicDocTypes] = useState<string[]>(getInitialDocs());
  const [targetSemester, setTargetSemester] = useState('Semua Semester (Kumulatif)');
  const [outputFormat, setOutputFormat] = useState<'digital_pdf' | 'cetak_hardcopy'>('digital_pdf');
  const [copiesCount, setCopiesCount] = useState(1);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const toggleDocType = (doc: string) => {
    setAcademicDocTypes((prev) =>
      prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]
    );
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Nama lengkap wajib diisi';
    if (!nim.trim()) {
      errs.nim = 'NIM wajib diisi';
    } else if (!/^\d{6,10}$/.test(nim.trim())) {
      errs.nim = 'Format NIM tidak valid (harus 6-10 digit angka)';
    }
    if ((serviceType === 'dokumen-akademik' || serviceType === 'legalisasi-dokumen') && academicDocTypes.length === 0) {
      errs.academicDocTypes = 'Pilih minimal satu jenis dokumen akademik yang diajukan';
    }
    if (!purpose.trim()) errs.purpose = 'Keperluan permohonan surat/dokumen wajib diisi';
    if (!whatsapp.trim()) errs.whatsapp = 'Nomor WhatsApp wajib diisi';
    if (!email.trim() || !email.includes('@')) errs.email = 'Email aktif kampus/pribadi wajib valid';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasCompletedAccessSurvey()) {
      setShowAccessSurveyModal(true);
      return;
    }
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newReq = createLetterRequest({
        serviceType,
        serviceName: serviceNames[serviceType],
        fullName: fullName.trim(),
        nim: nim.trim(),
        studyProgram,
        degree,
        semester,
        academicYear,
        purpose: purpose.trim(),
        parentName: parentName.trim() || undefined,
        parentJob: parentJob.trim() || undefined,
        whatsapp: whatsapp.trim(),
        email: email.trim(),
        attachmentName: attachment ? attachment.name : 'Bukti_KRS_KTM_Mahasiswa.pdf',
        academicDocTypes: (serviceType === 'dokumen-akademik' || serviceType === 'legalisasi-dokumen') ? academicDocTypes : undefined,
        targetSemester: serviceType === 'dokumen-akademik' ? targetSemester : undefined,
        outputFormat,
        copiesCount,
      });

      setIsSubmitting(false);
      setSubmittedTicket(newReq.ticketNumber);
    }, 700);
  };

  const handleCopyTicket = () => {
    if (submittedTicket) {
      navigator.clipboard.writeText(submittedTicket);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <MainLayout>
      {/* Header Banner */}
      <section className="relative py-12 bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 text-white overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="slideUp">
            <Link
              href="/layanan-administrasi"
              className="inline-flex items-center text-primary-200 hover:text-white transition-colors mb-4 text-sm"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Kembali ke Katalog Layanan
            </Link>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Sistem Otomasi Persuratan FSTI Mandiri
                </span>
                <h1 className="text-3xl md:text-4xl font-display font-bold">
                  Formulir Permohonan Surat Mahasiswa
                </h1>
                <p className="text-primary-100 mt-2 max-w-2xl text-sm md:text-base">
                  Isi data Anda dengan benar. Data akan otomatis diinjeksi ke dalam format surat resmi FSTI dan diverifikasi oleh staf tendik.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-xs space-y-1.5 hidden lg:block">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Estimasi Proses: 1 - 2 Hari Kerja</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary-300" />
                  <span>Dokumen PDF Terverifikasi & Terkunci</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {submittedTicket ? (
              /* Success Screen */
              <AnimatedSection animation="slideUp">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10 text-center space-y-6">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-pulse">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-display text-gray-900">
                      Permohonan Berhasil Dikirim!
                    </h2>
                    <p className="text-gray-600 text-sm mt-2 max-w-md mx-auto">
                      Permohonan surat Anda telah tersimpan ke dalam antrean sistem FSTI dan siap diverifikasi oleh staf tendik.
                    </p>
                  </div>

                  {/* Ticket Card */}
                  <div className="bg-primary-50 border-2 border-dashed border-primary-300 rounded-xl p-5 max-w-md mx-auto">
                    <p className="text-xs text-primary-700 font-medium uppercase tracking-wider">
                      Nomor Tiket Permohonan Anda
                    </p>
                    <div className="flex items-center justify-center gap-3 mt-2">
                      <span className="text-xl sm:text-2xl font-mono font-bold text-primary-900">
                        {submittedTicket}
                      </span>
                      <button
                        onClick={handleCopyTicket}
                        className="p-2 rounded-lg bg-white border border-primary-200 text-primary-700 hover:bg-primary-100 transition-colors shadow-sm"
                        title="Salin Nomor Tiket"
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-primary-600 mt-2">
                      Gunakan nomor tiket ini atau NIM Anda ({nim}) untuk melacak progres pada menu Tracking.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                    <Button
                      onClick={() => router.push(`/tracking/mahasiswa?nim=${encodeURIComponent(nim)}`)}
                      variant="primary"
                      className="flex items-center justify-center gap-2"
                    >
                      <span>Lacak Status Permohonan Sekarang</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSubmittedTicket(null);
                        setPurpose('');
                      }}
                    >
                      Ajukan Surat Lainnya
                    </Button>
                  </div>
                </div>
              </AnimatedSection>
            ) : (
              /* Application Form */
              <AnimatedSection animation="slideUp">
                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-10 space-y-8"
                >
                  {/* Prerequisite Survey Banner */}
                  {isSurveyVerified ? (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center justify-between">
                      <span className="flex items-center gap-2 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        Survei Kepuasan Terisi · Akses Formulir Layanan Dibuka
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowAccessSurveyModal(true)}
                        className="text-[11px] font-medium text-emerald-700 underline hover:text-emerald-950 ml-2"
                      >
                        Isi Ulang Survei
                      </button>
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-300 text-amber-900 p-4 rounded-xl text-xs space-y-2">
                      <div className="flex items-start gap-2.5">
                        <Lock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-amber-950">Prasyarat Layanan: Survei Kepuasan Belum Terisi</p>
                          <p className="text-amber-800 mt-0.5">
                            Sesuai ketentuan, mahasiswa diwajibkan mengisi survei kepuasan singkat (30 detik) terlebih dahulu sebelum mengakses dan mengirimkan formulir layanan administrasi.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAccessSurveyModal(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                        <span>Isi Survei Kepuasan Sekarang</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                      </button>
                    </div>
                  )}

                  {/* Step 1: Jenis Layanan */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-3 mb-4">
                      <span className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 text-sm font-bold flex items-center justify-center">
                        1
                      </span>
                      Pilih Jenis Layanan Persuratan / Dokumen
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {(
                        [
                          { id: 'surat-aktif-studi', label: 'Surat Aktif Studi', badge: 'Prioritas', desc: 'Surat keterangan aktif kuliah resmi FSTI' },
                          { id: 'dokumen-akademik', label: 'Dokumen Akademik (Transkrip/KHS/FRS)', badge: 'Mandiri Sistem', desc: 'Transkrip nilai, KHS, FRS, SKL langsung di sistem' },
                          { id: 'surat-pengantar-kp', label: 'Surat Pengantar KP', badge: 'Magang', desc: 'Pengantar kerja praktik ke instansi' },
                          { id: 'surat-rekomendasi', label: 'Surat Rekomendasi', badge: 'Beasiswa/Lomba', desc: 'Rekomendasi prestasi, lomba & beasiswa' },
                          { id: 'legalisasi-dokumen', label: 'Legalisasi Dokumen', badge: 'Legalisir Resmi', desc: 'Pengesahan transkrip, ijazah & sertifikat' },
                        ] as const
                      ).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setServiceType(item.id)}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            serviceType === item.id
                              ? 'bg-primary-50 border-primary-600 ring-2 ring-primary-500 shadow-sm'
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              item.id === 'dokumen-akademik'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {item.badge}
                            </span>
                            {serviceType === item.id && (
                              <CheckCircle2 className="w-4 h-4 text-primary-600" />
                            )}
                          </div>
                          <p className="font-semibold text-sm text-gray-900 mt-2">{item.label}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Data Mahasiswa */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-3 mb-4">
                      <span className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 text-sm font-bold flex items-center justify-center">
                        2
                      </span>
                      Data Identitas Mahasiswa
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Nama Lengkap Sesuai KTM / SIAKAD *
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Contoh: Ahmad Fauzi"
                          className={`w-full p-3 rounded-lg border text-sm ${
                            errors.fullName ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-primary-500'
                          }`}
                        />
                        {errors.fullName && (
                          <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Nomor Induk Mahasiswa (NIM) *
                        </label>
                        <input
                          type="text"
                          value={nim}
                          onChange={(e) => setNim(e.target.value)}
                          placeholder="Contoh: 10211001"
                          className={`w-full p-3 rounded-lg border text-sm font-mono ${
                            errors.nim ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-primary-500'
                          }`}
                        />
                        {errors.nim && <p className="text-xs text-red-500 mt-1">{errors.nim}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Program Studi *
                        </label>
                        <select
                          value={studyProgram}
                          onChange={(e) => setStudyProgram(e.target.value)}
                          className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:ring-primary-500"
                        >
                          <option value="Informatika">Informatika</option>
                          <option value="Sistem Informasi">Sistem Informasi</option>
                          <option value="Sains Data">Sains Data</option>
                          <option value="Teknik Elektro">Teknik Elektro</option>
                          <option value="Bisnis Digital">Bisnis Digital</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Semester Saat Ini *
                        </label>
                        <input
                          type="text"
                          value={semester}
                          onChange={(e) => setSemester(e.target.value)}
                          placeholder="Contoh: 7 (Tujuh)"
                          className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:ring-primary-500"
                        >
                        </input>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Tahun Akademik *
                        </label>
                        <input
                          type="text"
                          value={academicYear}
                          onChange={(e) => setAcademicYear(e.target.value)}
                          placeholder="Contoh: 2026/2027"
                          className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:ring-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Nomor WhatsApp Aktif *
                        </label>
                        <input
                          type="text"
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          placeholder="081234567890"
                          className={`w-full p-3 rounded-lg border text-sm ${
                            errors.whatsapp ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.whatsapp && (
                          <p className="text-xs text-red-500 mt-1">{errors.whatsapp}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Email Mahasiswa / Kampus *
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="nim@student.itk.ac.id"
                          className={`w-full p-3 rounded-lg border text-sm ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Keperluan & Data Khusus */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-3 mb-4">
                      <span className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 text-sm font-bold flex items-center justify-center">
                        3
                      </span>
                      Keperluan & Dokumen Pendukung
                    </h3>
                    <div className="space-y-4">
                      {/* Specialized Box: Pilihan Dokumen Akademik */}
                      {serviceType === 'dokumen-akademik' && (
                        <div className="bg-primary-50/50 border border-primary-200 rounded-xl p-5 space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-xs font-bold text-primary-950 uppercase tracking-wide">
                                Pilih Dokumen Akademik yang Diminta *
                              </label>
                              <span className="text-[11px] text-primary-700 font-medium">Bisa pilih lebih dari satu</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {[
                                { id: 'Transkrip Nilai Sementara (Kumulatif)', desc: 'Daftar seluruh nilai mata kuliah s/d semester berjalan' },
                                { id: 'Kartu Hasil Studi (KHS)', desc: 'Nilai semester tertentu yang telah disahkan' },
                                { id: 'Formulir Rencana Studi (FRS)', desc: 'Riwayat pengambilan SKS & kartu rencana studi' },
                                { id: 'Surat Keterangan Lulus (SKL)', desc: 'Surat bukti kelulusan yudisium sebelum wisuda' },
                              ].map((item) => {
                                const isChecked = academicDocTypes.includes(item.id);
                                return (
                                  <label
                                    key={item.id}
                                    onClick={() => toggleDocType(item.id)}
                                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                      isChecked
                                        ? 'bg-white border-primary-600 shadow-sm ring-1 ring-primary-500'
                                        : 'bg-white/70 border-gray-200 hover:border-primary-300'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => {}}
                                      className="mt-1 rounded text-primary-600 focus:ring-primary-500"
                                    />
                                    <div>
                                      <p className="text-xs font-bold text-gray-900">{item.id}</p>
                                      <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                            {errors.academicDocTypes && (
                              <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.academicDocTypes}</p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-primary-100">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Cakupan Periode / Semester Dokumen *
                              </label>
                              <select
                                value={targetSemester}
                                onChange={(e) => setTargetSemester(e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-gray-300 text-xs bg-white focus:ring-primary-500"
                              >
                                <option value="Semua Semester (Kumulatif Lengkap)">Semua Semester (Kumulatif Lengkap)</option>
                                <option value="Semester Genap 2025/2026">Semester Genap 2025/2026</option>
                                <option value="Semester Ganjil 2025/2026">Semester Ganjil 2025/2026</option>
                                <option value="Semester Genap 2024/2025">Semester Genap 2024/2025</option>
                                <option value="Semester Ganjil 2024/2025">Semester Ganjil 2024/2025</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Format Luaran Dokumen *
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => setOutputFormat('digital_pdf')}
                                  className={`p-2 rounded-lg border text-xs font-medium text-center transition-all ${
                                    outputFormat === 'digital_pdf'
                                      ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                  }`}
                                >
                                  Digital PDF (E-Sign)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setOutputFormat('cetak_hardcopy')}
                                  className={`p-2 rounded-lg border text-xs font-medium text-center transition-all ${
                                    outputFormat === 'cetak_hardcopy'
                                      ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                  }`}
                                >
                                  Cetak Cap Basah (TU)
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Specialized Box: Legalisasi Dokumen */}
                      {serviceType === 'legalisasi-dokumen' && (
                        <div className="bg-primary-50/50 border border-primary-200 rounded-xl p-5 space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-primary-950 uppercase tracking-wide mb-2">
                              Pilih Berkas yang Ingin Dilegalisasi *
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {[
                                'Transkrip Nilai Akademik',
                                'Kartu Hasil Studi (KHS)',
                                'Ijazah / Surat Keterangan Lulus (SKL)',
                                'Sertifikat Akreditasi Program Studi / Fakultas',
                              ].map((item) => {
                                const isChecked = academicDocTypes.includes(item);
                                return (
                                  <label
                                    key={item}
                                    onClick={() => toggleDocType(item)}
                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                      isChecked
                                        ? 'bg-white border-primary-600 shadow-sm ring-1 ring-primary-500'
                                        : 'bg-white/70 border-gray-200 hover:border-primary-300'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => {}}
                                      className="rounded text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-xs font-bold text-gray-900">{item}</span>
                                  </label>
                                );
                              })}
                            </div>
                            {errors.academicDocTypes && (
                              <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.academicDocTypes}</p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-primary-100">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Jumlah Rangkap Salinan Legalisir
                              </label>
                              <select
                                value={copiesCount}
                                onChange={(e) => setCopiesCount(Number(e.target.value))}
                                className="w-full p-2.5 rounded-lg border border-gray-300 text-xs bg-white focus:ring-primary-500"
                              >
                                <option value={1}>1 Rangkap</option>
                                <option value={2}>2 Rangkap</option>
                                <option value={3}>3 Rangkap</option>
                                <option value={5}>5 Rangkap (Maksimal)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Format Pengesahan Legalisir
                              </label>
                              <select
                                value={outputFormat}
                                onChange={(e) => setOutputFormat(e.target.value as any)}
                                className="w-full p-2.5 rounded-lg border border-gray-300 text-xs bg-white focus:ring-primary-500"
                              >
                                <option value="digital_pdf">E-Legalisir Digital (QR E-Verifikasi)</option>
                                <option value="cetak_hardcopy">Cap Basah Stempel Fisik (Ambil di TU)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Keperluan Permohonan {serviceType === 'dokumen-akademik' ? 'Dokumen' : 'Surat'} *
                        </label>
                        <textarea
                          rows={3}
                          value={purpose}
                          onChange={(e) => setPurpose(e.target.value)}
                          placeholder="Contoh: Pengurusan Tunjangan Gaji Orang Tua / Syarat BPJS Kesehatan / Pengajuan Beasiswa Unggulan"
                          className={`w-full p-3 rounded-lg border text-sm ${
                            errors.purpose ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.purpose && (
                          <p className="text-xs text-red-500 mt-1">{errors.purpose}</p>
                        )}
                      </div>

                      {serviceType === 'surat-aktif-studi' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                              Nama Orang Tua / Wali (Opsional)
                            </label>
                            <input
                              type="text"
                              value={parentName}
                              onChange={(e) => setParentName(e.target.value)}
                              placeholder="Diisi jika diperlukan untuk tunjangan"
                              className="w-full p-2.5 rounded-lg border border-gray-300 text-xs bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                              Pekerjaan / Instansi Orang Tua (Opsional)
                            </label>
                            <input
                              type="text"
                              value={parentJob}
                              onChange={(e) => setParentJob(e.target.value)}
                              placeholder="Contoh: PNS / TNI / POLRI / BUMN"
                              className="w-full p-2.5 rounded-lg border border-gray-300 text-xs bg-white"
                            />
                          </div>
                        </div>
                      )}

                      {/* File Upload Simulation */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Unggah Berkas Pendukung (KRS / KTM / Bukti Bayar UKT)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <Upload className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                          <p className="text-xs text-gray-700 font-medium">
                            {attachment ? attachment.name : 'Klik atau seret file PDF / JPG ke sini'}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            Maksimal ukuran file 5 MB (Format: PDF, JPG, PNG)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      href="/layanan-administrasi"
                      className="text-xs sm:text-sm text-gray-500 hover:text-gray-800"
                    >
                      Batal
                    </Link>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-md"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Mengirim Permohonan...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <span>Kirim Permohonan Surat</span>
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </AnimatedSection>
            )}
          </div>
        </div>
      </section>

      {/* Prerequisite Survey Modal */}
      <ServiceAccessSurveyModal
        isOpen={showAccessSurveyModal}
        onClose={() => setShowAccessSurveyModal(false)}
        onSuccess={() => {
          setIsSurveyVerified(true);
          setShowAccessSurveyModal(false);
        }}
        targetServiceName={serviceNames[serviceType]}
      />
    </MainLayout>
  );
}

export default function AjukanSuratPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">Memuat formulir...</div>}>
      <AjukanSuratContent />
    </Suspense>
  );
}
