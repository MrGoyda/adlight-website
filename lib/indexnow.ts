export const INDEXNOW_KEY = 'adlight2026indexnowkey00000001';
export const HOST_DOMAIN = 'adlight.kz';

export interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation?: string;
  urlList: string[];
}

/**
 * Отправляет список обновленных или новых URL в единую сеть IndexNow (Bing, Yandex, Seznam, Naver).
 */
export async function submitToIndexNow(urlList: string[]) {
  if (!urlList || urlList.length === 0) {
    return { success: false, message: 'Список URL пуст' };
  }

  // Приводим все ссылки к полному виду https://adlight.kz/...
  const fullUrls = urlList.map((url) => {
    if (url.startsWith('http')) return url;
    return `https://${HOST_DOMAIN}${url.startsWith('/') ? '' : '/'}${url}`;
  });

  const payload: IndexNowPayload = {
    host: HOST_DOMAIN,
    key: INDEXNOW_KEY,
    keyLocation: `https://${HOST_DOMAIN}/${INDEXNOW_KEY}.txt`,
    urlList: fullUrls,
  };

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 202) {
      console.log(`✅ [IndexNow] Успешно отправлено ${fullUrls.length} URL в Bing & Yandex.`);
      return { success: true, count: fullUrls.length, urls: fullUrls };
    } else {
      console.warn(`⚠️ [IndexNow] Ответ сервера: ${response.status} ${response.statusText}`);
      return { success: false, status: response.status, statusText: response.statusText };
    }
  } catch (error: any) {
    console.error('❌ [IndexNow] Ошибка сети при отправке:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Отправка одиночного URL через легкий HTTP GET запрос с параметром keyLocation
 */
export async function submitSingleUrlGET(url: string) {
  const fullUrl = url.startsWith('http') ? url : `https://${HOST_DOMAIN}${url.startsWith('/') ? '' : '/'}${url}`;
  const keyLocation = `https://${HOST_DOMAIN}/${INDEXNOW_KEY}.txt`;
  
  const pingUrl = `https://www.bing.com/indexnow?url=${encodeURIComponent(fullUrl)}&key=${INDEXNOW_KEY}&keyLocation=${encodeURIComponent(keyLocation)}`;

  try {
    const response = await fetch(pingUrl, { method: 'GET' });
    if (response.ok || response.status === 202) {
      console.log(`✅ [IndexNow GET] Страница ${fullUrl} успешно отправлена.`);
      return { success: true, url: fullUrl };
    } else {
      console.warn(`⚠️ [IndexNow GET] Ответ сервера: ${response.status}`);
      return { success: false, status: response.status };
    }
  } catch (error: any) {
    console.error('❌ [IndexNow GET] Ошибка:', error.message);
    return { success: false, error: error.message };
  }
}
