import { Router } from "express";
import {
  listPengaduan,
  getPengaduan,
  createPengaduan,
  updatePengaduan,
  deletePengaduan,
  trackPengaduan,
} from "../controllers/pengaduan.controller";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware";

const router = Router();

// Public endpoints
router.post("/", createPengaduan); // Warga mengirim pengaduan
router.get("/track/:ticketId", trackPengaduan); // Public tracking berdasarkan ticket ID

// Admin endpoints
router.get("/", requireAuth, requireAdmin, listPengaduan);
router.get("/:id", requireAuth, requireAdmin, getPengaduan);
router.patch("/:id", requireAuth, requireAdmin, updatePengaduan);
router.delete("/:id", requireAuth, requireAdmin, deletePengaduan);

export default router;
