import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { HttpError } from "@/lib/errors";
import { requireAdmin } from "@/lib/auth-middleware";

// GET - Get pengaduan by ID (admin only)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(req);
    const { id } = await params;
    const pengaduanId = Number(id);
    const data = await prisma.pengaduan.findUnique({ where: { id: pengaduanId } });
    if (!data) {
      return NextResponse.json(
        { message: "Pengaduan not found" },
        { status: 404 }
      );
    }
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

// PATCH - Update pengaduan (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(req);
    const { id } = await params;
    const pengaduanId = Number(id);
    const body = await req.json();

    const exists = await prisma.pengaduan.findUnique({ where: { id: pengaduanId } });
    if (!exists) {
      return NextResponse.json(
        { message: "Pengaduan not found" },
        { status: 404 }
      );
    }

    const updateData: {
      judul?: string;
      deskripsi?: string;
      kategori?: string;
      pelaporNama?: string;
      pelaporKontak?: string;
      lokasi?: string;
      prioritas?: string;
      status?: string;
    } = {};

    if (body.judul !== undefined) updateData.judul = body.judul;
    if (body.deskripsi !== undefined) updateData.deskripsi = body.deskripsi;
    if (body.kategori !== undefined) updateData.kategori = body.kategori;
    if (body.pelaporNama !== undefined) updateData.pelaporNama = body.pelaporNama;
    if (body.pelaporKontak !== undefined) updateData.pelaporKontak = body.pelaporKontak;
    if (body.lokasi !== undefined) updateData.lokasi = body.lokasi;
    if (body.prioritas !== undefined) updateData.prioritas = body.prioritas;
    if (body.status !== undefined) updateData.status = body.status;

    const data = await prisma.pengaduan.update({
      where: { id: pengaduanId },
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

// DELETE - Delete pengaduan (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(req);
    const { id } = await params;
    const pengaduanId = Number(id);
    const exists = await prisma.pengaduan.findUnique({ where: { id: pengaduanId } });
    if (!exists) {
      return NextResponse.json(
        { message: "Pengaduan not found" },
        { status: 404 }
      );
    }

    await prisma.pengaduan.delete({ where: { id: pengaduanId } });
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
