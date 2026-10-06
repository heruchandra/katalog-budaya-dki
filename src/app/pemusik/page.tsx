import { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { PemusikRow } from "@/lib/pemusikStats";
import { buildMusikCatalog } from "@/data/musikData";
import PemusikCatalog from "./PemusikCatalog";

export const metadata: Metadata = {
  title: "Seniman Musik — Katalog Seni DKI Jakarta",
  description:
    "Temukan komunitas dan pemusik tradisional Jakarta — gambang kromong, tanjidor, dan lainnya. Profil lengkap dengan instrumen, karya unggulan, prestasi, dan kontak.",
};

export const dynamic = "force-dynamic";

export default async function PemusikPage() {
  let rows: PemusikRow[] = [];
  let fetchError: string | null = null;

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("pemusiks")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      fetchError = error.message;
    } else {
      rows = (data as PemusikRow[]) ?? [];
    }
  } catch (err: unknown) {
    fetchError = err instanceof Error ? err.message : "Unknown exception occurred during fetch.";
  }

  // Database rows merged with the master data (src/data/musikData.ts), plus master entries not in the database
  return <PemusikCatalog items={fetchError ? [] : buildMusikCatalog(rows)} fetchError={fetchError} />;
}
