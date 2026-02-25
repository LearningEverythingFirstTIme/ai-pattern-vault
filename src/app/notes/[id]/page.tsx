import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { QuickCapture } from "@/components/quick-capture";
import { formatDateTime } from "@/lib/utils";
import { ArrowLeft, Link2, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

interface NotePageProps {
  params: { id: string };
}

export default async function NotePage({ params }: NotePageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null;
  }

  const note = await prisma.note.findUnique({
    where: { id: params.id, userId: session.user.id },
    include: {
      project: true,
      area: true,
      resource: true,
      connectionsAsSource: {
        include: { targetNote: true },
      },
      connectionsAsTarget: {
        include: { sourceNote: true },
      },
    },
  });

  if (!note) {
    notFound();
  }

  const connections = [
    ...note.connectionsAsSource.map((c) => c.targetNote),
    ...note.connectionsAsTarget.map((c) => c.sourceNote),
  ];

  const tagColors: Record<string, string> = {
    DECISION: "bg-[#E8F4E8] text-[#2D5A2D]",
    FRICTION: "bg-[#FDF2E8] text-[#8B4513]",
    WIN: "bg-[#E8F4FD] text-[#1E3A5F]",
    IDEA: "bg-[#F5F0E8] text-[#6B5B3D]",
    QUESTION: "bg-[#F0E8F5] text-[#5B3D6B]",
    OPEN_LOOP: "bg-[#F5E8E8] text-[#6B3D3D]",
    NOTE: "bg-[#F0F0F0] text-[#4A4A4A]",
    MOOD: "bg-[#E8F5F0] text-[#3D6B5B]",
  };

  return (
    <div className="min-h-screen">
      <Sidebar />
      
      <main className="ml-64 p-8">
        <div className="max-w-3xl">
          {/* Back link */}
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 text-sm text-[#6B6B6B] hover:text-[#1A1A1A] font-sans-ui mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to notes
          </Link>

          {/* Note header */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="font-serif-display text-3xl text-[#1A1A1A]">{note.title}</h1>
              <div className="flex items-center gap-2">
                <button className="p-2 text-[#6B6B6B] hover:text-[#1E3A5F] hover:bg-[#F5F3EE] rounded-lg transition-all">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-[#6B6B6B] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm text-[#9A9A9A] font-sans-ui">
              <span>{formatDateTime(note.createdAt)}</span>
              {note.project && (
                <span className="text-[#1E3A5F] bg-[#E8F4FD] px-2 py-0.5 rounded">
                  📁 {note.project.name}
                </span>
              )}
              {note.area && (
                <span className="text-[#C9A227] bg-[#F5F0E8] px-2 py-0.5 rounded">
                  🏷️ {note.area.name}
                </span>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-3 py-1 rounded-full text-xs font-sans-ui font-medium ${tagColors[tag] || "bg-[#F0F0F0] text-[#4A4A4A]"}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="bg-[#FDFCF8] border border-[#E5E2DA] rounded-xl p-6 mb-8">
            <div className="prose prose-stone max-w-none font-serif-body text-[#1A1A1A]">
              {note.content ? (
                <p>{note.content}</p>
              ) : (
                <p className="text-[#9A9A9A] italic">No additional content</p>
              )}
            </div>
          </div>

          {/* Connections */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Link2 className="w-5 h-5 text-[#6B6B6B]" />
              <h2 className="font-serif-display text-xl text-[#1A1A1A]">Connected Notes</h2>
            </div>

            {connections.length === 0 ? (
              <p className="text-[#9A9A9A] text-sm">No connections yet. Link this note to others to see relationships.</p>
            ) : (
              <div className="space-y-3">
                {connections.map((connectedNote: any) => (
                  <Link
                    key={connectedNote.id}
                    href={`/notes/${connectedNote.id}`}
                    className="block bg-[#F5F3EE] border border-[#E5E2DA] rounded-lg p-4 hover:border-[#1E3A5F] transition-all"
                  >
                    <h3 className="font-serif-display text-lg text-[#1A1A1A]">{connectedNote.title}</h3>
                    {connectedNote.content && (
                      <p className="text-sm text-[#6B6B6B] mt-1 line-clamp-2">{connectedNote.content}</p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <QuickCapture />
    </div>
  );
}
