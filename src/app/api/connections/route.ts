import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { sourceNoteId, targetNoteId, strength } = body;

  if (!sourceNoteId || !targetNoteId) {
    return NextResponse.json(
      { error: "Source and target note IDs are required" },
      { status: 400 }
    );
  }

  // Verify both notes belong to the user
  const [sourceNote, targetNote] = await Promise.all([
    prisma.note.findUnique({
      where: { id: sourceNoteId, userId: session.user.id },
    }),
    prisma.note.findUnique({
      where: { id: targetNoteId, userId: session.user.id },
    }),
  ]);

  if (!sourceNote || !targetNote) {
    return NextResponse.json(
      { error: "One or both notes not found" },
      { status: 404 }
    );
  }

  // Check if connection already exists
  const existingConnection = await prisma.connection.findUnique({
    where: {
      sourceNoteId_targetNoteId: {
        sourceNoteId,
        targetNoteId,
      },
    },
  });

  if (existingConnection) {
    return NextResponse.json(
      { error: "Connection already exists" },
      { status: 409 }
    );
  }

  const connection = await prisma.connection.create({
    data: {
      sourceNoteId,
      targetNoteId,
      strength: strength || 1,
    },
    include: {
      sourceNote: {
        select: { id: true, title: true },
      },
      targetNote: {
        select: { id: true, title: true },
      },
    },
  });

  return NextResponse.json(connection, { status: 201 });
}
