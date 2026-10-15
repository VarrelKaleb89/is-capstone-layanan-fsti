"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle2, Lock, AlertCircle, X, HeartHandshake, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import { LetterRequest, submitSurveyForRequest } from '@/lib/letter-service';

interface SurveyGatekeeperModalProps {
  request: LetterRequest;
  isOpen: boolean;
  onClose: () => void;
  onSurveyCompleted: (updatedRequest: LetterRequest) => void;
}

export default function SurveyGatekeeperModal({
  request,
  isOpen,
  onClose,
  onSurveyCompleted,
}: SurveyGatekeeperModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [helpfulness, setHelpfulness] = useState<string>('Sangat Membantu');
  const [speed, setSpeed] = useState<string>('Cepat & Tepat Waktu');
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const fullFeedback = `[Bantuan: ${helpfulness}] [Kecepatan: ${speed}] ${feedback}`.trim();
      const updated = submitSurveyForRequest(request.id, rating, helpfulness, fullFeedback);
      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        if (updated) {
          onSurveyCompleted(updated);
        }
      }, 1000);
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 relative"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-indigo-700 p-6 text-white text-center relative">
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
            <h3 className="text-xl font-bold font-display">
              Survei Kepuasan Layanan FSTI
            </h3>
            <p className="text-primary-100 text-xs sm:text-sm mt-1 max-w-sm mx-auto">
              Sesuai ketentuan layanan, mohon luangkan 30 detik untuk memberikan penilaian sebelum mengunduh berkas surat resmi Anda.
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {isSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">
                  Terima Kasih Atas Penilaian Anda!
                </h4>
                <p className="text-sm text-gray-600 max-w-xs mx-auto">
                  Akses dokumen telah dibuka. Anda dapat langsung mengunduh dan mencetak berkas resmi Anda sekarang.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Info Surat */}
                <div className="bg-primary-50/60 border border-primary-100 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-gray-800 block">{request.serviceName}</span>
                    <span className="text-gray-500 font-mono">Tiket: {request.ticketNumber}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Siap Diunduh
                  </span>
                </div>

                {/* Rating Bintang */}
                <div className="text-center">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Bagaimana kepuasan Anda terhadap layanan persuratan ini?
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
                            className={`w-8 h-8 transition-colors ${
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

                {/* Pertanyaan 1: Apakah Cukup Membantu */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                    Apakah proses layanan ini cukup membantu kebutuhan Anda?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Sangat Membantu', 'Cukup Membantu', 'Perlu Peningkatan'].map((option) => (
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

                {/* Pertanyaan 2: Kecepatan Proses */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                    Kecepatan verifikasi & penerbitan surat:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Sangat Cepat', 'Cepat & Tepat Waktu', 'Cukup / Standar'].map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => setSpeed(spd)}
                        className={`py-2 px-2 text-xs font-medium rounded-lg border transition-all text-center ${
                          speed === spd
                            ? 'bg-primary-50 border-primary-600 text-primary-700 font-bold shadow-sm'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {spd}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Saran & Masukan */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Saran atau kritik perbaikan untuk kemajuan FSTI (opsional):
                  </label>
                  <textarea
                    rows={2}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tuliskan masukan singkat Anda di sini..."
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                {/* Submit & Buka Unduh */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    fullWidth
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow-md"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Menyimpan Survei...
                      </span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Kirim Survei & Buka Unduh Surat</span>
                      </>
                    )}
                  </Button>
                  <p className="text-[11px] text-gray-400 text-center mt-2 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3 text-gray-400" />
                    Surat akan langsung dapat diunduh dalam format PDF resmi
                  </p>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
