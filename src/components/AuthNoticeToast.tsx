"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ShieldAlert, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type Notice = "verified" | "unauthorized" | null;

const MESSAGES = {
  verified: { id: "Email Anda berhasil diverifikasi. Selamat datang!", en: "Your email has been verified. Welcome!" },
  unauthorized: {
    id: "Akun Anda tidak memiliki hak akses ke dasbor admin.",
    en: "Your account does not have access to the admin dashboard.",
  },
};

/**
 * One-time auth notices, shown on whatever page the flag lands on:
 * - ?verified=1 — after the email verification link (/auth/callback → "/?verified=1" or "/admin?verified=1")
 * - ?unauthorized=1 — a signed-in account without profiles.role = 'admin' was sent away from /admin
 *   (by the proxy or the admin layout)
 * The flag is removed from the address bar so a reload doesn't show it again. useSearchParams (inside Suspense, so
 * only this toast renders client-side) also picks the flag up after a client-side redirect.
 */
function AuthNotice() {
  const { language } = useLanguage();
  const params = useSearchParams();
  const flag: Notice = params.get("verified") === "1" ? "verified" : params.get("unauthorized") === "1" ? "unauthorized" : null;

  // Keep the notice after the flag is removed from the URL: adjusted while rendering when a new flag arrives
  const [notice, setNotice] = useState<Notice>(null);
  const [seenFlag, setSeenFlag] = useState<Notice>(null);
  if (flag !== seenFlag) {
    setSeenFlag(flag);
    if (flag) setNotice(flag);
  }

  useEffect(() => {
    if (!flag) return;
    const url = new URL(window.location.href);
    url.searchParams.delete(flag);
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  }, [flag]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 7000);
    return () => clearTimeout(timer);
  }, [notice]);

  if (!notice) return null;
  const isError = notice === "unauthorized";
  const Icon = isError ? ShieldAlert : CheckCircle2;
  return (
    <div
      role={isError ? "alert" : "status"}
      className={`fixed left-1/2 top-20 z-[10002] flex w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2 items-start gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white shadow-2xl animate-[fade-in_0.25s_ease-out] motion-reduce:animate-none ${isError ? "bg-red-600" : "bg-emerald-600"}`}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="flex-1">{language === "en" ? MESSAGES[notice].en : MESSAGES[notice].id}</span>
      <button type="button" onClick={() => setNotice(null)} aria-label={language === "en" ? "Close" : "Tutup"} className="shrink-0 opacity-80 hover:opacity-100">
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export default function AuthNoticeToast() {
  return (
    <Suspense fallback={null}>
      <AuthNotice />
    </Suspense>
  );
}
