import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/sidebar";
import { QuickCapture } from "@/components/quick-capture";
import { BookOpen, Plus, FileText } from "lucide-react";

export default async function ResourcesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null;
  }

  const resources = await prisma.resource.findMany({
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
              <h1 className="font-serif-display text-3xl text-[#1A1A1A] mb-2">Resources</h1>
              <p className="text-[#6B6B6B] font-serif-body">Reference material and knowledge base</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#6B5B3D] text-white rounded-lg font-sans-ui font-medium hover:bg-[#5A4D34] transition-all">
              <Plus className="w-4 h-4" />
              New Resource
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="bg-[#FDFCF8] border border-[#E5E2DA] rounded-xl p-5 hover:border-[#6B5B3D] hover:shadow-soft transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#F0E8F5] rounded-lg flex items-center justify-center"
003e
                    <BookOpen className="w-5 h-5 text-[#6B5B3D]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif-display text-lg text-[#1A1A1A]">{resource.name}</h3>
                  </div>
                </div>
                
                {resource.description && (
                  <p className="text-sm text-[#6B6B6B] mb-3 line-clamp-2">{resource.description}</p>
                )}
                
                <div className="flex items-center gap-1 text-sm text-[#9A9A9A] font-sans-ui">
                  <FileText className="w-4 h-4" />
                  {resource._count.notes} notes
                </div>
              </div>
            ))}
          </div>

          {resources.length === 0 && (
            <div className="text-center py-12 bg-[#F5F3EE] rounded-xl">
              <BookOpen className="w-12 h-12 text-[#9A9A9A] mx-auto mb-4" />
              <h3 className="font-serif-display text-xl text-[#1A1A1A] mb-2">No resources yet</h3>
              <p className="text-[#6B6B6B] mb-4">Create resources for reference material, guides, and knowledge</p>
              <button className="px-4 py-2 bg-[#6B5B3D] text-white rounded-lg font-sans-ui font-medium">
                Create Resource
              </button>
            </div>
          )}
        </div>
      </main>

      <QuickCapture />
    </div>
  );
}
