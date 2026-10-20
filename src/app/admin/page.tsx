"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Music, Users } from "lucide-react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";
import { JAKARTA_WILAYAH, resolveWilayah } from "@/lib/wilayah";
import { SANGGAR_TABLE, SanggarRow, isDraft } from "@/lib/sanggarAdmin";
import { PemusikRow, tallyValues } from "@/lib/pemusikStats";
import { KATEGORI_MUSIK_OPTIONS, KATEGORI_OF, isDraftRow } from "@/lib/pemusikData";
import { curatedPhoneOf, findCuratedProfile } from "@/data/sanggarProfiles";
import { ownCardImage } from "@/lib/sanggarImages";
import { toWaNumber } from "@/lib/phone";
import { MUSIK_MASTER_DATA, findMusikMaster, mergeProfile } from "@/data/musikData";
import type { MusikEntity } from "@/types/musik";

// recharts is heavy: load the chart after the stat cards render (grey placeholder meanwhile)
const SimpleBarChart = dynamic(() => import("@/components/admin/SimpleBarChart"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-sm bg-zinc-100" />,
});

const GRADE_COLORS: Record<string, string> = { A: "#F7941E", B: "#E01A67" };
const OTHER_GRADE_COLORS = ["#2B3990", "#71717a", "#059669"];
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

  // Seniman Musik as the public catalog (/pemusik) lists them: every pemusiks row merged with its master data, plus
  // the master-only entries of src/data/musikData.ts (e.g. Komunitas Betawi Section) that have no row yet
  const musikProfiles = useMemo<MusikEntity[]>(() => {
    const rowIds = new Set(pemusiks.map((row) => String(row.id)));
    return [
      ...MUSIK_MASTER_DATA.filter((m) => !rowIds.has(m.id)),
      ...pemusiks.map((row) => mergeProfile(findMusikMaster(String(row.id)), row)!),
    ];
  }, [pemusiks]);

  const stats = useMemo(() => {
    const sanggarDrafts = sanggars.filter(isDraft).length;
    // a master-only entry (no row yet) is public, so it counts as verified
    const musikDrafts = pemusiks.filter(isDraftRow).length;
    return {
      total: sanggars.length,
      seniman: musikProfiles.length,
      pending: { sanggar: sanggarDrafts, musik: musikDrafts },
      verified: { sanggar: sanggars.length - sanggarDrafts, musik: musikProfiles.length - musikDrafts },
    };
  }, [sanggars, pemusiks, musikProfiles]);

  // ---- Sanggar analytics ----
  const gradeData = useMemo(() => {
    const gradeOf = (s: SanggarRow) => (s.grade || "").replace(/grade/i, "").trim().toUpperCase();
    const others = [...new Set(sanggars.map(gradeOf).filter((g) => g && g !== "A" && g !== "B"))].sort();
    const rows = ["A", "B", ...others].map((g, i) => ({
      key: g,
      name: `Grade ${g}`,
      total: sanggars.filter((s) => gradeOf(s) === g).length,
      fill: GRADE_COLORS[g] || OTHER_GRADE_COLORS[(i - 2) % OTHER_GRADE_COLORS.length],
    }));
    return { rows, ungraded: sanggars.filter((s) => !gradeOf(s)).length };
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
    const withProfile = sanggars.map((s) => ({ s, curated: findCuratedProfile(String(s.id), s.nama_sanggar) }));
    const count = (fn: (p: (typeof withProfile)[number]) => unknown) => withProfile.filter((p) => Boolean(fn(p))).length;
    return [
      { label: tr("Foto thumbnail / logo", "Thumbnail / logo photo"), n: count(({ s }) => s.thumbnail_url || s.logo_url || ownCardImage(s.nama_sanggar)) },
      // a usable number only (9+ digits), as the public WhatsApp button
      { label: tr("Kontak PIC (WhatsApp)", "PIC contact (WhatsApp)"), n: count(({ s, curated }) => toWaNumber(s.kontak_pic || undefined) || toWaNumber(curatedPhoneOf(curated))) },
      { label: tr("Alamat", "Address"), n: count(({ s, curated }) => s.alamat || curated?.alamatSanggar) },
      { label: tr("Wilayah diketahui", "Region known"), n: count(({ s }) => resolveWilayah(s)) },
      { label: tr("Deskripsi profil", "Profile description"), n: count(({ s, curated }) => s.deskripsi || curated?.description?.length) },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sanggars, language]);

  // ---- Seniman Musik analytics, over the same profiles as the public catalog ----
  // both categories always get a bar (also at 0), the larger first
  const jenisData = useMemo(
    () =>
      KATEGORI_MUSIK_OPTIONS.map((kategori) => ({ name: kategori, total: musikProfiles.filter((m) => KATEGORI_OF[m.category] === kategori).length }))
        .sort((a, b) => b.total - a.total),
    [musikProfiles]
  );
  const genreData = useMemo(() => tallyValues(musikProfiles, (m) => m.genre.join(",")), [musikProfiles]);
  const instrumenData = useMemo(() => tallyValues(musikProfiles, (m) => m.instrumen.join(",")), [musikProfiles]);

  const musikCompleteness = useMemo(() => {
    const count = (fn: (m: MusikEntity) => boolean) => musikProfiles.filter(fn).length;
    return [
      { label: tr("Jenis seniman", "Artist type"), n: count((m) => Boolean(m.category)) },
      { label: tr("Genre musik", "Music genre"), n: count((m) => m.genre.length > 0) },
      { label: tr("Instrumen / alat musik", "Instrument"), n: count((m) => m.instrumen.length > 0) },
      { label: tr("Pengalaman", "Experience"), n: count((m) => m.pengalamanBerkesenian.length > 0) },
      { label: tr("Deskripsi profil", "Profile description"), n: count((m) => m.deskripsi.length > 0) },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musikProfiles, language]);

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
    {
      label: tr("Menunggu Verifikasi", "Awaiting Verification"),
      value: stats.pending.sanggar + stats.pending.musik,
      detail: tr(`${stats.pending.sanggar} sanggar · ${stats.pending.musik} seniman musik`, `${stats.pending.sanggar} sanggar · ${stats.pending.musik} music artists`),
      icon: Clock3,
      accent: "#d97706",
      // the list holding the drafts (sanggar first)
      href: stats.pending.sanggar === 0 && stats.pending.musik > 0 ? "/admin/pemusik?status=draft" : "/admin/sanggar?status=draft",
    },
    {
      label: tr("Terverifikasi", "Verified"),
      value: stats.verified.sanggar + stats.verified.musik,
      detail: tr(`${stats.verified.sanggar} sanggar · ${stats.verified.musik} seniman musik`, `${stats.verified.sanggar} sanggar · ${stats.verified.musik} music artists`),
      icon: CheckCircle2,
      accent: "#059669",
      href: "/admin/sanggar",
    },
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
            {"detail" in card && !isLoading && <p className="mt-1.5 text-[11px] font-medium text-zinc-500">{card.detail}</p>}
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
              <SimpleBarChart data={gradeData.rows.map((d) => ({ name: d.name, total: d.total, fill: d.fill }))} countLabel={tr("Jumlah", "Count")} />
            </div>
            {gradeData.ungraded > 0 && (
              <p className="mt-3 text-xs text-zinc-500">
                {tr(`${gradeData.ungraded} sanggar belum memiliki grade.`, `${gradeData.ungraded} sanggar have no grade yet.`)}
              </p>
            )}
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
              {jenisData.every((d) => d.total === 0) ? (
                <p className="text-xs text-zinc-500">{notFilled}</p>
              ) : (
                <SimpleBarChart data={jenisData.map((d, i) => ({ name: d.name, total: d.total, fill: SERIES_COLORS[i % SERIES_COLORS.length] }))} countLabel={tr("Jumlah", "Count")} />
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
            <Completeness rows={musikCompleteness} total={musikProfiles.length} />
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
