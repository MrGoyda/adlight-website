"use client";

import React, { useState, useEffect, useTransition, useMemo } from "react";
import { createPortal } from "react-dom";
import { 
  X, 
  Plus, 
  Trash2, 
  Calculator, 
  AlertTriangle, 
  Check, 
  Package, 
  Layers, 
  Truck, 
  Wrench, 
  DollarSign,
  Search,
  Phone,
  MessageCircle,
  MapPin,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { triggerHaptic } from "@/lib/haptics";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { EstimateItemType, InventoryUnit } from "@prisma/client";
import { saveLeadEstimate, deductEstimateStock } from "../estimateActions";

interface WarehouseItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: InventoryUnit;
  price: number;
}

interface Supplier {
  id: string;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
}

interface SupplierPrice {
  id: string;
  name: string;
  supplier: string;
  price: number;
  unit: InventoryUnit;
  supplierObj?: Supplier | null;
}

interface EstimateItem {
  id?: string;
  type: EstimateItemType;
  name: string;
  quantity: number;
  unit: InventoryUnit | null;
  costPrice: number;
  sellPrice: number;
  warehouseItemId?: string | null;
  supplierPriceId?: string | null;
}

interface EstimateModalProps {
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

const ITEM_TYPE_LABELS: Record<EstimateItemType, { label: string; icon: any; color: string }> = {
  MATERIAL_STOCK: { label: "Со склада", icon: Package, color: "text-blue-500 bg-blue-50/50 border-blue-200/50 hover:bg-blue-50" },
  MATERIAL_SUPPLIER: { label: "Прайс поставщика", icon: Layers, color: "text-purple-500 bg-purple-50/50 border-purple-200/50 hover:bg-purple-50" },
  LOGISTICS: { label: "Логистика / Газель", icon: Truck, color: "text-amber-500 bg-amber-50/50 border-amber-200/50 hover:bg-amber-50" },
  EQUIPMENT: { label: "Вышка / Техника", icon: Wrench, color: "text-orange-500 bg-orange-50/50 border-orange-200/50 hover:bg-orange-50" },
  ASSEMBLY: { label: "Сборка (ЗП)", icon: DollarSign, color: "text-indigo-500 bg-indigo-50/50 border-indigo-200/50 hover:bg-indigo-50" },
  INSTALLATION: { label: "Монтаж (ЗП)", icon: Wrench, color: "text-emerald-500 bg-emerald-50/50 border-emerald-200/50 hover:bg-emerald-50" },
  CUSTOM: { label: "Вручную", icon: Plus, color: "text-slate-500 bg-slate-50 border-slate-200/50 hover:bg-slate-100" },
};

const UNIT_LABELS: Record<InventoryUnit, string> = {
  SQUARE_METER: "кв. м.",
  RUNNING_METER: "пог. м.",
  PIECE: "шт.",
  ROLL: "рулон",
  PACK: "упак.",
  LITER: "л."
};

interface ParsedSupplierPrice {
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

export default function EstimateModal({
  isOpen,
  onClose,
  leadId,
  leadName,
  initialItems,
  isStockDeducted,
  warehouseItems,
  supplierPrices,
  onSaveSuccess,
  leads = [],
  estimateId = null
}: EstimateModalProps) {
  const [items, setItems] = useState<EstimateItem[]>(initialItems);
  const [stockDeducted, setStockDeducted] = useState(isStockDeducted);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(leadId);
  const [currentEstimateId, setCurrentEstimateId] = useState<string | null>(estimateId);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Состояния для кастомного поповера подбора материалов
  const [activePickerIdx, setActivePickerIdx] = useState<number | null>(null);
  const [pickerSearch, setPickerSearch] = useState("");
  const [pickerCategory, setPickerCategory] = useState<string | null>(null);
  const [pickerType, setPickerType] = useState<string | null>(null);
  const [pickerSpec, setPickerSpec] = useState<string | null>(null);

  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Каскадный парсер прайс-листов поставщиков
  const parsedPrices = useMemo<ParsedSupplierPrice[]>(() => {
    return supplierPrices.map(sp => {
      let category = "Другое";
      const nameLower = sp.name.toLowerCase();
      if (
        nameLower.includes("пвх") || 
        nameLower.includes("оргстекло") || 
        nameLower.includes("акрил") || 
        nameLower.includes("алюкобонд") || 
        nameLower.includes("пэт") || 
        nameLower.includes("пвс") || 
        nameLower.includes("abs") || 
        nameLower.includes("пластик")
      ) {
        category = "Листовые материалы";
      } else if (nameLower.includes("баннер") || nameLower.includes("пленка") || nameLower.includes("магнитная")) {
        category = "Рулонные материалы";
      } else if (nameLower.includes("светодиод") || nameLower.includes("лент")) {
        category = "Светодиоды";
      } else if (nameLower.includes("неон")) {
        category = "Неон";
      } else if (
        nameLower.includes("трансформатор") || 
        nameLower.includes("блок питания") || 
        nameLower.includes("шввп") || 
        nameLower.includes("кабель") || 
        nameLower.includes("провод")
      ) {
        category = "Электрика и Питание";
      } else if (nameLower.includes("скотч") || nameLower.includes("клей") || nameLower.includes("mitreapel")) {
        category = "Клей и Скотч";
      }

      let materialType = "Другое";
      if (nameLower.includes("пвх")) materialType = "ПВХ";
      else if (nameLower.includes("оргстекло")) materialType = "Оргстекло";
      else if (nameLower.includes("акрил")) materialType = "Акрил";
      else if (nameLower.includes("алюкобонд")) materialType = "Алюкобонд";
      else if (nameLower.includes("пэт") || nameLower.includes("пвс")) materialType = "ПЭТ / ПВС";
      else if (nameLower.includes("abs") || nameLower.includes("пластик")) materialType = "Пластик ABS";
      else if (nameLower.includes("баннер")) materialType = "Баннер";
      else if (nameLower.includes("пленка")) materialType = "Пленка";
      else if (nameLower.includes("светодиод")) materialType = "Светодиоды";
      else if (nameLower.includes("лент")) materialType = "Светодиодная лента";
      else if (nameLower.includes("неон")) materialType = "Неон";
      else if (nameLower.includes("трансформатор") || nameLower.includes("блок питания")) materialType = "Блок питания / Трансформатор";
      else if (nameLower.includes("шввп") || nameLower.includes("кабель") || nameLower.includes("провод")) materialType = "Кабель / Провод";
      else if (nameLower.includes("скотч")) materialType = "Скотч";
      else if (nameLower.includes("клей") || nameLower.includes("mitreapel")) materialType = "Клей";
      else {
        const firstWord = sp.name.split(/[ \/]/)[0];
        materialType = firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
      }

      const specRegex = /(\d+(?:\.\d+)?\s*(?:мм|mm|gsm|w|v|v|v|v|v|v|v|v|v|мл|ml|см|cm|вт|v|a))/i;
      const match = sp.name.match(specRegex);
      const spec = match ? match[0].toUpperCase() : "Без параметров";

      let detail = sp.name;
      detail = detail.replace(new RegExp(materialType, "i"), "");
      if (match) {
        detail = detail.replace(new RegExp(match[0], "i"), "");
      }
      detail = detail.replace(/\/+/g, " ").replace(/\s+/g, " ").trim();
      if (detail.startsWith("/")) detail = detail.slice(1).trim();
      if (detail.endsWith("/")) detail = detail.slice(0, -1).trim();
      if (!detail) {
        detail = `Стандарт`;
      }

      return {
        id: sp.id,
        originalName: sp.name,
        supplier: sp.supplier,
        price: sp.price,
        unit: sp.unit,
        category,
        materialType,
        spec,
        detail: `${detail}`
      };
    });
  }, [supplierPrices]);

  const searchResults = useMemo(() => {
    if (!pickerSearch) return [];
    const query = pickerSearch.toLowerCase();
    return parsedPrices.filter(p => 
      p.originalName.toLowerCase().includes(query) || 
      p.supplier.toLowerCase().includes(query)
    );
  }, [pickerSearch, parsedPrices]);

  const uniqueCategories = useMemo(() => Array.from(new Set(parsedPrices.map(p => p.category))), [parsedPrices]);
  
  const uniqueTypes = useMemo(() => {
    if (!pickerCategory) return [];
    return Array.from(new Set(parsedPrices.filter(p => p.category === pickerCategory).map(p => p.materialType)));
  }, [pickerCategory, parsedPrices]);

  const uniqueSpecs = useMemo(() => {
    if (!pickerCategory || !pickerType) return [];
    return Array.from(new Set(parsedPrices.filter(p => p.category === pickerCategory && p.materialType === pickerType).map(p => p.spec)));
  }, [pickerCategory, pickerType, parsedPrices]);

  const matchedOptions = useMemo(() => {
    if (!pickerCategory || !pickerType || !pickerSpec) return [];
    return parsedPrices.filter(p => p.category === pickerCategory && p.materialType === pickerType && p.spec === pickerSpec);
  }, [pickerCategory, pickerType, pickerSpec, parsedPrices]);

  const listItems = pickerSearch ? searchResults : matchedOptions;

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setError(null);
      setSelectedLeadId(leadId);
      setCurrentEstimateId(estimateId);
      
      const mapped = initialItems.map(item => {
        if (item.type === "MATERIAL_SUPPLIER" && !item.supplierPriceId) {
          const found = supplierPrices.find(p => `${p.supplier}: ${p.name}` === item.name);
          if (found) {
            return { ...item, supplierPriceId: found.id };
          }
        }
        return item;
      });

      setItems(mapped);
      setStockDeducted(isStockDeducted);
      lockScroll("estimate-modal");
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      unlockScroll("estimate-modal");
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialItems, isStockDeducted, leadId, estimateId]);

