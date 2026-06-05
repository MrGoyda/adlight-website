"use client";

/**
 * CalculatorShell.tsx
 * Паттерн Container/Presenter (clean-architecture):
 * — этот файл управляет стейтом и бизнес-логикой
 * — дочерние компоненты получают данные через props
 */

import { useState, useMemo } from "react";
import ConsultationModal from "@/components/ConsultationModal";
import { SITE_PRICES_NUMERIC } from "@/config/site";
import {
  LETTER_TYPES,
  BOX_TYPES,
  CALC_CONSTANTS,
  CALC_UI,
  type CalcMode,
} from "@/dictionaries/calculator";
import { triggerHaptic } from "@/lib/haptics";

import ModeTabBar from "./ModeTabBar";
import TypeSelector from "./TypeSelector";
import LettersForm from "./LettersForm";
import LightboxForm from "./LightboxForm";
import PriceResult from "./PriceResult";
import MobileResultBar from "./MobileResultBar";

// ─── Типы ────────────────────────────────────────────────────────────────────

interface BreakdownItem {
  label: string;
  value: string;
}

interface Calculation {
  min: number;
  max: number;
  breakdown: BreakdownItem[];
}

// ─── Вспомогательные функции ──────────────────────────────────────────────────

function calcLetters(
  titleText: string,
  subTextRu: string,
  subTextKz: string,
  height: number,
  subHeight: number,
  letterType: string
): Calculation {
  const { MIN_ORDER, PRICE_SPREAD, ROUND_TO } = CALC_CONSTANTS;

  const countTitle = titleText.replace(/\s/g, "").length;
  const countSub   = subTextRu.replace(/\s/g, "").length + subTextKz.replace(/\s/g, "").length;
  const pricePerCm = SITE_PRICES_NUMERIC.letters[letterType as keyof typeof SITE_PRICES_NUMERIC.letters] ?? 450;

  const costTitle = countTitle * height * pricePerCm;
  const costSub   = countSub   * subHeight * pricePerCm;
  const raw = Math.ceil((costTitle + costSub) / CALC_CONSTANTS.ROUND_TO) * ROUND_TO;
  const base = Math.max(raw, MIN_ORDER);

  const breakdown: BreakdownItem[] = [];
  if (countTitle > 0) {
    breakdown.push({
      label: `Надпись: ${countTitle} букв × ${height} см × ${pricePerCm} ₸`,
      value: `${costTitle.toLocaleString("ru")} ₸`,
    });
  }
  if (countSub > 0) {
    breakdown.push({
      label: `Подпись: ${countSub} букв × ${subHeight} см × ${pricePerCm} ₸`,
      value: `${costSub.toLocaleString("ru")} ₸`,
    });
  }
  if (base === MIN_ORDER && raw < MIN_ORDER) {
    breakdown.push({ label: "Минимальный заказ", value: `${MIN_ORDER.toLocaleString("ru")} ₸` });
  }

  return {
    min: Math.round(base * (1 - PRICE_SPREAD)),
    max: Math.round(base * (1 + PRICE_SPREAD)),
    breakdown,
  };
}

function calcLightbox(
  boxWidth: number,
  boxHeight: number,
  boxType: string
): Calculation {
  const { MIN_ORDER, PRICE_SPREAD, MIN_BOX_AREA, ROUND_TO } = CALC_CONSTANTS;

  const areaCm2  = boxWidth * boxHeight;
  const areaM2   = Math.max(areaCm2 / 10000, MIN_BOX_AREA);
  const priceM2  = SITE_PRICES_NUMERIC.lightboxes[boxType as keyof typeof SITE_PRICES_NUMERIC.lightboxes] ?? 80000;
  const raw  = Math.ceil((areaM2 * priceM2) / ROUND_TO) * ROUND_TO;
  const base = Math.max(raw, MIN_ORDER);

  const breakdown: BreakdownItem[] = [
    {
      label: `${boxWidth}×${boxHeight} см = ${areaM2.toFixed(2)} м² × ${priceM2.toLocaleString("ru")} ₸/м²`,
      value: `${raw.toLocaleString("ru")} ₸`,
    },
  ];
  if (base === MIN_ORDER && raw < MIN_ORDER) {
    breakdown.push({ label: "Минимальный заказ", value: `${MIN_ORDER.toLocaleString("ru")} ₸` });
  }

  return {
    min: Math.round(base * (1 - PRICE_SPREAD)),
    max: Math.round(base * (1 + PRICE_SPREAD)),
    breakdown,
  };
}

function buildWhatsappLink(
  mode: CalcMode,
  calc: Calculation,
  params: {
    titleText: string;
    subTextRu: string;
    subTextKz: string;
    height: number;
    subHeight: number;
    letterType: string;
    boxWidth: number;
    boxHeight: number;
    boxType: string;
  }
): string {
  const { min, max } = calc;
  let content = "";

  if (mode === "letters") {
    const typeName = LETTER_TYPES.find((t) => t.id === params.letterType)?.name ?? params.letterType;
    content =
      `🔠 *Надпись:* ${params.titleText || "—"}\n` +
      `📏 *Высота:* ${params.height} см\n` +
      `📝 *Подпись RU:* ${params.subTextRu || "—"}\n` +
      `📝 *Подпись KZ:* ${params.subTextKz || "—"}\n` +
      `📐 *Высота подписи:* ${params.subHeight} см\n` +
      `💡 *Технология:* ${typeName}`;
  } else {
    const typeName = BOX_TYPES.find((t) => t.id === params.boxType)?.name ?? params.boxType;
    content =
      `📦 *Тип:* ${typeName}\n` +
      `📏 *Размер:* ${params.boxWidth}×${params.boxHeight} см`;
  }

  const message =
    `👋 Здравствуйте! Расчёт с сайта:\n\n${content}\n\n` +
    `💰 *Бюджет:* ${min.toLocaleString("ru")} – ${max.toLocaleString("ru")} ₸\n\n` +
    `Прошу уточнить точную стоимость и сроки.`;

  return `https://wa.me/77071356701?text=${encodeURIComponent(message)}`;
}

