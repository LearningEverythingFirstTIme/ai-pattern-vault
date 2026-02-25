"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Loader2, Share2 } from "lucide-react";

export default function GraphPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif-display text-3xl text-[#1A1A1A] mb-2">
              Connections
            </h1>
            <p className="text-[#6B6B6B] font-serif-body">
              Visualize how your notes connect
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 text-[#1E3A5F] animate-spin" />
            </div>
          ) : (
            <div className="bg-[#FDFCF8] border border-[#E5E2DA] rounded-xl p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[#F5F3EE] flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-[#9A9A9A]" />
              </div>
              <h3 className="font-serif-display text-xl text-[#1A1A1A] mb-2">
                Graph View Coming Soon
              </h3>
              <p className="text-[#6B6B6B] font-serif-body max-w-md mx-auto">
                A visual representation of your note connections is in development. 
                For now, you can see connections on individual note pages.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
