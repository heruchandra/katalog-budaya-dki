"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Inbox, AlertTriangle, Play, MessageCircle } from "lucide-react";
import { Dancing_Script, Poppins } from 'next/font/google';
import { useLanguage } from "@/context/LanguageContext";
import DriftWall, { DriftWallItem } from "@/components/DriftWall";

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400', '700'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] });

const SANGGAR_DRIFT_ITEMS: DriftWallItem[] = [
  { image: '/sanggar1.webp', title: 'Tari Tradisional 1' },
  { image: '/sanggar2.webp', title: 'Tari Tradisional 2' },
  { image: '/sanggar3.webp', title: 'Tari Tradisional 3' },
  { image: '/sanggar4.webp', title: 'Tari Tradisional 4' },
  { image: '/sanggar5.webp', title: 'Tari Tradisional 5' },
  { image: '/sanggar6.webp', title: 'Tari Tradisional 6' },
  { image: '/penari1.webp', title: 'Budaya Jakarta' },
];

interface Sanggar {
  id: string;
  nama_sanggar: string;
  nama_pimpinan?: string;
  grade?: string;
  alamat?: string;
  kelurahan?: string;
  kecamatan?: string;
  kota_kab?: string;
  no_hp?: string;
  kontak_pic?: string;
  whatsapp?: string;
  youtubeUrl?: string;
  jenis_tarian?: string;
  thumbnail_url: string | null;
}

interface SanggarCatalogProps {
  sanggars: Sanggar[];
  fetchError: string | null;
}

