'use client';

import { ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';
import ClientOnly from './ClientOnly';

export interface SafeMotionProps extends MotionProps {
  children: ReactNode;
  className?: string;
}

export default function SafeMotion({ children, ...props }: SafeMotionProps) {
  return (
    <ClientOnly fallback={<div className={props.className}>{children}</div>}>
      <motion.div {...props}>{children}</motion.div>
    </ClientOnly>
  );
}