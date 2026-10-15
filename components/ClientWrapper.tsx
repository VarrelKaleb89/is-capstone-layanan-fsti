'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import HomePage dengan proper loading
const HomePage = dynamic(() => import('@/components/HomePage'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-light-bg flex items-center justify-center">
      <div className="text-primary-600">Loading...</div>
    </div>
  )
});

export default function ClientWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log("🚀 ClientWrapper mounted");
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-light-bg flex items-center justify-center">
        <div className="text-primary-600">Initializing...</div>
      </div>
    );
  }

  return <HomePage />;
}