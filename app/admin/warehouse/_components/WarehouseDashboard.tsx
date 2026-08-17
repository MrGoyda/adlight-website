"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { 
  Package, 
  Layers, 
  History, 
  TrendingUp, 
  Plus, 
  Search, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  Check, 
  ArrowUpRight, 
  ArrowDownLeft,
  X,
  FileText,
  Phone,
  MapPin,
  MessageSquare,
  Building2
} from "lucide-react";
import Button from "@/components/ui/Button";
import { crmDict } from "@/dictionaries/crm";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { InventoryUnit } from "@prisma/client";
import { 
  createWarehouseItem, 
  updateWarehouseItem, 
  adjustWarehouseStock, 
  deleteWarehouseItem,
  createSupplierPrice,
  updateSupplierPrice,
  deleteSupplierPrice,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from "../actions";
import { WAREHOUSE_CATEGORIES, STOCK_LOCATIONS, UNIT_LABELS } from "../constants";

interface WarehouseItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: InventoryUnit;
  price: number;
  location: string | null;
  minStock: number;
  updatedAt: string;
}

interface Supplier {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  whatsapp: string | null;
  notes: string | null;
}

interface SupplierPrice {
  id: string;
  name: string;
  supplier: string;
  supplierId: string | null;
  price: number;
  unit: InventoryUnit;
  supplierObj?: Supplier | null;
}

interface WarehouseTransaction {
  id: string;
  createdAt: string;
  quantityChanged: number;
  description: string | null;
  item: {
    name: string;
    unit: InventoryUnit;
  };
}

interface WarehouseDashboardProps {
  initialItems: WarehouseItem[];
  initialSupplierPrices: SupplierPrice[];
  initialSuppliers: Supplier[];
  initialTransactions: WarehouseTransaction[];
}

