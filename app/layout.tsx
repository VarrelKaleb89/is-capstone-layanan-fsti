import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import MaklumatPelayanan from '@/components/ui/MaklumatPelayanan';
import ParticleBackground from '@/components/backgrounds/ParticleBackground';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Faculty of Science and Information Technology ITK',
  description: 'Administrative Services Portal for the Faculty of Science and Information Technology at Kalimantan Institute of Technology',
  keywords: ['FSTI', 'ITK', 'Administrative Services', 'Faculty of Science and Information Technology', 'Kalimantan Institute of Technology'],
  authors: [{ name: 'FSTI ITK' }],
  robots: 'index,follow',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        {/* Professional Blue ParticleBackground */}
        <ParticleBackground />
        
        <LanguageProvider>
          {children}
          <MaklumatPelayanan />
        </LanguageProvider>
      </body>
    </html>
  );
}