import { NextRequest, NextResponse } from "next/server";

const BASE_SYSTEM_INSTRUCTION = `
Anda adalah Asisten Virtual AI Resmi bernama "SIPALMI AI" untuk Kelurahan Palmeriam, Kecamatan Matraman, Kota Administrasi Jakarta Timur, DKI Jakarta.

Tugas dan Peran:
- Memberikan informasi akurat, ramah, sopan, dan jelas mengenai layanan administrasi kelurahan, pengaduan masyarakat, serta kehidupan kemasyarakatan di Palmeriam.
- Menggunakan Bahasa Indonesia yang baik, santun, dan mudah dipahami oleh warga dari berbagai kalangan.
- Memberikan jawaban berpoin/terstruktur ketika menjelaskan syarat dan prosedur pelayanan agar mudah dibaca.

Informasi Resmi Kelurahan Palmeriam:
1. Lokasi & Kontak:
   - Alamat: Jl. Palmeriam No. 1, RT.01/RW.01, Kelurahan Palmeriam, Kecamatan Matraman, Jakarta Timur, DKI Jakarta 13420.
   - Jam Pelayanan Kantor: Senin s.d. Jumat, pukul 08:00 - 16:00 WIB (Istirahat 12:00 - 13:00 WIB). Sabtu, Minggu, dan Hari Libur Nasional tutup.
   - Telepon Kantor: (021) 1234-5678.
   - Email: kelurahan.palmeriam@jakarta.go.id.

2. Layanan Utama & Persyaratan:
   a. KTP-el (Kartu Tanda Penduduk Elektronik):
      - Perekaman baru (usia 17 tahun): Fotokopi KK asli, Surat Pengantar RT/RW.
      - KTP Rusak/Hilang: Surat kehilangan dari Polsek (jika hilang), KTP lama fisik (jika rusak), Fotokopi KK.
      - Layanan KTP 100% GRATIS tanpa pungutan biaya.
   b. Kartu Keluarga (KK):
      - Penambahan anggota / pecah KK: Surat Pengantar RT/RW, Buku Nikah/Akta Perkawinan (jika ada), Akta Kelahiran anak, KK lama asli.
   c. Surat Keterangan Domisili:
      - Surat Pengantar RT/RW, Fotokopi KTP, Fotokopi KK.
   d. Surat Keterangan Usaha (SKU):
      - Surat Pengantar RT/RW dengan keterangan jenis usaha, Fotokopi KTP & KK, foto tempat usaha/kegiatan.
   e. Surat Keterangan Tidak Mampu (SKTM):
      - Surat Pengantar RT/RW, Fotokopi KK & KTP, untuk keperluan beasiswa, KJP Plus, atau keringanan biaya RS/BPJS PBI.
   f. Surat Pengantar Nikah (Model N1-N4):
      - Surat Pengantar RT/RW, Fotokopi KTP & KK kedua calon mempelai, Akta Kelahiran, Ijazah terakhir, pas foto.
   g. Akta Kelahiran & Akta Kematian:
      - Akta Kelahiran: Surat keterangan lahir dari RS/Bidan, KK asli, KTP orang tua, Buku Nikah orang tua.
      - Akta Kematian: Surat keterangan kematian dari RS/Puskesmas/RT-RW, KK asli almarhum, KTP almarhum.

3. Layanan Portal SIPALMI:
   - Pengaduan Online: Warga dapat membuat laporan pengaduan langsung melalui website SIPALMI di menu "Pengaduan". Warga akan mendapatkan Tiket ID (contoh format: SIPALMI-20261014-0001) untuk melacak progress penyelesaiannya.
   - Berita & Pengumuman: Update kegiatan kerja bakti, posyandu, vaksinasi, dan informasi penting lainnya.
   - Layanan & Informasi: Panduan lengkap persyaratan dokumen sebelum datang ke kelurahan.

Aturan Respon:
- Jika ditanya hal di luar wewenang kelurahan atau informasi umum, jawablah dengan sopan dan arahkan ke instansi terkait jika relevan.
- Selalu jaga keramahtamahan khas pelayan masyarakat.
- Jangan mengarang persyaratan baru; jika tidak yakin, sarankan warga membawa berkas umum (KTP, KK, Surat Pengantar RT/RW) dan menghubungi kantor kelurahan pada jam kerja.
`.trim();

