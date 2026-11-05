"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { X, Save, Package, Link as LinkIcon, Handshake, Loader2 } from "lucide-react";
import { InventoryUnit } from "@prisma/client";
import { SupplierData, SupplierPriceItem } from "../../_types/pricingTypes";
import { INVENTORY_UNITS, MATERIAL_TAXONOMY, MaterialCategoryItem } from "../../_data/pricingDictionary";
import { triggerHaptic } from "@/lib/haptics";
import BottomSheet from "@/components/ui/BottomSheet";
import { pricingDict } from "@/dictionaries/pricing";

import MaterialImageUploader from "./modal/MaterialImageUploader";
import MaterialCategorySelects from "./modal/MaterialCategorySelects";
import MaterialSpecChips from "./modal/MaterialSpecChips";

// Умные подсказки характеристик по категориям для быстрого наполнения в 1 клик
const SUGGESTED_SPECS_BY_CATEGORY: Record<string, string[]> = {
  sheets: [
    "2 мм", "3 мм", "4 мм", "5 мм", "10 мм",
    "2.05×3.05 м", "1.22×2.44 м", "Молочный", "Прозрачный", "Белый",
    "Стенка 0.21 мм", "Плотность 0.55",
  ],
  lighting: [
    "0.72W", "1.2W", "1.5W", "12V", "24V", "IP65", "IP67",
    "Холодный (6500K)", "Нейтральный (4000K)", "Теплый (3000K)", "RGB",
    "60W", "100W", "200W", "300W", "400W",
  ],
  vinyl: [
    "Матовая", "Глянцевая", "1.00 м", "1.26 м", "1.60 м", "3.20 м",
    "340 г/м²", "440 г/м²", "510 г/м² литой", "Frontlit", "Backlit", "Blackout",
  ],
  profiles: [
    "40 мм", "60 мм", "80 мм", "90 мм", "130 мм",
    "Клик-профиль 25 мм", "20×20 мм", "25×25 мм", "40×20 мм", "40×40 мм",
    "Анодированное серебро", "Черный матовый",
  ],
  hardware: [
    "10 мм", "12 мм", "20 мм", "30 мм", "50 мм", "30 м", "50 м",
    "2-х компонентный с активатором", "Суперклей", "Жидкие гвозди",
    "Люверсы 10 мм", "Люверсы 12 мм", "1000 шт",
  ],
  services: [
    "Резка ЧПУ", "Лазерная резка", "УФ-печать", "Интерьерная печать",
    "Плоттерная резка", "Порошковая покраска", "Гибка акрила",
  ],
};

interface MaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id?: string;
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
    supplierId?: string | null;
  }) => Promise<void>;
  editingItem?: SupplierPriceItem | null;
  suppliers: SupplierData[];
  taxonomy?: MaterialCategoryItem[];
}

