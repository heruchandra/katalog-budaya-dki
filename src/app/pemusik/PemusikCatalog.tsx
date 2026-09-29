"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Inbox, AlertTriangle } from "lucide-react";
import { Dancing_Script, Poppins } from 'next/font/google';
import { useLanguage } from "@/context/LanguageContext";
import DriftWall, { DriftWallItem } from "@/components/DriftWall";

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getVisiblePages = (current: number, total: number) => {
    const start = Math.max(1, current - 3);
    const end = Math.min(total, current + 3);
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };
  const visiblePages = getVisiblePages(currentPage, totalPages);

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
        <main className="w-full md:w-3/4">
          {/* Error State / Empty State */}
          {(fetchError || filtered.length === 0) && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50">
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

          {/* Premium 3D Pagination */}
          {!fetchError && filtered.length > 0 && (
            <div className="flex items-center justify-center gap-4 w-full select-none mt-14 mb-10">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`flex shrink-0 items-center justify-center w-12 h-12 rounded-full bg-white shadow-md border border-slate-100 text-slate-600 hover:shadow-lg transition-all duration-300 ease-out transform outline-none focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed ${currentPage === 1 ? '' : 'hover:scale-105 active:scale-95 hover:text-orange-600'}`}
                aria-label="Previous Page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              
              <div className="flex items-center justify-center w-64 h-16 relative overflow-visible gap-2">
                {visiblePages.map((page) => {
                  const distance = Math.abs(page - currentPage);
                  
                  let baseClasses = "flex items-center justify-center transition-all duration-300 ease-out transform outline-none focus:outline-none ";
                  
                  if (distance === 0) {
                    baseClasses += "w-14 h-14 rounded-full bg-orange-500 text-white text-lg font-bold shadow-[0_10px_20px_-5px_rgba(249,115,22,0.4)] scale-100 opacity-100 z-10 cursor-default";
                  } else if (distance === 1) {
                    baseClasses += "w-11 h-11 rounded-full bg-slate-200 text-slate-700 text-sm font-semibold scale-90 opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer hover:bg-slate-300";
                  } else if (distance === 2) {
                    baseClasses += "w-9 h-9 rounded-full bg-slate-100 text-slate-500 text-xs scale-75 opacity-50 hover:opacity-80 hover:scale-105 active:scale-95 cursor-pointer hover:bg-slate-200";
                  } else {
                    baseClasses += "w-8 h-8 rounded-full bg-slate-50 text-slate-400 text-xs scale-60 opacity-25 hover:opacity-60 hover:scale-105 active:scale-95 cursor-pointer hover:bg-slate-100";
                  }
                  
                  return (
                    <button
                      key={page}
                      onClick={() => distance !== 0 && setCurrentPage(page)}
                      className={baseClasses}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`flex shrink-0 items-center justify-center w-12 h-12 rounded-full bg-white shadow-md border border-slate-100 text-slate-600 hover:shadow-lg transition-all duration-300 ease-out transform outline-none focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed ${currentPage === totalPages ? '' : 'hover:scale-105 active:scale-95 hover:text-orange-600'}`}
                aria-label="Next Page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
