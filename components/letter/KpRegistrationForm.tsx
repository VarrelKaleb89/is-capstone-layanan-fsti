'use client';

import { useMemo, useState } from 'react';
import {
  ChevronLeft,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  X,
  Users,
  User,
  Building2,
  CalendarRange,
  Loader2,
  ClipboardCheck,
} from 'lucide-react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { KP_DOC_RULES, JURUSAN_PRODI, hitungDurasiBulan, formatPeriodeIndo } from '@/lib/kp-utils';
import type { FieldError } from '@/app/api/kp/register/route';

interface KpRegistrationFormProps {
  onSubmitted?: (ticketNumber: string) => void;
}

type FileState = { file: File } | null;

const DOC_HINTS: Record<string, string> = {
  form_kp_001: 'Unduh Form KP-001 di s.itk.ac.id/templateformulir, isi, pindai ke PDF.',
  transkrip: 'Transkrip nilai yang telah disahkan/dilegalisir kampus.',
  proposal: 'Proposal KP yang telah disahkan oleh Dosen Pembimbing dan Koordinator Program Studi.',
  persetujuan_mitra: 'Screenshot persetujuan mitra atau lampiran format khusus surat.',
  pengunduran_diri: 'Wajib hanya jika sebelumnya sudah terdaftar pada mitra lain.',
};

