import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { HttpError } from "@/lib/errors";
import { requireAdmin } from "@/lib/auth-middleware";

// GET - Get agenda by ID (public)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const agendaId = Number(id);
    const data = await prisma.agenda.findUnique({ where: { id: agendaId } });
    if (!data) {
      return NextResponse.json(
        { message: "Agenda not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT/PATCH - Update agenda (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return PATCH(req, { params });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(req);
    const { id } = await params;
    const agendaId = Number(id);
    const exists = await prisma.agenda.findUnique({ where: { id: agendaId } });
    if (!exists) {
      return NextResponse.json(
        { message: "Agenda not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const updateData: {
      judul?: string;
      deskripsi?: string;
      tanggal?: Date;
      waktuMulai?: string;
      waktuSelesai?: string;
      lokasi?: string;
      kategori?: string;
      peserta?: number;
    } = {};

    if (body.judul !== undefined) updateData.judul = body.judul;
    if (body.deskripsi !== undefined) updateData.deskripsi = body.deskripsi;
    if (body.tanggal !== undefined) updateData.tanggal = new Date(body.tanggal);
    if (body.waktuMulai !== undefined) updateData.waktuMulai = body.waktuMulai;
    if (body.waktuSelesai !== undefined) updateData.waktuSelesai = body.waktuSelesai;
    if (body.lokasi !== undefined) updateData.lokasi = body.lokasi;
    if (body.kategori !== undefined) updateData.kategori = body.kategori;
    if (typeof body.peserta === "number") updateData.peserta = body.peserta;

    const data = await prisma.agenda.update({
      where: { id: agendaId },
      data: updateData,
    });

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

// DELETE - Delete agenda (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(req);
    const { id } = await params;
    const agendaId = Number(id);
    const exists = await prisma.agenda.findUnique({ where: { id: agendaId } });
    if (!exists) {
      return NextResponse.json(
        { message: "Agenda not found" },
        { status: 404 }
      );
    }

    await prisma.agenda.delete({ where: { id: agendaId } });
    return new NextResponse(null, { status: 204 });
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
