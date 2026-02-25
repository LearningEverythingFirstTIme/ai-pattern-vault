import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(d);
}

export const noteTagColors: Record<string, { bg: string; text: string; border: string }> = {
  DECISION: { bg: "bg-[#E8F4E8]", text: "text-[#2D5A2D]", border: "border-[#C8E4C8]" },
  FRICTION: { bg: "bg-[#FDF2E8]", text: "text-[#8B4513]", border: "border-[#F5D5C8]" },
  WIN: { bg: "bg-[#E8F4FD]", text: "text-[#1E3A5F]", border: "border-[#C8E0F5]" },
  IDEA: { bg: "bg-[#F5F0E8]", text: "text-[#6B5B3D]", border: "border-[#E8DCC8]" },
  QUESTION: { bg: "bg-[#F0E8F5]", text: "text-[#5B3D6B]", border: "border-[#E0D0E8]" },
  OPEN_LOOP: { bg: "bg-[#F5E8E8]", text: "text-[#6B3D3D]", border: "border-[#E8D0D0]" },
  NOTE: { bg: "bg-[#F0F0F0]", text: "text-[#4A4A4A]", border: "border-[#D8D8D8]" },
  MOOD: { bg: "bg-[#E8F5F0]", text: "text-[#3D6B5B]", border: "border-[#C8E8DC]" },
};

export const paraColors = {
  project: { bg: "bg-[#E8F4FD]", text: "text-[#1E3A5F]", icon: "Target" },
  area: { bg: "bg-[#F5F0E8]", text: "text-[#6B5B3D]", icon: "Layers" },
  resource: { bg: "bg-[#F0E8F5]", text: "text-[#5B3D6B]", icon: "BookOpen" },
  archive: { bg: "bg-[#F0F0F0]", text: "text-[#6B6B6B]", icon: "Archive" },
};
