'use client';

import React from 'react';
import Button from './Button';
import ClientOnly from '@/components/utils/ClientOnly';
import dynamic from 'next/dynamic';

// Dynamically import Button with SSR disabled
const DynamicButton = dynamic(() => Promise.resolve(Button), {
  ssr: false
});

// Define the interface to match Button props
interface SafeButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'white';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  animate?: boolean;
  fallback?: React.ReactNode;
}

// Create SafeButton component that wraps DynamicButton with ClientOnly
const SafeButton = (props: SafeButtonProps) => {
  const { fallback, ...buttonProps } = props;
  
  return (
    <ClientOnly fallback={fallback}>
      <DynamicButton {...buttonProps} />
    </ClientOnly>
  );
};

export default SafeButton;