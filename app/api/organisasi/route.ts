import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { HttpError } from "@/lib/errors";
import { requireAdmin } from "@/lib/auth-middleware";

// GET: Ambil daftar struktur organisasi
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";

    const where = all ? {} : { isAktif: true };
    const data = await prisma.strukturOrganisasi.findMany({
      where,
      orderBy: [{ urutan: "asc" }, { id: "asc" }],
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching organisasi:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data struktur organisasi" },
      { status: 500 }
    );
  }
}

// POST: Tambah perangkat kelurahan baru (Admin Only)
export async function POST(req: NextRequest) {
  try {
    requireAdmin(req);

    const body = await req.json();
    const { nama, jabatan, deskripsi, foto, urutan, isAktif } = body;

    if (!nama?.trim() || !jabatan?.trim()) {
      return NextResponse.json(
        { message: "Nama dan Jabatan wajib diisi" },
        { status: 400 }
      );
    }

    const newMember = await prisma.strukturOrganisasi.create({
      data: {
        nama: nama.trim(),
        jabatan: jabatan.trim(),
        deskripsi: deskripsi?.trim() || null,
        foto: foto?.trim() || null,
        urutan: Number(urutan) || 0,
        isAktif: typeof isAktif === "boolean" ? isAktif : true,
      },
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }
    console.error("Error creating organisasi:", error);
    return NextResponse.json(
      { message: "Gagal menambahkan data struktur organisasi" },
      { status: 500 }
    );
  }
}
