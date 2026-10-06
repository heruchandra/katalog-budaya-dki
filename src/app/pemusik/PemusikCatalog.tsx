"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Inbox, AlertTriangle, Music2 } from "lucide-react";
import { Poppins } from 'next/font/google';
import { dancingScript } from '@/lib/fonts';
import { useLanguage } from "@/context/LanguageContext";
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

export default function PemusikCatalog({ items, fetchError }: PemusikCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { t } = useLanguage();

  const query = searchQuery.trim().toLowerCase();
  const matchesSearch = (item: MusikCardData) => query === "" || item.searchText.includes(query);
  // Tab counts follow the search, so each tab shows how many results it would list
  const countFor = (category: CategoryFilter) =>
    items.filter((item) => (category === "all" || item.category === category) && matchesSearch(item)).length;

  const categoryTabs: { value: CategoryFilter; label: string }[] = [
    { value: "all", label: t('musikCatAll') },
    { value: "komunitas", label: t('musikCatKomunitas') },
    { value: "pemusik", label: t('musikCatPemusik') },
  ];

  const filtered = items
    .filter((item) => (activeCategory === "all" || item.category === activeCategory) && matchesSearch(item))
    // Full profiles first, then by name
    .sort((a, b) => Number(!a.hasProfile) - Number(!b.hasProfile) || a.nama.localeCompare(b.nama));

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      document.getElementById('catalog-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
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

        {/* Left Sidebar (Search) */}
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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full py-2 pl-8 pr-4 text-sm text-slate-800 placeholder:text-slate-400 !outline-none !ring-0 !border-none !shadow-none focus:!ring-0 focus:!outline-none focus:!border-transparent focus:!shadow-none ring-offset-0 bg-transparent"
              />
            </div>
          </div>
        </aside>

        {/* Right Grid (Catalog) */}
        <section id="catalog-results" className="w-full md:w-3/4 scroll-mt-24">
          {/* Sub-category tabs: Semua / Komunitas / Pemusik (all screen sizes) */}
          {!fetchError && items.length > 0 && (
            <div role="group" aria-label={t('musikCatLabel')} className="flex flex-wrap gap-2 mb-10">
              {categoryTabs.map((tab) => {
                const isActive = activeCategory === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => {
                      setActiveCategory(tab.value);
                      setCurrentPage(1);
                    }}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
                      isActive
                        ? "bg-brand border-transparent text-white shadow-sm shadow-orange-600/20"
                        : "bg-white border-zinc-200 text-slate-600 hover:border-orange-300 hover:text-orange-700"
                    }`}
                  >
                    {tab.label}
                    <span className={`tabular-nums rounded-full px-1.5 py-px text-[10px] ${isActive ? "bg-white/20 text-white" : "bg-zinc-100 text-slate-500"}`}>
                      {countFor(tab.value)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

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
                ) : searchQuery || activeCategory !== "all" ? (
                  <p>{t('pemusikEmptyFilter')}</p>
                ) : (
                  <p>{t('pemusikEmptyDefault')}</p>
                )}
              </div>
              {!fetchError && (searchQuery || activeCategory !== "all") && (
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
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-700 shadow-sm">
                      {item.category === "komunitas" ? t('musikCatKomunitas') : t('musikCatPemusik')}
                    </span>
                  </div>

                  {/* Text Area */}
                  <div className="mt-4 text-left">
                    <h3 className="text-lg text-slate-900 truncate font-medium group-hover:text-orange-700 transition-colors">
                      {item.nama}
                    </h3>
                    {item.namaPanggung && (
                      <p className="text-sm text-slate-600 truncate mt-0.5">{item.namaPanggung}</p>
                    )}
                    <p className="text-xs text-slate-500 uppercase tracking-widest mt-1.5 truncate">
                      {item.subtitle || "Tradisional"}
                    </p>
                    {item.instrumen && (
                      <p className="text-xs text-slate-400 truncate mt-1">
                        {item.instrumen}
                      </p>
                    )}
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
