"use client";

import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Loader2, Table, Search, AlertCircle, ExternalLink, Download } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

interface ExcelPreviewProps {
  fileUrl: string;
  fileName: string;
  onDownload: () => void;
}

export default function ExcelPreview({ fileUrl, fileName, onDownload }: ExcelPreviewProps) {
  const [sheets, setSheets] = useState<{ [sheetName: string]: string[][] }>({});
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [activeSheet, setActiveSheet] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    let isCancelled = false;

    async function loadExcel() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`Ошибка загрузки: HTTP ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array", cellDates: true });

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          throw new Error("В таблице нет листов");
        }

        const parsedSheets: { [sheetName: string]: string[][] } = {};
        workbook.SheetNames.forEach((name) => {
          const worksheet = workbook.Sheets[name];
          const rawData = XLSX.utils.sheet_to_json<any[]>(worksheet, {
            header: 1,
            defval: "",
            blankrows: false,
          });
          parsedSheets[name] = rawData.map((row) =>
            (Array.isArray(row) ? row : []).map((cell: any) => {
              if (cell instanceof Date) {
                return cell.toLocaleDateString("ru-RU");
              }
              return cell !== null && cell !== undefined ? String(cell) : "";
            })
          );
        });

        if (!isCancelled) {
          setSheets(parsedSheets);
          setSheetNames(workbook.SheetNames);
          setActiveSheet(workbook.SheetNames[0]);
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error("Ошибка парсинга Excel:", err);
          setError(err.message || "Не удалось прочитать таблицу Excel");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadExcel();

    return () => {
      isCancelled = true;
    };
  }, [fileUrl]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-2xl p-8 space-y-3">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className="text-xs font-bold text-slate-500">Загрузка и чтение таблицы Excel...</p>
      </div>
    );
  }

  if (error || sheetNames.length === 0) {
    const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-2xl p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="max-w-sm">
          <h4 className="text-sm font-black text-slate-900">Не удалось отобразить таблицу</h4>
          <p className="text-xs text-slate-500 mt-1">
            {error || "Формат файла требует внешнего просмотра"}
          </p>
        </div>
        <div className="flex gap-2 justify-center">
          <a
            href={googleViewerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs inline-flex items-center gap-1.5 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Google Docs
          </a>
          <button
            onClick={onDownload}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs inline-flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Скачать файл
          </button>
        </div>
      </div>
    );
  }

  const currentRows = sheets[activeSheet] || [];
  const filteredRows = searchQuery.trim()
    ? currentRows.filter((row) =>
        row.some((cell) => cell.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : currentRows;

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xl">
      {/* Верхняя панель: поиск и переключатель листов */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs shrink-0">
        {/* Табы листов */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
          <div className="flex items-center gap-1 text-slate-400 font-bold text-[11px] mr-2 shrink-0">
            <Table className="w-3.5 h-3.5 text-emerald-600" />
            <span>Листы:</span>
          </div>
          {sheetNames.map((name) => (
            <button
              key={name}
              onClick={() => {
                triggerHaptic("light");
                setActiveSheet(name);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black transition shrink-0 cursor-pointer ${
                activeSheet === name
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200/60"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Поиск по таблице */}
        <div className="relative flex items-center shrink-0 w-full sm:w-48">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Поиск по ячейкам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Табличная сетка */}
      <div className="flex-1 overflow-auto bg-white p-2">
        {filteredRows.length === 0 ? (
          <div className="h-full flex items-center justify-center p-8 text-center text-slate-400 text-xs font-semibold">
            {searchQuery ? "Ничего не найдено по запросу" : "Лист пуст"}
          </div>
        ) : (
          <div className="min-w-max">
            <table className="w-full border-collapse text-left text-xs font-mono">
              <tbody>
                {filteredRows.map((row, rIdx) => {
                  const isHeader = rIdx === 0;
                  return (
                    <tr
                      key={`row-${rIdx}`}
                      className={`border-b border-slate-100 hover:bg-orange-50/40 transition-colors ${
                        isHeader ? "bg-slate-100/80 font-black text-slate-900 sticky top-0 z-10" : "text-slate-700 font-medium"
                      }`}
                    >
                      <td className="px-2.5 py-1.5 text-[10px] text-slate-400 bg-slate-50 border-r border-slate-200 text-right select-none font-sans w-8">
                        {rIdx + 1}
                      </td>
                      {row.map((cell, cIdx) => (
                        <td
                          key={`cell-${rIdx}-${cIdx}`}
                          className="px-3 py-1.5 border-r border-slate-100 whitespace-pre-wrap max-w-xs break-words"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Нижняя информационная строка */}
      <div className="px-4 py-1.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-400 font-semibold flex items-center justify-between shrink-0">
        <span>Лист: {activeSheet} ({filteredRows.length} строк)</span>
        <span>Формат: {fileName.split(".").pop()?.toUpperCase()}</span>
      </div>
    </div>
  );
}
