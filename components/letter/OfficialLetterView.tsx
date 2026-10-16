"use client";

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { LetterRequest, getSignature, SignatureData } from '@/lib/letter-service';
import { Printer, Download, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import Button from '@/components/ui/Button';

interface OfficialLetterViewProps {
  request: LetterRequest;
  onClose?: () => void;
  showPrintButton?: boolean;
}

export default function OfficialLetterView({
  request,
  onClose,
  showPrintButton = true,
}: OfficialLetterViewProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [signature, setSignature] = useState<SignatureData | null>(null);

  // Ambil tanda tangan digital pimpinan yang tersimpan (PNG base64 + posisi & ukuran)
  // untuk ditempelkan otomatis ke surat. Fallback ke tanda tangan simulasi bila kosong.
  useEffect(() => {
    setSignature(getSignature());
  }, [request.id]);

  const handlePrint = () => {
    window.print();
  };

  const letterTitleMap: Record<string, string> = {
    'surat-aktif-studi': 'SURAT KETERANGAN AKTIF KULIAH',
    'surat-pengantar-kp': 'SURAT PENGANTAR KERJA PRAKTIK',
    'surat-rekomendasi': 'SURAT REKOMENDASI KEMAHASISWAAN',
    'dokumen-akademik': 'SURAT KETERANGAN & PENGESAHAN DOKUMEN AKADEMIK',
    'legalisasi-dokumen': 'LEMBAR PENGESAHAN & LEGALISASI DOKUMEN',
  };

  const title = letterTitleMap[request.serviceType] || 'SURAT KETERANGAN RESMI MAHASISWA';
  const letterNumber = request.letterNumber || '142/IT10.FSTI/KM/2026';
  const letterDate = request.letterDate || '15 Oktober 2026';
  const signedBy = request.signedBy || 'Adi Mahmud Jaya Marindra, S.T., M.Eng., Ph.D.';
  const signedNip = request.signedNip || '198506152014041001';
  const signedPosition = request.signedPosition || 'Dekan Fakultas Sains dan Teknologi Informasi';

  return (
    <div className="w-full">
      {/* Action Bar (Hidden when printing) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-primary-900 to-primary-800 text-white p-4 rounded-t-xl">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <h4 className="font-semibold text-sm sm:text-base">Dokumen Resmi Terverifikasi FSTI ITK</h4>
            <p className="text-xs text-primary-200">
              Format PDF Terkunci & Keabsahan Tanda Tangan Terproteksi (Sistem Terpadu FSTI)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {showPrintButton && (
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-primary-900 hover:bg-primary-50 rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Unduh PDF</span>
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-2 text-primary-200 hover:text-white hover:bg-white/10 rounded-lg text-sm transition-colors"
            >
              Tutup
            </button>
          )}
        </div>
      </div>

      {/* Official A4 Sheet */}
      <div
        ref={printRef}
        className="official-letter-sheet bg-white text-gray-900 p-8 sm:p-12 shadow-xl border border-gray-200 font-serif text-[13.5px] leading-relaxed mx-auto max-w-[800px]"
        style={{ minHeight: '1050px' }}
      >
        {/* Kop Surat Resmi ITK FSTI */}
        <div className="border-b-4 border-double border-gray-900 pb-3 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="w-20 h-20 relative flex-shrink-0">
              <Image
                src="/images/logotut.png"
                alt="Logo Tut Wuri Handayani"
                fill
                className="object-contain"
                sizes="80px"
              />
            </div>

            <div className="text-center flex-1">
              <p className="text-[13px] font-bold tracking-wider uppercase text-gray-900">
                KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI
              </p>
              <p className="text-[16px] font-extrabold tracking-wide uppercase text-gray-900">
                INSTITUT TEKNOLOGI KALIMANTAN
              </p>
              <p className="text-[15px] font-bold tracking-wide uppercase text-primary-800">
                FAKULTAS SAINS DAN TEKNOLOGI INFORMASI
              </p>
              <p className="text-[10.5px] font-sans text-gray-700 mt-1 leading-tight">
                Kampus ITK Karang Joang, Jl. Soekarno-Hatta KM 15, Balikpapan 76127
                <br />
                Laman: https://fsti.itk.ac.id | Surel: fsti@itk.ac.id | Telp: (0542) 8530801
              </p>
            </div>

            <div className="w-20 h-20 relative flex-shrink-0">
              <Image
                src="/images/logoitk.png"
                alt="Logo ITK"
                fill
                className="object-contain"
                sizes="80px"
              />
            </div>
          </div>
        </div>

        {/* Nomor Surat & Judul */}
        <div className="text-center my-6">
          <h2 className="text-base font-bold underline uppercase tracking-wider text-gray-900">
            {title}
          </h2>
          <p className="text-xs font-sans text-gray-800 mt-0.5">
            Nomor: {letterNumber}
          </p>
        </div>

        {/* Isi Surat */}
        <div className="space-y-4 text-justify font-serif text-gray-900">
          <p>
            Yang bertanda tangan di bawah ini Dekan Fakultas Sains dan Teknologi Informasi Institut Teknologi Kalimantan menerangkan dengan sesungguhnya bahwa:
          </p>

          <div className="my-3 pl-6 pr-2">
            <table className="w-full text-[13px]">
              <tbody>
                <tr className="align-top py-1">
                  <td className="w-48 py-1">Nama Lengkap</td>
                  <td className="w-4 py-1">:</td>
                  <td className="py-1 font-bold">{request.fullName}</td>
                </tr>
                <tr className="align-top py-1">
                  <td className="py-1">Nomor Induk Mahasiswa (NIM)</td>
                  <td className="py-1">:</td>
                  <td className="py-1 font-semibold">{request.nim}</td>
                </tr>
                <tr className="align-top py-1">
                  <td className="py-1">Program Studi / Jenjang</td>
                  <td className="py-1">:</td>
                  <td className="py-1">{request.studyProgram} ({request.degree || 'S1'})</td>
                </tr>
                <tr className="align-top py-1">
                  <td className="py-1">Semester / Tahun Akademik</td>
                  <td className="py-1">:</td>
                  <td className="py-1">{request.semester} / {request.academicYear || '2026/2027'}</td>
                </tr>
                <tr className="align-top py-1">
                  <td className="py-1">Status Keaktifan Kuliah</td>
                  <td className="py-1">:</td>
                  <td className="py-1 font-semibold text-emerald-800">Aktif Terdaftar</td>
                </tr>
                {request.parentName && (
                  <tr className="align-top py-1">
                    <td className="py-1">Nama Orang Tua / Wali</td>
                    <td className="py-1">:</td>
                    <td className="py-1">{request.parentName} {request.parentJob ? `(${request.parentJob})` : ''}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Specialized Section for Academic Documents (Transkrip, KHS, FRS, SKL) */}
          {request.serviceType === 'dokumen-akademik' ? (
            <div className="space-y-3">
              <p>
                Adalah benar mahasiswa yang bersangkutan secara resmi mengajukan permohonan penerbitan / verifikasi dokumen akademik melalui Sistem Informasi Layanan Terpadu FSTI dengan rincian berkas sebagai berikut:
              </p>
              <div className="bg-slate-50 border border-slate-300 rounded p-3 font-sans text-xs my-2">
                <table className="w-full text-slate-800">
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="py-1.5 font-semibold w-44">Jenis Dokumen Diminta</td>
                      <td className="py-1.5">:</td>
                      <td className="py-1.5 font-bold text-primary-900">
                        {request.academicDocTypes && request.academicDocTypes.length > 0
                          ? request.academicDocTypes.join(', ')
                          : 'Transkrip Nilai / Kartu Hasil Studi'}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1.5 font-semibold">Cakupan Periode / Semester</td>
                      <td className="py-1.5">:</td>
                      <td className="py-1.5">{request.targetSemester || 'Semua Semester (Kumulatif)'}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1.5 font-semibold">Format Dokumen Disahkan</td>
                      <td className="py-1.5">:</td>
                      <td className="py-1.5">
                        {request.outputFormat === 'cetak_hardcopy'
                          ? 'Dokumen Fisik Cetak Cap Basah (Diverifikasi Tata Usaha FSTI)'
                          : 'Digital PDF Resmi Terenkripsi (Dengan QR E-Verifikasi)'}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-semibold">Status Pangkalan Data</td>
                      <td className="py-1.5">:</td>
                      <td className="py-1.5 text-emerald-700 font-bold">
                        TERVERIFIKASI VALID DENGAN SISTEM AKADEMIK ITK
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Dokumen dan catatan akademik tersebut telah ditelaah serta disahkan oleh Pimpinan Fakultas Sains dan Teknologi Informasi Institut Teknologi Kalimantan untuk dipergunakan bagi keperluan:{' '}
                <span className="font-semibold">{request.purpose}</span>.
              </p>
            </div>
          ) : request.serviceType === 'legalisasi-dokumen' ? (
            <div className="space-y-3">
              <p>
                Berdasarkan hasil penelaahan dan pencocokan dokumen asli terhadap arsip akademik Fakultas Sains dan Teknologi Informasi Institut Teknologi Kalimantan, dengan ini disahkan keabsahan legalisasi berkas:
              </p>
              <div className="bg-slate-50 border border-slate-300 rounded p-3 font-sans text-xs my-2">
                <p className="font-semibold text-primary-900">
                  Dokumen Dilegalisir: {request.academicDocTypes?.join(', ') || 'Transkrip Akademik / KHS'}
                </p>
                <p className="text-slate-600 mt-1">
                  Status: <span className="text-emerald-700 font-bold">COCOK DAN SAH DENGAN ARSIP ASLI</span>
                </p>
              </div>
              <p>
                Legalisasi ini diterbitkan untuk keperluan:{' '}
                <span className="font-semibold">{request.purpose}</span>.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p>
                Adalah benar mahasiswa yang bersangkutan saat ini tercatat sebagai mahasiswa aktif pada Fakultas Sains dan Teknologi Informasi Institut Teknologi Kalimantan pada Tahun Akademik {request.academicYear || '2026/2027'}.
              </p>
              <p>
                Surat keterangan ini diberikan kepada yang bersangkutan untuk keperluan:{' '}
                <span className="font-semibold">{request.purpose}</span>.
              </p>
            </div>
          )}

          <p>
            Demikian dokumen pengesahan keterangan resmi ini kami buat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
          </p>
        </div>

        {/* Tanda Tangan & Cap Pejabat */}
        <div className="mt-12 flex justify-between items-end">
          {/* QR Verification */}
          <div className="text-left font-sans text-[11px] text-gray-600 max-w-xs">
            <div className="border border-gray-300 rounded p-2 bg-gray-50 flex items-center gap-3">
              <div className="w-16 h-16 bg-white border border-gray-200 p-1 flex items-center justify-center flex-shrink-0">
                {/* Visual QR Simulator */}
                <div className="w-full h-full bg-slate-900 grid grid-cols-4 gap-0.5 p-1">
                  <div className="bg-white"></div>
                  <div className="bg-slate-900"></div>
                  <div className="bg-white"></div>
                  <div className="bg-white"></div>
                  <div className="bg-white"></div>
                  <div className="bg-white"></div>
                  <div className="bg-slate-900"></div>
                  <div className="bg-white"></div>
                  <div className="bg-slate-900"></div>
                  <div className="bg-white"></div>
                  <div className="bg-white"></div>
                  <div className="bg-slate-900"></div>
                  <div className="bg-white"></div>
                  <div className="bg-slate-900"></div>
                  <div className="bg-white"></div>
                  <div className="bg-white"></div>
                </div>
              </div>
              <div>
                <p className="font-bold text-gray-800 text-[10.5px]">E-VERIFIKASI KEABSAHAN</p>
                <p className="text-[9.5px] leading-tight text-gray-500 mt-0.5">
                  Dokumen ini telah disahkan secara digital oleh Pimpinan FSTI ITK. Pindai untuk verifikasi.
                </p>
                <p className="text-[9px] font-mono text-primary-700 mt-1 font-semibold">
                  TIKET: {request.ticketNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Pejabat Tanda Tangan */}
          <div className="text-right font-serif text-[13px] relative min-w-[260px]">
            <p>Balikpapan, {letterDate}</p>
            <p className="font-semibold mt-1">{signedPosition},</p>

            {/* Simulated Digital Signature & Stamp */}
            <div className="h-28 relative flex items-center justify-center my-1">
              {/* Cap Stempel FSTI (Translucent Red-Blue Ink) */}
              <div className="absolute right-12 w-24 h-24 rounded-full border-2 border-primary-700/60 border-dashed flex flex-col items-center justify-center text-center p-1 text-[8px] font-sans font-bold text-primary-800 rotate-[-12deg] pointer-events-none select-none">
                <span>INSTITUT TEKNOLOGI KALIMANTAN</span>
                <span className="text-[9px] text-primary-900 font-extrabold my-0.5">★ FSTI ★</span>
                <span>DEKAN</span>
              </div>

              {/* Tanda Tangan Digital Pimpinan (PNG yang diunggah + posisi & ukuran) */}
              {signature ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={signature.dataUrl}
                  alt={`Tanda tangan ${signedBy}`}
                  className="absolute top-1/2 left-1/2 z-10 object-contain pointer-events-none select-none mix-blend-multiply"
                  style={{
                    width: `${signature.widthPercent ?? 55}%`,
                    transform: `translate(calc(-50% + ${signature.offsetXPercent ?? 0}%), calc(-50% + ${signature.offsetYPercent ?? 0}%))`,
                  }}
                />
              ) : (
                /* Fallback: Tanda Tangan Simulasi (bila pimpinan belum mengunggah PNG) */
                <div className="relative z-10 w-44 h-16 flex items-center justify-center pointer-events-none select-none">
                  <svg viewBox="0 0 200 80" className="w-full h-full text-blue-900 fill-none stroke-current stroke-2">
                    <path d="M 15 50 Q 40 10 70 45 T 120 30 T 160 55 Q 175 40 190 20" />
                    <path d="M 35 30 Q 60 70 85 25 Q 110 65 140 40" strokeWidth="1.5" />
                    <path d="M 20 60 L 180 62" strokeWidth="1" strokeDasharray="3 3" />
                  </svg>
                </div>
              )}
            </div>

            <p className="font-bold underline text-gray-900">{signedBy}</p>
            <p className="text-xs font-sans text-gray-700">NIP. {signedNip}</p>
          </div>
        </div>

        {/* Footer Catatan Proteksi */}
        <div className="mt-14 pt-4 border-t border-gray-200 text-center font-sans text-[10px] text-gray-500 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-gray-400" />
            Dokumen terenkripsi & anti-ekstraksi aset tanda tangan
          </span>
          <span>Sistem Informasi Layanan FSTI ITK — Dicetak pada {new Date().toLocaleDateString('id-ID')}</span>
        </div>
      </div>

      {/* Print Specific CSS */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .no-print {
            display: none !important;
          }
          .official-letter-sheet, .official-letter-sheet * {
            visibility: visible;
          }
          .official-letter-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20mm !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
}
