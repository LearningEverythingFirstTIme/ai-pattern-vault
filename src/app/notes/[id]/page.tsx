"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2, Trash2, Link2, Loader2, Calendar } from "lucide-react";
import Link from "next/link";
import { formatDate, noteTagColors } from "@/lib/utils";

const TAG_LABELS: Record<string, string> = {
  DECISION: "Decision",
  FRICTION: "Friction",
  WIN: "Win",
  IDEA: "Idea",
  QUESTION: "Question",
  OPEN_LOOP: "Open Loop",
  NOTE: "Note",
  MOOD: "Mood",
};

export default function NotePage() {
  const params = useParams();
  const router = useRouter();
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", content: "" });

  useEffect(() => {
    if (params.id) {
      fetchNote();
    }
  }, [params.id]);

  const fetchNote = async () => {
    try {
      const res = await fetch(`/api/notes/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setNote(data);
        setEditForm({ title: data.title, content: data.content });
      } else {
        router.push("/notes");
      }
    } catch (error) {
      console.error("Failed to fetch note:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/notes/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const updated = await res.json();
        setNote(updated);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/notes/${params.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/notes");
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#1E3A5F] animate-spin" />
        </main>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen flex">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-serif-display text-2xl text-[#1A1A1A] mb-2">
              Note not found
            </h2>
            <Link href="/notes" className="text-[#1E3A5F] hover:underline">
              Back to notes
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/notes"
              className="flex items-center gap-2 text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors font-sans-ui text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to notes
            </Link>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({ title: note.title, content: note.content });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Note content */}
          <article className="bg-[#FDFCF8] border border-[#E5E2DA] rounded-xl p-8">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full text-2xl font-serif-display text-[#1A1A1A] bg-transparent border-none outline-none placeholder:text-[#9A9A9A]"
                  placeholder="Note title"
                />
                <textarea
                  value={editForm.content}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, content: e.target.value }))
                  }
                  rows={10}
                  className="w-full text-[#1A1A1A] bg-[#F5F3EE] rounded-lg p-4 border-none outline-none resize-none font-serif-body"
                  placeholder="Note content..."
                />
              </div>
            ) : (
              <>
                <h1 className="font-serif-display text-3xl text-[#1A1A1A] mb-4">
                  {note.title}
                </h1>

                {/* Metadata */}
                <div className="flex items-center gap-4 mb-6 text-sm text-[#6B6B6B] font-sans-ui">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>Created {formatDate(note.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>Updated {formatDate(note.updatedAt)}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 mb-6 flex-wrap">
                  {note.tags.map((tag: string) => {
                    const colors = noteTagColors[tag];
                    return (
                      <span
                        key={tag}
                        className={`px-3 py-1 rounded-full text-xs font-sans-ui font-medium ${colors.bg} ${colors.text}`}
                      >
                        {TAG_LABELS[tag] || tag}
                      </span>
                    );
                  })}
                </div>

                {/* Content */}
                <div className="prose prose-stone max-w-none font-serif-body text-[#1A1A1A] whitespace-pre-wrap">
                  {note.content}
                </div>

                {/* PARA classification */}
                {(note.project || note.area || note.resource) && (
                  <div className="mt-8 pt-6 border-t border-[#E5E2DA]">
                    <h3 className="text-sm font-sans-ui font-medium text-[#9A9A9A] uppercase tracking-wide mb-3">
                      Organized in
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      {note.project && (
                        <Link
                          href={`/projects`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F4FD] text-[#1E3A5F] rounded-lg text-sm font-sans-ui"
                        >
                          <span>Project:</span>
                          <span className="font-medium">{note.project.name}</span>
                        </Link>
                      )}
                      {note.area && (
                        <Link
                          href={`/areas`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F0E8] text-[#6B5B3D] rounded-lg text-sm font-sans-ui"
                        >
                          <span>Area:</span>
                          <span className="font-medium">{note.area.name}</span>
                        </Link>
                      )}
                      {note.resource && (
                        <Link
                          href={`/resources`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F0E8F5] text-[#5B3D6B] rounded-lg text-sm font-sans-ui"
                        >
                          <span>Resource:</span>
                          <span className="font-medium">{note.resource.name}</span>
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* Connections */}
                {(note.connectionsAsSource?.length > 0 || note.connectionsAsTarget?.length > 0) && (
                  <div className="mt-8 pt-6 border-t border-[#E5E2DA]">
                    <h3 className="text-sm font-sans-ui font-medium text-[#9A9A9A] uppercase tracking-wide mb-3 flex items-center gap-2">
                      <Link2 className="w-4 h-4" />
                      Connected Notes
                    </h3>
                    <div className="space-y-2">
                      {note.connectionsAsSource?.map((conn: any) => (
                        <Link
                          key={conn.id}
                          href={`/notes/${conn.targetNote.id}`}
                          className="flex items-center gap-2 p-3 bg-[#F5F3EE] rounded-lg hover:bg-[#EDE9E2] transition-colors"
                        >
                          <span className="text-[#9A9A9A]">→</span>
                          <span className="font-medium text-[#1A1A1A]">{conn.targetNote.title}</span>
                        </Link>
                      ))}
                      {note.connectionsAsTarget?.map((conn: any) => (
                        <Link
                          key={conn.id}
                          href={`/notes/${conn.sourceNote.id}`}
                          className="flex items-center gap-2 p-3 bg-[#F5F3EE] rounded-lg hover:bg-[#EDE9E2] transition-colors"
                        >
                          <span className="text-[#9A9A9A]">←</span>
                          <span className="font-medium text-[#1A1A1A]">{conn.sourceNote.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </article>
        </div>
      </main>
    </div>
  );
}
