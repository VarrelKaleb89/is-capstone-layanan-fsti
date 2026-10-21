import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME } from '@/lib/auth';

/**
 * POST /api/auth/logout
 * Menghapus cookie sesi admin.
 */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE_NAME);
  return res;
}
