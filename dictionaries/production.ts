// dictionaries/production.ts

export interface ProductionDetailItem {
  iconName: string;
  title: string;
  desc: string;
  color: string;
}

export const PRODUCTION_DETAILS: ProductionDetailItem[] = [
  {
    iconName: "Settings",
    title: "Парк станков ЧПУ",
    desc: "Высокоточные лазерные раскройщики, профессиональные фрезерные станки ЧПУ и автоматические бортогибы для изготовления безупречных буквенных профилей.",
    color: "text-orange-600 bg-orange-50 border-orange-100",
  },
  {
    iconName: "Printer",
    title: "Печатный комплекс",
    desc: "Сольвентная и экосольвентная печать, УФ-планшетный и УФ-рулонный принтеры премиум-класса, а также инновационный комплекс УФ-DTF печати.",
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    iconName: "Users",
    title: "Штат из 15 экспертов",
    desc: "Квалифицированные архитекторы для согласования, креативные дизайнеры, опытные сборщики-макетчики и сертифицированные монтажные бригады.",
    color: "text-purple-600 bg-purple-50 border-purple-100",
  },
  {
    iconName: "Maximize2",
    title: "Масштабная площадь",
    desc: "Собственная оборудованная производственная площадка с выделенными зонами сборки, сварки, покраски и тестирования светодиодной электрики.",
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  }
];
