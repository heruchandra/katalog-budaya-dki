"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Inbox, AlertTriangle, Music2 } from "lucide-react";
import { Poppins } from 'next/font/google';
import { dancingScript } from '@/lib/fonts';
import { useLanguage } from "@/context/LanguageContext";
import { JAKARTA_WILAYAH } from "@/lib/wilayah";
import DriftWall, { DriftWallItem } from "@/components/DriftWall";
import CatalogPagination from "@/components/CatalogPagination";
import type { MusikCardData, MusikCategory } from "@/types/musik";

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] });

const PEMUSIK_DRIFT_ITEMS: DriftWallItem[] = [
  { image: '/dinamis-musik-1.webp', title: 'Seniman Musik 1' },
  { image: '/dinamis-musik-2.webp', title: 'Seniman Musik 2' },
  { image: '/dinamis-musik-3.webp', title: 'Seniman Musik 3' },
  { image: '/dinamis-musik-4.webp', title: 'Seniman Musik 4' },
  { image: '/dinamis-musik-5.webp', title: 'Seniman Musik 5' },
  { image: '/dinamis-musik-6.webp', title: 'Seniman Musik 6' },
];

type CategoryFilter = "all" | MusikCategory;

interface PemusikCatalogProps {
  items: MusikCardData[];
  fetchError: string | null;
}

/** Same filter option style as the sanggar catalog sidebar */
const sidebarOptionClass = (isActive: boolean) =>
  `flex w-full items-center justify-between gap-2 text-left px-2 py-1.5 text-xs font-medium uppercase tracking-wider border-l-2 transition-colors outline-none ${
    isActive
      ? "text-orange-600 font-bold bg-orange-50 border-orange-500 pl-2.5"
      : "text-zinc-600 border-transparent hover:text-zinc-900"
  }`;

