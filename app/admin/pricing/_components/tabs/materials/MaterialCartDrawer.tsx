"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MaterialCartItem } from "../../../_hooks/useMaterialCart";
import { SupplierData } from "../../../_types/pricingTypes";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Copy,
  Check,
  Building2,
  Package,
  Layers,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { getCleanPhone, getWhatsAppUrl } from "@/lib/phoneUtils";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";

interface MaterialCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: MaterialCartItem[];
  suppliers: SupplierData[];
  onUpdateQuantity: (priceItemId: string, newQty: number) => void;
  onRemoveItem: (priceItemId: string) => void;
  onClearSupplier: (supplierName: string) => void;
  onClearCart: () => void;
  groupedBySupplier: Array<{
    supplierName: string;
    items: MaterialCartItem[];
    subtotal: number;
    positionsCount: number;
  }>;
  totalSum: number;
  uniquePositionsCount: number;
  totalQuantity: number;
  onOpenSupplierInfo?: (supplierName: string) => void;
}

// Фоллбэк контакты поставщиков
const KNOWN_SUPPLIER_PHONES: Record<string, string> = {
  signtech: "+7 (771) 744-99-00",
  сайнтек: "+7 (771) 744-99-00",
};

export default function MaterialCartDrawer({
  isOpen,
  onClose,
  items,
  suppliers,
  onUpdateQuantity,
  onRemoveItem,
  onClearSupplier,
  onClearCart,
  groupedBySupplier,
  totalSum,
  uniquePositionsCount,
  totalQuantity,
  onOpenSupplierInfo,
}: MaterialCartDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [copiedSupplier, setCopiedSupplier] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Закрытие по клавише Esc
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  // Формирование текста заявки в WhatsApp для конкретного поставщика (без цен и сумм, только названия и количества)
  const generateSupplierOrderText = (supplierName: string, supplierItems: MaterialCartItem[]) => {
    const lines = [
      `Здравствуйте! Заявка на закупку от компании ADLight:`,
      ``,
      `Позиции:`,
    ];

    supplierItems.forEach((it, idx) => {
      lines.push(`${idx + 1}. ${it.name} — ${it.quantity} ${it.unitShort}`);
    });

    lines.push(``);
    lines.push(`Всего позиций: ${supplierItems.length}`);
    lines.push(``);
    lines.push(`Подскажите, пожалуйста, по наличию на складе и актуальной стоимости (выставите счет / реквизиты на оплату).`);

    return lines.join("\n");
  };

  // Копирование текста заявки для поставщика
  const handleCopySupplierOrder = (supplierName: string, supplierItems: MaterialCartItem[]) => {
    triggerHaptic("light");
    const text = generateSupplierOrderText(supplierName, supplierItems);
    navigator.clipboard.writeText(text);
    setCopiedSupplier(supplierName);
    toast.success(`Список товаров для «${supplierName}» скопирован`);
    setTimeout(() => {
      setCopiedSupplier((curr) => (curr === supplierName ? null : curr));
    }, 2000);
  };

  // Отправка заявки в WhatsApp
  const handleSendWhatsApp = (supplierName: string, supplierItems: MaterialCartItem[]) => {
    triggerHaptic("medium");
    const supObj = suppliers.find(
      (s) => s.name.trim().toLowerCase() === supplierName.trim().toLowerCase()
    );
    const rawPhone = supObj?.whatsapp || supObj?.phone || KNOWN_SUPPLIER_PHONES[supplierName.trim().toLowerCase()] || "";

    const text = generateSupplierOrderText(supplierName, supplierItems);

    if (!rawPhone) {
      // Если номер не найден в базе, копируем в буфер и предупреждаем
      navigator.clipboard.writeText(text);
      toast.info(`Номер WhatsApp поставщика ${supplierName} не указан. Список скопирован в буфер обмена!`);
      return;
    }

    const waUrl = getWhatsAppUrl(rawPhone, text);
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  // Копирование общего сводного отчета по всей закупке (список материалов по поставщикам)
  const handleCopyFullReport = () => {
    triggerHaptic("medium");
    const lines = [
      `СВОДНАЯ ВЕДОМОСТЬ ЗАКУПКИ МАТЕРИАЛОВ — ADLight`,
      `Дата: ${new Date().toLocaleDateString("ru-RU")}`,
      `Всего позиций: ${uniquePositionsCount} (${totalQuantity} ед.)`,
      `═════════════════════════════════════════════════`,
      ``,
    ];

    groupedBySupplier.forEach((group, gIdx) => {
      lines.push(`ПОСТАВЩИК ${gIdx + 1}: ${group.supplierName.toUpperCase()}`);
      lines.push(`-------------------------------------------------`);
      group.items.forEach((it, idx) => {
        lines.push(`  ${idx + 1}. ${it.name} — ${it.quantity} ${it.unitShort}`);
      });
      lines.push(``);
    });

    lines.push(`═════════════════════════════════════════════════`);
    lines.push(`Ожидаем подтверждения наличия и счетов на оплату.`);

    navigator.clipboard.writeText(lines.join("\n"));
    setCopiedAll(true);
    toast.success("Сводная ведомость закупки скопирована в буфер!");
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const drawerContent = (
    <div
      className="fixed inset-0 z-[9995] flex justify-end bg-black/45 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-slate-200 animate-in slide-in-from-right duration-250 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Шапка корзины закупа */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black shrink-0 shadow-md shadow-slate-900/10">
              <ShoppingBag className="w-5 h-5 text-orange-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 truncate">
                  Корзина закупки
                </h3>
                {uniquePositionsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-orange-800">
                    {uniquePositionsCount} поз.
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 font-bold block truncate">
                Сортировка по поставщикам и закупка в WhatsApp
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {uniquePositionsCount > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                title="Очистить всю корзину"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
              title="Закрыть (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Список материалов, сгруппированный по поставщику */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h4 className="text-base font-extrabold text-slate-800">
                  Корзина закупки пуста
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Добавляйте необходимые материалы из каталога кнопкой «В корзину», чтобы сразу сформировать заказ поставщикам.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black transition cursor-pointer shadow-sm"
              >
                Перейти в каталог материалов
              </button>
            </div>
          ) : (
            groupedBySupplier.map((group) => {
              const supObj = suppliers.find(
                (s) => s.name.trim().toLowerCase() === group.supplierName.trim().toLowerCase()
              );
              const isCopied = copiedSupplier === group.supplierName;

              return (
                <div
                  key={group.supplierName}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all hover:border-slate-300"
                >
                  {/* Заголовок группы поставщика */}
                  <div className="p-4 bg-slate-50/80 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-sm shrink-0">
                        {group.supplierName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => onOpenSupplierInfo?.(group.supplierName)}
                            className="text-sm font-black text-slate-900 hover:text-orange-600 transition truncate text-left cursor-pointer flex items-center gap-1"
                            title="Открыть контакты поставщика"
                          >
                            <span>{group.supplierName}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                          </button>
                          <span className="text-[10px] font-extrabold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200/70">
                            {group.positionsCount} поз.
                          </span>
                        </div>
                        {supObj?.address && (
                          <span className="text-[10px] text-slate-400 font-medium truncate block">
                            {supObj.address}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Быстрые действия по поставщику */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleCopySupplierOrder(group.supplierName, group.items)}
                        className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
                        title="Скопировать список материалов"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-black">Скопировано</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Текст</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSendWhatsApp(group.supplierName, group.items)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black transition cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95"
                        title="Отправить заявку со списком материалов в WhatsApp"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5" />
                        <span>Закупить в WhatsApp</span>
                      </button>
                    </div>
                  </div>

                  {/* Список товаров этой группы */}
                  <div className="divide-y divide-slate-100">
                    {group.items.map((it) => {
                      const lineSum = it.price * it.quantity;

                      return (
                        <div
                          key={it.priceItemId}
                          className="p-3.5 flex items-center gap-3 hover:bg-slate-50/60 transition-colors"
                        >
                          {/* Фото товара */}
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center">
                            {it.imageUrl ? (
                              <img
                                src={it.imageUrl}
                                alt={it.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <Package className="w-5 h-5 text-slate-400" />
                            )}
                          </div>

                          {/* Наименование и цена */}
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-black text-slate-900 leading-snug line-clamp-2">
                              {it.name}
                            </h5>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[11px] font-bold text-slate-500">
                                {Number(it.price).toLocaleString("ru-RU")} ₸ / {it.unitShort}
                              </span>
                              {it.subcategory && (
                                <span className="text-[9px] font-extrabold text-orange-600 bg-orange-50 px-1.5 py-0.2 rounded-md truncate max-w-[120px]">
                                  {it.subcategory}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Степпер количества */}
                          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 shrink-0">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(it.priceItemId, it.quantity - 1)}
                              className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer shadow-2xs"
                              title="Уменьшить"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={it.quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                if (!isNaN(val) && val > 0) {
                                  onUpdateQuantity(it.priceItemId, val);
                                }
                              }}
                              className="w-8 text-center bg-transparent text-xs font-black text-slate-900 outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(it.priceItemId, it.quantity + 1)}
                              className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer shadow-2xs"
                              title="Увеличить"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Сумма по строке */}
                          <div className="text-right shrink-0 min-w-[70px]">
                            <span className="text-xs font-black text-slate-900 block">
                              {Number(lineSum).toLocaleString("ru-RU")} ₸
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold block">
                              {it.quantity} {it.unitShort}
                            </span>
                          </div>

                          {/* Удалить позицию */}
                          <button
                            type="button"
                            onClick={() => onRemoveItem(it.priceItemId)}
                            className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer shrink-0"
                            title="Удалить из корзины"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Итог по поставщику */}
                  <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
                    <span className="text-[11px] text-slate-400">Позиций: {group.items.length}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-500">Сумма у {group.supplierName}:</span>
                      <span className="font-black text-slate-900 text-sm">
                        {Number(group.subtotal).toLocaleString("ru-RU")} ₸
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 3. Подвал корзины с общей суммой */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200/90 bg-white shrink-0 space-y-3.5 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                  Общая сумма закупки
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  {groupedBySupplier.length} поставщ. • {uniquePositionsCount} позиций ({totalQuantity} ед.)
                </span>
              </div>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight block">
                  {Number(totalSum).toLocaleString("ru-RU")} ₸
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyFullReport}
                className="flex-1 py-3 px-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-black transition cursor-pointer flex items-center justify-center gap-2"
              >
                {copiedAll ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Сводный отчет скопирован!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>Скопировать общий свод</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-3 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition cursor-pointer shrink-0"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
}
