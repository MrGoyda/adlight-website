// app/design-code/_components/DesignCodeFees.tsx
// Секция: Плата за наружную рекламу (Параграф 6 НК РК, ст. 653–656)

import { BookText, AlertCircle, Info } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import {
  DESIGN_CODE_TEXTS,
  DESIGN_CODE_HIGHWAY_FEES,
  DESIGN_CODE_LOCATION_FEES,
  DESIGN_CODE_TABLE_UI,
} from "@/dictionaries/design-code";

const t = DESIGN_CODE_TEXTS.fees;

// ─────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────

/** Бейдж статьи НК */
function ArticleBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 text-xs font-bold tracking-wider uppercase">
      <BookText className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}

/** Карточка с краткими тезисами статьи */
function ArticleCard({
  number,
  title,
  points,
  accent = "orange",
}: {
  number: string;
  title: string;
  points: string[];
  accent?: "orange" | "amber" | "red";
}) {
  const accentMap = {
    orange: { bg: "bg-orange-50", border: "border-orange-200/50", dot: "bg-orange-500" },
    amber:  { bg: "bg-amber-50",  border: "border-amber-200/50",  dot: "bg-amber-500"  },
    red:    { bg: "bg-red-50",    border: "border-red-200/50",    dot: "bg-red-500"     },
  };
  const c = accentMap[accent];

  return (
    <div className={`rounded-2xl border ${c.border} ${c.bg} p-6`}>
      <ArticleBadge label={number} />
      <h3 className="mt-3 mb-4 text-base font-bold text-slate-900 tracking-tight">{title}</h3>
      <ul className="space-y-2.5">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Инфо-плашка */
function InfoNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 mt-4 p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-sm text-slate-600 leading-relaxed">
      <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  );
}

