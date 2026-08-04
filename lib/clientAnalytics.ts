'use client';

import { trackEvent } from '@/lib/tracking';

// ─── Единая утилита конверсий ──────────────────────────────────────────────────
// Все события идут через /api/track → GA4 Measurement Protocol + Meta CAPI.
// Яндекс Метрика вызывается напрямую (браузерный скрипт, серверного API нет).

export function trackClientConversion(
  eventName: 'whatsapp' | 'phone' | 'lead_form' | 'calculator'
) {
  if (typeof window === 'undefined') return;

  const ym = (window as Window & { ym?: (...args: unknown[]) => void }).ym;

  switch (eventName) {
    case 'whatsapp':
      // Яндекс Метрика остаётся браузерной (серверного варианта нет)
      if (typeof ym === 'function') ym(105671980, 'reachGoal', 'click_whatsapp');
      // GA4 + Meta → через наш Edge сервер
      trackEvent('click_whatsapp', {
        event_category: 'Contact',
        event_label: 'WhatsApp Button',
        value: 1,
        currency: 'KZT',
      });
      break;

    case 'phone':
      if (typeof ym === 'function') ym(105671980, 'reachGoal', 'click_phone');
      trackEvent('click_phone', {
        event_category: 'Contact',
        event_label: 'Phone Call',
      });
      break;

    case 'lead_form':
      if (typeof ym === 'function') ym(105671980, 'reachGoal', 'lead_form_submit');
      trackEvent('generate_lead', {
        event_category: 'Form',
        event_label: 'Consultation Modal',
        value: 1,
        currency: 'KZT',
      });
      break;

    case 'calculator':
      if (typeof ym === 'function') ym(105671980, 'reachGoal', 'calculator_submit');
      trackEvent('generate_lead', {
        event_category: 'Calculator',
        event_label: 'Price Calculation',
      });
      break;
  }
}
