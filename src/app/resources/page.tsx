"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Loader2, FileText } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newResource, setNewResource] = useState({ name: "", description: "" });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await fetch("/api/resources");
      if (res.ok) {
        const data = await res.json();
        setResources(data);
      }
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResource.name.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newResource),
      });
      if (res.ok) {
        const resource = await res.json();
        setResources([resource, ...resources]);
        setNewResource({ name: "", description: "" });
        setShowNewForm(false);
      }
    } catch (error) {
      console.error("Failed to create resource:", error);
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
                Resources
              </h1>
              <p className="text-[#6B6B6B] font-serif-body">
                Reference material and knowledge base
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowNewForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Resource
            </Button>
          </div>

          {/* New Resource Form */}
          {showNewForm && (
            <form
              onSubmit={handleCreate}
              className="bg-[#FDFCF8] border border-[#E5E2DA] rounded-xl p-6 mb-6"
            >
              <h3 className="font-serif-display text-xl text-[#1A1A1A] mb-4">
                Create New Resource
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Resource name"
                  value={newResource.name}
                  onChange={(e) =>
                    setNewResource((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-2 bg-[#F5F3EE] border border-[#E5E2DA] rounded-lg text-[#1A1A1A] placeholder:text-[#9A9A9A] focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] font-serif-body"
                  autoFocus
                />
                <textarea
                  placeholder="Description (optional)"
                  value={newResource.description}
                  onChange={(e) =>
                    setNewResource((prev) => ({ ...prev, description: e.target.value }))
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
                    disabled={isCreating || !newResource.name.trim()}
                  >
                    {isCreating ? "Creating..." : "Create Resource"}
                  </Button>
                </div>
              </div>
            </form>
          )}

          {/* Resources Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#1E3A5F] animate-spin" />
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#F5F3EE] flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-[#9A9A9A]" />
              </div>
              <h3 className="font-serif-display text-xl text-[#1A1A1A] mb-2">
                No resources yet
              </h3>
              <p className="text-[#6B6B6B] font-serif-body mb-4">
                Create resources to organize reference materials
              </p>
              <Button variant="primary" onClick={() => setShowNewForm(true)}>
                Create Resource
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="bg-[#FDFCF8] border border-[#E5E2DA] rounded-xl p-6 hover:border-[#1E3A5F] hover:shadow-soft transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#F0E8F5] flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-[#5B3D6B]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif-display text-lg text-[#1A1A1A]">
                        {resource.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-sm text-[#9A9A9A] font-sans-ui mt-1">
                        <FileText className="w-4 h-4" />
                        <span>{resource._count?.notes || 0} notes</span>
                      </div>
                    </div>
                  </div>

                  {resource.description && (
                    <p className="text-[#6B6B6B] text-sm font-serif-body line-clamp-2">
                      {resource.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
