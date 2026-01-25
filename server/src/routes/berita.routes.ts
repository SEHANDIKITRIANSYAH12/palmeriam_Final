import { Router } from "express";
import multer from "multer";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware";
import {
  listBerita,
  getBerita,
  createBerita,
  updateBerita,
  deleteBerita,
} from "../controllers/berita.controller";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public list/read
router.get("/", listBerita);
router.get("/:id", getBerita);

// Admin CRUD
router.post("/", requireAuth, requireAdmin, upload.single("gambar"), createBerita);
router.put("/:id", requireAuth, requireAdmin, upload.single("gambar"), updateBerita);
router.patch("/:id", requireAuth, requireAdmin, updateBerita);
router.delete("/:id", requireAuth, requireAdmin, deleteBerita);

export default router;
