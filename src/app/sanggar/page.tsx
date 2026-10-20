import { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { curatedPhoneOf, findCuratedProfile } from "@/data/sanggarProfiles";
import { ownCardImage } from "@/lib/sanggarImages";
import { toWaNumber } from "@/lib/phone";
import SanggarCatalog from "./SanggarCatalog";

export const metadata: Metadata = {
  title: "Sanggar Tari — Katalog Seni DKI Jakarta",
  description:
    "Temukan sanggar tari tradisional bersertifikat Grade A dan Grade B di Jakarta. Profil lengkap dengan galeri foto dan kontak langsung.",
};

export const dynamic = "force-dynamic";

export interface Sanggar {
  id: string;
  nama_sanggar: string;
  grade?: string;
  alamat?: string;
  kelurahan?: string;
  kecamatan?: string;
  kota_kab?: string;
  kontak_pic?: string;
  /** WhatsApp digits (62…) on record for this sanggar; no button without one */
  whatsapp?: string;
  instagram?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  jenis_tarian?: string;
  thumbnail_url: string | null;
  // Admin-managed columns (some only exist after the 20260930 migration)
  logo_url?: string | null;
  wilayah?: string | null;
  status?: string | null;
  youtube_url?: string | null;
}

interface SanggarPageProps {
  searchParams?: Promise<{ q?: string }> | { q?: string };
}

/** A link only when it points at a channel (a bare youtube.com address is a placeholder) */
const channelUrl = (url?: string | null) => (url && !/^https?:\/\/(www\.)?youtube\.com\/?$/i.test(url) ? url : undefined);

const instagramLink = (value?: string | null) =>
  value ? (value.startsWith("http") ? value : `https://instagram.com/${value.replace("@", "")}`) : undefined;

/**
 * A database row as its catalog card shows it: what the admin has saved first, then the sanggar's curated profile
 * (src/data/sanggarProfiles.ts, the same source as its detail page) and its own card photo. Nothing is borrowed from
 * another sanggar and nothing is made up: a contact that isn't on record hides its button.
 */
function toCatalogEntry(row: Sanggar): Sanggar {
  const curated = findCuratedProfile(String(row.id), row.nama_sanggar);
  return {
    ...row,
    grade: row.grade || curated?.grade?.replace(/grade/i, "").trim() || undefined,
    alamat: row.alamat || curated?.alamatSanggar || undefined,
    thumbnail_url: row.thumbnail_url || row.logo_url || ownCardImage(row.nama_sanggar) || null,
    whatsapp: toWaNumber(row.kontak_pic) || toWaNumber(curatedPhoneOf(curated)) || undefined,
    youtubeUrl: channelUrl(row.youtube_url) || channelUrl(curated?.youtubeUrl) || channelUrl(curated?.contacts?.youtube),
    instagramUrl: instagramLink(row.instagram) || instagramLink(curated?.instagramUrl || curated?.contacts?.instagram || curated?.kontak?.instagram),
  };
}

export default async function SanggarPage({ searchParams }: SanggarPageProps) {
  let sanggars: Sanggar[] = [];
  let fetchError: string | null = null;
  const resolvedParams = searchParams ? await searchParams : {};
  const initialQuery = resolvedParams?.q || "";

  try {
    // Validate environment variables before attempting connection
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase env vars missing:", {
        NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? "SET" : "MISSING",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          ? "SET"
          : "MISSING",
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
          ? "SET"
          : "MISSING",
      });
      fetchError =
        "Konfigurasi database belum lengkap. Hubungi administrator.";
    } else {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("sanggars")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Supabase Query Error Details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        fetchError = error.message || "Gagal mengambil data sanggar.";
      } else {
        // Exactly the verified rows the admin dashboard counts: drafts are hidden from the public catalog, and no
        // sanggar is added that isn't in the database
        sanggars = ((data as Sanggar[]) ?? []).filter((s) => s.status !== "draft").map(toCatalogEntry);
      }
    }
  } catch (err: unknown) {
    const errMsg =
      err instanceof Error ? err.message : String(err);
    console.error("Unexpected fetch exception:", errMsg, err);
    fetchError = errMsg || "Terjadi kesalahan koneksi ke server database.";
  }

  return <SanggarCatalog sanggars={sanggars} fetchError={fetchError} initialQuery={initialQuery} />;
}
