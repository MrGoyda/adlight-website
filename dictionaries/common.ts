// dictionaries/common.ts

export const COMPANY_NAP = {
  name: "ADLight",
  owner: "ИП Гойденко Е.И.",
  phone: "+7 (707) 123-45-67", // Будет обновляться на реальный
  phoneRaw: "+77071234567",
  email: "info@adlight.kz",
  address: "г. Астана, ул. Аспара 7",
  locality: "Астана",
  country: "KZ",
  workingHours: "Пн-Сб: 9:00 - 18:00, Вс: выходной",
  coordinates: {
    latitude: 51.1605, // Примерные координаты
    longitude: 71.4704
  }
};

export const COMMON_NAV_LINKS = [
  { label: "Главная", href: "/" },
  { label: "Услуги", href: "/services" },
  { label: "Портфолио", href: "/portfolio" },
  { label: "Дизайн-код", href: "/design-code" },
  { label: "Контакты", href: "/contacts" },
  { label: "Калькулятор", href: "/calculator" }
];

export const COMMON_BUTTONS = {
  getQuote: "Узнать стоимость",
  calculateOnline: "Рассчитать онлайн",
  getConsultation: "Получить консультацию",
  sendRequest: "Отправить заявку",
  moreDetails: "Подробнее",
  allWorks: "Все работы"
};
