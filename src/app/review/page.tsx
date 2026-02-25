import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/sidebar";
import { QuickCapture } from "@/components/quick-capture";
import { Sparkles, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function ReviewPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get or create today's prompt
  let dailyPrompt = await prisma.dailyPrompt.findUnique({
    where: {
      userId_date: {
        userId: session.user.id,
        date: today,
      },
    },
  });

  if (!dailyPrompt) {
    const prompts = [
      "What insight surprised you today?",
      "What friction did you encounter?",
      "What decision are you grappling with?",
      "What would you do differently?",
      "What are you grateful for?",
    ];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    
    dailyPrompt = await prisma.dailyPrompt.create({
      data: {
        userId: session.user.id,
        date: today,
        question: randomPrompt,
      },
    });
  }

  // Get recent notes for review
  const recentNotes = await prisma.note.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Get stats
  const stats = await prisma.$transaction([
    prisma.note.count({ where: { userId: session.user.id } }),
    prisma.note.count({ 
      where: { 
        userId: session.user.id, 
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      } 
    }),
    prisma.project.count({ where: { userId: session.user.id } }),
  ]);

  return (
    <div className="min-h-screen">
      <Sidebar />
      
      <main className="ml-64 p-8">
        <div className="max-w-4xl">
          <div className="mb-8">
            <h1 className="font-serif-display text-3xl text-[#1A1A1A] mb-2">Daily Review</h1>
            <p className="text-[#6B6B6B] font-serif-body">Reflect, review, and resurface insights</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-[#F5F3EE] rounded-xl p-4">
              <p className="text-3xl font-serif-display text-[#1E3A5F]">{stats[0]}</p>
              <p className="text-sm text-[#6B6B6B] font-sans-ui">Total Notes</p>
            </div>
            <div className="bg-[#F5F3EE] rounded-xl p-4">
              <p className="text-3xl font-serif-display text-[#C9A227]">{stats[1]}</p>
              <p className="text-sm text-[#6B6B6B] font-sans-ui">This Week</p>
            </div>
            <div className="bg-[#F5F3EE] rounded-xl p-4">
              <p className="text-3xl font-serif-display text-[#6B5B3D]">{stats[2]}</p>
              <p className="text-sm text-[#6B6B6B] font-sans-ui">Active Projects</p>
            </div>
          </div>

          {/* Daily Prompt */}
          <div className="bg-[#1E3A5F] rounded-xl p-6 mb-8 text-white">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/70 font-sans-ui uppercase tracking-wider mb-1">Daily Prompt</p>
                <h2 className="font-serif-display text-xl mb-4">{dailyPrompt.question}</h2>
                <form action="/api/daily-prompts" method="POST">
                  <input type="hidden" name="id" value={dailyPrompt.id} />
                  <textarea
                    name="response"
                    defaultValue={dailyPrompt.response || ""}
                    placeholder="Capture your thoughts..."
                    className="w-full bg-white/10 rounded-lg p-3 text-white placeholder:text-white/50 border-none outline-none resize-none font-serif-body"
                    rows={3}
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-white text-[#1E3A5F] rounded-lg font-sans-ui font-medium hover:bg-white/90 transition-all"
                    >
                      Save Response
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Recent Notes for Review */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-[#6B6B6B]" />
              <h2 className="font-serif-display text-xl text-[#1A1A1A]">Recent Captures</h2>
            </div>

            <div className="space-y-3">
              {recentNotes.map((note) => (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className="block bg-[#FDFCF8] border border-[#E5E2DA] rounded-lg p-4 hover:border-[#1E3A5F] transition-all"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-serif-display text-lg text-[#1A1A1A]">{note.title}</h3>
                    <span className="text-xs text-[#9A9A9A] font-sans-ui">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {note.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-xs font-sans-ui bg-[#F5F3EE] text-[#6B6B6B]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Weekly Review Prompt */}
          <div className="bg-[#F5F0E8] border border-[#E8DCC8] rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#C9A227]/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-[#C9A227]" />
              </div>
              <div>
                <p className="text-sm text-[#6B5B3D] font-sans-ui uppercase tracking-wider mb-1">Weekly Review</p>
                <h2 className="font-serif-display text-xl text-[#1A1A1A] mb-2">Time for your weekly PARA review?</h2>
                <p className="text-[#6B6B6B] mb-4">
                  Review your Projects, Areas, Resources, and Archive. Clear the clutter and refocus.
                </p>
                <a
                  href="/projects"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A227] text-white rounded-lg font-sans-ui font-medium hover:bg-[#A68520] transition-all"
                >
                  Start Review
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <QuickCapture />
    </div>
  );
}
