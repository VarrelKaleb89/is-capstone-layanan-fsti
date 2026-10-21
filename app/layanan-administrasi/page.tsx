import { redirect } from 'next/navigation';

/**
 * Katalog layanan kini menjadi halaman utama (~/).
 * Route ini dipertahankan sebagai redirect agar semua tautan lama
 * (navbar, footer, formulir pengajuan) tetap berfungsi.
 */
export default function LayananAdministrasiPage() {
  redirect('/');
}
