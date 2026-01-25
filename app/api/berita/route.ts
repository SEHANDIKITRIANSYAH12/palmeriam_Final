import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { HttpError } from "@/lib/errors";
import { requireAdmin } from "@/lib/auth-middleware";

// GET - List berita (public)
export async function GET() {
  try {
    const data = await prisma.berita.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      include: { penulis: { select: { id: true, name: true, username: true } } },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching berita:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST - Create berita (admin only)
export async function POST(req: NextRequest) {
  try {
    const user = requireAdmin(req);
    const formData = await req.formData();
    
    const judul = formData.get("judul") as string;
    const konten = formData.get("konten") as string;
    const kategori = formData.get("kategori") as string;
    const isPublished = formData.get("isPublished") === "true";
    const file = formData.get("gambar") as File | null;

    if (!judul || !konten || !kategori) {
      return NextResponse.json(
        { message: "judul, konten, kategori are required" },
        { status: 400 }
      );
    }

    let gambar: string | undefined;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      gambar = `data:${file.type};base64,${buffer.toString("base64")}`;
    }

    const data = await prisma.berita.create({
      data: {
        judul,
        konten,
        kategori,
        gambar,
        isPublished: Boolean(isPublished),
        penulisId: user.id,
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
