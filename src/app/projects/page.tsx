"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Plus, Target, Loader2, Calendar, FileText, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  paused: "bg-amber-100 text-amber-700",
  completed: "bg-blue-100 text-blue-700",
  archived: "bg-gray-100 text-gray-600",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      if (res.ok) {
        const project = await res.json();
        setProjects([project, ...projects]);
        setNewProject({ name: "", description: "" });
        setShowNewForm(false);
      }
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif-display text-3xl text-[#1A1A1A] mb-1">
                Projects
              </h1>
              <p className="text-[#6B6B6B] font-serif-body">
                Goal-oriented work with a deadline
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowNewForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>

          {/* New Project Form */}
          {showNewForm && (
            <form
              onSubmit={handleCreate}
              className="bg-[#FDFCF8] border border-[#E5E2DA] rounded-xl p-6 mb-6"
            >
              <h3 className="font-serif-display text-xl text-[#1A1A1A] mb-4">
                Create New Project
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Project name"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-2 bg-[#F5F3EE] border border-[#E5E2DA] rounded-lg text-[#1A1A1A] placeholder:text-[#9A9A9A] focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] font-serif-body"
                  autoFocus
                />
                <textarea
                  placeholder="Description (optional)"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-4 py-2 bg-[#F5F3EE] border border-[#E5E2DA] rounded-lg text-[#1A1A1A] placeholder:text-[#9A9A9A] focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] font-serif-body resize-none"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowNewForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isCreating || !newProject.name.trim()}
                  >
                    {isCreating ? "Creating..." : "Create Project"}
                  </Button>
                </div>
              </div>
            </form>
          )}

          {/* Projects Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#1E3A5F] animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#F5F3EE] flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-[#9A9A9A]" />
              </div>
              <h3 className="font-serif-display text-xl text-[#1A1A1A] mb-2">
                No projects yet
              </h3>
              <p className="text-[#6B6B6B] font-serif-body mb-4">
                Create your first project to start organizing your notes
              </p>
              <Button variant="primary" onClick={() => setShowNewForm(true)}>
                Create Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-[#FDFCF8] border border-[#E5E2DA] rounded-xl p-6 hover:border-[#1E3A5F] hover:shadow-soft transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#E8F4FD] flex items-center justify-center">
                        <Target className="w-5 h-5 text-[#1E3A5F]" />
                      </div>
                      <div>
                        <h3 className="font-serif-display text-lg text-[#1A1A1A]">
                          {project.name}
                        </h3>
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-sans-ui font-medium",
                            STATUS_COLORS[project.status] || STATUS_COLORS.active
                          )}
                        >
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {project.description && (
                    <p className="text-[#6B6B6B] text-sm font-serif-body mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-[#9A9A9A] font-sans-ui">
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      <span>{project._count?.notes || 0} notes</span>
                    </div>
                    {project.targetDate && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>Due {formatDate(project.targetDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
