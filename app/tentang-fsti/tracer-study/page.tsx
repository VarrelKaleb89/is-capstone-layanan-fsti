"use client";

import MainLayout from '@/components/layout/MainLayout';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { 
  GraduationCap, 
  Users, 
  TrendingUp, 
  Building, 
  ChevronLeft,
  ExternalLink,
  FileText,
  CheckCircle
} from 'lucide-react';

const TracerStudyPage = () => {
  const { t, language } = useLanguage();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="slideUp">
            <div className="text-center max-w-4xl mx-auto">
              {/* Back Button */}
              <div className="mb-6">
                <Button 
                  href="/tentang-fsti" 
                  variant="outline"
                  icon={<ChevronLeft className="w-4 h-4" />}
                  size="sm"
                >
                  {language === 'en' ? 'Back to About FSTI' : 'Kembali ke Tentang FSTI'}
                </Button>
              </div>

              <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-gradient">
                {t('tracerStudy.title')}
              </h1>
              <p className="text-gray-700 text-lg mb-8">
                {t('tracerStudy.subtitle')}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Mengapa Tracer Study Penting */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="slideUp">
            <h2 className="text-3xl font-display font-bold text-center mb-12 text-gradient">
              {t('tracerStudy.whyImportant.title')}
            </h2>
          </AnimatedSection>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatedSection animation="slideUp" delay={0.1}>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center hover-card">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{t('tracerStudy.whyImportant.quality.title')}</h3>
                <p className="text-gray-600 text-sm">{t('tracerStudy.whyImportant.quality.desc')}</p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slideUp" delay={0.2}>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center hover-card">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{t('tracerStudy.whyImportant.relevance.title')}</h3>
                <p className="text-gray-600 text-sm">{t('tracerStudy.whyImportant.relevance.desc')}</p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slideUp" delay={0.3}>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center hover-card">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{t('tracerStudy.whyImportant.network.title')}</h3>
                <p className="text-gray-600 text-sm">{t('tracerStudy.whyImportant.network.desc')}</p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slideUp" delay={0.4}>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 text-center hover-card">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{t('tracerStudy.whyImportant.accreditation.title')}</h3>
                <p className="text-gray-600 text-sm">{t('tracerStudy.whyImportant.accreditation.desc')}</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Google Form Embed Section */}
      <section className="py-16 bg-light-bg">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="slideUp">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-8 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4" />
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    {t('tracerStudy.form.title')}
                  </h2>
                  <p className="text-primary-100">
                    {t('tracerStudy.form.description')}
                  </p>
                </div>

                {/* Iframe Container */}
                <div className="p-4 md:p-8">
                  <div className="bg-gray-50 rounded-xl overflow-hidden" style={{height: '520px'}}>
                    <iframe 
                      src="https://docs.google.com/forms/d/e/1FAIpQLSe09s1JB6Sm4005NakxU9uNVnLyGBEiIEv8oSO2EdLG81LIeA/viewform?embedded=true" 
                      width="100%" 
                      height="520"
                      style={{border: 'none'}}
                      title="Tracer Study Form"
                    >
                      Loading…
                    </iframe>
                  </div>

                  {/* Alternative Link */}
                  <div className="mt-6 text-center">
                    <p className="text-gray-600 mb-4">
                      {language === 'en' 
                        ? 'Having trouble viewing the form? Open it in a new tab' 
                        : 'Kesulitan melihat form? Buka di tab baru'}
                    </p>
                    <a
                      href="https://docs.google.com/forms/d/e/1FAIpQLSe09s1JB6Sm4005NakxU9uNVnLyGBEiIEv8oSO2EdLG81LIeA/viewform"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-300 font-medium"
                    >
                      {language === 'en' ? 'Open Form in New Tab' : 'Buka Form di Tab Baru'}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Manfaat Mengisi Tracer Study */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="slideUp">
            <h2 className="text-3xl font-display font-bold text-center mb-12 text-gradient">
              {t('tracerStudy.benefits.title')}
            </h2>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatedSection animation="slideUp" delay={0.1}>
              <div className="flex items-start bg-green-50 rounded-xl p-6 hover-card">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-gray-800 mb-2">{t('tracerStudy.benefits.benefit1.title')}</h3>
                  <p className="text-gray-600 text-sm">{t('tracerStudy.benefits.benefit1.desc')}</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slideUp" delay={0.2}>
              <div className="flex items-start bg-blue-50 rounded-xl p-6 hover-card">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-gray-800 mb-2">{t('tracerStudy.benefits.benefit2.title')}</h3>
                  <p className="text-gray-600 text-sm">{t('tracerStudy.benefits.benefit2.desc')}</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slideUp" delay={0.3}>
              <div className="flex items-start bg-purple-50 rounded-xl p-6 hover-card">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-gray-800 mb-2">{t('tracerStudy.benefits.benefit3.title')}</h3>
                  <p className="text-gray-600 text-sm">{t('tracerStudy.benefits.benefit3.desc')}</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slideUp" delay={0.4}>
              <div className="flex items-start bg-orange-50 rounded-xl p-6 hover-card">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-gray-800 mb-2">{t('tracerStudy.benefits.benefit4.title')}</h3>
                  <p className="text-gray-600 text-sm">{t('tracerStudy.benefits.benefit4.desc')}</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-light-bg to-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection animation="slideUp">
            <h2 className="text-2xl font-display font-bold mb-6 text-gray-800">
              {t('tracerStudy.cta.title')}
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              {t('tracerStudy.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                href="mailto:fsti@itk.ac.id" 
                variant="primary"
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
                href="/tentang-fsti" 
                variant="outline"
                icon={<ChevronLeft className="w-4 h-4" />}
                animate
              >
                {language === 'en' ? 'Back to About FSTI' : 'Kembali ke Tentang FSTI'}
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </MainLayout>
  );
};

export default TracerStudyPage;