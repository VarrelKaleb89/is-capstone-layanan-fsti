'use client';

import { ReactNode } from 'react';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';

interface LanguageProviderWrapperProps {
  children: ReactNode;
}

export default function LanguageProviderWrapper({ children }: LanguageProviderWrapperProps) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}