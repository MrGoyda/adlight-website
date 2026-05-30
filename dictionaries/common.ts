// dictionaries/common.ts

import { SITE_CONTACTS, SITE_LINKS } from "@/config/site";

export const COMPANY_NAP = {
  name: SITE_CONTACTS.name,
  owner: SITE_CONTACTS.owner,
  iin: SITE_CONTACTS.iin,
  phone: SITE_CONTACTS.phone,
  phoneRaw: SITE_CONTACTS.phoneRaw,
  email: SITE_CONTACTS.email,
  emailPersonal: SITE_CONTACTS.emailPersonal,
  address: SITE_CONTACTS.address,
  legalAddress: SITE_CONTACTS.legalAddress,
  bankName: "АО «Народный Банк Казахстана»",
  iik: "KZ29601A871003316341",
  bik: "HSBKKZKX",
  locality: SITE_CONTACTS.locality,
  country: "KZ",
  workingHours: SITE_CONTACTS.workingHours,
  coordinates: SITE_CONTACTS.coordinates,
  socials: SITE_CONTACTS.socials
};

export const COMMON_NAV_LINKS = [
  { label: "Главная", href: SITE_LINKS.home },
  { label: "Услуги", href: SITE_LINKS.services.root },
  { label: "Портфолио", href: SITE_LINKS.portfolio },
  { label: "Дизайн-код", href: SITE_LINKS.designCode },
  { label: "Контакты", href: SITE_LINKS.contacts },
  { label: "Калькулятор", href: SITE_LINKS.calculator }
];

export const COMMON_BUTTONS = {
  getQuote: "Узнать стоимость",
  calculateOnline: "Рассчитать онлайн",
  getConsultation: "Получить консультацию",
  sendRequest: "Отправить заявку",
  moreDetails: "Подробнее",
  allWorks: "Все работы"
};

// Единый список 5 основных шагов работы с клиентом для всего сайта (Single Source of Truth)
export const COMMON_STEPS = [
  { step: "01", title: "Заявка", desc: "Фото места и размеры" },
  { step: "02", title: "Макет", desc: "Визуализация на фасаде" },
  { step: "03", title: "Смета", desc: "Прозрачный расчет" },
  { step: "04", title: "Производство", desc: "3-7 дней в цехе" },
  { step: "05", title: "Монтаж", desc: "Установка и подключение" }
];
