import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { HttpError } from "@/lib/errors";
import { requireAuth } from "@/lib/auth-middleware";

// GET - Get current user profile
export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!userData) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(userData);
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PATCH - Update current user profile
export async function PATCH(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const body = await req.json();

    const userData = await prisma.user.findUnique({ where: { id: user.id } });
    if (!userData) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

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
    if (body.username !== undefined && body.username !== userData.username) {
      const existingUser = await prisma.user.findUnique({ where: { username: body.username } });
      if (existingUser) {
        return NextResponse.json(
          { message: "Username sudah digunakan" },
          { status: 400 }
        );
      }
      updateData.username = body.username;
    }

    // Update password (require current password)
    if (body.password !== undefined) {
      if (!body.currentPassword) {
        return NextResponse.json(
          { message: "Current password is required to change password" },
          { status: 400 }
        );
      }

      const bcrypt = await import("bcryptjs");
      const isCurrentPasswordValid = await bcrypt.compare(body.currentPassword, userData.password);
      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { message: "Current password is incorrect" },
          { status: 400 }
        );
      }

      if (body.password.length < 6) {
        return NextResponse.json(
          { message: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(body.password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
