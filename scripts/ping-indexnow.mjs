const INDEXNOW_KEY = 'adlight2026indexnowkey00000001';
const HOST_DOMAIN = 'adlight.kz';

const keyPages = [
  'https://adlight.kz/',
  'https://adlight.kz/services',
  'https://adlight.kz/portfolio',
  'https://adlight.kz/design-code',
  'https://adlight.kz/calculator',
  'https://adlight.kz/contacts',
  'https://adlight.kz/services/volume-letters',
  'https://adlight.kz/services/lightboxes',
  'https://adlight.kz/services/neon',
  'https://adlight.kz/services/panel-brackets',
  'https://adlight.kz/services/roof-installations',
];

async function pingIndexNow() {
  console.log('🚀 [IndexNow] Отправка ключевых страниц сайта в Bing & Яндекс...');

  const payload = {
    host: HOST_DOMAIN,
    key: INDEXNOW_KEY,
    keyLocation: `https://${HOST_DOMAIN}/${INDEXNOW_KEY}.txt`,
    urlList: keyPages,
  };

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    if (res.ok || res.status === 202) {
      console.log(`✅ [IndexNow] Успешно отправлено ${keyPages.length} ключевых страниц в сеть IndexNow (Bing & Yandex)!`);
    } else {
      console.log(`⚠️ [IndexNow] Статус ответа: ${res.status}`);
    }
  } catch (err) {
    console.error('❌ [IndexNow] Ошибка:', err.message);
  }
}

pingIndexNow();
