"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X, Info, Star, MapPin, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";
import ImageUploadWithCrop from "@/components/ImageUploadWithCrop";

export default function EditPemusik({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { t } = useLanguage();
  
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
    layanan: "", // Dummy field
    prestasi: "", // Dummy field
    alamat: "", // Dummy field
    nama_pic: "", // Dummy field
    no_hp: "", // Dummy field
  });

  const [mediaData, setMediaData] = useState<{
    logo?: Blob | null;
    artistPhoto?: Blob | null;
    groupPhoto?: Blob | null;
  }>({});

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
            layanan: "", 
            prestasi: "", 
            alamat: "", 
            nama_pic: "", 
            no_hp: "", 
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
    <div className="p-6 sm:p-8 max-w-5xl mx-auto pb-24">
      {/* Back Link */}
      <Link
        href="/admin/pemusik"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('adminBackToMusic')}
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{t('adminEditMusicTitle')}</h1>
        <p className="mt-2 text-base text-gray-500">
          {t('adminEditMusicDesc')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="rounded-none bg-red-50 p-4 text-sm text-red-700 border border-red-200 shadow-sm flex items-start gap-3">
            <div className="font-bold">Error:</div>
            <div>{error}</div>
          </div>
        )}

        {successMsg && (
          <div className="rounded-none bg-green-50 p-4 text-sm text-green-700 border border-green-200 shadow-sm font-semibold">
            {successMsg} Mengalihkan...
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          {/* Main Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Informasi Dasar */}
            <div className="bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-bold text-gray-900">{t('adminBasicInfo')}</h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {t('adminArtistName')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nama_seniman"
                      required
                      value={formData.nama_seniman}
                      onChange={handleChange}
                      className="w-full rounded-none border border-zinc-200 px-4 py-2.5 text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {t('adminArtistCategory')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="jenis_seniman"
                      required
                      value={formData.jenis_seniman}
                      onChange={handleChange}
                      className="w-full rounded-none border border-zinc-200 px-4 py-2.5 text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none transition-all"
                    >
                      <option value="">Pilih Kategori</option>
                      <option value="Solo">Solo / Individu</option>
                      <option value="Komunitas">Grup / Komunitas</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {t('adminMusicGenre')}
                    </label>
                    <input
                      type="text"
                      name="genre_musik"
                      value={formData.genre_musik}
                      onChange={handleChange}
                      className="w-full rounded-none border border-zinc-200 px-4 py-2.5 text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {t('adminMusicInstrument')}
                    </label>
                    <input
                      type="text"
                      name="instrumen"
                      value={formData.instrumen}
                      onChange={handleChange}
                      className="w-full rounded-none border border-zinc-200 px-4 py-2.5 text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t('adminArtistDesc')} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="deskripsi"
                    required
                    rows={4}
                    value={formData.deskripsi}
                    onChange={handleChange}
                    className="w-full rounded-none border border-zinc-200 px-4 py-2.5 text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 2. Layanan & Prestasi */}
            <div className="bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                <Star className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-bold text-gray-900">{t('adminServicesSection')}</h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t('adminMusicServices')}
                  </label>
                  <textarea
                    name="layanan"
                    rows={3}
                    value={formData.layanan}
                    onChange={handleChange}
                    className="w-full rounded-none border border-zinc-200 px-4 py-2.5 text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t('adminAchievements')}
                  </label>
                  <textarea
                    name="prestasi"
                    rows={3}
                    value={formData.prestasi}
                    onChange={handleChange}
                    className="w-full rounded-none border border-zinc-200 px-4 py-2.5 text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 3. Karya Unggulan */}
            <div className="bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                <Star className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-bold text-gray-900">{t('adminFeaturedWork')}</h2>
              </div>
              <div className="p-6 space-y-5">
                <p className="text-sm text-gray-500 italic">Formulir karya/lagu dinamis belum diaktifkan.</p>
              </div>
            </div>

          </div>

          {/* Side Column (1/3 width) */}
          <div className="space-y-8">
            
            {/* 4. Alamat & Kontak */}
            <div className="bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-bold text-gray-900">{t('adminAddressContact')}</h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t('adminArtistAddress')}
                  </label>
                  <textarea
                    name="alamat"
                    rows={3}
                    value={formData.alamat}
                    onChange={handleChange}
                    className="w-full rounded-none border border-zinc-200 px-4 py-2.5 text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t('adminPICName')}
                  </label>
                  <input
                    type="text"
                    name="nama_pic"
                    value={formData.nama_pic}
                    onChange={handleChange}
                    className="w-full rounded-none border border-zinc-200 px-4 py-2.5 text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t('adminPICPhone')}
                  </label>
                  <input
                    type="text"
                    name="no_hp"
                    value={formData.no_hp}
                    onChange={handleChange}
                    className="w-full rounded-none border border-zinc-200 px-4 py-2.5 text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 5. Media & Galeri */}
            <div className="bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-bold text-gray-900">{t('adminMediaSection')}</h2>
              </div>
              
              <div className="p-6 space-y-8">
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-primary-600 border-b border-gray-100 pb-2">{t('adminLogoIdentity')}</h3>
                  <ImageUploadWithCrop
                    label={t('adminArtistLogo')}
                    aspectRatio={1}
                    onUpload={(blob) => setMediaData(prev => ({ ...prev, logo: blob }))}
                  />
                  <ImageUploadWithCrop
                    label={t('adminMusicCard')}
                    aspectRatio={3 / 4}
                    onUpload={(blob) => setMediaData(prev => ({ ...prev, artistPhoto: blob }))}
                  />
                </div>
                
                <div className="space-y-6 pt-4">
                  <h3 className="text-sm font-bold text-primary-600 border-b border-gray-100 pb-2">{t('adminGallerySection')} (16:9)</h3>
                  <ImageUploadWithCrop
                    label={t('adminMusicGroupPhoto')}
                    aspectRatio={16 / 9}
                    onUpload={(blob) => setMediaData(prev => ({ ...prev, groupPhoto: blob }))}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Floating Action Bar for Submission */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 lg:ml-64">
          <div className="max-w-5xl mx-auto flex items-center justify-end gap-4">
            <Link
              href="/admin/pemusik"
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-none hover:bg-gray-50 transition-colors"
            >
              <X className="h-5 w-5" />
              {t('adminBtnCancel')}
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-8 py-2.5 text-sm font-bold text-white bg-primary-600 rounded-none hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all disabled:opacity-70 disabled:shadow-none"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              {isLoading ? "Menyimpan..." : t('adminBtnSaveChanges')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}


