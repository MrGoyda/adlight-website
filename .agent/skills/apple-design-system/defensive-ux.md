---
name: defensive-ux
description: Защитный дизайн (Defensive UX), Zero CLS, фиксы для iOS Safari и предотвращение багов на мобильных устройствах.
---

# 🛡 Defensive UX & iOS Safari Fixes

## 📱 Mobile WebKit & Safari Fixes (Anti-Bug)
Для идеальной работы на iPhone (iOS Safari) строго соблюдать следующие правила:

1. **Динамический Viewport:** Запрещено использовать `h-screen` (100vh), так как он не учитывает адресную строку Safari. Всегда использовать `h-dvh` (100dvh - dynamic viewport height).
2. **Safe Areas (Чёлка и нижняя полоса):** Всегда добавлять системные отступы для элементов, прижатых к краям экрана (особенно фиксированные кнопки внизу):
   `className="pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]"`
3. **Залипание Hover (Sticky Hover Bug):** На тач-экранах `hover` состояние часто "залипает" после касания. 
   **Решение:** В `tailwind.config.ts` обязательно включить:
   ```typescript
   future: {
     hoverOnlyWhenSupported: true, // Отключает hover-эффекты на тач-устройствах
   }
   ```
4. **Случайное выделение (Tap Highlight):**
   - Для всех кнопок, карточек и кастомных табов отключать выделение текста при быстрых тапах: `select-none`.
   - Убирать синюю вспышку при тапе на iOS: `.tap-highlight-transparent { -webkit-tap-highlight-color: transparent; }`

## 📐 Стабильность Layout (Zero CLS Policy)
Интерфейс не должен "прыгать" при загрузке.

1. **Защита шрифтов:** Использовать только `next/font`. Никогда не подключать шрифты через `<link>` в HTML.
   ```typescript
   import { Inter } from 'next/font/google'
   const inter = Inter({ subsets: ['cyrillic', 'latin'], display: 'swap', adjustFontFallback: true })
   ```
2. **Защита изображений:** Запрещено использовать `<img>` без жестко заданных `width` и `height` или `aspect-ratio`. Для динамических изображений использовать `<div className="aspect-video relative"><Image fill/></div>`.
3. **Резервация места под скроллбар:** Чтобы при открытии модалок интерфейс не дергался вправо-влево (из-за исчезновения скроллбара), использовать библиотеку `react-remove-scroll` (встроена в Radix/Vaul) или фиксировать ширину `body`.

## 📦 Границы контента (Content Resiliency)
Никогда не рассчитывать на "идеальную" длину текста.

1. **Текстовые переполнения:** Любой заголовок или описание в карточке должны быть защищены от переполнения:
   `className="truncate"` (для одной строки) или `className="line-clamp-2"` (для многострочного обрезания с многоточием).
2. **Защита Flexbox-контейнеров:** Добавлять `min-w-0` дочерним элементам flex-контейнера, чтобы предотвратить выталкивание элементов за пределы экрана длинными неразрывными строками (например, ссылками).
3. **Empty States (Пустые состояния):** Если данных нет, возвращать премиальный Empty State (с блеклой иконкой и призывом к действию), а не пустой белый экран или ошибку `undefined`.

## 🌙 Hydration & Theme Safety
Чтобы избежать мерцания белого экрана у пользователей с тёмной темой при SSR-рендеринге:

1. **Suppress Hydration Warning:** В корневом `layout.tsx` обязательно добавлять этот проп в тег `<html>`, чтобы Next.js 15 не ругался на изменение классов библиотекой `next-themes`:
   ```tsx
   <html lang="ru" suppressHydrationWarning>
     <body className="bg-slate-50 dark:bg-slate-950">...</body>
   </html>
   ```
2. **Скелетоны вместо `useEffect`:** Если компонент зависит от ширины окна (window.innerWidth), он должен рендерить скелетон при SSR (на сервере), и реальный UI только после `useEffect` на клиенте, чтобы избежать несоответствия верстки (Hydration Mismatch).
