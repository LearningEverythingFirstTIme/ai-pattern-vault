"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { DailyPrompt } from "@/components/daily-prompt";
import { NoteCard } from "@/components/note-card";
import { Loader2, Sparkles, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function ReviewPage() {
  const [recentNotes, setRecentNotes] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalNotes: 0,
    thisWeek: 0,
    connections: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [notesRes] = await Promise.all([fetch("/api/notes")]);
      
      if (notesRes.ok) {
        const notes = await notesRes.json();
        setRecentNotes(notes.slice(0, 5));
        
        // Calculate stats
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        setStats({
          totalNotes: notes.length,
          thisWeek: notes.filter((n: any) => new Date(n.createdAt) > oneWeekAgo).length,
          connections: notes.reduce((acc: number, n: any) => 
            acc + (n._count?.connectionsAsSource || 0) + (n._count?.connectionsAsTarget || 0), 0
          ),
        });
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif-display text-3xl text-[#1A1A1A] mb-2">
              Daily Review
            </h1>
            <p className="text-[#6B6B6B] font-serif-body">
              Reflect on your day and review recent insights
            </p>
          </div>

          {/* Daily Prompt */}
          <div className="mb-8">
            <DailyPrompt />
          </div>

          {/* Stats */}
          {!loading && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-[#FDFCF8] border border-[#E5E2DA] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-[#1E3A5F]" />
                  <span className="text-sm text-[#6B6B6B] font-sans-ui">Total Notes</span>
                </div>
                <p className="font-serif-display text-2xl text-[#1A1A1A]">{stats.totalNotes}</p>
              </div>
              
              <div className="bg-[#FDFCF8] border border-[#E5E2DA] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-[#C9A227]" />
                  <span className="text-sm text-[#6B6B6B] font-sans-ui">This Week</span>
                </div>
                <p className="font-serif-display text-2xl text-[#1A1A1A]">{stats.thisWeek}</p>
              </div>
              
              <div className="bg-[#FDFCF8] border border-[#E5E2DA] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#6B5B3D]" />
                  <span className="text-sm text-[#6B6B6B] font-sans-ui">Connections</span>
                </div>
                <p className="font-serif-display text-2xl text-[#1A1A1A]">{stats.connections}</p>
              </div>
            </div>
          )}

          {/* Recent Notes */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif-display text-xl text-[#1A1A1A]">
                Recent Notes
              </h2>
              <Link
                href="/notes"
                className="text-sm text-[#1E3A5F] hover:underline font-sans-ui"
              >
                View all →
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-[#1E3A5F] animate-spin" />
              </div>
            ) : recentNotes.length === 0 ? (
              <div className="text-center py-8 bg-[#F5F3EE] rounded-xl">
                <p className="text-[#6B6B6B] font-serif-body">
                  No notes yet. Start capturing your thoughts!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentNotes.map((note) => (
                  <Link key={note.id} href={`/notes/${note.id}`}>
                    <NoteCard note={note} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Suggestions */}
          <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2A4A73] rounded-xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-display text-lg mb-2">Review Suggestions</h3>
                <ul className="space-y-2 text-sm text-white/80 font-serif-body">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Look for patterns in your recent friction notes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Connect related ideas to build knowledge networks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Archive completed projects to keep focus clear</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
