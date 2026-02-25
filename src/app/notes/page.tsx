"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { NoteCard } from "@/components/note-card";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus, Loader2 } from "lucide-react";
import { cn, noteTagColors } from "@/lib/utils";
import Link from "next/link";

const PARA_TABS = [
  { key: "all", label: "All Notes" },
  { key: "project", label: "Projects" },
  { key: "area", label: "Areas" },
  { key: "resource", label: "Resources" },
  { key: "archive", label: "Archive" },
] as const;

const TAGS = [
  { key: "DECISION", label: "Decision" },
  { key: "FRICTION", label: "Friction" },
  { key: "WIN", label: "Win" },
  { key: "IDEA", label: "Idea" },
  { key: "QUESTION", label: "Question" },
  { key: "OPEN_LOOP", label: "Open Loop" },
  { key: "NOTE", label: "Note" },
  { key: "MOOD", label: "Mood" },
];

export default function NotesPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredNotes = notes.filter((note) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchQuery.toLowerCase());

    // PARA tab filter
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "project" && note.projectId) ||
      (activeTab === "area" && note.areaId) ||
      (activeTab === "resource" && note.resourceId) ||
      (activeTab === "archive" && !note.projectId && !note.areaId && !note.resourceId);

    // Tag filter
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => note.tags.includes(tag));

    return matchesSearch && matchesTab && matchesTags;
  });

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif-display text-3xl text-[#1A1A1A] mb-1">
                Notes
              </h1>
              <p className="text-[#6B6B6B] font-serif-body">
                {filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"}
              </p>
            </div>
            <Link href="/notes/new">
              <Button variant="primary" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Note
              </Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9A9A9A]" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#F5F3EE] border border-[#E5E2DA] rounded-lg text-[#1A1A1A] placeholder:text-[#9A9A9A] focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent font-serif-body"
              />
            </div>

            {/* PARA Tabs */}
            <div className="flex items-center gap-2 border-b border-[#E5E2DA]">
              {PARA_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "px-4 py-2 text-sm font-sans-ui font-medium transition-all border-b-2 -mb-px",
                    activeTab === tab.key
                      ? "border-[#1E3A5F] text-[#1E3A5F]"
                      : "border-transparent text-[#6B6B6B] hover:text-[#1A1A1A]"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tag filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-[#9A9A9A] mr-1" />
              {TAGS.map((tag) => {
                const colors = noteTagColors[tag.key];
                const isSelected = selectedTags.includes(tag.key);
                return (
                  <button
                    key={tag.key}
                    onClick={() => toggleTag(tag.key)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-sans-ui font-medium transition-all",
                      isSelected
                        ? `${colors.bg} ${colors.text} ring-1 ${colors.border}`
                        : "bg-[#F5F3EE] text-[#6B6B6B] hover:bg-[#EDE9E2]"
                    )}
                  >
                    {tag.label}
                  </button>
                );
              })}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="text-xs text-[#9A9A9A] hover:text-[#6B6B6B] underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Notes list */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#1E3A5F] animate-spin" />
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#F5F3EE] flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-[#9A9A9A]" />
              </div>
              <h3 className="font-serif-display text-xl text-[#1A1A1A] mb-2">
                No notes found
              </h3>
              <p className="text-[#6B6B6B] font-serif-body">
                {searchQuery || selectedTags.length > 0
                  ? "Try adjusting your search or filters"
                  : "Start by capturing your first note"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotes.map((note) => (
                <Link key={note.id} href={`/notes/${note.id}`}>
                  <NoteCard note={note} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
