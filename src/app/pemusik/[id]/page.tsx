import type { Metadata } from "next";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { PemusikRow } from "@/lib/pemusikStats";
import { findMusikMaster, masterOfRow, mergeProfile, rowOfMaster } from "@/data/musikData";
import type { MusikEntity } from "@/types/musik";
import { isDraftRow } from "@/lib/pemusikData";
import MusikDetailClient from "./MusikDetailClient";

export const dynamic = "force-dynamic";

/**
 * Profile for a Seniman Musik id: master data (src/data/musikData.ts) merged with its `pemusiks` row, or a row
 * alone. Numeric ids are database rows; slugs ("betawi-section") are master-only entries. cache() shares the
 * result between generateMetadata and the page within one request.
 */
const loadProfile = cache(async (id: string): Promise<{ profile: MusikEntity | null; movedTo?: string }> => {
  let row: PemusikRow | null = null;
  if (/^\d+$/.test(id)) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data } = await supabase.from("pemusiks").select("*").eq("id", Number(id)).maybeSingle();
      row = (data as PemusikRow | null) ?? null;
    } catch {
      row = null;
    }
  } else if (findMusikMaster(id)) {
    // A master-only entry saved from the admin panel lives on as a database row: its page moved there
    try {
      const supabase = await createServerSupabaseClient();
      const { data } = await supabase.from("pemusiks").select("id, nama_seniman, status");
      const saved = rowOfMaster((data ?? []) as Pick<PemusikRow, "id" | "nama_seniman" | "status">[], id);
      if (saved) return isDraftRow(saved) ? { profile: null } : { profile: null, movedTo: `/pemusik/${saved.id}` };
    } catch {
      // the master data still shows
    }
  }
  // a draft is hidden from the public site (its master entry too), like a draft sanggar
  if (row && isDraftRow(row)) return { profile: null };
  return { profile: mergeProfile(row ? masterOfRow(row) : findMusikMaster(id), row) };
});

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { profile } = await loadProfile(id);
  if (!profile) return { title: "Seniman Musik — Katalog Seni DKI Jakarta" };
  const kind = profile.category === "komunitas" ? "Komunitas musik" : "Pemusik";
  return {
    title: `${profile.nama} — Seniman Musik | Katalog Seni DKI Jakarta`,
    description:
      profile.deskripsi[0] ||
      `${kind} tradisional Jakarta di Katalog Seni DKI Jakarta: profil, instrumen, karya unggulan, prestasi, dan kontak.`,
  };
}

export default async function MusikDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { profile, movedTo } = await loadProfile(id);
  if (movedTo) redirect(movedTo);
  if (!profile) notFound();
  return <MusikDetailClient profile={profile} />;
}
