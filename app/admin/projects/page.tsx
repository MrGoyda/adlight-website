import { prisma } from "@/lib/prisma";
import ProjectsDashboard from "./_components/ProjectsDashboard";

export const revalidate = 0;

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    include: {
      company: {
        select: {
          id: true,
          name: true,
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
        },
      },
      files: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const companies = await prisma.company.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <main className="min-h-screen bg-slate-50/50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <ProjectsDashboard 
          initialProjects={JSON.parse(JSON.stringify(projects))} 
          companies={JSON.parse(JSON.stringify(companies))}
        />
      </div>
    </main>
  );
}
