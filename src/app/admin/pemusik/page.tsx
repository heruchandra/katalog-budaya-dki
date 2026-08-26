"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from 'next/navigation';
import { Edit, Trash2, Plus, Search, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminPemusikList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (searchParams.get('success')) {
      setShowToast(true);
      router.replace('/admin/pemusik', { scroll: false });
      setTimeout(() => setShowToast(false), 3000);
    }
  }, [searchParams, router]);

  const [pemusiks, setPemusiks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPemusiks = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from("pemusiks")
        .select("id, nama_seniman, jenis_seniman, genre_musik, instrumen")
        .order("nama_seniman", { ascending: true });

      if (err) throw err;
      setPemusiks(data || []);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data pemusik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPemusiks();
  }, []);

  const handleDelete = async (id: string, nama: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus seniman "${nama}"? Data yang sudah dihapus tidak dapat dikembalikan.`)) {
      return;
    }

    try {
      const { error: err } = await supabase
        .from("pemusiks")
        .delete()
        .eq("id", id);

      if (err) throw err;
      
      setPemusiks((prev) => prev.filter((item) => item.id !== id));
      alert("Data berhasil dihapus.");
    } catch (err: any) {
      alert(`Gagal menghapus data: ${err.message}`);
    }
  };

  const filteredPemusiks = pemusiks.filter(p => 
    p.nama_seniman?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.jenis_seniman?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.genre_musik?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.instrumen?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('adminDataMusikTitle')}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {t('adminDataMusikDesc')}
          </p>
        </div>
        <Link
          href="/admin/pemusik/tambah"
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          {t('adminBtnAddData')}
        </Link>
      </div>

      {/* Table Section */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-gray-200 p-4 sm:flex sm:items-center sm:justify-between">
          <div className="relative max-w-sm w-full rounded-lg border border-gray-300 bg-gray-50 focus-within:border-gray-300 focus-within:ring-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('adminSearchMusik')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-9 pr-4 text-sm !outline-none !ring-0 !border-none !shadow-none focus:!ring-0 focus:!outline-none focus:!border-transparent focus:!shadow-none ring-offset-0 bg-transparent"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('colArtistName')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('colCategoryMusik')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('colGenreInstrument')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('colStatus')}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('colAction')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-red-500">
                    Gagal memuat data: {error}
                  </td>
                </tr>
              )}
              
              {!loading && !error && filteredPemusiks.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                    Belum ada data pemusik.
                  </td>
                </tr>
              )}

              {!loading && !error && filteredPemusiks.map((pemusik) => (
                <tr key={pemusik.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{pemusik.nama_seniman}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500">{pemusik.jenis_seniman || "-"}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {pemusik.genre_musik} • {pemusik.instrumen}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      {t('statusActive')}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <Link href={`/admin/pemusik/edit/${pemusik.id}`} className="text-blue-600 hover:text-blue-900" title="Edit">
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(pemusik.id, pemusik.nama_seniman)}
                        className="text-red-600 hover:text-red-900" 
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showToast && (
        <div className="fixed bottom-10 right-10 flex items-center gap-3 bg-teal-600 text-white px-6 py-4 rounded-xl shadow-2xl transition-all animate-bounce z-50">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          <span className="font-semibold tracking-wide">Yeay! Data berhasil disimpan.</span>
        </div>
      )}
    </div>
  );
}
