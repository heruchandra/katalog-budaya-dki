import { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Tentang Kami — Katalog Seni DKI Jakarta",
  description:
    "Temukan sanggar tari dan seniman musik tradisional pilihan Jakarta. Setiap sanggar terkurasi oleh Dinas Kebudayaan Provinsi DKI Jakarta dan bisa dihubungi langsung lewat WhatsApp.",
};

export default function TentangKamiPage() {
  return (
    <InfoPage
      content={{
        id: {
          title: "Tentang Katalog Seni & Budaya",
          subtitle:
            "Sedang mencari penari, sanggar, atau pemusik tradisional untuk acara Anda? Katalog Seni DKI Jakarta mempertemukan Anda dengan sanggar dan seniman terbaik ibu kota, dari tari Betawi yang memukau hingga alunan musik tradisional yang menghidupkan suasana, dalam **satu platform resmi** Dinas Kebudayaan Provinsi DKI Jakarta.",
          sections: [
            {
              heading: "Sanggar Pilihan, Kualitas Terjamin",
              paragraphs: [
                "Setiap sanggar ditinjau langsung oleh Dinas Kebudayaan dan dinilai melalui **evaluasi grade**. Profilnya tampil lengkap dengan karya unggulan, galeri foto dan video, serta prestasi, sehingga Anda bisa memilih dengan yakin sebelum menghubungi.",
              ],
              // the agency's guarantee (wording as approved by the mentor)
              callout:
                "Dinas Kebudayaan Provinsi DKI Jakarta menjamin bahwa setiap sanggar yang terdaftar dalam katalog ini merupakan **sanggar pilihan yang telah terkurasi** dengan **kualitas penampilan terbaik**.",
            },
            {
              heading: "Hadir di Setiap Momen Istimewa",
              paragraphs: [
                "Berikan sentuhan budaya Jakarta yang berkesan bagi tamu dan keluarga Anda:",
              ],
              layout: "grid",
              items: [
                { icon: "party-popper", title: "Penyambutan Tamu Kehormatan", text: "Acara kantor, peresmian, dan perayaan hari besar." },
                { icon: "heart-handshake", title: "Pernikahan & Acara Keluarga", text: "Lengkap dengan nuansa adat Betawi yang berkesan." },
                { icon: "music", title: "Festival & Pentas Seni", text: "Festival, pentas seni sekolah, hingga kegiatan komunitas." },
                { icon: "graduation-cap", title: "Kelas Tari Tradisional", text: "Untuk anak, remaja, hingga dewasa." },
              ],
            },
            {
              heading: "Mudah, Cepat, dan Langsung",
              paragraphs: [
                "Menemukan penampil yang tepat kini hanya butuh beberapa langkah:",
              ],
              layout: "steps",
              items: [
                { icon: "search", title: "Temukan Penampil", text: "Cari sanggar & seniman musik berdasarkan nama, kategori, grade, dan wilayah." },
                { icon: "eye", title: "Pelajari Profilnya", text: "Lihat profil, galeri, dan video penampilan sebelum memutuskan." },
                { icon: "message-circle", title: "Hubungi Langsung", text: "Hubungi sanggar **langsung lewat WhatsApp**, tanpa perantara." },
              ],
            },
            {
              heading: "Dukung Seni Budaya Jakarta",
              paragraphs: [
                "Platform ini **dikelola langsung oleh Dinas Kebudayaan Provinsi DKI Jakarta** sebagai bagian dari pembinaan dan pelestarian seni budaya daerah. Setiap kali Anda mengundang sanggar lokal, Anda ikut **menjaga warisan seni Betawi dan Nusantara** tetap hidup.",
              ],
            },
          ],
          closing:
            "Jadikan acara Anda lebih berkesan bersama sanggar dan seniman terbaik Jakarta. Jelajahi katalog sekarang dan temukan penampil yang tepat untuk Anda.",
        },
        en: {
          title: "About the Art & Culture Catalog",
          subtitle:
            "Looking for traditional dancers, a dance studio, or musicians for your event? The Jakarta Art Catalog connects you with the capital's finest studios and artists, from captivating Betawi dance to traditional music that brings any occasion to life, all on **one official platform** of the DKI Jakarta Provincial Department of Culture.",
          sections: [
            {
              heading: "Hand-Picked Studios, Guaranteed Quality",
              paragraphs: [
                "Every studio is reviewed directly by the Department of Culture and assessed through a **grade evaluation**. Its profile comes complete with featured works, a photo and video gallery, and achievements, so you can choose with confidence before getting in touch.",
              ],
              callout:
                "The DKI Jakarta Provincial Department of Culture guarantees that every studio listed in this catalog is a **hand-picked, curated studio** with the **finest performance quality**.",
            },
            {
              heading: "Made for Every Special Moment",
              paragraphs: [
                "Give your guests and family a memorable touch of Jakarta culture:",
              ],
              layout: "grid",
              items: [
                { icon: "party-popper", title: "Welcoming Honored Guests", text: "Corporate events, inaugurations, and holiday celebrations." },
                { icon: "heart-handshake", title: "Weddings & Family Celebrations", text: "Complete with a memorable traditional Betawi touch." },
                { icon: "music", title: "Festivals & Art Shows", text: "Festivals, school art shows, and community events." },
                { icon: "graduation-cap", title: "Traditional Dance Classes", text: "For children, teenagers, and adults." },
              ],
            },
            {
              heading: "Easy, Fast, and Direct",
              paragraphs: [
                "Finding the right performers takes just a few steps:",
              ],
              layout: "steps",
              items: [
                { icon: "search", title: "Find Performers", text: "Search for studios & music artists by name, category, grade, and region." },
                { icon: "eye", title: "Check Their Profile", text: "View profiles, galleries, and performance videos before you decide." },
                { icon: "message-circle", title: "Contact Directly", text: "Contact the studio **directly on WhatsApp**, with no middleman." },
              ],
            },
            {
              heading: "Support Jakarta's Arts & Culture",
              paragraphs: [
                "This platform is **managed directly by the DKI Jakarta Provincial Department of Culture** as part of its work to develop and preserve regional arts and culture. Every time you invite a local studio, you help **keep Betawi and Indonesian artistic heritage alive**.",
              ],
            },
          ],
          closing:
            "Make your event more memorable with Jakarta's finest studios and artists. Explore the catalog now and find the right performers for you.",
        },
      }}
    />
  );
}
