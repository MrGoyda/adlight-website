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
  email: "elisey.goyda@gmail.com",
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
    googleSearch: "https://maps.google.com/?q=ул.+Аспара+7,+Астана",
    gisSearch: "https://2gis.kz/astana/search/%D1%83%D0%BB.%20%D0%90%D1%81%D0%BF%D0%B0%D1%80%D0%B0%2C%207"
  }
};

export const SITE_URL = "https://adlight.kz";

export const formatPrice = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export const SITE_PRICES_NUMERIC = {
  letters: {
    'face-lit': 550,
    'full-lit': 850,
    'back-lit': 650,
    'combo-lit': 950,
    'side-lit': 700,
    'perforated': 750,
    'acrylic-slim': 1000,
    'pixel-led': 1000,
    'loft-lamps': 1200,
    'wood-style': 350,
    'day-night-effect': 700,
    'non-lit': 200,
  },
  lightboxes: {
    'acrylic': 80000,
    'banner': 90000,
    'composite': 120000,
    'figured': 80000,
  },
  services: {
    panelBrackets: 45000,
    neon: 8000,
    interior: 45000,
    navigation: 5000,
    bannersPlates: 2500,
    signboardRepair: 15000,
    brandingCars: 45000,
    exhibitionStands: 120000,
    roofInstallations: 0, // проектно
    pylons: 30000,
    facadeDecoration: 18000,
    entranceGroups: 0, // проектно
    windowBranding: 6500,
    ledScreens: 180000,
    architecturalLighting: 250000,
    designCode: 15000,
    
    // Внутренние цены для смет на страницах деталей услуг
    subPrices: {
      dialuxVisual: 50000,
      linearLed1000: 18000,
      mountAltitude: 45000,
      bannerPrint510: 3500,
      rollup85: 18000,
      infoBoard4: 18000,
      windowBackfile: 15000,
      easyBranding: 45000,
      fullGazelle: 120000,
      designDk: 50000,
      akpComposite: 35000,
      portalLed: 450000,
      cozyPipe: 120000,
      exhibitionBuild: 120000,
      promoRack: 35000,
      rentLed25: 45000,
      compAlucobond: 18000,
      winBrand: 45000,
      entranceGroup: 150000,
      windowBrandingMin: 4500,
      lineLedMin: 3500,
      flatAcrylic5: 35000,
      litLogo: 55000,
      steelLetters: 95000,
      screenP5: 280000,
      screenP25: 320000,
      lineRed: 35000,
      ledCabinetP5: 280000,
      ledModuleP25: 18000,
      novastarTb2: 120000,
      platePvc: 2500,
      plateRowmark: 5500,
      pointerAcrylic: 8000,
      bracketDouble: 35000,
      neonMin: 8000,
      neonHeart: 18000,
      roundD50: 45000,
      rect60: 55000,
      figuredLogo: 65000,
      designDkPylon: 100000,
      pylon3m: 180000,
      pylonMegapolis: 850000,
      designKm: 150000,
      pylonRoof: 180000,
      roofLetter15: 850000,
      fermaMount: 450000,
      masterVisit: 5000,
      repairBlock: 15000,
      replaceLed10: 8000,
      printLamin: 6500,
      owvOW: 8500,
      plotterCut: 5000
    }
  }
};

export const SITE_PRICES = {
  volumeLetters: `от ${SITE_PRICES_NUMERIC.letters['face-lit']} ₸/см`,
  volumeLettersBacklit: `от ${SITE_PRICES_NUMERIC.letters['back-lit']} ₸/см`,
  volumeLettersFaceLit: `от ${SITE_PRICES_NUMERIC.letters['face-lit']} ₸/см`,
  volumeLettersCombo: `от ${SITE_PRICES_NUMERIC.letters['combo-lit']} ₸/см`,
  volumeLettersLoft: `от ${SITE_PRICES_NUMERIC.letters['loft-lamps']} ₸/см`,
  lightboxes: `от ${formatPrice(SITE_PRICES_NUMERIC.lightboxes['acrylic'])} ₸/м²`,
  lightboxesComposite: `от ${formatPrice(SITE_PRICES_NUMERIC.lightboxes['composite'])} ₸/м²`,
  neon: `от ${formatPrice(SITE_PRICES_NUMERIC.services.neon)} ₸/пог.м`,
  panelBrackets: `от ${formatPrice(SITE_PRICES_NUMERIC.services.panelBrackets)} ₸`,
  signboardRepair: `от ${formatPrice(SITE_PRICES_NUMERIC.services.signboardRepair)} ₸`,
  brandingCars: `от ${formatPrice(SITE_PRICES_NUMERIC.services.brandingCars)} ₸`,
  pylons: `от ${formatPrice(SITE_PRICES_NUMERIC.services.pylons)} ₸`,
  interiorLogo: `от ${formatPrice(SITE_PRICES_NUMERIC.services.interior)} ₸`,
  ledScreens: `от ${formatPrice(SITE_PRICES_NUMERIC.services.ledScreens)} ₸/м²`,
  architecturalLighting: `от ${formatPrice(SITE_PRICES_NUMERIC.services.architecturalLighting)} ₸`,
  windowBranding: `от ${formatPrice(SITE_PRICES_NUMERIC.services.windowBranding)} ₸/м²`,
  facadeDecoration: `от ${formatPrice(SITE_PRICES_NUMERIC.services.facadeDecoration)} ₸/м²`,
  navigation: `от ${formatPrice(SITE_PRICES_NUMERIC.services.navigation)} ₸`,
  bannersPlates: `от ${formatPrice(SITE_PRICES_NUMERIC.services.bannersPlates)} ₸/м²`,
  exhibitionStands: `от ${formatPrice(SITE_PRICES_NUMERIC.services.exhibitionStands)} ₸`,
  designCode: `от ${formatPrice(SITE_PRICES_NUMERIC.services.designCode)} ₸`
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
    entranceGroups: "/services/entrance-groups",
    windowBranding: "/services/window-branding",
    ledScreens: "/services/led-screens",
    architecturalLighting: "/services/architectural-lighting"
  },
  portfolio: "/portfolio",
  designCode: "/design-code",
  contacts: "/contacts",
  calculator: "/calculator",
  privacy: "/privacy",
  offer: "/offer"
};
