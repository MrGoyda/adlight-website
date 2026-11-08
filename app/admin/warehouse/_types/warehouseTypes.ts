import { InventoryUnit } from "@prisma/client";

export interface WarehouseItemData {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: InventoryUnit;
  price: number;
  location: string | null;
  minStock: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface WarehouseTransactionData {
  id: string;
  createdAt: string | Date;
  quantityChanged: number;
  description: string | null;
  leadId: string | null;
  item: {
    id: string;
    name: string;
    unit: InventoryUnit;
    category?: string;
  };
}

export interface WarehouseSupplierPriceData {
  id: string;
  name: string;
  supplier: string;
  price: number;
  unit: InventoryUnit;
  category?: string | null;
  subcategory?: string | null;
  supplierId?: string | null;
}

export interface WarehouseSupplierData {
  id: string;
  name: string;
  phone?: string | null;
  whatsapp?: string | null;
}

export type StockSortOption = 
  | "name_asc" 
  | "name_desc" 
  | "qty_asc" 
  | "qty_desc" 
  | "total_desc" 
  | "updated_desc";

export type StockStatusFilter = 
  | "all" 
  | "in_stock" 
  | "low_stock" 
  | "out_of_stock";

export interface WarehouseBreakdown {
  totalItemsCount: number;
  inStockCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalInventoryValue: number;
  recentIntakeCount: number;
  recentOutflowCount: number;
}
