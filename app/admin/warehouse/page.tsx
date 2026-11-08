import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import WarehouseDashboard from "./_components/WarehouseDashboard";
import { 
  WarehouseItemData, 
  WarehouseSupplierPriceData, 
  WarehouseTransactionData 
} from "./_types/warehouseTypes";
import { SupplierData } from "../pricing/_types/pricingTypes";

export const metadata: Metadata = {
  title: "Склад материалов и учет остатков цеха | ADLight CRM",
  description: "Оперативный учет запасов, оприходование от поставщиков, списание в заказы и инвентаризация",
};

export const dynamic = "force-dynamic";

export default async function WarehousePage() {
  const [itemsRaw, supplierPricesRaw, transactionsRaw, suppliersRaw] = await Promise.all([
    prisma.warehouseItem.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.supplierPrice.findMany({
      select: {
        id: true,
        name: true,
        supplier: true,
        price: true,
        unit: true,
        category: true,
        subcategory: true,
        supplierId: true,
        imageUrl: true,
        description: true,
        sourceUrl: true,
      },
      orderBy: [
        { isFavorite: "desc" },
        { supplier: "asc" },
        { name: "asc" },
      ],
    }),
    prisma.warehouseTransaction.findMany({
      include: {
        item: {
          select: {
            id: true,
            name: true,
            unit: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 150,
    }),
    prisma.supplier.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { prices: true },
        },
      },
    }),
  ]);

  const initialItems: WarehouseItemData[] = itemsRaw.map((i) => ({
    id: i.id,
    name: i.name,
    category: i.category,
    quantity: i.quantity,
    unit: i.unit,
    price: i.price,
    location: i.location,
    minStock: i.minStock,
    createdAt: i.createdAt.toISOString(),
    updatedAt: i.updatedAt.toISOString(),
  }));

  const initialSupplierPrices: WarehouseSupplierPriceData[] = supplierPricesRaw.map((s) => ({
    id: s.id,
    name: s.name,
    supplier: s.supplier,
    price: s.price,
    unit: s.unit,
    category: s.category,
    subcategory: s.subcategory,
    supplierId: s.supplierId,
    imageUrl: s.imageUrl,
    description: s.description,
    sourceUrl: s.sourceUrl,
  }));

  const initialTransactions: WarehouseTransactionData[] = transactionsRaw.map((t) => ({
    id: t.id,
    createdAt: t.createdAt.toISOString(),
    quantityChanged: t.quantityChanged,
    description: t.description,
    leadId: t.leadId,
    item: {
      id: t.item.id,
      name: t.item.name,
      unit: t.item.unit,
      category: t.item.category,
    },
  }));

  const initialSuppliers: SupplierData[] = suppliersRaw.map((s) => ({
    id: s.id,
    name: s.name,
    address: s.address,
    phone: s.phone,
    phones: s.phones,
    whatsapp: s.whatsapp,
    website: s.website,
    instagram: s.instagram,
    notes: s.notes,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
    _count: s._count,
  }));

  return (
    <div className="w-full space-y-6">
      <WarehouseDashboard
        initialItems={initialItems}
        initialSupplierPrices={initialSupplierPrices}
        initialTransactions={initialTransactions}
        initialSuppliers={initialSuppliers}
      />
    </div>
  );
}
