// dictionaries/common.ts

import { SITE_CONTACTS } from "@/config/site";

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
