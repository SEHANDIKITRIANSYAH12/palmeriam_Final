import { Router } from "express";
import {
  getCurrentUser,
  updateProfile,
  listUsers,
  createUser,
  deleteUser,
} from "../controllers/user.controller";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware";

const router = Router();

// Profile endpoints (authenticated users)
router.get("/me", requireAuth, getCurrentUser);
router.patch("/me", requireAuth, updateProfile);

// User management endpoints (admin only)
router.get("/", requireAuth, requireAdmin, listUsers);
router.post("/", requireAuth, requireAdmin, createUser);
router.delete("/:id", requireAuth, requireAdmin, deleteUser);

export default router;