/** Бейдж значения МРП */
function MrpBadge({ value }: { value: number | string }) {
  if (value === "—") {
    return <span className="text-slate-300 font-medium">—</span>;
  }
  if (value === 0) {
    return <span className="text-slate-400 font-medium text-xs">0</span>;
  }
  return (
    <span className="inline-flex items-center gap-0.5 font-bold text-orange-600 tabular-nums">
      {value}
      <span className="text-[10px] font-semibold text-orange-400 ml-0.5 tracking-tight">МРП</span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────
// TABLE 1 — HIGHWAYS
// ─────────────────────────────────────────────────────────────────

function HighwayTable() {
  return (
    <div
      className="overflow-x-auto rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
      role="region"
      aria-label={t.art655.highwayTitle}
    >
      <table
        className="w-full text-sm border-collapse min-w-[360px]"
        itemScope
        itemType="https://schema.org/Table"
      >
        <caption className="sr-only">{t.art655.highwayTitle}</caption>
        <thead>
          <tr className="bg-slate-900 text-white">
            <th scope="col" className="text-left px-5 py-3.5 font-semibold text-sm rounded-tl-xl w-12 text-slate-400">
              {DESIGN_CODE_TABLE_UI.highway.num}
            </th>
            <th scope="col" className="text-left px-5 py-3.5 font-semibold text-sm">
              {DESIGN_CODE_TABLE_UI.highway.category}
            </th>
            <th scope="col" className="text-center px-5 py-3.5 font-semibold text-sm rounded-tr-xl whitespace-nowrap">
              {DESIGN_CODE_TABLE_UI.highway.rate}
            </th>
          </tr>
        </thead>
        <tbody>
          {DESIGN_CODE_HIGHWAY_FEES.map((row, i) => (
            <tr
              key={row.category}
              className={`border-t border-slate-100 transition-colors hover:bg-orange-50/40 ${
                i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
              }`}
            >
              <td className="px-5 py-3.5 text-slate-400 text-xs font-medium">{i + 1}.</td>
              <td className="px-5 py-3.5 text-slate-700 font-medium">{row.category}</td>
              <td className="px-5 py-3.5 text-center">
                <MrpBadge value={row.rate} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// TABLE 2 — LOCATION FEES (большая таблица)
// ─────────────────────────────────────────────────────────────────

function LocationTable() {
  return (
    <div
      className="overflow-x-auto rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
      role="region"
      aria-label={t.art655.locationTitle}
    >
      <table
        className="w-full text-sm border-collapse min-w-[680px]"
        itemScope
        itemType="https://schema.org/Table"
      >
        <caption className="sr-only">{t.art655.locationTitle}</caption>
        <thead>
          <tr className="bg-slate-900 text-white">
            <th scope="col" className="text-left px-4 py-3.5 font-semibold text-xs text-slate-400 rounded-tl-xl w-12">
              {DESIGN_CODE_TABLE_UI.location.num}
            </th>
            <th scope="col" className="text-left px-4 py-3.5 font-semibold text-sm max-w-[260px]">
              {DESIGN_CODE_TABLE_UI.location.type}
            </th>
            <th scope="col" className="text-center px-4 py-3.5 font-semibold text-xs leading-tight whitespace-pre-line max-w-[130px]">
              {DESIGN_CODE_TABLE_UI.location.capital}
            </th>
            <th scope="col" className="text-center px-4 py-3.5 font-semibold text-xs leading-tight whitespace-pre-line max-w-[130px]">
              {DESIGN_CODE_TABLE_UI.location.oblast}
            </th>
            <th scope="col" className="text-center px-4 py-3.5 font-semibold text-xs leading-tight whitespace-pre-line max-w-[130px] rounded-tr-xl">
              {DESIGN_CODE_TABLE_UI.location.district}
            </th>
          </tr>
        </thead>
        <tbody>
          {DESIGN_CODE_LOCATION_FEES.map((row, i) => {
            // Строка-заголовок группы
            if (row.isGroupHeader) {
              return (
                <tr key={row.id} className="bg-slate-100/80 border-t-2 border-slate-200">
                  <td className="px-4 py-2.5 text-slate-400 text-xs font-bold">{row.id}.</td>
                  <td
                    colSpan={4}
                    className="px-4 py-2.5 text-slate-600 font-semibold text-xs uppercase tracking-wide"
                  >
                    {row.type}
                  </td>
                </tr>
              );
            }

            // Подстрока группы — отступ
            const isSubRow = row.id.includes(".");

            return (
              <tr
                key={row.id}
                className={`border-t border-slate-100 transition-colors hover:bg-orange-50/40 ${
                  i % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                }`}
              >
                <td className="px-4 py-3 text-slate-400 text-xs font-medium align-middle">{row.id}.</td>
                <td className={`px-4 py-3 text-slate-700 align-middle ${isSubRow ? "pl-8 text-slate-600 text-xs" : "font-medium"}`}>
                  {row.type}
                </td>
                <td className="px-4 py-3 text-center align-middle">
                  <MrpBadge value={row.capital} />
                </td>
                <td className="px-4 py-3 text-center align-middle">
                  <MrpBadge value={row.oblast} />
                </td>
                <td className="px-4 py-3 text-center align-middle">
                  <MrpBadge value={row.district} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// PAYMENT STEPS (Ст. 656)
// ─────────────────────────────────────────────────────────────────

function PaymentSteps() {
  const steps = t.art656.points;
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {steps.map((item) => (
        <div
          key={item.step}
          className="relative p-6 rounded-2xl border border-slate-200/80 bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300"
        >
          <div className="text-4xl font-black text-slate-100 mb-4 leading-none select-none">
            {item.step}
          </div>
          <h4 className="font-bold text-slate-900 text-sm mb-2 tracking-tight">{item.title}</h4>
          <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
          <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-orange-400" />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────

export default function DesignCodeFees() {
  return (
    <section
      id="fees"
      className="py-24 bg-slate-50 border-t border-slate-200 scroll-mt-20"
      aria-labelledby="fees-heading"
      itemScope
      itemType="https://schema.org/Article"
    >
      {/* Schema.org невидимые мета — значения берём из словаря */}
      <meta itemProp="name" content={t.title} />
      <meta itemProp="description" content={t.subtitle} />

      <div className="container mx-auto px-4">

        {/* HEADER */}
        <FadeIn direction="up">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 text-xs font-bold uppercase tracking-wider mb-6">
              <BookText className="w-4 h-4" />
              {t.sectionBadge}
            </div>
            <h2
              id="fees-heading"
              className="text-3xl md:text-4xl font-black text-slate-950 mb-4 tracking-tight"
              itemProp="headline"
            >
              {t.title}
            </h2>
            <p className="text-slate-500 text-base leading-relaxed" itemProp="abstract">
              {t.subtitle}
            </p>
          </div>
        </FadeIn>

        {/* СТАТЬИ 653 + 654: КРАТКИЕ КАРТОЧКИ */}
        <FadeIn direction="up" delay={100}>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <ArticleCard
              number={t.art653.number}
              title={t.art653.title}
              points={t.art653.points}
              accent="orange"
            />
            <ArticleCard
              number={t.art654.number}
              title={t.art654.title}
              points={t.art654.points}
              accent="amber"
            />
          </div>
        </FadeIn>

        {/* СТАТЬЯ 655: ТАБЛИЦЫ СТАВОК */}
        <FadeIn direction="up" delay={150}>
          <div className="mb-8 flex items-center gap-4">
            <ArticleBadge label={t.art655.number} />
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">{t.art655.title}</h3>
          </div>

          {/* МРП пояснение */}
          <div className="flex items-start gap-3 mb-8 p-4 rounded-xl bg-orange-50 border border-orange-200/50 text-sm text-slate-600">
            <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
            <span>{t.art655.mrpNote}</span>
          </div>

          {/* Таблица 1: Автодороги */}
          <div className="mb-10">
            <h4 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-orange-500" />
              {t.art655.highwayTitle}
            </h4>
            <HighwayTable />
            <InfoNote>{t.art655.highwayNote}</InfoNote>
          </div>

          {/* Таблица 2: Населённые пункты */}
          <div className="mb-10">
            <h4 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-amber-500" />
              {t.art655.locationTitle}
            </h4>

            {/* Подсказка для мобильных */}
            <p className="text-xs text-slate-400 mb-3 md:hidden flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              {DESIGN_CODE_TABLE_UI.scrollHint}
            </p>

            <LocationTable />
            <InfoNote>{t.art655.locationNote}</InfoNote>
          </div>
        </FadeIn>

        {/* СТАТЬЯ 656: ПОРЯДОК УПЛАТЫ */}
        <FadeIn direction="up" delay={200}>
          <div className="mb-8 flex items-center gap-4">
            <ArticleBadge label={t.art656.number} />
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">{t.art656.title}</h3>
          </div>
          <PaymentSteps />
        </FadeIn>

      </div>
    </section>
  );
}
