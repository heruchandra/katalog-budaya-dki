"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Music, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";
import { JAKARTA_WILAYAH, resolveWilayah } from "@/lib/wilayah";
import { SANGGAR_TABLE, SanggarRow, isDraft } from "@/lib/sanggarAdmin";
import { PemusikRow, countBy, tallyValues } from "@/lib/pemusikStats";

const GRADE_COLORS: Record<string, string> = { A: "#F7941E", B: "#E01A67" };
const SERIES_COLORS = ["#F7941E", "#E01A67", "#2B3990", "#059669", "#d97706", "#71717a"];

type AnalyticsTab = "sanggar" | "musik";

/** Horizontal bar list: label, proportional bar, count */
function BarList({ rows, emptyText }: { rows: { name: string; total: number }[]; emptyText: string }) {
  if (rows.length === 0) return <p className="mt-4 text-xs text-zinc-500">{emptyText}</p>;
  const max = Math.max(1, ...rows.map((r) => r.total));
  return (
    <ul className="mt-4 space-y-2.5">
      {rows.map((row) => (
        <li key={row.name} className="grid grid-cols-[120px_1fr_28px] items-center gap-2 text-xs">
          <span className="truncate text-zinc-600" title={row.name}>{row.name}</span>
          <span className="h-2 overflow-hidden rounded-sm bg-zinc-100">
            <span className="block h-full bg-gradient-to-r from-[#F7941E] to-[#E01A67]" style={{ width: `${(row.total / max) * 100}%` }} />
          </span>
          <span className="text-right font-semibold tabular-nums text-zinc-900">{row.total}</span>
        </li>
      ))}
    </ul>
  );
}