export default function KpRegistrationForm({ onSubmitted }: KpRegistrationFormProps) {
  // ---- Seksi 1: Informasi Pemohon ----
  const [registrationType, setRegistrationType] = useState<'individu' | 'kelompok'>('individu');
  const [fullName, setFullName] = useState('');
  const [nim, setNim] = useState('');
  const [pemohon2Nama, setPemohon2Nama] = useState('');
  const [pemohon2Nim, setPemohon2Nim] = useState('');
  const [jurusan, setJurusan] = useState('');
  const [studyProgram, setStudyProgram] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');

  // ---- Seksi 2: Persyaratan ----
  const [sksLulus, setSksLulus] = useState('');
  const [files, setFiles] = useState<Record<string, FileState>>({});

  // ---- Seksi 3: Rencana Mitra KP ----
  const [mitraNama, setMitraNama] = useState('');
  const [mitraAlamat, setMitraAlamat] = useState('');
  const [periodeMulai, setPeriodeMulai] = useState('');
  const [periodeSelesai, setPeriodeSelesai] = useState('');

  // ---- State pengiriman ----
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  // Prodi menyesuaikan jurusan (blueprint §1).
  const prodiOptions = useMemo(() => JURUSAN_PRODI[jurusan] ?? [], [jurusan]);

  // Durasi dihitung otomatis dari periode — sumber utama (blueprint §4).
  const durasiBulan = useMemo(() => {
    if (!periodeMulai || !periodeSelesai) return 0;
    const a = new Date(`${periodeMulai}T00:00:00`);
    const b = new Date(`${periodeSelesai}T00:00:00`);
    if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime()) || b <= a) return 0;
    return hitungDurasiBulan(a, b);
  }, [periodeMulai, periodeSelesai]);

  const setFile = (kind: string, file: File | null) => {
    const state: FileState = file ? { file } : null;
    setFiles((prev) => ({ ...prev, [kind]: state }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[kind];
      return next;
    });
  };

  /** Validasi frontend — pesan di dekat field, data dipertahankan (blueprint §5). */
  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    const nimRe = /^10\d{6}$/;
    const phoneRe = /^(\+62|62|0)8\d{7,12}$/;

    if (!fullName.trim()) errs.fullName = 'Nama Pemohon 1 wajib diisi.';
    if (!nim.trim() || !nimRe.test(nim.trim())) errs.nim = 'NIM wajib diisi dengan format 10XXXXXXX.';
    if (registrationType === 'kelompok') {
      if (!pemohon2Nama.trim()) errs.pemohon2Nama = 'Nama Pemohon 2 wajib diisi untuk KP kelompok.';
      if (!pemohon2Nim.trim() || !nimRe.test(pemohon2Nim.trim()))
        errs.pemohon2Nim = 'NIM Pemohon 2 wajib diisi dengan format 10XXXXXXX.';
      else if (nim.trim() === pemohon2Nim.trim())
        errs.pemohon2Nim = 'NIM Pemohon 2 tidak boleh sama dengan Pemohon 1.';
    }
    if (!jurusan) errs.jurusan = 'Jurusan wajib dipilih.';
    if (!studyProgram) errs.studyProgram = 'Program Studi wajib dipilih.';
    if (!whatsapp.trim() || !phoneRe.test(whatsapp.replace(/[\s-]/g, '')))
      errs.whatsapp = 'Nomor telepon tidak valid (contoh: 081234567890).';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errs.email = 'Email ITK tidak valid.';

    const sks = Number(sksLulus);
    if (!sksLulus || !Number.isInteger(sks) || sks < 72)
      errs.sksLulus = 'Jumlah SKS lulus minimal 72 (angka bulat).';

    for (const [kind, rule] of Object.entries(KP_DOC_RULES)) {
      const f = files[kind]?.file;
      const wajib = kind !== 'pengunduran_diri';
      if (wajib && !f) {
        errs[kind] = `${rule.label} wajib diunggah.`;
        continue;
      }
      if (f) {
        if (!(rule.accept as readonly string[]).includes(f.type)) {
          errs[kind] = `Format .${f.name.split('.').pop()} tidak diizinkan (harus PDF).`;
        } else if (f.size > rule.maxMB * 1024 * 1024) {
          errs[kind] = `Ukuran melebihi ${rule.maxMB} MB.`;
        }
      }
    }

    if (!mitraNama.trim()) errs.mitraNama = 'Nama Mitra wajib diisi.';
    if (!mitraAlamat.trim()) errs.mitraAlamat = 'Alamat Mitra wajib diisi.';
    if (!periodeMulai) errs.periodeMulai = 'Tanggal mulai KP wajib dipilih.';
    if (!periodeSelesai) errs.periodeSelesai = 'Tanggal selesai KP wajib dipilih.';
    if (periodeMulai && periodeSelesai) {
      if (periodeSelesai < periodeMulai)
        errs.periodeSelesai = 'Tanggal selesai tidak boleh lebih awal daripada tanggal mulai.';
      else if (durasiBulan < 1) errs.periodeSelesai = 'Periode KP minimal berdurasi 1 bulan penuh.';
    }

    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // cegah pengiriman ganda (blueprint §5)

    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      const first = document.querySelector('[data-error="true"]');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.set('registrationType', registrationType);
      fd.set('fullName', fullName);
      fd.set('nim', nim);
      fd.set('pemohon2Nama', pemohon2Nama);
      fd.set('pemohon2Nim', pemohon2Nim);
      fd.set('jurusan', jurusan);
      fd.set('studyProgram', studyProgram);
      fd.set('whatsapp', whatsapp);
      fd.set('email', email);
      fd.set('sksLulus', sksLulus);
      fd.set('mitraNama', mitraNama);
      fd.set('mitraAlamat', mitraAlamat);
      fd.set('periodeMulai', periodeMulai);
      fd.set('periodeSelesai', periodeSelesai);
      for (const kind of Object.keys(KP_DOC_RULES)) {
        const f = files[kind]?.file;
        if (f) fd.set(kind, f);
      }

      const res = await fetch('/api/kp/register', { method: 'POST', body: fd });
      const data = (await res.json()) as {
        request?: { ticketNumber: string };
        errors?: FieldError[];
        message?: string;
        error?: string;
      };

      if (!res.ok || !data.request) {
        // Validasi server → petakan ke field yang sesuai
        if (data.errors) {
          const server: Record<string, string> = {};
          for (const fe of data.errors) server[fe.field] = fe.message;
          setFieldErrors(server);
        } else {
          setFieldErrors({ _form: data.error || data.message || 'Pendaftaran gagal. Coba lagi.' });
        }
        return;
      }

      setSubmittedTicket(data.request.ticketNumber);
      onSubmitted?.(data.request.ticketNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setFieldErrors({ _form: 'Koneksi bermasalah. Periksa jaringan Anda lalu coba lagi.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------- Layar sukses ----------
  if (submittedTicket) {
    return (
      <MainLayout>
        <section className="py-16 bg-gradient-to-br from-emerald-50 to-white">
          <div className="container mx-auto px-4 max-w-xl text-center">
            <AnimatedSection animation="slideUp">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Pendaftaran KP Berhasil Diterima</h1>
              <p className="text-sm text-slate-600 mb-6">
                Pengajuan Anda akan diverifikasi oleh Staf Tendik FSTI. Simpan nomor tiket berikut untuk
                melacak status:
              </p>
              <div className="bg-white border-2 border-dashed border-emerald-300 rounded-2xl p-5 mb-6">
                <p className="text-xs text-slate-500 mb-1">Nomor Tiket Pendaftaran</p>
                <p className="text-lg font-mono font-bold text-emerald-700">{submittedTicket}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={`/tracking/mahasiswa?tiket=${encodeURIComponent(submittedTicket)}`}
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  Lacak Pengajuan
                </Link>
                <Link
                  href="/"
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                >
                  Kembali ke Beranda
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </MainLayout>
    );
  }

  const inputCls = (field: string) =>
    `w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white transition-colors ${
      fieldErrors[field]
        ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
        : 'border-slate-300 focus:ring-2 focus:ring-primary-200 focus:border-primary-400'
    }`;

  const Err = ({ field }: { field: string }) =>
    fieldErrors[field] ? (
      <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1" data-error="true">
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
        {fieldErrors[field]}
      </p>
    ) : null;

  const Label = ({ children, optional }: { children: React.ReactNode; optional?: boolean }) => (
    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
      {children}
      {!optional && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
  );

  return (
    <MainLayout>
      <section className="relative py-12 bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 text-white overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="slideUp">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-primary-200 hover:text-white transition-colors mb-4 text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Kembali ke Beranda
            </Link>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-semibold mb-3">
              <ClipboardCheck className="w-3.5 h-3.5" />
              Otomasi Persuratan FSTI
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-bold">Formulir Pendaftaran Kerja Praktik</h1>
            <p className="text-primary-100 mt-2 max-w-2xl text-sm md:text-base">
              Pendaftaran sebelum diterima Kerja Praktik. Surat permohonan resmi ke mitra akan dibuat
              otomatis oleh sistem setelah data Anda terverifikasi.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-10 bg-light-bg">
        <div className="container mx-auto px-4 max-w-3xl">
          {fieldErrors._form && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              {fieldErrors._form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            {/* ====== SEKSI 1: INFORMASI PEMOHON ====== */}
            <AnimatedSection animation="slideUp">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex items-center gap-2.5">
                  <User className="w-5 h-5 text-primary-600" />
                  <h2 className="font-bold text-slate-900">1. Informasi Pemohon</h2>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <Label>Tipe Pendaftaran</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['individu', 'kelompok'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setRegistrationType(t)}
                          className={`p-3.5 rounded-xl border-2 text-left transition-all flex items-start gap-2.5 ${
                            registrationType === t
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {t === 'individu' ? (
                            <User className="w-4 h-4 text-primary-600 mt-0.5" />
                          ) : (
                            <Users className="w-4 h-4 text-primary-600 mt-0.5" />
                          )}
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {t === 'individu' ? 'Individu (1 orang)' : 'Kelompok (2 orang)'}
                            </p>
                            <p className="text-xs text-slate-500">
                              {t === 'individu' ? 'KP sendirian' : 'KP berdua — data Pemohon 2 wajib'}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Nama Pemohon 1</Label>
                      <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nama lengkap sesuai KTM"
                        className={inputCls('fullName')}
                      />
                      <Err field="fullName" />
                    </div>
                    <div>
                      <Label>NIM Pemohon 1</Label>
                      <input
                        value={nim}
                        onChange={(e) => setNim(e.target.value)}
                        placeholder="10211001"
                        inputMode="numeric"
                        className={`${inputCls('nim')} font-mono`}
                      />
                      <Err field="nim" />
                    </div>
                  </div>

                  {registrationType === 'kelompok' && (
                    <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl bg-primary-50/50 border border-primary-100">
                      <div>
                        <Label>Nama Pemohon 2</Label>
                        <input
                          value={pemohon2Nama}
                          onChange={(e) => setPemohon2Nama(e.target.value)}
                          placeholder="Nama lengkap anggota kedua"
                          className={inputCls('pemohon2Nama')}
                        />
                        <Err field="pemohon2Nama" />
                      </div>
                      <div>
                        <Label>NIM Pemohon 2</Label>
                        <input
                          value={pemohon2Nim}
                          onChange={(e) => setPemohon2Nim(e.target.value)}
                          placeholder="10211045"
                          inputMode="numeric"
                          className={`${inputCls('pemohon2Nim')} font-mono`}
                        />
                        <Err field="pemohon2Nim" />
                      </div>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Jurusan</Label>
                      <select
                        value={jurusan}
                        onChange={(e) => {
                          setJurusan(e.target.value);
                          setStudyProgram(''); // reset prodi saat jurusan berubah
                        }}
                        className={inputCls('jurusan')}
                      >
                        <option value="">— Pilih Jurusan —</option>
                        {Object.keys(JURUSAN_PRODI).map((j) => (
                          <option key={j} value={j}>{j}</option>
                        ))}
                      </select>
                      <Err field="jurusan" />
                    </div>
                    <div>
                      <Label>Program Studi</Label>
                      <select
                        value={studyProgram}
                        onChange={(e) => setStudyProgram(e.target.value)}
                        disabled={!jurusan}
                        className={`${inputCls('studyProgram')} disabled:bg-slate-50 disabled:text-slate-400`}
                      >
                        <option value="">— Pilih Program Studi —</option>
                        {prodiOptions.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                      <Err field="studyProgram" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Nomor Telepon (WhatsApp)</Label>
                      <input
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="081234567890"
                        inputMode="tel"
                        className={inputCls('whatsapp')}
                      />
                      <p className="mt-1 text-xs text-slate-500">Dihubungi mitra & tendik untuk konfirmasi.</p>
                      <Err field="whatsapp" />
                    </div>
                    <div>
                      <Label>Email ITK</Label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@student.itk.ac.id"
                        inputMode="email"
                        className={inputCls('email')}
                      />
                      <Err field="email" />
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* ====== SEKSI 2: PERSYARATAN PENDAFTARAN ====== */}
            <AnimatedSection animation="slideUp">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-primary-600" />
                  <h2 className="font-bold text-slate-900">2. Persyaratan Pendaftaran</h2>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <Label>Jumlah SKS Lulus</Label>
                    <input
                      value={sksLulus}
                      onChange={(e) => setSksLulus(e.target.value.replace(/\D/g, ''))}
                      placeholder="Minimal 72"
                      inputMode="numeric"
                      className={`${inputCls('sksLulus')} max-w-48`}
                    />
                    <p className="mt-1 text-xs text-slate-500">Syarat minimal 72 SKS lulus untuk melaksanakan KP.</p>
                    <Err field="sksLulus" />
                  </div>

                  {Object.entries(KP_DOC_RULES).map(([kind, rule]) => {
                    const f = files[kind]?.file ?? null;
                    const isOptional = kind === 'pengunduran_diri';
                    return (
                      <div key={kind}>
                        <Label optional={isOptional}>{rule.label}</Label>
                        <p className="text-xs text-slate-500 mb-2">{DOC_HINTS[kind]}</p>
                        {f ? (
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800 truncate">{f.name}</p>
                              <p className="text-xs text-slate-500">
                                {(f.size / 1024 / 1024).toFixed(2)} MB
                                {f.type ? ` · ${f.type}` : ''}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFile(kind, null)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-white transition-colors"
                              aria-label="Hapus file"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                              fieldErrors[kind]
                                ? 'border-rose-300 bg-rose-50/50'
                                : 'border-slate-300 hover:border-primary-400 hover:bg-primary-50/40'
                            }`}
                          >
                            <UploadCloud className="w-6 h-6 text-slate-400" />
                            <div>
                              <p className="text-sm font-medium text-slate-700">
                                Klik untuk unggah
                                <span className="text-slate-400 font-normal">
                                  {' '}· maks {rule.maxMB} MB · PDF
                                  {kind === 'persetujuan_mitra' ? ' / gambar' : ''}
                                </span>
                              </p>
                            </div>
                            <input
                              type="file"
                              accept={rule.accept.join(',')}
                              className="hidden"
                              onChange={(e) => setFile(kind, e.target.files?.[0] ?? null)}
                            />
                          </label>
                        )}
                        <Err field={kind} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </AnimatedSection>

            {/* ====== SEKSI 3: RENCANA MITRA KP ====== */}
            <AnimatedSection animation="slideUp">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex items-center gap-2.5">
                  <Building2 className="w-5 h-5 text-primary-600" />
                  <h2 className="font-bold text-slate-900">3. Rencana Mitra KP</h2>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <Label>Nama Mitra</Label>
                    <input
                      value={mitraNama}
                      onChange={(e) => setMitraNama(e.target.value)}
                      placeholder="Contoh: PT Pelindo"
                      className={inputCls('mitraNama')}
                    />
                    <Err field="mitraNama" />
                  </div>
                  <div>
                    <Label>Alamat Mitra</Label>
                    <input
                      value={mitraAlamat}
                      onChange={(e) => setMitraAlamat(e.target.value)}
                      placeholder="Contoh: Jl. SMP 8, Balikpapan"
                      className={inputCls('mitraAlamat')}
                    />
                    <Err field="mitraAlamat" />
                  </div>

                  <div>
                    <Label>
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarRange className="w-4 h-4 text-primary-600" />
                        Periode KP
                      </span>
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="block text-xs text-slate-500 mb-1">Tanggal Mulai</span>
                        <input
                          type="date"
                          value={periodeMulai}
                          onChange={(e) => setPeriodeMulai(e.target.value)}
                          className={inputCls('periodeMulai')}
                        />
                        <Err field="periodeMulai" />
                      </div>
                      <div>
                        <span className="block text-xs text-slate-500 mb-1">Tanggal Selesai</span>
                        <input
                          type="date"
                          value={periodeSelesai}
                          min={periodeMulai || undefined}
                          onChange={(e) => setPeriodeSelesai(e.target.value)}
                          className={inputCls('periodeSelesai')}
                        />
                        <Err field="periodeSelesai" />
                      </div>
                    </div>

                    {durasiBulan > 0 && (
                      <div className="mt-3 p-3.5 rounded-xl bg-primary-50 border border-primary-100 text-sm">
                        <p className="font-semibold text-primary-800">
                          Durasi otomatis: {durasiBulan} bulan
                        </p>
                        <p className="text-xs text-primary-700 mt-0.5">
                          {formatPeriodeIndo(periodeMulai, periodeSelesai)}
                        </p>
                      </div>
                    )}
                    {periodeMulai && periodeSelesai && durasiBulan === 0 && periodeSelesai > periodeMulai && (
                      <p className="mt-2 text-xs text-amber-600 flex items-center gap-1" data-error="true">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Periode belum mencapai 1 bulan penuh.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* ====== SUBMIT ====== */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500">
                Pastikan seluruh data & dokumen benar. Status pengajuan dapat dipantau melalui halaman Pelacakan Dokumen.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white rounded-xl font-bold text-sm transition-colors shadow-lg min-w-56"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Mengirim Pendaftaran…
                  </>
                ) : (
                  'Ajukan Pendaftaran'
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </MainLayout>
  );
}
