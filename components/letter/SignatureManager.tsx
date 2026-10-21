"use client";

import React, { useEffect, useRef, useState } from 'react';
import {
  PenTool,
  Upload,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ImageIcon,
  Info,
  X,
  Move,
  Maximize2,
  RotateCcw as ResetIcon,
  Save,
} from 'lucide-react';
import {
  SignatureData,
  getSignature,
  saveSignature,
  removeSignature,
  DEFAULT_SIGNATURE_LAYOUT,
} from '@/lib/letter-service';

interface SignatureManagerProps {
  /** Info nama pejabat, untuk disimpan sebagai metadata tanda tangan. */
  signerName?: string;
  /** Info NIP pejabat, untuk disimpan sebagai metadata tanda tangan. */
  signerNip?: string;
  /** Callback dipanggil setiap tanda tangan disimpan / dihapus (untuk refresh pratinjau). */
  onChange?: (signature: SignatureData | null) => void;
  className?: string;
}

const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
const ACCEPTED_TYPES = ['image/png'];

export default function SignatureManager({
  signerName,
  signerNip,
  onChange,
  className = '',
}: SignatureManagerProps) {
  const [signature, setSignature] = useState<SignatureData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Pengaturan tampilan (di-bind ke slider, disimpan ke storage)
  const [widthPercent, setWidthPercent] = useState(DEFAULT_SIGNATURE_LAYOUT.widthPercent);
  const [offsetXPercent, setOffsetXPercent] = useState(DEFAULT_SIGNATURE_LAYOUT.offsetXPercent);
  const [offsetYPercent, setOffsetYPercent] = useState(DEFAULT_SIGNATURE_LAYOUT.offsetYPercent);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    let active = true;
    getSignature().then((sig) => {
      if (!active) return;
      setSignature(sig);
      if (sig) {
        setWidthPercent(sig.widthPercent ?? DEFAULT_SIGNATURE_LAYOUT.widthPercent);
        setOffsetXPercent(sig.offsetXPercent ?? DEFAULT_SIGNATURE_LAYOUT.offsetXPercent);
        setOffsetYPercent(sig.offsetYPercent ?? DEFAULT_SIGNATURE_LAYOUT.offsetYPercent);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const notify = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3500);
  };

  const handleFile = (file: File | undefined) => {
    setError(null);
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Format berkas harus PNG (latar transparan dianjurkan).');
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError('Ukuran berkas melebihi 2 MB. Mohon kompres gambar terlebih dahulu.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) {
        setError('Gagal membaca berkas tanda tangan.');
        return;
      }
      void (async () => {
        try {
          const saved = await saveSignature({
            dataUrl,
            fileName: file.name,
            size: file.size,
            uploadedAt: new Date().toISOString(),
            signerName,
            signerNip,
            widthPercent,
            offsetXPercent,
            offsetYPercent,
          });
          setSignature(saved);
          setHasChanges(false);
          onChange?.(saved);
          notify('Tanda tangan berhasil disimpan ke database. Otomatis ditempelkan pada seluruh surat.');
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : 'Gagal menyimpan tanda tangan.');
        }
      })();
    };
    reader.onerror = () => setError('Terjadi kesalahan saat membaca berkas.');
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
    // reset agar memilih file yang sama tetap memicu onChange
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const markChanged = (setter: (v: number) => void) => (v: number) => {
    setter(v);
    setHasChanges(true);
  };

  const handleSaveLayout = async () => {
    if (!signature) return;
    try {
      const saved = await saveSignature({
        ...signature,
        widthPercent,
        offsetXPercent,
        offsetYPercent,
      });
      setSignature(saved);
      setHasChanges(false);
      onChange?.(saved);
      notify('Pengaturan posisi & ukuran tanda tangan berhasil disimpan.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan pengaturan tanda tangan.');
    }
  };

  const handleResetLayout = () => {
    setWidthPercent(DEFAULT_SIGNATURE_LAYOUT.widthPercent);
    setOffsetXPercent(DEFAULT_SIGNATURE_LAYOUT.offsetXPercent);
    setOffsetYPercent(DEFAULT_SIGNATURE_LAYOUT.offsetYPercent);
    setHasChanges(true);
  };

  const handleRemove = async () => {
    if (!confirm('Hapus tanda tangan tersimpan? Surat berikutnya akan memakai tanda tangan contoh sampai Anda mengunggah ulang.')) {
      return;
    }
    try {
      await removeSignature();
      setSignature(null);
      setHasChanges(false);
      onChange?.(null);
      setError(null);
      notify('Tanda tangan berhasil dihapus dari database.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus tanda tangan.');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-2xl p-5 shadow-sm ${className}`}>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
          <PenTool className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Tanda Tangan Digital Pimpinan</h3>
          <p className="text-[11px] text-gray-500">
            Unggah sekali & atur posisinya, otomatis ditempelkan pada setiap surat.
          </p>
        </div>
      </div>

      {/* Pesan error / sukses */}
      {error && (
        <div className="mt-3 flex items-start gap-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      {success && (
        <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Preview tanda tangan tersimpan */}
      {signature ? (
        <div className="mt-4 space-y-4">
          {/* Area pratinjau interaktif: mensimulasikan area tanda tangan pada surat */}
          <div>
            <p className="text-[11px] font-semibold text-gray-600 mb-1.5 flex items-center justify-between">
              <span>Pratinjau Posisi pada Area Tanda Tangan</span>
              <span className="text-gray-400 font-normal">Area abu = bidang tanda tangan surat</span>
            </p>
            <div className="relative rounded-xl border border-gray-300 bg-gray-100 overflow-hidden h-40">
              {/* Garis bantu tengah */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300/70 pointer-events-none" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300/70 pointer-events-none" />
              {/* placeholder nama terang */}
              <div className="absolute bottom-2 left-3 right-3 border-t border-dashed border-gray-400 pt-1">
                <p className="text-[9px] text-gray-500 font-serif">Nama Terang & NIP pejabat</p>
              </div>
              {/* Gambar TTD sesuai pengaturan */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={signature.dataUrl}
                alt="Pratinjau tanda tangan"
                className="absolute top-1/2 left-1/2 object-contain mix-blend-multiply pointer-events-none select-none"
                style={{
                  width: `${widthPercent}%`,
                  transform: `translate(calc(-50% + ${offsetXPercent}%), calc(-50% + ${offsetYPercent}%))`,
                }}
              />
            </div>
          </div>

          {/* Kontrol Ukuran */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
              <Maximize2 className="w-3.5 h-3.5 text-purple-600" />
              <span>Ukuran Tanda Tangan</span>
              <span className="ml-auto font-mono text-[11px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                {widthPercent}%
              </span>
            </label>
            <input
              type="range"
              min={10}
              max={100}
              step={1}
              value={widthPercent}
              onChange={(e) => markChanged(setWidthPercent)(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>Kecil</span>
              <span>Besar</span>
            </div>
          </div>

          {/* Kontrol Posisi Horizontal */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
              <Move className="w-3.5 h-3.5 text-purple-600" />
              <span>Geser Horizontal</span>
              <span className="ml-auto font-mono text-[11px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                {offsetXPercent > 0 ? `+${offsetXPercent}` : offsetXPercent}%
              </span>
            </label>
            <input
              type="range"
              min={-50}
              max={50}
              step={1}
              value={offsetXPercent}
              onChange={(e) => markChanged(setOffsetXPercent)(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>Kiri</span>
              <span>Kanan</span>
            </div>
          </div>

          {/* Kontrol Posisi Vertikal */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
              <Move className="w-3.5 h-3.5 text-purple-600 rotate-90" />
              <span>Geser Vertikal</span>
              <span className="ml-auto font-mono text-[11px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                {offsetYPercent > 0 ? `+${offsetYPercent}` : offsetYPercent}%
              </span>
            </label>
            <input
              type="range"
              min={-50}
              max={50}
              step={1}
              value={offsetYPercent}
              onChange={(e) => markChanged(setOffsetYPercent)(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>Atas</span>
              <span>Bawah</span>
            </div>
          </div>

          {/* Aksi simpan/reset pengaturan */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handleSaveLayout}
              disabled={!hasChanges}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                hasChanges
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Pengaturan</span>
            </button>
            <button
              onClick={handleResetLayout}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg text-xs font-semibold transition-colors"
            >
              <ResetIcon className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
          </div>

          {/* Metadata berkas */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500 pt-1 border-t border-gray-100">
            <span className="flex items-center gap-1.5 truncate">
              <ImageIcon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{signature.fileName}</span>
              <span className="text-gray-400">· {formatSize(signature.size)}</span>
            </span>
            <span className="text-gray-400">Diunggah {formatDate(signature.uploadedAt)}</span>
          </div>

          {/* Ganti / hapus */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Ganti Tanda Tangan</span>
            </button>
            <button
              onClick={handleRemove}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-rose-300 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
          }}
          className={`mt-4 cursor-pointer rounded-xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center transition-colors ${
            isDragging
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-gray-800">
            Klik atau tarik berkas <span className="text-purple-600">PNG</span> ke sini
          </p>
          <p className="text-[11px] text-gray-500 mt-1">
            Latar transparan dianjurkan · Maks. 2 MB
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,.png"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Catatan bantuan */}
      <div className="mt-4 flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-[11px]">
        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-400" />
        <span>
          Gunakan PNG beresolusi tinggi agar hasil cetak tajam. Atur ukuran & posisi di atas,
          lalu klik <strong>Simpan Pengaturan</strong>; perubahan tampil langsung pada pratinjau surat.
        </span>
      </div>
    </div>
  );
}
