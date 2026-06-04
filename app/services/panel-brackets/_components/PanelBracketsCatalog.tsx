// app/services/panel-brackets/_components/PanelBracketsCatalog.tsx

import Image from "next/image";
import { panel_bracketsDetails } from "@/dictionaries/services/details/panel-brackets";

// Расширенные SEO/AI данные для каталога панель-кронштейнов
const enrichedTypes = [
  {
    title: "Круглый световой панель-кронштейн",
    desc: "Круглые световые консоли — наиболее востребованное и гармоничное решение для городских улиц. Обтекаемая форма снижает ветровую нагрузку и минимизирует турбулентность. Идеально вписывается в архитектурный дизайн-код Астаны. Лицевая сторона изготавливается из высокопрочного молочного акрила Plexiglas с равномерным светорассеиванием.",
    image: "/images/panel-brackets/panel-brackets-07.webp",
    tag: "Хит продаж",
    specs: "Диаметр: 50-80 см; Лицевая часть: акрил Plexiglas 3мм; Подсветка: торцевые LED модули влагозащищенные (IP67); Профиль: алюминиевый багет с полимерной покраской.",
    bestFor: "Кофейни, пекарни, барбершопы, салоны красоты, кондитерские и бутики на центральных проспектах."
  },
  {
    title: "Прямоугольный панель-кронштейн",
    desc: "Прямоугольные и квадратные торцевые лайтбоксы предоставляют максимальную полезную площадь для нанесения логотипа, названия компании и перечня услуг. Простая и строгая геометрия обеспечивает идеальную считываемость шрифтов с большого расстояния. Рама из жесткого стального профиля выдерживает сильные механические нагрузки.",
    image: "/images/panel-brackets/panel-brackets-06.webp",
    tag: "Информативно",
    specs: "Размеры: от 40x40 до 100x100 см; Каркас: профильная труба 20x20x1.5мм; Лицо: сотовый поликарбонат или акрил; Изображение: УФ-печать высокого разрешения (1440 dpi).",
    bestFor: "Отделения банков, аптечные сети, нотариальные конторы, туристические агентства, медицинские центры."
  },
  {
    title: "Фигурный панель-кронштейн (по форме логотипа)",
    desc: "Эксклюзивные двухсторонние консоли, в точности повторяющие очертания вашего фирменного знака или товарного символа (зуб, чашка кофе, ножницы, очки). Производство ведется на высокоточных фрезерных ЧПУ станках. Такой подход гарантирует уникальность вывески и мгновенную идентификацию вашего бренда прохожими.",
    image: "/images/panel-brackets/type-shaped.webp",
    tag: "Креатив",
    specs: "Контур: индивидуальный криволинейный; Борта: жидкий акрил или ПВХ с покраской; Подсветка: линзованные светодиоды ELF; Монтаж: усиленная выносная лапа.",
    bestFor: "Стоматологические клиники, магазины оптики, креативные студии, рестораны авторской кухни."
  },
  {
    title: "Светодиодный аптечный крест",
    desc: "Профессиональные консольные указатели для фармацевтических учреждений. Могут изготавливаться как в классическом статическом варианте, так и с динамической анимацией (мерцание, отображение времени и температуры). Использование сверхъярких зеленых светодиодов прямого свечения гарантирует видимость аптеки на расстоянии до 300 метров даже при слепящем солнце.",
    image: "/images/panel-brackets/panel-brackets-02.webp",
    tag: "Яркость",
    specs: "Размер: 50x50, 60x60, 70x70 см; Светодиоды: DIP или SMD повышенной яркости зеленые/двухцветные; Защита: IP67 пыле- и влагоизоляция корпуса.",
    bestFor: "Круглосуточные аптеки, оптовые аптечные пункты, ветеринарные аптеки и клиники."
  },
  {
    title: "Динамический вращающийся панель-кронштейн",
    desc: "Инновационная вывеска с интегрированным электрическим двигателем низкого энергопотребления. Плавное вращение конструкции вокруг своей оси на 360 градусов непрерывно приковывает к себе внимание людей. Динамическая реклама воспринимается человеческим глазом в 3-4 раза эффективнее статических аналогов.",
    image: "/images/panel-brackets/panel-brackets-03.webp",
    tag: "Wow-эффект",
    specs: "Привод: бесшумный мотор-редуктор 12V/220V; Скорость: 2-3 оборота в минуту; Вращающийся контакт: токосъемник повышенной надежности.",
    bestFor: "Премиум бутики, автосалоны, концептуальные рестораны, флагманские офисы продаж."
  },
  {
    title: "Интерьерный навигационный кронштейн",
    desc: "Тонкие световые и несветовые двухсторонние таблички-флажки, предназначенные для внутренней навигации в коридорах торговых центров, бизнес-центров и отелей. Помогают посетителям ориентироваться в пространстве, направляя их к вашему офису или торговому залу при ходьбе вдоль протяженных галерей.",
    image: "/images/panel-brackets/panel-brackets-04.webp",
    tag: "Навигация",
    specs: "Толщина: от 20 мм (ультратонкие); Лицевая часть: акрилайт или композит с прорезной подсветкой; Крепление: торцевое стеновое или подвесное к потолку.",
    bestFor: "Торгово-развлекательные центры, многоэтажные бизнес-центры, коворкинги, отели, медицинские клиники."
  }
];

export default function PanelBracketsCatalog() {
  return (
    <section 
      id="catalog" 
      aria-labelledby="catalog-heading" 
      className="py-24 bg-white border-t border-slate-200/80"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">Виды консолей</span>
          <h2 
            id="catalog-heading" 
            className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight"
          >
            Каталог консольных вывесок: виды конструкций и формы панель-кронштейнов
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            {panel_bracketsDetails.typesSubtitle}. Каждое изделие проходит строгий заводской контроль качества перед отправкой на монтаж.
          </p>
        </div>

        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {enrichedTypes.map((type, i) => (
            <li 
              key={i} 
              itemScope 
              itemType="https://schema.org/Product"
              className="group flex flex-col rounded-3xl overflow-hidden border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-orange-500/30 cursor-default shadow-sm hover:shadow-md transition-all duration-300"
            >
              <article className="flex flex-col h-full">
                {/* Image Header */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 border-b border-slate-150">
                  {type.tag && (
                    <span className="absolute top-4 left-4 z-10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white rounded-md shadow-md">
                      {type.tag}
                    </span>
                  )}
                  <Image 
                    src={type.image} 
                    alt={type.title}
                    fill
                    itemProp="image"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Card Body */}
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <h3 
                    itemProp="name" 
                    className="text-xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors duration-300"
                  >
                    {type.title}
                  </h3>
                  <p 
                    itemProp="description" 
                    className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow"
                  >
                    {type.desc}
                  </p>

                  {/* AI & SEO Rich Metadata Details */}
                  <div className="mt-auto pt-4 border-t border-slate-100/80 space-y-2.5">
                    <div className="text-xs text-slate-500">
                      <strong className="text-slate-700 font-semibold block mb-0.5">Технические параметры (Спецификация):</strong>
                      <span className="leading-relaxed">{type.specs}</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      <strong className="text-slate-700 font-semibold block mb-0.5">Рекомендуемая сфера применения:</strong>
                      <span className="leading-relaxed">{type.bestFor}</span>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
