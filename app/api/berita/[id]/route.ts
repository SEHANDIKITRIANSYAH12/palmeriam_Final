import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { HttpError } from "@/lib/errors";
import { requireAdmin } from "@/lib/auth-middleware";

// GET - Get berita by ID (public)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const beritaId = Number(id);
    const data = await prisma.berita.findUnique({
      where: { id: beritaId },
      include: { penulis: { select: { id: true, name: true, username: true } } },
    });
    if (!data) {
      return NextResponse.json(
        { message: "Berita not found" },
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

// PUT/PATCH - Update berita (admin only)
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
    const beritaId = Number(id);
    const exists = await prisma.berita.findUnique({ where: { id: beritaId } });
    if (!exists) {
      return NextResponse.json(
        { message: "Berita not found" },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("gambar") as File | null;
    const judul = formData.get("judul") as string | null;
    const konten = formData.get("konten") as string | null;
    const kategori = formData.get("kategori") as string | null;
    const isPublished = formData.get("isPublished");

    const updateData: {
      judul?: string;
      konten?: string;
      kategori?: string;
      gambar?: string;
      isPublished?: boolean;
    } = {};

    if (judul !== null) updateData.judul = judul;
    if (konten !== null) updateData.konten = konten;
    if (kategori !== null) updateData.kategori = kategori;
    if (isPublished !== null) updateData.isPublished = isPublished === "true";

    // Only update gambar if a new file is uploaded
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      updateData.gambar = `data:${file.type};base64,${buffer.toString("base64")}`;
    }

    const data = await prisma.berita.update({
      where: { id: beritaId },
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

// DELETE - Delete berita (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(req);
    const { id } = await params;
    const beritaId = Number(id);
    const exists = await prisma.berita.findUnique({ where: { id: beritaId } });
    if (!exists) {
      return NextResponse.json(
        { message: "Berita not found" },
        { status: 404 }
      );
    }

    await prisma.berita.delete({ where: { id: beritaId } });
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
