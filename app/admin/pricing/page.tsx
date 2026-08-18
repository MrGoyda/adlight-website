import React from "react";
import { Metadata } from "next";
import { getPricingData } from "./actions";
import PricingDashboard from "./_components/PricingDashboard";

export const metadata: Metadata = {
  title: "База товаров и Тарифы сметы | ADLight CRM",
  description: "Управление себестоимостью, прайсами поставщиков, логистикой и ставками ЗП в ADLight CRM",
};

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const { suppliers = [], supplierPrices = [], workOperations = [] } = await getPricingData();

  return (
    <PricingDashboard
      initialSuppliers={suppliers}
      initialSupplierPrices={supplierPrices}
      initialWorkOperations={workOperations}
    />
  );
}
