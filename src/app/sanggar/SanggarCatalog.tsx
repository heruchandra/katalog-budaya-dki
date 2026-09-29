"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Inbox, AlertTriangle } from "lucide-react";
import { Dancing_Script, Poppins } from 'next/font/google';
import { useLanguage } from "@/context/LanguageContext";
import DriftWall, { DriftWallItem } from "@/components/DriftWall";

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400', '700'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] });

const col1Sanggar = ["/dinamis-sanggar-1.webp", "/dinamis-sanggar-2.webp", "/dinamis-sanggar-3.webp"];
const col2Sanggar = ["/dinamis-sanggar-4.webp", "/dinamis-sanggar-5.webp", "/dinamis-sanggar-6.webp"];
const col3Sanggar = ["/dinamis-sanggar-7.webp", "/dinamis-sanggar-8.webp", "/dinamis-sanggar-9.webp"];
const col4Sanggar = ["/dinamis-sanggar-10.webp", "/dinamis-sanggar-11.webp", "/dinamis-sanggar-12.webp"];
const col5Sanggar = ["/dinamis-sanggar-13.webp", "/dinamis-sanggar-14.webp", "/dinamis-sanggar-15.webp"];

const SANGGAR_COLUMNS = [col1Sanggar, col2Sanggar, col3Sanggar, col4Sanggar, col5Sanggar];

export interface Sanggar {
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
  whatsappNumber?: string;
  whatsappUrl?: string;
  instagram?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  youtube?: string;
  jenis_tarian?: string;
  thumbnail_url: string | null;
}

interface SanggarCatalogProps {
  sanggars: Sanggar[];
  fetchError: string | null;
  initialQuery?: string;
}

