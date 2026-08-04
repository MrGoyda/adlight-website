const INDEXNOW_KEY = 'adlight2026indexnowkey00000001';
const HOST_DOMAIN = 'adlight.kz';

// 1. Статические разделы
const staticPages = [
  'https://adlight.kz/',
  'https://adlight.kz/services',
  'https://adlight.kz/portfolio',
  'https://adlight.kz/design-code',
  'https://adlight.kz/calculator',
  'https://adlight.kz/contacts',
  'https://adlight.kz/privacy',
  'https://adlight.kz/offer',
  'https://adlight.kz/services/volume-letters',
];

// 2. Все 16 категорий услуг
const serviceSlugs = [
  'panel-brackets',
  'neon',
  'interior',
  'navigation',
  'roof-installations',
  'pylons',
  'entrance-groups',
  'facade-decoration',
  'branding-cars',
  'signboard-repair',
  'exhibition-stands',
  'window-branding',
  'led-screens',
  'architectural-lighting',
  'banners-plates',
  'lightboxes',
];
const servicePages = serviceSlugs.map((slug) => `https://adlight.kz/services/${slug}`);

// 3. Подкатегории объема букв
const volumeLetterSlugs = [
  'face-lit',
  'full-lit',
  'back-lit',
  'combo-lit',
  'side-lit',
  'perforated',
  'acrylic-slim',
  'loft-lamps',
  'pixel-led',
  'wood-style',
  'non-lit',
  'day-night-effect',
];
const volumeLetterPages = volumeLetterSlugs.map((slug) => `https://adlight.kz/services/volume-letters/${slug}`);

// 4. Реальные кейсы портфолио
const portfolioSlugs = [
  'family-care-sign',
  'arustone-sign',
  'dks-roof-sign',
  'aigelova-beauty-neon',
  'kmg-interior-sign',
];
const portfolioPages = portfolioSlugs.map((slug) => `https://adlight.kz/portfolio/${slug}`);

// Объединяем ВСЕ страницы сайта в единый список
const allSitePages = Array.from(
  new Set([
    ...staticPages,
    ...servicePages,
    ...volumeLetterPages,
    ...portfolioPages,
  ])
);

async function pingAllPagesIndexNow() {
  console.log(`🚀 [IndexNow] Начинаем отправку ВСЕХ ${allSitePages.length} страниц сайта в Bing & Яндекс...`);

  const payload = {
    host: HOST_DOMAIN,
    key: INDEXNOW_KEY,
    keyLocation: `https://${HOST_DOMAIN}/${INDEXNOW_KEY}.txt`,
    urlList: allSitePages,
  };

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    if (res.ok || res.status === 202) {
      console.log(`✅ [IndexNow] УСПЕШНО! Все ${allSitePages.length} страниц сайта отправлены в сеть IndexNow (Bing + Yandex)!`);
    } else {
      console.warn(`⚠️ [IndexNow] Ответ сервера: ${res.status}`);
    }
  } catch (err) {
    console.error('❌ [IndexNow] Ошибка:', err.message);
  }
}

pingAllPagesIndexNow();
