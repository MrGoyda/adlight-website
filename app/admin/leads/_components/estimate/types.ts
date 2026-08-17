import { EstimateItemType, InventoryUnit } from "@prisma/client";

export interface WarehouseItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: InventoryUnit;
  price: number;
}

export interface Supplier {
  id: string;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
}

export interface SupplierPrice {
  id: string;
  name: string;
  supplier: string;
  price: number;
  unit: InventoryUnit;
  supplierObj?: Supplier | null;
}

export interface EstimateItem {
  id?: string;
  type: EstimateItemType;
  name: string;
  quantity: number | string;
  unit: InventoryUnit | null;
  costPrice: number | string;
  sellPrice: number | string;
  warehouseItemId?: string | null;
  supplierPriceId?: string | null;
}

export interface WorkOperationItem {
  id: string;
  type: EstimateItemType;
  name: string;
  unit: InventoryUnit;
  defaultCost: number;
  defaultPrice: number;
  isCustom?: boolean;
}

export interface ParsedSupplierPrice {
  id: string;
  originalName: string;
  supplier: string;
  price: number;
  unit: InventoryUnit;
  category: string;
  materialType: string;
  spec: string;
  detail: string;
}

export interface EstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string | null;
  leadName: string;
  initialItems: EstimateItem[];
  isStockDeducted: boolean;
  warehouseItems: WarehouseItem[];
  supplierPrices: SupplierPrice[];
  onSaveSuccess: (revenue: number, expenses: number, newEstimate: any) => void;
  leads?: Array<{ id: string; name: string; phone: string }>;
  estimateId?: string | null;
}
