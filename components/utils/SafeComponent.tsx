'use client';

import React, { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import ClientOnly from './ClientOnly';

// Fix for TypeScript constraint issue
export function createSafeComponent<T extends React.JSX.IntrinsicAttributes>(Component: ComponentType<T>) {
  // Create dynamic component with ssr: false
  const DynamicComponent = dynamic(() => Promise.resolve(Component), { ssr: false });
  
  // Return wrapped safe component
  const SafeComponent = (props: T & { fallback?: React.ReactNode }) => {
    const { fallback, ...componentProps } = props;
    
    return (
      <ClientOnly fallback={fallback}>
        <DynamicComponent {...componentProps as T} />
      </ClientOnly>
    );
  };
  
  return SafeComponent;
}