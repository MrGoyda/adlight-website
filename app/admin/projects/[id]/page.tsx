import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProjectDetailPage from "./_components/ProjectDetailPage";

export const revalidate = 0;

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      company: {
        include: {
          contacts: true,
        },
      },
      leads: {
        include: {
          files: true,
          estimate: {
            include: {
              items: true,
            },
          },
          activities: {
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      files: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50/50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <ProjectDetailPage project={JSON.parse(JSON.stringify(project))} />
      </div>
    </main>
  );
}
