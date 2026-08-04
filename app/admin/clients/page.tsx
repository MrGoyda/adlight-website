import { prisma } from "@/lib/prisma";
import ClientsDashboard from "./_components/ClientsDashboard";

export const revalidate = 0; // Отключаем кэширование страницы для получения актуальных данных

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    include: {
      leads: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-slate-50/50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <ClientsDashboard initialClients={JSON.parse(JSON.stringify(clients))} />
      </div>
    </main>
  );
}
