"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Info, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";
import { PemusikRow, countBy, tallyValues } from "@/lib/pemusikStats";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

const selectClass =
  "rounded-sm border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none transition-colors focus:border-orange-600 focus:ring-1 focus:ring-orange-600";

function AdminPemusikContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language } = useLanguage();
  const tr = (idText: string, enText: string) => (language === "en" ? enText : idText);

  const [rows, setRows] = useState<PemusikRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [jenis, setJenis] = useState("all");
  const [pendingDelete, setPendingDelete] = useState<PemusikRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ kind: "success" | "error"; text: string } | null>(() =>
    searchParams.get("success") ? { kind: "success", text: tr("Data seniman berhasil disimpan.", "Artist saved.") } : null
  );

  // Clean the one-time ?success param out of the URL
  useEffect(() => {
    if (searchParams.get("success")) router.replace("/admin/pemusik", { scroll: false });
  }, [searchParams, router]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), toast.kind === "success" ? 3500 : 8000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error: fetchError } = await supabase.from("pemusiks").select("*").order("nama_seniman", { ascending: true });
      if (cancelled) return;
      if (fetchError) setError(fetchError.message);
      else setRows((data as PemusikRow[]) || []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const jenisOptions = useMemo(() => countBy(rows, (r) => r.jenis_seniman), [rows]);
  const genreCount = useMemo(() => tallyValues(rows, (r) => r.genre_musik).length, [rows]);
  const instrumenCount = useMemo(() => tallyValues(rows, (r) => r.instrumen).length, [rows]);
  const completeProfiles = useMemo(() => rows.filter((r) => r.genre_musik && r.instrumen && r.deskripsi).length, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchQuery =
        !q ||
        [row.nama_seniman, row.jenis_seniman, row.genre_musik, row.instrumen].some((v) => (v || "").toLowerCase().includes(q));
      const matchJenis = jenis === "all" || (row.jenis_seniman || "").trim() === jenis;
      return matchQuery && matchJenis;
    });
  }, [rows, query, jenis]);

  const hasFilter = Boolean(query) || jenis !== "all";

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    const { error: deleteError } = await supabase.from("pemusiks").delete().eq("id", pendingDelete.id);
    if (deleteError) {
      setToast({ kind: "error", text: tr("Gagal menghapus: ", "Delete failed: ") + deleteError.message });
    } else {
      setRows((prev) => prev.filter((r) => r.id !== pendingDelete.id));
      setToast({ kind: "success", text: tr(`"${pendingDelete.nama_seniman}" dihapus.`, `"${pendingDelete.nama_seniman}" deleted.`) });
      router.refresh();
    }
    setIsDeleting(false);
    setPendingDelete(null);
  };

  const summary = [
    { label: tr("Total Seniman", "Total Artists"), value: rows.length },
    { label: tr("Jenis Seniman", "Artist Types"), value: jenisOptions.length },
    { label: tr("Genre Tercatat", "Genres Recorded"), value: genreCount },
    { label: tr("Instrumen Tercatat", "Instruments Recorded"), value: instrumenCount },
    { label: tr("Profil Lengkap", "Complete Profiles"), value: `${completeProfiles}/${rows.length}` },
  ];

  const th = "px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-zinc-500";
  const dash = <span className="text-zinc-300">—</span>;

  return (
    <div className="p-5 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{tr("Data Seniman Musik", "Music Artist Data")}</h1>
          <p className="mt-1 text-sm text-zinc-500">{tr("Kelola profil seniman dan kelompok musik.", "Manage music artist and group profiles.")}</p>
        </div>
        <Link href="/admin/pemusik/tambah" className="inline-flex items-center justify-center gap-2 rounded-sm bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-600/20 hover:bg-brand-deep transition-all">
          <Plus className="h-4 w-4" />
          {tr("Tambah Seniman", "Add Artist")}
        </Link>
      </div>

      {/* Statistics */}
      <dl className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {summary.map((item) => (
          <div key={item.label} className="flex flex-col justify-between rounded-sm border border-zinc-200 bg-white p-4 shadow-xs">
            <dt className="flex h-8 items-center text-[11px] font-semibold uppercase leading-tight tracking-wider text-zinc-500">{item.label}</dt>
            <dd className="mt-2 text-2xl font-bold leading-none tabular-nums text-zinc-900">{loading ? "–" : item.value}</dd>
          </div>
        ))}
      </dl>

      <div className="overflow-hidden rounded-sm border border-zinc-200 bg-white shadow-xs">
        <div className="flex flex-col gap-3 border-b border-zinc-200 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 rounded-sm border border-zinc-200 bg-zinc-50 focus-within:border-orange-600 focus-within:bg-white focus-within:ring-1 focus-within:ring-orange-600">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tr("Cari nama, genre, atau instrumen…", "Search name, genre or instrument…")}
              aria-label={tr("Cari seniman", "Search artists")}
              className="w-full bg-transparent py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <select value={jenis} onChange={(e) => setJenis(e.target.value)} aria-label={tr("Filter jenis seniman", "Filter artist type")} className={selectClass}>
              <option value="all">{tr("Semua Jenis", "All Types")}</option>
              {jenisOptions.map((option) => (
                <option key={option.name} value={option.name}>{option.name} ({option.total})</option>
              ))}
            </select>
            {hasFilter && (
              <button type="button" onClick={() => { setQuery(""); setJenis("all"); }} className="inline-flex items-center gap-1 px-2 py-2 text-xs font-semibold text-zinc-500 hover:text-orange-600">
                <X className="h-3.5 w-3.5" /> Reset
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200">
            <thead className="bg-zinc-50">
              <tr>
                <th scope="col" className={th}>{tr("Nama Seniman", "Artist Name")}</th>
                <th scope="col" className={th}>{tr("Jenis", "Type")}</th>
                <th scope="col" className={th}>Genre</th>
                <th scope="col" className={th}>{tr("Instrumen", "Instrument")}</th>
                <th scope="col" className={`${th} text-right`}>{tr("Aksi", "Actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-zinc-500">{tr("Memuat data…", "Loading…")}</td></tr>
              )}
              {!loading && error && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-red-600">{tr("Gagal memuat data: ", "Failed to load: ")}{error}</td></tr>
              )}
              {!loading && !error && filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-zinc-500">
                  {hasFilter ? tr("Tidak ada seniman yang cocok dengan filter.", "No artists match these filters.") : tr("Belum ada data seniman.", "No artists yet.")}
                </td></tr>
              )}
              {!loading && !error && filtered.map((row) => (
                <tr key={row.id} className="hover:bg-zinc-50/70">
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-zinc-900">{row.nama_seniman}</p>
                    <p className="text-xs text-zinc-400">ID {row.id}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {row.jenis_seniman ? (
                      <span className="inline-flex items-center rounded-sm bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200">{row.jenis_seniman}</span>
                    ) : dash}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-600">{row.genre_musik || dash}</td>
                  <td className="px-4 py-3 text-sm text-zinc-600">{row.instrumen || dash}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link href={`/admin/pemusik/edit/${row.id}`} className="flex h-8 w-8 items-center justify-center rounded-sm text-zinc-500 hover:bg-orange-50 hover:text-orange-600" title="Edit" aria-label={`Edit ${row.nama_seniman}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button type="button" onClick={() => setPendingDelete(row)} className="flex h-8 w-8 items-center justify-center rounded-sm text-zinc-500 hover:bg-red-50 hover:text-red-600" title={tr("Hapus", "Delete")} aria-label={tr(`Hapus ${row.nama_seniman}`, `Delete ${row.nama_seniman}`)}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && !error && (
          <div className="border-t border-zinc-200 px-4 py-3 text-xs text-zinc-500">
            {tr(`Menampilkan ${filtered.length} dari ${rows.length} seniman`, `Showing ${filtered.length} of ${rows.length} artists`)}
          </div>
        )}
      </div>

      {pendingDelete && (
        <ConfirmDialog
          title={tr("Hapus seniman ini?", "Delete this artist?")}
          message={tr(
            `"${pendingDelete.nama_seniman}" akan dihapus permanen dari katalog dan situs publik. Tindakan ini tidak dapat dibatalkan.`,
            `"${pendingDelete.nama_seniman}" will be permanently removed from the catalog and the public site. This cannot be undone.`
          )}
          confirmLabel={isDeleting ? tr("Menghapus…", "Deleting…") : tr("Ya, hapus", "Yes, delete")}
          cancelLabel={tr("Batal", "Cancel")}
          isBusy={isDeleting}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      {toast && (
        <div role="status" className={`fixed bottom-6 right-6 z-[120] flex max-w-md items-start gap-3 rounded-sm px-4 py-3 text-sm font-medium text-white shadow-2xl ${toast.kind === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
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
