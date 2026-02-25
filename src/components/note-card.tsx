"use client";

import { Note, Project, Area } from "@prisma/client";
import { formatDistanceToNow } from "@/lib/date";

interface NoteCardProps {
  note: Note & { project?: Project | null; area?: Area | null };
}

const TAG_COLORS: Record<string, string> = {
  DECISION: "tag-decision",
  FRICTION: "tag-friction",
  WIN: "tag-win",
  IDEA: "tag-idea",
  QUESTION: "tag-question",
  OPEN_LOOP: "tag-default",
  NOTE: "tag-default",
  MOOD: "tag-default",
};

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

export function NoteCard({ note }: NoteCardProps) {
  return (
    <article className="card p-5 group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg text-text-primary truncate">
            {note.title}
          </h3>
          
          {note.content && (
            <p className="text-text-secondary text-sm mt-1 line-clamp-2">
              {note.content}
            </p>
          )}
          
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {note.tags.map((tag) => (
              <span key={tag} className={`tag ${TAG_COLORS[tag] || "tag-default"}`}>
                {TAG_LABELS[tag] || tag}
              </span>
            ))}
            
            {note.project && (
              <span className="text-xs text-accent-navy bg-accent-navy/10 px-2 py-1 rounded">
                📁 {note.project.name}
              </span>
            )}
            
            {note.area && (
              <span className="text-xs text-accent-gold-dark bg-accent-gold/20 px-2 py-1 rounded">
                🏷️ {note.area.name}
              </span>
            )}
          </div>
        </div>
        
        <time className="text-xs text-text-muted whitespace-nowrap">
          {formatDistanceToNow(note.createdAt)}
        </time>
      </div>
    </article>
  );
}
