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
  nama_pimpinan: string;
  grade: string;
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  kota_kab: string;
  no_hp: string;
  jenis_tarian: string;
  foto_url: string | null;
}

export default async function SanggarPage() {
  let sanggars: Sanggar[] = [];
  let fetchError: string | null = null;

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("sanggars")
      .select("*")
      .order("nama_sanggar", { ascending: true });

    if (error) {
      fetchError = error.message;
    } else {
      sanggars = (data as Sanggar[]) ?? [];
    }
  } catch {
    fetchError =
      "Tidak dapat terhubung ke database. Pastikan konfigurasi Supabase sudah benar.";
  }

  return <SanggarCatalog sanggars={sanggars} fetchError={fetchError} />;
}
