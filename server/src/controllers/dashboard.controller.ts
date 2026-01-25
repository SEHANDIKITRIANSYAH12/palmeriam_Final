import type { Request, Response } from "express";
import prisma from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";

export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const [totalPengaduan, totalBerita, totalAgenda, selesaiPengaduan, pengaduanTerbaru] = await Promise.all([
    prisma.pengaduan.count(),
    prisma.berita.count(),
    prisma.agenda.count(),
    prisma.pengaduan.count({ where: { status: "Selesai" } }),
    prisma.pengaduan.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  res.json({
    totalPengaduan,
    selesaiPengaduan,
    totalBerita,
    totalAgenda,
    pengaduanTerbaru,
  });
});
