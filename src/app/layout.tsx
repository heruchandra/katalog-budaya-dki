import type { Metadata } from "next";
import { preconnect } from "react-dom";
import { Geist, Geist_Mono, Poppins, Plus_Jakarta_Sans, Dancing_Script } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: "--font-jakarta",
  display: "swap",
});

// The three families below aren't used above the fold (body text is Plus Jakarta Sans), so they aren't
// preloaded: preloading them made ~100 KB of fonts compete with the hero for bandwidth on first load.
// They still download on demand wherever a page actually uses them.
const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  display: "swap",
  subsets: ["latin"],
  preload: false,
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
  preload: false,
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Katalog Seni DKI Jakarta — Direktori Pelaku Seni Budaya Tradisional",
  description:
    "Platform katalog digital pelaku seni dan budaya tradisional Jakarta. Temukan sanggar tari, pemusik, dan seniman berkualitas untuk acara budaya Anda.",
  keywords: [
    "seni budaya",
    "Jakarta",
    "sanggar tari",
    "pemusik",
    "seniman tradisional",
    "budaya Betawi",
    "DKI Jakarta",
  ],
};

// The only third-party origin the browser talks to: Supabase (the hero search suggestions and the login state).
// Fonts need no hint: next/font self-hosts them, so there are no requests to Google Fonts at runtime.
const SUPABASE_ORIGIN = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").origin;
  } catch {
    return null;
  }
})();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Next.js inserts resource hints through ReactDOM methods (rendered as a <link> in <head>).
  // crossOrigin matches supabase-js's CORS fetches, so the warmed-up connection is the one they reuse.
  if (SUPABASE_ORIGIN) preconnect(SUPABASE_ORIGIN, { crossOrigin: "anonymous" });

  return (
    <html
      lang="id"
      className={`${jakarta.variable} ${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${dancingScript.variable} h-full antialiased`}
    >
      <head>
        {/* dns-prefetch: fallback for browsers without preconnect. Written as a tag because ReactDOM.prefetchDNS()
            skips an origin that is already preconnected */}
        {SUPABASE_ORIGIN && <link rel="dns-prefetch" href={SUPABASE_ORIGIN} />}
      </head>
      <body className={`${jakarta.className} flex min-h-full flex-col bg-surface-50 overflow-x-hidden`}>
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}

