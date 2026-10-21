'use client';

/**
 * Katalog layanan per pintu ( S1 / S2 / Dosen ) — dibangun dari
 * lib/services-catalog.ts ( GROUPS + SERVICES ) sehingga selalu sinkron
 * dengan satu sumber data. Dipakai halaman /layanan-s1, /layanan-s2, /layanan-dosen.
 */
import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronDown,
  Search,
  FileText,
  Briefcase,
  GraduationCap,
  CheckCircle,
  Edit,
  Users,
  DollarSign,
  Globe,
  Laptop,
  FileSignature,
  Folder,
  Award,
  ExternalLink,
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import AnimatedSection from '@/components/ui/AnimatedSection';
import {
  GROUPS,
  SERVICES,
  CATEGORY_BY_AUDIENCE,
  ACTION_LABELS,
  type Audience,
  type CatalogGroup,
} from '@/lib/services-catalog';

const GROUP_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  surat: FileText,
  'kerja-praktik': Briefcase,
  magang: Laptop,
  'tugas-akhir': GraduationCap,
  mbkm: Award,
  akademik: GraduationCap,
  legalisasi: CheckCircle,
  'perubahan-matkul': Edit,
  kemahasiswaan: Users,
  keuangan: DollarSign,
  humas: Globe,
  'keuangan-dosen': DollarSign,
  'persuratan-dosen': FileText,
  'sarana-kerjasama-dosen': Laptop,
  'dokumen-template-dosen': FileSignature,
  'sistem-informasi-dosen': Laptop,
};

interface CatalogPageProps {
  audience: Audience;
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
}

export default function AudienceCatalogPage({ audience, heroBadge, heroTitle, heroDescription }: CatalogPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const categories = CATEGORY_BY_AUDIENCE[audience];
  const groups: CatalogGroup[] = GROUPS.filter((g) => g.audience === audience);
  const flatServices = SERVICES.filter((s) => s.audience === audience);

  const q = searchTerm.trim().toLowerCase();
  const matchesSearch = (item: { text: string; url: string }) =>
    !q || item.text.toLowerCase().includes(q) || item.url.toLowerCase().includes(q);

  // Audiens tanpa grup terstruktur (S2) ditampilkan flat dari SERVICES.
  const visibleGroups = (groups.length > 0
    ? groups.map((g) => ({ ...g, filteredItems: g.items.filter(matchesSearch) }))
    : flatServices
        .filter((s) => matchesSearch({ text: s.name + ' ' + s.description, url: s.url }))
        .filter((s) => activeCategory === 'all' || s.category === activeCategory)
        .map((s) => ({
          id: s.id,
          title: s.name,
          description: s.description,
          audience: s.audience,
          category: s.category,
          items: [{ text: s.name, url: s.url }],
          filteredItems: [{ text: s.name, url: s.url }],
        }))
  ).filter((g) => g.filteredItems.length > 0 && (activeCategory === 'all' || g.category === activeCategory));

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative py-12 md:py-16 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="container mx-auto px-4 relative z-10 max-w-5xl">
          <AnimatedSection animation="slideUp">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-primary-200 hover:text-white transition-colors mb-4 text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Kembali ke Beranda
            </Link>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 border border-primary-500/30 text-xs font-semibold uppercase tracking-wider mb-4">
              {heroBadge}
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-3">{heroTitle}</h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mb-6">{heroDescription}</p>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 font-semibold">
                {flatServices.length} layanan tersedia
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                {categories.length} kategori
              </span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-light-bg border-b border-slate-200">
        <div className="container mx-auto px-4 max-w-5xl space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari layanan…"
              aria-label="Cari layanan"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400"
            />
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter kategori">
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setSearchTerm('');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeCategory === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-300'
              }`}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setSearchTerm('');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeCategory === cat
                    ? 'bg-primary-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Groups */}
      <section className="py-10 bg-light-bg">
        <div className="container mx-auto px-4 max-w-5xl space-y-4">
          {visibleGroups.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" aria-hidden="true" />
              <p className="font-semibold text-slate-700 mb-1">Tidak ada layanan yang cocok</p>
              <p className="text-sm text-slate-500">
                Coba kata kunci lain atau ganti kategori — atau telusuri semua layanan dari beranda.
              </p>
            </div>
          ) : (
            visibleGroups.map((group) => {
              const Icon = GROUP_ICONS[group.id] ?? FileText;
              const isOpen = expandedGroups[group.id] ?? true;
              return (
                <article key={group.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="w-11 h-11 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="font-bold text-slate-900 block">{group.title}</span>
                      <span className="text-xs text-slate-500 block truncate">{group.description}</span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-slate-100 text-slate-600 flex-shrink-0">
                      {group.category}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <ul className="border-t border-slate-100 divide-y divide-slate-100">
                      {group.filteredItems.map((item) => (
                        <li key={item.url + item.text}>
                          <a
                            href={item.url}
                            {...(item.url.startsWith('http')
                              ? { target: '_blank', rel: 'noopener noreferrer' }
                              : {})}
                            className="flex items-center gap-3 px-5 py-3 hover:bg-primary-50/50 transition-colors group"
                          >
                            <span className="flex-1 text-sm text-slate-700 group-hover:text-primary-800">
                              {item.text}
                            </span>
                            {item.url.startsWith('http') && (
                              <ExternalLink className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" aria-hidden="true" />
                            )}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            })
          )}
        </div>
      </section>
    </MainLayout>
  );
}
