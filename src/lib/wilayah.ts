/** Administrative cities/regency of DKI Jakarta, in the order shown in the catalog filter. */
export const JAKARTA_WILAYAH = [
  "Jakarta Pusat",
  "Jakarta Utara",
  "Jakarta Barat",
  "Jakarta Selatan",
  "Jakarta Timur",
  "Kepulauan Seribu",
] as const;

export type Wilayah = (typeof JAKARTA_WILAYAH)[number];

/** Kecamatan -> administrative city, used when a record only names its kecamatan (or its address does). */
const KECAMATAN_TO_WILAYAH: Record<string, Wilayah> = {
  // Jakarta Pusat
  "gambir": "Jakarta Pusat", "sawah besar": "Jakarta Pusat", "kemayoran": "Jakarta Pusat", "senen": "Jakarta Pusat",
  "cempaka putih": "Jakarta Pusat", "menteng": "Jakarta Pusat", "tanah abang": "Jakarta Pusat", "johar baru": "Jakarta Pusat",
  // Jakarta Utara
  "penjaringan": "Jakarta Utara", "tanjung priok": "Jakarta Utara", "koja": "Jakarta Utara", "cilincing": "Jakarta Utara",
  "pademangan": "Jakarta Utara", "kelapa gading": "Jakarta Utara",
  // Jakarta Barat
  "cengkareng": "Jakarta Barat", "grogol petamburan": "Jakarta Barat", "taman sari": "Jakarta Barat", "tambora": "Jakarta Barat",
  "kebon jeruk": "Jakarta Barat", "kalideres": "Jakarta Barat", "palmerah": "Jakarta Barat", "kembangan": "Jakarta Barat",
  // Jakarta Selatan
  "tebet": "Jakarta Selatan", "setiabudi": "Jakarta Selatan", "mampang prapatan": "Jakarta Selatan", "pasar minggu": "Jakarta Selatan",
  "kebayoran lama": "Jakarta Selatan", "cilandak": "Jakarta Selatan", "kebayoran baru": "Jakarta Selatan", "pancoran": "Jakarta Selatan",
  "jagakarsa": "Jakarta Selatan", "pesanggrahan": "Jakarta Selatan",
  // Jakarta Timur
  "matraman": "Jakarta Timur", "pulo gadung": "Jakarta Timur", "pulogadung": "Jakarta Timur", "jatinegara": "Jakarta Timur",
  "kramat jati": "Jakarta Timur", "pasar rebo": "Jakarta Timur", "cakung": "Jakarta Timur", "duren sawit": "Jakarta Timur",
  "makasar": "Jakarta Timur", "ciracas": "Jakarta Timur", "cipayung": "Jakarta Timur",
  // Kepulauan Seribu
  "kepulauan seribu utara": "Kepulauan Seribu", "kepulauan seribu selatan": "Kepulauan Seribu",
};

/**
 * Wilayah of sanggar whose curated detail profile (src/app/sanggar/[id]/page.tsx) states it.
 * Keep in sync with SPECIFIC_PROFILES there until the database has its own wilayah column.
 */
const CURATED_WILAYAH_BY_ID: Record<string, Wilayah> = {
  "sinar-norray": "Jakarta Timur",
  "1": "Jakarta Timur",
  "7": "Jakarta Pusat",
  "17": "Jakarta Selatan",
  "21": "Jakarta Selatan",
  "40": "Jakarta Timur",
};

const matchCity = (text: string): Wilayah | null => {
  const t = text.toLowerCase();
  if (t.includes("kepulauan seribu") || t.includes("pulau seribu")) return "Kepulauan Seribu";
  return JAKARTA_WILAYAH.find((w) => t.includes(w.toLowerCase())) ?? null;
};

const matchKecamatan = (text: string): Wilayah | null => {
  const t = ` ${text.toLowerCase().replace(/[^a-z0-9]+/g, " ")} `;
  for (const [kecamatan, wilayah] of Object.entries(KECAMATAN_TO_WILAYAH)) {
    if (t.includes(` ${kecamatan} `)) return wilayah;
  }
  return null;
};

type WilayahSource = {
  id?: string | number;
  wilayah?: string | null;
  city?: string | null;
  kota_kab?: string | null;
  kecamatan?: string | null;
  alamat?: string | null;
  alamat_tempat_latihan?: string | null;
};

/**
 * Resolve a sanggar's administrative city from real data only. Returns null when nothing identifies it:
 * callers should show a neutral label, never a guessed city.
 * Order: explicit wilayah/city/kota_kab field, curated profile, kecamatan field, then address text.
 */
export function resolveWilayah(s: WilayahSource): Wilayah | null {
  for (const field of [s.wilayah, s.city, s.kota_kab]) {
    if (field) {
      const hit = matchCity(field);
      if (hit) return hit;
    }
  }
  const curated = s.id !== undefined ? CURATED_WILAYAH_BY_ID[String(s.id)] : undefined;
  if (curated) return curated;
  if (s.kecamatan) {
    const hit = matchKecamatan(s.kecamatan);
    if (hit) return hit;
  }
  for (const address of [s.alamat, s.alamat_tempat_latihan]) {
    if (address) {
      const hit = matchCity(address) ?? matchKecamatan(address);
      if (hit) return hit;
    }
  }
  return null;
}
