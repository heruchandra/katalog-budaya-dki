"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Inbox, AlertTriangle } from "lucide-react";
import { Dancing_Script, Poppins } from 'next/font/google';
import { useLanguage } from "@/context/LanguageContext";

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400', '700'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] });

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

  const dummyPemusik = [
    { id: "1", nama_seniman: "Grup Gambang Kromong", grade: "GRADE A", kecamatan: "JAKARTA", genre_musik: "Musik Betawi Asli", instrumen: "", pengalaman: "", deskripsi: "", jenis_seniman: "Komunitas" },
    { id: "2", nama_seniman: "Sanggar Karawitan", grade: "GRADE B", kecamatan: "JAKARTA", genre_musik: "Gamelan, Karawitan", instrumen: "", pengalaman: "", deskripsi: "", jenis_seniman: "Komunitas" },
    { id: "3", nama_seniman: "Keroncong Tugu", grade: "GRADE A", kecamatan: "JAKARTA", genre_musik: "Musik Keroncong", instrumen: "", pengalaman: "", deskripsi: "", jenis_seniman: "Komunitas" },
    { id: "4", nama_seniman: "Tanjidor Putra", grade: "GRADE B", kecamatan: "JAKARTA", genre_musik: "Tanjidor", instrumen: "", pengalaman: "", deskripsi: "", jenis_seniman: "Komunitas" },
    { id: "5", nama_seniman: "Grup Marawis", grade: "GRADE C", kecamatan: "JAKARTA", genre_musik: "Marawis, Qasidah", instrumen: "", pengalaman: "", deskripsi: "", jenis_seniman: "Komunitas" },
    { id: "6", nama_seniman: "Angklung Jakarta", grade: "GRADE A", kecamatan: "JAKARTA", genre_musik: "Musik Bambu, Angklung", instrumen: "", pengalaman: "", deskripsi: "", jenis_seniman: "Komunitas" },
    { id: "7", nama_seniman: "Orkes Harmoni", grade: "GRADE A", kecamatan: "JAKARTA", genre_musik: "Keroncong", instrumen: "", pengalaman: "", deskripsi: "", jenis_seniman: "Komunitas" },
    { id: "8", nama_seniman: "Gamelan Swara", grade: "GRADE B", kecamatan: "JAKARTA", genre_musik: "Gamelan", instrumen: "", pengalaman: "", deskripsi: "", jenis_seniman: "Komunitas" },
    { id: "9", nama_seniman: "Senja Kustik", grade: "GRADE C", kecamatan: "JAKARTA", genre_musik: "Akustik", instrumen: "", pengalaman: "", deskripsi: "", jenis_seniman: "Komunitas" },
    { id: "10", nama_seniman: "Rampak Kendang", grade: "GRADE A", kecamatan: "JAKARTA", genre_musik: "Perkusi", instrumen: "", pengalaman: "", deskripsi: "", jenis_seniman: "Komunitas" },
    { id: "11", nama_seniman: "Nada Bambu", grade: "GRADE B", kecamatan: "JAKARTA", genre_musik: "Angklung", instrumen: "", pengalaman: "", deskripsi: "", jenis_seniman: "Komunitas" },
    { id: "12", nama_seniman: "Tanjidor Abadi", grade: "GRADE A", kecamatan: "JAKARTA", genre_musik: "Tanjidor", instrumen: "", pengalaman: "", deskripsi: "", jenis_seniman: "Komunitas" }
  ] as Pemusik[];

  const filtered = dummyPemusik.filter((p) => {
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
      <div className="mx-auto max-w-[90vw] px-4 sm:px-6 lg:px-8">
        <div className="mt-20 mb-12">
          <h1 className={`text-4xl md:text-5xl font-light text-slate-900 ${dancingScript.className}`}>
            {t('pemusikPageTitle')}
          </h1>
          <p className="mt-2 text-sm text-slate-500 uppercase tracking-widest">
            {dummyPemusik.length > 0
              ? `${dummyPemusik.length} ${t('pemusikRegistered')}`
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
                  className={`text-left text-sm transition-colors uppercase tracking-widest ${
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
