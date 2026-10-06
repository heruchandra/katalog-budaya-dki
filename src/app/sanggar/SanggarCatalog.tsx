"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Inbox, AlertTriangle } from "lucide-react";
import { Poppins } from 'next/font/google';
import { dancingScript } from '@/lib/fonts';
import { useLanguage } from "@/context/LanguageContext";
import DriftWall from "@/components/DriftWall";
import CatalogPagination from "@/components/CatalogPagination";
import { JAKARTA_WILAYAH, resolveWilayah } from "@/lib/wilayah";

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] });

const col1Sanggar = ["/images/sanggar/general/dinamis/dinamis-sanggar-1.webp", "/images/sanggar/general/dinamis/dinamis-sanggar-2.webp", "/images/sanggar/general/dinamis/dinamis-sanggar-3.webp"];
const col2Sanggar = ["/images/sanggar/general/dinamis/dinamis-sanggar-4.webp", "/images/sanggar/general/dinamis/dinamis-sanggar-5.webp", "/images/sanggar/general/dinamis/dinamis-sanggar-6.webp"];
const col3Sanggar = ["/images/sanggar/general/dinamis/dinamis-sanggar-7.webp", "/images/sanggar/general/dinamis/dinamis-sanggar-8.webp", "/images/sanggar/general/dinamis/dinamis-sanggar-9.webp"];
const col4Sanggar = ["/images/sanggar/general/dinamis/dinamis-sanggar-10.webp", "/images/sanggar/general/dinamis/dinamis-sanggar-11.webp", "/images/sanggar/general/dinamis/dinamis-sanggar-12.webp"];
const col5Sanggar = ["/images/sanggar/general/dinamis/dinamis-sanggar-13.webp", "/images/sanggar/general/dinamis/dinamis-sanggar-14.webp", "/images/sanggar/general/dinamis/dinamis-sanggar-15.webp"];

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
  wilayah?: string | null;
  alamat_tempat_latihan?: string | null;
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
  const [activeGrade, setActiveGrade] = useState("all");
  const [activeWilayah, setActiveWilayah] = useState("all");
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

  // Wilayah options with how many sanggar are known to be in each (region data comes from real fields only)
  const wilayahCounts = (sanggars || []).reduce<Record<string, number>>((acc, s) => {
    const w = resolveWilayah(s);
    if (w) acc[w] = (acc[w] || 0) + 1;
    return acc;
  }, {});
  const wilayahFilters = [
    { value: "all", label: t('sanggarWilayahAll'), count: (sanggars || []).length },
    ...JAKARTA_WILAYAH.map((w) => ({ value: w as string, label: w as string, count: wilayahCounts[w] || 0 })),
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

    const matchWilayah = activeWilayah === "all" || resolveWilayah(s) === activeWilayah;

    // Search, grade and wilayah all apply together
    return matchGrade && matchWilayah && matchesQuery;
  });

  const hasActiveFilter = Boolean(searchQuery) || activeGrade !== "all" || activeWilayah !== "all";
  const resetFilters = () => {
    setSearchQuery("");
    setActiveGrade("all");
    setActiveWilayah("all");
    setCurrentPage(1);
  };

  const sidebarOptionClass = (isActive: boolean) =>
    `flex w-full items-center justify-between gap-2 text-left px-2 py-1.5 text-xs font-medium uppercase tracking-wider border-l-2 transition-colors outline-none ${
      isActive
        ? "text-orange-600 font-bold bg-orange-50 border-orange-500 pl-2.5"
        : "text-zinc-600 border-transparent hover:text-zinc-900"
    }`;

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
              columnData={SANGGAR_COLUMNS}
              columns={5}
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
            {t('sanggarPageTitle')}
          </h1>
          <p className="text-xs md:text-sm tracking-[0.25em] text-gray-100 uppercase mt-3 font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
            {sanggars && sanggars.length > 0
              ? `${sanggars.length} ${t('sanggarRegistered')}`
              : t('sanggarCatalogFallback')}
          </p>
        </div>
      </div>

      <div className={`flex flex-col md:flex-row gap-12 max-w-[90vw] mx-auto py-12 ${poppins.className}`}>
        
        {/* Mobile Search & Grade Filter Bar (visible only on mobile) */}
        <div className="w-full md:hidden flex flex-col gap-4 -mt-4 mb-2">
          <div className="relative border border-zinc-200 rounded-none px-3 py-2 bg-slate-50 focus-within:bg-white focus-within:border-orange-600 focus-within:ring-1 focus-within:ring-orange-600 transition-colors">
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
                className={`px-3 py-1.5 rounded-none text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeGrade === filter.value
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
                onClick={() => {
                  setActiveWilayah(filter.value);
                  setCurrentPage(1);
                }}
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
            <h3 className="uppercase tracking-widest text-sm text-slate-800 mb-6 font-medium">{t('sanggarSearchTitle')}</h3>
            <div className="relative border-b border-zinc-200 focus-within:border-orange-600 transition-colors">
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
            <div className="space-y-1.5">
              {gradeFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => {
                    setActiveGrade(filter.value);
                    setCurrentPage(1);
                  }}
                  aria-pressed={activeGrade === filter.value}
                  className={sidebarOptionClass(activeGrade === filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* FILTER WILAYAH */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="uppercase tracking-widest text-sm text-slate-800 mb-6 font-medium">{t('sanggarFilterWilayah')}</h3>
            <div className="space-y-1.5">
              {wilayahFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => {
                    setActiveWilayah(filter.value);
                    setCurrentPage(1);
                  }}
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
                {fetchError ? "Database Error" : t('sanggarEmptyTitle')}
              </h2>
              <div className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
                {fetchError ? (
                  <div className="rounded-none bg-red-50 p-4 text-left font-mono text-xs text-red-600 border border-red-100 overflow-auto whitespace-pre-wrap">
                    {fetchError}
                  </div>
                ) : hasActiveFilter ? (
                  <p>{t('sanggarEmptyFilter')}</p>
                ) : (
                  <p>{t('sanggarEmptyDefault')}</p>
                )}
              </div>
              {!fetchError && hasActiveFilter && (
                <button
                  type="button"
                  onClick={resetFilters}
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
              {paginated.map((sanggar, index) => (
                <div key={sanggar.id} className="group relative flex flex-col rounded-none overflow-hidden bg-white border border-zinc-100 shadow-sm hover:shadow-md transition-all">
                  {/* Poster Image Container wrapped in Next.js Link */}
                  <Link
                    href={`/sanggar/${sanggar.id}`}
                    className="relative aspect-[3/4] w-full overflow-hidden rounded-none bg-slate-100 block cursor-pointer"
                  >
                    {sanggar.thumbnail_url ? (
                      <Image
                        src={sanggar.thumbnail_url}
                        alt={sanggar.nama_sanggar}
                        fill
                        sizes="(min-width: 1280px) 22vw, (min-width: 768px) 34vw, 90vw"
                        // first row is above the fold (often the LCP image), so don't lazy-load it
                        loading={index < 3 ? "eager" : undefined}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
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
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-none py-2.5 px-3 text-[11px] font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer"
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
                          className="flex-1 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-none py-2.5 px-3 text-[11px] font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer"
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
                    {/* Grade • specific administrative city; "DKI Jakarta" when the city isn't on record (never guessed) */}
                    <p className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase mt-1">
                      {sanggar.grade
                        ? `GRADE ${sanggar.grade.replace(/grade/i, '').trim()}`
                        : t('sanggarUngraded')}
                      {" • "}
                      {resolveWilayah(sanggar) ?? "DKI Jakarta"}
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
