"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ExternalLink, LayoutDashboard, Loader2, LogOut, Menu, Music, Settings, ShieldAlert, Users, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";
import { ADMIN_EMAIL, SANGGAR_TABLE } from "@/lib/sanggarAdmin";

type AuthState = "checking" | "ok" | "forbidden";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [auth, setAuth] = useState<AuthState>("checking");
  const [email, setEmail] = useState<string | null>(null);
  const [draftCount, setDraftCount] = useState<number | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const tr = (idText: string, enText: string) => (language === "en" ? enText : idText);

  // Browser-side gate only: the database must still enforce admin-only writes with Row Level Security.
  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      const userEmail = session?.user?.email ?? null;
      if (!userEmail) {
        router.replace("/login");
        return;
      }
      setEmail(userEmail);
      setAuth(userEmail === ADMIN_EMAIL ? "ok" : "forbidden");
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/login");
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [router]);

  // Notification badge: sanggar saved as draft, i.e. waiting for verification (needs the `status` column)
  useEffect(() => {
    if (auth !== "ok") return;
    let cancelled = false;
    supabase
      .from(SANGGAR_TABLE)
      .select("id", { count: "exact", head: true })
      .eq("status", "draft")
      .then(({ count, error }) => {
        if (!cancelled) setDraftCount(error ? null : count ?? 0);
      });
    return () => {
      cancelled = true;
    };
  }, [auth, pathname]);

  const navigation = [
    { name: t("adminSidebarDashboard"), href: "/admin", icon: LayoutDashboard },
    { name: t("adminSidebarSanggar"), href: "/admin/sanggar", icon: Users },
    { name: t("adminSidebarMusik"), href: "/admin/pemusik", icon: Music },
    { name: t("adminSidebarSettings"), href: "/admin/settings", icon: Settings },
  ];

  const isActive = (path: string) => (path === "/admin" ? pathname === "/admin" : pathname?.startsWith(path));

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (auth === "checking") {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 text-zinc-400">
        <Loader2 className="h-6 w-6 animate-spin" aria-label="Loading" />
      </div>
    );
  }

  if (auth === "forbidden") {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-zinc-50 px-6 text-center">
        <ShieldAlert className="h-10 w-10 text-red-500" aria-hidden="true" />
        <h1 className="text-xl font-bold text-zinc-900">{tr("Akses ditolak", "Access denied")}</h1>
        <p className="max-w-sm text-sm text-zinc-600">
          {tr(`Akun ${email} tidak memiliki hak akses admin.`, `The account ${email} does not have admin access.`)}
        </p>
        <div className="flex gap-2.5">
          <Link href="/" className="rounded-sm border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50">
            {tr("Ke Beranda", "Go to Home")}
          </Link>
          <button type="button" onClick={handleLogout} className="rounded-sm bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-deep">
            {tr("Ganti akun", "Switch account")}
          </button>
        </div>
      </div>
    );
  }

  const initial = (email || "A").charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-zinc-50 text-zinc-900">
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} aria-hidden="true" />}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col bg-[#18191C] text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative flex h-16 shrink-0 items-center justify-between px-5">
          <Link href="/admin" className="flex items-center gap-3 min-w-0">
            <Image src="/logo-disbud.webp" alt="Logo Dinas Kebudayaan DKI Jakarta" width={49} height={32} className="h-8 w-[49px] shrink-0 object-contain" />
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-sm font-bold tracking-tight text-white">Katalog Seni</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F7941E]">Admin</span>
            </span>
          </Link>
          <button type="button" className="rounded-sm p-1 text-zinc-400 hover:text-white lg:hidden" onClick={() => setSidebarOpen(false)} aria-label={tr("Tutup menu", "Close menu")}>
            <X className="h-5 w-5" />
          </button>
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-[#F7941E] via-[#E01A67] to-[#2B3990]" />
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5" aria-label={tr("Menu admin", "Admin menu")}>
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`group relative flex items-center gap-3 overflow-hidden rounded-sm px-4 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-white/[0.07] text-white" : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {active && <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[#F7941E] via-[#E01A67] to-[#2B3990]" />}
                <item.icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-[#F7941E]" : "text-zinc-500 group-hover:text-zinc-300"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-sm px-4 py-2.5 text-sm font-medium text-zinc-400 hover:bg-white/[0.04] hover:text-white transition-colors"
          >
            <LogOut className="h-[18px] w-[18px] text-zinc-500 group-hover:text-zinc-300" />
            {t("adminSidebarLogout")}
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 sm:px-6">
          <button type="button" className="rounded-sm p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 lg:hidden" onClick={() => setSidebarOpen(true)} aria-label={tr("Buka menu", "Open menu")}>
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
            {/* Quick site switcher */}
            <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-sm border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:border-orange-400 hover:text-orange-600 transition-colors">
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{tr("Lihat Website", "View Website")}</span>
            </a>

            {/* Language */}
            <div className="flex items-center rounded-sm border border-zinc-200 p-0.5 text-xs font-bold" role="group" aria-label={tr("Bahasa", "Language")}>
              {(["id", "en"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLanguage(code)}
                  aria-pressed={language === code}
                  className={`rounded-sm px-2 py-1 uppercase transition-colors ${language === code ? "bg-[#18191C] text-white" : "text-zinc-500 hover:text-zinc-900"}`}
                >
                  {code}
                </button>
              ))}
            </div>

            {/* Notifications: drafts waiting for verification */}
            <Link
              href="/admin/sanggar?status=draft"
              className="relative flex h-9 w-9 items-center justify-center rounded-sm text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
              title={
                draftCount
                  ? tr(`${draftCount} sanggar menunggu verifikasi`, `${draftCount} sanggar awaiting verification`)
                  : tr("Tidak ada notifikasi", "No notifications")
              }
              aria-label={
                draftCount
                  ? tr(`${draftCount} sanggar menunggu verifikasi`, `${draftCount} sanggar awaiting verification`)
                  : tr("Notifikasi", "Notifications")
              }
            >
              <Bell className="h-[18px] w-[18px]" />
              {draftCount ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#E01A67] px-1 text-[10px] font-bold text-white">
                  {draftCount > 99 ? "99+" : draftCount}
                </span>
              ) : null}
            </Link>

            {/* Profile */}
            <div className="flex items-center gap-2.5 border-l border-zinc-200 pl-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F7941E] via-[#E01A67] to-[#2B3990] text-sm font-bold text-white">
                {initial}
              </span>
              <span className="hidden min-w-0 leading-tight md:block">
                <span className="block text-sm font-semibold text-zinc-900">Admin</span>
                <span className="block max-w-[180px] truncate text-xs text-zinc-500">{email}</span>
              </span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-zinc-50">{children}</div>
      </div>
    </div>
  );
}
