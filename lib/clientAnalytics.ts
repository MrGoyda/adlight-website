'use client';

import { trackEvent } from '@/lib/tracking';

declare global {
  interface Window {
    ym?: (counterId: number, action: string, target: string, params?: Record<string, unknown>) => void;
  }
}

const YM_COUNTER_ID = 105671980;

export interface TrackConversionParams {
  page_location?: string;
  form_name?: string;
  [key: string]: unknown;
}

export type EventNameType =
  | 'whatsapp'
  | 'phone'
  | 'lead_form'
  | 'calculator'
  | 'form_header_consultation'
  | 'form_quiz_calculator'
  | 'form_cta_bottom'
  | 'form_calculate_price'
  | 'click_telegram'
  | 'click_instagram'
  | 'click_phone'
  | 'click_whatsapp';

export function trackClientConversion(
  eventName: EventNameType,
  customParams: TrackConversionParams = {}
) {
  if (typeof window === 'undefined') return;

  const page_location = customParams.page_location || window.location.href;
  const payload = {
    page_location,
    ...customParams,
  };

  const ym = window.ym;

  switch (eventName) {
    case 'whatsapp':
    case 'click_whatsapp':
      if (typeof ym === 'function') ym(YM_COUNTER_ID, 'reachGoal', 'click_whatsapp', payload);
      trackEvent('click_whatsapp', {
        event_category: 'Contact',
        event_label: 'WhatsApp Button',
        form_name: customParams.form_name || 'WhatsApp Click',
        value: 1,
        currency: 'KZT',
        ...payload,
      });
      break;

    case 'phone':
    case 'click_phone':
      if (typeof ym === 'function') ym(YM_COUNTER_ID, 'reachGoal', 'click_phone', payload);
      trackEvent('click_phone', {
        event_category: 'Contact',
        event_label: 'Phone Call',
        form_name: customParams.form_name || 'Phone Click',
        ...payload,
      });
      break;

    case 'click_telegram':
      if (typeof ym === 'function') ym(YM_COUNTER_ID, 'reachGoal', 'click_telegram', payload);
      trackEvent('click_telegram', {
        event_category: 'Social',
        event_label: 'Telegram Link',
        form_name: customParams.form_name || 'Telegram Click',
        ...payload,
      });
      break;

    case 'click_instagram':
      if (typeof ym === 'function') ym(YM_COUNTER_ID, 'reachGoal', 'click_instagram', payload);
      trackEvent('click_instagram', {
        event_category: 'Social',
        event_label: 'Instagram Link',
        form_name: customParams.form_name || 'Instagram Click',
        ...payload,
      });
      break;

    case 'form_header_consultation':
    case 'lead_form':
      if (typeof ym === 'function') {
        ym(YM_COUNTER_ID, 'reachGoal', 'lead_form_submit', payload);
        ym(YM_COUNTER_ID, 'reachGoal', 'form_header_consultation', payload);
      }
      trackEvent('form_header_consultation', {
        event_category: 'Form',
        event_label: 'Header Consultation Modal',
        form_name: customParams.form_name || 'Header Consultation Modal',
        value: 1,
        currency: 'KZT',
        ...payload,
      });
      break;

    case 'form_quiz_calculator':
      if (typeof ym === 'function') {
        ym(YM_COUNTER_ID, 'reachGoal', 'calculator_submit', payload);
        ym(YM_COUNTER_ID, 'reachGoal', 'form_quiz_calculator', payload);
      }
      trackEvent('form_quiz_calculator', {
        event_category: 'Quiz',
        event_label: 'Quiz Calculator',
        form_name: customParams.form_name || 'Quiz Calculator',
        value: 1,
        currency: 'KZT',
        ...payload,
      });
      break;

    case 'form_cta_bottom':
      if (typeof ym === 'function') {
        ym(YM_COUNTER_ID, 'reachGoal', 'lead_form_submit', payload);
        ym(YM_COUNTER_ID, 'reachGoal', 'form_cta_bottom', payload);
      }
      trackEvent('form_cta_bottom', {
        event_category: 'Form',
        event_label: 'Bottom CTA Form',
        form_name: customParams.form_name || 'Bottom CTA Form',
        value: 1,
        currency: 'KZT',
        ...payload,
      });
      break;

    case 'form_calculate_price':
    case 'calculator':
      if (typeof ym === 'function') {
        ym(YM_COUNTER_ID, 'reachGoal', 'calculator_submit', payload);
        ym(YM_COUNTER_ID, 'reachGoal', 'form_calculate_price', payload);
      }
      trackEvent('form_calculate_price', {
        event_category: 'Calculator',
        event_label: 'Price Calculation Modal',
        form_name: customParams.form_name || 'Price Calculation Modal',
        value: 1,
        currency: 'KZT',
        ...payload,
      });
      break;

    default:
      if (typeof ym === 'function') ym(YM_COUNTER_ID, 'reachGoal', eventName, payload);
      trackEvent(eventName, payload);
      break;
  }
}

