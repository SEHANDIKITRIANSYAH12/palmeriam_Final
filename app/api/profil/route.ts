import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { HttpError } from "@/lib/errors";
import { requireAdmin } from "@/lib/auth-middleware";

// GET: Ambil profil kelurahan, visi & misi
export async function GET() {
  try {
    let profil = await prisma.profilKelurahan.findUnique({
      where: { id: 1 },
    });

    if (!profil) {
      profil = await prisma.profilKelurahan.create({
        data: {
          id: 1,
          tentang:
            "Kelurahan Palmeriam merupakan salah satu kelurahan di Kecamatan Matraman, Kota Administrasi Jakarta Timur, DKI Jakarta. Kami berkomitmen untuk memberikan pelayanan publik yang prima, transparan, akuntabel, dan berbasis teknologi melalui platform SIPALMI.",
          visi: "Mewujudkan Kelurahan Palmeriam yang Modern, Harmonis, Partisipatif, dan Unggul dalam Pelayanan Publik Digital.",
          misi: "1. Meningkatkan kualitas dan kemudahan pelayanan administrasi kependudukan secara cepat dan transparan.\n2. Mendorong partisipasi aktif warga dalam pembangunan lingkungan, gotong royong, dan ketertiban umum.\n3. Mengembangkan pemanfaatan teknologi digital terpadu untuk pelayanan dan pengaduan masyarakat 24 jam.\n4. Memperkuat jaring pengaman sosial, pemberdayaan ekonomi warga, serta kesehatan keluarga.",
          poinPelayanan:
            "Pelayanan cepat dan transparan\nSistem pengaduan 24 jam\nAkses informasi publik real-time\nRamah lansia dan disabilitas",
        },
      });
    }

    return NextResponse.json(profil);
  } catch (error) {
    console.error("Error fetching profil:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data profil dan visi misi" },
      { status: 500 }
    );
  }
}

// PUT: Perbarui profil kelurahan, visi & misi (Admin Only)
export async function PUT(req: NextRequest) {
  try {
    requireAdmin(req);

    const body = await req.json();
    const { tentang, visi, misi, poinPelayanan } = body;

    if (!tentang?.trim() || !visi?.trim() || !misi?.trim()) {
      return NextResponse.json(
        { message: "Tentang, Visi, dan Misi wajib diisi" },
        { status: 400 }
      );
    }

    const updated = await prisma.profilKelurahan.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        tentang: tentang.trim(),
        visi: visi.trim(),
        misi: misi.trim(),
        poinPelayanan: poinPelayanan?.trim() || null,
      },
      update: {
        tentang: tentang.trim(),
        visi: visi.trim(),
        misi: misi.trim(),
        poinPelayanan: poinPelayanan?.trim() || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }
    console.error("Error updating profil:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui data profil kelurahan" },
      { status: 500 }
    );
  }
}
