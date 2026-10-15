"use client";

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { GraduationCap, Users, ShieldCheck, Clock, MessageCircle, ExternalLink, Handshake, Building2 } from 'lucide-react';

const SURVEY_LINKS = {
  dosenTendik: {
    embedUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSeFR7tN9RoOWGqz-E--tMcZKMv_iREVkzC9VINta2kkpaZS0Q/viewform?embedded=true',
    directUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSeFR7tN9RoOWGqz-E--tMcZKMv_iREVkzC9VINta2kkpaZS0Q/viewform?usp=header',
    label: { id: 'Dosen / Tendik', en: 'Lecturer / Staff' },
    icon: Users,
  },
  mahasiswa: {
    embedUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSeTQFzGhGqFMDlKHL8qKzDuIrl04HTZWduzK60clBEK9y7Q7g/viewform?embedded=true',
    directUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSeTQFzGhGqFMDlKHL8qKzDuIrl04HTZWduzK60clBEK9y7Q7g/viewform?usp=header',
    label: { id: 'Mahasiswa', en: 'Student' },
    icon: GraduationCap,
  },
  mitraKinerja: {
    embedUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSeNngVVYpeDWgEarAmpB1qVf8-kfD-BLyS4k01WBh2TJeUCkg/viewform?embedded=true',
    directUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSeNngVVYpeDWgEarAmpB1qVf8-kfD-BLyS4k01WBh2TJeUCkg/viewform',
    label: { id: 'Mitra – Kinerja Mahasiswa KP', en: 'Partner – Student Internship' },
    icon: Handshake,
  },
  mitraPengguna: {
    embedUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLScjIZsD5xG_-v9iinQY8vKVuCYFBencPTKftccY9Traqfm-iA/viewform?embedded=true',
    directUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLScjIZsD5xG_-v9iinQY8vKVuCYFBencPTKftccY9Traqfm-iA/viewform',
    label: { id: 'Mitra – Pengguna FSTI ITK', en: 'Partner – FSTI ITK Users' },
    icon: Building2,
  },
};

const FEATURES = [
  {
    icon: ShieldCheck,
    label: { id: 'Layanan Berkualitas', en: 'Quality Service' },
  },
  {
    icon: Clock,
    label: { id: 'Respon Cepat', en: 'Fast Response' },
  },
  {
    icon: MessageCircle,
    label: { id: 'Pendapat Anda Penting', en: 'Your Opinion Matters' },
  },
];

type TabKey = keyof typeof SURVEY_LINKS;

export default function SurveyKepuasanPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>('dosenTendik');

  const tabs = Object.entries(SURVEY_LINKS) as [TabKey, (typeof SURVEY_LINKS)[TabKey]][];
  const lang = language as 'id' | 'en';

  return (
    <MainLayout>
      <AnimatedSection>
        <div className="max-w-4xl mx-auto px-4 py-10">

          {/* Hero Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-400 mb-3">
              {lang === 'id' ? 'Survei Kepuasan Layanan' : 'Service Satisfaction Survey'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base max-w-xl mx-auto">
              {lang === 'id'
                ? 'Bantu kami meningkatkan layanan dengan memberikan umpan balik dan penilaian atas pengalaman Anda.'
                : 'Help us improve our services by sharing your feedback and rating your experience.'}
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {FEATURES.map(({ icon: Icon, label }) => (
                <div
                  key={label.id}
                  className="flex flex-col items-center gap-2 bg-white border border-gray-100 rounded-xl p-5 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Icon size={20} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 text-center">
                    {label[lang]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex justify-center gap-3 mb-4">
            {tabs.map(([key, config]) => {
              const Icon = config.icon;
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <Icon size={16} />
                  {config.label[lang]}
                </button>
              );
            })}
          </div>

          {/* Open in new tab button */}
          <div className="flex justify-end mb-3">
            <a
              href={SURVEY_LINKS[activeTab].directUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ExternalLink size={14} />
              {lang === 'id' ? 'Buka di tab baru' : 'Open in new tab'}
            </a>
          </div>

          {/* Iframe Embed — force light background */}
          <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md bg-white">
            <iframe
              key={activeTab}
              src={SURVEY_LINKS[activeTab].embedUrl}
              width="100%"
              height="700"
              title={`Survei ${SURVEY_LINKS[activeTab].label[lang]}`}
              className="w-full border-0 bg-white"
              loading="lazy"
              style={{ colorScheme: 'light' }}
            >
              {lang === 'id' ? 'Memuat...' : 'Loading...'}
            </iframe>
          </div>

        </div>
      </AnimatedSection>
    </MainLayout>
  );
}
