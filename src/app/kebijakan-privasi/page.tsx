import { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Kebijakan Privasi — Katalog Seni DKI Jakarta",
  description:
    "Kebijakan privasi Katalog Seni DKI Jakarta: informasi yang dikumpulkan, penggunaannya, keamanan data, serta hak pengguna dan pengelola sanggar.",
};

export default function KebijakanPrivasiPage() {
  return (
    <InfoPage
      content={{
        id: {
          title: "Kebijakan Privasi",
          subtitle:
            "Kebijakan ini menjelaskan informasi apa yang dikelola oleh Katalog Seni DKI Jakarta, bagaimana informasi tersebut digunakan, dan bagaimana kami menjaganya.",
          updated: "Terakhir diperbarui: 30 September 2026",
          sections: [
            {
              heading: "Pengumpulan Informasi",
              paragraphs: [
                "Kami mengelola dua jenis informasi:",
              ],
              items: [
                {
                  icon: "file-text",
                  title: "Data Profil Sanggar & Seniman",
                  text: "Disampaikan saat pendaftaran atau pendataan oleh Dinas Kebudayaan, seperti nama sanggar, nama pimpinan dan kontak PIC, alamat, nomor WhatsApp, email, tautan media sosial, deskripsi, foto, dan video.",
                },
                { icon: "lock", title: "Data Akun Pengelola", text: "Misalnya email untuk masuk ke dasbor admin." },
                { icon: "user-check", title: "Pengunjung Tanpa Akun", text: "Pengunjung umum dapat menjelajahi katalog **tanpa membuat akun**." },
              ],
            },
            {
              heading: "Penggunaan Data",
              paragraphs: [
                "Data profil sanggar **ditampilkan secara publik** untuk keperluan katalog kebudayaan dan agar masyarakat dapat menghubungi sanggar secara langsung.",
              ],
              callout:
                "Saat Anda menekan tombol WhatsApp, email, atau media sosial, Anda diarahkan langsung ke layanan tersebut. Percakapan **berlangsung di luar platform ini** dan tunduk pada **kebijakan privasi masing-masing layanan**.",
            },
            {
              heading: "Keamanan Data",
              paragraphs: [
                "Akses untuk menambah, mengubah, atau menghapus data sanggar dibatasi hanya untuk **petugas yang berwenang** di Dinas Kebudayaan. Data disimpan pada layanan basis data terkelola dengan kontrol akses, dan situs ini diakses melalui **koneksi terenkripsi (HTTPS)**.",
              ],
            },
            {
              heading: "Hak Pengguna & Pengelola Sanggar",
              paragraphs: [
                "Pengelola sanggar dapat meminta **pembaruan, koreksi, atau penghapusan** profil sanggarnya dengan mengajukan **permohonan resmi** kepada Dinas Kebudayaan Provinsi DKI Jakarta melalui email info@disbud.jakarta.go.id. Permohonan akan diverifikasi sebelum perubahan dilakukan.",
              ],
            },
          ],
        },
        en: {
          title: "Privacy Policy",
          subtitle:
            "This policy explains what information the Jakarta Art Catalog manages, how it is used, and how we protect it.",
          updated: "Last updated: September 30, 2026",
          sections: [
            {
              heading: "Information We Collect",
              paragraphs: [
                "We manage two kinds of information:",
              ],
              items: [
                {
                  icon: "file-text",
                  title: "Studio & Artist Profile Data",
                  text: "Provided during registration or data collection by the Department of Culture, such as studio name, leader and contact person, address, WhatsApp number, email, social media links, description, photos, and videos.",
                },
                { icon: "lock", title: "Administrator Account Data", text: "For example, the email used to sign in to the admin dashboard." },
                { icon: "user-check", title: "No Account Needed for Visitors", text: "General visitors can browse the catalog **without creating an account**." },
              ],
            },
            {
              heading: "How We Use Data",
              paragraphs: [
                "Studio profile data is **displayed publicly** as a cultural catalog so the public can contact studios directly.",
              ],
              callout:
                "When you press a WhatsApp, email, or social media button, you are taken directly to that service. The conversation **happens outside this platform** and is governed by **that service's own privacy policy**.",
            },
            {
              heading: "Data Security",
              paragraphs: [
                "Access to add, edit, or remove studio data is restricted to **authorized Department of Culture staff**. Data is stored with a managed database service with access controls, and the site is served over an **encrypted connection (HTTPS)**.",
              ],
            },
            {
              heading: "Rights of Users & Studio Managers",
              paragraphs: [
                "Studio managers may request an **update, correction, or removal** of their studio profile by submitting an **official request** to the DKI Jakarta Provincial Department of Culture at info@disbud.jakarta.go.id. Requests are verified before any change is made.",
              ],
            },
          ],
        },
      }}
    />
  );
}
