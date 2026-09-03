"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, CheckCircle, Clock, Users, Building, User } from "lucide-react";
import { Dancing_Script, Poppins } from 'next/font/google';
import { useLanguage } from "@/context/LanguageContext";

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400', '700'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

interface SanggarDetailData {
  id: string;
  name: string;
  taglineSanggar: string;
  grade: string;
  ketuaSanggar: string;
  namaPicKontak: string;
  nomorPicKontak: string;
  email: string;
  alamatSanggar: string;
  alamatTempatLatihan: string;
  description: string;
  layananSanggar: string;
  prestasiPenghargaan: string;
  established: string;
  members: string;
  tariUnggulan: any[];
  imageUrl: string;
  logoUrl: string | null;
  fotoKetuaUrl: string | null;
  gallery: { type: string; url: string }[];
}

export default function SanggarDetailClient({ sanggar }: { sanggar: SanggarDetailData }) {
  const { t } = useLanguage();

  // Safely format phone number for WhatsApp API
  const formatWaNumber = (phone?: string) => {
    if (!phone) return "";
    let cleaned = phone.replace(/\D/g, ''); // Remove non-numeric chars
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    }
    return cleaned;
  };

  // Fallback to Ayodya Pala number if data is missing for testing, otherwise use real data
  const rawNumber = sanggar?.nomorPicKontak || '081399160062'; 
  const waNumber = formatWaNumber(rawNumber);
  
  // Create a polite pre-filled message
  const studioName = sanggar?.name || 'Sanggar';
  const waMessage = encodeURIComponent(`Halo, saya melihat profil ${studioName} di Katalog Seni DKI Jakarta. Saya ingin bertanya lebih lanjut mengenai layanan yang tersedia.`);
  
  const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

  return (
    <div className={`min-h-screen bg-white pt-24 pb-24 ${poppins.className}`}>
      
      {/* Removed Back Navigation */}
      {/* Cinematic Hero Image */}
      <div className="w-full relative h-[50vh] md:h-[70vh] mb-12">
        <img 
          src={sanggar.imageUrl} 
          alt={sanggar.name} 
          className="w-full h-full object-cover rounded-none"
        />
      </div>

      {/* Main Content Area */}
      <div className="w-full bg-slate-50/50">
        
        {/* Title & Meta cleanly below image */}
        <div className="py-12 max-w-4xl mx-auto px-4 text-center">
          <h1 className={`text-5xl md:text-6xl font-light text-slate-900 ${dancingScript.className}`}>
            {sanggar.name}
          </h1>
          {sanggar.taglineSanggar && (
            <p className="font-sans text-slate-500 text-lg font-medium mt-4">
              {sanggar.taglineSanggar}
            </p>
          )}
        </div>

        {/* Full-Width Content */}
        <div className="max-w-7xl mx-auto px-4 pb-20">
          
          {/* Tari Unggulan */}
          {sanggar.tariUnggulan && sanggar.tariUnggulan.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-6">{t('featuredDances') || 'Tari Unggulan'}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {sanggar.tariUnggulan.map((tari: any, index: number) => (
                  <div key={index} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-12px_rgba(234,88,12,0.15)] hover:-translate-y-1 transition-all duration-300">
                    <h4 className="font-bold text-lg text-slate-900">{tari.namaTari || tari.nama}</h4>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-4">{tari.deskripsiTari || tari.deskripsi}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* BOTTOM GALLERY SECTION */}
        {sanggar.gallery && sanggar.gallery.length > 0 && (
          <section className="bg-white py-20 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-10 text-center">{t('gallery') || 'Galeri Foto'}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {sanggar.gallery.map((img, index) => (
                  <div key={index} className="group relative overflow-hidden bg-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <img 
                      src={img.url} 
                      alt={img.type} 
                      className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <span className="text-white text-sm font-bold shadow-sm">
                        {img.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
