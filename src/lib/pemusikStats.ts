/**
 * A row of the `pemusiks` table (Seniman Musik). Columns marked (migration) only exist after
 * supabase/migrations/20261013_admin_pemusik_fields.sql is run.
 */
export interface PemusikRow {
  id: number | string;
  created_at?: string;
  nama_seniman: string;
  /** Kategori: "Komunitas Musik" or "Pemusik Perorangan" (older rows: "Solo", "Komunitas"; see normalizeKategori) */
  jenis_seniman?: string | null;
  genre_musik?: string | null;
  instrumen?: string | null;
  /** Legacy single free-text experience (superseded by pengalaman_items) */
  pengalaman?: string | null;
  deskripsi?: string | null;
  // (migration)
  nama_panggung?: string | null;
  wilayah?: string | null;
  status?: string | null;
  grade?: string | null;
  tahun_berdiri?: string | null;
  jumlah_anggota?: number | null;
  ketua?: string | null;
  nama_pic?: string | null;
  jenis_musik?: string | null;
  kontak?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  instagram?: string | null;
  youtube_url?: string | null;
  tiktok?: string | null;
  facebook?: string | null;
  alamat?: string | null;
  logo_url?: string | null;
  foto_card_url?: string | null;
  galeri?: unknown;
  video_url?: string | null;
  layanan_items?: unknown;
  karya_items?: unknown;
  prestasi_items?: unknown;
  pengalaman_items?: unknown;
}

export interface CountRow {
  name: string;
  total: number;
}

const sortCounts = (counts: Map<string, number>): CountRow[] =>
  [...counts.entries()]
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));

/** Count rows by one single-valued field (e.g. jenis_seniman). Empty values are left out. */
export function countBy<T>(rows: T[], pick: (row: T) => string | null | undefined): CountRow[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const value = (pick(row) || "").trim();
    if (value) counts.set(value, (counts.get(value) || 0) + 1);
  }
  return sortCounts(counts);
}

/**
 * Count rows by a free-text field that may list several values ("Gambang Kromong, Keroncong").
 * Values are split on commas, slashes, semicolons and "&"/"dan", and matched case-insensitively.
 */
export function tallyValues<T>(rows: T[], pick: (row: T) => string | null | undefined): CountRow[] {
  const counts = new Map<string, number>();
  const display = new Map<string, string>();
  for (const row of rows) {
    const seen = new Set<string>();
    for (const part of (pick(row) || "").split(/[,;/]|\s+&\s+|\s+dan\s+/i)) {
      const value = part.trim();
      const key = value.toLowerCase();
      if (!value || seen.has(key)) continue;
      seen.add(key);
      if (!display.has(key)) display.set(key, value);
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  return sortCounts(new Map([...counts.entries()].map(([key, total]) => [display.get(key)!, total])));
}
