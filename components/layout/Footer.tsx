"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Mail, Clock, MapPin, MessageSquare, ShieldCheck } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 z-10 relative" id="kontak">
      <div className="container mx-auto px-4 pt-14 pb-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Column 1: Identitas & Profil */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-5 font-display">
              {t('footer.about')}
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl p-1 flex items-center justify-center flex-shrink-0 border border-slate-700">
                <Image
                  src="/images/logofsti.png"
                  alt="Logo FSTI ITK"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-white text-sm font-bold font-display leading-tight">
                  {t('common.siteTitle')}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">
                  {t('common.university')}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-5 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
              <span>
                Kampus ITK, Jl. Soekarno Hatta KM 15, Karang Joang, Balikpapan Utara, Kalimantan Timur 76127
              </span>
            </p>
            <div className="flex items-center gap-2">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/fsti.itk"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
                aria-label="Instagram FSTI ITK"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@fsti.itk"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
                aria-label="TikTok FSTI ITK"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Column 2: Saluran Kontak & Jam Layanan */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-5 font-display">
              {t('footer.contact')}
            </h3>
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 text-primary-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">{t('footer.email')}</p>
                  <a href="mailto:fsti@itk.ac.id" className="text-xs sm:text-sm font-semibold text-white hover:text-primary-400 transition-colors">
                    fsti@itk.ac.id
                  </a>
                </div>
              </div>

              {/* WhatsApp Helpdesk */}
              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 mt-0.5 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 mb-1.5">Layanan Helpdesk WhatsApp</p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="https://wa.me/6285172302157?text=Halo%20FSTI%20ITK,%20saya%20ingin%20bertanya%20tentang%20akademik%20"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
                    >
                      Akademik (+62 851-7230-2157)
                    </a>
                    <a
                      href="https://wa.me/6285172312157?text=Halo%20FSTI%20ITK,%20saya%20ingin%20bertanya%20tentang%20keuangan%20"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
                    >
                      Keuangan (+62 851-7231-2157)
                    </a>
                  </div>
                </div>
              </div>

              {/* Jam Operasional */}
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">{t('footer.operationalHours')}</p>
                  <p className="text-xs text-slate-300">{t('footer.operationalTime1')}</p>
                  <p className="text-xs text-slate-300">{t('footer.operationalTime2')}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Column 3: Pimpinan Fakultas */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-5 font-display">
              {t('footer.organization')}
            </h3>
            <ul className="space-y-3 text-xs">
              <li className="border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 block text-[11px]">{t('footer.dean')}</span>
                <span className="text-slate-200 font-medium">Adi Mahmud Jaya Marindra, S.T., M.Eng., Ph.D.</span>
              </li>
              <li className="border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 block text-[11px]">{t('footer.vdAcademic')}</span>
                <span className="text-slate-200 font-medium">Irma Fitria, S.Si., M.Si.</span>
              </li>
              <li className="border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 block text-[11px]">{t('footer.vdFinance')}</span>
                <span className="text-slate-200 font-medium">Yun Tonce Kusuma Priyanto, S.T., M.T.</span>
              </li>
              <li className="border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 block text-[11px]">{t('footer.headScienceData')}</span>
                <span className="text-slate-200 font-medium">Dr. Swastya Rahastama, S.Si., M.Si.</span>
              </li>
              <li>
                <span className="text-slate-400 block text-[11px]">{t('footer.headTEIB')}</span>
                <span className="text-slate-200 font-medium">M. Ihsan Alfani Putera, S.Tr.Kom, M.Kom</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Quick Links & Admin Link */}
        <div className="border-t border-slate-800 pt-6 pb-6">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">
              {t('footer.home')}
            </Link>
            <Link href="/layanan-administrasi" className="text-slate-400 hover:text-white transition-colors">
              {t('footer.services')}
            </Link>
            <Link href="/tracking" className="text-slate-400 hover:text-white transition-colors">
              {t('footer.tracking')}
            </Link>
            <Link href="/panduan" className="text-slate-400 hover:text-white transition-colors">
              Panduan
            </Link>
            <Link href="/survey-kepuasan" className="text-slate-400 hover:text-white transition-colors">
              Survei Kepuasan
            </Link>
            <a href="https://itk.ac.id" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              {t('footer.itkWebsite')}
            </a>
            <Link
              href="/admin"
              className="text-amber-300 hover:text-amber-200 transition-colors inline-flex items-center gap-1.5 border border-amber-400/30 px-2.5 py-0.5 rounded-full bg-amber-400/10 font-medium text-[11px]"
            >
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>Portal Tendik & Admin</span>
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-slate-500 border-t border-slate-800/60 pt-4">
          <p>
            © {currentYear} Fakultas Sains dan Teknologi Informasi, Institut Teknologi Kalimantan.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;