// ─── Основной компонент ───────────────────────────────────────────────────────

export default function CalculatorShell() {
  const [activeTab, setActiveTab]   = useState<CalcMode>("letters");
  const [letterType, setLetterType] = useState<string>("face-lit");
  const [titleText,  setTitleText]  = useState("ADLight");
  const [subTextRu,  setSubTextRu]  = useState("");
  const [subTextKz,  setSubTextKz]  = useState("");
  const [height,     setHeight]     = useState<number>(CALC_CONSTANTS.HEIGHT.default);
  const [subHeight,  setSubHeight]  = useState<number>(CALC_CONSTANTS.SUB_HEIGHT.default);
  const [boxType,    setBoxType]    = useState<string>("acrylic");
  const [boxWidth,   setBoxWidth]   = useState<number>(CALC_CONSTANTS.BOX_WIDTH.default);
  const [boxHeight,  setBoxHeight]  = useState<number>(CALC_CONSTANTS.BOX_HEIGHT.default);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calculation = useMemo<Calculation>(() => {
    if (activeTab === "letters") {
      return calcLetters(titleText, subTextRu, subTextKz, height, subHeight, letterType);
    }
    return calcLightbox(boxWidth, boxHeight, boxType);
  }, [activeTab, titleText, subTextRu, subTextKz, height, subHeight, letterType, boxWidth, boxHeight, boxType]);

  const whatsappLink = useMemo(
    () => buildWhatsappLink(activeTab, calculation, { titleText, subTextRu, subTextKz, height, subHeight, letterType, boxWidth, boxHeight, boxType }),
    [activeTab, calculation, titleText, subTextRu, subTextKz, height, subHeight, letterType, boxWidth, boxHeight, boxType]
  );

  const openModal = () => { triggerHaptic("success"); setIsModalOpen(true); };

  // ─── Рендер ────────────────────────────────────────────────────────────────
  // МОБИЛЬ: обычный блок, элементы идут сверху вниз
  // ДЕСКТОП (lg): flex side-by-side — форма слева, результат sticky справа
  return (
    <>
      {/* ── Обёртка layout ── */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
 
        {/* ── Левая часть: форма ──────────────────────────────────── */}
        <form onSubmit={(e) => e.preventDefault()} className="w-full lg:flex-1 space-y-4">
 
          {/* Переключатель режимов */}
          <ModeTabBar active={activeTab} onChange={(m) => { triggerHaptic("light"); setActiveTab(m); }} />
 
          {/* Выбор технологии — ВАЖНО: нет overflow-hidden, иначе блокирует скролл */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-4 pb-0">
              <TypeSelector
                mode={activeTab}
                types={activeTab === "letters" ? LETTER_TYPES : BOX_TYPES}
                selected={activeTab === "letters" ? letterType : boxType}
                onSelect={activeTab === "letters" ? setLetterType : setBoxType}
              />
            </div>
            {/* Отступ снизу вне TypeSelector — он использует pb-3 для pb скролла */}
            <div className="h-4" />
          </div>
 
          {/* Параметры */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              {CALC_UI.parameters}
            </p>
            <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-2 duration-200">
              {activeTab === "letters" ? (
                <LettersForm
                  titleText={titleText}   onTitleChange={setTitleText}
                  subTextRu={subTextRu}   onSubRuChange={setSubTextRu}
                  subTextKz={subTextKz}   onSubKzChange={setSubTextKz}
                  height={height}         onHeightChange={setHeight}
                  subHeight={subHeight}   onSubHeightChange={setSubHeight}
                />
              ) : (
                <LightboxForm
                  boxWidth={boxWidth}   onWidthChange={setBoxWidth}
                  boxHeight={boxHeight} onHeightChange={setBoxHeight}
                />
              )}
            </div>
          </div>
 
          {/* Результат — только мобиль (инлайн под формой) */}
          <div className="lg:hidden">
            <PriceResult
              min={calculation.min}
              max={calculation.max}
              breakdown={calculation.breakdown}
              whatsappLink={whatsappLink}
              onOpenModal={openModal}
            />
          </div>
        </form>
 
        {/* ── Правая часть: результат sticky — только десктоп ──── */}
        <aside className="hidden lg:block w-[380px] shrink-0 sticky top-24" aria-label="Результаты расчета">
          <PriceResult
            min={calculation.min}
            max={calculation.max}
            breakdown={calculation.breakdown}
            whatsappLink={whatsappLink}
            onOpenModal={openModal}
          />
        </aside>
      </div>

      {/* ── Мобильный sticky CTA-бар снизу ── */}
      <MobileResultBar
        min={calculation.min}
        max={calculation.max}
        whatsappLink={whatsappLink}
        onOpenModal={openModal}
      />

      {/* ── Модалка ── */}
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        source={`${CALC_UI.modalSource} — ${activeTab === "letters" ? "Буквы" : "Лайтбокс"}`}
        title={CALC_UI.modalTitle}
        subtitle={CALC_UI.modalSubtitle}
        buttonText={CALC_UI.modalButton}
      />
    </>
  );
}
