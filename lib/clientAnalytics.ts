"use client";

// Единая утилита отслеживания клиентских конверсий для Google Ads, Яндекс Метрики и Facebook Pixel

export function trackClientConversion(eventName: 'whatsapp' | 'phone' | 'lead_form' | 'calculator') {
  if (typeof window === "undefined") return;

  const ym = (window as any).ym;
  const gtag = (window as any).gtag;
  const fbq = (window as any).fbq;

  switch (eventName) {
    case 'whatsapp':
      // 1. Яндекс Метрика
      if (typeof ym !== "undefined") ym(105671980, 'reachGoal', 'click_whatsapp');
      // 2. Google Ads / GA4
      if (typeof gtag !== "undefined") {
        gtag('event', 'click_whatsapp', {
          event_category: 'Contact',
          event_label: 'WhatsApp Button'
        });
        gtag('event', 'conversion', { send_to: 'AW-17806280695' });
      }
      // 3. Meta Pixel
      if (typeof fbq !== "undefined") fbq('track', 'Contact');
      break;

    case 'phone':
      if (typeof ym !== "undefined") ym(105671980, 'reachGoal', 'click_phone');
      if (typeof gtag !== "undefined") {
        gtag('event', 'click_phone', {
          event_category: 'Contact',
          event_label: 'Phone Call'
        });
      }
      if (typeof fbq !== "undefined") fbq('track', 'Contact');
      break;

    case 'lead_form':
      if (typeof ym !== "undefined") ym(105671980, 'reachGoal', 'lead_form_submit');
      if (typeof gtag !== "undefined") {
        gtag('event', 'generate_lead', {
          event_category: 'Form',
          event_label: 'Consultation Modal'
        });
        gtag('event', 'conversion', { send_to: 'AW-17806280695' });
      }
      if (typeof fbq !== "undefined") fbq('track', 'Lead');
      break;

    case 'calculator':
      if (typeof ym !== "undefined") ym(105671980, 'reachGoal', 'calculator_submit');
      if (typeof gtag !== "undefined") {
        gtag('event', 'generate_lead', {
          event_category: 'Calculator',
          event_label: 'Price Calculation'
        });
      }
      if (typeof fbq !== "undefined") fbq('track', 'Lead');
      break;
  }
}
