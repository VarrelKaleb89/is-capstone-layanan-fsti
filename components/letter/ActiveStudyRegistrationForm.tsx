'use client';

/**
 * Formulir "Permohonan Surat Keterangan Aktif Studi".
 * UI mengikuti pola halaman "Setelah Diterima KP" (KpAcceptedRegistrationForm):
 * hero gradient, seksi kartu bernomor, input rounded-xl, dropzone dashed.
 * Field disesuaikan template resmi Surat Aktif Studi (WD1).
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
  ClipboardCheck,
  Loader2,
  FileSignature,
} from 'lucide-react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { JURUSAN_PRODI } from '@/lib/kp-utils';
import type { FieldError } from '@/app/api/kp/register/route';

type FileState = { file: File } | null;

interface ActiveStudyRegistrationFormProps {
  onSubmitted?: (ticketNumber: string) => void;
}

const SEMESTER_OPTIONS = [
  '1 (Satu)', '2 (Dua)', '3 (Tiga)', '4 (Empat)', '5 (Lima)',
  '6 (Enam)', '7 (Tujuh)', '8 (Delapan)', '9 (Sembilan)', '10 (Sepuluh)',
  '11 (Sebelas)', '12 (Dua Belas)', '13 (Tiga Belas)', '14 (Empat Belas)',
];

const ANGKATAN_OPTIONS = ['2026', '2025', '2024', '2023', '2022', '2021', '2020'];

export default function ActiveStudyRegistrationForm({ onSubmitted }: ActiveStudyRegistrationFormProps) {
  // Seksi 1: Informasi Mahasiswa
  const [fullName, setFullName] = useState('');
  const [nim, setNim] = useState('');
  const [jurusan, setJurusan] = useState('');
  const [studyProgram, setStudyProgram] = useState('');
  const [semester, setSemester] = useState('7 (Tujuh)');
  const [academicYear, setAcademicYear] = useState('2026/2027');
  const [angkatan, setAngkatan] = useState('2023');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');

  // Seksi 2: Informasi Permohonan
  const [keperluan, setKeperluan] = useState('');
  const [catatanTambahan, setCatatanTambahan] = useState('');

  // Seksi 3: Dokumen pendukung (opsional)
  const [dokumen, setDokumen] = useState<FileState>(null);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  // Prodi menyesuaikan jurusan.
  const prodiOptions = useMemo(() => JURUSAN_PRODI[jurusan] ?? [], [jurusan]);

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    const nimRe = /^10\d{6}$/;
    const phoneRe = /^(\+62|62|0)8\d{7,12}$/;

    if (!fullName.trim()) errs.fullName = 'Nama mahasiswa wajib diisi.';
    if (!nim.trim() || !nimRe.test(nim.trim())) errs.nim = 'NIM wajib diisi dengan format 10XXXXXXX.';
    if (!jurusan) errs.jurusan = 'Jurusan wajib dipilih.';
    if (!studyProgram) errs.studyProgram = 'Program Studi wajib dipilih.';
    if (!semester) errs.semester = 'Semester wajib dipilih.';
    if (!academicYear.trim() || !/^\d{4}\/\d{4}$/.test(academicYear.trim()))
      errs.academicYear = 'Tahun akademik wajib format 2026/2027.';
    if (!angkatan || !/^(19|20)\d{2}$/.test(angkatan))
      errs.angkatan = 'Angkatan wajib dipilih.';
    if (!whatsapp.trim() || !phoneRe.test(whatsapp.replace(/[\s-]/g, '')))
      errs.whatsapp = 'Nomor telepon tidak valid (contoh: 081234567890).';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errs.email = 'Email tidak valid.';
    if (!keperluan.trim()) errs.keperluan = 'Keperluan permohonan wajib diisi.';

    if (dokumen?.file) {
      const f = dokumen.file;
      if (f.type !== 'application/pdf') {
        errs.dokumen_pendukung = 'Dokumen pendukung harus berformat PDF.';
      } else if (f.size > 10 * 1024 * 1024) {
        errs.dokumen_pendukung = 'Ukuran dokumen melebihi 10 MB.';
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
      fd.set('jurusan', jurusan);
      fd.set('studyProgram', studyProgram);
      fd.set('semester', semester);
      fd.set('academicYear', academicYear);
      fd.set('angkatan', angkatan);
      fd.set('whatsapp', whatsapp);
      fd.set('email', email);
      fd.set('keperluan', keperluan);
      fd.set('catatanTambahan', catatanTambahan);
      if (dokumen?.file) fd.set('dokumen_pendukung', dokumen.file);

      const res = await fetch('/api/aktif-studi/register', { method: 'POST', body: fd });
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
          setFieldErrors({ _form: data.error || data.message || 'Permohonan gagal. Coba lagi.' });
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

  // ---------- Layar sukses (pola sama form referensi) ----------
  if (submittedTicket) {
    return (
      <MainLayout>
        <section className="py-16 bg-gradient-to-br from-emerald-50 to-white">
          <div className="container mx-auto px-4 max-w-xl text-center">
            <AnimatedSection animation="slideUp">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Permohonan Berhasil Dikirim</h1>
              <p className="text-sm text-slate-600 mb-6">
                Permohonan Surat Keterangan Aktif Studi Anda akan diverifikasi oleh Staf Tendik FSTI.
                Simpan nomor tiket berikut untuk melacak status:
              </p>
              <div className="bg-white border-2 border-dashed border-emerald-300 rounded-2xl p-5 mb-6">
                <p className="text-xs text-slate-500 mb-1">Nomor Tiket Permohonan</p>
                <p className="text-lg font-mono font-bold text-emerald-700">{submittedTicket}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={`/tracking/mahasiswa?tiket=${encodeURIComponent(submittedTicket)}`}
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  Lacak Permohonan
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
            <h1 className="text-3xl md:text-4xl font-display font-bold">Permohonan Surat Keterangan Aktif Studi</h1>
            <p className="text-primary-100 mt-2 max-w-2xl text-sm md:text-base">
              Ajukan surat keterangan aktif studi resmi FSTI. Surat diterbitkan oleh Wakil Dekan
              Bidang Akademik dan Kemahasiswaan setelah verifikasi tendik.
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
            {/* ====== SEKSI 1: INFORMASI MAHASISWA ====== */}
            <AnimatedSection animation="slideUp">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex items-center gap-2.5">
                  <User className="w-5 h-5 text-primary-600" />
                  <h2 className="font-bold text-slate-900">1. Informasi Mahasiswa</h2>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Nama Mahasiswa</Label>
                      <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nama lengkap sesuai KTM"
                        className={inputCls('fullName')}
                      />
                      <Err field="fullName" />
                    </div>
                    <div>
                      <Label>NIM</Label>
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

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Jurusan</Label>
                      <select
                        value={jurusan}
                        onChange={(e) => {
                          setJurusan(e.target.value);
                          setStudyProgram('');
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

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <Label>Semester</Label>
                      <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className={inputCls('semester')}
                      >
                        {SEMESTER_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <Err field="semester" />
                    </div>
                    <div>
                      <Label>Tahun Akademik</Label>
                      <input
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        placeholder="2026/2027"
                        className={inputCls('academicYear')}
                      />
                      <Err field="academicYear" />
                    </div>
                    <div>
                      <Label>Angkatan</Label>
                      <select
                        value={angkatan}
                        onChange={(e) => setAngkatan(e.target.value)}
                        className={inputCls('angkatan')}
                      >
                        {ANGKATAN_OPTIONS.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                      <Err field="angkatan" />
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
                      <Err field="whatsapp" />
                    </div>
                    <div>
                      <Label>Email</Label>
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

            {/* ====== SEKSI 2: INFORMASI PERMOHONAN ====== */}
            <AnimatedSection animation="slideUp">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex items-center gap-2.5">
                  <FileSignature className="w-5 h-5 text-primary-600" />
                  <h2 className="font-bold text-slate-900">2. Informasi Permohonan</h2>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <Label>Jenis Surat</Label>
                    <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700">
                      Surat Keterangan Aktif Studi
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Diterbitkan oleh Wakil Dekan Bidang Akademik dan Kemahasiswaan FSTI ITK.
                    </p>
                  </div>

                  <div>
                    <Label>Keperluan Permohonan</Label>
                    <input
                      value={keperluan}
                      onChange={(e) => setKeperluan(e.target.value)}
                      placeholder="Contoh: Persyaratan pengajuran beasiswa, BPJS, lomba, dll."
                      className={inputCls('keperluan')}
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Dicantumkan pada surat sebagai keperluan penerbitan.
                    </p>
                    <Err field="keperluan" />
                  </div>

                  <div>
                    <Label optional>Catatan Tambahan</Label>
                    <textarea
                      value={catatanTambahan}
                      onChange={(e) => setCatatanTambahan(e.target.value)}
                      rows={3}
                      placeholder="Opsional — informasi tambahan untuk petugas (mis. urgency, kebutuhan khusus)"
                      className="w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white transition-colors focus:ring-2 focus:ring-primary-200 focus:border-primary-400 border-slate-300"
                    />
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* ====== SEKSI 3: DOKUMEN PENDUKUNG (OPSIONAL) ====== */}
            <AnimatedSection animation="slideUp">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-primary-600" />
                  <h2 className="font-bold text-slate-900">3. Dokumen Pendukung</h2>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <Label optional>Dokumen Pendukung</Label>
                    <p className="text-xs text-slate-500 mb-2">
                      Opsional — lampirkan bila ada berkas pendukung keperluan (mis. undangan lomba).
                      Maks 10 MB · PDF.
                    </p>
                    {dokumen?.file ? (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{dokumen.file.name}</p>
                          <p className="text-xs text-slate-500">
                            {(dokumen.file.size / 1024 / 1024).toFixed(2)} MB · {dokumen.file.type}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDokumen(null)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-white transition-colors"
                          aria-label="Hapus file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                          fieldErrors.dokumen_pendukung
                            ? 'border-rose-300 bg-rose-50/50'
                            : 'border-slate-300 hover:border-primary-400 hover:bg-primary-50/40'
                        }`}
                      >
                        <UploadCloud className="w-6 h-6 text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            Klik untuk unggah
                            <span className="text-slate-400 font-normal"> · opsional · maks 10 MB · PDF</span>
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0] ?? null;
                            setDokumen(f ? { file: f } : null);
                          }}
                        />
                      </label>
                    )}
                    <Err field="dokumen_pendukung" />
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* ====== SUBMIT ====== */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500">
                Pastikan data benar. Status permohonan dapat dipantau melalui halaman Pelacakan Dokumen.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white rounded-xl font-bold text-sm transition-colors shadow-lg min-w-56"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Mengirim Permohonan…
                  </>
                ) : (
                  'Ajukan Permohonan'
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </MainLayout>
  );
}
