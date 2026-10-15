'use client';

import React from 'react';
import ServiceCard from './ServiceCard';
import ClientOnly from '@/components/utils/ClientOnly';
import dynamic from 'next/dynamic';

// Dynamically import ServiceCard with SSR disabled
const DynamicServiceCard = dynamic(() => Promise.resolve(ServiceCard), {
  ssr: false
});

// Define interface to match ServiceCard props
interface SafeServiceCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  steps?: string[];
  requirements?: string[];
  estimatedTime?: string;
  url?: string;
  compact?: boolean;
  fallback?: React.ReactNode;
}

// Create SafeServiceCard component that wraps DynamicServiceCard with ClientOnly
const SafeServiceCard = (props: SafeServiceCardProps) => {
  const { fallback, ...serviceCardProps } = props;
  
  return (
    <ClientOnly fallback={fallback}>
      <DynamicServiceCard {...serviceCardProps} />
    </ClientOnly>
  );
};

export default SafeServiceCard;