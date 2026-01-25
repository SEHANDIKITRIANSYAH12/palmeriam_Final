import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { HttpError } from "@/lib/errors";
import { requireAdmin } from "@/lib/auth-middleware";

// GET - List agenda (public)
export async function GET() {
  try {
    const data = await prisma.agenda.findMany({ orderBy: { tanggal: "asc" } });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST - Create agenda (admin only)
export async function POST(req: NextRequest) {
  try {
    requireAdmin(req);
    const body = await req.json();
    const { judul, deskripsi, tanggal, waktuMulai, waktuSelesai, lokasi, kategori } = body;

    if (!judul || !deskripsi || !tanggal || !waktuMulai || !waktuSelesai || !lokasi || !kategori) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const data = await prisma.agenda.create({
      data: {
        judul,
        deskripsi,
        tanggal: new Date(tanggal),
        waktuMulai,
        waktuSelesai,
        lokasi,
        kategori,
        peserta: typeof body.peserta === "number" ? body.peserta : 0,
      },
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
