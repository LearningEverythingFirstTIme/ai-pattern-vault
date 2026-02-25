import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { question, response } = body;

    if (!question || !response) {
      return NextResponse.json(
        { error: "Question and response are required" },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyPrompt = await prisma.dailyPrompt.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: today,
        },
      },
      update: {
        response: response.trim(),
        completed: true,
      },
      create: {
        date: today,
        question: question.trim(),
        response: response.trim(),
        completed: true,
        userId: user.id,
      },
    });

    // Also create a note from the response
    await prisma.note.create({
      data: {
        title: `Daily: ${question}`,
        content: response.trim(),
        tags: ["NOTE"],
        source: "JOURNAL",
        userId: user.id,
      },
    });

    return NextResponse.json(dailyPrompt, { status: 201 });
  } catch (error) {
    console.error("Error saving daily prompt:", error);
    return NextResponse.json(
      { error: "Failed to save daily prompt" },
      { status: 500 }
    );
  }
}
