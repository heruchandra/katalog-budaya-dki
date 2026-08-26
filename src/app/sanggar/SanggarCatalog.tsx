"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Inbox, AlertTriangle } from "lucide-react";
import { Dancing_Script, Poppins } from 'next/font/google';
import { useLanguage } from "@/context/LanguageContext";

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400', '700'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] });

interface Sanggar {
  id: string;
  nama_sanggar: string;
  nama_pimpinan: string;
  grade: string;
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  kota_kab: string;
  no_hp: string;
  jenis_tarian: string;
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

  const dummySanggars = [
    { id: "1", nama_sanggar: "Ayodya Pala", grade: "GRADE B", kecamatan: "JAKARTA", jenis_tarian: "Tari Jaipong, Tari Piring", thumbnail_url: null },
    { id: "2", nama_sanggar: "Tari Sribudaya", grade: "GRADE A", kecamatan: "JAKARTA", jenis_tarian: "Tari Topeng, Tari Sirih Kuning", thumbnail_url: null },
    { id: "3", nama_sanggar: "Sanggar Citra Budaya", grade: "GRADE A", kecamatan: "JAKARTA", jenis_tarian: "Tari Betawi, Tari Saman", thumbnail_url: null },
    { id: "4", nama_sanggar: "Kinarya GSP", grade: "GRADE B", kecamatan: "JAKARTA", jenis_tarian: "Tari Merak, Tari Pendet", thumbnail_url: null },
    { id: "5", nama_sanggar: "Sanggar Tari Kencana", grade: "GRADE C", kecamatan: "JAKARTA", jenis_tarian: "Tari Bali, Tari Kecak", thumbnail_url: null },
    { id: "6", nama_sanggar: "Laksita Kirana", grade: "GRADE A", kecamatan: "JAKARTA", jenis_tarian: "Tari Ronggeng, Tari Jaipong", thumbnail_url: null },
    { id: "7", nama_sanggar: "Sanggar Bintang", grade: "GRADE A", kecamatan: "JAKARTA", jenis_tarian: "Tari Betawi", thumbnail_url: null },
    { id: "8", nama_sanggar: "Tari Pusaka", grade: "GRADE B", kecamatan: "JAKARTA", jenis_tarian: "Tari Piring", thumbnail_url: null },
    { id: "9", nama_sanggar: "Budaya Luhur", grade: "GRADE C", kecamatan: "JAKARTA", jenis_tarian: "Tari Saman", thumbnail_url: null },
    { id: "10", nama_sanggar: "Melati Putih", grade: "GRADE A", kecamatan: "JAKARTA", jenis_tarian: "Tari Pendet", thumbnail_url: null },
    { id: "11", nama_sanggar: "Cipta Pesona", grade: "GRADE B", kecamatan: "JAKARTA", jenis_tarian: "Tari Jaipong", thumbnail_url: null },
    { id: "12", nama_sanggar: "Kenanga Art", grade: "GRADE A", kecamatan: "JAKARTA", jenis_tarian: "Tari Topeng", thumbnail_url: null }
  ] as Sanggar[];

  const filtered = dummySanggars.filter((s) => {
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

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white pb-16 pt-24">
      {/* Minimal Header */}
      <div className="mx-auto max-w-[90vw] px-4 sm:px-6 lg:px-8 mb-12">
      {/* Back Navigation - Premium Editorial Style */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
        <Link className="group inline-flex items-center gap-4 text-xs sm:text-sm font-bold tracking-[0.2em] text-slate-500 hover:text-orange-600 transition-colors duration-300 uppercase" href="/">
          <svg 
            className="w-5 h-5 transform group-hover:-translate-x-2 transition-transform duration-300 ease-in-out" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>{t('backToCatalog') || 'KEMBALI'}</span>
        </Link>
      </div>
        <div>
          <h1 className={`text-4xl md:text-5xl font-light text-slate-900 ${dancingScript.className}`}>
            {t('sanggarPageTitle')}
          </h1>
          <p className="mt-2 text-sm text-slate-500 uppercase tracking-widest">
            {dummySanggars.length > 0
              ? `${dummySanggars.length} ${t('sanggarRegistered')}`
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
                  className={`text-left text-sm transition-colors uppercase tracking-widest ${
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
                  <div className="relative w-full aspect-[3/4] bg-slate-100 overflow-hidden rounded-sm">
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
                  </div>

                  {/* Text Area */}
                  <div className="mt-4 text-left">
                    <h3 className="text-lg text-slate-900 truncate font-medium">
                      {sanggar.nama_sanggar}
                    </h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mt-1.5">
                      {sanggar.grade ? `Grade ${sanggar.grade.replace(/grade/i, '').trim()}` : "Grade N/A"} • {sanggar.kecamatan || "Jakarta"}
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

          {/* Minimalist Pagination */}
          {!fetchError && filtered.length > 0 && (
            <div className="flex justify-center items-center gap-5 mt-14 mb-10 w-full">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`w-12 h-12 flex items-center justify-center transition-colors mr-3 shadow-md ${currentPage === 1 ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-[#1a1a1a] text-white hover:bg-black'}`}
                aria-label="Previous Page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={`font-medium text-xl transition-colors ${currentPage === number ? 'text-gray-300' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {number}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`w-12 h-12 flex items-center justify-center transition-colors ml-3 shadow-md ${currentPage === totalPages ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-[#1a1a1a] text-white hover:bg-black'}`}
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