export default function MaterialModal({
  isOpen,
  onClose,
  onSave,
  editingItem,
  suppliers,
  taxonomy = MATERIAL_TAXONOMY,
}: MaterialModalProps) {
  const [name, setName] = useState("");
  const [supplier, setSupplier] = useState("");
  const [supplierId, setSupplierId] = useState<string | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [unit, setUnit] = useState<InventoryUnit>("SQUARE_METER");
  const [categoryId, setCategoryId] = useState("sheets");
  const [subcategory, setSubcategory] = useState("");
  const [customSubcategory, setCustomSubcategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isService, setIsService] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  // Горячая клавиша ⌘Enter / Ctrl+Enter для быстрого сохранения
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const currentCategoryDef = useMemo(() => {
    return taxonomy.find((c) => c.id === categoryId) || taxonomy[0];
  }, [taxonomy, categoryId]);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name || "");
      setSupplier(editingItem.supplier || "");
      setSupplierId(editingItem.supplierId || "");
      setPrice(editingItem.price || "");
      setUnit(editingItem.unit || "SQUARE_METER");
      setImageUrl(editingItem.imageUrl || "");
      setSourceUrl(editingItem.sourceUrl || "");
      setDescription(editingItem.description || "");
      setIsService(Boolean(editingItem.isService));

      const matchedCat = taxonomy.find(
        (c) =>
          c.label.toLowerCase() === (editingItem.category || "").toLowerCase() ||
          c.subcategories.includes(editingItem.subcategory || "")
      );
      if (matchedCat) {
        setCategoryId(matchedCat.id);
      } else if (editingItem.isService) {
        setCategoryId("services");
      } else {
        setCategoryId("sheets");
      }

      const existingSub = editingItem.subcategory || "";
      setSubcategory(existingSub || matchedCat?.subcategories[0] || "");
      setCustomSubcategory("");
    } else {
      setName("");
      setSupplier(suppliers[0]?.name || "SignTech");
      setSupplierId(suppliers[0]?.id || "");
      setPrice("");
      setUnit("SQUARE_METER");
      setImageUrl("");
      setSourceUrl("");
      setDescription("");
      setIsService(false);
      setCategoryId("sheets");
      setSubcategory(taxonomy[0]?.subcategories[0] || "");
      setCustomSubcategory("");
    }
  }, [editingItem, suppliers, taxonomy, isOpen]);

  const handleSupplierSelect = (supId: string) => {
    setSupplierId(supId);
    const found = suppliers.find((s) => s.id === supId);
    if (found) {
      setSupplier(found.name);
    }
  };

  const handleCategoryChange = (newCatId: string) => {
    setCategoryId(newCatId);
    const def = taxonomy.find((c) => c.id === newCatId);
    if (def && def.subcategories.length > 0) {
      setSubcategory(def.subcategories[0]);
    }
    if (newCatId === "services") {
      setIsService(true);
      if (unit === "SQUARE_METER") setUnit(InventoryUnit.RUNNING_METER);
    } else {
      setIsService(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !supplier.trim()) return;

    setIsSubmitting(true);
    triggerHaptic("medium");

    const categoryLabel = currentCategoryDef?.label || "Листовые материалы";
    const finalSubcategory = subcategory === "custom" ? customSubcategory.trim() : subcategory;

    try {
      await onSave({
        id: editingItem?.id,
        name: name.trim(),
        supplier: supplier.trim(),
        supplierId: supplierId || null,
        price: Number(price) || 0,
        unit,
        category: categoryLabel,
        subcategory: finalSubcategory || null,
        imageUrl: imageUrl.trim() || null,
        description: description.trim() || null,
        sourceUrl: sourceUrl.trim() || null,
        isService,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestedChips = SUGGESTED_SPECS_BY_CATEGORY[categoryId] || [];
  const m = pricingDict.modals.material;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      desktopVariant="modal"
      desktopWidth="sm:max-w-2xl lg:max-w-3xl"
      maxHeight="max-h-[94dvh] sm:max-h-[88vh]"
      className="bg-white"
    >
      <div className="flex flex-col h-full w-full max-w-full overflow-hidden">
        {/* Шапка */}
        <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20 shrink-0 w-full">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                isService ? "bg-purple-100 text-purple-600" : "bg-orange-100 text-orange-600"
              }`}
            >
              {isService ? <Handshake className="w-4 h-4" /> : <Package className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight truncate">
                {editingItem
                  ? isService
                    ? m.titleServiceEdit
                    : m.titleEdit
                  : isService
                  ? m.titleServiceNew
                  : m.titleNew}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold truncate">
                {isService
                  ? m.subtitleService
                  : m.subtitleMaterial}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-slate-100 rounded border border-slate-200">
              Esc
            </kbd>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
              title="Закрыть (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Форма */}
        <form
          ref={formRef}
          id="material-modal-form"
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 overflow-y-auto overflow-x-hidden w-full max-w-full touch-pan-y [touch-action:pan-y] overscroll-contain flex-1"
        >
          {/* Переключатель: Материал или Перезаказ услуги */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isService ? "bg-purple-600 text-white" : "bg-slate-200 text-slate-600"
                }`}
              >
                <Handshake className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900 leading-tight">
                  {m.serviceSwitch.title}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {m.serviceSwitch.subtitle}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isService}
                onChange={(e) => {
                  const val = e.target.checked;
                  setIsService(val);
                  if (val) {
                    setCategoryId("services");
                    setSubcategory(taxonomy.find((c) => c.id === "services")?.subcategories[0] || "");
                  } else {
                    setCategoryId("sheets");
                    setSubcategory(taxonomy[0]?.subcategories[0] || "");
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Название */}
          <div>
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
              {isService ? m.fields.nameService : m.fields.name}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                isService
                  ? m.fields.nameServicePlaceholder
                  : m.fields.namePlaceholder
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition box-border"
            />
          </div>

          {/* Двухуровневый выбор категории и подкатегории */}
          <MaterialCategorySelects
            taxonomy={taxonomy}
            categoryId={categoryId}
            onCategoryChange={handleCategoryChange}
            subcategory={subcategory}
            onSubcategoryChange={setSubcategory}
            customSubcategory={customSubcategory}
            onCustomSubcategoryChange={setCustomSubcategory}
            currentCategoryDef={currentCategoryDef}
          />

          {/* Единица измерения и Цена */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <div className="min-w-0 w-full">
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                {m.fields.unit}
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as InventoryUnit)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none cursor-pointer box-border"
              >
                {Object.entries(INVENTORY_UNITS).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label} ({val.short})
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-0 w-full">
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                {m.fields.price}
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="0"
                  step="any"
                  value={price}
                  onChange={(e) => setPrice(e.target.value ? parseFloat(e.target.value) : "")}
                  placeholder={m.fields.pricePlaceholder}
                  className="w-full pl-3.5 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-black text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition box-border"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">
                  ₸
                </span>
              </div>
            </div>
          </div>

          {/* Поставщик и Ссылка */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                {isService ? m.fields.supplierService : m.fields.supplier}
              </label>
              <div className="space-y-2">
                {suppliers.length > 0 && (
                  <select
                    value={supplierId}
                    onChange={(e) => handleSupplierSelect(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none cursor-pointer box-border"
                  >
                    <option value="">{m.fields.supplierManualOption}</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                )}
                {(!supplierId || suppliers.length === 0) && (
                  <input
                    type="text"
                    required
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    placeholder={isService ? "Имя подрядчика" : "Имя поставщика (SignTech)"}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none box-border"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                {m.fields.sourceUrl}
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder={m.fields.sourceUrlPlaceholder}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:border-orange-500 outline-none box-border"
                />
                <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Фотография материала (Cloudflare R2 Uploader) */}
          <MaterialImageUploader
            imageUrl={imageUrl}
            onImageUrlChange={setImageUrl}
          />

          {/* Характеристики с умными быстрыми чипами */}
          <MaterialSpecChips
            description={description}
            onDescriptionChange={setDescription}
            suggestedChips={suggestedChips}
          />
        </form>

        {/* Фиксированный подвал действий */}
        <div className="p-3.5 sm:px-6 sm:py-4 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono font-bold text-slate-500">
              ⌘ Enter
            </kbd>
            <span>{m.footer.hotkeyHint}</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {m.footer.cancel}
            </button>

            <button
              type="submit"
              form="material-modal-form"
              disabled={isSubmitting || !name.trim() || !supplier.trim()}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-extrabold text-xs transition flex items-center gap-2 cursor-pointer shadow-md shadow-orange-600/20 active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{m.footer.saving}</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingItem ? m.footer.save : m.footer.create}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
