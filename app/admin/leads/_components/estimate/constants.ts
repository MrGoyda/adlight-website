import { EstimateItemType, InventoryUnit } from "@prisma/client";
import { Package, Layers, Truck, Wrench, DollarSign, PenTool } from "lucide-react";

export const DEFAULT_MARGIN_MULTIPLIER = 1.3;

export const ITEM_TYPE_LABELS: Record<
  EstimateItemType,
  { label: string; icon: any; color: string; bg: string }
> = {
  MATERIAL_STOCK: {
    label: "Со склада",
    icon: Package,
    color: "text-blue-600 border-blue-200 bg-blue-50/90 hover:bg-blue-100",
    bg: "bg-blue-50 text-blue-700 border-blue-200",
  },
  MATERIAL_SUPPLIER: {
    label: "Прайс поставщика",
    icon: Layers,
    color: "text-purple-600 border-purple-200 bg-purple-50/90 hover:bg-purple-100",
    bg: "bg-purple-50 text-purple-700 border-purple-200",
  },
  LOGISTICS: {
    label: "Логистика / Доставка",
    icon: Truck,
    color: "text-amber-600 border-amber-200 bg-amber-50/90 hover:bg-amber-100",
    bg: "bg-amber-50 text-amber-700 border-amber-200",
  },
  EQUIPMENT: {
    label: "Спецтехника / Вышка",
    icon: Wrench,
    color: "text-orange-600 border-orange-200 bg-orange-50/90 hover:bg-orange-100",
    bg: "bg-orange-50 text-orange-700 border-orange-200",
  },
  ASSEMBLY: {
    label: "Сборка цеха (ЗП)",
    icon: DollarSign,
    color: "text-indigo-600 border-indigo-200 bg-indigo-50/90 hover:bg-indigo-100",
    bg: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  INSTALLATION: {
    label: "Монтаж (ЗП)",
    icon: Wrench,
    color: "text-emerald-600 border-emerald-200 bg-emerald-50/90 hover:bg-emerald-100",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  CUSTOM: {
    label: "Вручную / Другое",
    icon: PenTool,
    color: "text-slate-700 border-slate-200 bg-slate-100 hover:bg-slate-200",
    bg: "bg-slate-100 text-slate-700 border-slate-200",
  },
};

export const UNIT_LABELS: Record<InventoryUnit, string> = {
  SQUARE_METER: "кв. м.",
  RUNNING_METER: "пог. м.",
  PIECE: "шт.",
  ROLL: "рулон",
  PACK: "упак.",
  LITER: "л.",
};

export const EQUIPMENT_PRESETS = [
  { h: 2, label: "2 ч (мин)", costTotal: 20000 },
  { h: 3, label: "3 ч", costTotal: 30000 },
  { h: 4, label: "4 ч", costTotal: 40000 },
  { h: 5, label: "5 ч", costTotal: 50000 },
  { h: 8, label: "8 ч (смена)", costTotal: 80000 },
];

export const LONG_TRUCK_PRESETS = [
  { h: 2, label: "2 ч (мин)", costTotal: 20000 },
  { h: 3, label: "3 ч", costTotal: 30000 },
  { h: 4, label: "4 ч", costTotal: 40000 },
  { h: 8, label: "8 ч (смена)", costTotal: 80000 },
];

export const STANDARD_TRUCK_PRESETS = [
  { trips: 1, label: "1 рейс", costTotal: 15000 },
  { trips: 2, label: "2 рейса", costTotal: 30000 },
  { trips: 3, label: "Смена (3 рейса)", costTotal: 45000 },
];
