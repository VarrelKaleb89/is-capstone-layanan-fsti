import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

/**
 * Sesi admin (tendik/pimpinan) berbasis cookie HttpOnly yang ditandatangani
 * HMAC-SHA256 — sesuai keputusan diskusi: session cookie kustom, tanpa
 * dependensi eksternal. Payload tidak dienkripsi (jangan taruh data rahasia
 * di dalamnya), tetapi tidak bisa dipalsukan tanpa SESSION_SECRET.
 */

export const ADMIN_COOKIE_NAME = 'fsti_admin_session';
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 hari

export type AdminRole = 'tendik' | 'pimpinan';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  nip?: string | null;
}

interface AdminSession extends AdminUser {
  /** Kedaluwarsa (epoch detik). */
  exp: number;
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'SESSION_SECRET belum diset di environment (minimal 32 karakter). ' +
        'Tambahkan ke .env untuk development atau environment variable saat deploy.'
    );
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
}

/** Membuat token sesi "payload.signature" untuk disimpan di cookie. */
export function createSessionToken(user: AdminUser): string {
  const session: AdminSession = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

/** Memverifikasi token sesi; null bila signature palsu, kadaluarsa, atau rusak. */
export function verifySessionToken(token: string | undefined): AdminSession | null {
  if (!token) return null;

  const dot = token.lastIndexOf('.');
  if (dot === -1) return null;

  const payload = token.slice(0, dot);
  const givenSignature = Buffer.from(token.slice(dot + 1));
  const expectedSignature = Buffer.from(sign(payload));

  if (
    givenSignature.length !== expectedSignature.length ||
    !timingSafeEqual(givenSignature, expectedSignature)
  ) {
    return null;
  }

  try {
    const session = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8')
    ) as AdminSession;
    if (
      typeof session.exp !== 'number' ||
      session.exp < Math.floor(Date.now() / 1000)
    ) {
      return null;
    }
    if (session.role !== 'tendik' && session.role !== 'pimpinan') return null;
    if (!session.id || !session.email) return null;
    return session;
  } catch {
    return null;
  }
}

/** Membaca sesi admin dari cookie permintaan saat ini (server-side). */
export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE_NAME)?.value);
}

/**
 * Opsi cookie sesi: HttpOnly + SameSite=Lax; flag `secure` otomatis aktif
 * di production sehingga siap deploy tanpa perubahan kode.
 */
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
    secure: process.env.NODE_ENV === 'production',
  };
}
