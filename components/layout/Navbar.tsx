"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, Variants } from 'framer-motion';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import ClientOnly from '@/components/utils/ClientOnly';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const menuVariants: Variants = {
    closed: {
      opacity: 0,
      x: "-100%",
      transition: {
        duration: 0.3,
        ease: [0.42, 0, 0.58, 1] as const
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: [0.42, 0, 0.58, 1] as const
      }
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 py-2.5 transition-all duration-200">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Institutional Brandmark & Logos */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group py-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="h-8 w-8 relative flex items-center justify-center">
                <Image
                  src="/images/logotut.png"
                  alt="Tut Wuri Handayani"
                  fill
                  className="object-contain"
                  sizes="32px"
                />
              </div>
              <div className="h-8 w-11 relative flex items-center justify-center">
                <Image
                  src="/images/logosaintek.png"
                  alt="Diktisaintek"
                  fill
                  className="object-contain"
                  sizes="44px"
                />
              </div>
              <div className="h-8 w-8 relative flex items-center justify-center">
                <Image
                  src="/images/logoitk.png"
                  alt="Institut Teknologi Kalimantan"
                  fill
                  className="object-contain"
                  sizes="32px"
                />
              </div>
              <div className="h-8 w-8 relative flex items-center justify-center">
                <Image
                  src="/images/logofsti.png"
                  alt="Fakultas Sains dan Teknologi Informasi"
                  fill
                  className="object-contain"
                  sizes="32px"
                />
              </div>
            </div>
            <div className="hidden lg:block border-l border-slate-200 pl-3 leading-tight">
              <span className="font-display font-bold text-sm text-slate-900 block tracking-tight">
                Layanan FSTI
              </span>
              <span className="text-[10px] text-slate-500 font-medium block">
                Institut Teknologi Kalimantan
              </span>
            </div>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden lg:flex items-center space-x-1.5 xl:space-x-2">
            <NavLink href="/layanan-administrasi" active={pathname?.includes('/layanan-administrasi')}>
              {t('nav.adminServices')}
            </NavLink>
            <NavLink href="/tracking" active={pathname?.includes('/tracking')}>
              {t('nav.docTracking')}
            </NavLink>
            <NavLink href="/survey-kepuasan" active={pathname?.includes('/survey-kepuasan')}>
              {t('nav.survey')}
            </NavLink>
            <NavLink href="/panduan" active={pathname?.includes('/panduan')}>
              {t('nav.guide')}
            </NavLink>
            <NavLink href="#kontak" active={false}>
              {t('nav.contact')}
            </NavLink>
            
            <div className="pl-2 flex items-center gap-2 border-l border-slate-200">
              <LanguageToggle />
              <Link
                href="/admin"
                title="Portal Khusus Tendik & Pimpinan FSTI"
                className="p-1.5 px-2.5 rounded-lg border border-slate-200 text-slate-700 hover:text-primary-700 hover:border-primary-300 hover:bg-primary-50/60 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-primary-600" />
                <span>Admin</span>
              </Link>
            </div>
          </div>

          {/* Menu Mobile Toggle Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <Link
              href="/admin"
              title="Portal Admin"
              className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-primary-600" />
            </Link>
            <LanguageToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-800 hover:bg-slate-100 rounded-lg focus:outline-none"
              aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            >
              <span className="sr-only">{isOpen ? "Tutup menu" : "Buka menu"}</span>
              <div className="relative w-5 h-4">
                <span
                  className={`absolute h-0.5 w-5 bg-slate-800 transform transition-all duration-200 ease-in-out ${
                    isOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
                  style={{ top: '0' }}
                />
                <span
                  className={`absolute h-0.5 bg-slate-800 transform transition-all duration-200 ease-in-out ${
                    isOpen ? 'w-0 opacity-0' : 'w-5 opacity-100'
                  }`}
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                />
                <span
                  className={`absolute h-0.5 w-5 bg-slate-800 transform transition-all duration-200 ease-in-out ${
                    isOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}
                  style={{ bottom: '0' }}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <ClientOnly>
          <AnimatePresence>
            {isOpen && (
              <m.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden bg-white border-b border-slate-200 overflow-hidden"
              >
                <div className="container mx-auto px-4 py-4 space-y-1">
                  <MobileNavLink
                    href="/layanan-administrasi"
                    active={pathname?.includes('/layanan-administrasi')}
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.adminServices')}
                  </MobileNavLink>
                  <MobileNavLink
                    href="/tracking"
                    active={pathname?.includes('/tracking')}
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.docTracking')}
                  </MobileNavLink>
                  <MobileNavLink
                    href="/survey-kepuasan"
                    active={pathname?.includes('/survey-kepuasan')}
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.survey')}
                  </MobileNavLink>
                  <MobileNavLink
                    href="/panduan"
                    active={pathname?.includes('/panduan')}
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.guide')}
                  </MobileNavLink>
                  <MobileNavLink
                    href="#kontak"
                    active={false}
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.contact')}
                  </MobileNavLink>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Portal Resmi FSTI ITK</span>
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="text-primary-600 font-semibold hover:underline"
                    >
                      Masuk Portal Tendik
                    </Link>
                  </div>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </ClientOnly>
      </nav>
    </LazyMotion>
  );
};

const NavLink = ({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) => {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
        active
          ? 'bg-primary-50 text-primary-700 font-bold'
          : 'text-slate-700 hover:text-primary-600 hover:bg-slate-50'
      }`}
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({
  href,
  active,
  onClick,
  children
}: {
  href: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode
}) => {
  return (
    <Link
      href={href}
      className={`block py-2 px-3 text-xs sm:text-sm font-semibold rounded-xl transition-colors ${
        active
          ? 'bg-primary-50 text-primary-700'
          : 'text-slate-700 hover:bg-slate-50'
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default Navbar;