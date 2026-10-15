"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  CheckCircle2,
  Lock,
  X,
  HeartHandshake,
  Sparkles,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { submitAccessSurvey } from '@/lib/letter-service';

interface ServiceAccessSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  targetServiceName?: string;
}

export default function ServiceAccessSurveyModal({
  isOpen,
  onClose,
  onSuccess,
  targetServiceName = 'Layanan Administrasi Persuratan',
}: ServiceAccessSurveyModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [helpfulness, setHelpfulness] = useState<string>('Sangat Membantu');
  const [aspect, setAspect] = useState<string>('Kecepatan proses verifikasi');
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      submitAccessSurvey({
        rating,
        helpfulness,
        satisfactionAspects: [aspect],
        feedback: feedback.trim() || undefined,
      });

      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        onSuccess();
      }, 900);
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gray-950/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 relative"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-primary-800 via-primary-700 to-indigo-800 p-6 text-white text-center relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <HeartHandshake className="w-6 h-6 text-amber-300" />
            </div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[11px] font-bold uppercase tracking-wider mb-1.5">
              Prasyarat Akses Layanan
            </span>
            <h3 className="text-xl font-bold font-display">
              Survei Kepuasan Layanan FSTI
            </h3>
            <p className="text-primary-100 text-xs sm:text-sm mt-1.5 max-w-sm mx-auto leading-relaxed">
              Sesuai standar penjaminan mutu FSTI, mahasiswa diwajibkan mengisi evaluasi singkat (30 detik) sebelum mengakses formulir layanan administrasi.
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {isSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">
                  Survei Berhasil Dikirim!
                </h4>
                <p className="text-sm text-gray-600 max-w-xs mx-auto">
                  Akses layanan administrasi telah terbuka. Anda akan dialihkan ke formulir pengajuan surat sekarang.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Target Layanan Info */}
                <div className="bg-primary-50/70 border border-primary-100 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-500 block">Tujuan Layanan:</span>
                    <span className="font-semibold text-gray-800">{targetServiceName}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                    <Lock className="w-3.5 h-3.5" />
                    Menunggu Survei
                  </span>
                </div>

                {/* Rating Bintang */}
                <div className="text-center pt-1">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                    1. Bagaimana kepuasan Anda terhadap mutu pelayanan administrasi FSTI saat ini?
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isActive = (hoverRating || rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 text-gray-300 hover:text-amber-400 focus:outline-none transition-transform hover:scale-125"
                          title={`${star} Bintang`}
                        >
                          <Star
                            className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                              isActive
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    {rating === 5 && '🌟 Sangat Memuaskan'}
                    {rating === 4 && '😊 Memuaskan'}
                    {rating === 3 && '😐 Cukup Baik'}
                    {rating === 2 && '🙁 Kurang Memuaskan'}
                    {rating === 1 && '😞 Tidak Puas'}
                  </p>
                </div>

                {/* Pertanyaan 2 */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                    2. Apakah sistem pelayanan online FSTI cukup membantu kebutuhan perkuliahan Anda?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Sangat Membantu', 'Cukup Membantu', 'Perlu Ditingkatkan'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setHelpfulness(option)}
                        className={`py-2 px-2 text-xs font-medium rounded-lg border transition-all text-center ${
                          helpfulness === option
                            ? 'bg-primary-50 border-primary-600 text-primary-700 font-bold shadow-sm'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pertanyaan 3 */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                    3. Aspek yang paling penting untuk terus ditingkatkan:
                  </label>
                  <select
                    value={aspect}
                    onChange={(e) => setAspect(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Kecepatan proses verifikasi">Kecepatan proses verifikasi & tanda tangan</option>
                    <option value="Kemudahan pengisian formulir online">Kemudahan pengisian formulir online</option>
                    <option value="Transparansi status pelacakan berkas">Transparansi status pelacakan berkas</option>
                    <option value="Ketersediaan template dokumen resmi">Ketersediaan template dokumen resmi</option>
                  </select>
                </div>

                {/* Saran */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Saran & masukan untuk pelayanan FSTI (opsional):
                  </label>
                  <textarea
                    rows={2}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tuliskan masukan singkat Anda..."
                    className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    fullWidth
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-md"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Menyimpan Survei...
                      </span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Kirim Survei & Buka Akses Layanan</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
