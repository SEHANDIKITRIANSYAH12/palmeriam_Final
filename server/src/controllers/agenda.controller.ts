import type { Request, Response } from "express";
import prisma from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpError } from "../middlewares/error.middleware";

export const listAgenda = asyncHandler(async (_req: Request, res: Response) => {
  const data = await prisma.agenda.findMany({ orderBy: { tanggal: "asc" } });
  res.json(data);
});

export const getAgenda = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = await prisma.agenda.findUnique({ where: { id } });
  if (!data) throw new HttpError(404, "Agenda not found");
  res.json(data);
});

export const createAgenda = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as {
    judul?: string;
    deskripsi?: string;
    tanggal?: string;
    waktuMulai?: string;
    waktuSelesai?: string;
    lokasi?: string;
    kategori?: string;
    peserta?: number;
  };

  const { judul, deskripsi, tanggal, waktuMulai, waktuSelesai, lokasi, kategori } = body;
  if (!judul || !deskripsi || !tanggal || !waktuMulai || !waktuSelesai || !lokasi || !kategori) {
    throw new HttpError(400, "Missing required fields");
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

  res.status(201).json(data);
});

export const updateAgenda = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const exists = await prisma.agenda.findUnique({ where: { id } });
  if (!exists) throw new HttpError(404, "Agenda not found");

  const body = req.body as {
    judul?: string;
    deskripsi?: string;
    tanggal?: string;
    waktuMulai?: string;
    waktuSelesai?: string;
    lokasi?: string;
    kategori?: string;
    peserta?: number;
  };

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
    where: { id },
    data: updateData,
  });

  res.json(data);
});

export const deleteAgenda = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const exists = await prisma.agenda.findUnique({ where: { id } });
  if (!exists) throw new HttpError(404, "Agenda not found");

  await prisma.agenda.delete({ where: { id } });
  res.status(204).send();
});
