/**
 * config/site.ts
 * Глобальный Единый Источник Правды (Single Source of Truth) для всего сайта ADLight.
 * Содержит контакты, цены, ссылки на соцсети и карту, чтобы переиспользовать их везде.
 */

export const SITE_CONTACTS = {
  name: "ADLight",
  owner: "ИП Гойденко Е.И.",
  iin: "940222351384",
  phone: "+7 (707) 135-67-01",
  phoneRaw: "+77071356701",
  email: "info@adlight.kz",
  emailPersonal: "elisey.goyda@gmail.com",
  address: "ул. Аспара 7, г. Астана",
  legalAddress: "Республика Казахстан, г. Астана, ул. Сыганак, д. 10, кв. 177",
  locality: "Астана",
  country: "Казахстан",
  workingHours: "Пн-Сб: 9:00 - 18:00, Вс: выходной",
  coordinates: {
    latitude: 51.185,
    longitude: 71.495
  },
  socials: {
    instagram: "https://www.instagram.com/adlight.kz/",
    telegram: "https://t.me/EliseyGoidenko",
    whatsapp: "https://wa.me/77071356701"
  },
  maps: {
    yandexWidget: "https://yandex.ru/map-widget/v1/?text=Астана+Аспара+7&z=16",
    yandexSearch: "https://yandex.kz/maps/?text=Астана+ул.+Аспара+7",
    googleSearch: "https://maps.google.com/?q=ул.+Аспара+7,+Астана"
  }
};

export const SITE_PRICES = {
  volumeLetters: "от 550 ₸/см",
  volumeLettersBacklit: "от 650 ₸/см",
  volumeLettersFaceLit: "от 550 ₸/см",
  volumeLettersCombo: "от 800 ₸/см",
  volumeLettersLoft: "от 1200 ₸/см",
  lightboxes: "от 80 000 ₸/м²",
  lightboxesComposite: "от 95 000 ₸/м²",
  neon: "от 15 000 ₸",
  panelBrackets: "от 35 000 ₸",
  signboardRepair: "от 15 000 ₸",
  brandingCars: "от 30 000 ₸",
  pylons: "от 250 000 ₸",
  interiorLogo: "от 25 000 ₸"
};

export const SITE_LINKS = {
  home: "/",
  services: {
    root: "/services",
    volumeLetters: "/services/volume-letters",
    volumeLettersFaceLit: "/services/volume-letters/face-lit",
    volumeLettersBackLit: "/services/volume-letters/back-lit",
    volumeLettersCombo: "/services/volume-letters/combo-lit",
    volumeLettersLoft: "/services/volume-letters/loft-lamps",
    volumeLettersWood: "/services/volume-letters/wood-style",
    lightboxes: "/services/lightboxes",
    neon: "/services/neon",
    interior: "/services/interior",
    navigation: "/services/navigation",
    bannersPlates: "/services/banners-plates",
    signboardRepair: "/services/signboard-repair",
    brandingCars: "/services/branding-cars",
    exhibitionStands: "/services/exhibition-stands",
    roofInstallations: "/services/roof-installations",
    pylons: "/services/pylons",
    panelBrackets: "/services/panel-brackets",
    facadeDecoration: "/services/facade-decoration",
    entranceGroups: "/services/entrance-groups"
  },
  portfolio: "/portfolio",
  designCode: "/design-code",
  contacts: "/contacts",
  calculator: "/calculator"
};
