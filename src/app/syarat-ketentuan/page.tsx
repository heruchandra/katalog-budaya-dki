import { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan — Katalog Seni DKI Jakarta",
  description:
    "Syarat dan ketentuan penggunaan Katalog Seni DKI Jakarta: ketentuan umum, akurasi data sanggar, hak cipta aset budaya, dan batasan tanggung jawab.",
};

export default function SyaratKetentuanPage() {
  return (
    <InfoPage
      content={{
        id: {
          title: "Syarat & Ketentuan Layanan",
          subtitle:
            "Syarat dan ketentuan ini berlaku bagi setiap pengunjung yang menjelajahi Katalog Seni DKI Jakarta dan menghubungi sanggar atau seniman yang terdaftar di dalamnya.",
          updated: "Terakhir diperbarui: 30 September 2026",
          sections: [
            {
              heading: "Ketentuan Umum",
              paragraphs: [
                "Dengan menjelajahi katalog ini atau menghubungi sanggar melalui tombol kontak yang tersedia, Anda **dianggap telah membaca dan menyetujui** syarat dan ketentuan ini. Dinas Kebudayaan dapat memperbarui ketentuan ini sewaktu-waktu; versi terbaru selalu tersedia di halaman ini.",
              ],
            },
            {
              heading: "Akurasi Data Sanggar",
              paragraphs: [
                "Pengelola sanggar bertanggung jawab memberikan data profil dan kontak yang **asli, benar, dan terkini**. Dinas Kebudayaan melakukan kurasi dan verifikasi, namun perubahan harga, jadwal, maupun ketersediaan layanan sepenuhnya mengikuti informasi dari sanggar yang bersangkutan.",
              ],
            },
            {
              heading: "Hak Cipta & Aset Budaya",
              paragraphs: [
                "Foto, video, nama karya, dan materi lain yang ditampilkan merupakan milik sanggar atau seniman yang bersangkutan dan **dilindungi hak cipta**.",
              ],
              items: [
                {
                  icon: "lock",
                  title: "Wajib Izin Tertulis",
                  text: "Materi tidak boleh disalin, diunduh untuk keperluan komersial, atau digunakan ulang **tanpa izin tertulis** dari pemiliknya.",
                },
                {
                  icon: "shield-check",
                  title: "Hormati Warisan Budaya",
                  text: "Karya seni tradisi yang ditampilkan adalah bagian dari **warisan budaya** dan harus dihormati serta tidak disalahgunakan.",
                },
              ],
            },
            {
              heading: "Batasan Tanggung Jawab",
              paragraphs: [
                "Katalog Seni DKI Jakarta berfungsi sebagai **katalog dan layanan direktori resmi** di bawah Dinas Kebudayaan Provinsi DKI Jakarta.",
              ],
              callout:
                "Kesepakatan, pemesanan, pembayaran, maupun kerja sama yang terjadi antara pengunjung dan sanggar merupakan **tanggung jawab kedua belah pihak** dan **berlangsung di luar platform ini**.",
            },
          ],
        },
        en: {
          title: "Terms & Conditions of Service",
          subtitle:
            "These terms apply to every visitor who browses the Jakarta Art Catalog and contacts the studios or artists listed on it.",
          updated: "Last updated: September 30, 2026",
          sections: [
            {
              heading: "General Terms",
              paragraphs: [
                "By browsing this catalog or contacting a studio through the contact buttons provided, you are **deemed to have read and agreed** to these terms. The Department of Culture may update these terms at any time; the latest version is always available on this page.",
              ],
            },
            {
              heading: "Accuracy of Studio Data",
              paragraphs: [
                "Studio managers are responsible for providing **authentic, correct, and up-to-date** profile and contact details. The Department of Culture curates and verifies listings, but prices, schedules, and service availability are always as stated by the studio itself.",
              ],
            },
            {
              heading: "Copyright & Cultural Assets",
              paragraphs: [
                "Photos, videos, work titles, and other materials shown belong to the respective studios or artists and are **protected by copyright**.",
              ],
              items: [
                {
                  icon: "lock",
                  title: "Written Permission Required",
                  text: "Materials may not be copied, downloaded for commercial use, or reused **without written permission** from their owners.",
                },
                {
                  icon: "shield-check",
                  title: "Respect Cultural Heritage",
                  text: "Traditional works shown are part of our **cultural heritage** and must be respected and not misused.",
                },
              ],
            },
            {
              heading: "Limitation of Liability",
              paragraphs: [
                "The Jakarta Art Catalog serves as an **official catalog and directory service** under the DKI Jakarta Provincial Department of Culture.",
              ],
              callout:
                "Any agreements, bookings, payments, or collaborations between visitors and studios are **the responsibility of both parties** and **take place outside this platform**.",
            },
          ],
        },
      }}
    />
  );
}
