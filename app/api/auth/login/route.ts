import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { ADMIN_COOKIE_NAME, createSessionToken, sessionCookieOptions } from '@/lib/auth';

/**
 * POST /api/auth/login
 * Verifikasi email + password (bcrypt) terhadap tabel users, lalu
 * menetapkan cookie sesi HttpOnly. Peran (tendik/pimpinan) diambil
 * dari database — bukan dari input klien.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; password?: string };
    const email = body.email?.trim().toLowerCase() ?? '';
    const password = body.password ?? '';

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password wajib diisi.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return NextResponse.json({ error: 'Email atau password salah.' }, { status: 401 });
    }

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      nip: user.nip,
    };

    const res = NextResponse.json({ user: sessionUser });
    res.cookies.set(ADMIN_COOKIE_NAME, createSessionToken(sessionUser), sessionCookieOptions());
    return res;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Login gagal';
    console.error('POST /api/auth/login error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
