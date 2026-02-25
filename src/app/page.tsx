import { Sidebar } from "@/components/sidebar";
import { QuickCapture } from "@/components/quick-capture";

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      
      <main className="ml-64 p-8">
        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif-display text-4xl text-[#1A1A1A] mb-2">
              Good evening, Nick
            </h1>
            <p className="text-[#6B6B6B] font-serif-body">
              Wednesday, February 25th · 5 notes captured today
            </p>
          </div>

          {/* Daily prompt */}
          <div className="bg-[#1E3A5F] rounded-xl p-6 mb-8 text-white">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/70 font-sans-ui uppercase tracking-wider mb-1">Daily Prompt</p>
                <h2 className="font-serif-display text-xl mb-3">What insight surprised you today?</h2>
                <textarea
                  placeholder="Capture a moment of clarity..."
                  className="w-full bg-white/10 rounded-lg p-3 text-white placeholder:text-white/50 border-none outline-none resize-none font-serif-body"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Recent notes */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif-display text-2xl text-[#1A1A1A]">Recent Notes</h2>
              <a href="/notes" className="text-sm font-sans-ui text-[#1E3A5F] hover:underline">View all →</a>
            </div>

            <div className="space-y-3">
              {[
                { title: "Memory system audit completed", tag: "WIN", time: "2h ago", preview: "Successfully identified 5 issues and updated architecture..." },
                { title: "Pattern Vault concept", tag: "IDEA", time: "4h ago", preview: "A living knowledge base for capturing, connecting..." },
                { title: "Timezone conversion bug", tag: "FRICTION", time: "6h ago", preview: "EST to UTC conversion was off by an hour during DST..." },
              ].map((note, i) => (
                <div
                  key={i}
                  className="bg-[#FDFCF8] border border-[#E5E2DA] rounded-lg p-4 hover:border-[#1E3A5F] hover:shadow-soft transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-serif-display text-lg text-[#1A1A1A]">{note.title}</h3>
                    <span className={`
                      px-2 py-0.5 rounded-full text-xs font-sans-ui font-medium
                      ${note.tag === "WIN" ? "bg-[#E8F4FD] text-[#1E3A5F]" : ""}
                      ${note.tag === "IDEA" ? "bg-[#F5F0E8] text-[#6B5B3D]" : ""}
                      ${note.tag === "FRICTION" ? "bg-[#FDF2E8] text-[#8B4513]" : ""}
                    `}>
                      {note.tag}
                    </span>
                  </div>
                  <p className="text-sm text-[#6B6B6B] font-serif-body line-clamp-2">{note.preview}</p>
                  <p className="text-xs text-[#9A9A9A] font-sans-ui mt-2">{note.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active projects */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif-display text-2xl text-[#1A1A1A]">Active Projects</h2>
              <a href="/projects" className="text-sm font-sans-ui text-[#1E3A5F] hover:underline">View all →</a>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "Pattern Vault", notes: 12, status: "In Progress" },
                { name: "Memory System", notes: 8, status: "Active" },
              ].map((project, i) => (
                <div
                  key={i}
                  className="bg-[#F5F3EE] border border-[#E5E2DA] rounded-lg p-4 hover:border-[#1E3A5F] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[#1E3A5F]" />
                    <h3 className="font-serif-display text-lg text-[#1A1A1A]">{project.name}</h3>
                  </div>
                  <p className="text-sm text-[#6B6B6B] font-sans-ui">{project.notes} notes · {project.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <QuickCapture />
    </div>
  );
}
