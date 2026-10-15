# Portal Layanan Administrasi FSTI

Aplikasi web komprehensif untuk Fakultas Sains dan Teknologi Informasi (FSTI) di Institut Teknologi Kalimantan (ITK). Portal ini mengelola layanan administrasi, pelacakan dokumen, dan informasi fakultas.

![Portal FSTI](https://github.com/yourusername/layanan-fsti/raw/main/public/images/logofsti.png)

## Daftar Isi

- [Fitur](#fitur)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Struktur Proyek](#struktur-proyek)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Pengembangan](#pengembangan)
- [Internasionalisasi](#internasionalisasi)
- [Deployment](#deployment)
- [Kontribusi](#kontribusi)

## Fitur

- **Portal Layanan Administrasi**: Daftar komprehensif layanan yang tersedia untuk mahasiswa dan dosen
- **Sistem Pelacakan Dokumen**: Pelacakan real-time dokumen administrasi untuk mahasiswa dan dosen
- **Desain Responsif**: Antarmuka yang sepenuhnya responsif, berfungsi di desktop, tablet, dan perangkat seluler
- **Dukungan Dwibahasa**: Dukungan penuh untuk bahasa Indonesia dan Inggris
- **UI Modern**: Antarmuka yang bersih dan mudah diakses dengan animasi dan umpan balik visual
- **Dioptimalkan untuk SEO**: Dibangun dengan mempertimbangkan optimasi mesin pencari

## Teknologi yang Digunakan

- **Framework**: [Next.js 15+](https://nextjs.org/)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Komponen UI**: Komponen kustom dengan [Framer Motion](https://www.framer.com/motion/) untuk animasi
- **Ikon**: [Lucide React](https://lucide.dev/docs/lucide-react) untuk ikon SVG
- **Efek Background**: [react-tsparticles](https://github.com/matteobruni/tsparticles)
- **Library Animasi**: [AOS](https://michalsnik.github.io/aos/) untuk animasi scroll

## Struktur Proyek

```
layanan-fsti/
├── app/                         # Direktori app Next.js (App Router)
│   ├── api/                     # Rute API
│   │   └── survey-proxy/        # Proxy CORS untuk Google Apps Script Survey
│   ├── layanan-administrasi/    # Halaman layanan administrasi
│   ├── peraturan-kebijakan/     # Halaman peraturan dan kebijakan
│   ├── tracking/                # Halaman pelacakan dokumen
│   │   ├── dosen/               # Pelacakan dokumen dosen
│   │   └── mahasiswa/           # Pelacakan dokumen mahasiswa
│   ├── globals.css              # Stylesheet CSS global
│   ├── animation.css            # Stylesheet animasi
│   ├── layout.tsx               # Komponen layout utama
│   └── page.tsx                 # Halaman beranda
├── components/                  # Komponen React
│   ├── layout/                  # Komponen layout (Navbar, Footer,dll)
│   ├── ui/                      # Komponen UI (Button, ServiceCard, dll)
│   ├── utils/                   # Komponen utilitas
│   ├── ClientWrapper.tsx        # Komponen wrapper sisi klien
│   └── HomePage.tsx             # Komponen halaman beranda
├── lib/                         # Fungsi dan hook utilitas
│   ├── i18n/                    # Internasionalisasi
│   │   ├── LanguageContext.tsx  # Provider konteks bahasa
│   │   └── translations.ts      # String terjemahan
│   └── ref-utils.ts             # Fungsi utilitas ref
├── public/                      # Aset statis
│   ├── images/                  # Gambar
│   └── ...                      # File statis lainnya
├── .gitignore                   # File Git ignore
├── next.config.ts               # Konfigurasi Next.js
├── package.json                 # Dependensi proyek
├── postcss.config.js            # Konfigurasi PostCSS
├── tailwind.config.js           # Konfigurasi TailwindCSS
└── tsconfig.json                # Konfigurasi TypeScript
```

## Instalasi

### Prasyarat

- Node.js 18.x atau lebih tinggi
- npm 9.x atau lebih tinggi

### Langkah-langkah

1. Clone repositori:
   ```bash
   git clone https://github.com/yourusername/layanan-fsti.git
   cd layanan-fsti
   ```

2. Install dependensi:
   ```bash
   npm install
   ```

3. Buat file `.env.local` di direktori root dengan variabel berikut:
   ```
   # Kunci API Google (untuk integrasi Google Sheets)
   GOOGLE_API_KEY=your_google_api_key_here
   
   # Kunci API Publik (gunakan dengan hemat untuk keamanan)
   NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key_here
   ```

## Konfigurasi

### Integrasi Google Sheets

Halaman pelacakan menampilkan spreadsheet Google Sheets secara langsung (embed read-only) melalui komponen `components/tracking/SpreadsheetTrackingPage.tsx`. Spreadsheet harus dibagikan "Siapa saja yang memiliki link: Viewer". ID spreadsheet diatur di:
- `app/tracking/dosen/page.tsx`
- `app/tracking/mahasiswa/page.tsx`

### Dashboard Rekap (Apps Script)

Kode dashboard rekap yang dipasang di masing-masing spreadsheet (Extensions > Apps Script) ada di:
- `apps-script/tracking-mahasiswa/` (`Dashboard.gs` + `Dashboard.html`)
- `apps-script/tracking-dosen/` (`Dashboard.gs` + `Dashboard.html`)

Dashboard hanya membaca data dan dibuka lewat menu "Dashboard" di spreadsheet dengan password.

## Pengembangan

Jalankan server pengembangan:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) dengan browser Anda untuk melihat hasilnya.

### Build untuk Produksi

```bash
npm run build
```

### Menjalankan Server Produksi

```bash
npm run start
```

## Internasionalisasi

Aplikasi ini mendukung bahasa Indonesia dan Inggris:

- Provider konteks bahasa: `lib/i18n/LanguageContext.tsx`
- Terjemahan: `lib/i18n/translations.ts`
- Komponen toggle bahasa: `components/ui/LanguageToggle.tsx`

Untuk menambahkan bahasa baru:

1. Tambahkan kode bahasa ke tipe `Language` di `LanguageContext.tsx`
2. Tambahkan terjemahan ke objek `translations` di `translations.ts`

## Deployment

Aplikasi Next.js ini dapat di-deploy ke berbagai platform:

### Vercel (Direkomendasikan)

Cara termudah untuk men-deploy aplikasi ini adalah menggunakan [Platform Vercel](https://vercel.com/new).

1. Push kode Anda ke repositori GitHub
2. Impor proyek ke Vercel
3. Atur variabel lingkungan yang diperlukan
4. Deploy

### Self-hosted

Untuk deployment self-hosted:

1. Build aplikasi:
   ```bash
   npm run build
   ```

2. Jalankan server produksi:
   ```bash
   npm run start
   ```

## Kontribusi

1. Fork repositori
2. Buat branch fitur (`git checkout -b fitur/fitur-luar-biasa`)
3. Commit perubahan Anda (`git commit -m 'Menambahkan fitur luar biasa'`)
4. Push ke branch (`git push origin fitur/fitur-luar-biasa`)
5. Buka Pull Request

## Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file LICENSE untuk detailnya.

---

Dikembangkan untuk Fakultas Sains dan Teknologi Informasi - Institut Teknologi Kalimantan (ITK)