"use client";

import { useState } from "react";

const PROMPTS = [
  "What decision did you make today?",
  "What friction did you encounter?",
  "What was a win today?",
  "What idea is on your mind?",
  "What question needs answering?",
  "What unfinished business is nagging at you?",
  "How are you feeling right now?",
  "What pattern have you noticed?",
];

export function DailyPrompt() {
  const [currentPrompt] = useState(() => {
    const dayOfYear = Math.floor(
      (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return PROMPTS[dayOfYear % PROMPTS.length];
  });
  
  const [response, setResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!response.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/daily-prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentPrompt,
          response: response.trim(),
        }),
      });

      if (res.ok) {
        setIsCompleted(true);
      }
    } catch (error) {
      console.error("Failed to save prompt:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="card p-6 bg-accent-gold/10 border-accent-gold">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent-gold flex items-center justify-center text-white">
            ✓
          </div>
          <div>
            <p className="text-text-primary font-medium">Daily reflection captured</p>
            <p className="text-text-secondary text-sm">See you tomorrow for the next prompt</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 border-l-4 border-l-accent-gold">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-accent-gold/20 flex items-center justify-center text-accent-gold-dark text-lg flex-shrink-0">
          ?
        </div>
        
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-sm text-text-muted uppercase tracking-wide">Daily Prompt</p>
            <p className="font-display text-xl text-text-primary mt-1">{currentPrompt}</p>
          </div>
          
          <textarea
            placeholder="Take a moment to reflect..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={2}
            className="input resize-none"
          />
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!response.trim() || isSubmitting}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Reflection"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
