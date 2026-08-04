'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/tracking';

/**
 * Отслеживает переходы между страницами и отправляет событие page_view
 * на наш серверный трекинг /api/track (GA4 Measurement Protocol + Meta CAPI).
 * Монтируется один раз в RootLayout.
 */
export default function PageViewTracker() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // При первом рендере даём браузеру 100мс инициализироваться,
    // чтобы document.title уже содержал актуальный заголовок страницы
    const delay = isFirstRender.current ? 100 : 0;
    isFirstRender.current = false;

    const timer = setTimeout(() => {
      trackEvent('page_view', {
        page_path: pathname,
        page_title: document.title,
        page_location: window.location.href,
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