export default function SanggarCatalog({
  sanggars,
  fetchError,
}: SanggarCatalogProps) {
  const router = useRouter();
  const [activeGrade, setActiveGrade] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { t } = useLanguage();

  const gradeFilters = [
    { value: "all", label: t('sanggarGradeAll') },
    { value: "A", label: "GRADE A" },
    { value: "B", label: "GRADE B" },
  ];

  const filtered = (sanggars || []).filter((s) => {
    const matchGrade =
      activeGrade === "all" ||
      (s.grade && (s.grade.toUpperCase() === activeGrade.toUpperCase() || s.grade.toUpperCase() === `GRADE ${activeGrade.toUpperCase()}`));
    const matchSearch =
      searchQuery === "" ||
      s.nama_sanggar?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.jenis_tarian?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.kecamatan?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGrade && matchSearch;
  });

  const sortedSanggars = [...filtered].sort((a, b) => {
    if (activeGrade === "all") {
      return (a.nama_sanggar || "").localeCompare(b.nama_sanggar || "");
    } else {
      return Number(a.id) - Number(b.id);
    }
  });

  const totalPages = Math.ceil(sortedSanggars.length / itemsPerPage);
  const paginated = sortedSanggars.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
    <div className="min-h-screen bg-white pb-16 pt-16">
      {/* HERO BANNER */}
      <div className="relative w-full h-[400px] overflow-hidden flex items-center justify-center bg-[#0d131f] -mt-px">
        {/* Drift Wall Background Layer */}
        <div className="absolute top-0 -left-[10%] w-[120%] h-full pointer-events-auto opacity-55 md:opacity-60 hover:opacity-85 transition-opacity duration-300">
          <DriftWall items={SANGGAR_DRIFT_ITEMS} columns={7} />
        </div>

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 pointer-events-none" />

        {/* Centered Heading Content */}
        <div className="relative z-20 text-center px-4 pointer-events-none">
          <h1 className={`font-cursive text-4xl sm:text-5xl md:text-6xl text-white drop-shadow-md font-normal ${dancingScript.className}`}>
            {t('sanggarPageTitle')}
          </h1>
          <p className="text-xs md:text-sm tracking-[0.25em] text-gray-200 uppercase mt-3 font-medium drop-shadow">
            {sanggars && sanggars.length > 0
              ? `${sanggars.length} ${t('sanggarRegistered')}`
              : t('sanggarCatalogFallback')}
          </p>
        </div>
      </div>

      <div className={`flex flex-col md:flex-row gap-12 max-w-[90vw] mx-auto py-12 ${poppins.className}`}>
        
        {/* Left Sidebar (Filters) */}
        <aside className="w-full md:w-1/4 hidden md:flex flex-col gap-8 sticky top-36 self-start max-h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar">
          <div className="border-t border-slate-200 pt-6">
            <h3 className="uppercase tracking-widest text-sm text-slate-800 mb-6 font-medium">{t('sanggarSearchTitle')}</h3>
            <div className="relative border-b border-slate-200 focus-within:border-gray-300 focus-within:ring-0 transition-colors">
              <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={t('sanggarSearchPlaceholder')}
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
            <h3 className="uppercase tracking-widest text-sm text-slate-800 mb-6 font-medium">{t('sanggarFilterGrade')}</h3>
            <div className="flex flex-col gap-3">
              {gradeFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => {
                    setActiveGrade(filter.value);
                    setCurrentPage(1);
                  }}
                  className={`text-left text-sm transition-colors uppercase tracking-widest outline-none focus:outline-none ${
                    activeGrade === filter.value
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
                {fetchError ? "Database Error" : t('sanggarEmptyTitle')}
              </h2>
              <div className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
                {fetchError ? (
                  <div className="rounded bg-red-50 p-4 text-left font-mono text-xs text-red-600 border border-red-100 overflow-auto whitespace-pre-wrap">
                    {fetchError}
                  </div>
                ) : searchQuery || activeGrade !== "all" ? (
                  <p>{t('sanggarEmptyFilter')}</p>
                ) : (
                  <p>{t('sanggarEmptyDefault')}</p>
                )}
              </div>
              {!fetchError && (searchQuery || activeGrade !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveGrade("all");
                    setCurrentPage(1);
                  }}
                  className="mt-5 border-b border-slate-900 pb-1 text-sm font-medium text-slate-900 transition-all hover:text-slate-600 tracking-widest uppercase"
                >
                  {t('sanggarResetFilter')}
                </button>
              )}
            </div>
          )}

          {/* Cards Grid */}
          {!fetchError && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 gap-y-12">
              {paginated.map((sanggar) => (
                <div key={sanggar.id} className="group relative flex flex-col cursor-pointer">
                  <Link href={`/sanggar/${sanggar.id}`} className="absolute inset-0 z-10" aria-label={sanggar.nama_sanggar}></Link>
                  
                  {/* Image Wrapper */}
                  <div className="relative w-full aspect-[3/4] bg-slate-100 overflow-hidden group rounded-lg">
                    {sanggar.thumbnail_url ? (
                      <img
                        src={sanggar.thumbnail_url}
                        alt={sanggar.nama_sanggar}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-slate-400 text-xs uppercase tracking-widest">No Image</span>
                      </div>
                    )}

                    {/* Cinema XXI-Style Hover Action Overlay */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/sanggar/${sanggar.id}`);
                      }}
                      className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2.5 p-4 z-20"
                    >
                      {/* Button 1: YouTube / Video Showcase */}
                      <a
                        href={sanggar.youtubeUrl || "https://www.youtube.com"}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="h-10 w-full max-w-[200px] px-5 rounded-full bg-white/95 text-zinc-900 hover:bg-white shadow-md transition-all duration-200 active:scale-95 border border-white/20 flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase"
                      >
                        <Play className="w-4 h-4 fill-current shrink-0" />
                        <span>Tonton Video</span>
                      </a>

                      {/* Button 2: WhatsApp Contact */}
                      <a
                        href={`https://wa.me/${sanggar.whatsapp || '6281318702623'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="h-10 w-full max-w-[200px] px-5 rounded-full bg-zinc-950/90 text-white hover:bg-black shadow-md transition-all duration-200 active:scale-95 border border-zinc-700/50 backdrop-blur-sm flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase"
                      >
                        <MessageCircle className="w-4 h-4 shrink-0" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Text Area */}
                  <div className="mt-4 text-left">
                    <h3 className="text-lg text-slate-900 truncate font-medium">
                      {sanggar.nama_sanggar.replace(/^Sanggar\s+/i, '')}
                    </h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mt-1.5">
                      {activeGrade === "all" && sanggar.grade 
                        ? `GRADE ${sanggar.grade.replace(/grade/i, '').trim()} • ` 
                        : ""}
                      {sanggar.kecamatan || "JAKARTA"}
                    </p>
                    {sanggar.jenis_tarian && (
                      <p className="text-xs text-slate-400 truncate mt-1">
                        {sanggar.jenis_tarian}
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
