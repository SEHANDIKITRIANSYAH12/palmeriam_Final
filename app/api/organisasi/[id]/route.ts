import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { HttpError } from "@/lib/errors";
import { requireAdmin } from "@/lib/auth-middleware";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// PUT: Perbarui data struktur organisasi (Admin Only)
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    requireAdmin(req);
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const body = await req.json();
    const { nama, jabatan, deskripsi, foto, urutan, isAktif } = body;

    if (!nama?.trim() || !jabatan?.trim()) {
      return NextResponse.json(
        { message: "Nama dan Jabatan wajib diisi" },
        { status: 400 }
      );
    }

    const updated = await prisma.strukturOrganisasi.update({
      where: { id },
      data: {
        nama: nama.trim(),
        jabatan: jabatan.trim(),
        deskripsi: deskripsi?.trim() || null,
        foto: foto !== undefined ? foto?.trim() || null : undefined,
        urutan: Number(urutan) || 0,
        isAktif: typeof isAktif === "boolean" ? isAktif : true,
      },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }
    console.error("Error updating organisasi:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui data struktur organisasi" },
      { status: 500 }
    );
  }
}

// DELETE: Hapus data struktur organisasi (Admin Only)
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    requireAdmin(req);
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
    }

    await prisma.strukturOrganisasi.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Data berhasil dihapus" });
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }
    console.error("Error deleting organisasi:", error);
    return NextResponse.json(
      { message: "Gagal menghapus data struktur organisasi" },
      { status: 500 }
    );
  }
}
