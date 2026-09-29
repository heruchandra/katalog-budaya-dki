"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X, Plus, Trash2, Image as ImageIcon, MapPin, Info, Phone, Trophy, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import ImageUploadWithCrop from "@/components/ImageUploadWithCrop";
import { useLanguage } from "@/context/LanguageContext";

export default function AddSanggar() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Dynamic state for Tari Unggulan
  const [tariUnggulan, setTariUnggulan] = useState([{ namaTari: "", deskripsiTari: "" }]);

  // Main Form Data State
  const [formData, setFormData] = useState({
    namaSanggar: "",
    grade: "",
    taglineSanggar: "",
    deskripsiSanggar: "",
    layananSanggar: "",
    alamatSanggar: "",
    alamatTempatLatihan: "",
    ketuaSanggar: "",
    namaPicKontak: "",
    nomorPicKontak: "",
    prestasiPenghargaan: "",
  });

  const [mediaData, setMediaData] = useState<{
    fotoGrupTari: Blob | null;
    fotoTariUnggulan: Blob | null;
    fotoKetuaSanggar: Blob | null;
    logoSanggar: Blob | null;
  }>({
    fotoGrupTari: null,
    fotoTariUnggulan: null,
    fotoKetuaSanggar: null,
    logoSanggar: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTariChange = (index: number, field: "namaTari" | "deskripsiTari", value: string) => {
    const updatedTari = [...tariUnggulan];
    updatedTari[index][field] = value;
    setTariUnggulan(updatedTari);
  };

  const addTari = () => {
    setTariUnggulan([...tariUnggulan, { namaTari: "", deskripsiTari: "" }]);
  };

  const removeTari = (index: number) => {
    if (tariUnggulan.length > 1) {
      setTariUnggulan(tariUnggulan.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    // Filter empty tari records
    const validTariUnggulan = tariUnggulan.filter(t => t.namaTari.trim() !== "");

    try {
      // 1. Upload Images to Supabase Storage
      const uploadImage = async (blob: Blob | null, pathPrefix: string): Promise<string | null> => {
        if (!blob) return null;
        
        const fileExt = blob.type.split('/')[1] || 'jpg';
        const fileName = `${pathPrefix}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from("katalog-media")
          .upload(filePath, blob, {
            contentType: blob.type,
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("katalog-media")
          .getPublicUrl(filePath);

        return publicUrl;
      };

      const [logoUrl, fotoGrupUrl, fotoTariUrl, fotoKetuaUrl] = await Promise.all([
        uploadImage(mediaData.logoSanggar, "logo"),
        uploadImage(mediaData.fotoGrupTari, "grup"),
        uploadImage(mediaData.fotoTariUnggulan, "tari"),
        uploadImage(mediaData.fotoKetuaSanggar, "ketua"),
      ]);

      // 2. Map exactly to Supabase Database schema
      const payload = {
        nama_sanggar: formData.namaSanggar,
        grade: formData.grade,
        tagline: formData.taglineSanggar,
        deskripsi: formData.deskripsiSanggar,
        layanan: formData.layananSanggar,
        alamat: formData.alamatSanggar,
        alamat_tempat_latihan: formData.alamatTempatLatihan,
        ketua_sanggar: formData.ketuaSanggar,
        nama_pic: formData.namaPicKontak,
        kontak_pic: formData.nomorPicKontak,
        prestasi: formData.prestasiPenghargaan,
        foto_grup_url: fotoGrupUrl,
        foto_unggulan_url: fotoTariUrl,
        foto_ketua_url: fotoKetuaUrl,
        logo_url: logoUrl,
      };

      // 3. Insert into Database
      const { error: insertError } = await supabase
        .from("sanggars")
        .insert([payload]);

      if (insertError) throw insertError;
      
      router.push("/admin/sanggar?success=true");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal menyimpan data sanggar. Pastikan bucket 'katalog-media' tersedia.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto pb-24">
      {/* Back Link */}
      <Link
        href="/admin/sanggar"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('adminBackToSanggar')}
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tambah Data Sanggar</h1>
        <p className="mt-2 text-base text-gray-500">
          Isi formulir di bawah ini dengan lengkap sesuai dengan spesifikasi profil sanggar.
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                      {t('adminSanggarName')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="namaSanggar"
                      required
                      value={formData.namaSanggar}
                      onChange={handleChange}
                      className="w-full rounded-none border border-zinc-200 px-4 py-2.5 text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none transition-all"
                      placeholder="Contoh: Sanggar Ayodya Pala"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {t('adminSanggarCategory')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="grade"
                      required
                      value={formData.grade}
                      onChange={handleChange}
                      className="w-full rounded-none border border-zinc-200 px-4 py-2.5 text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none transition-all"
                    >
                      <option value="">Pilih Grade</option>
                      <option value="Grade A">Grade A</option>
                      <option value="Grade B">Grade B</option>
                      <option value="Tanpa Grade">Tanpa Grade</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t('adminSanggarTagline')}
                  </label>
                  <input
                    type="text"
                    name="taglineSanggar"
                    value={formData.taglineSanggar}
                    onChange={handleChange}
                    className="w-full rounded-none border border-zinc-200 px-4 py-2.5 text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none transition-all"
                    placeholder="Contoh: Melestarikan Budaya, Membangun Bangsa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t('adminSanggarDesc')}
                  </label>
                  <textarea
                    name="deskripsiSanggar"
                    rows={4}
                    value={formData.deskripsiSanggar}
                    onChange={handleChange}
                    className="w-full rounded-none border border-zinc-200 px-4 py-2.5 text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none transition-all"
                    placeholder="Ceritakan tentang sejarah, visi, dan misi sanggar..."
                  />
                </div>
              </div>
            </div>

            {/* 2. Layanan & Prestasi */}
            <div className="bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-bold text-gray-900">{t('adminServicesSection')}</h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t('adminStudioServices')}
                  </label>
                  <textarea
                    name="layananSanggar"
                    rows={3}
                    value={formData.layananSanggar}
                    onChange={handleChange}
                    className="w-full rounded-none border border-zinc-200 px-4 py-2.5 text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none transition-all"
                    placeholder="Contoh: Pelatihan Tari Tradisional, Penyewaan Kostum..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t('adminAchievements')}
                  </label>
                  <textarea
                    name="prestasiPenghargaan"
                    rows={3}
                    value={formData.prestasiPenghargaan}
                    onChange={handleChange}
                    className="w-full rounded-none border border-zinc-200 px-4 py-2.5 text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none transition-all"
                    placeholder="Contoh: Juara 1 Festival Tari Nusantara 2022..."
                  />
                </div>
              </div>
            </div>

            {/* 3. Tari Unggulan (Dynamic) */}
            <div className="bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary-500" />
                  <h2 className="text-lg font-bold text-gray-900">{t('adminFeaturedDance')}</h2>
                </div>
                <button
                  type="button"
                  onClick={addTari}
                  className="inline-flex items-center gap-1.5 rounded-none bg-primary-50 px-3 py-1.5 text-sm font-semibold text-primary-700 hover:bg-primary-100 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  {t('adminBtnAddDance')}
                </button>
              </div>
              <div className="p-6 space-y-4">
                {tariUnggulan.map((tari, index) => (
                  <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-none border border-gray-200">
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          {t('adminDanceName')}
                        </label>
                        <input
                          type="text"
                          value={tari.namaTari}
                          onChange={(e) => handleTariChange(index, "namaTari", e.target.value)}
                          className="w-full rounded-none border border-zinc-200 px-3 py-2 text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none transition-all"
                          placeholder="Contoh: Tari Jaipong"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          {t('adminDanceDesc')}
                        </label>
                        <textarea
                          rows={2}
                          value={tari.deskripsiTari}
                          onChange={(e) => handleTariChange(index, "deskripsiTari", e.target.value)}
                          className="w-full rounded-none border border-zinc-200 px-3 py-2 text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none transition-all"
                          placeholder="Penjelasan singkat mengenai tarian ini..."
                        />
                      </div>
                    </div>
                    {tariUnggulan.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTari(index)}
                        className="mt-6 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-none transition-colors shrink-0"
                        title="Hapus Tari"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
          </div>

          {/* Sidebar Column (1/3 width) */}
          <div className="space-y-8">
            
            {/* Kontak & Alamat */}
            <div className="bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-700" />
                <h2 className="text-lg font-bold text-gray-900">{t('adminAddressContact')}</h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t('adminSanggarAddress')}
                  </label>
                  <textarea
                    name="alamatSanggar"
                    rows={2}
                    value={formData.alamatSanggar}
                    onChange={handleChange}
                    className="w-full rounded-none border border-zinc-200 px-4 py-2.5 text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t('adminSanggarPracticeAddress')}
                  </label>
                  <textarea
                    name="alamatTempatLatihan"
                    rows={2}
                    value={formData.alamatTempatLatihan}
                    onChange={handleChange}
                    className="w-full rounded-none border border-zinc-200 px-4 py-2.5 text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none transition-all"
                  />
                </div>
                <div className="border-t border-gray-100 my-4"></div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t('adminLeader')}
                  </label>
                  <input
                    type="text"
                    name="ketuaSanggar"
                    value={formData.ketuaSanggar}
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
                    name="namaPicKontak"
                    value={formData.namaPicKontak}
                    onChange={handleChange}
                    className="w-full rounded-none border border-zinc-200 px-4 py-2.5 text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t('adminPICPhone')}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="nomorPicKontak"
                      value={formData.nomorPicKontak}
                      onChange={handleChange}
                      className="w-full rounded-none border border-zinc-200 pl-10 pr-4 py-2.5 text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none transition-all"
                      placeholder="Contoh: 081234567890"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Media & Galeri (File Uploads) */}
            <div className="bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-gray-700" />
                <h2 className="text-lg font-bold text-gray-900">{t('adminMediaSection')}</h2>
              </div>
              <div className="p-6 space-y-8">
                
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-primary-600 border-b border-gray-100 pb-2">{t('adminLogoIdentity')} (1:1)</h3>
                  <ImageUploadWithCrop
                    label={t('adminStudioLogo')}
                    aspectRatio={1}
                    onUpload={(blob) => setMediaData(prev => ({ ...prev, logoSanggar: blob }))}
                  />
                  <ImageUploadWithCrop
                    label={t('adminPhotoLeader')}
                    aspectRatio={1}
                    onUpload={(blob) => setMediaData(prev => ({ ...prev, fotoKetuaSanggar: blob }))}
                  />
                </div>
                
                <div className="space-y-6 pt-4">
                  <h3 className="text-sm font-bold text-primary-600 border-b border-gray-100 pb-2">{t('adminGallerySection')} (16:9)</h3>
                  <ImageUploadWithCrop
                    label={t('adminGroupPhoto')}
                    aspectRatio={16 / 9}
                    onUpload={(blob) => setMediaData(prev => ({ ...prev, fotoGrupTari: blob }))}
                  />
                  <ImageUploadWithCrop
                    label={t('adminFeaturedPhoto')}
                    aspectRatio={16 / 9}
                    onUpload={(blob) => setMediaData(prev => ({ ...prev, fotoTariUnggulan: blob }))}
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
              href="/admin/sanggar"
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
              {isLoading ? "Menyimpan..." : "Simpan Data Sanggar"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