export default function PemusikCatalog({ items, fetchError }: PemusikCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [activeWilayah, setActiveWilayah] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { t } = useLanguage();

  const categoryLabel = (category: MusikCategory) => (category === "komunitas" ? t('musikCatKomunitas') : t('musikCatPemusik'));

  const categoryFilters: { value: CategoryFilter; label: string }[] = [
    { value: "all", label: t('musikCatAll') },
    { value: "komunitas", label: t('musikCatKomunitas') },
    { value: "pemusik", label: t('musikCatPemusik') },
  ];

  // Region counts over the whole list, as on the sanggar page (entries without a known region only count in "all")
  const wilayahCounts = items.reduce<Record<string, number>>((acc, item) => {
    if (item.wilayah) acc[item.wilayah] = (acc[item.wilayah] || 0) + 1;
    return acc;
  }, {});
  const wilayahFilters = [
    { value: "all", label: t('sanggarWilayahAll'), count: items.length },
    ...JAKARTA_WILAYAH.map((w) => ({ value: w as string, label: w as string, count: wilayahCounts[w] || 0 })),
  ];

  // Search, category and region all apply together
  const query = searchQuery.trim().toLowerCase();
  const filtered = items
    .filter(
      (item) =>
        (activeCategory === "all" || item.category === activeCategory) &&
        (activeWilayah === "all" || item.wilayah === activeWilayah) &&
        (query === "" || item.searchText.includes(query))
    )
    // Full profiles first, then by name
    .sort((a, b) => Number(!a.hasProfile) - Number(!b.hasProfile) || a.nama.localeCompare(b.nama));

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const hasActiveFilter = Boolean(searchQuery) || activeCategory !== "all" || activeWilayah !== "all";

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      document.getElementById('catalog-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const selectCategory = (value: CategoryFilter) => {
    setActiveCategory(value);
    setCurrentPage(1);
  };
  const selectWilayah = (value: string) => {
    setActiveWilayah(value);
    setCurrentPage(1);
  };
  const updateSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };
  const resetFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setActiveWilayah("all");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* HERO BANNER */}
      <div className="relative w-full h-[400px] sm:h-[440px] overflow-hidden flex items-center justify-center bg-[#0d131f]">
        {/* Drift Wall Background Layer */}
        {/* Dimming lives on each tile (dim + rest brightness) so hover lights up only the tile under the cursor */}
        <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center pointer-events-auto">
          <div className="w-[125%] h-full flex justify-center items-center scale-105 shrink-0">
            <DriftWall
              items={PEMUSIK_DRIFT_ITEMS}
              columns={6}
              dim={0.55}
              className="drift-wall--rounded"
              style={{ '--dw-rest-brightness': 0.85, '--dw-hover-brightness': 1.1, '--dw-hover-scale': 1.05 } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80 pointer-events-none" />

        {/* Centered Heading Content */}
        <div className="relative z-20 text-center px-4 pt-16 pointer-events-none">
          <h1 className={`font-cursive text-4xl sm:text-5xl md:text-6xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] font-normal ${dancingScript.className}`}>
            {t('pemusikPageTitle')}
          </h1>
          <p className="text-xs md:text-sm tracking-[0.25em] text-gray-100 uppercase mt-3 font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
            {items.length > 0
              ? `${items.length} ${t('pemusikRegistered')}`
              : t('pemusikCatalogFallback')}
          </p>
        </div>
      </div>

      <div className={`flex flex-col md:flex-row gap-12 max-w-[90vw] mx-auto py-12 ${poppins.className}`}>

        {/* Mobile Search & Filter Bar (visible only on mobile; same pattern as the sanggar catalog) */}
        <div className="w-full md:hidden flex flex-col gap-4 -mt-4 mb-2">
          <div className="relative border border-zinc-200 rounded-none px-3 py-2 bg-slate-50 focus-within:bg-white focus-within:border-orange-600 focus-within:ring-1 focus-within:ring-orange-600 transition-colors">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              placeholder={t('pemusikSearchPlaceholder')}
              aria-label={t('pemusikSearchPlaceholder')}
              value={searchQuery}
              onChange={(e) => updateSearch(e.target.value)}
              className="w-full pl-7 pr-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
            />
          </div>
          {/* Category chips (mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categoryFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => selectCategory(filter.value)}
                aria-pressed={activeCategory === filter.value}
                className={`px-3 py-1.5 rounded-none text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeCategory === filter.value
                    ? "bg-brand text-white shadow-md shadow-orange-600/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          {/* Wilayah chips (mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {wilayahFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => selectWilayah(filter.value)}
                aria-pressed={activeWilayah === filter.value}
                className={`px-3 py-1.5 rounded-none text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeWilayah === filter.value
                    ? "bg-zinc-900 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Left Sidebar (Filters) */}
        <aside className="w-full md:w-1/4 hidden md:flex flex-col gap-8 sticky top-36 self-start max-h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar">
          <div className="border-t border-slate-200 pt-6">
            <h2 className="uppercase tracking-widest text-sm text-slate-800 mb-6 font-medium">{t('pemusikSearchTitle')}</h2>
            <div className="relative border-b border-zinc-200 focus-within:border-orange-600 transition-colors">
              <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="text"
                placeholder={t('pemusikSearchPlaceholder')}
                aria-label={t('pemusikSearchPlaceholder')}
                value={searchQuery}
                onChange={(e) => updateSearch(e.target.value)}
                className="w-full py-2 pl-8 pr-4 text-sm text-slate-800 placeholder:text-slate-400 !outline-none !ring-0 !border-none !shadow-none focus:!ring-0 focus:!outline-none focus:!border-transparent focus:!shadow-none ring-offset-0 bg-transparent"
              />
            </div>
          </div>

          {/* FILTER KATEGORI */}
          <div className="border-t border-slate-200 pt-6">
            <h2 className="uppercase tracking-widest text-sm text-slate-800 mb-6 font-medium">{t('musikFilterKategori')}</h2>
            <div className="space-y-1.5">
              {categoryFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => selectCategory(filter.value)}
                  aria-pressed={activeCategory === filter.value}
                  className={sidebarOptionClass(activeCategory === filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* FILTER WILAYAH */}
          <div className="border-t border-slate-200 pt-6">
            <h2 className="uppercase tracking-widest text-sm text-slate-800 mb-6 font-medium">{t('sanggarFilterWilayah')}</h2>
            <div className="space-y-1.5">
              {wilayahFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => selectWilayah(filter.value)}
                  aria-pressed={activeWilayah === filter.value}
                  className={sidebarOptionClass(activeWilayah === filter.value)}
                >
                  <span>{filter.label}</span>
                  <span className="text-[10px] font-medium text-zinc-400 tabular-nums">{filter.count}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Grid (Catalog) */}
        <section id="catalog-results" className="w-full md:w-3/4 scroll-mt-24">
          {/* Error State / Empty State */}
          {(fetchError || filtered.length === 0) && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-none bg-slate-50">
                {fetchError ? (
                  <AlertTriangle className="h-10 w-10 text-slate-400" />
                ) : (
                  <Inbox className="h-10 w-10 text-slate-300" />
                )}
              </div>
              <h2 className="mt-6 text-xl font-light text-slate-800 uppercase tracking-widest">
                {fetchError ? "Database Error" : t('pemusikEmptyTitle')}
              </h2>
              <div className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
                {fetchError ? (
                  <div className="rounded-none bg-red-50 p-4 text-left font-mono text-xs text-red-600 border border-red-100 overflow-auto whitespace-pre-wrap">
                    {fetchError}
                  </div>
                ) : hasActiveFilter ? (
                  <p>{t('pemusikEmptyFilter')}</p>
                ) : (
                  <p>{t('pemusikEmptyDefault')}</p>
                )}
              </div>
              {!fetchError && hasActiveFilter && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 border-b border-slate-900 pb-1 text-sm font-medium text-slate-900 transition-all hover:text-slate-600 tracking-widest uppercase"
                >
                  {t('pemusikResetFilter')}
                </button>
              )}
            </div>
          )}

          {/* Cards Grid */}
          {!fetchError && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 gap-y-12">
              {paginated.map((item, index) => (
                <div key={item.id} className="group relative flex flex-col">
                  <Link href={`/pemusik/${item.id}`} className="absolute inset-0 z-10" aria-label={item.nama} />

                  {/* Image Wrapper */}
                  <div className="relative w-full aspect-[3/4] bg-slate-50/80 overflow-hidden rounded-none border border-slate-100">
                    {item.foto ? (
                      <Image
                        src={item.foto}
                        alt={item.nama}
                        fill
                        sizes="(min-width: 1280px) 22vw, (min-width: 768px) 34vw, 90vw"
                        // first row is above the fold (often the LCP image), so don't lazy-load it
                        loading={index < 3 ? "eager" : undefined}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-300">
                        <Music2 className="h-10 w-10" aria-hidden="true" />
                        <span className="text-xs font-semibold tracking-widest uppercase text-slate-400">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Text Area: name + "KATEGORI • WILAYAH" ("DKI Jakarta" when the region isn't on record, never guessed) */}
                  <div className="mt-4 text-left">
                    <h3 className="text-lg text-slate-900 truncate font-medium group-hover:text-orange-600 transition-colors">
                      {item.nama}
                    </h3>
                    <p className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase mt-1">
                      {categoryLabel(item.category)}
                      {" • "}
                      {item.wilayah ?? "DKI Jakarta"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination (6 items per page) */}
          {!fetchError && filtered.length > 0 && (
            <CatalogPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="mt-14 mb-10"
            />
          )}
        </section>
      </div>
    </div>
  );
}
