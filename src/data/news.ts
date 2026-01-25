export interface NewsArticle {
  id: number;
  slug: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  author: string;
  category: string;
  publishedDate: string;
}

export const newsData: NewsArticle[] = [
  {
    id: 1,
    slug: "kerja-bakti-bersama-warga-palmeriam",
    title: "Kerja Bakti Massal: Wujudkan Lingkungan Palmeriam yang Bersih dan Sehat",
    summary: "Warga Kelurahan Palmeriam menunjukkan semangat gotong royong dalam kegiatan kerja bakti massal yang diadakan pada hari Minggu. Acara ini bertujuan untuk membersihkan lingkungan dan mencegah penyakit.",
    content: `<p>Pada hari Minggu pagi yang cerah, ratusan warga Kelurahan Palmeriam berkumpul untuk mengikuti kegiatan kerja bakti massal. Dengan membawa peralatan kebersihan masing-masing, warga dari berbagai usia bahu-membahu membersihkan selokan, merapikan taman, dan mengumpulkan sampah di sekitar lingkungan mereka.</p><p>Lurah Palmeriam, Bapak Setiyawan, Spd, Msi, dalam sambutannya menyatakan bahwa kegiatan ini bukan hanya tentang kebersihan fisik, tetapi juga tentang memperkuat tali silaturahmi antarwarga. "Semangat gotong royong adalah warisan budaya yang harus kita lestarikan. Melalui kegiatan seperti ini, kita tidak hanya membuat lingkungan kita lebih bersih, tetapi juga hati kita lebih dekat satu sama lain," ujarnya.</p><p>Kegiatan ini juga didukung oleh puskesmas setempat yang memberikan penyuluhan singkat tentang pentingnya pemberantasan sarang nyamuk (PSN) untuk mencegah demam berdarah. Diharapkan, kegiatan positif seperti ini dapat terus berlanjut di masa mendatang.</p>`,
    imageUrl: "/placeholder.svg",
    author: "Tim Redaksi Kelurahan",
    category: "Kegiatan Warga",
    publishedDate: "2024-07-21",
  },
  {
    id: 2,
    slug: "pelatihan-umkm-digital-untuk-ibu-rumah-tangga",
    title: "Ibu-Ibu Palmeriam Go Digital: Pelatihan UMKM untuk Tingkatkan Ekonomi Keluarga",
    summary: "Kelurahan Palmeriam bekerja sama dengan komunitas startup lokal untuk mengadakan pelatihan pemasaran digital bagi para pelaku UMKM, khususnya ibu rumah tangga. Pelatihan ini diharapkan dapat membantu mereka memperluas jangkauan pasar.",
    content: `<p>Di era digital ini, kemampuan untuk memasarkan produk secara online menjadi kunci keberhasilan UMKM. Menyadari hal tersebut, Kelurahan Palmeriam menginisiasi sebuah program pelatihan pemasaran digital yang menargetkan para ibu rumah tangga yang memiliki usaha kecil.</p><p>Pelatihan yang berlangsung selama dua hari ini mencakup berbagai materi, mulai dari dasar-dasar fotografi produk menggunakan smartphone, penulisan caption yang menarik, hingga strategi beriklan di media sosial seperti Instagram dan Facebook. Para peserta tampak antusias mengikuti setiap sesi dan aktif bertanya kepada para mentor yang berasal dari praktisi startup digital.</p><p>Ibu Siti, salah satu peserta yang menjual kue kering, merasa sangat terbantu dengan adanya pelatihan ini. "Selama ini saya hanya menjual dari mulut ke mulut. Sekarang saya jadi lebih percaya diri untuk mencoba jualan online. Ilmunya sangat bermanfaat," tuturnya. Program ini merupakan bagian dari komitmen kelurahan untuk mendukung pertumbuhan ekonomi lokal.</p>`,
    imageUrl: "/placeholder.svg",
    author: "Tim Redaksi Kelurahan",
    category: "Pemberdayaan Masyarakat",
    publishedDate: "2024-07-18",
  },
  {
    id: 3,
    slug: "posyandu-remaja-generasi-sehat-palmeriam",
    title: "Cek Kesehatan dan Konseling di Posyandu Remaja 'Gen Sehat' Palmeriam",
    summary: "Posyandu Remaja 'Generasi Sehat' kembali dibuka untuk memberikan layanan pemeriksaan kesehatan dasar, konsultasi gizi, dan konseling bagi para remaja di Kelurahan Palmeriam.",
    content: `<p>Kesehatan remaja seringkali luput dari perhatian. Untuk mengatasi hal tersebut, Posyandu Remaja 'Generasi Sehat' (Gen Sehat) Palmeriam kembali aktif memberikan pelayanannya setiap satu bulan sekali. Bertempat di aula kelurahan, para remaja dapat memeriksakan kesehatan dasar seperti pengukuran tinggi dan berat badan, tekanan darah, serta lingkar lengan atas.</p><p>Selain pemeriksaan fisik, Posyandu Remaja juga menyediakan sesi konseling sebaya. Para remaja bisa berbagi cerita atau bertanya tentang berbagai masalah yang mereka hadapi, mulai dari masalah pertemanan, stres di sekolah, hingga kesehatan reproduksi, dalam suasana yang santai dan rahasia.</p><p>"Kami ingin para remaja tahu bahwa mereka tidak sendirian. Ada tempat yang aman untuk bertanya dan mendapatkan informasi yang benar," kata Kak Rina, salah satu kader kesehatan remaja. Inisiatif ini diharapkan dapat menciptakan generasi muda Palmeriam yang tidak hanya sehat secara fisik, tetapi juga mental.</p>`,
    imageUrl: "/placeholder.svg",
    author: "Tim Redaksi Kelurahan",
    category: "Kesehatan",
    publishedDate: "2024-07-15",
  },
];
