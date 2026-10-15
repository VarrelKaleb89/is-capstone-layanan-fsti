'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage, Language } from '@/lib/i18n/LanguageContext';
import { motion } from 'framer-motion';

// Inline SVG flags for cross-platform compatibility (emoji flags don't render on Windows)
const USFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-5 h-3.5 rounded-sm shadow-sm border border-gray-200 flex-shrink-0">
    <rect width="60" height="30" fill="#bf0a30" />
    <rect y="2.31" width="60" height="2.31" fill="#fff" />
    <rect y="6.92" width="60" height="2.31" fill="#fff" />
    <rect y="11.54" width="60" height="2.31" fill="#fff" />
    <rect y="16.15" width="60" height="2.31" fill="#fff" />
    <rect y="20.77" width="60" height="2.31" fill="#fff" />
    <rect y="25.38" width="60" height="2.31" fill="#fff" />
    <rect width="24" height="16.15" fill="#002868" />
  </svg>
);

const IDFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" className="w-5 h-4 rounded-sm shadow-sm border border-gray-200">
    <path fill="#e70011" d="M0 0h640v240H0z" />
    <path fill="#fff" d="M0 240h640v240H0z" />
  </svg>
);

const LanguageToggle = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 text-primary-600 border border-primary-200 rounded-md hover:bg-primary-50 transition-colors"
        aria-expanded={isOpen}
        aria-label={t('nav.language')}
      >
        {language === 'en' ? <USFlag /> : <IDFlag />}
        <span className="font-medium text-sm">{language === 'en' ? 'EN' : 'ID'}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`flex items-center w-full text-left px-4 py-2.5 text-sm gap-3 ${language === 'en' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              role="menuitem"
            >
              <USFlag />
              <span>English</span>
              {language === 'en' && (
                <svg className="w-4 h-4 ml-auto text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={() => handleLanguageChange('id')}
              className={`flex items-center w-full text-left px-4 py-2.5 text-sm gap-3 ${language === 'id' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              role="menuitem"
            >
              <IDFlag />
              <span>Bahasa Indonesia</span>
              {language === 'id' && (
                <svg className="w-4 h-4 ml-auto text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LanguageToggle;
