import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-surface-50">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
