import { EstimateItemType, InventoryUnit } from "@prisma/client";

export interface CalculatorWarehouseItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: InventoryUnit;
  price: number;
}

export interface CalculatorSupplier {
  id: string;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
}

export interface CalculatorSupplierPrice {
  id: string;
  name: string;
  supplier: string;
  price: number;
  unit: InventoryUnit;
  category?: string | null;
  subcategory?: string | null;
  imageUrl?: string | null;
  description?: string | null;
  sourceUrl?: string | null;
  isService?: boolean;
  isFavorite?: boolean;
  supplierObj?: CalculatorSupplier | null;
}

export interface CalculatorWorkOperation {
  id: string;
  type: EstimateItemType;
  name: string;
  unit: InventoryUnit;
  defaultCost: number;
  defaultPrice: number;
  isCustom?: boolean;
}

export interface SpreadsheetItem {
  id: string; // уникальный временный или постоянный id строки
  type: EstimateItemType;
  name: string;
  quantity: number;
  unit: InventoryUnit;
  costPrice: number; // себестоимость за ед.
  sellPrice: number; // продажа за ед.
  supplierPriceId?: string | null;
  warehouseItemId?: string | null;
}

export interface EstimatePresetItem {
  type: EstimateItemType;
  name: string;
  quantity: number;
  unit: InventoryUnit;
  costPrice: number;
  sellPrice: number;
  supplierPriceId?: string | null;
  warehouseItemId?: string | null;
}

export interface EstimatePresetData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  category: string | null;
  description: string | null;
  items: EstimatePresetItem[];
  isFavorite: boolean;
}

export interface TargetMarginScenario {
  label: string;
  multiplier: number;
  description: string;
}

export interface CalculationBreakdown {
  totalCost: number;
  totalSell: number;
  margin: number;
  marginPercent: number;
  itemsCount: number;
}

export interface CalculatorInitialData {
  warehouseItems: CalculatorWarehouseItem[];
  supplierPrices: CalculatorSupplierPrice[];
  workOperations: CalculatorWorkOperation[];
  presets: EstimatePresetData[];
  leads: Array<{ id: string; name: string; phone: string; status: string }>;
}

