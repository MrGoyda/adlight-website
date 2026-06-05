const fs = require('fs');
const path = require('path');

const detailsDir = path.join(__dirname, '../dictionaries/services/details');
const files = fs.readdirSync(detailsDir).filter(f => f.endsWith('.ts'));

// Карта сопоставления слагов и цен
const mapping = {
  "architectural-lighting": {
    price: "SITE_PRICES_NUMERIC.services.architecturalLighting",
    subs: {
      "50000": "SITE_PRICES_NUMERIC.services.subPrices.dialuxVisual",
      "18000": "SITE_PRICES_NUMERIC.services.subPrices.linearLed1000",
      "45000": "SITE_PRICES_NUMERIC.services.subPrices.mountAltitude"
    },
    items: {
      "от 50 000 ₸ (бесплатно при заказе монтажа)": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.dialuxVisual)} ₸ (бесплатно при заказе монтажа)`",
      "от 18 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.linearLed1000)} ₸`"
    }
  },
  "banners-plates": {
    price: "SITE_PRICES_NUMERIC.services.bannersPlates",
    subs: {
      "3500": "SITE_PRICES_NUMERIC.services.subPrices.bannerPrint510",
      "18000": "SITE_PRICES_NUMERIC.services.subPrices.rollup85"
    },
    items: {
      "от 2 500 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.bannersPlates)} ₸`",
      "от 3 500 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.bannerPrint510)} ₸`",
      "от 18 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.rollup85)} ₸`"
    }
  },
  "branding-cars": {
    price: "SITE_PRICES_NUMERIC.services.brandingCars",
    subs: {
      "15000": "SITE_PRICES_NUMERIC.services.subPrices.windowBackfile",
      "45000": "SITE_PRICES_NUMERIC.services.subPrices.easyBranding",
      "120000": "SITE_PRICES_NUMERIC.services.subPrices.fullGazelle"
    },
    items: {
      "от 15 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.windowBackfile)} ₸`",
      "от 45 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.easyBranding)} ₸`",
      "от 120 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.fullGazelle)} ₸`"
    }
  },
  "entrance-groups": {
    price: null, // Проектно
    subs: {
      "50000": "SITE_PRICES_NUMERIC.services.subPrices.designDk",
      "35000": "SITE_PRICES_NUMERIC.services.subPrices.akpComposite",
      "450000": "SITE_PRICES_NUMERIC.services.subPrices.portalLed"
    },
    items: {
      "от 50 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.designDk)} ₸`",
      "от 35 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.akpComposite)} ₸`",
      "от 120 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.cozyPipe)} ₸`"
    }
  },
  "exhibition-stands": {
    price: "SITE_PRICES_NUMERIC.services.exhibitionStands",
    subs: {
      "120000": "SITE_PRICES_NUMERIC.services.subPrices.exhibitionBuild",
      "35000": "SITE_PRICES_NUMERIC.services.subPrices.promoRack",
      "45000": "SITE_PRICES_NUMERIC.services.subPrices.rentLed25"
    },
    items: {
      "от 35 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.promoRack)} ₸`",
      "от 120 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.exhibitionBuild)} ₸`"
    }
  },
  "facade-decoration": {
    price: "SITE_PRICES_NUMERIC.services.facadeDecoration",
    subs: {
      "18000": "SITE_PRICES_NUMERIC.services.subPrices.compAlucobond",
      "45000": "SITE_PRICES_NUMERIC.services.subPrices.winBrand",
      "150000": "SITE_PRICES_NUMERIC.services.subPrices.entranceGroup"
    },
    items: {
      "от 18 000 ₸ / м²": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.compAlucobond)} ₸ / м²`",
      "от 4 550 ₸ / м²": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.windowBrandingMin)} ₸ / м²`",
      "от 4 500 ₸ / м²": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.windowBrandingMin)} ₸ / м²`",
      "от 150 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.entranceGroup)} ₸`",
      "от 3 500 ₸ / п.м": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.lineLedMin)} ₸ / п.м`"
    }
  },
  "interior": {
    price: "SITE_PRICES_NUMERIC.services.interior",
    subs: {},
    items: {
      "от 35 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.flatAcrylic5)} ₸`",
      "от 55 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.litLogo)} ₸`",
      "от 95 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.steelLetters)} ₸`"
    }
  },
  "led-screens": {
    price: "SITE_PRICES_NUMERIC.services.ledScreens",
    subs: {
      "280000": "SITE_PRICES_NUMERIC.services.subPrices.ledCabinetP5",
      "18000": "SITE_PRICES_NUMERIC.services.subPrices.ledModuleP25",
      "120000": "SITE_PRICES_NUMERIC.services.subPrices.novastarTb2"
    },
    items: {
      "от 280 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.screenP5)} ₸`",
      "от 320 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.screenP25)} ₸`",
      "от 35 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.lineRed)} ₸`"
    }
  },
  "lightboxes": {
    price: "SITE_PRICES_NUMERIC.services.lightboxes",
    subs: {
      "80000": "SITE_PRICES_NUMERIC.services.subPrices.acrylic",
      "90000": "SITE_PRICES_NUMERIC.services.subPrices.banner",
      "120000": "SITE_PRICES_NUMERIC.services.subPrices.composite"
    },
    items: {
      "от 80 000 ₸ / м²": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.acrylic)} ₸ / м²`",
      "от 90 000 ₸ / м²": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.banner)} ₸ / м²`",
      "от 120 000 ₸ / м²": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.composite)} ₸ / м²`"
    }
  },
  "navigation": {
    price: "SITE_PRICES_NUMERIC.services.navigation",
    subs: {
      "5500": "SITE_PRICES_NUMERIC.services.subPrices.plateRowmark"
    },
    items: {
      "от 2 500 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.platePvc)} ₸`",
      "от 5 500 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.plateRowmark)} ₸`",
      "от 8 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.pointerAcrylic)} ₸`"
    }
  },
  "neon": {
    price: "SITE_PRICES_NUMERIC.services.neon",
    subs: {},
    items: {
      "от 8 000 ₸ / пог.м": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.neonMin)} ₸ / пог.м`"
    }
  },
  "panel-brackets": {
    price: "SITE_PRICES_NUMERIC.services.panelBrackets",
    subs: {
      "45000": "SITE_PRICES_NUMERIC.services.subPrices.roundD50",
      "55000": "SITE_PRICES_NUMERIC.services.subPrices.rect60",
      "65000": "SITE_PRICES_NUMERIC.services.subPrices.figuredLogo"
    },
    items: {
      "от 45 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.roundD50)} ₸`",
      "от 55 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.rect60)} ₸`",
      "от 65 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.figuredLogo)} ₸`"
    }
  },
  "pylons": {
    price: "SITE_PRICES_NUMERIC.services.pylons",
    subs: {
      "100000": "SITE_PRICES_NUMERIC.services.subPrices.designDkPylon",
      "180000": "SITE_PRICES_NUMERIC.services.subPrices.pylon3m",
      "850000": "SITE_PRICES_NUMERIC.services.subPrices.pylonMegapolis"
    },
    items: {
      "от 100 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.designDkPylon)} ₸`",
      "от 180 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.pylon3m)} ₸`",
      "от 850 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.pylonMegapolis)} ₸`"
    }
  },
  "roof-installations": {
    price: null,
    subs: {
      "150000": "SITE_PRICES_NUMERIC.services.subPrices.designKm",
      "850000": "SITE_PRICES_NUMERIC.services.subPrices.roofLetter15",
      "450000": "SITE_PRICES_NUMERIC.services.subPrices.fermaMount"
    },
    items: {
      "от 150 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.designKm)} ₸`",
      "от 180 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.pylonRoof)} ₸`",
      "от 850 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.roofLetter15)} ₸`"
    }
  },
  "signboard-repair": {
    price: "SITE_PRICES_NUMERIC.services.signboardRepair",
    subs: {
      "5000": "SITE_PRICES_NUMERIC.services.subPrices.masterVisit",
      "15000": "SITE_PRICES_NUMERIC.services.subPrices.repairBlock",
      "8000": "SITE_PRICES_NUMERIC.services.subPrices.replaceLed10"
    },
    items: {
      "от 5 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.masterVisit)} ₸`",
      "от 15 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.repairBlock)} ₸`",
      "от 8 000 ₸": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.replaceLed10)} ₸`"
    }
  },
  "window-branding": {
    price: "SITE_PRICES_NUMERIC.services.windowBranding",
    subs: {},
    items: {
      "от 6 500 ₸ / м²": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.printLamin)} ₸ / м²`",
      "от 8 500 ₸ / м²": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.owvOW)} ₸ / м²`",
      "от 5 000 ₸ / м²": "`от ${formatPrice(SITE_PRICES_NUMERIC.services.subPrices.plotterCut)} ₸ / м²`"
    }
  }
};

files.forEach(file => {
  const filePath = path.join(detailsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const slug = file.replace('.ts', '');
  const cfg = mapping[slug];
  
  if (!cfg) return;
  
  // Добавляем импорт
  if (!content.includes('SITE_PRICES_NUMERIC')) {
    content = 'import { SITE_PRICES_NUMERIC, formatPrice } from "../../../config/site";\n' + content;
  }
  
  // 1. Замена базовой цены
  if (cfg.price) {
    // Находим price: "X X"
    content = content.replace(/price:\s*"[^"]+"/, `price: formatPrice(${cfg.price})`);
  }
  
  // 2. Замена pricingItems
  if (cfg.items) {
    Object.keys(cfg.items).forEach(val => {
      content = content.replaceAll(`value: "${val}"`, `value: ${cfg.items[val]}`);
    });
  }
  
  // 3. Замена subOffers
  if (cfg.subs) {
    Object.keys(cfg.subs).forEach(val => {
      // Ищем price: "X" в контексте subOffers
      // Регулярка для замены именно строки с этим числом
      const regex = new RegExp(`price:\\s*"${val}"`, 'g');
      content = content.replace(regex, `price: String(${cfg.subs[val]})`);
    });
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Migrated: ${file}`);
});
