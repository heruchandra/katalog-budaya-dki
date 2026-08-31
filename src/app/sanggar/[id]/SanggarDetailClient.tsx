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

        {/* 3-Column Grid Layout for Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto px-4 pb-20">
          
          {/* Left Column (CONTENT - lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Deskripsi */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-6">{t('descSanggar') || 'Deskripsi Sanggar'}</h2>
              <p className="leading-relaxed text-slate-700 whitespace-pre-wrap">
                {sanggar.description}
              </p>
            </section>

            {/* Tari Unggulan */}
            {sanggar.tariUnggulan && sanggar.tariUnggulan.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-6">{t('featuredDances') || 'Tari Unggulan'}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {sanggar.tariUnggulan.map((tari: any, index: number) => (
                    <div key={index} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-12px_rgba(234,88,12,0.15)] hover:-translate-y-1 transition-all duration-300">
                      <h4 className="font-bold text-lg text-slate-900">{tari.namaTari || tari.nama}</h4>
                      <p className="text-sm text-slate-600 mt-2 line-clamp-4">{tari.deskripsiTari || tari.deskripsi}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Layanan & Prestasi in 3D Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-12px_rgba(234,88,12,0.15)] hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-bold text-lg text-slate-900 mb-3">{t('services') || 'Layanan Sanggar'}</h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {sanggar.layananSanggar}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-12px_rgba(234,88,12,0.15)] hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-bold text-lg text-slate-900 mb-3">{t('achievements') || 'Prestasi / Penghargaan'}</h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {sanggar.prestasiPenghargaan}
                </p>
              </div>
            </section>

          </div>

          {/* Right Column (STICKY SIDEBAR - lg:col-span-1) */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-8">
              
              <div className="bg-white rounded-3xl p-8 border-t-4 border-t-orange-500 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)]">
                
                {/* Avatars */}
                <div className="flex justify-center items-center gap-4 mb-8">
                  {sanggar.logoUrl && (
                    <img src={sanggar.logoUrl} alt="Logo Sanggar" className="w-16 h-16 rounded-full object-cover shadow-sm border border-slate-100 bg-white" title="Logo Sanggar" />
                  )}
                  {sanggar.fotoKetuaUrl && (
                    <img src={sanggar.fotoKetuaUrl} alt="Foto Ketua" className="w-16 h-16 rounded-full object-cover shadow-sm border border-slate-100 bg-white" title="Ketua Sanggar" />
                  )}
                </div>

                {/* Profile Fields */}
                <div className="space-y-6">
                  
                  <div className="flex items-start gap-4">
                    <User className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t('studioHead') || 'Ketua Sanggar'}</p>
                      <p className="text-sm text-slate-800 font-medium mt-0.5">{sanggar.ketuaSanggar}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Building className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t('secretariat') || 'Alamat Sanggar'}</p>
                      <p className="text-sm text-slate-800 font-medium mt-0.5">{sanggar.alamatSanggar}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t('trainingVenue') || 'Tempat Latihan'}</p>
                      <p className="text-sm text-slate-800 font-medium mt-0.5">{sanggar.alamatTempatLatihan}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <User className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t('picName') || 'Nama PIC'}</p>
                      <p className="text-sm text-slate-800 font-medium mt-0.5">{sanggar.namaPicKontak}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t('phone') || 'Nomor PIC'}</p>
                      <p className="text-sm text-slate-800 font-medium mt-0.5">{sanggar.nomorPicKontak}</p>
                    </div>
                  </div>

                </div>

                {/* Massive CTA */}
                <a 
                  href={waLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="mt-10 flex items-center justify-center w-full bg-slate-900 text-white rounded-xl py-4 font-bold shadow-lg hover:bg-green-500 hover:shadow-green-500/30 transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  Hubungi PIC via WhatsApp
                </a>
              </div>

            </div>
          </div>

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
