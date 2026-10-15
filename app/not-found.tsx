"use client";

import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg"
        >
          <div className="relative mb-8">
            <h1 className="text-9xl font-display font-bold text-primary-600 opacity-20">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-3xl font-display font-bold text-gray-800">Page Not Found</h2>
            </div>
          </div>
          
          <p className="text-gray-600 mb-12">
            The page you are looking for could not be found. It may have been moved, 
            deleted, or the URL you entered is incorrect.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button href="/" variant="primary" icon={<Home className="w-5 h-5" />} animate>
              {t('common.backToHome')}
            </Button>
            <Button 
              onClick={() => window.history.back()} 
              variant="outline" 
              icon={<ArrowLeft className="w-5 h-5" />}
              animate
            >
              {t('common.backToPrevious')}
            </Button>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}