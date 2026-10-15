'use client';

import { useEffect, useState, ReactNode } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';

interface FramerMotionProviderProps {
  children: ReactNode;
}

// Simple component that only loads framer-motion features on client side
function FramerMotionProvider({ children }: FramerMotionProviderProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}

export default FramerMotionProvider;