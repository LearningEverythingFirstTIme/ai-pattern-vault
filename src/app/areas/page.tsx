import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/sidebar";
import { QuickCapture } from "@/components/quick-capture";
import { Layers, Plus, FileText } from "lucide-react";

export default async function AreasPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null;
  }

  const areas = await prisma.area.findMany({
    where: { userId: session.user.id },
    include: {
      _count: { select: { notes: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen">
      <Sidebar />
      
      <main className="ml-64 p-8">
        <div className="max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif-display text-3xl text-[#1A1A1A] mb-2">Areas</h1>
              <p className="text-[#6B6B6B] font-serif-body">Ongoing responsibilities and interests</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#C9A227] text-white rounded-lg font-sans-ui font-medium hover:bg-[#A68520] transition-all">
              <Plus className="w-4 h-4" />
              New Area
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {areas.map((area) => (
              <div
                key={area.id}
                className="bg-[#FDFCF8] border border-[#E5E2DA] rounded-xl p-5 hover:border-[#C9A227] hover:shadow-soft transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#F5F0E8] rounded-lg flex items-center justify-center">
                    <Layers className="w-5 h-5 text-[#C9A227]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif-display text-lg text-[#1A1A1A]">{area.name}</h3>
                  </div>
                </div>
                
                {area.description && (
                  <p className="text-sm text-[#6B6B6B] mb-3 line-clamp-2">{area.description}</p>
                )}
                
                <div className="flex items-center gap-1 text-sm text-[#9A9A9A] font-sans-ui">
                  <FileText className="w-4 h-4" />
                  {area._count.notes} notes
                </div>
              </div>
            ))}
          </div>

          {areas.length === 0 && (
            <div className="text-center py-12 bg-[#F5F3EE] rounded-xl">
              <Layers className="w-12 h-12 text-[#9A9A9A] mx-auto mb-4" />
              <h3 className="font-serif-display text-xl text-[#1A1A1A] mb-2">No areas yet</h3>
              <p className="text-[#6B6B6B] mb-4">Create areas for ongoing responsibilities like "Health", "Career", "Learning"</p>
              <button className="px-4 py-2 bg-[#C9A227] text-white rounded-lg font-sans-ui font-medium">
                Create Area
              </button>
            </div>
          )}
        </div>
      </main>

      <QuickCapture />
    </div>
  );
}
