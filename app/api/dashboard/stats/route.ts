import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { HttpError } from "@/lib/errors";
import { requireAdmin } from "@/lib/auth-middleware";

// GET - Get dashboard stats (admin only)
export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    const [totalPengaduan, totalBerita, totalAgenda, selesaiPengaduan, pengaduanTerbaru] = await Promise.all([
      prisma.pengaduan.count(),
      prisma.berita.count(),
      prisma.agenda.count(),
      prisma.pengaduan.count({ where: { status: "Selesai" } }),
      prisma.pengaduan.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

    return NextResponse.json({
      totalPengaduan,
      selesaiPengaduan,
      totalBerita,
      totalAgenda,
      pengaduanTerbaru,
    });
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
