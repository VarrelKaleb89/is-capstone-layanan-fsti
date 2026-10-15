"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-gradient-to-b from-slate-800 to-slate-900 text-gray-200 z-10 relative" id="kontak">
      {/* Top wave design */}
      <svg className="w-full h-12 -mb-1 text-slate-800 fill-current" viewBox="0 0 1440 60">
        <path d="M0,48 C480,0 960,0 1440,48 L1440,60 L0,60 Z"></path>
      </svg>

      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1: About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-display font-bold mb-6 text-gradient">{t('footer.about')}</h3>
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-4 shadow-md border border-gray-200 overflow-hidden">
                <img
                  src="/images/logofsti.png"
                  alt="FSTI Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <p className="text-white mb-1 font-medium">
                  {t('common.siteTitle')}
                </p>
                <p className="text-gray-400 text-sm">
                  {t('common.university')}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-5">
              Kampus ITK, Jl. Soekarno Hatta KM 15, Karang Joang,
              <br />
              Balikpapan Utara, Kalimantan Timur 76127
            </p>
            <div className="flex space-x-3">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/fsti.itk"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-primary-600 transition-colors duration-300"
                aria-label="Instagram"
              >
                <svg width="20" height="20" fill="currentColor" className="text-gray-300 group-hover:text-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@fsti.itk"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-primary-600 transition-colors duration-300"
                aria-label="TikTok"
              >
                <svg width="20" height="20" fill="currentColor" className="text-primary-600 hover:text-white" viewBox="0 0 24 24">
                  <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Column 2: Kontak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-display font-bold mb-6 text-gradient">{t('footer.contact')}</h3>
            <ul className="space-y-4">

              {/* Email - TETAP SAMA */}
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3 mt-1 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="text-white font-medium mb-1">{t('footer.email')}</p>
                  <a href="mailto:fsti@itk.ac.id" className="text-gray-400 hover:text-primary-400 transition-colors">
                    fsti@itk.ac.id
                  </a>
                </div>
              </li>

              {/* ===== WHATSAPP - ICON STYLE ===== */}
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 mr-3 mt-1 text-primary-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                <div>
                  <p className="text-white font-medium mb-3">WhatsApp</p>
                  <div className="flex space-x-3">
                    {/* Akademik - Biru */}
                    <a
                      href="https://wa.me/6285172302157?text=Halo%20FSTI%20ITK,%20saya%20ingin%20bertanya%20tentang%20akademik%20"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-colors duration-300"
                    >
                      📚 Akademik
                    </a>

                    {/* Keuangan - Hijau */}
                    <a
                      href="https://wa.me/6285172312157?text=Halo%20FSTI%20ITK,%20saya%20ingin%20bertanya%20tentang%20keuangan%20"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg text-sm font-medium hover:bg-green-500/30 transition-colors duration-300"
                    >
                      💰 Keuangan
                    </a>
                  </div>
                </div>
              </li>

              {/* Operational Hours - TETAP SAMA */}
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3 mt-1 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-white font-medium mb-1">{t('footer.operationalHours')}</p>
                  <p className="text-gray-400">{t('footer.operationalTime1')}</p>
                  <p className="text-gray-400">{t('footer.operationalTime2')}</p>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* Column 3: Struktur Organisasi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-display font-bold mb-6 text-gradient">{t('footer.organization')}</h3>
            <ul className="space-y-4">
              <li>
                <p className="text-white font-medium mb-1">{t('footer.dean')}</p>
                <p className="text-sm text-gray-400">Adi Mahmud Jaya Marindra, S.T., M.Eng., Ph.D.</p>
              </li>
              <li>
                <p className="text-white font-medium mb-1">{t('footer.vdAcademic')}</p>
                <p className="text-sm text-gray-400">Irma Fitria, S.Si., M.Si.</p>
              </li>
              <li>
                <p className="text-white font-medium mb-1">{t('footer.vdFinance')}</p>
                <p className="text-sm text-gray-400">Yun Tonce Kusuma Priyanto, S.T., M.T.</p>
              </li>
              <li>
                <p className="text-white font-medium mb-1">{t('footer.headScienceData')}</p>
                <p className="text-sm text-gray-400">Dr. Swastya Rahastama, S.Si., M.Si.</p>
              </li>
              <li>
                <p className="text-white font-medium mb-1">{t('footer.headTEIB')}</p>
                <p className="text-sm text-gray-400">M. Ihsan Alfani Putera, S.Tr.Kom, M.Kom</p>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Quick Links */}
        <div className="border-t border-white/10 pt-8 pb-6">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8">
            <Link href="/" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
              {t('footer.home')}
            </Link>
            <Link href="/layanan-administrasi" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
              {t('footer.services')}
            </Link>
            <Link href="/tracking" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
              {t('footer.tracking')}
            </Link>
            <Link href="/panduan" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
              Panduan
            </Link>
            <a href="https://itk.ac.id" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
              {t('footer.itkWebsite')}
            </a>
            <Link
              href="/admin"
              className="text-xs text-amber-300 hover:text-amber-200 transition-colors inline-flex items-center gap-1.5 border border-amber-400/30 px-3 py-1 rounded-full bg-amber-400/10"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>Portal Tendik & Admin</span>
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-500">
          <p>
            {t('common.copyright')} {t('common.developedBy')}{" "}
            <Link
              href="https://aidilsaputrakirsan.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              ADL
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;