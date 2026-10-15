"use client";

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import {
  Play,
  Pause,
  BookOpen,
  FileText,
  Search,
  CheckCircle2,
  HelpCircle,
  Download,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Video,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function PanduanPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const guideSteps = [
    {
      step: '1',
      title: 'Pilih Layanan & Isi Formulir Mandiri',
      desc: 'Buka menu Layanan Administrasi, pilih jenis surat (misal: Surat Keterangan Aktif Studi), lalu lengkapi data diri Anda (Nama, NIM, Prodi, Keperluan). Data Anda otomatis tersimpan dan terformat ke dalam template surat resmi FSTI.',
      actionUrl: '/layanan-administrasi/ajukan',
      actionText: 'Coba Form Pengajuan',
    },
    {
      step: '2',
      title: 'Dapatkan Nomor Tiket & Pantau di Menu Tracking',
      desc: 'Setelah mengirim permohonan, Anda akan mendapatkan Nomor Tiket Permohonan (contoh: FSTI-AKTIF-20261015-001). Cukup masukkan NIM Anda pada menu Tracking Mahasiswa untuk memantau tahapan verifikasi secara privat.',
      actionUrl: '/tracking/mahasiswa',
      actionText: 'Buka Menu Tracking',
    },
    {
      step: '3',
      title: 'Verifikasi Berjenjang oleh Tendik & Dekan',
      desc: 'Staf tendik memeriksa keabsahan berkas Anda di sistem. Setelah draft terverifikasi, dokumen diteruskan ke Dekan/Pimpinan FSTI untuk ditandatangani dan disahkan secara digital.',
      actionUrl: '/tracking/mahasiswa',
      actionText: 'Pelajari Alur Status',
    },
    {
      step: '4',
      title: 'Isi Survei 30 Detik & Unduh Dokumen Resmi',
      desc: 'Begitu surat berstatus "Siap Diunduh", klik tombol unduh. Anda akan diminta mengisi survei kepuasan singkat (30 detik). Segera setelah survei dikirim, dokumen PDF resmi dengan stempel dan TTD terkunci langsung dapat Anda unduh.',
      actionUrl: '/tracking/mahasiswa?nim=10211001',
      actionText: 'Uji Alur Survei & Unduh (Demo NIM 10211001)',
    },
  ];

  return (
    <MainLayout>
      {/* Header */}
      <section className="relative py-12 md:py-16 bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 text-white overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <AnimatedSection animation="slideUp">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Pusat Panduan & Aksesibilitas Pengguna Non-IT
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-bold">
              Panduan Penggunaan Layanan FSTI
            </h1>
            <p className="text-primary-100 mt-3 text-sm md:text-base max-w-2xl mx-auto">
              Panduan langkah demi langkah dan video tutorial interaktif untuk mempermudah civitas akademika dalam mengajukan dan melacak dokumen persuratan.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Video Tutorial Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <AnimatedSection animation="slideUp">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold font-display text-gray-900">
                Video Tutorial Alur Pelayanan
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Tonton simulasi visual alur pengajuan dari awal hingga pengunduhan surat resmi.
              </p>
            </div>

            {/* Video Player Mockup / Embed */}
            <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative aspect-video max-w-3xl mx-auto flex items-center justify-center group">
              {/* Background preview image */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-primary-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-6 text-center text-white transition-opacity duration-300 ${
                  isPlaying ? 'opacity-20' : 'opacity-100'
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center mb-4 backdrop-blur-md group-hover:scale-110 transition-transform">
                  <Video className="w-8 h-8 text-amber-300" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold max-w-md">
                  Tutorial: Cara Mengajukan Surat & Melacak Status (Untuk Mahasiswa FSTI)
                </h3>
                <p className="text-xs text-slate-300 mt-2 max-w-sm">
                  Durasi: 2 Menit 15 Detik · Disiapkan khusus untuk pengguna non-IT
                </p>
              </div>

              {/* Play / Pause Toggle Button */}
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="relative z-10 w-20 h-20 rounded-full bg-primary-600/90 hover:bg-primary-500 text-white flex items-center justify-center shadow-xl hover:scale-105 transition-all ring-8 ring-primary-500/20"
                aria-label={isPlaying ? 'Jeda Video' : 'Putar Video'}
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </button>

              {/* Video Bottom Progress Bar Indicator */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-xs text-white">
                <span className="font-mono text-xs">
                  {isPlaying ? '01:15 / 02:15 (Sedang Diputar)' : '00:00 / 02:15'}
                </span>
                <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded">
                  Kualitas 1080p HD
                </span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Step by Step Visual Guide */}
      <section className="py-14 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <AnimatedSection animation="slideUp">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                Langkah Cepat
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-gray-900 mt-2">
                4 Langkah Mudah Mendapatkan Surat Layanan FSTI
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guideSteps.map((item, idx) => (
                <div
                  key={item.step}
                  className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-600 text-white font-bold text-lg flex items-center justify-center flex-shrink-0 shadow-md">
                      {item.step}
                    </div>
                    <div className="space-y-2 flex-1">
                      <h3 className="font-bold text-base text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {item.desc}
                      </p>
                      <div className="pt-2">
                        <Link
                          href={item.actionUrl}
                          className="inline-flex items-center text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors"
                        >
                          <span>{item.actionText}</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Non-IT Section */}
      <section className="py-14 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-3xl">
          <AnimatedSection animation="slideUp">
            <h2 className="text-2xl font-bold font-display text-center text-gray-900 mb-8">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-1.5 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary-600" />
                  Mengapa saya harus mengisi survei sebelum mengunduh surat?
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  Survei kepuasan layanan digunakan oleh pimpinan FSTI untuk mengevaluasi mutu pelayanan dan memastikan kepuasan mahasiswa secara berkala. Survei hanya berisi penilaian bintang dan pertanyaan singkat (sekitar 30 detik).
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-1.5 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary-600" />
                  Apakah orang lain dapat melihat pengajuan surat saya?
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  Tidak. Sistem pelacakan FSTI telah mengisolasi data secara privat. Mahasiswa hanya dapat melihat pengajuan yang terdaftar atas NIM miliknya sendiri.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-1.5 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary-600" />
                  Apakah dokumen yang saya unduh sudah sah dan resmi?
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  Ya, dokumen yang diterbitkan berformat PDF resmi terproteksi yang dilengkapi nomor surat universitas, cap stempel resmi FSTI, tanda tangan Dekan, dan QR-Code verifikasi keabsahan.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </MainLayout>
  );
}
