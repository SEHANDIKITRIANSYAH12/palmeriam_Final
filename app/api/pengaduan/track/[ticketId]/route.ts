import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { HttpError } from "@/lib/errors";

// GET - Track pengaduan by ticket ID (public)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;
    if (!ticketId) {
      return NextResponse.json(
        { message: "Ticket ID is required" },
        { status: 400 }
      );
    }

    const data = await prisma.pengaduan.findUnique({ 
      where: { ticketId: ticketId.toUpperCase() } 
    });
    
    if (!data) {
      return NextResponse.json(
        { message: "Pengaduan dengan nomor tiket tersebut tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
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
