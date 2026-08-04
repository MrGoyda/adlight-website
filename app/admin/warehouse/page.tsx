import { prisma } from "@/lib/prisma";
import WarehouseDashboard from "./_components/WarehouseDashboard";

export const revalidate = 0; // Отключаем кэширование страницы для получения актуальных данных

export default async function WarehousePage() {
  const items = await prisma.warehouseItem.findMany({
    orderBy: { name: "asc" },
  });

  const supplierPrices = await prisma.supplierPrice.findMany({
    include: {
      supplierObj: true,
    },
    orderBy: { supplier: "asc" },
  });

  const suppliers = await prisma.supplier.findMany({
    orderBy: { name: "asc" },
  });

  const transactions = await prisma.warehouseTransaction.findMany({
    include: {
      item: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <main className="min-h-screen bg-slate-50/50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <WarehouseDashboard
          initialItems={JSON.parse(JSON.stringify(items))}
          initialSupplierPrices={JSON.parse(JSON.stringify(supplierPrices))}
          initialSuppliers={JSON.parse(JSON.stringify(suppliers))}
          initialTransactions={JSON.parse(JSON.stringify(transactions))}
        />
      </div>
    </main>
  );
}
