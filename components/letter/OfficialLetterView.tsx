"use client";

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { LetterRequest, getSignature, SignatureData } from '@/lib/letter-service';
import KpLetterBody from '@/components/letter/KpLetterBody';
import KpAcceptedLetterBody from '@/components/letter/KpAcceptedLetterBody';
import ActiveStudyLetterBody from '@/components/letter/ActiveStudyLetterBody';
import { Printer, ShieldCheck, ZoomIn, ZoomOut } from 'lucide-react';

interface OfficialLetterViewProps {
  request: LetterRequest;
  onClose?: () => void;
  showPrintButton?: boolean;
  /**
   * Mode tanam (panel admin/dosen): dokumen mengikuti tinggi isinya,
   * tanpa kontrol zoom dan tanpa mengunci scroll halaman.
   */
  embedded?: boolean;
}

export default function OfficialLetterView({
  request,
  onClose,
  showPrintButton = true,
  embedded = false,
}: OfficialLetterViewProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [signature, setSignature] = useState<SignatureData | null>(null);
  // Skala pratinjau (1 = lebar pas dengan panel, 1.35 = nyaman dibaca di desktop)
  const [zoom, setZoom] = useState(embedded ? 1 : 1.35);
  // Pratinjau selalu dibuka dalam tampilan putih penuh, tanpa navbar/footer/backdrop gelap
  const [isPrinting, setIsPrinting] = useState(false);

  // Ambil tanda tangan digital pimpinan yang tersimpan (PNG base64 + posisi & ukuran)
  // untuk ditempelkan otomatis ke surat. Fallback ke tanda tangan simulasi bila kosong.
  useEffect(() => {
    let active = true;
    getSignature().then((sig) => {
      if (active) setSignature(sig);
    });
    return () => {
      active = false;
    };
  }, [request.id]);

  // Saat pratinjau terbuka: kunci scroll halaman, hilangkan latar gelap & chrome aplikasi
  useEffect(() => {
    if (embedded) return;
    const root = document.documentElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    root.setAttribute('data-previewing-letter', 'true');
    return () => {
      document.body.style.overflow = previousOverflow;
      root.removeAttribute('data-previewing-letter');
    };
  }, [embedded]);

  /* Fitur lama browser print (dipertahankan, sementara dimatikan) */
  /*
  const handlePrint = () => {
    setIsPrinting(true);
    requestAnimationFrame(() => {
      window.print();
      setTimeout(() => setIsPrinting(false), 1200);
    });
  };
  */

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handlePuppeteerPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const sheetClone = printRef.current?.cloneNode(true) as HTMLElement | null;
      if (sheetClone) {
        sheetClone.querySelectorAll('img').forEach((img) => {
          const src = img.getAttribute('src');
          if (src && src.startsWith('/')) {
            img.src = `${window.location.origin}${src}`;
          }
        });
      }
      const sheetHtml = sheetClone?.innerHTML || printRef.current?.innerHTML || '';
      const res = await fetch('/api/letter-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheetHtml, ticketNumber: request.ticketNumber }),
      });
      if (!res.ok) throw new Error('Gagal menghasilkan PDF via Puppeteer');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${request.ticketNumber || 'surat-resmi'}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      alert(msg);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const letterTitleMap: Record<string, string> = {
    'surat-aktif-studi': 'SURAT KETERANGAN',
    'surat-pengantar-kp': 'PERMOHONAN KERJA PRAKTIK',
    'kp-setelah-diterima': 'SURAT PENGANTAR KERJA PRAKTIK',
    'surat-rekomendasi': 'SURAT REKOMENDASI KEMAHASISWAAN',
    'dokumen-akademik': 'SURAT KETERANGAN & PENGESAHAN DOKUMEN AKADEMIK',
    'legalisasi-dokumen': 'LEMBAR PENGESAHAN & LEGALISASI DOKUMEN',
  };

  const isKp = request.serviceType === 'surat-pengantar-kp';
  const isKpAccepted = request.serviceType === 'kp-setelah-diterima';
  const isActiveStudy = request.serviceType === 'surat-aktif-studi';
  const isWd1Family = isKp || isKpAccepted || isActiveStudy;
  const title = letterTitleMap[request.serviceType] || 'SURAT KETERANGAN RESMI MAHASISWA';
  const letterNumber = request.letterNumber || '142/IT10.FSTI/KM/2026';
  const letterDate = request.letterDate || '15 Oktober 2026';
  // Surat KP (kedua fase) & Surat Keterangan Aktif Studi ditandatangani WD1
  // (sesuai template resmi), lainnya Dekan.
  const signedBy =
    request.signedBy ||
    (isWd1Family ? 'Irma Fitria, S.Si., M.Si.' : 'Adi Mahmud Jaya Marindra, S.T., M.Eng., Ph.D.');
  const signedNip = request.signedNip || (isWd1Family ? '199303232022032016' : '198506152014041001');
  const signedPosition =
    request.signedPosition ||
    (isWd1Family
      ? 'Wakil Dekan Bidang Akademik dan Kemahasiswaan'
      : 'Dekan Fakultas Sains dan Teknologi Informasi');

  return (
     <div className={`${embedded ? '' : 'h-full '}flex flex-col ${isPrinting ? 'print-preview' : ''}`}>
      {/* Action Bar (Hidden when printing) */}
      <div className="no-print letter-preview-toolbar sticky top-0 z-20 flex-none flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-primary-900 to-primary-800 text-white px-4 py-3 border-b border-primary-950/40">
        <div className="flex items-center gap-2 min-w-0">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div className="min-w-0">
            <h4 className="font-semibold text-sm truncate">Dokumen Resmi Terverifikasi FSTI ITK</h4>
            <p className="text-[11px] text-primary-200 truncate">
              {request.ticketNumber} · Format A4 siap cetak
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Kontrol zoom hanya berguna di pembaca penuh; di ponsel dokumen sudah pas lebar */}
          <div className={`${embedded ? 'hidden' : 'hidden md:flex'} items-center gap-0.5 bg-white/10 rounded-lg p-0.5`}>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.8, Math.round((z - 0.15) * 100) / 100))}
              className="p-1.5 rounded-md hover:bg-white/15 transition-colors disabled:opacity-40"
              disabled={zoom <= 0.8}
              aria-label="Perkecil tampilan dokumen"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono w-10 text-center tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(2.4, Math.round((z + 0.15) * 100) / 100))}
              className="p-1.5 rounded-md hover:bg-white/15 transition-colors disabled:opacity-40"
              disabled={zoom >= 2.4}
              aria-label="Perbesar tampilan dokumen"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
          {showPrintButton && (
            <button
              onClick={handlePuppeteerPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-primary-900 hover:bg-primary-50 rounded-lg text-sm font-semibold transition-colors shadow-sm disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'Membuat PDF (Puppeteer)...' : 'Unduh PDF (Puppeteer)'}</span>
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

      {/* Lembar dokumen: latar netral terpisah dari halaman, dokumen tampil sebagai kertas */}
      <div className={`letter-preview-surface flex flex-col bg-slate-200/90 pt-5 pb-16 sm:pt-8 sm:pb-20 ${embedded ? 'letter-preview-embed' : 'flex-1 min-h-0 overflow-y-auto overscroll-contain'}`}>
        <div
          className="letter-zoom-frame mx-auto origin-top flex-none transition-transform duration-200"
          style={{ transform: `scale(${zoom})`, width: `calc(100% - ${Math.ceil((zoom - 1) * 826)}px)` }}
        >
          <div
            ref={printRef}
            className="official-letter-sheet bg-white text-gray-900 px-5 py-8 sm:px-12 sm:py-12 shadow-lg ring-1 ring-slate-900/5 rounded-sm font-serif text-[12.5px] sm:text-[13.5px] leading-relaxed mx-auto w-full"
            style={{ minHeight: 'min(1050px, 141vw)' }}
          >
        {/* Kop Surat Resmi ITK FSTI */}
        <div className="border-b-4 border-double border-gray-900 pb-3 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="w-14 h-14 sm:w-20 sm:h-20 relative flex-shrink-0">
              <Image
                src="/images/logoitk.png"
                alt="Logo ITK"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 56px, 80px"
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
                Laman: https://fsti.itk.ac.id | Surel: fsti@itk.ac.id | Telp. (0542) 8530801
              </p>
            </div>
          </div>
        </div>

        {/* Nomor/Judul — template KP memakai blok Nomor-Perihal, lainnya judul tengah */}
        {isWd1Family && !isActiveStudy ? (
          <div className="my-6 space-y-1 font-serif text-gray-900">
            <table className="w-full text-[13.5px]">
              <tbody>
                <tr>
                  <td className="w-24 py-0.5 align-top">Nomor</td>
                  <td className="w-3 align-top">:</td>
                  <td className="py-0.5 font-semibold">{letterNumber}</td>
                  <td className="w-28 py-0.5 align-top text-right">{letterDate}</td>
                </tr>
                {!isKpAccepted && (
                  <tr>
                    <td className="py-0.5 align-top">Lampiran</td>
                    <td className="align-top">:</td>
                    <td className="py-0.5" colSpan={2}>1 (satu) set proposal</td>
                  </tr>
                )}
                <tr>
                  <td className="py-0.5 align-top">Perihal</td>
                  <td className="align-top">:</td>
                  <td className="py-0.5 font-bold" colSpan={2}>
                    {isKpAccepted ? 'Surat Pengantar Kerja Praktik' : 'Permohonan Kerja Praktik'}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="pt-5">
              <p className="font-semibold">
                Yth. {(isKpAccepted ? request.kpDataAccepted?.mitraNama : request.kpData?.mitraNama) || 'Mitra KP'}
              </p>
              <p className="whitespace-pre-line">
                {(isKpAccepted ? request.kpDataAccepted?.mitraAlamat : request.kpData?.mitraAlamat) || 'Alamat Mitra KP'}
              </p>
            </div>
          </div>
        ) : (
        <div className="text-center my-6">
          <h2 className="text-base font-bold underline uppercase tracking-wider text-gray-900">
            {title}
            {isActiveStudy && (
              <span className="font-normal no-underline normal-case"> Nomor : {letterNumber}</span>
            )}
          </h2>
          {!isActiveStudy && (
            <p className="text-xs font-sans text-gray-800 mt-0.5">
              Nomor: {letterNumber}
            </p>
          )}
        </div>
        )}

        {/* Isi Surat */}
        {isActiveStudy ? (
          /* ---------- Isi sesuai template resmi "SURAT KETERANGAN" (WD1) ---------- */
          <ActiveStudyLetterBody request={request} letterDate={letterDate} />
        ) : isKpAccepted ? (
          /* ---------- Isi sesuai template resmi "Permohonan KP" ---------- */
          <KpLetterBody
            request={request}
            signedBy={signedBy}
            signedNip={signedNip}
            signedPosition={signedPosition}
            signature={signature}
          />
        ) : (
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
        )}
        {/* Tanda Tangan & Cap Pejabat */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-6 sm:gap-0 justify-between items-start sm:items-end">
          {/* Pejabat Tanda Tangan */}
          <div className="text-right font-serif text-[13px] relative w-full sm:w-auto sm:min-w-[260px] sm:ml-auto">
            <p>Balikpapan, {letterDate}</p>
            <p className="font-semibold mt-1">{signedPosition},</p>

            {/* Simulated Digital Signature & Stamp */}
            <div className="h-24 sm:h-28 relative flex items-center justify-center my-1">
              {/* Cap Stempel FSTI (Translucent Red-Blue Ink) */}
              <div className="absolute right-6 sm:right-12 w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-primary-700/60 border-dashed flex flex-col items-center justify-center text-center p-1 text-[8px] font-sans font-bold text-primary-800 rotate-[-12deg] pointer-events-none select-none">
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

          </div>
        </div>
      </div>

    </div>
  );
}
