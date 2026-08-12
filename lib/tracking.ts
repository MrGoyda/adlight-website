'use client';

// ─── Client ID ────────────────────────────────────────────────────────────────
// Генерируем/читаем постоянный UUID для пользователя (аналог куки _ga в GA4)

const CLIENT_ID_KEY = 'adlight_cid';

export const getClientId = (): string => {
  if (typeof window === 'undefined') return '';
  try {
    let cid = localStorage.getItem(CLIENT_ID_KEY);
    if (!cid) {
      cid = crypto.randomUUID();
      localStorage.setItem(CLIENT_ID_KEY, cid);
    }
    return cid;
  } catch {
    // Safari Private Mode блокирует localStorage
    return crypto.randomUUID();
  }
};

// ─── Читаем куку _fbp (если Meta Pixel был ранее) ─────────────────────────────
const getFbp = (): string => {
  if (typeof document === 'undefined') return '';
  try {
    const match = document.cookie.match(/(?:^|;\s*)_fbp=([^;]+)/);
    return match ? match[1] : '';
  } catch {
    return '';
  }
};

// ─── Основная утилита ─────────────────────────────────────────────────────────

export const trackEvent = (
  eventName: string,
  eventData: Record<string, unknown> = {}
): void => {
  if (typeof window === 'undefined') return;

  // Обогащаем данными UTM-меток из sessionStorage (собирает AnalyticsTracker)
  const utm: Record<string, string> = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => {
    const v = sessionStorage.getItem(k);
    if (v) utm[k] = v;
  });

  const payload = {
    eventName,
    eventData: { ...eventData, ...utm },
    clientId: getClientId(),
    fbp: getFbp(),
  };

  // 1. Клиентская отправка через gtag.js (чтобы клик мгновенно виден в GA4 DebugView)
  try {
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', eventName, {
        ...eventData,
        ...utm,
        debug_mode: true,
      });
    }
  } catch (e) {
    // Игнорируем блокировки AdBlock
  }

  // 2. Серверная непреложная отправка через /api/track (Vercel Edge)
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
};
