import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';

/**
 * GET /api/auth/me
 * Mengembalikan user sesi aktif (dari cookie), atau null bila belum login.
 * Dipakai halaman /admin untuk memulihkan sesi saat reload.
 */
export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: session.id,
      email: session.email,
      name: session.name,
      role: session.role,
      nip: session.nip,
    },
  });
}
