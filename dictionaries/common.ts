// dictionaries/common.ts

export const COMPANY_NAP = {
  name: "ADLight",
  owner: "ИП Гойденко Е.И.",
  iin: "940222351384",
  phone: "+7 (707) 135-67-01",
  phoneRaw: "+77071356701",
  email: "info@adlight.kz",
  emailPersonal: "elisey.goyda@gmail.com",
  address: "г. Астана, ул. Аспара 7",
  legalAddress: "Республика Казахстан, г. Астана, ул. Сыганак, д. 10, кв. 177",
  bankName: "АО «Народный Банк Казахстана»",
  iik: "KZ29601A871003316341",
  bik: "HSBKKZKX",
  locality: "Астана",
  country: "KZ",
  workingHours: "Пн-Сб: 9:00 - 18:00, Вс: выходной",
  coordinates: {
    latitude: 51.185,
    longitude: 71.495
  },
  socials: {
    instagram: "https://www.instagram.com/adlight.kz/",
    telegram: "https://t.me/EliseyGoidenko",
    whatsapp: "https://wa.me/77071356701"
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
