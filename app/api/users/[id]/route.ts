import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { HttpError } from "@/lib/errors";
import { requireAdmin } from "@/lib/auth-middleware";

// DELETE - Delete user (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAdmin(req);
    const { id } = await params;
    const userId = Number(id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { message: "Invalid user ID" },
        { status: 400 }
      );
    }

    // Prevent self-deletion
    if (userId === user.id) {
      return NextResponse.json(
        { message: "Tidak dapat menghapus akun sendiri" },
        { status: 400 }
      );
    }

    const userData = await prisma.user.findUnique({ where: { id: userId } });
    if (!userData) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    await prisma.user.delete({ where: { id: userId } });
    return new NextResponse(null, { status: 204 });
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
