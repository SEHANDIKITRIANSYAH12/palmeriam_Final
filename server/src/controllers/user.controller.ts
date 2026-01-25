import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
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

// Get current user profile
export const getCurrentUser = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) throw new HttpError(401, "Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      username: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) throw new HttpError(404, "User not found");
  res.json(user);
});

// Update current user profile
export const updateProfile = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) throw new HttpError(401, "Unauthorized");

  const body = req.body as {
    name?: string;
    username?: string;
    password?: string;
    currentPassword?: string;
  };

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) throw new HttpError(404, "User not found");

  const updateData: {
    name?: string;
    username?: string;
    password?: string;
  } = {};

  // Update name
  if (body.name !== undefined) {
    updateData.name = body.name;
  }

  // Update username (check if already exists)
  if (body.username !== undefined && body.username !== user.username) {
    const existingUser = await prisma.user.findUnique({ where: { username: body.username } });
    if (existingUser) {
      throw new HttpError(400, "Username sudah digunakan");
    }
    updateData.username = body.username;
  }

  // Update password (require current password)
  if (body.password !== undefined) {
    if (!body.currentPassword) {
      throw new HttpError(400, "Current password is required to change password");
    }

    const isCurrentPasswordValid = await bcrypt.compare(body.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new HttpError(400, "Current password is incorrect");
    }

    if (body.password.length < 6) {
      throw new HttpError(400, "Password must be at least 6 characters");
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    updateData.password = hashedPassword;
  }

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: updateData,
    select: {
      id: true,
      username: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  res.json(updatedUser);
});

// List all users (admin only)
export const listUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(users);
});

// Create new user (admin only)
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as {
    username?: string;
    password?: string;
    name?: string;
    role?: string;
  };

  const { username, password, name } = body;
  if (!username || !password || !name) {
    throw new HttpError(400, "username, password, and name are required");
  }

  // Check if username already exists
  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) {
    throw new HttpError(400, "Username sudah digunakan");
  }

  if (password.length < 6) {
    throw new HttpError(400, "Password must be at least 6 characters");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      name,
      role: body.role || "admin",
    },
    select: {
      id: true,
      username: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  res.status(201).json(user);
});

// Delete user (admin only)
export const deleteUser = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) throw new HttpError(401, "Unauthorized");

  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new HttpError(400, "Invalid user ID");
  }

  // Prevent self-deletion
  if (id === req.user.id) {
    throw new HttpError(400, "Tidak dapat menghapus akun sendiri");
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new HttpError(404, "User not found");

  await prisma.user.delete({ where: { id } });
  res.status(204).send();
});
