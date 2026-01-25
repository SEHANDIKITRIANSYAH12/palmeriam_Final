import type { Request, Response } from "express";
import prisma from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpError } from "../middlewares/error.middleware";

// Generate ticket ID: SIPALMI-YYYYMMDD-XXXX
function generateTicketId(): string {
  const date = new Date();
  const dateString = date.toISOString().slice(0, 10).replace(/-/g, "");
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SIPALMI-${dateString}-${randomChars}`;
}

export const listPengaduan = asyncHandler(async (_req: Request, res: Response) => {
  const data = await prisma.pengaduan.findMany({ orderBy: { createdAt: "desc" } });
  res.json(data);
});

export const getPengaduan = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = await prisma.pengaduan.findUnique({ where: { id } });
  if (!data) throw new HttpError(404, "Pengaduan not found");
  res.json(data);
});

// Public endpoint untuk tracking pengaduan berdasarkan ticket ID
export const trackPengaduan = asyncHandler(async (req: Request, res: Response) => {
  const ticketId = req.params.ticketId;
  if (!ticketId) {
    throw new HttpError(400, "Ticket ID is required");
  }

  const data = await prisma.pengaduan.findUnique({ 
    where: { ticketId: ticketId.toUpperCase() } 
  });
  
  if (!data) {
    throw new HttpError(404, "Pengaduan dengan nomor tiket tersebut tidak ditemukan");
  }

  res.json(data);
});

export const createPengaduan = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as {
    judul?: string;
    deskripsi?: string;
    kategori?: string;
    pelaporNama?: string;
    pelaporKontak?: string;
    pelaporEmail?: string;
    lokasi?: string;
    prioritas?: string;
  };

  const { judul, deskripsi, kategori, pelaporNama } = body;
  if (!judul || !deskripsi || !kategori || !pelaporNama) {
    throw new HttpError(400, "judul, deskripsi, kategori, pelaporNama are required");
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

  res.status(201).json(data);
});

export const updatePengaduan = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const body = req.body as {
    judul?: string;
    deskripsi?: string;
    kategori?: string;
    pelaporNama?: string;
    pelaporKontak?: string;
    lokasi?: string;
    prioritas?: string;
    status?: string;
  };

  const exists = await prisma.pengaduan.findUnique({ where: { id } });
  if (!exists) throw new HttpError(404, "Pengaduan not found");

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
    where: { id },
    data: updateData,
  });

  res.json(data);
});

export const deletePengaduan = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const exists = await prisma.pengaduan.findUnique({ where: { id } });
  if (!exists) throw new HttpError(404, "Pengaduan not found");

  await prisma.pengaduan.delete({ where: { id } });
  res.status(204).send();
});
