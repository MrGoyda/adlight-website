import { prisma } from "@/lib/prisma";
import ProjectsDashboard from "./_components/ProjectsDashboard";

export const revalidate = 0;

export default async function ProjectsPage() {
  const [projects, companies] = await Promise.all([
    prisma.project.findMany({
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
    }),

    prisma.company.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="w-full space-y-6">
      <ProjectsDashboard 
        initialProjects={JSON.parse(JSON.stringify(projects))} 
        companies={JSON.parse(JSON.stringify(companies))}
      />
    </div>
  );
}