export default function SanggarCatalog({
  sanggars,
  fetchError,
  initialQuery = "",
}: SanggarCatalogProps) {
  const router = useRouter();
  const [activeGrade, setActiveGrade] = useState("all");
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { t } = useLanguage();

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      setCurrentPage(1);
    }
  }, [initialQuery]);

  const gradeFilters = [
    { value: "all", label: t('sanggarGradeAll') },
    { value: "A", label: "GRADE A" },
    { value: "B", label: "GRADE B" },
  ];

  const filtered = (sanggars || []).filter((s: any) => {
    const query = searchQuery.toLowerCase().trim();

    // Multi-field specialties / tari unggulan matching
    const specialtiesStr = Array.isArray(s.danceSpecialties)
      ? s.danceSpecialties.map((d: any) => typeof d === 'string' ? d : d.name).join(" ")
      : Array.isArray(s.tariUnggulan)
        ? s.tariUnggulan.map((d: any) => typeof d === 'string' ? d : d.name).join(" ")
        : (s.jenis_tarian || "");

    const matchesQuery = !query ||
      s.nama_sanggar?.toLowerCase().includes(query) ||
      s.name?.toLowerCase().includes(query) ||
      s.category?.toLowerCase().includes(query) ||
      s.jenis_tarian?.toLowerCase().includes(query) ||
      s.description?.toLowerCase().includes(query) ||
      s.alamat?.toLowerCase().includes(query) ||
      s.kelurahan?.toLowerCase().includes(query) ||
      s.kecamatan?.toLowerCase().includes(query) ||
      s.kota_kab?.toLowerCase().includes(query) ||
      s.nama_pimpinan?.toLowerCase().includes(query) ||
      s.leaderName?.toLowerCase().includes(query) ||
      s.leader?.toLowerCase().includes(query) ||
      s.kontak_pic?.toLowerCase().includes(query) ||
      specialtiesStr.toLowerCase().includes(query);

    // Flexible Grade Filter: if specific query directly matches studio name, include it
    const isDirectStudioMatch = query && (
      s.nama_sanggar?.toLowerCase().includes(query) ||
      s.name?.toLowerCase().includes(query)
    );

    const matchGrade =
      activeGrade === "all" ||
      isDirectStudioMatch ||
      (s.grade && (s.grade.toUpperCase() === activeGrade.toUpperCase() || s.grade.toUpperCase() === `GRADE ${activeGrade.toUpperCase()}`));

    return matchGrade && matchesQuery;
  });

  // Sinar Norray is always pinned as the first card; the rest keep their normal order
  const isPinned = (s: typeof filtered[number]) =>
    s.id === "sinar-norray" || (s.nama_sanggar || "").toLowerCase().includes("sinar norray");

  const sortedSanggars = [...filtered].sort((a, b) => {
    const pinDiff = Number(isPinned(b)) - Number(isPinned(a));
    if (pinDiff !== 0) return pinDiff;
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
    <div className="min-h-screen bg-white pb-16">
      {/* HERO BANNER */}
      <div className="relative w-full h-[400px] sm:h-[440px] overflow-hidden flex items-center justify-center bg-[#0d131f]">
        {/* Drift Wall Background Layer */}
        {/* Dimming lives on each tile (dim + rest brightness) so hover lights up only the tile under the cursor */}
        <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center pointer-events-auto">
          <div className="w-[125%] h-full flex justify-center items-center scale-105 shrink-0">
            <DriftWall
              columnData={SANGGAR_COLUMNS}
              columns={5}
              dim={0.35}
              style={{ '--dw-rest-brightness': 0.75, '--dw-hover-brightness': 1.1, '--dw-hover-scale': 1.05 } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80 pointer-events-none" />

        {/* Centered Heading Content */}
        <div className="relative z-20 text-center px-4 pt-16 pointer-events-none">
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
        
        {/* Mobile Search & Grade Filter Bar (visible only on mobile) */}
        <div className="w-full md:hidden flex flex-col gap-4 -mt-4 mb-2">
          <div className="relative border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus-within:bg-white focus-within:border-orange-500 transition-colors">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t('sanggarSearchPlaceholder')}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-7 pr-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {gradeFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => {
                  setActiveGrade(filter.value);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeGrade === filter.value
                    ? "bg-orange-600 text-white"
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
                <div key={sanggar.id} className="group relative flex flex-col rounded-3xl overflow-hidden bg-white border border-zinc-100 shadow-sm hover:shadow-md transition-all">
                  {/* Poster Image Container wrapped in Next.js Link */}
                  <Link
                    href={`/sanggar/${sanggar.id}`}
                    className="relative aspect-[3/4] w-full overflow-hidden rounded-t-[1.25rem] bg-slate-100 block cursor-pointer"
                  >
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

                    {/* Hover Overlay Container */}
                    <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto flex flex-col justify-end p-3.5 sm:p-4">
                      {/* White Bottom Fade Gradient */}
                      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white via-white/80 to-transparent -z-10 pointer-events-none" />

                      {/* Action Buttons */}
                      <div className="flex gap-2 items-center justify-between">
                        {/* YouTube Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const targetUrl = sanggar.youtubeUrl || "https://www.youtube.com";
                            window.open(targetUrl, '_blank', 'noopener,noreferrer');
                          }}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-full py-2.5 px-3 text-[11px] font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                          <span>Tonton</span>
                        </button>

                        {/* WhatsApp Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const wa = sanggar.whatsappUrl || sanggar.whatsappNumber || sanggar.whatsapp || '6281310998647';
                            if (wa.startsWith('http')) {
                              window.open(wa, '_blank', 'noopener,noreferrer');
                            } else {
                              const cleaned = wa.replace(/\D/g, '');
                              const formatted = cleaned.startsWith('0') ? '62' + cleaned.substring(1) : cleaned;
                              window.open(`https://wa.me/${formatted}`, '_blank', 'noopener,noreferrer');
                            }
                          }}
                          className="flex-1 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-full py-2.5 px-3 text-[11px] font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                            <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.12.553 4.108 1.519 5.84L.16 23.479l5.774-1.513a11.97 11.97 0 006.097 1.665c6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm.016 21.986a9.92 9.92 0 01-5.06-1.385l-.363-.216-3.763.987.1004-3.669-.237-.377A9.924 9.924 0 012.05 12.03c0-5.503 4.478-9.981 9.981-9.981 5.503 0 9.981 4.478 9.981 9.981 0 5.503-4.478 9.981-9.981 9.981zm5.474-7.481c-.301-.15-1.782-.879-2.057-.979-.275-.1-.475-.15-.675.15-.2.3-.775.979-.95 1.179-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.414-1.489-.893-.796-1.495-1.78-1.67-2.08-.175-.3-.018-.462.13-.61.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.582-.492-.503-.675-.512-.175-.008-.375-.01-.575-.01-.2 0-.525.075-.8.375s-1.05 1.025-1.05 2.5 1.075 2.898 1.225 3.1 2.113 3.227 5.118 4.524c.714.309 1.272.494 1.707.632.716.228 1.368.196 1.883.119.575-.086 1.782-.729 2.032-1.43.25-.701.25-1.301.175-1.43-.075-.129-.275-.204-.575-.354z"/>
                          </svg>
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </Link>

                  {/* Text Area */}
                  <div className="p-4 pt-3 text-left">
                    <Link href={`/sanggar/${sanggar.id}`}>
                      <h3 className="text-lg text-slate-900 truncate font-medium hover:text-orange-600 transition-colors cursor-pointer">
                        {sanggar.nama_sanggar.replace(/^Sanggar\s+/i, '')}
                      </h3>
                    </Link>
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
