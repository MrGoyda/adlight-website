"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, CheckCircle, AlertCircle, ArrowRight, FileSpreadsheet, Users } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { normalizePhone, formatPhoneDisplay } from "@/lib/phoneUtils";
import { batchImportClients, syncAllLeadsToClients } from "../actions";

interface BatchImportClientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const BatchImportClientsModal: React.FC<BatchImportClientsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [rawText, setRawText] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isSyncingLeads, setIsSyncingLeads] = useState(false);
  const [resultMessage, setResultMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Парсинг текста в реальном времени
  const parsedContacts = useMemo(() => {
    if (!rawText.trim()) return [];

    const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);
    const list: Array<{ name: string; phone: string; companyName?: string; raw: string; isValid: boolean }> = [];
    const seenPhones = new Set<string>();

    for (const line of lines) {
      // Поддерживаем форматы:
      // 1. "Имя, Телефон, Компания" или "Телефон, Имя" или просто "Телефон"
      const parts = line.split(/[,;\t]/).map((p) => p.trim());
      let phoneCandidate = "";
      let nameCandidate = "";
      let companyCandidate = "";

      for (const part of parts) {
        const digits = part.replace(/\D/g, "");
        if (digits.length >= 10 && !phoneCandidate) {
          phoneCandidate = normalizePhone(part);
        } else if (!nameCandidate) {
          nameCandidate = part;
        } else if (!companyCandidate) {
          companyCandidate = part;
        }
      }

      if (!phoneCandidate) {
        // Проверяем всю строку на цифры
        const digits = line.replace(/\D/g, "");
        if (digits.length >= 10) {
          phoneCandidate = normalizePhone(line);
        }
      }

      const isValid = Boolean(phoneCandidate && phoneCandidate.length >= 10 && !seenPhones.has(phoneCandidate));
      if (phoneCandidate) seenPhones.add(phoneCandidate);

      list.push({
        raw: line,
        name: nameCandidate || "Клиент",
        phone: phoneCandidate,
        companyName: companyCandidate || undefined,
        isValid,
      });
    }

    return list;
  }, [rawText]);

  const validCount = parsedContacts.filter((c) => c.isValid).length;

  if (!isOpen) return null;

  const handleImport = async () => {
    const validList = parsedContacts.filter((c) => c.isValid).map((c) => ({
      name: c.name,
      phone: c.phone,
      companyName: c.companyName,
      notes: "Массовый импорт контактов",
    }));

    if (validList.length === 0) return;

    setIsPending(true);
    triggerHaptic("medium");

    const res = await batchImportClients(validList);
    setIsPending(false);

    if (res.error) {
      setResultMessage({ type: "error", text: res.error });
      triggerHaptic("error");
    } else {
      triggerHaptic("success");
      setResultMessage({
        type: "success",
        text: `Успешно импортировано новых клиентов: ${res.createdCount}. Пропущено существующих дубликатов: ${res.skippedCount}.`,
      });
      if (onSuccess) onSuccess();
    }
  };

  const handleSyncAllLeads = async () => {
    setIsSyncingLeads(true);
    triggerHaptic("medium");
    const res = await syncAllLeadsToClients();
    setIsSyncingLeads(false);

    if (res.error) {
      setResultMessage({ type: "error", text: res.error });
      triggerHaptic("error");
    } else {
      triggerHaptic("success");
      setResultMessage({
        type: "success",
        text: `Синхронизировано заявок: ${res.totalLeads}. Создано новых контактов: ${res.createdCount}. Связано сделок: ${res.linkedCount}.`,
      });
      if (onSuccess) onSuccess();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer"
        />

        {/* Modal */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden z-10 flex flex-col max-h-[90dvh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 flex items-center justify-center shadow-2xs">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight">
                  Импорт клиентской базы
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Загрузка старых номеров из записных книжек, Excel или заметок
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain">
            {/* Оповещение о результатах */}
            {resultMessage && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${
                  resultMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {resultMessage.type === "success" ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{resultMessage.text}</span>
              </div>
            )}

            {/* Блок автоматического синка всех лидов */}
            <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div>
                <span className="text-xs font-black text-blue-950 block flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-600" />
                  Авто-синхронизация из заявок CRM
                </span>
                <p className="text-[11px] text-blue-800/80 mt-0.5 font-medium">
                  Собрать все уникальные номера из лидов сайта в постоянную базу клиентов
                </p>
              </div>

              <button
                type="button"
                disabled={isSyncingLeads || isPending}
                onClick={handleSyncAllLeads}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-black transition cursor-pointer active:scale-95 shrink-0 shadow-xs"
              >
                {isSyncingLeads ? "Синхронизация..." : "Синхронизировать лиды"}
              </button>
            </div>

            {/* Поле вставки текста */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Вставьте список контактов:
                </label>
                <span className="text-[11px] font-bold text-slate-400">
                  Формат: Имя, Телефон, Компания (или просто телефоны)
                </span>
              </div>
              <textarea
                rows={5}
                placeholder={`+7 701 123 45 67, Асхат, Ресторан Altyn\n87023334455, Елена, Салон красоты\n77079998877`}
                value={rawText}
                onChange={(e) => {
                  setRawText(e.target.value);
                  setResultMessage(null);
                }}
                className="w-full p-3 text-base sm:text-xs font-mono bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-purple-500 transition text-slate-900 shadow-2xs"
              />
            </div>

            {/* Предпросмотр распознанных контактов */}
            {parsedContacts.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Распознано: {validCount} из {parsedContacts.length} строк
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-2xl divide-y divide-slate-100 bg-white">
                  {parsedContacts.map((c, i) => (
                    <div
                      key={i}
                      className={`p-2.5 text-xs flex items-center justify-between gap-2 ${
                        c.isValid ? "bg-white" : "bg-rose-50/60"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-slate-400 font-mono text-[10px] w-6">{i + 1}.</span>
                        <span className="font-extrabold text-slate-900 truncate">{c.name}</span>
                        {c.companyName && (
                          <span className="text-[10px] text-slate-400 truncate">({c.companyName})</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`font-mono font-bold ${c.isValid ? "text-purple-700" : "text-rose-600"}`}>
                          {c.phone ? formatPhoneDisplay(c.phone) : "Некорректный номер"}
                        </span>
                        {c.isValid ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Кнопки импорта */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition cursor-pointer active:scale-95 disabled:opacity-50"
              >
                Закрыть
              </button>

              <button
                type="button"
                disabled={isPending || validCount === 0}
                onClick={handleImport}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-black text-xs shadow-sm transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                {isPending ? (
                  "Импорт..."
                ) : (
                  <>
                    <span>Импортировать ({validCount})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
