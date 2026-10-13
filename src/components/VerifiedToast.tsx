"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { CheckCircle2, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// ?verified=1, read without useSearchParams so static pages stay static ("" while prerendering and hydrating)
const noSubscribe = () => () => {};
const readVerified = () => new URLSearchParams(window.location.search).get("verified") === "1";

/**
 * One-time "email verified" toast after the email verification link (/auth/callback → "/?verified=1" or
 * "/admin?verified=1"). The parameter is removed from the address bar so a reload doesn't show it again.
 */
export default function VerifiedToast() {
  const { language } = useLanguage();
  const verified = useSyncExternalStore(noSubscribe, readVerified, () => false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!verified) return;
    const url = new URL(window.location.href);
    url.searchParams.delete("verified");
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    const timer = setTimeout(() => setDismissed(true), 7000);
    return () => clearTimeout(timer);
  }, [verified]);

  if (!verified || dismissed) return null;
  return (
    <div role="status" className="fixed left-1/2 top-20 z-[10002] flex w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2 items-start gap-3 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-2xl animate-[fade-in_0.25s_ease-out] motion-reduce:animate-none">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="flex-1">
        {language === "en" ? "Your email has been verified. Welcome!" : "Email Anda berhasil diverifikasi. Selamat datang!"}
      </span>
      <button type="button" onClick={() => setDismissed(true)} aria-label={language === "en" ? "Close" : "Tutup"} className="shrink-0 opacity-80 hover:opacity-100">
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
