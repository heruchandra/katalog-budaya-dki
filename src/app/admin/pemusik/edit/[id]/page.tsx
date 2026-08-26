"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function EditPemusik({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nama_seniman: "",
    jenis_seniman: "",
    deskripsi: "",
    genre_musik: "",
    instrumen: "",
    no_hp: "", // Dummy field for UI
    foto_url: "", // Dummy field for UI
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from("pemusiks")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (data) {
          setFormData({
            nama_seniman: data.nama_seniman || "",
            jenis_seniman: data.jenis_seniman || "",
            deskripsi: data.deskripsi || "",
            genre_musik: data.genre_musik || "",
            instrumen: data.instrumen || "",
            no_hp: "", 
            foto_url: "",
          });
        }
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError("Gagal memuat data pemusik.");
      } finally {
        setIsFetching(false);
      }
    }
    
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const dbPayload = {
        nama_seniman: formData.nama_seniman,
        jenis_seniman: formData.jenis_seniman,
        deskripsi: formData.deskripsi,
        genre_musik: formData.genre_musik,
        instrumen: formData.instrumen,
      };

      const { error: updateError } = await supabase
        .from("pemusiks")
        .update(dbPayload)
        .eq("id", id);

      if (updateError) throw updateError;
      
      router.push("/admin/pemusik?success=true");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal memperbarui data pemusik.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto">
      {/* Back Link */}
      <Link
        href="/admin/pemusik"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Data Pemusik
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Data Pemusik</h1>
        <p className="mt-1 text-sm text-gray-500">
          Ubah informasi seniman atau pemusik tradisional.
        </p>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 border border-green-200 font-semibold">
              {successMsg} Mengalihkan...
            </div>
          )}

          {/* Nama */}
          <div>
            <label htmlFor="nama_seniman" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Seniman / Grup <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nama_seniman"
              name="nama_seniman"
              required
              value={formData.nama_seniman}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            />
          </div>

          {/* Kategori / Jenis Seniman */}
          <div>
            <label htmlFor="jenis_seniman" className="block text-sm font-medium text-gray-700 mb-1">
              Kategori / Jenis <span className="text-red-500">*</span>
            </label>
            <select
              id="jenis_seniman"
              name="jenis_seniman"
              required
              value={formData.jenis_seniman}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            >
              <option value="">Pilih Kategori</option>
              <option value="Solo">Solo / Individu</option>
              <option value="Komunitas">Grup / Komunitas</option>
            </select>
          </div>

          {/* Genre & Instrumen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="genre_musik" className="block text-sm font-medium text-gray-700 mb-1">
                Genre Musik
              </label>
              <input
                type="text"
                id="genre_musik"
                name="genre_musik"
                value={formData.genre_musik}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              />
            </div>
            <div>
              <label htmlFor="instrumen" className="block text-sm font-medium text-gray-700 mb-1">
                Instrumen / Spesialisasi
              </label>
              <input
                type="text"
                id="instrumen"
                name="instrumen"
                value={formData.instrumen}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              required
              rows={4}
              value={formData.deskripsi}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            />
          </div>

          {/* Kontak (Dummy for UI completeness) */}
          <div>
            <label htmlFor="no_hp" className="block text-sm font-medium text-gray-700 mb-1">
              Kontak (WhatsApp)
            </label>
            <input
              type="text"
              id="no_hp"
              name="no_hp"
              value={formData.no_hp}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            />
          </div>

          {/* Link URL Gambar (Dummy for UI completeness) */}
          <div>
            <label htmlFor="foto_url" className="block text-sm font-medium text-gray-700 mb-1">
              Link/URL Gambar
            </label>
            <input
              type="url"
              id="foto_url"
              name="foto_url"
              value={formData.foto_url}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
            <Link
              href="/admin/pemusik"
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <X className="h-4 w-4" />
              Batal
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 shadow-sm transition-colors disabled:opacity-70"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
