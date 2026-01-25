import type { Request, Response } from "express";
import prisma from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpError } from "../middlewares/error.middleware";

type AuthedRequest = Request & {
  user?: {
    id: number;
    username: string;
    role: string;
  };
};

export const listBerita = asyncHandler(async (_req: Request, res: Response) => {
  const data = await prisma.berita.findMany({
    orderBy: { createdAt: "desc" },
    include: { penulis: { select: { id: true, name: true, username: true } } },
  });
  res.json(data);
});

export const getBerita = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = await prisma.berita.findUnique({
    where: { id },
    include: { penulis: { select: { id: true, name: true, username: true } } },
  });
  if (!data) throw new HttpError(404, "Berita not found");
  res.json(data);
});

export const createBerita = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) throw new HttpError(401, "Unauthorized");

  const { judul, konten, kategori, isPublished } = req.body;
  if (!judul || !konten || !kategori) {
    throw new HttpError(400, "judul, konten, kategori are required");
  }

  let gambar: string | undefined;
  if (req.file) {
    // Simpan base64 string dari multer memory storage
    gambar = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
  }

  const data = await prisma.berita.create({
    data: {
      judul,
      konten,
      kategori,
      gambar,
      isPublished: Boolean(isPublished),
      penulisId: req.user.id,
    },
  });

  res.status(201).json(data);
});

export const updateBerita = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const id = Number(req.params.id);
  const exists = await prisma.berita.findUnique({ where: { id } });
  if (!exists) throw new HttpError(404, "Berita not found");

  const { judul, konten, kategori, isPublished } = req.body;

  const updateData: {
    judul?: string;
    konten?: string;
    kategori?: string;
    gambar?: string;
    isPublished?: boolean;
  } = {};

  if (judul !== undefined) updateData.judul = judul;
  if (konten !== undefined) updateData.konten = konten;
  if (kategori !== undefined) updateData.kategori = kategori;
  if (typeof isPublished === "boolean") updateData.isPublished = isPublished;

  // Only update gambar if a new file is uploaded
  if (req.file) {
    updateData.gambar = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
  }

  const data = await prisma.berita.update({
    where: { id },
    data: updateData,
  });

  res.json(data);
});

export const deleteBerita = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const exists = await prisma.berita.findUnique({ where: { id } });
  if (!exists) throw new HttpError(404, "Berita not found");

  await prisma.berita.delete({ where: { id } });
  res.status(204).send();
});
