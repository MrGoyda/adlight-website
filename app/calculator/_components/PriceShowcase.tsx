/**
 * PriceShowcase.tsx — Server Component
 * SSR-блок «Цены от»: индексируется Google и AI-поисковиками без JS.
 * Данные только из SITE_PRICES_NUMERIC — единый источник правды.
 */

import { SITE_PRICES_NUMERIC, formatPrice } from "@/config/site";
import { CALC_UI } from "@/dictionaries/calculator";

interface PriceRow {
  name: string;
  price: string;
  unit: string;
}

interface PriceGroup {
  title: string;
  accent: string;
  rows: PriceRow[];
}

const PRICE_GROUPS: PriceGroup[] = [
  {
    title: "Объёмные буквы",
    accent: "orange",
    rows: [
      { name: "Световое лицо (face-lit)",   price: `от ${SITE_PRICES_NUMERIC.letters["face-lit"]}`,         unit: "₸/см" },
      { name: "Полное свечение (full-lit)",  price: `от ${SITE_PRICES_NUMERIC.letters["full-lit"]}`,         unit: "₸/см" },
      { name: "Контражур (back-lit)",        price: `от ${SITE_PRICES_NUMERIC.letters["back-lit"]}`,         unit: "₸/см" },
      { name: "Комбо (combo-lit)",           price: `от ${SITE_PRICES_NUMERIC.letters["combo-lit"]}`,        unit: "₸/см" },
      { name: "Борта (side-lit)",            price: `от ${SITE_PRICES_NUMERIC.letters["side-lit"]}`,         unit: "₸/см" },
      { name: "Акрил цельный",               price: `от ${SITE_PRICES_NUMERIC.letters["acrylic-slim"]}`,     unit: "₸/см" },
      { name: "Перфорация",                  price: `от ${SITE_PRICES_NUMERIC.letters["perforated"]}`,       unit: "₸/см" },
      { name: "День/Ночь",                   price: `от ${SITE_PRICES_NUMERIC.letters["day-night-effect"]}`, unit: "₸/см" },
      { name: "Пиксельные (Pixel LED)",      price: `от ${SITE_PRICES_NUMERIC.letters["pixel-led"]}`,        unit: "₸/см" },
      { name: "Ретро лофт (Loft Lamps)",     price: `от ${SITE_PRICES_NUMERIC.letters["loft-lamps"]}`,       unit: "₸/см" },
      { name: "Эко дерево",                  price: `от ${SITE_PRICES_NUMERIC.letters["wood-style"]}`,       unit: "₸/см" },
      { name: "Без подсветки",               price: `от ${SITE_PRICES_NUMERIC.letters["non-lit"]}`,          unit: "₸/см" },
    ],
  },
  {
    title: "Лайтбоксы (световые короба)",
    accent: "blue",
    rows: [
      { name: "Акриловый",   price: `от ${formatPrice(SITE_PRICES_NUMERIC.lightboxes["acrylic"])}`,    unit: "₸/м²" },
      { name: "Баннерный",   price: `от ${formatPrice(SITE_PRICES_NUMERIC.lightboxes["banner"])}`,     unit: "₸/м²" },
      { name: "Композитный", price: `от ${formatPrice(SITE_PRICES_NUMERIC.lightboxes["composite"])}`,  unit: "₸/м²" },
      { name: "Фигурный",    price: `от ${formatPrice(SITE_PRICES_NUMERIC.lightboxes["figured"])}`,    unit: "₸/м²" },
    ],
  },
  {
    title: "Неон (LED-неон)",
    accent: "violet",
    rows: [
      { name: "Погонный метр",         price: `от ${formatPrice(SITE_PRICES_NUMERIC.services.neon)}`,              unit: "₸/пог.м" },
      { name: "Неоновое сердечко",     price: `от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.neonHeart)}`, unit: "₸" },
      { name: "Круг d50 см",           price: `от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.roundD50)}`,  unit: "₸" },
      { name: "Прямоугольник 60 см",   price: `от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.rect60)}`,    unit: "₸" },
      { name: "Фигурный логотип",      price: `от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.figuredLogo)}`, unit: "₸" },
    ],
  },
  {
    title: "Другие услуги",
    accent: "slate",
    rows: [
      { name: "Панельные кронштейны",  price: `от ${formatPrice(SITE_PRICES_NUMERIC.services.panelBrackets)}`,    unit: "₸" },
      { name: "Брендирование авто",    price: `от ${formatPrice(SITE_PRICES_NUMERIC.services.brandingCars)}`,     unit: "₸" },
      { name: "Ремонт вывески",        price: `от ${formatPrice(SITE_PRICES_NUMERIC.services.signboardRepair)}`,  unit: "₸" },
      { name: "Оклейка витрин",        price: `от ${formatPrice(SITE_PRICES_NUMERIC.services.windowBranding)}`,   unit: "₸/м²" },
      { name: "Пилон / стела",         price: `от ${formatPrice(SITE_PRICES_NUMERIC.services.pylons)}`,           unit: "₸" },
      { name: "Выставочные стенды",    price: `от ${formatPrice(SITE_PRICES_NUMERIC.services.exhibitionStands)}`, unit: "₸" },
      { name: "Дизайн-код",            price: `от ${formatPrice(SITE_PRICES_NUMERIC.services.designCode)}`,       unit: "₸" },
    ],
  },
];

const ACCENT_CLASSES: Record<string, { badge: string; dot: string }> = {
  orange: { badge: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-400" },
  blue:   { badge: "bg-blue-50 text-blue-700 border-blue-200",       dot: "bg-blue-400"   },
  violet: { badge: "bg-violet-50 text-violet-700 border-violet-200", dot: "bg-violet-400" },
  slate:  { badge: "bg-slate-50 text-slate-700 border-slate-200",    dot: "bg-slate-400"  },
};

export default function PriceShowcase() {
  return (
    <section
      aria-label={CALC_UI.showcaseTitle}
      className="mt-16 mb-8"
    >
      {/* Заголовок секции */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {CALC_UI.showcaseTitle}
        </h2>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          {CALC_UI.showcaseNote}
        </p>
      </div>

      {/* Сетка групп цен */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PRICE_GROUPS.map((group) => {
          const accent = ACCENT_CLASSES[group.accent] ?? ACCENT_CLASSES.slate;
          return (
            <div
              key={group.title}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
            >
              {/* Заголовок группы */}
              <div className={`px-5 py-3 border-b border-slate-100 ${accent.badge} border-0`}>
                <h3 className="text-sm font-bold">{group.title}</h3>
              </div>

              {/* Строки цен */}
              <div className="divide-y divide-slate-50">
                {group.rows.map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${accent.dot}`} />
                      <span className="text-sm text-slate-700 truncate">{row.name}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 tabular-nums shrink-0 ml-4">
                      {row.price} <span className="font-normal text-slate-500">{row.unit}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-slate-400 mt-6">
        * Цены ориентировочные. Точная стоимость рассчитывается после замера.
      </p>
    </section>
  );
}
