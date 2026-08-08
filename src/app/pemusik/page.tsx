import { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import PemusikCatalog from "./PemusikCatalog";

export const metadata: Metadata = {
  title: "Pemusik — Katalog Seni DKI Jakarta",
  description:
    "Temukan pemusik tradisional Jakarta — gambang kromong, tanjidor, dan lainnya. Profil lengkap dengan spesialisasi dan kontak.",
};

export const dynamic = "force-dynamic";

interface Pemusik {
  id: string;
  nama: string;
  jenis: string; // "Solo" | "Komunitas"
  genre: string;
  spesialisasi: string;
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  kota_kab: string;
  no_hp: string;
  foto_url: string | null;
}

export default async function PemusikPage() {
  let pemusiks: Pemusik[] = [];
  let fetchError: string | null = null;

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("pemusiks")
      .select("*")
      .order("nama", { ascending: true });

    if (error) {
      fetchError = error.message;
    } else {
      pemusiks = (data as Pemusik[]) ?? [];
    }
  } catch (err: any) {
    fetchError = err?.message || "Unknown exception occurred during fetch.";
  }

  return <PemusikCatalog pemusiks={pemusiks} fetchError={fetchError} />;
}
