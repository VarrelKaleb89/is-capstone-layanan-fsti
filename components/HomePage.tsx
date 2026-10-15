"use client";

import { useState, useEffect, ReactNode } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import SectionDivider from '@/components/ui/SectionDivider';
import ServiceCard from '@/components/ui/ServiceCard';
import SafeAnimatedSection from '@/components/ui/SafeAnimatedSection';
import { motion } from 'framer-motion';
import ClientOnly from '@/components/utils/ClientOnly';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/lib/i18n/LanguageContext';

// Icons
import {
  FileText,
  Briefcase,
  CheckCircle,
  RefreshCcw,
  Award,
  Users,
  ArrowRight,
  GraduationCap,
  Database,
  LineChart,
  Code,
  Zap,
  Server,
  ChevronRight
} from 'lucide-react';

// Hero Background Component
const HeroBackground = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    '/images/beranda/b1.jpg',
    '/images/beranda/b2.jpg',
    '/images/beranda/b3.JPG',
    '/images/beranda/b4.JPG',
    '/images/beranda/b5.jpg',
    '/images/beranda/b6.jpg',
    '/images/beranda/b7.jpg',
    '/images/beranda/b8.JPG',
    '/images/beranda/b9.JPG',
    '/images/beranda/b10.jpg',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="absolute inset-0 z-0">
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <Image
            src={src}
            alt={`Campus image ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}
      {/* Dark gradient overlay to make text readable and pop */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-900/80 to-gray-800/40"></div>
    </div>
  );
};

// Wrap motion.div with ClientOnly component for safe client-side rendering
interface SafeMotionProps {
  children: ReactNode;
  [key: string]: any;
}

const SafeMotion = ({ children, ...props }: SafeMotionProps) => (
  <ClientOnly>
    <motion.div {...props}>
      {children}
    </motion.div>
  </ClientOnly>
);

function HomePage() {
  const { t } = useLanguage();

  return (
    <MainLayout>
      {/* Hero Section - Full Bleed Style */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <ClientOnly>
          <HeroBackground />
        </ClientOnly>

        <div className="container mx-auto px-4 relative z-10 py-20 mt-10">
          <ClientOnly>
            <motion.div
              className="max-w-3xl"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2,
                    delayChildren: 0.1
                  }
                }
              }}
            >
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }
                  }
                }}
                className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight text-white drop-shadow-lg"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white bg-[length:200%_auto] animate-gradient-slow block">
                  {t('home.hero.title')}
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-400 bg-[length:200%_auto] animate-gradient-slow">
                  {t('common.university')}
                </span>
              </motion.h1>

              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.8 }
                  }
                }}
                className="text-gray-300 mb-10 text-lg md:text-xl max-w-2xl leading-relaxed font-light"
              >
                {t('home.hero.description')}
              </motion.p>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.8 }
                  }
                }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  href="/layanan-administrasi"
                  variant="primary"
                  size="lg"
                  icon={<FileText className="w-5 h-5" />}
                  animate
                  className="bg-blue-600 hover:bg-blue-500 text-white border-none shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:scale-105"
                >
                  {t('home.hero.viewServices')}
                </Button>
                <Button
                  href="/tracking"
                  variant="outline"
                  size="lg"
                  icon={<RefreshCcw className="w-5 h-5" />}
                  animate
                  className="bg-white/5 backdrop-blur-md border border-white/20 text-white hover:bg-white/10 transition-all hover:scale-105"
                >
                  {t('home.hero.trackDocuments')}
                </Button>
              </motion.div>
            </motion.div>
          </ClientOnly>
        </div>

        {/* Bottom Wave Transition */}
        <div className="absolute bottom-0 left-0 w-full z-10 translate-y-[2px]">
          <svg viewBox="0 0 1440 120" className="w-full h-auto block" preserveAspectRatio="none">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="#f8fafc"></path>
          </svg>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="relative py-20 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <SafeAnimatedSection animation="slideUp">
            <div className="text-center mb-16 relative z-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 inline-block text-gradient">
                {t('home.popularServices.title')}
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                {t('home.popularServices.description')}
              </p>
            </div>
          </SafeAnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* Service 1 */}
            <SafeAnimatedSection animation="slideUp" delay={0.1}>
              <ServiceCard
                id="surat-umum"
                title={t('home.popularServices.coverLetterTitle')}
                description={t('home.popularServices.coverLetterDesc')}
                icon={<FileText />}
                url="/layanan-administrasi/ajukan?jenis=surat-aktif-studi"
                compact
              />
            </SafeAnimatedSection>

            {/* Service 2 */}
            <SafeAnimatedSection animation="slideUp" delay={0.2}>
              <ServiceCard
                id="kp-ta"
                title={t('home.popularServices.internshipTitle')}
                description={t('home.popularServices.internshipDesc')}
                icon={<Briefcase />}
                url="/layanan-administrasi#kp-ta"
                compact
              />
            </SafeAnimatedSection>

            {/* Service 3 */}
            <SafeAnimatedSection animation="slideUp" delay={0.3}>
              <ServiceCard
                id="legalisasi"
                title={t('home.popularServices.legalizationTitle')}
                description={t('home.popularServices.legalizationDesc')}
                icon={<CheckCircle />}
                url="/layanan-administrasi/ajukan?jenis=legalisasi-dokumen"
                compact
              />
            </SafeAnimatedSection>
          </div>

          <SafeAnimatedSection className="text-center mt-12 relative z-10" animation="fadeIn" delay={0.4}>
            <Button
              href="/layanan-administrasi"
              variant="outline"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {t('common.viewAll')}
            </Button>
          </SafeAnimatedSection>
        </div>
      </section>

      {/* 
        Program Studi Section & Organization Structure COMMENTED OUT
        per requirement to focus on administrative services 
      */}

      {/* Divider: Popular Services → CTA */}
      <div className="relative z-10">
        <SectionDivider type="curve" fillColor="rgba(255, 255, 255, 0.8)" bgColor="rgba(248, 250, 252, 0.7)" />
      </div>

      {/* CTA Section */}
      <section className="relative py-20 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center relative z-10">
          <SafeAnimatedSection animation="slideUp">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-primary-800">{t('common.needHelp')}</h2>
            <p className="text-gray-700 mb-10 max-w-2xl mx-auto text-lg">
              {t('services.needHelp.description')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                href="mailto:fsti@itk.ac.id"
                variant="primary"
                size="lg"
                icon={<svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
                </svg>}
                animate
              >
                {t('common.email')}
              </Button>
              <Button
                href="#kontak"
                variant="outline"
                size="lg"
                icon={<svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>}
                animate
              >
                {t('common.contact')}
              </Button>
            </div>
          </SafeAnimatedSection>
        </div>
      </section>
    </MainLayout>
  );
}

// Export with SSR disabled to avoid hydration issues
export default HomePage;