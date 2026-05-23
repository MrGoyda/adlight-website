---
name: ui-ux-architect
description: Архитектура UI/UX уровня PWA и нативных iOS-приложений. Воспринимаемая производительность, виртуализация, жесты и тактильный отклик.
---

# 🪄 UI/UX Architect & Perceived Performance

Этот скилл переводит проект с уровня "веб-сайт" на уровень "нативное iOS-приложение" (PWA элитного качества) для сложных ERP и премиум-каталогов.

## 1. Тотальная Виртуализация (ERP Data Render)
Запрещено рендерить списки или таблицы, содержащие более 50 элементов, через обычный `.map()`.
- **Использование TanStack Virtual:** Для длинных списков всегда использовать `@tanstack/react-virtual`.
- **Изоляция:** Анимировать с помощью Framer Motion только видимые в окне элементы.
- **Бесконечный скролл:** Совмещать виртуализацию с Next.js Server Actions или `useSWRInfinite` для подгрузки данных "на лету" без блокировки Main Thread.

## 2. Упреждающая загрузка (Intent-based Prefetching)
Истинная скорость интерфейса — это когда данные уже загружены до того, как пользователь кликнул на кнопку.
- **Hover-фетчинг:** В таблицах или меню добавлять `onMouseEnter` обработчик, который вызывает запрос данных (Prefetch Query) или прогревает кэш Next.js (`router.prefetch()`).
- **Smart Links:** Для критических путей использовать ручной `router.prefetch()` при наведении.

## 3. Нативная физика скролла и жестов (Native Mobile Feel)
Интерфейс должен вести себя как скомпилированное приложение Swift.
- **Overscroll Behavior:** Для `body` отключить пружинный скролл `overscroll-none`. Для скроллируемых контейнеров применять `overscroll-contain`.
- **Скрытие Scrollbar:** Для контейнеров скрывать ползунок: `className="scrollbar-hide overflow-y-auto -webkit-overflow-scrolling-touch"`.
- **Swipe-to-Dismiss:** Все модальные окна, шторки (Drawers) и уведомления должны поддерживать закрытие свайпом. Использовать `PanInfo` (Framer Motion) или библиотеку Vaul.

## 4. Тактильный отклик (Web Haptics)
Для критических действий внедрять микровибрации.
- **Утилита Haptics:** Использовать API `navigator.vibrate` в утилитной функции:
  ```typescript
  export const triggerHaptic = (type: 'light' | 'heavy' | 'success' | 'error') => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      const patterns = { light: [10], heavy: [20], success: [10, 50, 10], error: [50, 100, 50] };
      navigator.vibrate(patterns[type]);
    }
  }
  ```
- **Применение:** Вызывать `light` при переключении табов, `heavy` при удалении элемента, `success` при успешном сабмите.

## 5. Приоритизация LCP и маскировка загрузки изображений (Image Strategy)
Размытые заглушки — визитная карточка эстетики премиальных продуктов. Никаких "прыгающих" картинок.
- **Blur Data URL:** При загрузке изображений из БД всегда генерировать микро-копию (Base64) и передавать в `blurDataURL` компонента `next/image`.
- **LCP Priority:** Самое большое изображение на первом экране (Hero Image) обязано иметь проп `priority`. Все остальные — строго `loading="lazy"`.
- **Object Fit Safety:** Контейнер изображения обязан иметь `relative` и `aspect-ratio`, а само изображение — `fill` и `object-cover`.
