"use client";

import { useEffect, Suspense } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";

// 1. Выносим логику, использующую useSearchParams, в отдельный компонент
function YandexMetricaLogic() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const ym = (window as any).ym;
    if (typeof ym !== "undefined") {
      // Собираем полный URL для метрики
      const url = window.location.origin + pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
      // ЗАМЕНИТЕ 99999999 НА ВАШ ID СЧЕТЧИКА
      ym(105671980, "hit", url);
    }
  }, [pathname, searchParams]);

  return null;
}

// 2. Экспортируем основной компонент с оберткой Suspense
export default function YandexMetrica() {
  return (
    <>
      {/* Скрипт инициализации (загружается всегда) */}
      <Script id="yandex-metrica" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

          // ЗАМЕНИТЕ 99999999 НА ВАШ ID СЧЕТЧИКА НИЖЕ
          ym(105671980, "init", { 
               clickmap:true,
               trackLinks:true,
               accurateTrackBounce:true,
               webvisor:true
          });
        `}
      </Script>

      {/* Логика отслеживания переходов (обернута в Suspense для защиты билда) */}
      <Suspense fallback={null}>
        <YandexMetricaLogic />
      </Suspense>
    </>
  );
}