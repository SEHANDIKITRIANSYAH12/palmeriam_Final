import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { HttpError } from "@/lib/errors";
import { signJwt } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: "username and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = signJwt({ userId: user.id, username: user.username, role: user.role });

    return NextResponse.json({
      token,
      user: { id: user.id, username: user.username, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof HttpError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
