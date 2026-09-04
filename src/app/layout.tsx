import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Plus_Jakarta_Sans, Dancing_Script } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: "--font-jakarta",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-script",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} ${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${dancingScript.variable} h-full antialiased`}
    >
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

