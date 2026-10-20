"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ExternalLink, LayoutDashboard, Loader2, LogOut, Menu, Music, Settings, Users, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";
import { SANGGAR_TABLE } from "@/lib/sanggarAdmin";
import { fetchProfileRole, isAdminRole, UNAUTHORIZED_REDIRECT } from "@/lib/auth";
import type { User } from "@supabase/supabase-js";
import ProfileDropdown from "@/components/ProfileDropdown";
import NotificationMenu, { type PendingItem } from "@/components/admin/NotificationMenu";
import { profileAvatar, profileName } from "@/lib/profileActions";

type AuthState = "checking" | "ok";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [auth, setAuth] = useState<AuthState>("checking");
  const [email, setEmail] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  // drafts waiting for verification (sanggar + seniman musik); null while loading or when they can't be read
  const [pending, setPending] = useState<PendingItem[] | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const tr = (idText: string, enText: string) => (language === "en" ? enText : idText);

  // Role gate: public.profiles.role must be 'admin'. Read again on every route change inside /admin, so a role
  // changed in Supabase takes effect on the next navigation even when the page comes from the router cache (the
  // /admin proxy does the same check on the server). The database must still enforce admin-only writes with RLS.
  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const sessionUser = session?.user ?? null;
      if (cancelled) return;
      if (!sessionUser) {
        router.replace("/login");
        return;
      }
      const role = await fetchProfileRole(supabase, sessionUser.id);
      if (cancelled) return;
      if (!isAdminRole(role)) {
        router.replace(UNAUTHORIZED_REDIRECT);
        return;
      }
      setEmail(sessionUser.email ?? null);
      setUser(sessionUser);
      setAuth("ok");
    });
    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/login");
      else setUser(session.user);
    });
    return () => subscription.unsubscribe();
  }, [router]);

  // Notifications: sanggar and seniman musik saved as draft, i.e. waiting for verification (needs the `status`
  // columns). Read again on every admin route change, so a verified entry disappears from the list.
  useEffect(() => {
    if (auth !== "ok") return;
    let cancelled = false;
    Promise.all([
      supabase.from(SANGGAR_TABLE).select("id, nama_sanggar, created_at").eq("status", "draft"),
      supabase.from("pemusiks").select("id, nama_seniman, created_at").eq("status", "draft"),
    ]).then(([s, p]) => {
      if (cancelled) return;
      if (s.error && p.error) {
        setPending(null);
        return;
      }
      const items: PendingItem[] = [
        ...(s.data ?? []).map((r) => ({ key: `s-${r.id}`, type: "sanggar" as const, name: r.nama_sanggar, date: r.created_at, href: `/admin/sanggar/edit/${r.id}` })),
        ...(p.data ?? []).map((r) => ({ key: `p-${r.id}`, type: "musik" as const, name: r.nama_seniman, date: r.created_at, href: `/admin/pemusik/edit/${r.id}` })),
      ];
      // newest first
      items.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
      setPending(items);
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
            <Image src="/logos/logo-disbud.webp" alt="Logo Dinas Kebudayaan DKI Jakarta" width={49} height={32} className="h-8 w-[49px] shrink-0 object-contain" />
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

            {/* Notifications: drafts waiting for verification, in a popover */}
            <NotificationMenu items={pending} />

            {/* Profile menu: same as the public navbar (read-only profile + sign out) */}
            <div className="border-l border-zinc-200 pl-3">
              {user ? (
                <ProfileDropdown
                  name={profileName(user)}
                  email={email}
                  avatarUrl={profileAvatar(user)}
                  role="admin"
                  onLogout={handleLogout}
                />
              ) : (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F7941E] via-[#E01A67] to-[#2B3990] text-sm font-bold text-white">
                  {initial}
                </span>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-zinc-50">{children}</div>
      </div>
    </div>
  );
}
