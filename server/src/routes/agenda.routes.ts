import { Router } from "express";
import { listAgenda, getAgenda, createAgenda, updateAgenda, deleteAgenda } from "../controllers/agenda.controller";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware";

const router = Router();

// Public list/read
router.get("/", listAgenda);
router.get("/:id", getAgenda);

// Admin CRUD
router.post("/", requireAuth, requireAdmin, createAgenda);
router.put("/:id", requireAuth, requireAdmin, updateAgenda);
router.patch("/:id", requireAuth, requireAdmin, updateAgenda);
router.delete("/:id", requireAuth, requireAdmin, deleteAgenda);

export default router;
