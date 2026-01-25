import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { HttpError } from "@/lib/errors";
import { requireAdmin } from "@/lib/auth-middleware";

// Generate ticket ID: SIPALMI-YYYYMMDD-XXXX
function generateTicketId(): string {
  const date = new Date();
  const dateString = date.toISOString().slice(0, 10).replace(/-/g, "");
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SIPALMI-${dateString}-${randomChars}`;
}

// GET - List pengaduan (admin only)
export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    const data = await prisma.pengaduan.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(data);
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

// POST - Create pengaduan (public)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { judul, deskripsi, kategori, pelaporNama } = body;

    if (!judul || !deskripsi || !kategori || !pelaporNama) {
      return NextResponse.json(
        { message: "judul, deskripsi, kategori, pelaporNama are required" },
        { status: 400 }
      );
    }

    // Generate unique ticket ID
    let ticketId = generateTicketId();
    let exists = await prisma.pengaduan.findUnique({ where: { ticketId } });
    
    // Retry jika ticket ID sudah ada (sangat jarang)
    while (exists) {
      ticketId = generateTicketId();
      exists = await prisma.pengaduan.findUnique({ where: { ticketId } });
    }

    // Set prioritas berdasarkan kategori
    let prioritas = body.prioritas || "Sedang";
    if (kategori.toLowerCase().includes("darurat") || kategori.toLowerCase().includes("keamanan")) {
      prioritas = "Tinggi";
    } else if (kategori.toLowerCase().includes("kebersihan") || kategori.toLowerCase().includes("infrastruktur")) {
      prioritas = "Sedang";
    } else {
      prioritas = "Rendah";
    }

    const data = await prisma.pengaduan.create({
      data: {
        ticketId,
        judul,
        deskripsi,
        kategori,
        pelaporNama,
        pelaporKontak: body.pelaporKontak,
        pelaporEmail: body.pelaporEmail,
        lokasi: body.lokasi,
        prioritas,
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
