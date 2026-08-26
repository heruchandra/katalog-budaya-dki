import { createServerSupabaseClient } from "@/lib/supabase-server";
import SanggarDetailClient from "./SanggarDetailClient";

export default async function SanggarDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("sanggars")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-slate-500">Sanggar tidak ditemukan.</p>
      </div>
    );
  }

  const gallery = [];
  if (data.foto_grup_url) gallery.push({ type: "Foto Grup Tari", url: data.foto_grup_url });
  if (data.foto_unggulan_url) gallery.push({ type: "Foto Tari Unggulan", url: data.foto_unggulan_url });
  if (data.thumbnail_url) gallery.push({ type: "Foto Penari (Thumbnail)", url: data.thumbnail_url });

  const sanggar = {
    id: data.id,
    name: data.nama_sanggar || "Nama Sanggar",
    taglineSanggar: data.tagline_sanggar || "",
    grade: data.grade || "Tanpa Grade",
    ketuaSanggar: data.ketua_sanggar || "-",
    namaPicKontak: data.nama_pic_kontak || "-",
    nomorPicKontak: data.nomor_pic_kontak || "-",
    email: data.email || "-",
    alamatSanggar: data.alamat_sanggar || "-",
    alamatTempatLatihan: data.alamat_tempat_latihan || "-",
    description: data.deskripsi_sanggar || "-",
    layananSanggar: data.layanan_sanggar || "-",
    prestasiPenghargaan: data.prestasi_penghargaan || "-",
    established: "-",
    members: "-",
    tariUnggulan: Array.isArray(data.tari_unggulan) ? data.tari_unggulan : [],
    imageUrl: data.foto_grup_url || data.thumbnail_url || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop",
    logoUrl: data.logo_url || null,
    fotoKetuaUrl: data.foto_ketua_url || null,
    gallery,
  };

  return <SanggarDetailClient sanggar={sanggar} />;
}
