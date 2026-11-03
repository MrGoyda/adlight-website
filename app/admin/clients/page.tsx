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
    <div className="w-full space-y-6">
      <ClientsDashboard initialClients={JSON.parse(JSON.stringify(clients))} />
    </div>
  );
}
