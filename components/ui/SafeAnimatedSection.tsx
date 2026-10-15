'use client';

import React from 'react';
import AnimatedSection from './AnimatedSection';
import ClientOnly from '@/components/utils/ClientOnly';
import dynamic from 'next/dynamic';

// Instead of using createSafeComponent, we'll implement the pattern directly
// to avoid TypeScript errors
const DynamicAnimatedSection = dynamic(() => Promise.resolve(AnimatedSection), {
  ssr: false
});

// Define props interface to match AnimatedSection
interface SafeAnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideInRight' | 'none';
  once?: boolean;
  fallback?: React.ReactNode;
}

const SafeAnimatedSection = (props: SafeAnimatedSectionProps) => {
  const { fallback, ...animatedSectionProps } = props;
  
  return (
    <ClientOnly fallback={fallback}>
      <DynamicAnimatedSection {...animatedSectionProps} />
    </ClientOnly>
  );
};

export default SafeAnimatedSection;