// Fungsi untuk mengecek waktu operasional kantor (WIB / Asia/Jakarta)
function checkOperationalHours() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(now);

  const weekday = parts.find((p) => p.type === "weekday")?.value || "";
  const hour = parseInt(parts.find((p) => p.type === "hour")?.value || "0", 10);
  const minute = parts.find((p) => p.type === "minute")?.value || "00";

  const isWeekend = weekday === "Sat" || weekday === "Sun";
  const isWorkHours = !isWeekend && hour >= 8 && hour < 16;

  const timeString = `${String(hour).padStart(2, "0")}:${minute} WIB`;
  const daysIndo: Record<string, string> = {
    Sun: "Minggu",
    Mon: "Senin",
    Tue: "Selasa",
    Wed: "Rabu",
    Thu: "Kamis",
    Fri: "Jumat",
    Sat: "Sabtu",
  };
  const dayIndo = daysIndo[weekday] || weekday;

  // Tentukan salam waktu (Pagi/Siang/Sore/Malam)
  let greetingTime = "Malam";
  if (hour >= 5 && hour < 11) greetingTime = "Pagi";
  else if (hour >= 11 && hour < 15) greetingTime = "Siang";
  else if (hour >= 15 && hour < 18) greetingTime = "Sore";

  return {
    isWorkHours,
    dayIndo,
    hour,
    greetingTime,
    timeString,
    currentTimeDesc: `${dayIndo}, pukul ${timeString}`,
  };
}

