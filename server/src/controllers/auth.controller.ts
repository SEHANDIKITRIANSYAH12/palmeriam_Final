import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpError } from "../middlewares/error.middleware";
import { signJwt } from "../utils/jwt";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body as { username?: string; password?: string };

  if (!username || !password) {
    throw new HttpError(400, "username and password are required");
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new HttpError(401, "Invalid credentials");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new HttpError(401, "Invalid credentials");

  const token = signJwt({ userId: user.id, username: user.username, role: user.role });

  res.json({
    token,
    user: { id: user.id, username: user.username, name: user.name, role: user.role },
  });
});
