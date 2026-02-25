"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Sparkles, Target, Layers, BookOpen, Archive, X, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn, noteTagColors } from "@/lib/utils";

const tags = [
  { key: "DECISION", label: "Decision", description: "Choices made, directions set" },
  { key: "FRICTION", label: "Friction", description: "Problems, blockers, struggles" },
  { key: "WIN", label: "Win", description: "Successes, breakthroughs, positive moments" },
  { key: "IDEA", label: "Idea", description: "Concepts to explore later" },
  { key: "QUESTION", label: "Question", description: "Unanswered, needs research" },
  { key: "OPEN_LOOP", label: "Open Loop", description: "Unfinished business" },
  { key: "NOTE", label: "Note", description: "General context worth keeping" },
  { key: "MOOD", label: "Mood", description: "Emotional state, energy level" },
] as const;

const paraOptions = [
  { key: "project", label: "Project", icon: Target, description: "Goal with deadline" },
  { key: "area", label: "Area", icon: Layers, description: "Ongoing responsibility" },
  { key: "resource", label: "Resource", icon: BookOpen, description: "Reference material" },
  { key: "archive", label: "Archive", icon: Archive, description: "Cold storage" },
] as const;

export function QuickCapture() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTag, setSelectedTag] = useState("NOTE");
  const [selectedPara, setSelectedPara] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          tags: [selectedTag],
          source: "CAPTURE",
        }),
      });

      if (res.ok) {
        // Reset form
        setTitle("");
        setContent("");
        setSelectedTag("NOTE");
        setSelectedPara(null);
        setIsOpen(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        
        // Refresh the page to show new note
        window.location.reload();
      } else {
        console.error("Failed to save note");
      }
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 right-8 bg-[#1E3A5F] text-white px-4 py-2 rounded-lg shadow-medium z-50 font-sans-ui text-sm"
          >
            Note captured!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Capture Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 flex items-center gap-2 px-5 py-3 bg-[#1E3A5F] text-white rounded-full shadow-medium hover:bg-[#2A4A73] transition-colors font-sans-ui font-medium text-sm z-50"
          >
            <Sparkles className="w-4 h-4" />
            Quick Capture
          </motion.button>
        )}
      </AnimatePresence>

      {/* Capture Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
              onClick={() => !isSubmitting && setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed bottom-8 right-8 w-[480px] max-w-[calc(100vw-4rem)] bg-[#FDFCF8] rounded-xl shadow-medium border border-[#E5E2DA] z-50 overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif-display text-lg text-[#1A1A1A]">
                    Quick Capture
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    disabled={isSubmitting}
                    className="p-1 hover:bg-[#F5F3EE] rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-[#6B6B6B]" />
                  </button>
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="What's on your mind?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-lg font-serif-display text-[#1A1A1A] placeholder:text-[#9A9A9A] bg-transparent border-none outline-none"
                    autoFocus
                  />
                </div>
                
                <textarea
                  placeholder="Add details..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={3}
                  className="w-full text-sm text-[#1A1A1A] placeholder:text-[#9A9A9A] bg-[#F5F3EE] rounded-lg p-3 border-none outline-none resize-none font-serif-body"
                />

                {/* Tag selection */}
                <div className="mt-4">
                  <p className="text-xs font-sans-ui font-medium text-[#9A9A9A] uppercase tracking-wider mb-2">Tag</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => {
                      const colors = noteTagColors[tag.key];
                      return (
                        <button
                          key={tag.key}
                          type="button"
                          onClick={() => setSelectedTag(tag.key)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-sans-ui font-medium transition-all",
                            selectedTag === tag.key
                              ? `${colors.bg} ${colors.text} ring-1 ${colors.border}`
                              : "bg-[#F5F3EE] text-[#6B6B6B] hover:bg-[#EDE9E2]"
                          )}
                          title={tag.description}
                        >
                          {tag.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* PARA classification */}
                <div className="mt-4">
                  <p className="text-xs font-sans-ui font-medium text-[#9A9A9A] uppercase tracking-wider mb-2">Organize (optional)</p>
                  <div className="grid grid-cols-4 gap-2">
                    {paraOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.key}
                          type="button"
                          onClick={() => setSelectedPara(selectedPara === option.key ? null : option.key)}
                          className={cn(
                            "flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all",
                            selectedPara === option.key
                              ? "bg-[#E8F4FD] border-[#1E3A5F] text-[#1E3A5F]"
                              : "bg-[#F5F3EE] border-[#E5E2DA] text-[#6B6B6B] hover:border-[#D5D2CA]"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-xs font-sans-ui font-medium">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={!title.trim() || isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Capture"
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