// Fallback response jika API key belum diisi atau kuota habis
function getLocalFallback(
  query: string,
  isWorkHours: boolean,
  currentTimeDesc: string,
  greetingTime: string
): string {
  const q = query.toLowerCase();

  let outOfHoursGreeting = "";
  if (!isWorkHours) {
    outOfHoursGreeting = `Selamat ${greetingTime}! Terima kasih telah menghubungi SIPALMI Kelurahan Palmeriam. 🙏\n\nSaat ini (${currentTimeDesc}), kantor pelayanan fisik Kelurahan Palmeriam sedang **berada di luar jam operasional** (Jam kerja: Senin - Jumat, pukul 08:00 - 16:00 WIB).\n\nNamun, asisten AI SIPALMI siap membantu Anda dengan informasi awal di bawah ini. Pelayanan tatap muka atau tindak lanjut berkas oleh petugas kelurahan akan dilayani kembali pada hari dan jam kerja berikutnya.\n\n---\n\n`;
  }

  let answer = "";
  if (q.includes("jam") || q.includes("buka") || q.includes("operasional")) {
    answer =
      "Kantor Kelurahan Palmeriam buka setiap hari Senin - Jumat pukul 08:00 - 16:00 WIB. Kantor tutup pada hari Sabtu, Minggu, dan hari libur nasional.";
  } else if (q.includes("domisili")) {
    answer =
      "Untuk Surat Keterangan Domisili, persyaratannya:\n1. Surat Pengantar RT/RW\n2. Fotokopi KTP & KK\n3. Pas foto 3x4 (2 lembar)\nPelayanan gratis dan diproses di kantor kelurahan pada jam kerja.";
  } else if (q.includes("ktp") || q.includes("identitas")) {
    answer =
      "Untuk pengurusan KTP-el di Kelurahan Palmeriam:\n1. Surat Pengantar RT/RW\n2. Kartu Keluarga asli/fotokopi\n3. Surat kehilangan dari kepolisian jika KTP hilang\nPelayanan KTP gratis tanpa dipungut biaya apa pun.";
  } else if (
    q.includes("lokasi") ||
    q.includes("alamat") ||
    q.includes("alamat kantor") ||
    q.includes("dimana")
  ) {
    answer =
      "Kantor Kelurahan Palmeriam berlokasi di Jl. Palmeriam No. 1, Kecamatan Matraman, Jakarta Timur, DKI Jakarta 13420. Telp: (021) 1234-5678.";
  } else if (q.includes("pengaduan") || q.includes("lapor") || q.includes("tiket")) {
    answer =
      "Anda dapat mengajukan pengaduan kapan saja (24 jam) melalui menu 'Pengaduan' di website SIPALMI. Setelah mengisi formulir, Anda akan mendapatkan Nomor Tiket untuk melacak tindak lanjut petugas pada jam kerja.";
  } else if (q.includes("sktm") || q.includes("tidak mampu")) {
    answer =
      "Persyaratan SKTM (Surat Keterangan Tidak Mampu):\n1. Surat Pengantar RT/RW\n2. Fotokopi KTP & KK\n3. Surat pernyataan ketidakmampuan bermeterai (jika diminta)\nDigunakan untuk keperluan pendidikan (KJP), kesehatan, atau bantuan sosial.";
  } else {
    answer =
      "Anda dapat menanyakan tentang syarat KTP, KK, SKTM, Surat Domisili, jadwal kantor kelurahan, atau tata cara pengaduan online. Jika Anda memerlukan pengurusan langsung oleh petugas, silakan datang ke kantor Kelurahan Palmeriam saat jam pelayanan dibuka (Senin-Jumat 08:00 - 16:00 WIB).";
  }

  return `${outOfHoursGreeting}${answer}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.message?.trim();
    const history = Array.isArray(body.history) ? body.history : [];

    if (!message) {
      return NextResponse.json(
        { error: "Pesan tidak boleh kosong" },
        { status: 400 }
      );
    }

    const opStatus = checkOperationalHours();
    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";

    // Modifikasi instruksi sistem sesuai status jam operasional saat ini
    let dynamicSystemInstruction = BASE_SYSTEM_INSTRUCTION;
    if (!opStatus.isWorkHours) {
      dynamicSystemInstruction += `\n\n[PENTING - KONDISI SAAT INI: DI LUAR JAM OPERASIONAL RESMI KANTOR]:
- Waktu setempat saat ini di Jakarta: ${opStatus.currentTimeDesc}.
- Status Kantor Kelurahan Palmeriam: SEDANG TUTUP / DI LUAR JAM KERJA (Jam operasional: Senin s.d. Jumat, 08:00 - 16:00 WIB).
- ATURAN KHUSUS RESPOON DI LUAR JAM KERJA:
  1. Awali respon dengan salam yang santun dan hangat (contoh: "Selamat ${opStatus.greetingTime}! Terima kasih telah menghubungi SIPALMI...").
  2. Beritahukan dengan sopan dan jelas bahwa saat ini kantor pelayanan Kelurahan Palmeriam sedang berada di luar jam operasional.
  3. Berikan penegasan yang menenangkan bahwa Anda sebagai asisten AI tetap siap melayani 24 jam untuk memberikan informasi persyaratan, panduan surat, dan konsultasi alur layanan.
  4. Ingatkan bahwa untuk pelayanan berkas fisik, tatap muka, atau verifikasi langsung oleh petugas kelurahan akan diproses pada hari kerja berikutnya (Senin-Jumat, pukul 08:00 - 16:00 WIB).
  5. Jika warga memiliki laporan/aduan, warga tetap dapat mengisi formulir di menu 'Pengaduan' website SIPALMI kapan saja, dan laporan akan segera ditindaklanjuti petugas begitu kantor buka.
  6. Setelah pemberitahuan tersebut, tetap jawab pertanyaan warga secara lengkap, runtut, dan informatif.`;
    } else {
      dynamicSystemInstruction += `\n\n[KONDISI SAAT INI: JAM OPERASIONAL AKTIF]:
- Waktu setempat saat ini: ${opStatus.currentTimeDesc}.
- Kantor Kelurahan Palmeriam saat ini sedang BUKA dan melayani masyarakat (08:00 - 16:00 WIB).
- Berikan pelayanan ramah dan informasikan warga dapat langsung datang ke kantor atau mengurus via website.`;
    }

    // Jika API Key belum diset di .env
    if (!apiKey || apiKey === "your-gemini-api-key-here") {
      const fallbackReply = getLocalFallback(
        message,
        opStatus.isWorkHours,
        opStatus.currentTimeDesc,
        opStatus.greetingTime
      );
      return NextResponse.json({
        reply: fallbackReply,
        isAi: false,
        isWorkHours: opStatus.isWorkHours,
        currentTime: opStatus.currentTimeDesc,
        warning:
          "API Key Gemini belum diset. Tambahkan GEMINI_API_KEY di file .env untuk mengaktifkan AI asli (gratis di https://aistudio.google.com/app/apikey).",
      });
    }

    // Format riwayat chat untuk Gemini REST API
    const contents = [
      ...history
        .slice(-8)
        .map((item: { role: string; content: string }) => ({
          role: item.role === "assistant" || item.role === "model" ? "model" : "user",
          parts: [{ text: item.content }],
        }))
        .filter((item: { role: string; parts: { text: string }[] }) => item.parts[0]?.text),
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    // Panggil Google Gemini REST API langsung (cepat, stabil & hemat memori)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: dynamicSystemInstruction }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errData = await geminiRes.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Gemini API returned status ${geminiRes.status}`);
    }

    const geminiData = await geminiRes.json();
    const responseText =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Maaf, tidak ada tanggapan yang dihasilkan.";

    return NextResponse.json({
      reply: responseText,
      isAi: true,
      model: modelName,
      isWorkHours: opStatus.isWorkHours,
      currentTime: opStatus.currentTimeDesc,
    });
  } catch (error: unknown) {
    console.error("Gemini API Error:", error);

    const opStatus = checkOperationalHours();
    const rawMessage = (await req.clone().json().catch(() => ({})))?.message || "";
    const fallbackReply = getLocalFallback(
      rawMessage,
      opStatus.isWorkHours,
      opStatus.currentTimeDesc,
      opStatus.greetingTime
    );

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({
      reply: `${fallbackReply}\n\n*(Catatan: Terjadi kendala teknis jaringan AI: ${errorMessage}. Menggunakan data cadangan kelurahan).*`,
      isAi: false,
      isWorkHours: opStatus.isWorkHours,
      currentTime: opStatus.currentTimeDesc,
      error: errorMessage,
    });
  }
}
