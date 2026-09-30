import { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Tentang Kami — Katalog Seni DKI Jakarta",
  description:
    "Katalog Seni & Budaya DKI Jakarta: platform resmi Dinas Kebudayaan Provinsi DKI Jakarta untuk melestarikan seni tradisi dan memberdayakan sanggar lokal.",
};

export default function TentangKamiPage() {
  return (
    <InfoPage
      content={{
        id: {
          title: "Tentang Katalog Seni & Budaya",
          subtitle:
            "Katalog Seni DKI Jakarta adalah platform digital Dinas Kebudayaan Provinsi DKI Jakarta untuk melestarikan seni tradisi dan memberdayakan sanggar serta pelaku seni lokal, agar karya mereka mudah ditemukan oleh masyarakat, penyelenggara acara, dan mitra dari dalam maupun luar negeri.",
          sections: [
            {
              heading: "Visi & Misi",
              paragraphs: [
                "Visi kami adalah menjadikan seni tradisi Jakarta tetap hidup, dikenal, dan dihargai lintas generasi melalui katalog digital yang terpercaya.",
              ],
              bullets: [
                "Mendokumentasikan sanggar tari, pemusik, dan pelaku seni pertunjukan tradisional di seluruh wilayah DKI Jakarta secara digital.",
                "Menampilkan profil, karya unggulan, galeri, dan prestasi setiap sanggar secara rapi dan mudah diakses.",
                "Membuka peluang pentas, kolaborasi, dan pembinaan bagi sanggar dan seniman lokal.",
              ],
            },
            {
              heading: "Fungsi Platform",
              paragraphs: [
                "Katalog ini dirancang sebagai direktori resmi yang memudahkan masyarakat menemukan dan menghubungi pelaku seni secara langsung.",
              ],
              bullets: [
                "Pencarian sanggar dan seniman musik berdasarkan nama, kategori, dan grade.",
                "Informasi layanan sanggar, seperti kelas tari, pementasan, dan pertunjukan musik tradisional.",
                "Direktori kontak resmi: setiap tombol hubungi langsung terhubung ke WhatsApp, email, atau media sosial sanggar yang bersangkutan.",
              ],
            },
            {
              heading: "Dukungan Dinas Kebudayaan DKI Jakarta",
              paragraphs: [
                "Platform ini dikelola oleh Dinas Kebudayaan Provinsi DKI Jakarta sebagai bagian dari upaya pembinaan dan pelestarian kebudayaan daerah. Data sanggar dikurasi dan diverifikasi oleh dinas, termasuk hasil evaluasi grade sanggar.",
              ],
            },
          ],
          closing:
            "Kami mengajak seluruh masyarakat untuk mengenal, mengapresiasi, dan mendukung sanggar serta seniman Jakarta. Bersama, kita jaga seni budaya Betawi dan Nusantara agar terus berkembang.",
        },
        en: {
          title: "About the Art & Culture Catalog",
          subtitle:
            "The Jakarta Art Catalog is a digital platform of the DKI Jakarta Provincial Department of Culture, created to preserve traditional arts and empower local studios and artists, making their work easy to discover for the public, event organizers, and partners in Indonesia and abroad.",
          sections: [
            {
              heading: "Vision & Mission",
              paragraphs: [
                "Our vision is to keep Jakarta's traditional arts alive, recognized, and valued across generations through a trusted digital catalog.",
              ],
              bullets: [
                "Digitally document traditional dance studios, musicians, and performing artists across DKI Jakarta.",
                "Present each studio's profile, featured works, gallery, and achievements in a clear, accessible way.",
                "Open up performance, collaboration, and development opportunities for local studios and artists.",
              ],
            },
            {
              heading: "What the Platform Does",
              paragraphs: [
                "The catalog is designed as an official directory that makes it easy to find and contact artists directly.",
              ],
              bullets: [
                "Search for studios and music artists by name, category, and grade.",
                "Information on studio services such as dance classes, stage performances, and traditional music shows.",
                "Official contact directory: every contact button links straight to the studio's own WhatsApp, email, or social media.",
              ],
            },
            {
              heading: "Supported by the DKI Jakarta Department of Culture",
              paragraphs: [
                "This platform is managed by the DKI Jakarta Provincial Department of Culture as part of its work to develop and preserve regional culture. Studio data is curated and verified by the department, including studio grade evaluations.",
              ],
            },
          ],
          closing:
            "We invite everyone to discover, appreciate, and support Jakarta's studios and artists. Together, let us keep Betawi and Indonesian arts and culture thriving.",
        },
      }}
    />
  );
}
