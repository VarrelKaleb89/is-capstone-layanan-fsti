'use client';

/**
 * Formulir "Pendaftaran Setelah Diterima Kerja Praktik".
 * UI disamakan persis dengan form Permohonan KP (KpRegistrationForm):
 * hero gradient, seksi kartu bernomor, input rounded-xl, dropzone dashed.
 * Field tetap sesuai blueprint fase diterima (9 pertanyaan + data surat balasan).
 */
import { useMemo, useState } from 'react';
import {
  ChevronLeft,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  X,
  User,
  Users,
  Building2,
  CalendarRange,
  ClipboardCheck,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { hitungDurasiBulan, formatPeriodeIndo, KP_ACCEPTED_DOC_RULES } from '@/lib/kp-utils';
import type { FieldError } from '@/app/api/kp/register/route';

type FileState = { file: File } | null;

interface KpAcceptedRegistrationFormProps {
  onSubmitted?: (ticketNumber: string) => void;
}

const DOC_HINTS: Record<string, string> = {
  surat_balasan: 'Surat balasan resmi dari mitra yang menyatakan penerimaan mahasiswa KP.',
  surat_pernyataan: 'Surat pernyataan mahasiswa sesuai ketentuan pelaksanaan KP.',
};

export default function KpAcceptedRegistrationForm({ onSubmitted }: KpAcceptedRegistrationFormProps) {
  const [fullName, setFullName] = useState('');
  const [nim, setNim] = useState('');
  const [pemohon2Nama, setPemohon2Nama] = useState('');
  const [pemohon2Nim, setPemohon2Nim] = useState('');
  const [mitraNama, setMitraNama] = useState('');
  const [mitraAlamat, setMitraAlamat] = useState('');
  const [periodeMulai, setPeriodeMulai] = useState('');
  const [periodeSelesai, setPeriodeSelesai] = useState('');
  const [suratBalasanNomor, setSuratBalasanNomor] = useState('');
  const [suratBalasanTanggal, setSuratBalasanTanggal] = useState('');
  const [files, setFiles] = useState<Record<string, FileState>>({});

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

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

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    const nimRe = /^10\d{6}$/;

    if (!fullName.trim()) errs.fullName = 'Nama Pemohon 1 wajib diisi.';
    if (!nim.trim() || !nimRe.test(nim.trim())) errs.nim = 'NIM Pemohon 1 wajib diisi dengan format 10XXXXXXX.';
    if (pemohon2Nama.trim() || pemohon2Nim.trim()) {
      if (!pemohon2Nama.trim()) errs.pemohon2Nama = 'Lengkapi nama Pemohon 2.';
      if (!pemohon2Nim.trim() || !nimRe.test(pemohon2Nim.trim()))
        errs.pemohon2Nim = 'NIM Pemohon 2 wajib format 10XXXXXXX.';
      else if (nim.trim() === pemohon2Nim.trim())
        errs.pemohon2Nim = 'NIM Pemohon 2 tidak boleh sama dengan Pemohon 1.';
    }
    if (!mitraNama.trim()) errs.mitraNama = 'Nama Mitra wajib diisi.';
    if (!mitraAlamat.trim()) errs.mitraAlamat = 'Alamat Mitra wajib diisi.';
    if (!periodeMulai) errs.periodeMulai = 'Tanggal mulai KP wajib dipilih.';
    if (!periodeSelesai) errs.periodeSelesai = 'Tanggal selesai KP wajib dipilih.';
    if (periodeMulai && periodeSelesai) {
      if (periodeSelesai < periodeMulai) errs.periodeSelesai = 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai.';
      else if (durasiBulan < 1) errs.periodeSelesai = 'Periode KP minimal berdurasi 1 bulan penuh.';
    }
    if (!suratBalasanNomor.trim()) errs.suratBalasanNomor = 'Nomor surat balasan mitra wajib diisi.';
    if (!suratBalasanTanggal) errs.suratBalasanTanggal = 'Tanggal surat balasan mitra wajib dipilih.';

    for (const kind of Object.keys(KP_ACCEPTED_DOC_RULES)) {
      const f = files[kind]?.file;
      const rule = KP_ACCEPTED_DOC_RULES[kind as keyof typeof KP_ACCEPTED_DOC_RULES];
      if (!f) {
        errs[kind] = `${rule.label} wajib diunggah.`;
        continue;
      }
      if (!(rule.accept as readonly string[]).includes(f.type)) {
        errs[kind] = 'Format tidak diizinkan (harus PDF).';
      } else if (f.size > rule.maxMB * 1024 * 1024) {
        errs[kind] = `Ukuran melebihi ${rule.maxMB} MB.`;
      }
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

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
      fd.set('fullName', fullName);
      fd.set('nim', nim);
      fd.set('pemohon2Nama', pemohon2Nama);
      fd.set('pemohon2Nim', pemohon2Nim);
      fd.set('mitraNama', mitraNama);
      fd.set('mitraAlamat', mitraAlamat);
      fd.set('periodeMulai', periodeMulai);
      fd.set('periodeSelesai', periodeSelesai);
      fd.set('suratBalasanNomor', suratBalasanNomor);
      fd.set('suratBalasanTanggal', suratBalasanTanggal);
      for (const kind of Object.keys(KP_ACCEPTED_DOC_RULES)) {
        const f = files[kind]?.file;
        if (f) fd.set(kind, f);
      }

      const res = await fetch('/api/kp/register-accepted', { method: 'POST', body: fd });
      const data = (await res.json()) as {
        request?: { ticketNumber: string };
        errors?: FieldError[];
        message?: string;
        error?: string;
      };

      if (!res.ok || !data.request) {
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

  // ---------- Layar sukses (identik form Permohonan KP) ----------
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

  const isKelompok = Boolean(pemohon2Nama.trim() || pemohon2Nim.trim());

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
            <h1 className="text-3xl md:text-4xl font-display font-bold">Pendaftaran Setelah Diterima Kerja Praktik</h1>
            <p className="text-primary-100 mt-2 max-w-2xl text-sm md:text-base">
              Formulir tahap lanjutan untuk mahasiswa yang telah diterima mitra. Surat Pengantar Kerja
              Praktik resmi ke mitra akan dibuat otomatis oleh sistem setelah data Anda terverifikasi.
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

                  <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl bg-primary-50/50 border border-primary-100">
                    <div>
                      <Label optional>Nama Pemohon 2</Label>
                      <input
                        value={pemohon2Nama}
                        onChange={(e) => setPemohon2Nama(e.target.value)}
                        placeholder="Khusus KP kelompok (2 orang)"
                        className={inputCls('pemohon2Nama')}
                      />
                      <p className="mt-1 text-xs text-slate-500">Kosongkan bila KP individu.</p>
                      <Err field="pemohon2Nama" />
                    </div>
                    <div>
                      <Label optional>NIM Pemohon 2</Label>
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
                  {isKelompok && (
                    <div className="flex items-center gap-2 text-xs text-primary-700">
                      <Users className="w-4 h-4" />
                      Mode kelompok: surat akan mencantumkan 2 peserta KP.
                    </div>
                  )}
                </div>
              </div>
            </AnimatedSection>

            {/* ====== SEKSI 2: RENCANA MITRA KP ====== */}
            <AnimatedSection animation="slideUp">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex items-center gap-2.5">
                  <Building2 className="w-5 h-5 text-primary-600" />
                  <h2 className="font-bold text-slate-900">2. Rencana Mitra KP</h2>
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
                        Waktu Pelaksanaan KP
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

            {/* ====== SEKSI 3: PERSYARATAN DOKUMEN ====== */}
            <AnimatedSection animation="slideUp">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-primary-600" />
                  <h2 className="font-bold text-slate-900">3. Persyaratan Dokumen</h2>
                </div>
                <div className="p-6 space-y-5">
                  {Object.entries(KP_ACCEPTED_DOC_RULES).map(([kind, rule]) => {
                    const f = files[kind]?.file ?? null;
                    return (
                      <div key={kind}>
                        <Label>{rule.label}</Label>
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

                  {/* Data surat balasan — untuk isi surat */}
                  <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Nomor Surat Balasan Mitra</Label>
                      <input
                        value={suratBalasanNomor}
                        onChange={(e) => setSuratBalasanNomor(e.target.value)}
                        placeholder="Contoh: 045/BDI-KP/X/2026"
                        className={inputCls('suratBalasanNomor')}
                      />
                      <p className="mt-1 text-xs text-slate-500">Dicantumkan pada surat pengantar resmi.</p>
                      <Err field="suratBalasanNomor" />
                    </div>
                    <div>
                      <Label>Tanggal Surat Balasan Mitra</Label>
                      <input
                        type="date"
                        value={suratBalasanTanggal}
                        onChange={(e) => setSuratBalasanTanggal(e.target.value)}
                        className={inputCls('suratBalasanTanggal')}
                      />
                      <Err field="suratBalasanTanggal" />
                    </div>
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
