"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X, Plus, Trash2, Image as ImageIcon, MapPin, Info, Phone, Trophy, Star, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";
import { useLanguage } from "@/context/LanguageContext";

export default function EditSanggar({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useLanguage();
  const router = useRouter();
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
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

  const [existingImages, setExistingImages] = useState({
    fotoGrupTari: null as string | null,
    fotoTariUnggulan: null as string | null,
    fotoKetuaSanggar: null as string | null,
    logoSanggar: null as string | null,
    fotoUrl: null as string | null,
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [ketuaFile, setKetuaFile] = useState<File | null>(null);
  const [grupFile, setGrupFile] = useState<File | null>(null);
  const [unggulanFile, setUnggulanFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  // Cropper states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [currentImageToCrop, setCurrentImageToCrop] = useState<string | null>(null);
  const [currentCropType, setCurrentCropType] = useState<"logo" | "ketua" | "grup" | "unggulan" | "thumbnail" | null>(null);
  const [currentCropAspectRatio, setCurrentCropAspectRatio] = useState<number>(1);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from("sanggars")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (data) {
          setFormData({
            namaSanggar: data.nama_sanggar || "",
            grade: data.grade || "",
            taglineSanggar: data.tagline_sanggar || "",
            deskripsiSanggar: data.deskripsi_sanggar || "",
            layananSanggar: data.layanan_sanggar || "",
            alamatSanggar: data.alamat || "",
            alamatTempatLatihan: data.alamat_tempat_latihan || "",
            ketuaSanggar: data.ketua_sanggar || "",
            namaPicKontak: data.nama_pic_kontak || "",
            nomorPicKontak: data.nomor_pic_kontak || "",
            prestasiPenghargaan: data.prestasi_penghargaan || "",
          });

          setExistingImages({
            fotoGrupTari: data.foto_grup_tari || null,
            fotoTariUnggulan: data.foto_tari_unggulan || null,
            fotoKetuaSanggar: data.foto_ketua_sanggar || null,
            logoSanggar: data.logo_sanggar || null,
            fotoUrl: data.foto_url || null,
          });

          if (data.tari_unggulan && Array.isArray(data.tari_unggulan) && data.tari_unggulan.length > 0) {
            setTariUnggulan(data.tari_unggulan);
          }
        }
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError("Gagal memuat data sanggar.");
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "ketua" | "grup" | "unggulan" | "thumbnail") => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setCurrentImageToCrop(reader.result?.toString() || null);
        setCurrentCropType(type);
        if (type === "logo" || type === "ketua") {
          setCurrentCropAspectRatio(1);
        } else if (type === "thumbnail") {
          setCurrentCropAspectRatio(3 / 4);
        } else {
          setCurrentCropAspectRatio(16 / 9);
        }
        setIsCropModalOpen(true);
      });
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      if (!currentImageToCrop || !croppedAreaPixels || !currentCropType) return;
      const croppedImageBlob = await getCroppedImg(currentImageToCrop, croppedAreaPixels, 0);
      if (croppedImageBlob) {
        const fileExt = croppedImageBlob.type.split('/')[1] || 'jpg';
        const croppedFile = new File([croppedImageBlob], `cropped-${currentCropType}.${fileExt}`, { type: croppedImageBlob.type });

        switch (currentCropType) {
          case "logo": setLogoFile(croppedFile); break;
          case "ketua": setKetuaFile(croppedFile); break;
          case "grup": setGrupFile(croppedFile); break;
          case "unggulan": setUnggulanFile(croppedFile); break;
          case "thumbnail": setThumbnailFile(croppedFile); break;
        }
        closeModal();
      }
    } catch (e) {
      console.error(e);
      alert("Gagal memotong gambar.");
    }
  };

  const closeModal = () => {
    setIsCropModalOpen(false);
    setCurrentImageToCrop(null);
    setCurrentCropType(null);
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
      // 1. Upload Images to Supabase Storage if NEW image provided
      const uploadImage = async (blob: Blob | null, pathPrefix: string, existingUrl: string | null): Promise<string | null> => {
        if (!blob) return existingUrl; // if no new blob, keep existing URL

        const fileExt = blob.type.split('/')[1] || 'jpg';
        const fileName = `${pathPrefix}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
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

      let logoUrl = existingImages.logoSanggar;
      let fotoGrupUrl = existingImages.fotoGrupTari;
      let fotoTariUrl = existingImages.fotoTariUnggulan;
      let fotoKetuaUrl = existingImages.fotoKetuaSanggar;
      let thumbnailUrl = existingImages.fotoUrl;

      if (logoFile || ketuaFile || grupFile || unggulanFile || thumbnailFile) {
        [logoUrl, fotoGrupUrl, fotoTariUrl, fotoKetuaUrl, thumbnailUrl] = await Promise.all([
          uploadImage(logoFile, "logo", existingImages.logoSanggar),
          uploadImage(grupFile, "grup", existingImages.fotoGrupTari),
          uploadImage(unggulanFile, "tari", existingImages.fotoTariUnggulan),
          uploadImage(ketuaFile, "ketua", existingImages.fotoKetuaSanggar),
          uploadImage(thumbnailFile, "thumbnail", existingImages.fotoUrl),
        ]);
      }

      // 2. Map exactly to Supabase Database schema
      const payload = {
        nama_sanggar: formData.namaSanggar,
        alamat: formData.alamatSanggar,
        alamat_tempat_latihan: formData.alamatTempatLatihan,
        kontak_pic: formData.nomorPicKontak,
        grade: formData.grade,
        logo_url: logoUrl,
        foto_ketua_url: fotoKetuaUrl,
        foto_grup_url: fotoGrupUrl,
        foto_unggulan_url: fotoTariUrl,
        thumbnail_url: thumbnailUrl,
      };

      // 3. Update into Database
      const { error: updateError } = await supabase
        .from("sanggars")
        .update(payload)
        .eq("id", id);

      if (updateError) throw updateError;

      router.push("/admin/sanggar?success=true");
      router.refresh();

    } catch (err: any) {
      console.error("Upload Error Details:", err?.response?.data || err);
      const errorMessage = err?.response?.data?.message || err?.message || "Gagal memperbarui data sanggar. Periksa ukuran gambar atau koneksi.";
      setError(errorMessage);
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
        href="/admin/sanggar"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('adminBackToSanggar')}
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{t('adminEditSanggarTitle')}</h1>
        <p className="mt-2 text-base text-gray-500">
          {t('adminEditSanggarDesc')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200 shadow-sm flex items-start gap-3">
            <div className="font-bold">Error:</div>
            <div>{error}</div>
          </div>
        )}

        {successMsg && (
          <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700 border border-green-200 shadow-sm font-semibold">
            {successMsg} Mengalihkan...
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">

            {/* 1. Informasi Dasar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
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
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
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
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
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
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
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
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 2. Layanan & Prestasi */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
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
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
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
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 3. Tari Unggulan (Dynamic) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary-500" />
                  <h2 className="text-lg font-bold text-gray-900">{t('adminFeaturedDance')}</h2>
                </div>
                <button
                  type="button"
                  onClick={addTari}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-1.5 text-sm font-semibold text-primary-700 hover:bg-primary-100 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  {t('adminBtnAddDance')}
                </button>
              </div>
              <div className="p-6 space-y-4">
                {tariUnggulan.map((tari, index) => (
                  <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          {t('adminDanceName')}
                        </label>
                        <input
                          type="text"
                          value={tari.namaTari}
                          onChange={(e) => handleTariChange(index, "namaTari", e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
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
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                    {tariUnggulan.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTari(index)}
                        className="mt-6 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
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
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
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
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
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
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
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
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
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
                      className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Media & Galeri (File Uploads) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-gray-700" />
                <h2 className="text-lg font-bold text-gray-900">{t('adminMediaSection')}</h2>
              </div>
              <div className="p-6 space-y-8">

                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-primary-600 border-b border-gray-100 pb-2">{t('adminLogoIdentity')}</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('adminStudioLogo')}</label>
                    <div className="mt-2 flex justify-center rounded-xl border border-dashed border-slate-300 px-6 py-8 hover:bg-slate-50 transition-colors">
                      <label className="relative cursor-pointer w-full h-full flex flex-col items-center justify-center focus-within:outline-none">
                        <input type="file" accept="image/png, image/jpeg, image/webp" className="sr-only" onChange={(e) => handleFileChange(e, "logo")} />
                        {logoFile ? (
                          <div className="relative group w-32 h-32 mx-auto rounded-md overflow-hidden shadow-sm">
                            <img src={URL.createObjectURL(logoFile)} alt="Preview Logo" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <span className="text-white text-xs font-semibold">Ganti Gambar</span>
                            </div>
                          </div>
                        ) : existingImages.logoSanggar ? (
                          <div className="relative group w-32 h-32 mx-auto rounded-md overflow-hidden shadow-sm">
                            <img src={existingImages.logoSanggar} alt="Current Logo" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <span className="text-white text-xs font-semibold">Ganti Gambar</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <svg className="mx-auto h-10 w-10 text-slate-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                            </svg>
                            <span className="mt-4 block text-sm font-semibold text-orange-600 hover:text-orange-500">{t('adminClickToUpload')}</span>
                            <p className="text-xs leading-5 text-slate-500 mt-1">{t('adminUploadSupport')}</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('adminPhotoLeader')}</label>
                    <div className="mt-2 flex justify-center rounded-xl border border-dashed border-slate-300 px-6 py-8 hover:bg-slate-50 transition-colors">
                      <label className="relative cursor-pointer w-full h-full flex flex-col items-center justify-center focus-within:outline-none">
                        <input type="file" accept="image/png, image/jpeg, image/webp" className="sr-only" onChange={(e) => handleFileChange(e, "ketua")} />
                        {ketuaFile ? (
                          <div className="relative group w-32 h-32 mx-auto rounded-md overflow-hidden shadow-sm">
                            <img src={URL.createObjectURL(ketuaFile)} alt="Preview Ketua" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <span className="text-white text-xs font-semibold">Ganti Gambar</span>
                            </div>
                          </div>
                        ) : existingImages.fotoKetuaSanggar ? (
                          <div className="relative group w-32 h-32 mx-auto rounded-md overflow-hidden shadow-sm">
                            <img src={existingImages.fotoKetuaSanggar} alt="Current Ketua" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <span className="text-white text-xs font-semibold">Ganti Gambar</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <svg className="mx-auto h-10 w-10 text-slate-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                            </svg>
                            <span className="mt-4 block text-sm font-semibold text-orange-600 hover:text-orange-500">{t('adminClickToUpload')}</span>
                            <p className="text-xs leading-5 text-slate-500 mt-1">{t('adminUploadSupport')}</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <h4 className="text-orange-600 font-semibold mb-4 text-sm">{t('adminThumbnailSection')}</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">{t('adminDancerCard')}</label>
                      <div className="mt-2 flex justify-center rounded-xl border border-dashed border-slate-300 px-6 py-8 hover:bg-slate-50 transition-colors">
                        <label className="relative cursor-pointer w-full h-full flex flex-col items-center justify-center focus-within:outline-none">
                          <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleFileChange(e, "thumbnail")} />
                          {thumbnailFile ? (
                            <div className="relative group w-28 mx-auto rounded-md overflow-hidden shadow-sm" style={{ aspectRatio: '3/4' }}>
                              <img src={URL.createObjectURL(thumbnailFile)} alt="Preview Thumbnail" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-white text-xs font-semibold">Ganti Gambar</span>
                              </div>
                            </div>
                          ) : existingImages.fotoUrl ? (
                            <div className="relative group w-28 mx-auto rounded-md overflow-hidden shadow-sm" style={{ aspectRatio: '3/4' }}>
                              <img src={existingImages.fotoUrl} alt="Current Thumbnail" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-white text-xs font-semibold">Ganti Gambar</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <svg className="mx-auto h-10 w-10 text-slate-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                              </svg>
                              <span className="mt-4 block text-sm font-semibold text-orange-600 hover:text-orange-500">{t('adminClickToUpload')}</span>
                              <p className="text-xs leading-5 text-slate-500 mt-1">{t('adminUploadSupport')}</p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-4">
                  <h3 className="text-sm font-bold text-primary-600 border-b border-gray-100 pb-2">{t('adminGallerySection')}</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('adminGroupPhoto')}</label>
                    <div className="mt-2 flex justify-center rounded-xl border border-dashed border-slate-300 px-6 py-8 hover:bg-slate-50 transition-colors">
                      <label className="relative cursor-pointer w-full h-full flex flex-col items-center justify-center focus-within:outline-none">
                        <input type="file" accept="image/png, image/jpeg, image/webp" className="sr-only" onChange={(e) => handleFileChange(e, "grup")} />
                        {grupFile ? (
                          <div className="relative group w-full aspect-video rounded-md overflow-hidden shadow-sm">
                            <img src={URL.createObjectURL(grupFile)} alt="Preview Grup" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <span className="text-white text-xs font-semibold">Ganti Gambar</span>
                            </div>
                          </div>
                        ) : existingImages.fotoGrupTari ? (
                          <div className="relative group w-full aspect-video rounded-md overflow-hidden shadow-sm">
                            <img src={existingImages.fotoGrupTari} alt="Current Grup" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <span className="text-white text-xs font-semibold">Ganti Gambar</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <svg className="mx-auto h-10 w-10 text-slate-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                            </svg>
                            <span className="mt-4 block text-sm font-semibold text-orange-600 hover:text-orange-500">{t('adminClickToUpload')}</span>
                            <p className="text-xs leading-5 text-slate-500 mt-1">{t('adminUploadSupport')}</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('adminFeaturedPhoto')}</label>
                    <div className="mt-2 flex justify-center rounded-xl border border-dashed border-slate-300 px-6 py-8 hover:bg-slate-50 transition-colors">
                      <label className="relative cursor-pointer w-full h-full flex flex-col items-center justify-center focus-within:outline-none">
                        <input type="file" accept="image/png, image/jpeg, image/webp" className="sr-only" onChange={(e) => handleFileChange(e, "unggulan")} />
                        {unggulanFile ? (
                          <div className="relative group w-full aspect-video rounded-md overflow-hidden shadow-sm">
                            <img src={URL.createObjectURL(unggulanFile)} alt="Preview Unggulan" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <span className="text-white text-xs font-semibold">Ganti Gambar</span>
                            </div>
                          </div>
                        ) : existingImages.fotoTariUnggulan ? (
                          <div className="relative group w-full aspect-video rounded-md overflow-hidden shadow-sm">
                            <img src={existingImages.fotoTariUnggulan} alt="Current Unggulan" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <span className="text-white text-xs font-semibold">Ganti Gambar</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <svg className="mx-auto h-10 w-10 text-slate-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                            </svg>
                            <span className="mt-4 block text-sm font-semibold text-orange-600 hover:text-orange-500">{t('adminClickToUpload')}</span>
                            <p className="text-xs leading-5 text-slate-500 mt-1">{t('adminUploadSupport')}</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
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
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <X className="h-5 w-5" />
              {t('adminBtnCancel')}
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-8 py-2.5 text-sm font-bold text-white bg-primary-600 rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all disabled:opacity-70 disabled:shadow-none"
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
      {/* Cropper Modal */}
      {isCropModalOpen && currentImageToCrop && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6">
          <div className="bg-white rounded-2xl overflow-hidden w-full max-w-2xl flex flex-col shadow-2xl">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">Sesuaikan Gambar ({currentCropType})</h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full h-[50vh] sm:h-[60vh] bg-gray-900">
              <Cropper
                image={currentImageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={currentCropAspectRatio}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium text-gray-600 w-12">Zoom</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => {
                    setZoom(Number(e.target.value))
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={showCroppedImage}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-primary-600 rounded-xl hover:bg-primary-700 shadow-sm transition-all"
                >
                  <Check className="w-4 h-4" />
                  Simpan Potongan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
