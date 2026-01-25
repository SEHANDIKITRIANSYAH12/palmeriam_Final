// Script untuk seed berita dan agenda
// Jalankan dengan: npx tsx prisma/seed.ts

import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Create or get admin user
  const username = process.env.DEFAULT_ADMIN_USERNAME || "admin";
  const password = process.env.DEFAULT_ADMIN_PASSWORD || "admin123";
  const name = process.env.DEFAULT_ADMIN_NAME || "Administrator";

  let adminUser = await prisma.user.findUnique({ where: { username } });
  
  if (!adminUser) {
    const hashed = await bcrypt.hash(password, 10);
    adminUser = await prisma.user.create({
      data: {
        username,
        password: hashed,
        name,
        role: "admin",
      },
    });
    console.log(`✅ Admin user created: ${username}`);
  } else {
    console.log(`ℹ️  Admin user already exists: ${username}`);
  }

  // 2. Seed Berita - Hapus semua dan buat baru
  console.log("\n📰 Seeding Berita...");
  const existingBeritaCount = await prisma.berita.count();
  if (existingBeritaCount > 0) {
    await prisma.berita.deleteMany({});
    console.log(`🗑️  Deleted ${existingBeritaCount} existing berita`);
  }

  const beritaData = [
    {
      judul: "Pembukaan Layanan Digital Kelurahan Palmeriam Jakarta Timur",
      konten: `Kelurahan Palmeriam, Jakarta Timur dengan bangga mengumumkan pembukaan layanan digital terbaru untuk memudahkan pelayanan kepada masyarakat. Sistem Informasi Pelayanan Kelurahan Palmeriam (SIPALMI) telah resmi diluncurkan untuk memberikan akses yang lebih mudah dan cepat bagi warga Palmeriam, Jakarta Timur.

Dengan sistem ini, warga Palmeriam, Jakarta Timur dapat mengakses berbagai layanan administrasi secara online, termasuk pengajuan surat keterangan, pengaduan, dan informasi terbaru seputar kegiatan di Kelurahan Palmeriam, Jakarta Timur.

Kami berkomitmen untuk terus meningkatkan kualitas pelayanan kepada masyarakat Palmeriam, Jakarta Timur melalui inovasi teknologi yang memudahkan akses informasi dan layanan publik.`,
      kategori: "Pengumuman",
      isPublished: true,
      penulisId: adminUser.id,
      gambar: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&q=80",
    },
    {
      judul: "Gotong Royong Pembersihan Lingkungan di Palmeriam Jakarta Timur",
      konten: `Kelurahan Palmeriam, Jakarta Timur mengadakan kegiatan gotong royong pembersihan lingkungan pada hari Sabtu, 25 Januari 2025. Kegiatan ini diikuti oleh warga dari berbagai RT/RW di wilayah Palmeriam, Jakarta Timur.

Kegiatan gotong royong ini bertujuan untuk menjaga kebersihan dan keindahan lingkungan di Kelurahan Palmeriam, Jakarta Timur. Warga bersama-sama membersihkan saluran air, jalan, dan area publik lainnya di sekitar Palmeriam, Jakarta Timur.

Kami mengucapkan terima kasih kepada seluruh warga Palmeriam, Jakarta Timur yang telah berpartisipasi dalam kegiatan ini. Mari kita jaga bersama kebersihan dan keindahan lingkungan Palmeriam, Jakarta Timur.`,
      kategori: "Kegiatan",
      isPublished: true,
      penulisId: adminUser.id,
      gambar: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop&q=80",
    },
    {
      judul: "Pelayanan KTP dan KK di Kelurahan Palmeriam Jakarta Timur",
      konten: `Bagi warga Palmeriam, Jakarta Timur yang memerlukan pelayanan KTP dan KK, Kelurahan Palmeriam, Jakarta Timur menyediakan layanan administrasi kependudukan setiap hari kerja.

Lokasi pelayanan berada di Kantor Kelurahan Palmeriam, Jakarta Timur, Jl. Palmeriam No. 1, Jakarta Timur. Warga Palmeriam, Jakarta Timur dapat datang langsung dengan membawa dokumen yang diperlukan.

Jam pelayanan di Kelurahan Palmeriam, Jakarta Timur adalah Senin hingga Jumat, pukul 08:00 - 16:00 WIB. Untuk informasi lebih lanjut, warga Palmeriam, Jakarta Timur dapat menghubungi kantor kelurahan.`,
      kategori: "Layanan",
      isPublished: true,
      penulisId: adminUser.id,
      gambar: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop&q=80",
    },
    {
      judul: "Program Bantuan Sosial untuk Warga Palmeriam Jakarta Timur",
      konten: `Kelurahan Palmeriam, Jakarta Timur menginformasikan program bantuan sosial yang tersedia untuk warga kurang mampu di wilayah Palmeriam, Jakarta Timur. Program ini bertujuan untuk membantu meringankan beban ekonomi warga Palmeriam, Jakarta Timur yang memenuhi kriteria.

Warga Palmeriam, Jakarta Timur yang memerlukan bantuan dapat mendaftar di Kantor Kelurahan Palmeriam, Jakarta Timur dengan membawa dokumen yang diperlukan. Pendaftaran dibuka setiap hari kerja di Kelurahan Palmeriam, Jakarta Timur.

Kami berharap program ini dapat membantu warga Palmeriam, Jakarta Timur yang membutuhkan. Untuk informasi lebih detail, silakan hubungi kantor Kelurahan Palmeriam, Jakarta Timur.`,
      kategori: "Program",
      isPublished: true,
      penulisId: adminUser.id,
      gambar: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop&q=80",
    },
    {
      judul: "Peningkatan Infrastruktur Jalan di Palmeriam Jakarta Timur",
      konten: `Pemerintah Kelurahan Palmeriam, Jakarta Timur sedang melakukan peningkatan infrastruktur jalan di beberapa titik di wilayah Palmeriam, Jakarta Timur. Pekerjaan ini dilakukan untuk meningkatkan kualitas jalan dan memudahkan akses transportasi warga Palmeriam, Jakarta Timur.

Pekerjaan peningkatan jalan di Palmeriam, Jakarta Timur akan dilakukan secara bertahap untuk meminimalisir gangguan terhadap aktivitas warga. Kami memohon pengertian dan kerjasama warga Palmeriam, Jakarta Timur selama proses pengerjaan.

Informasi lebih lanjut mengenai jadwal dan lokasi pengerjaan dapat diperoleh di Kantor Kelurahan Palmeriam, Jakarta Timur.`,
      kategori: "Infrastruktur",
      isPublished: true,
      penulisId: adminUser.id,
      gambar: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop&q=80",
    },
    {
      judul: "Kegiatan Posyandu Rutin di Palmeriam Jakarta Timur",
      konten: `Kelurahan Palmeriam, Jakarta Timur mengadakan kegiatan Posyandu rutin setiap bulan untuk balita dan ibu hamil di wilayah Palmeriam, Jakarta Timur. Kegiatan ini bertujuan untuk memantau kesehatan dan tumbuh kembang anak di Kelurahan Palmeriam, Jakarta Timur.

Kegiatan Posyandu di Palmeriam, Jakarta Timur meliputi penimbangan, pengukuran tinggi badan, imunisasi, dan penyuluhan gizi. Semua layanan ini diberikan secara gratis untuk warga Palmeriam, Jakarta Timur.

Kami mengundang seluruh ibu dan balita di Kelurahan Palmeriam, Jakarta Timur untuk berpartisipasi dalam kegiatan Posyandu ini.`,
      kategori: "Kesehatan",
      isPublished: true,
      penulisId: adminUser.id,
      gambar: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop&q=80",
    },
    {
      judul: "Festival Budaya dan Seni Warga Palmeriam Jakarta Timur",
      konten: `Kelurahan Palmeriam, Jakarta Timur akan mengadakan Festival Budaya dan Seni yang menampilkan berbagai kesenian tradisional dan modern dari warga Palmeriam, Jakarta Timur. Acara ini bertujuan untuk melestarikan budaya dan mempererat tali persaudaraan warga Palmeriam, Jakarta Timur.

Festival akan menampilkan berbagai pertunjukan seperti tari tradisional, musik daerah, dan pameran kerajinan tangan dari warga Palmeriam, Jakarta Timur. Acara ini terbuka untuk umum dan gratis.

Kami mengundang seluruh warga Palmeriam, Jakarta Timur untuk hadir dan meramaikan Festival Budaya dan Seni ini.`,
      kategori: "Budaya",
      isPublished: true,
      penulisId: adminUser.id,
      gambar: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop&q=80",
    },
  ];

  for (const berita of beritaData) {
    await prisma.berita.create({ data: berita });
  }
  console.log(`✅ Created ${beritaData.length} berita with images`);

  // 3. Seed Agenda
  console.log("\n📅 Seeding Agenda...");
  const existingAgendaCount = await prisma.agenda.count();
  if (existingAgendaCount > 0) {
    await prisma.agenda.deleteMany({});
    console.log(`🗑️  Deleted ${existingAgendaCount} existing agenda`);
  }

  const now = new Date();
  const agendaData = [
    {
      judul: "Rapat Koordinasi RT/RW se-Kelurahan Palmeriam Jakarta Timur",
      deskripsi: `Rapat koordinasi rutin bulanan untuk seluruh RT/RW di wilayah Kelurahan Palmeriam, Jakarta Timur. Acara ini membahas program kerja, permasalahan, dan solusi untuk kemajuan bersama di Palmeriam, Jakarta Timur.`,
      tanggal: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 9, 0),
      waktuMulai: "09:00",
      waktuSelesai: "12:00",
      lokasi: "Aula Kantor Kelurahan Palmeriam, Jakarta Timur, Jl. Palmeriam No. 1",
      kategori: "Rapat",
      peserta: 50,
    },
    {
      judul: "Kegiatan Posyandu di Palmeriam Jakarta Timur",
      deskripsi: `Kegiatan Posyandu rutin untuk balita dan ibu hamil di Kelurahan Palmeriam, Jakarta Timur. Kegiatan ini meliputi penimbangan, imunisasi, dan penyuluhan kesehatan untuk warga Palmeriam, Jakarta Timur.`,
      tanggal: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 8, 0),
      waktuMulai: "08:00",
      waktuSelesai: "11:00",
      lokasi: "Posyandu RW 05, Kelurahan Palmeriam, Jakarta Timur",
      kategori: "Kesehatan",
      peserta: 30,
    },
    {
      judul: "Pelatihan Kewirausahaan untuk Warga Palmeriam Jakarta Timur",
      deskripsi: `Pelatihan kewirausahaan gratis untuk warga Kelurahan Palmeriam, Jakarta Timur yang ingin memulai atau mengembangkan usaha. Pelatihan ini diselenggarakan untuk meningkatkan ekonomi warga Palmeriam, Jakarta Timur.`,
      tanggal: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10, 13, 0),
      waktuMulai: "13:00",
      waktuSelesai: "16:00",
      lokasi: "Balai RT 03, Kelurahan Palmeriam, Jakarta Timur",
      kategori: "Pelatihan",
      peserta: 25,
    },
    {
      judul: "Kegiatan Senam Sehat Warga Palmeriam Jakarta Timur",
      deskripsi: `Kegiatan senam sehat rutin setiap minggu untuk warga Kelurahan Palmeriam, Jakarta Timur. Kegiatan ini bertujuan untuk meningkatkan kesehatan dan kebugaran warga Palmeriam, Jakarta Timur.`,
      tanggal: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 6, 0),
      waktuMulai: "06:00",
      waktuSelesai: "07:00",
      lokasi: "Lapangan Olahraga Kelurahan Palmeriam, Jakarta Timur",
      kategori: "Olahraga",
      peserta: 40,
    },
    {
      judul: "Pembagian Sembako untuk Warga Miskin Palmeriam Jakarta Timur",
      deskripsi: `Program pembagian sembako untuk warga kurang mampu di Kelurahan Palmeriam, Jakarta Timur. Program ini merupakan bentuk kepedulian terhadap warga Palmeriam, Jakarta Timur yang membutuhkan bantuan.`,
      tanggal: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14, 10, 0),
      waktuMulai: "10:00",
      waktuSelesai: "12:00",
      lokasi: "Kantor Kelurahan Palmeriam, Jakarta Timur, Jl. Palmeriam No. 1",
      kategori: "Sosial",
      peserta: 100,
    },
    {
      judul: "Musyawarah Rencana Pembangunan di Palmeriam Jakarta Timur",
      deskripsi: `Musyawarah untuk membahas rencana pembangunan infrastruktur dan fasilitas umum di Kelurahan Palmeriam, Jakarta Timur. Acara ini melibatkan perwakilan warga dari seluruh RT/RW di Palmeriam, Jakarta Timur.`,
      tanggal: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 21, 14, 0),
      waktuMulai: "14:00",
      waktuSelesai: "17:00",
      lokasi: "Aula Kantor Kelurahan Palmeriam, Jakarta Timur",
      kategori: "Musyawarah",
      peserta: 60,
    },
    {
      judul: "Kegiatan Bakti Sosial di Palmeriam Jakarta Timur",
      deskripsi: `Kegiatan bakti sosial untuk membantu warga yang membutuhkan di Kelurahan Palmeriam, Jakarta Timur. Kegiatan ini meliputi pemeriksaan kesehatan gratis, pembagian makanan, dan bantuan lainnya untuk warga Palmeriam, Jakarta Timur.`,
      tanggal: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 28, 8, 0),
      waktuMulai: "08:00",
      waktuSelesai: "15:00",
      lokasi: "Lapangan Kelurahan Palmeriam, Jakarta Timur",
      kategori: "Sosial",
      peserta: 150,
    },
  ];

  for (const agenda of agendaData) {
    await prisma.agenda.create({ data: agenda });
  }
  console.log(`✅ Created ${agendaData.length} agenda`);

  console.log("\n✨ Seed completed successfully!");
  console.log(`📊 Summary:`);
  console.log(`   - Berita: ${beritaData.length} items`);
  console.log(`   - Agenda: ${agendaData.length} items`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
