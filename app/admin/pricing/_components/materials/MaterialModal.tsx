"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X, Save, Package, Image as ImageIcon, Link as LinkIcon, Handshake, Check } from "lucide-react";
import { InventoryUnit } from "@prisma/client";
import { SupplierData, SupplierPriceItem } from "../../_types/pricingTypes";
import { INVENTORY_UNITS, MATERIAL_TAXONOMY } from "../../_data/pricingDictionary";
import { triggerHaptic } from "@/lib/haptics";
import BottomSheet from "@/components/ui/BottomSheet";

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
}

export default function MaterialModal({
  isOpen,
  onClose,
  onSave,
  editingItem,
  suppliers,
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

  // Доступные подкатегории для выбранной категории
  const currentCategoryDef = useMemo(() => {
    return MATERIAL_TAXONOMY.find((c) => c.id === categoryId) || MATERIAL_TAXONOMY[0];
  }, [categoryId]);

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

      // Находим подходящую категорию
      const matchedCat = MATERIAL_TAXONOMY.find(
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

      // Подкатегория
      const existingSub = editingItem.subcategory || "";
      if (existingSub) {
        setSubcategory(existingSub);
        setCustomSubcategory("");
      } else {
        setSubcategory(matchedCat?.subcategories[0] || "");
        setCustomSubcategory("");
      }
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
      setSubcategory(MATERIAL_TAXONOMY[0].subcategories[0]);
      setCustomSubcategory("");
    }
  }, [editingItem, suppliers, isOpen]);

  const handleSupplierSelect = (supId: string) => {
    setSupplierId(supId);
    const found = suppliers.find((s) => s.id === supId);
    if (found) {
      setSupplier(found.name);
    }
  };

  const handleCategoryChange = (newCatId: string) => {
    setCategoryId(newCatId);
    const def = MATERIAL_TAXONOMY.find((c) => c.id === newCatId);
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

    const categoryLabel = currentCategoryDef.label;
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

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-lg"
      maxHeight="max-h-[94dvh]"
      className="bg-white"
    >
      <div className="flex flex-col h-full w-full max-w-full overflow-hidden">
        {/* Шапка */}
        <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-white/95 backdrop-blur-md sticky top-0 z-20 shrink-0 w-full">
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
                    ? "Редактировать услугу подрядчика"
                    : "Редактировать позицию"
                  : isService
                  ? "Новая услуга подрядчика (перезаказ)"
                  : "Новый материал / товар"}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold truncate">
                {isService
                  ? "Внешние подрядчики (фрезеровка, УФ-печать, гибка)"
                  : "Каталог себестоимости и закупа"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Форма */}
        <form
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
                  Перезаказ услуги у подрядчика
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  Фрезеровка, лазерная резка, УФ-печать, гибка
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
                    setSubcategory(MATERIAL_TAXONOMY.find((c) => c.id === "services")?.subcategories[0] || "");
                  } else {
                    setCategoryId("sheets");
                    setSubcategory(MATERIAL_TAXONOMY[0].subcategories[0]);
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
              {isService ? "Название услуги подрядчика *" : "Название материала / товара *"}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                isService
                  ? "Напр. Фрезерная резка АКП / акрила"
                  : "Напр. Акрил 3мм молочный Plexiglas (2.05x3.05м)"
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition box-border"
            />
          </div>

          {/* Двухуровневый выбор: Категория и Подкатегория */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {/* Категория 1-го уровня */}
            <div className="min-w-0 w-full">
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                Категория (1-й уровень)
              </label>
              <select
                value={categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none cursor-pointer box-border"
              >
                {MATERIAL_TAXONOMY.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Подкатегория 2-го уровня */}
            <div className="min-w-0 w-full">
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                Подкатегория (2-й уровень)
              </label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none cursor-pointer box-border"
              >
                {currentCategoryDef.subcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
                <option value="custom">+ Своя подкатегория...</option>
              </select>
            </div>
          </div>

          {subcategory === "custom" && (
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1">
                Название своей подкатегории
              </label>
              <input
                type="text"
                required
                value={customSubcategory}
                onChange={(e) => setCustomSubcategory(e.target.value)}
                placeholder="Напр. Листовой вспененный ПВХ 5мм"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none box-border"
              />
            </div>
          )}

          {/* Единица измерения и Цена */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <div className="min-w-0 w-full">
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                Единица измерения
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
                Себестоимость (₸) *
              </label>
              <div className="relative w-full">
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
                  placeholder="0"
                  className="w-full pl-3.5 pr-12 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-black text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition box-border"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 pointer-events-none">
                  ₸ / {INVENTORY_UNITS[unit]?.short || "ед."}
                </span>
              </div>
            </div>
          </div>

          {/* Поставщик */}
          <div>
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
              {isService ? "Подрядчик / Исполнитель *" : "Поставщик *"}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suppliers.length > 0 && (
                <select
                  value={supplierId}
                  onChange={(e) => handleSupplierSelect(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none cursor-pointer box-border"
                >
                  <option value="">Другой / Вручную</option>
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

          {/* Фотография материала (URL и превью) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-black text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-orange-500" />
                <span>Фотография позиции (в R2 или ссылка)</span>
              </label>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="text-[10px] text-red-500 font-bold hover:underline cursor-pointer"
                >
                  Очистить
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center relative shadow-xs">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Предпросмотр"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://media.adlight.kz/materials/... или ссылка на фото"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:border-orange-500 outline-none transition box-border"
                />
                <p className="text-[10px] text-slate-400 mt-1 font-medium">
                  Хранится в Cloudflare R2 или ссылка из каталога
                </p>
              </div>
            </div>
          </div>

          {/* Ссылка на сайт и Описание */}
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1">
                Ссылка на товар на сайте поставщика
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://signtech.kz/catalog/..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:border-orange-500 outline-none box-border"
                />
                <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1">
                Характеристики / Размеры / Заметки
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Размер листа 2.05х3.05м, толщина 3мм, плотность 0.60, цвет белый..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:border-orange-500 outline-none resize-none box-border"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs transition cursor-pointer active:scale-95"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-md shadow-orange-600/20 transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? "Сохранение..." : editingItem ? "Обновить" : "Добавить в базу"}</span>
            </button>
          </div>
        </form>
      </div>
    </BottomSheet>
  );
}
