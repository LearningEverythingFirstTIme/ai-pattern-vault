import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const note = await prisma.note.findUnique({
    where: { id, userId: session.user.id },
    include: {
      project: true,
      area: true,
      resource: true,
      connectionsAsSource: {
        include: {
          targetNote: {
            select: {
              id: true,
              title: true,
              tags: true,
            },
          },
        },
      },
      connectionsAsTarget: {
        include: {
          sourceNote: {
            select: {
              id: true,
              title: true,
              tags: true,
            },
          },
        },
      },
    },
  });

  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  return NextResponse.json(note);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { title, content, tags, projectId, areaId, resourceId } = body;

  const existingNote = await prisma.note.findUnique({
    where: { id, userId: session.user.id },
  });

  if (!existingNote) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  const note = await prisma.note.update({
    where: { id },
    data: {
      title: title ?? existingNote.title,
      content: content ?? existingNote.content,
      tags: tags ?? existingNote.tags,
      projectId: projectId !== undefined ? projectId : existingNote.projectId,
      areaId: areaId !== undefined ? areaId : existingNote.areaId,
      resourceId: resourceId !== undefined ? resourceId : existingNote.resourceId,
    },
    include: {
      project: true,
      area: true,
      resource: true,
    },
  });

  return NextResponse.json(note);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existingNote = await prisma.note.findUnique({
    where: { id, userId: session.user.id },
  });

  if (!existingNote) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  await prisma.note.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