/** Progress rows: how many records have a field filled in */
function Completeness({ rows, total }: { rows: { label: string; n: number }[]; total: number }) {
  return (
    <ul className="mt-4 space-y-3">
      {rows.map((row) => {
        const pct = total > 0 ? Math.round((row.n / total) * 100) : 0;
        return (
          <li key={row.label}>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-600">{row.label}</span>
              <span className="font-semibold tabular-nums text-zinc-900">{row.n}/{total}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-sm bg-zinc-100" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={row.label}>
              <div className={`h-full ${pct >= 80 ? "bg-emerald-500" : pct >= 40 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${pct}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function AdminDashboard() {
  const { language } = useLanguage();
  const tr = (idText: string, enText: string) => (language === "en" ? enText : idText);

  const [sanggars, setSanggars] = useState<SanggarRow[]>([]);
  const [pemusiks, setPemusiks] = useState<PemusikRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<AnalyticsTab>("sanggar");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [s, p] = await Promise.all([supabase.from(SANGGAR_TABLE).select("*"), supabase.from("pemusiks").select("*")]);
      if (cancelled) return;
      if (s.error || p.error) setError((s.error || p.error)!.message);
      setSanggars((s.data as SanggarRow[]) || []);
      setPemusiks((p.data as PemusikRow[]) || []);
      setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const drafts = sanggars.filter(isDraft).length;
    return { total: sanggars.length, seniman: pemusiks.length, pending: drafts, verified: sanggars.length - drafts };
  }, [sanggars, pemusiks]);

  // ---- Sanggar analytics ----
  const gradeData = useMemo(() => {
    const gradeOf = (s: SanggarRow) => (s.grade || "").replace(/grade/i, "").trim().toUpperCase();
    return (["A", "B"] as const).map((g) => ({ key: g, name: `Grade ${g}`, total: sanggars.filter((s) => gradeOf(s) === g).length }));
  }, [sanggars]);

  const wilayahData = useMemo(() => {
    const counts = new Map<string, number>(JAKARTA_WILAYAH.map((w) => [w, 0]));
    let unknown = 0;
    sanggars.forEach((s) => {
      const w = resolveWilayah(s);
      if (w) counts.set(w, (counts.get(w) || 0) + 1);
      else unknown += 1;
    });
    return { rows: JAKARTA_WILAYAH.map((w) => ({ name: w as string, total: counts.get(w) || 0 })), unknown };
  }, [sanggars]);

  const sanggarCompleteness = useMemo(() => {
    const count = (fn: (s: SanggarRow) => unknown) => sanggars.filter((s) => Boolean(fn(s))).length;
    return [
      { label: tr("Foto thumbnail / logo", "Thumbnail / logo photo"), n: count((s) => s.thumbnail_url || s.logo_url) },
      { label: tr("Kontak PIC (WhatsApp)", "PIC contact (WhatsApp)"), n: count((s) => s.kontak_pic) },
      { label: tr("Alamat", "Address"), n: count((s) => s.alamat) },
      { label: tr("Wilayah diketahui", "Region known"), n: count((s) => resolveWilayah(s)) },
      { label: tr("Deskripsi profil", "Profile description"), n: count((s) => s.deskripsi) },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sanggars, language]);

  // ---- Seniman Musik analytics (the pemusiks table has no region column, so there is no per-wilayah view) ----
  const jenisData = useMemo(() => countBy(pemusiks, (p) => p.jenis_seniman), [pemusiks]);
  const genreData = useMemo(() => tallyValues(pemusiks, (p) => p.genre_musik), [pemusiks]);
  const instrumenData = useMemo(() => tallyValues(pemusiks, (p) => p.instrumen), [pemusiks]);

  const musikCompleteness = useMemo(() => {
    const count = (fn: (p: PemusikRow) => unknown) => pemusiks.filter((p) => Boolean(fn(p))).length;
    return [
      { label: tr("Jenis seniman", "Artist type"), n: count((p) => p.jenis_seniman) },
      { label: tr("Genre musik", "Music genre"), n: count((p) => p.genre_musik) },
      { label: tr("Instrumen / alat musik", "Instrument"), n: count((p) => p.instrumen) },
      { label: tr("Pengalaman", "Experience"), n: count((p) => p.pengalaman) },
      { label: tr("Deskripsi profil", "Profile description"), n: count((p) => p.deskripsi) },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pemusiks, language]);

  const recent = useMemo(() => {
    const items = [
      ...sanggars.map((s) => ({ key: `s-${s.id}`, name: s.nama_sanggar, type: "sanggar" as const, date: s.created_at, href: `/admin/sanggar/edit/${s.id}`, draft: isDraft(s) })),
      ...pemusiks.map((p) => ({ key: `p-${p.id}`, name: p.nama_seniman, type: "musik" as const, date: p.created_at, href: `/admin/pemusik/edit/${p.id}`, draft: false })),
    ];
    return items
      .filter((i) => i.date)
      .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
      .slice(0, 6);
  }, [sanggars, pemusiks]);

  const cards = [
    { label: tr("Total Sanggar", "Total Sanggar"), value: stats.total, icon: Users, accent: "#F7941E", href: "/admin/sanggar" },
    { label: tr("Total Seniman Musik", "Total Music Artists"), value: stats.seniman, icon: Music, accent: "#E01A67", href: "/admin/pemusik" },
    { label: tr("Menunggu Verifikasi", "Awaiting Verification"), value: stats.pending, icon: Clock3, accent: "#d97706", href: "/admin/sanggar?status=draft" },
    { label: tr("Terverifikasi", "Verified"), value: stats.verified, icon: CheckCircle2, accent: "#059669", href: "/admin/sanggar" },
  ];

  const panel = "rounded-sm border border-zinc-200 bg-white shadow-xs";
  const notFilled = tr("Belum ada data yang diisi.", "No data filled in yet.");

  return (
    <div className="p-5 sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{tr("Ringkasan", "Overview")}</h1>
        <p className="mt-1 text-sm text-zinc-500">{tr("Kondisi data katalog saat ini.", "The current state of the catalog data.")}</p>
      </div>

      {error && (
        <div role="alert" className="mb-5 rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {tr("Gagal memuat data: ", "Failed to load data: ")}{error}
        </div>
      )}

      {/* Stat cards: fixed-height title row + flex column, so numbers and "Lihat" links share one baseline */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className={`${panel} group relative flex h-full flex-col justify-between overflow-hidden p-5 transition-colors hover:border-zinc-300`}>
            <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: card.accent }} />
            <div className="flex h-10 items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase leading-tight tracking-wider text-zinc-500">{card.label}</p>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm" style={{ backgroundColor: `${card.accent}1A`, color: card.accent }}>
                <card.icon className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold leading-none tabular-nums text-zinc-900">{isLoading ? "–" : card.value}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-zinc-400 group-hover:text-orange-600">
              {tr("Lihat", "View")} <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>

      {/* Analytics tab switcher */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">{tr("Analitik", "Analytics")}</h2>
        <div role="tablist" aria-label={tr("Jenis data analitik", "Analytics data type")} className="flex items-center rounded-sm border border-zinc-200 bg-white p-0.5 text-sm font-semibold">
          {([
            { key: "sanggar", label: "Sanggar", count: stats.total },
            { key: "musik", label: tr("Seniman Musik", "Music Artists"), count: stats.seniman },
          ] as const).map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={tab === item.key}
              onClick={() => setTab(item.key)}
              className={`inline-flex items-center gap-2 rounded-sm px-3.5 py-1.5 transition-colors outline-none ${
                tab === item.key ? "bg-[#18191C] text-white" : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {item.label}
              <span className={`rounded-sm px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${tab === item.key ? "bg-white/15 text-white" : "bg-zinc-100 text-zinc-500"}`}>
                {item.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {tab === "sanggar" ? (
        <div role="tabpanel" className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className={`${panel} p-5`}>
            <h3 className="text-sm font-bold text-zinc-900">{tr("Sanggar per Grade", "Sanggar by Grade")}</h3>
            <div className="mt-4 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                  <CartesianGrid stroke="#e4e4e7" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                  <Tooltip cursor={{ fill: "#f4f4f5" }} contentStyle={{ border: "1px solid #e4e4e7", borderRadius: 2, fontSize: 12 }} />
                  <Bar dataKey="total" name={tr("Jumlah", "Count")} radius={[2, 2, 0, 0]} maxBarSize={72}>
                    {gradeData.map((entry) => (
                      <Cell key={entry.key} fill={GRADE_COLORS[entry.key]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`${panel} p-5`}>
            <h3 className="text-sm font-bold text-zinc-900">{tr("Sanggar per Wilayah", "Sanggar by Region")}</h3>
            <BarList rows={wilayahData.rows} emptyText={notFilled} />
            {wilayahData.unknown > 0 && (
              <p className="mt-4 border-t border-zinc-100 pt-3 text-xs text-amber-700">
                {tr(`${wilayahData.unknown} sanggar belum memiliki wilayah.`, `${wilayahData.unknown} sanggar have no region yet.`)}
              </p>
            )}
          </div>

          <div className={`${panel} p-5`}>
            <h3 className="text-sm font-bold text-zinc-900">{tr("Kelengkapan Profil Sanggar", "Sanggar Profile Completeness")}</h3>
            <Completeness rows={sanggarCompleteness} total={sanggars.length} />
          </div>
        </div>
      ) : (
        <div role="tabpanel" className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className={`${panel} p-5`}>
            <h3 className="text-sm font-bold text-zinc-900">{tr("Seniman per Jenis", "Artists by Type")}</h3>
            <div className="mt-4 h-52">
              {jenisData.length === 0 ? (
                <p className="text-xs text-zinc-500">{notFilled}</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={jenisData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                    <CartesianGrid stroke="#e4e4e7" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                    <Tooltip cursor={{ fill: "#f4f4f5" }} contentStyle={{ border: "1px solid #e4e4e7", borderRadius: 2, fontSize: 12 }} />
                    <Bar dataKey="total" name={tr("Jumlah", "Count")} radius={[2, 2, 0, 0]} maxBarSize={72}>
                      {jenisData.map((entry, i) => (
                        <Cell key={entry.name} fill={SERIES_COLORS[i % SERIES_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className={`${panel} p-5`}>
            <h3 className="text-sm font-bold text-zinc-900">{tr("Genre Musik", "Music Genres")}</h3>
            <BarList rows={genreData.slice(0, 5)} emptyText={notFilled} />
            <h3 className="mt-6 border-t border-zinc-100 pt-4 text-sm font-bold text-zinc-900">{tr("Instrumen / Alat Musik", "Instruments")}</h3>
            <BarList rows={instrumenData.slice(0, 5)} emptyText={notFilled} />
          </div>

          <div className={`${panel} p-5`}>
            <h3 className="text-sm font-bold text-zinc-900">{tr("Kelengkapan Profil Seniman", "Artist Profile Completeness")}</h3>
            <Completeness rows={musikCompleteness} total={pemusiks.length} />
          </div>
        </div>
      )}

      {/* Recently added */}
      <div className={`${panel} overflow-hidden`}>
        <div className="border-b border-zinc-200 px-5 py-4">
          <h2 className="text-sm font-bold text-zinc-900">{tr("Terbaru Ditambahkan", "Recently Added")}</h2>
        </div>
        <ul className="divide-y divide-zinc-100">
          {!isLoading && recent.length === 0 && <li className="px-5 py-8 text-center text-sm text-zinc-500">{tr("Belum ada data.", "No data yet.")}</li>}
          {recent.map((item) => (
            <li key={item.key}>
              <Link href={item.href} className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-zinc-50">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-zinc-900">{item.name}</span>
                  <span className="text-xs text-zinc-500">{item.type === "sanggar" ? "Sanggar" : tr("Seniman Musik", "Music Artist")}</span>
                </span>
                <span className="flex shrink-0 items-center gap-3">
                  {item.draft && <span className="rounded-sm bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600 ring-1 ring-inset ring-zinc-300">Draft</span>}
                  <span className="text-xs text-zinc-500">
                    {new Date(item.date!).toLocaleDateString(language === "en" ? "en-US" : "id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
