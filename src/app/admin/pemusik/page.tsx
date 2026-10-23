"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Eye, ImageOff, Info, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";
import { JAKARTA_WILAYAH, resolveWilayah } from "@/lib/wilayah";
import { MUSIK_MASTER_DATA, claimedMasterIds, findMusikMaster, masterOfRow, mergeProfile, waNumberOf } from "@/data/musikData";
import { KATEGORI_OF, normalizeKategori } from "@/lib/pemusikData";
import {
  KATEGORI_MUSIK_OPTIONS,
  PEMUSIK_MIGRATION_COLUMNS,
  PEMUSIK_TABLE,
  PemusikRow,
  deletePemusik,
  isDraftRow,
} from "@/lib/pemusikAdmin";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

const selectClass =
  "rounded-sm border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none transition-colors focus:border-orange-600 focus:ring-1 focus:ring-orange-600";

/** "6285939836744" → "+62 859-3983-6744" */
const formatWa = (wa: string) => {
  const rest = wa.replace(/^62/, "");
  return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 7)}-${rest.slice(7)}`.replace(/-$/, "");
};

/** One row of the list: a database row (merged with its master data, as on the public site) or a master-only entry */
interface ListItem {
  key: string;
  id: string;
  /** The database row, or null for an entry that only exists in src/data/musikData.ts (read-only here) */
  row: PemusikRow | null;
  nama: string;
  namaPanggung?: string;
  kategori: string;
  wilayah: string | null;
  cover?: string;
  ketua?: string;
  pic?: string;
  wa: string;
  draft: boolean;
  searchText: string;
}

function toListItem(row: PemusikRow | null, masterId?: string): ListItem | null {
  const id = row ? String(row.id) : masterId!;
  const profile = mergeProfile(row ? masterOfRow(row) : findMusikMaster(id), row);
  if (!profile) return null;
  // the same two categories as the public catalog (older stored values are mapped onto them)
  const kategori = row ? normalizeKategori(row.jenis_seniman) || KATEGORI_OF[profile.category] : KATEGORI_OF[profile.category];
  const wilayah = profile.wilayah ?? resolveWilayah({ alamat: profile.alamat });
  const cover = profile.fotoProfil ?? (profile.isDummyMedia ? undefined : profile.fotoCard ?? profile.fotoGallery.find((p) => !p.pending)?.url);
  return {
    key: row ? `row-${id}` : `master-${id}`,
    id,
    row,
    nama: profile.nama,
    namaPanggung: profile.namaPanggung,
    kategori,
    wilayah,
    cover,
    ketua: profile.ketua,
    pic: profile.pic,
    wa: waNumberOf(profile),
    draft: row ? isDraftRow(row) : false,
    searchText: [profile.nama, profile.namaPanggung, kategori, wilayah, profile.ketua, profile.pic, profile.nomorKontak.join(" "), profile.email, profile.alamat, profile.genre.join(" "), profile.jenisMusik.join(" "), profile.instrumen.join(" ")]
      .filter(Boolean)
      .join(" \n ")
      .toLowerCase(),
  };
}

/** Status filter value from the URL's ?status= ("all" when absent or unknown) */
const statusFromUrl = (value: string | null) => (value === "draft" || value === "terverifikasi" ? value : "all");

function AdminPemusikContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language } = useLanguage();
  const tr = (idText: string, enText: string) => (language === "en" ? enText : idText);

  const [rows, setRows] = useState<PemusikRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [kategori, setKategori] = useState("all");
  const [wilayah, setWilayah] = useState("all");
  // The status filter lives in the URL (?status=draft | terverifikasi): a link to it, such as the header
  // notifications, applies it even while this list is already open (adjusted while rendering when the URL changes),
  // and the select writes it back
  const statusParam = statusFromUrl(searchParams.get("status"));
  const [status, setStatus] = useState(statusParam);
  const [seenStatusParam, setSeenStatusParam] = useState(statusParam);
  if (seenStatusParam !== statusParam) {
    setSeenStatusParam(statusParam);
    setStatus(statusParam);
  }
  const changeStatus = (value: string) => {
    setStatus(value);
    router.replace(value === "all" ? "/admin/pemusik" : `/admin/pemusik?status=${value}`, { scroll: false });
  };
  const [pendingDelete, setPendingDelete] = useState<ListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // Success / skipped-columns message when arriving back from the form (?success=1&skipped=a,b)
  const [toast, setToast] = useState<{ kind: "success" | "info" | "error"; text: string } | null>(() => {
    if (!searchParams.get("success")) return null;
    const skippedLabels = (searchParams.get("skipped") || "").split(",").filter(Boolean).map((c) => PEMUSIK_MIGRATION_COLUMNS[c] || c);
    return skippedLabels.length > 0
      ? {
          kind: "info",
          text: tr(
            `Data tersimpan, kecuali: ${skippedLabels.join(", ")} (kolom belum ada di database, jalankan migrasi).`,
            `Saved, except: ${skippedLabels.join(", ")} (columns missing in the database, run the migration).`
          ),
        }
      : { kind: "success", text: tr("Data seniman musik berhasil disimpan.", "Music artist saved.") };
  });

  // Clean the one-time query params out of the URL
  useEffect(() => {
    if (searchParams.get("success")) router.replace("/admin/pemusik", { scroll: false });
  }, [searchParams, router]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), toast.kind === "success" ? 3500 : 9000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error: fetchError } = await supabase.from(PEMUSIK_TABLE).select("*").order("nama_seniman", { ascending: true });
      if (cancelled) return;
      if (fetchError) setError(fetchError.message);
      else setRows((data as PemusikRow[]) || []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasStatusColumn = rows.length > 0 && "status" in rows[0];

  // Database rows, plus master-data entries that have no row yet (editing one saves it as a new row)
  const items = useMemo(() => {
    const claimed = claimedMasterIds(rows);
    const fromRows = rows.map((row) => toListItem(row));
    const masterOnly = MUSIK_MASTER_DATA.filter((m) => !claimed.has(m.id)).map((m) => toListItem(null, m.id));
    return [...fromRows, ...masterOnly].filter((i): i is ListItem => i !== null).sort((a, b) => a.nama.localeCompare(b.nama));
  }, [rows]);

  const filtered = useMemo(() => {
    // Case-insensitive; every word typed must appear somewhere in the item's searchable text
    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return items.filter((item) => {
      const matchQuery = words.every((word) => item.searchText.includes(word));
      const matchKategori = kategori === "all" || item.kategori === kategori;
      const matchWilayah = wilayah === "all" || item.wilayah === wilayah;
      const matchStatus = status === "all" || (status === "draft" ? item.draft : !item.draft);
      return matchQuery && matchKategori && matchWilayah && matchStatus;
    });
  }, [items, query, kategori, wilayah, status]);

  const hasFilter = Boolean(query) || kategori !== "all" || wilayah !== "all" || status !== "all";

  const confirmDelete = async () => {
    if (!pendingDelete?.row) return;
    setIsDeleting(true);
    try {
      await deletePemusik(pendingDelete.row.id);
      setRows((prev) => prev.filter((r) => r.id !== pendingDelete.row!.id));
      setToast({ kind: "success", text: tr(`"${pendingDelete.nama}" dihapus.`, `"${pendingDelete.nama}" deleted.`) });
      router.refresh();
    } catch (err) {
      setToast({ kind: "error", text: tr("Gagal menghapus: ", "Delete failed: ") + (err instanceof Error ? err.message : "") });
    } finally {
      setIsDeleting(false);
      setPendingDelete(null);
    }
  };

  const th = "px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-zinc-500";
  const dash = <span className="text-zinc-300">—</span>;

  return (
    <div className="p-5 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{tr("Data Seniman Musik", "Music Artist Data")}</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {tr("Kelola profil, kontak, media, dan galeri setiap seniman dan komunitas musik.", "Manage each music artist's and community's profile, contacts, media and gallery.")}
          </p>
        </div>
        <Link href="/admin/pemusik/tambah" className="inline-flex items-center justify-center gap-2 rounded-sm bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-600/20 hover:bg-brand-deep transition-all">
          <Plus className="h-4 w-4" />
          {tr("Tambah Seniman Musik", "Add Music Artist")}
        </Link>
      </div>

      <div className="overflow-hidden rounded-sm border border-zinc-200 bg-white shadow-xs">
        {/* Filter & search bar */}
        <div className="flex flex-col gap-3 border-b border-zinc-200 p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1 rounded-sm border border-zinc-200 bg-zinc-50 focus-within:border-orange-600 focus-within:bg-white focus-within:ring-1 focus-within:ring-orange-600">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tr("Cari nama, ketua/PIC, kontak, instrumen, alamat…", "Search name, leader/PIC, contact, instrument, address…")}
              aria-label={tr("Cari seniman musik", "Search music artists")}
              className="w-full bg-transparent py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select value={kategori} onChange={(e) => setKategori(e.target.value)} aria-label={tr("Filter kategori", "Filter category")} className={selectClass}>
              <option value="all">{tr("Semua Kategori", "All Categories")}</option>
              {KATEGORI_MUSIK_OPTIONS.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            <select value={wilayah} onChange={(e) => setWilayah(e.target.value)} aria-label={tr("Filter wilayah", "Filter region")} className={selectClass}>
              <option value="all">{tr("Semua Wilayah", "All Regions")}</option>
              {JAKARTA_WILAYAH.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
            <select value={status} onChange={(e) => changeStatus(e.target.value)} aria-label="Filter status" className={selectClass} disabled={!hasStatusColumn} title={hasStatusColumn ? undefined : tr("Perlu migrasi database", "Needs the database migration")}>
              <option value="all">{tr("Semua Status", "All Statuses")}</option>
              <option value="terverifikasi">{tr("Terverifikasi", "Verified")}</option>
              <option value="draft">Draft</option>
            </select>
            {hasFilter && (
              <button type="button" onClick={() => { setQuery(""); setKategori("all"); setWilayah("all"); changeStatus("all"); }} className="inline-flex items-center gap-1 px-2 py-2 text-xs font-semibold text-zinc-500 hover:text-orange-600">
                <X className="h-3.5 w-3.5" /> Reset
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200">
            <thead className="bg-zinc-50">
              <tr>
                <th scope="col" className={th}>{tr("Seniman / Komunitas", "Artist / Community")}</th>
                <th scope="col" className={th}>{tr("Kategori", "Category")}</th>
                <th scope="col" className={th}>{tr("Wilayah", "Region")}</th>
                <th scope="col" className={th}>{tr("Ketua / PIC", "Leader / PIC")}</th>
                <th scope="col" className={th}>WhatsApp</th>
                <th scope="col" className={th}>Status</th>
                <th scope="col" className={`${th} text-right`}>{tr("Aksi", "Actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-zinc-500">{tr("Memuat data…", "Loading…")}</td></tr>
              )}
              {!loading && error && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-red-600">{tr("Gagal memuat data: ", "Failed to load: ")}{error}</td></tr>
              )}
              {!loading && !error && filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-zinc-500">
                  {hasFilter ? tr("Tidak ada seniman musik yang cocok dengan filter.", "No music artists match these filters.") : tr("Belum ada data seniman musik.", "No music artists yet.")}
                </td></tr>
              )}
              {!loading && !error && filtered.map((item) => (
                <tr key={item.key} className="hover:bg-zinc-50/70">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 text-zinc-300">
                        {item.cover ? <img src={item.cover} alt="" className="h-full w-full object-cover" /> : <ImageOff className="h-4 w-4" aria-hidden="true" />}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-zinc-900">{item.nama}</p>
                        <p className="truncate text-xs text-zinc-400">
                          {item.row ? `ID ${item.id}` : tr("Data bawaan", "Built-in data")}
                          {item.namaPanggung && <> • {item.namaPanggung}</>}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {item.kategori !== "—" ? (
                      <span className="inline-flex items-center rounded-sm bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200">{item.kategori}</span>
                    ) : dash}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-600">{item.wilayah || dash}</td>
                  <td className="px-4 py-3 text-sm text-zinc-600">
                    {item.ketua || item.pic ? (
                      <div className="min-w-0">
                        <p className="truncate font-medium text-zinc-800">{item.ketua || item.pic}</p>
                        {item.ketua && item.pic && item.pic !== item.ketua && <p className="truncate text-xs text-zinc-500">PIC: {item.pic}</p>}
                      </div>
                    ) : dash}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    {item.wa ? (
                      <a href={`https://wa.me/${item.wa}`} target="_blank" rel="noopener noreferrer" className="font-medium text-emerald-700 tabular-nums hover:underline">
                        {formatWa(item.wa)}
                      </a>
                    ) : dash}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-semibold ${
                      item.draft ? "bg-zinc-100 text-zinc-600 ring-1 ring-inset ring-zinc-300" : "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                    }`}>
                      {item.draft ? "Draft" : tr("Terverifikasi", "Verified")}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <a href={`/pemusik/${item.id}`} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-sm text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900" title={tr("Lihat halaman publik", "View public page")} aria-label={tr(`Lihat ${item.nama}`, `View ${item.nama}`)}>
                        <Eye className="h-4 w-4" />
                      </a>
                      {item.row ? (
                        <>
                          <Link href={`/admin/pemusik/edit/${item.id}`} className="flex h-8 w-8 items-center justify-center rounded-sm text-zinc-500 hover:bg-orange-50 hover:text-orange-600" title="Edit" aria-label={`Edit ${item.nama}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button type="button" onClick={() => setPendingDelete(item)} className="flex h-8 w-8 items-center justify-center rounded-sm text-zinc-500 hover:bg-red-50 hover:text-red-600" title={tr("Hapus", "Delete")} aria-label={tr(`Hapus ${item.nama}`, `Delete ${item.nama}`)}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        // built-in profile (src/data/musikData.ts) without a row yet: the form opens it with that data and
                        // saving stores it as a new row, which takes its place here and on the public site
                        <Link
                          href={`/admin/pemusik/edit/${item.id}`}
                          className="flex h-8 w-8 items-center justify-center rounded-sm text-zinc-500 hover:bg-orange-50 hover:text-orange-600"
                          title={tr("Edit (profil bawaan; tersimpan ke database saat disimpan)", "Edit (built-in profile; stored in the database on save)")}
                          aria-label={`Edit ${item.nama}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && !error && (
          <div className="border-t border-zinc-200 px-4 py-3 text-xs text-zinc-500">
            {tr(`Menampilkan ${filtered.length} dari ${items.length} seniman musik`, `Showing ${filtered.length} of ${items.length} music artists`)}
          </div>
        )}
      </div>

      {pendingDelete && (
        <ConfirmDialog
          title={tr("Hapus seniman musik ini?", "Delete this music artist?")}
          message={tr(
            `"${pendingDelete.nama}" akan dihapus permanen dari katalog dan situs publik. Tindakan ini tidak dapat dibatalkan.`,
            `"${pendingDelete.nama}" will be permanently removed from the catalog and the public site. This cannot be undone.`
          )}
          confirmLabel={isDeleting ? tr("Menghapus…", "Deleting…") : tr("Ya, hapus", "Yes, delete")}
          cancelLabel={tr("Batal", "Cancel")}
          isBusy={isDeleting}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      {toast && (
        <div role="status" className={`fixed bottom-6 right-6 z-[120] flex max-w-md items-start gap-3 rounded-sm px-4 py-3 text-sm font-medium text-white shadow-2xl ${
          toast.kind === "success" ? "bg-emerald-600" : toast.kind === "info" ? "bg-amber-600" : "bg-red-600"
        }`}>
          {toast.kind === "success" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <Info className="mt-0.5 h-4 w-4 shrink-0" />}
          <span>{toast.text}</span>
          <button type="button" onClick={() => setToast(null)} className="ml-1 shrink-0 opacity-80 hover:opacity-100" aria-label={tr("Tutup", "Close")}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminPemusikList() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-zinc-500">Memuat data…</div>}>
      <AdminPemusikContent />
    </Suspense>
  );
}