  useEffect(() => {
    return () => {
      unlockScroll("estimate-modal");
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleAddItem = (type: EstimateItemType) => {
    triggerHaptic("light");
    let name = "";
    let costPrice = 0;
    let unit: InventoryUnit | null = "PIECE";
    let warehouseItemId: string | null = null;
    let supplierPriceId: string | null = null;

    if (type === "MATERIAL_STOCK" && warehouseItems.length > 0) {
      name = warehouseItems[0].name;
      costPrice = warehouseItems[0].price;
      unit = warehouseItems[0].unit;
      warehouseItemId = warehouseItems[0].id;
    } else if (type === "MATERIAL_SUPPLIER" && supplierPrices.length > 0) {
      name = `${supplierPrices[0].supplier}: ${supplierPrices[0].name}`;
      costPrice = supplierPrices[0].price;
      unit = supplierPrices[0].unit;
      supplierPriceId = supplierPrices[0].id;
    } else if (type === "LOGISTICS") {
      name = "Аренда газели / доставка";
      costPrice = 15000;
      unit = "PIECE";
    } else if (type === "EQUIPMENT") {
      name = "Аренда автовышки";
      costPrice = 20000;
      unit = "PIECE";
    } else if (type === "ASSEMBLY") {
      name = "Оплата сборщикам";
      unit = "PIECE";
    } else if (type === "INSTALLATION") {
      name = "Оплата монтажникам";
      unit = "PIECE";
    } else {
      name = "Новая позиция";
      unit = "PIECE";
    }

    setItems([
      ...items,
      {
        type,
        name,
        quantity: 1,
        unit,
        costPrice,
        sellPrice: costPrice * 1.3,
        warehouseItemId,
        supplierPriceId,
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    triggerHaptic("light");
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdateItemField = (index: number, field: keyof EstimateItem, value: any) => {
    const updated = [...items];
    
    if (field === "warehouseItemId") {
      const selectedItem = warehouseItems.find(i => i.id === value);
      if (selectedItem) {
        updated[index].warehouseItemId = selectedItem.id;
        updated[index].name = selectedItem.name;
        updated[index].costPrice = selectedItem.price;
        updated[index].unit = selectedItem.unit;
        updated[index].sellPrice = selectedItem.price * 1.3;
      }
    } else if (field === "supplierPriceId") {
      const selectedPrice = supplierPrices.find(p => p.id === value);
      if (selectedPrice) {
        updated[index].supplierPriceId = selectedPrice.id;
        updated[index].name = `${selectedPrice.supplier}: ${selectedPrice.name}`;
        updated[index].costPrice = selectedPrice.price;
        updated[index].unit = selectedPrice.unit;
        updated[index].sellPrice = selectedPrice.price * 1.3;
      }
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value
      };
    }
    setItems(updated);
  };

  const renderSupplierPriceButton = (item: EstimateItem, idx: number) => {
    const selectedPrice = supplierPrices.find(p => p.id === item.supplierPriceId);
    return (
      <button
        type="button"
        onClick={() => {
          triggerHaptic("light");
          setActivePickerIdx(idx);
          if (selectedPrice) {
            const parsed = parsedPrices.find(p => p.id === selectedPrice.id);
            if (parsed) {
              setPickerCategory(parsed.category);
              setPickerType(parsed.materialType);
              setPickerSpec(parsed.spec);
            }
          } else {
            setPickerCategory(parsedPrices[0]?.category || null);
            setPickerType(null);
            setPickerSpec(null);
          }
          setPickerSearch("");
        }}
        className="w-full px-3 py-2 text-xs font-bold text-left border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 rounded-xl transition cursor-pointer flex items-center justify-between shadow-sm active:scale-95 border-orange-200/30"
      >
        {selectedPrice ? (
          <div className="flex flex-col truncate pr-2">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">[{selectedPrice.supplier}]</span>
            <span className="text-slate-800 font-extrabold truncate max-w-[150px]">{selectedPrice.name}</span>
          </div>
        ) : (
          <span className="text-slate-400 font-bold flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            Выбрать материал...
          </span>
        )}
        {selectedPrice && (
          <span className="text-orange-500 font-black shrink-0 text-xs bg-orange-50 px-2 py-1 rounded-lg border border-orange-100">{selectedPrice.price.toLocaleString()} ₸</span>
        )}
      </button>
    );
  };



  const totalCost = items.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0);
  const totalSell = items.reduce((sum, item) => sum + (item.sellPrice * item.quantity), 0);
  const margin = totalSell - totalCost;
  const marginPercent = totalSell > 0 ? (margin / totalSell) * 100 : 0;

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      const cleanItems = items.map(item => ({
        type: item.type,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        costPrice: item.costPrice,
        sellPrice: item.sellPrice,
        warehouseItemId: item.warehouseItemId,
      }));

      const res = await saveLeadEstimate(selectedLeadId, cleanItems, currentEstimateId);
      if (res.error) {
        setError(res.error);
      } else {
        triggerHaptic("success");
        onSaveSuccess(totalSell, totalCost, res.data);
        onClose();
      }
    });
  };

  const handleDeductStock = () => {
    if (!selectedLeadId) {
      alert("Сначала привяжите смету к сделке для списания остатков.");
      return;
    }
    if (!confirm("Вы уверены, что хотите списать материалы со склада под этот проект? Это действие необратимо.")) return;
    setError(null);
    startTransition(async () => {
      const res = await deductEstimateStock(selectedLeadId);
      if (res.error) {
        setError(res.error);
      } else {
        triggerHaptic("success");
        setStockDeducted(true);
        alert("Материалы успешно списаны со склада!");
      }
    });
  };

  if (!mounted || !shouldRender) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 pb-safe">
      {/* Overlay с анимацией и блюром */}
      <div 
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Окно калькулятора с Apple-анимацией */}
      <div 
        className={`w-full max-w-6xl relative z-10 h-[90dvh] flex flex-col rounded-[2.5rem] shadow-apple-modal border border-white/20 bg-white/95 backdrop-blur-2xl transition-all duration-300 ease-out transform overflow-hidden ${
          isVisible ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
        }`}
      >
        {/* Декоративное свечение */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[60px] rounded-full pointer-events-none" />

        {/* Шапка модального окна */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200/50 bg-white/80 shrink-0 relative z-10">
            <div>
              <h3 className="font-black text-slate-800 tracking-tight flex items-center gap-2">
                <Calculator className="w-5 h-5 text-orange-500 animate-pulse" />
                Калькулятор себестоимости проекта
              </h3>
              {leadId ? (
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Лид: {leadName}</p>
              ) : (
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Привязать к сделке:</span>
                  <select
                    value={selectedLeadId || ""}
                    onChange={(e) => {
                      setSelectedLeadId(e.target.value || null);
                    }}
                    className="px-3 py-1 text-xs font-bold border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 max-w-xs cursor-pointer shadow-sm"
                  >
                    <option value="">-- Без сделки (автономно) --</option>
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.phone})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 rounded-full transition z-50 cursor-pointer active:scale-95"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Ошибки */}
          {error && (
            <div className="mx-6 mt-4 p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold flex items-center gap-2 shrink-0 relative z-10">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Скроллируемый контент */}
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-6 space-y-6 relative z-10">
            
            {/* Панель быстрого добавления */}
            <div className="space-y-2.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Добавить позицию затрат</span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(ITEM_TYPE_LABELS).map(([type, value]) => {
                  const Icon = value.icon;
                  return (
                    <button
                      key={type}
                      onClick={() => handleAddItem(type as EstimateItemType)}
                      className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border rounded-xl hover:shadow-sm transition active:scale-95 cursor-pointer ${value.color}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {value.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Таблица */}
            <div className="border border-slate-200/60 rounded-2xl overflow-hidden bg-white/90 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="p-4 w-1/4">Название / Материал</th>
                    <th className="p-4 w-28">Тип</th>
                    <th className="p-4 w-24 text-right">Кол-во</th>
                    <th className="p-4 w-24">Ед. изм.</th>
                    <th className="p-4 w-32 text-right">Себестоимость</th>
                    <th className="p-4 w-32 text-right">Цена продажи</th>
                    <th className="p-4 w-24 text-right">Итого (Прод.)</th>
                    <th className="p-4 w-16 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400 italic">
                        Добавьте позиции затрат по кнопкам выше
                      </td>
                    </tr>
                  ) : (
                    items.map((item, idx) => {
                      const TypeIcon = ITEM_TYPE_LABELS[item.type].icon;
                      return (
                        <tr key={idx} className="hover:bg-slate-50/40 transition">
                          <td className="p-3">
                            {item.type === "MATERIAL_STOCK" ? (
                              <select
                                value={item.warehouseItemId || ""}
                                onChange={(e) => handleUpdateItemField(idx, "warehouseItemId", e.target.value)}
                                className="w-full px-2 py-1.5 text-xs font-bold border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                              >
                                {warehouseItems.map((wi) => (
                                  <option key={wi.id} value={wi.id}>
                                    {wi.name} ({wi.quantity} {UNIT_LABELS[wi.unit]}) — {wi.price} ₸
                                  </option>
                                ))}
                              </select>
                            ) : item.type === "MATERIAL_SUPPLIER" ? renderSupplierPriceButton(item, idx) : (
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => handleUpdateItemField(idx, "name", e.target.value)}
                                className="w-full px-2 py-1.5 text-xs font-bold border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                              />
                            )}
                          </td>

                          <td className="p-3">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500">
                              <TypeIcon className="w-3.5 h-3.5 text-slate-400" />
                              {ITEM_TYPE_LABELS[item.type].label}
                            </span>
                          </td>

                          <td className="p-3">
                            <input
                              type="number"
                              step="any"
                              value={item.quantity}
                              onChange={(e) => handleUpdateItemField(idx, "quantity", parseFloat(e.target.value) || 0)}
                              className="w-full px-2 py-1.5 text-xs text-right font-extrabold border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                            />
                          </td>

                          <td className="p-3">
                            {(item.type === "MATERIAL_STOCK" || item.type === "MATERIAL_SUPPLIER") ? (
                              <span className="text-xs text-slate-500 font-bold px-2">
                                {UNIT_LABELS[item.unit || "PIECE"]}
                              </span>
                            ) : (
                              <select
                                value={item.unit || "PIECE"}
                                onChange={(e) => handleUpdateItemField(idx, "unit", e.target.value as InventoryUnit)}
                                className="w-full px-1 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                              >
                                {Object.entries(UNIT_LABELS).map(([key, label]) => (
                                  <option key={key} value={key}>{label}</option>
                                ))}
                              </select>
                            )}
                          </td>

                          <td className="p-3">
                            <input
                              type="number"
                              disabled={item.type === "MATERIAL_STOCK" || item.type === "MATERIAL_SUPPLIER"}
                              value={item.costPrice}
                              onChange={(e) => handleUpdateItemField(idx, "costPrice", parseFloat(e.target.value) || 0)}
                              className="w-full px-2 py-1.5 text-xs text-right font-semibold border border-slate-200 rounded-lg focus:outline-none disabled:bg-slate-50 disabled:text-slate-400 focus:ring-2 focus:ring-orange-500/20"
                            />
                          </td>

                          <td className="p-3">
                            <input
                              type="number"
                              value={item.sellPrice}
                              onChange={(e) => handleUpdateItemField(idx, "sellPrice", parseFloat(e.target.value) || 0)}
                              className="w-full px-2 py-1.5 text-xs text-right font-bold text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                            />
                          </td>

                          <td className="p-3 text-right text-xs font-black text-slate-800">
                            {((item.sellPrice || 0) * (item.quantity || 0)).toLocaleString()} ₸
                          </td>

                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleRemoveItem(idx)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition cursor-pointer active:scale-90"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Футер с итогами и кнопками в стиле Apple */}
          <div className="p-6 border-t border-slate-200/50 bg-white/60 grid grid-cols-1 md:grid-cols-4 gap-6 items-center shrink-0 relative z-10">
            <div className="md:col-span-2 grid grid-cols-3 gap-4 border-r border-slate-200/60 pr-6">
              <div>
                <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider block">Себестоимость</span>
                <span className="text-base font-extrabold text-slate-700">{totalCost.toLocaleString()} ₸</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider block">Цена продажи (выручка)</span>
                <span className="text-base font-black text-slate-900">{totalSell.toLocaleString()} ₸</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider block">Прибыль</span>
                <span className="text-base font-black text-emerald-600">
                  {margin.toLocaleString()} ₸ <span className="text-xs font-semibold text-emerald-500">({marginPercent.toFixed(0)}%)</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1 text-xs justify-center">
              {stockDeducted ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-emerald-600 bg-emerald-50 border border-emerald-200/50 font-bold w-fit">
                  <Check className="w-4 h-4" /> Материалы со склада списаны
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleDeductStock}
                  disabled={items.filter(i => i.type === "MATERIAL_STOCK").length === 0 || isPending}
                  className="flex items-center gap-2 px-3.5 py-2 border border-slate-250 hover:border-orange-500/20 bg-white hover:bg-slate-50 text-slate-700 font-extrabold rounded-xl transition w-fit disabled:opacity-50 disabled:pointer-events-none active:scale-95 cursor-pointer shadow-sm text-xs"
                >
                  <Package className="w-4 h-4 text-orange-500" />
                  Списать остатки со склада
                </button>
              )}
              <p className="text-[9px] text-slate-400 font-medium">Ручное списание под проект</p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="lightOutline"
                onClick={onClose}
                className="text-slate-650 text-xs font-bold py-2.5 px-4"
              >
                Отмена
              </Button>
              <Button
                type="button"
                variant="solid"
                disabled={isPending}
                onClick={handleSave}
                className="text-xs font-extrabold py-2.5 px-6"
              >
                {isPending ? "Сохранение..." : "Сохранить смету"}
              </Button>
            </div>
          </div>
          {/* Слайд-панель (поповер) подбора материалов */}
          <AnimatePresence>
            {activePickerIdx !== null && (
              <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 250 }}
                className="absolute right-0 top-0 bottom-0 w-full sm:w-[480px] bg-white border-l border-slate-200/80 shadow-2xl z-[9999] p-6 flex flex-col rounded-r-[2.5rem]"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
                  <div>
                    <h4 className="font-black text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-orange-500" />
                      Подбор материала
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Строка сметы #{activePickerIdx + 1}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActivePickerIdx(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition active:scale-90"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="my-4 shrink-0 relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Быстрый поиск материала..."
                    value={pickerSearch}
                    onChange={(e) => setPickerSearch(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/25 transition text-slate-800"
                  />
                  {pickerSearch && (
                    <button
                      type="button"
                      onClick={() => setPickerSearch("")}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Main Content (Scrollable) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1 -mr-2">
                  {!pickerSearch ? (
                    <>
                      {/* Step 1: Categories */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">1. Категория</span>
                        <div className="flex flex-wrap gap-1.5">
                          {uniqueCategories.map(cat => {
                            const isActive = pickerCategory === cat;
                            return (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => {
                                  setPickerCategory(cat);
                                  const subTypes = Array.from(new Set(parsedPrices.filter(p => p.category === cat).map(p => p.materialType)));
                                  setPickerType(subTypes[0] || null);
                                  if (subTypes[0]) {
                                    const subSpecs = Array.from(new Set(parsedPrices.filter(p => p.category === cat && p.materialType === subTypes[0]).map(p => p.spec)));
                                    setPickerSpec(subSpecs[0] || null);
                                  } else {
                                    setPickerSpec(null);
                                  }
                                }}
                                className={`px-3 py-1.5 text-[10px] font-black rounded-xl transition ${
                                  isActive
                                    ? "bg-orange-500 text-white shadow-sm shadow-orange-500/20"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-650"
                                }`}
                              >
                                {cat}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Step 2: Types */}
                      {pickerCategory && uniqueTypes.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">2. Тип материала</span>
                          <div className="grid grid-cols-2 gap-2">
                            {uniqueTypes.map(t => {
                              const isActive = pickerType === t;
                              return (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => {
                                    setPickerType(t);
                                    const subSpecs = Array.from(new Set(parsedPrices.filter(p => p.category === pickerCategory && p.materialType === t).map(p => p.spec)));
                                    setPickerSpec(subSpecs[0] || null);
                                  }}
                                  className={`px-3 py-2 text-xs font-black rounded-xl border text-left transition ${
                                    isActive
                                      ? "border-orange-500 bg-orange-50/50 text-orange-600 shadow-sm"
                                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                                  }`}
                                >
                                  {t}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Step 3: Specifications */}
                      {pickerCategory && pickerType && uniqueSpecs.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">3. Параметр (толщина / мощность)</span>
                          <div className="flex flex-wrap gap-1.5">
                            {uniqueSpecs.map(s => {
                              const isActive = pickerSpec === s;
                              return (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => setPickerSpec(s)}
                                  className={`px-3 py-1.5 text-xs font-extrabold rounded-lg border transition ${
                                    isActive
                                      ? "border-orange-500 bg-orange-50/30 text-orange-600"
                                      : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {s}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  ) : null}

                  {/* Step 4: Options / Matches */}
                  <div className="space-y-2.5 pt-2">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
                      {pickerSearch ? `Результаты поиска (${listItems.length})` : "4. Доступные предложения"}
                    </span>

                    {listItems.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 text-xs italic">
                        {pickerSearch ? "Ничего не найдено по этому запросу" : "Выберите параметры выше"}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {listItems.map(item => {
                          const rawPrice = supplierPrices.find(sp => sp.id === item.id);
                          const sObj = rawPrice?.supplierObj;
                          return (
                            <div
                              key={item.id}
                              onClick={() => {
                                handleUpdateItemField(activePickerIdx!, "supplierPriceId", item.id);
                                triggerHaptic("success");
                                setActivePickerIdx(null);
                              }}
                              className="p-4 border border-slate-200/80 hover:border-orange-400 hover:bg-orange-50/5 rounded-2xl transition cursor-pointer flex flex-col gap-3 shadow-sm bg-slate-50/30"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-0.5">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-black bg-orange-100/50 text-orange-600 tracking-wider">
                                    {item.supplier}
                                  </span>
                                  <h5 className="font-extrabold text-slate-800 text-xs leading-snug">{item.originalName}</h5>
                                </div>
                                <div className="text-right shrink-0">
                                  <div className="font-black text-slate-900 text-sm">{item.price.toLocaleString()} ₸</div>
                                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 font-mono">За {UNIT_LABELS[item.unit]}</div>
                                </div>
                              </div>

                              {sObj && (
                                <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5 text-[10px] text-slate-500 font-semibold">
                                  {sObj.address && (
                                    <div className="flex items-center gap-1.5">
                                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                      <span className="truncate">{sObj.address}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center justify-between gap-2 pt-1">
                                    {sObj.phone && (
                                      <a
                                        href={`tel:${sObj.phone}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-1 text-slate-600 hover:text-orange-500 transition"
                                      >
                                        <Phone className="w-3 h-3 text-slate-400" />
                                        {sObj.phone}
                                      </a>
                                    )}
                                    {sObj.whatsapp && (
                                      <a
                                        href={sObj.whatsapp}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-bold border border-emerald-100 transition"
                                      >
                                        <MessageCircle className="w-3.5 h-3.5 text-emerald-550 fill-emerald-500" />
                                        WhatsApp
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
      </div>
    </div>,
    document.body
  );
}
