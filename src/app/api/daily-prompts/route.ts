import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const DAILY_PROMPTS = [
  "What insight surprised you today?",
  "What friction did you encounter?",
  "What small win can you celebrate?",
  "What idea is worth exploring?",
  "What question is on your mind?",
  "What open loop needs closing?",
  "What pattern are you noticing?",
  "What would you do differently?",
  "What are you grateful for?",
  "What's the most important thing you learned?",
];

function getDailyPrompt(date: Date): string {
  // Use the date to deterministically select a prompt
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  return DAILY_PROMPTS[dayOfYear % DAILY_PROMPTS.length];
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");
  
  const today = dateParam ? new Date(dateParam) : new Date();
  today.setHours(0, 0, 0, 0);

  // Check if a prompt already exists for today
  let prompt = await prisma.dailyPrompt.findUnique({
    where: {
      userId_date: {
        userId: session.user.id,
        date: today,
      },
    },
  });

  // If not, create one
  if (!prompt) {
    prompt = await prisma.dailyPrompt.create({
      data: {
        date: today,
        question: getDailyPrompt(today),
        userId: session.user.id,
      },
    });
  }

  return NextResponse.json(prompt);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { date, response } = body;

  const promptDate = date ? new Date(date) : new Date();
  promptDate.setHours(0, 0, 0, 0);

  const prompt = await prisma.dailyPrompt.upsert({
    where: {
      userId_date: {
        userId: session.user.id,
        date: promptDate,
      },
    },
    update: {
      response,
      completed: true,
    },
    create: {
      date: promptDate,
      question: getDailyPrompt(promptDate),
      response,
      completed: true,
      userId: session.user.id,
    },
  });

  return NextResponse.json(prompt);
}
