import { MutableRefObject, RefObject } from 'react';

// Type-safe ref creator
export type TypedRef<T> = MutableRefObject<T | null>;

// Helper for section refs
export interface SectionRefs<T> {
  [key: string]: RefObject<T | null>;
}

// Helper for creating section ref types
export type CreateSectionRefs<T extends string> = {
  [K in T]: RefObject<HTMLDivElement | null>;
};