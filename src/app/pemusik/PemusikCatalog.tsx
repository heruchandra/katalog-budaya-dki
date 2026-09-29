"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Inbox, AlertTriangle } from "lucide-react";
import { Dancing_Script, Poppins } from 'next/font/google';
import { useLanguage } from "@/context/LanguageContext";
import DriftWall, { DriftWallItem } from "@/components/DriftWall";
import CatalogPagination from "@/components/CatalogPagination";

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400', '700'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] });

const PEMUSIK_DRIFT_ITEMS: DriftWallItem[] = [
  { image: '/dinamis-musik-1.webp', title: 'Seniman Musik 1' },
  { image: '/dinamis-musik-2.webp', title: 'Seniman Musik 2' },
  { image: '/dinamis-musik-3.webp', title: 'Seniman Musik 3' },
  { image: '/dinamis-musik-4.webp', title: 'Seniman Musik 4' },
  { image: '/dinamis-musik-5.webp', title: 'Seniman Musik 5' },
  { image: '/dinamis-musik-6.webp', title: 'Seniman Musik 6' },
];

interface Pemusik {
  id: string;
  nama_seniman: string;
  jenis_seniman: string;
  genre_musik: string;
  instrumen: string;
  pengalaman: string;
  deskripsi: string;
  foto_url?: string;
}

interface PemusikCatalogProps {
  pemusiks: Pemusik[];  
  fetchError: string | null;
}



export default function PemusikCatalog({
  pemusiks,
  fetchError,
}: PemusikCatalogProps) {
  const [activeJenis, setActiveJenis] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { t } = useLanguage();

  const jenisFilters = [
    { value: "all", label: t('pemusikJenisAll') },
    { value: "Solo", label: "SOLO" },
    { value: "Komunitas", label: "KOMUNITAS" },
  ];

  const filtered = (pemusiks || []).filter((p) => {
    const matchJenis =
      activeJenis === "all" ||
      p.jenis_seniman?.toLowerCase() === activeJenis.toLowerCase();
    const matchSearch =
      searchQuery === "" ||
      p.nama_seniman?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.genre_musik?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.instrumen?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchJenis && matchSearch;
  });

  const sortedPemusiks = [...filtered].sort((a, b) => {
    if (activeJenis === "all") {
      return (a.nama_seniman || "").localeCompare(b.nama_seniman || "");
    } else {
      return Number(a.id) - Number(b.id);
    }
  });

  const totalPages = Math.ceil(sortedPemusiks.length / itemsPerPage);
  const paginated = sortedPemusiks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      document.getElementById('catalog-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
            {pemusiks && pemusiks.length > 0
              ? `${pemusiks.length} ${t('pemusikRegistered')}`
              : t('pemusikCatalogFallback')}
          </p>
        </div>
      </div>

      <div className={`flex flex-col md:flex-row gap-12 max-w-[90vw] mx-auto py-12 ${poppins.className}`}>
        
        {/* Left Sidebar (Filters) */}
        <aside className="w-full md:w-1/4 hidden md:flex flex-col gap-8 sticky top-36 self-start max-h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar">
          <div className="border-t border-slate-200 pt-6">
            <h3 className="uppercase tracking-widest text-sm text-slate-800 mb-6 font-medium">{t('pemusikSearchTitle')}</h3>
            <div className="relative border-b border-slate-200 focus-within:border-gray-300 focus-within:ring-0 transition-colors">
              <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={t('pemusikSearchPlaceholder')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full py-2 pl-8 pr-4 text-sm text-slate-800 placeholder:text-slate-400 !outline-none !ring-0 !border-none !shadow-none focus:!ring-0 focus:!outline-none focus:!border-transparent focus:!shadow-none ring-offset-0 bg-transparent"
              />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="uppercase tracking-widest text-sm text-slate-800 mb-6 font-medium">{t('pemusikFilterJenis')}</h3>
            <div className="flex flex-col gap-3">
              {jenisFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => {
                    setActiveJenis(filter.value);
                    setCurrentPage(1);
                  }}
                  className={`text-left text-sm transition-colors uppercase tracking-widest outline-none focus:outline-none ${
                    activeJenis === filter.value
                      ? "text-slate-900 font-semibold"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Grid (Catalog) */}
        <main id="catalog-results" className="w-full md:w-3/4 scroll-mt-24">
          {/* Error State / Empty State */}
          {(fetchError || filtered.length === 0) && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-slate-50">
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
                  <div className="rounded bg-red-50 p-4 text-left font-mono text-xs text-red-600 border border-red-100 overflow-auto whitespace-pre-wrap">
                    {fetchError}
                  </div>
                ) : searchQuery || activeJenis !== "all" ? (
                  <p>{t('pemusikEmptyFilter')}</p>
                ) : (
                  <p>{t('pemusikEmptyDefault')}</p>
                )}
              </div>
              {!fetchError && (searchQuery || activeJenis !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveJenis("all");
                    setCurrentPage(1);
                  }}
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
              {paginated.map((pemusik) => (
                <div key={pemusik.id} className="group relative flex flex-col cursor-pointer">
                  <Link href={`/pemusik/${pemusik.id}`} className="absolute inset-0 z-10" aria-label={pemusik.nama_seniman}></Link>
                  
                  {/* Image Wrapper */}
                  {pemusik.foto_url ? (
                    <div className="relative w-full aspect-[3/4] bg-slate-100 overflow-hidden rounded-sm">
                      <img
                        src={pemusik.foto_url}
                        alt={pemusik.nama_seniman}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[3/4] bg-slate-50/80 flex items-center justify-center rounded-sm border border-slate-100 overflow-hidden">
                      <span className="text-slate-400 text-xs font-semibold tracking-widest uppercase">No Image</span>
                    </div>
                  )}

                  {/* Text Area */}
                  <div className="mt-4 text-left">
                    <h3 className="text-lg text-slate-900 truncate font-medium">
                      {pemusik.nama_seniman}
                    </h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mt-1.5">
                      {pemusik.jenis_seniman || "Pemusik"} • {pemusik.genre_musik || "Tradisional"}
                    </p>
                    {pemusik.instrumen && (
                      <p className="text-xs text-slate-400 truncate mt-1">
                        {pemusik.instrumen}
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
        </main>
      </div>
    </div>
  );
}
