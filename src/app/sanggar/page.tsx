import { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import SanggarCatalog from "./SanggarCatalog";

export const metadata: Metadata = {
  title: "Sanggar Tari — Katalog Seni DKI Jakarta",
  description:
    "Temukan sanggar tari tradisional bersertifikat Grade A dan Grade B di Jakarta. Profil lengkap dengan galeri foto dan kontak langsung.",
};

export const dynamic = "force-dynamic";

interface Sanggar {
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
  youtubeUrl?: string;
  jenis_tarian?: string;
  thumbnail_url: string | null;
}

export default async function SanggarPage() {
  let sanggars: Sanggar[] = [];
  let fetchError: string | null = null;

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("sanggars")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Supabase return error:", error);
      fetchError = error.message;
    } else {
      sanggars = (data as Sanggar[]) ?? [];
      
      const ae = sanggars.find(s => s.nama_sanggar === "AE Production");
      if (ae) {
        ae.thumbnail_url = "/card-1.webp";
        ae.whatsapp = "6281318702623";
        ae.youtubeUrl = "https://www.youtube.com";
      }

      // Assign images to specific Sanggar cards
      const am = sanggars.find(s => s.nama_sanggar === "AM Dance Studio");
      if (am) {
        am.thumbnail_url = "/sanggar2.webp";
        am.whatsapp = "6281289214320";
        am.youtubeUrl = "https://www.youtube.com";
      }

      const arunika = sanggars.find(s => s.nama_sanggar === "Arunika Art Production");
      if (arunika) {
        arunika.thumbnail_url = "/sanggar3.webp";
        arunika.whatsapp = "6281289214320";
        arunika.youtubeUrl = "https://www.youtube.com";
      }

      const ayodya = sanggars.find(s => s.nama_sanggar === "Ayodya Pala");
      if (ayodya) {
        ayodya.thumbnail_url = "/sanggar4.webp";
        ayodya.whatsapp = "6281399160062";
        ayodya.youtubeUrl = "https://www.youtube.com";
      }

      const citra = sanggars.find(s => s.nama_sanggar === "Citra Art Studio");
      if (citra) {
        citra.thumbnail_url = "/sanggar5.webp";
        citra.whatsapp = "6281289214320";
        citra.youtubeUrl = "https://www.youtube.com";
      }

      const daya = sanggars.find(s => s.nama_sanggar === "Daya Presta");
      if (daya) {
        daya.thumbnail_url = "/sanggar6.webp";
        daya.whatsapp = "6281289214320";
        daya.youtubeUrl = "https://www.youtube.com";
      }
    }
  } catch (err: any) {
    console.error("Supabase fetch error:", err);
    fetchError = err?.message || "Unknown exception occurred during fetch.";
  }

  return <SanggarCatalog sanggars={sanggars} fetchError={fetchError} />;
}