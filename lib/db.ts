import { PrismaClient } from '@prisma/client';

/**
 * Singleton Prisma Client untuk menghindari pembukaan koneksi baru
 * pada setiap request di lingkungan development (hot reload).
 * Rencana ERD: docs/db.md
 */
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
