import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notes = await prisma.note.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      project: true,
      area: true,
      resource: true,
      _count: {
        select: { connectionsAsSource: true, connectionsAsTarget: true },
      },
    },
  });

  return NextResponse.json(notes);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, content, tags, source, projectId, areaId, resourceId } = body;

  const note = await prisma.note.create({
    data: {
      title,
      content,
      tags: tags || ["NOTE"],
      source: source || "MANUAL",
      userId,
      projectId,
      areaId,
      resourceId,
    },
  });

  return NextResponse.json(note);
}