export default function WarehouseDashboard({
  initialItems,
  initialSupplierPrices,
  initialSuppliers,
  initialTransactions,
}: WarehouseDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"stock" | "suppliers" | "contacts" | "history">("stock");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isPending, startTransition] = useTransition();

  // Модальные окна
  const [itemModal, setItemModal] = useState<{
    isOpen: boolean;
    mode: "create" | "edit" | "adjust";
    item?: WarehouseItem;
  }>({ isOpen: false, mode: "create" });

  const [supplierModal, setSupplierModal] = useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    price?: SupplierPrice;
  }>({ isOpen: false, mode: "create" });

  const [supplierContactModal, setSupplierContactModal] = useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    supplier?: Supplier;
  }>({ isOpen: false, mode: "create" });

  // Состояние форм
  const [itemForm, setItemForm] = useState({
    name: "",
    category: WAREHOUSE_CATEGORIES[0],
    quantity: 0,
    unit: "PIECE" as InventoryUnit,
    price: 0,
    location: "",
    minStock: 0,
  });

  const [adjustForm, setAdjustForm] = useState({
    change: 0,
    description: "",
  });

  const [supplierForm, setSupplierForm] = useState({
    name: "",
    supplier: "",
    supplierId: "",
    price: 0,
    unit: "PIECE" as InventoryUnit,
  });

  const [supplierContactForm, setSupplierContactForm] = useState({
    name: "",
    address: "",
    phone: "",
    whatsapp: "",
    notes: "",
  });

  const [formError, setFormError] = useState<string | null>(null);

  // Фильтрация материалов на складе
  const filteredItems = initialItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Фильтрация цен поставщиков
  const filteredSuppliers = initialSupplierPrices.filter((price) => {
    return price.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      price.supplier.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Фильтрация поставщиков (контакты)
  const filteredSuppliersContacts = initialSuppliers.filter((s) => {
    return s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (s.address && s.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.phone && s.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.notes && s.notes.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  // Открытие модального окна добавления/редактирования
  const handleOpenItemModal = (mode: "create" | "edit" | "adjust", item?: WarehouseItem) => {
    triggerHaptic("light");
    setFormError(null);
    if (mode === "create") {
      setItemForm({
        name: "",
        category: WAREHOUSE_CATEGORIES[0],
        quantity: 0,
        unit: "PIECE",
        price: 0,
        location: "",
        minStock: 0,
      });
    } else if (mode === "edit" && item) {
      setItemForm({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
        location: item.location || "",
        minStock: item.minStock,
      });
    } else if (mode === "adjust" && item) {
      setAdjustForm({
        change: 0,
        description: "",
      });
    }
    setItemModal({ isOpen: true, mode, item });
  };

  const handleOpenSupplierModal = (mode: "create" | "edit", price?: SupplierPrice) => {
    triggerHaptic("light");
    setFormError(null);
    if (mode === "create") {
      setSupplierForm({
        name: "",
        supplier: initialSuppliers[0]?.name || "",
        supplierId: initialSuppliers[0]?.id || "",
        price: 0,
        unit: "PIECE",
      });
    } else if (mode === "edit" && price) {
      setSupplierForm({
        name: price.name,
        supplier: price.supplier,
        supplierId: price.supplierId || "",
        price: price.price,
        unit: price.unit,
      });
    }
    setSupplierModal({ isOpen: true, mode, price });
  };

  // Сохранение материала на складе
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    startTransition(async () => {
      let res;
      if (itemModal.mode === "create") {
        res = await createWarehouseItem(itemForm);
      } else {
        res = await updateWarehouseItem(itemModal.item!.id, itemForm);
      }

      if (res.error) {
        setFormError(res.error);
      } else {
        triggerHaptic("success");
        setItemModal({ isOpen: false, mode: "create" });
        router.refresh();
      }
    });
  };

  // Изменение количества на складе
  const handleAdjustItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (adjustForm.change === 0) {
      setFormError("Изменение не может быть нулевым");
      return;
    }

    startTransition(async () => {
      const res = await adjustWarehouseStock(
        itemModal.item!.id,
        adjustForm.change,
        adjustForm.description || (adjustForm.change > 0 ? "Ручная корректировка остатка (+)" : "Ручное списание (-)")
      );

      if (res.error) {
        setFormError(res.error);
        toast.error(res.error || "Ошибка при корректировке остатка");
      } else {
        toast.success("Остаток на складе обновлен!");
        setItemModal({ isOpen: false, mode: "create" });
        router.refresh();
      }
    });
  };

  // Удаление со склада
  const handleDeleteItem = (id: string) => {
    toast.confirm({
      title: "Удалить материал со склада?",
      message: "Позиция и история движения этого материала будут удалены.",
      confirmText: "Да, удалить",
      cancelText: "Отмена",
      isDestructive: true,
      onConfirm: async () => {
        const res = await deleteWarehouseItem(id);
        if (res.error) {
          toast.error(res.error || "Не удалось удалить материал");
        } else {
          toast.success("Материал удален со склада");
          router.refresh();
        }
      },
    });
  };

  // Сохранение цены поставщика
  const handleSaveSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    startTransition(async () => {
      let res;
      if (supplierModal.mode === "create") {
        res = await createSupplierPrice(supplierForm);
      } else {
        res = await updateSupplierPrice(supplierModal.price!.id, supplierForm);
      }

      if (res.error) {
        setFormError(res.error);
        toast.error(res.error || "Ошибка сохранения прайса");
      } else {
        toast.success("Прайс поставщика сохранен!");
        setSupplierModal({ isOpen: false, mode: "create" });
        router.refresh();
      }
    });
  };

  // Удаление цены поставщика
  const handleDeleteSupplier = (id: string) => {
    toast.confirm({
      title: "Удалить позицию из прайса поставщика?",
      confirmText: "Да, удалить",
      cancelText: "Отмена",
      isDestructive: true,
      onConfirm: async () => {
        const res = await deleteSupplierPrice(id);
        if (res.error) {
          toast.error(res.error || "Не удалось удалить прайс");
        } else {
          toast.success("Позиция удалена из прайса");
          router.refresh();
        }
      },
    });
  };

  // Открытие модального окна контактов поставщика
  const handleOpenSupplierContactModal = (mode: "create" | "edit", supplier?: Supplier) => {
    triggerHaptic("light");
    setFormError(null);
    if (mode === "create") {
      setSupplierContactForm({
        name: "",
        address: "",
        phone: "",
        whatsapp: "",
        notes: "",
      });
    } else if (mode === "edit" && supplier) {
      setSupplierContactForm({
        name: supplier.name,
        address: supplier.address || "",
        phone: supplier.phone || "",
        whatsapp: supplier.whatsapp || "",
        notes: supplier.notes || "",
      });
    }
    setSupplierContactModal({ isOpen: true, mode, supplier });
  };

  // Сохранение контакта поставщика
  const handleSaveSupplierContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    startTransition(async () => {
      let res;
      if (supplierContactModal.mode === "create") {
        res = await createSupplier(supplierContactForm);
      } else {
        res = await updateSupplier(supplierContactModal.supplier!.id, supplierContactForm);
      }

      if (res.error) {
        setFormError(res.error);
        toast.error(res.error || "Ошибка сохранения поставщика");
      } else {
        toast.success("Данные поставщика сохранены!");
        setSupplierContactModal({ isOpen: false, mode: "create" });
        router.refresh();
      }
    });
  };

  // Удаление контакта поставщика
  const handleDeleteSupplierContact = (id: string) => {
    toast.confirm({
      title: "Удалить поставщика?",
      message: "Связанные цены останутся в справочнике, но потеряют прямую привязку.",
      confirmText: "Да, удалить",
      cancelText: "Отмена",
      isDestructive: true,
      onConfirm: async () => {
        const res = await deleteSupplier(id);
        if (res.error) {
          toast.error(res.error || "Не удалось удалить поставщика");
        } else {
          toast.success("Поставщик удален");
          router.refresh();
        }
      },
    });
  };

  // Подсчет критически низких остатков
  const lowStockCount = initialItems.filter((i) => i.quantity <= i.minStock).length;

  return (
    <div className="space-y-6">

      {/* Информационные плашки */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Всего позиций</span>
            <span className="text-2xl font-black text-slate-800">{initialItems.length}</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Критический остаток</span>
            <span className={`text-2xl font-black ${lowStockCount > 0 ? "text-amber-600 animate-pulse" : "text-slate-800"}`}>
              {lowStockCount}
            </span>
          </div>
          <div className={`p-3 rounded-xl border ${lowStockCount > 0 ? "bg-amber-50 border-amber-200 text-amber-500" : "bg-slate-50 border-slate-200 text-slate-500"}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Цен поставщиков</span>
            <span className="text-2xl font-black text-slate-800">{initialSupplierPrices.length}</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Панель табов и поиска */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.015)] overflow-hidden">
        <div className="border-b border-slate-100 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex border border-slate-200 p-1 bg-slate-50 rounded-2xl w-fit flex-wrap gap-1">
            <button
              onClick={() => { triggerHaptic("light"); setActiveTab("stock"); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "stock"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {crmDict.warehouse.tabStock}
            </button>
            <button
              onClick={() => { triggerHaptic("light"); setActiveTab("suppliers"); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "suppliers"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {crmDict.warehouse.tabSuppliers}
            </button>
            <button
              onClick={() => { triggerHaptic("light"); setActiveTab("contacts"); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "contacts"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Поставщики (контакты)
            </button>
            <button
              onClick={() => { triggerHaptic("light"); setActiveTab("history"); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "history"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {crmDict.warehouse.tabHistory}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {activeTab === "stock" && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3.5 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                <option value="all">Все категории</option>
                {WAREHOUSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            )}

            {activeTab !== "history" && (
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={activeTab === "contacts" ? "Поиск поставщика..." : "Поиск по названию..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl w-48 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            )}

            {activeTab === "stock" && (
              <Button
                onClick={() => handleOpenItemModal("create")}
                variant="solid"
                className="py-2.5 px-4 text-xs font-extrabold flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" /> Добавить на склад
              </Button>
            )}

            {activeTab === "suppliers" && (
              <Button
                onClick={() => handleOpenSupplierModal("create")}
                variant="solid"
                className="py-2.5 px-4 text-xs font-extrabold flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" /> Добавить цену
              </Button>
            )}

            {activeTab === "contacts" && (
              <Button
                onClick={() => handleOpenSupplierContactModal("create")}
                variant="solid"
                className="py-2.5 px-4 text-xs font-extrabold flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" /> Добавить поставщика
              </Button>
            )}
          </div>
        </div>

        {/* Таблица остатков склада */}
        {activeTab === "stock" && (
          <div className="overflow-x-auto">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Package className="w-12 h-12 mx-auto mb-2 text-slate-200" />
                Нет данных для отображения
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="p-4">Название</th>
                    <th className="p-4">Категория</th>
                    <th className="p-4 text-right">Количество</th>
                    <th className="p-4 text-right">Себестоимость</th>
                    <th className="p-4">Место хранения</th>
                    <th className="p-4 text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredItems.map((item) => {
                    const isLow = item.quantity <= item.minStock;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-bold text-slate-800">
                          {item.name}
                          {isLow && (
                            <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-100">
                              Мало
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-slate-500 text-xs">{item.category}</td>
                        <td className="p-4 text-right font-extrabold">
                          <span className={isLow ? "text-amber-600 font-black" : "text-slate-800"}>
                            {item.quantity} {UNIT_LABELS[item.unit]}
                          </span>
                        </td>
                        <td className="p-4 text-right font-semibold text-slate-700">
                          {item.price.toLocaleString()} ₸
                        </td>
                        <td className="p-4 text-slate-500 text-xs font-medium">
                          {item.location || <span className="text-slate-300">—</span>}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenItemModal("adjust", item)}
                              title="Приход / Расход"
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                            >
                              <TrendingUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenItemModal("edit", item)}
                              title="Редактировать карточку"
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              title="Удалить"
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-rose-500 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Таблица цен поставщиков */}
        {activeTab === "suppliers" && (
          <div className="overflow-x-auto">
            {filteredSuppliers.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Layers className="w-12 h-12 mx-auto mb-2 text-slate-200" />
                Нет данных для отображения
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="p-4">Название материала / услуги</th>
                    <th className="p-4">Поставщик</th>
                    <th className="p-4 text-right">Цена</th>
                    <th className="p-4">Единица измерения</th>
                    <th className="p-4 text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredSuppliers.map((price) => (
                    <tr key={price.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-bold text-slate-800">{price.name}</td>
                      <td className="p-4 text-slate-500 font-medium text-xs">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700">{price.supplier}</span>
                          {price.supplierObj && (
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                              {price.supplierObj.phone && <span className="flex items-center gap-0.5"><Phone className="w-2.5 h-2.5" /> {price.supplierObj.phone}</span>}
                              {price.supplierObj.whatsapp && (
                                <a 
                                  href={price.supplierObj.whatsapp} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 font-bold"
                                  onClick={(e) => { e.stopPropagation(); triggerHaptic("light"); }}
                                >
                                  <MessageSquare className="w-2.5 h-2.5" /> WhatsApp
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right font-extrabold text-slate-800">
                        {price.price.toLocaleString()} ₸
                      </td>
                      <td className="p-4 text-slate-500 text-xs">{UNIT_LABELS[price.unit]}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenSupplierModal("edit", price)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSupplier(price.id)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-rose-500 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Справочник поставщиков (Контакты) */}
        {activeTab === "contacts" && (
          <div className="overflow-x-auto">
            {filteredSuppliersContacts.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Building2 className="w-12 h-12 mx-auto mb-2 text-slate-200" />
                Нет данных для отображения
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="p-4">Название компании</th>
                    <th className="p-4">Телефон</th>
                    <th className="p-4">Адрес</th>
                    <th className="p-4">WhatsApp</th>
                    <th className="p-4">Заметки / Примечания</th>
                    <th className="p-4 text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredSuppliersContacts.map((supplier) => (
                    <tr key={supplier.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-bold text-slate-800 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        {supplier.name}
                      </td>
                      <td className="p-4 text-slate-600 text-xs font-semibold">
                        {supplier.phone || <span className="text-slate-300">—</span>}
                      </td>
                      <td className="p-4 text-slate-500 text-xs">
                        {supplier.address || <span className="text-slate-300">—</span>}
                      </td>
                      <td className="p-4 text-xs font-bold">
                        {supplier.whatsapp ? (
                          <a
                            href={supplier.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 transition"
                            onClick={() => triggerHaptic("light")}
                          >
                            <MessageSquare className="w-3 h-3" />
                            Написать
                          </a>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="p-4 text-slate-500 text-xs max-w-xs truncate" title={supplier.notes || ""}>
                        {supplier.notes || <span className="text-slate-300">—</span>}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenSupplierContactModal("edit", supplier)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSupplierContact(supplier.id)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-rose-500 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Журнал операций */}
        {activeTab === "history" && (
          <div className="overflow-x-auto">
            {initialTransactions.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <History className="w-12 h-12 mx-auto mb-2 text-slate-200" />
                Нет операций в логе
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="p-4">Дата</th>
                    <th className="p-4">Материал</th>
                    <th className="p-4">Тип</th>
                    <th className="p-4 text-right">Количество</th>
                    <th className="p-4">Описание</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {initialTransactions.map((tx) => {
                    const isIncome = tx.quantityChanged > 0;
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 text-slate-400 text-xs" suppressHydrationWarning>
                          {new Date(tx.createdAt).toLocaleString("ru-RU")}
                        </td>
                        <td className="p-4 font-bold text-slate-800">{tx.item.name}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                            isIncome 
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                              : "bg-rose-50 text-rose-600 border border-rose-100"
                          }`}>
                            {isIncome ? (
                              <><ArrowUpRight className="w-3 h-3" /> Приход</>
                            ) : (
                              <><ArrowDownLeft className="w-3 h-3" /> Списание</>
                            )}
                          </span>
                        </td>
                        <td className="p-4 text-right font-extrabold text-slate-800">
                          {isIncome ? "+" : ""}{tx.quantityChanged} {UNIT_LABELS[tx.item.unit]}
                        </td>
                        <td className="p-4 text-slate-500 text-xs font-medium">{tx.description}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* ================= МОДАЛКА СКЛАДА ================= */}
      {itemModal.isOpen && typeof window !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setItemModal({ isOpen: false, mode: "create" })}
          />

          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="w-full max-w-lg bg-white/90 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-apple-modal overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200/50 bg-white/50">
              <h3 className="font-black text-slate-800 tracking-tight flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-500" />
                {itemModal.mode === "create" && "Добавление материала"}
                {itemModal.mode === "edit" && "Редактирование материала"}
                {itemModal.mode === "adjust" && "Корректировка остатков"}
              </h3>
              <button
                onClick={() => setItemModal({ isOpen: false, mode: "create" })}
                className="p-2 text-slate-450 hover:text-slate-700 hover:bg-slate-100/85 rounded-full transition cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="mx-6 mt-4 p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}

            {itemModal.mode === "adjust" ? (
              <form onSubmit={handleAdjustItem} className="p-6 space-y-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Материал
                  </label>
                  <div className="text-sm font-bold text-slate-800 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    {itemModal.item?.name} ({itemModal.item?.quantity} {UNIT_LABELS[itemModal.item!.unit]})
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                      Изменение (+/-)
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      placeholder="Например, -5 или 10"
                      value={adjustForm.change === 0 ? "" : adjustForm.change}
                      onChange={(e) => setAdjustForm({ ...adjustForm, change: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                      Ед. изм.
                    </label>
                    <div className="text-sm font-bold text-slate-500 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                      {UNIT_LABELS[itemModal.item!.unit]}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Описание операции (Почему?)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Например: 'Брак при резке', 'Поступление от Lantana'"
                    value={adjustForm.description}
                    onChange={(e) => setAdjustForm({ ...adjustForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="lightOutline"
                    onClick={() => setItemModal({ isOpen: false, mode: "create" })}
                    className="text-slate-600 text-xs font-bold py-2.5 px-4"
                  >
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                    variant="solid"
                    disabled={isPending}
                    className="text-xs font-extrabold py-2.5 px-5"
                  >
                    {isPending ? "Сохранение..." : "Подтвердить"}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSaveItem} className="p-6 space-y-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Название материала
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Например: Акрил 3мм молочный Plexiglas"
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                      Категория
                    </label>
                    <select
                      value={itemForm.category}
                      onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm font-semibold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    >
                      {WAREHOUSE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                      Единица измерения
                    </label>
                    <select
                      value={itemForm.unit}
                      onChange={(e) => setItemForm({ ...itemForm, unit: e.target.value as InventoryUnit })}
                      className="w-full px-3.5 py-2.5 text-sm font-semibold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    >
                      {Object.entries(UNIT_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                      Количество
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      disabled={itemModal.mode === "edit"}
                      placeholder="0"
                      value={itemForm.quantity === 0 ? "" : itemForm.quantity}
                      onChange={(e) => setItemForm({ ...itemForm, quantity: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                      Себестоимость
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="0"
                      value={itemForm.price === 0 ? "" : itemForm.price}
                      onChange={(e) => setItemForm({ ...itemForm, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                      Критич. порог
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      placeholder="0"
                      value={itemForm.minStock === 0 ? "" : itemForm.minStock}
                      onChange={(e) => setItemForm({ ...itemForm, minStock: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Место хранения (Стеллаж / Полка)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Выберите быстро или напишите"
                      value={itemForm.location}
                      onChange={(e) => setItemForm({ ...itemForm, location: e.target.value })}
                      className="flex-1 px-3.5 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          setItemForm({ ...itemForm, location: e.target.value });
                        }
                      }}
                      value=""
                      className="px-2.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-500 focus:outline-none"
                    >
                      <option value="">Быстрый выбор...</option>
                      {STOCK_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="lightOutline"
                    onClick={() => setItemModal({ isOpen: false, mode: "create" })}
                    className="text-slate-600 text-xs font-bold py-2.5 px-4"
                  >
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                    variant="solid"
                    disabled={isPending}
                    className="text-xs font-extrabold py-2.5 px-5"
                  >
                    {isPending ? "Сохранение..." : "Сохранить"}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>,
        document.body
      )}

      {/* ================= МОДАЛКА ЦЕН ПОСТАВЩИКОВ ================= */}
      {supplierModal.isOpen && typeof window !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setSupplierModal({ isOpen: false, mode: "create" })}
          />

          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white/90 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-apple-modal overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200/50 bg-white/50">
              <h3 className="font-black text-slate-800 tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-orange-500" />
                {supplierModal.mode === "create" ? "Добавление цены поставщика" : "Редактирование цены"}
              </h3>
              <button
                onClick={() => setSupplierModal({ isOpen: false, mode: "create" })}
                className="p-2 text-slate-450 hover:text-slate-700 hover:bg-slate-100/85 rounded-full transition cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="mx-6 mt-4 p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveSupplier} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Название материала / услуги
                </label>
                <input
                  type="text"
                  required
                  placeholder="Например: Пленка Oracal 641 глянцевая черная"
                  value={supplierForm.name}
                  onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Поставщик
                </label>
                <select
                  required
                  value={supplierForm.supplierId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedSupplier = initialSuppliers.find(s => s.id === selectedId);
                    setSupplierForm({
                      ...supplierForm,
                      supplierId: selectedId,
                      supplier: selectedSupplier ? selectedSupplier.name : ""
                    });
                  }}
                  className="w-full px-3.5 py-2.5 text-sm font-semibold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="" disabled>Выберите поставщика...</option>
                  {initialSuppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Цена за ед.
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    value={supplierForm.price === 0 ? "" : supplierForm.price}
                    onChange={(e) => setSupplierForm({ ...supplierForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Единица измерения
                  </label>
                  <select
                    value={supplierForm.unit}
                    onChange={(e) => setSupplierForm({ ...supplierForm, unit: e.target.value as InventoryUnit })}
                    className="w-full px-3.5 py-2.5 text-sm font-semibold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  >
                    {Object.entries(UNIT_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="lightOutline"
                  onClick={() => setSupplierModal({ isOpen: false, mode: "create" })}
                  className="text-slate-600 text-xs font-bold py-2.5 px-4"
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  variant="solid"
                  disabled={isPending}
                  className="text-xs font-extrabold py-2.5 px-5"
                >
                  {isPending ? "Сохранение..." : "Сохранить"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>,
        document.body
      )}

      {/* ================= МОДАЛКА КОНТАКТОВ ПОСТАВЩИКА ================= */}
      {supplierContactModal.isOpen && typeof window !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setSupplierContactModal({ isOpen: false, mode: "create" })}
          />

          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white/90 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-apple-modal overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200/50 bg-white/50">
              <h3 className="font-black text-slate-800 tracking-tight flex items-center gap-2">
                <Building2 className="w-5 h-5 text-orange-500" />
                {supplierContactModal.mode === "create" ? "Добавление поставщика" : "Редактирование поставщика"}
              </h3>
              <button
                onClick={() => setSupplierContactModal({ isOpen: false, mode: "create" })}
                className="p-2 text-slate-450 hover:text-slate-700 hover:bg-slate-100/85 rounded-full transition cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="mx-6 mt-4 p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveSupplierContact} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Название компании
                </label>
                <input
                  type="text"
                  required
                  placeholder="Например: Демер, Lantana"
                  value={supplierContactForm.name}
                  onChange={(e) => setSupplierContactForm({ ...supplierContactForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Номер телефона
                </label>
                <input
                  type="text"
                  placeholder="Например: +7 707 123 4567"
                  value={supplierContactForm.phone}
                  onChange={(e) => setSupplierContactForm({ ...supplierContactForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Ссылка на WhatsApp
                </label>
                <input
                  type="text"
                  placeholder="Например: https://wa.me/77071234567"
                  value={supplierContactForm.whatsapp}
                  onChange={(e) => setSupplierContactForm({ ...supplierContactForm, whatsapp: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Адрес офиса / склада
                </label>
                <input
                  type="text"
                  placeholder="Например: ул. Радостовца 152"
                  value={supplierContactForm.address}
                  onChange={(e) => setSupplierContactForm({ ...supplierContactForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Заметки / Примечания
                </label>
                <textarea
                  placeholder="Менеджеры, условия доставки, скидки..."
                  value={supplierContactForm.notes}
                  onChange={(e) => setSupplierContactForm({ ...supplierContactForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 h-20 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="lightOutline"
                  onClick={() => setSupplierContactModal({ isOpen: false, mode: "create" })}
                  className="text-slate-600 text-xs font-bold py-2.5 px-4"
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  variant="solid"
                  disabled={isPending}
                  className="text-xs font-extrabold py-2.5 px-5"
                >
                  {isPending ? "Сохранение..." : "Сохранить"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>,
        document.body
      )}
    </div>
  );
}
