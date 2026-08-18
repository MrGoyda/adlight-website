import { InventoryUnit, EstimateItemType } from "@prisma/client";

export interface SupplierData {
  id: string;
  name: string;
  address?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  notes?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  _count?: {
    prices: number;
  };
}

export interface SupplierPriceItem {
  id: string;
  name: string;
  supplier: string;
  price: number;
  unit: InventoryUnit;
  supplierId?: string | null;
  supplierObj?: SupplierData | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface WorkOperationItem {
  id: string;
  type: EstimateItemType;
  name: string;
  unit: InventoryUnit;
  defaultCost: number;
  defaultPrice: number;
  isCustom: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type PricingTabType = "materials" | "rates" | "suppliers";
