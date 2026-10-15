"use client";

import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  GraduationCap,
  Briefcase,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

const TrackingSelectionPage = () => {
  const { t } = useLanguage();

  return (
    <MainLayout>
      {/* Header Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <AnimatedSection animation="slideUp">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-gradient">{t('tracking.title')}</h1>
            <p className="text-gray-700 max-w-3xl mx-auto text-lg mb-6">
              {t('tracking.description')}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Selection Cards Section */}
      <section className="relative py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <AnimatedSection animation="slideUp" delay={0.1}>
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-md p-8 border border-gray-200 hover:border-primary-600 transition-all duration-300 h-full">
                <div className="flex flex-col h-full">
                  <div className="rounded-full bg-primary-50 p-4 w-16 h-16 flex items-center justify-center mb-6">
                    <Briefcase className="w-8 h-8 text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">{t('tracking.lecturerStaff')}</h2>
                  <p className="text-gray-600 mb-6 flex-grow">
                    {t('tracking.lecturerDesc')}
                  </p>
                  <div className="mt-auto">
                    <Link href="/tracking/dosen">
                      <Button fullWidth className="flex items-center justify-center group">
                        {t('tracking.lecturerStaff')}
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slideUp" delay={0.2}>
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-md p-8 border border-gray-200 hover:border-primary-600 transition-all duration-300 h-full">
                <div className="flex flex-col h-full">
                  <div className="rounded-full bg-primary-50 p-4 w-16 h-16 flex items-center justify-center mb-6">
                    <GraduationCap className="w-8 h-8 text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">{t('tracking.students')}</h2>
                  <p className="text-gray-600 mb-6 flex-grow">
                    {t('tracking.studentDesc')}
                  </p>
                  <div className="mt-auto">
                    <Link href="/tracking/mahasiswa">
                      <Button fullWidth className="flex items-center justify-center group">
                        {t('tracking.students')}
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="slideUp">
            <h2 className="text-3xl font-display font-bold text-center mb-12 text-gradient">{t('tracking.faq.title')}</h2>
          </AnimatedSection>

          <div className="max-w-3xl mx-auto">
            <AnimatedSection animation="slideUp" delay={0.1}>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6 mb-6 hover-card group border border-gray-100">
                <div className="flex items-start">
                  <div className="mt-1 mr-4 text-primary-600 group-hover:text-primary-700 transition-colors">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">{t('tracking.faq.whatIs.question')}</h3>
                    <p className="text-gray-600">
                      {t('tracking.faq.whatIs.answer')}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slideUp" delay={0.2}>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6 mb-6 hover-card group border border-gray-100">
                <div className="flex items-start">
                  <div className="mt-1 mr-4 text-primary-600 group-hover:text-primary-700 transition-colors">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">{t('tracking.faq.howToUse.question')}</h3>
                    <p className="text-gray-600">
                      {t('tracking.faq.howToUse.answer')}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slideUp" delay={0.3}>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6 mb-6 hover-card group border border-gray-100">
                <div className="flex items-start">
                  <div className="mt-1 mr-4 text-primary-600 group-hover:text-primary-700 transition-colors">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">{t('tracking.faq.processingTime.question')}</h3>
                    <p className="text-gray-600">
                      {t('tracking.faq.processingTime.answer')}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slideUp" delay={0.4}>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6 hover-card group border border-gray-100">
                <div className="flex items-start">
                  <div className="mt-1 mr-4 text-primary-600 group-hover:text-primary-700 transition-colors">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">{t('tracking.faq.statusNotChanging.question')}</h3>
                    <p className="text-gray-600">
                      {t('tracking.faq.statusNotChanging.answer')}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default TrackingSelectionPage;