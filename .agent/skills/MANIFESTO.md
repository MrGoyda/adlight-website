# 🦅 Antigravity Chief Architect Manifesto

Добро пожаловать в центральный узел архитектурных стандартов агента Antigravity. 
Этот манифест является **точкой входа** (Entry Point) для ИИ. Перед началом работы над любой задачей агент обязан свериться с этими директивами, чтобы избежать галлюцинаций, "цифровой лени" и нарушений архитектуры.

Наша цель — создание не просто веб-сайтов, а отказоустойчивых ERP-систем и PWA-приложений уровня нативных iOS-приложений (эстетика Apple, TTFB < 50ms, Zero CLS).

## 🧠 База Навыков (Skill Vault)

Система разделена на 10 независимых модулей. Обращайтесь к соответствующим скиллам для получения глубокого контекста:

### 1. 🤖 [Core Guardrails](./core-guardrails/SKILL.md) ("Ошейник для ИИ")
*Жесткие ограничения поведения ИИ, которые работают всегда.*
- **Zero Deletion & No Placeholders**: Запрет на тихое удаление логики (Silent Truncation). Полный возврат кода.
- **Prisma Truth**: Обязательное чтение `schema.prisma` перед написанием мутаций. Никаких угадываний полей.
- **RSC Circular Doom**: Строгий запрет импорта Server Components в Client Components. Использование паттерна слотов (`children`).
- **Zero Env Leak**: Строгий запрет `NEXT_PUBLIC_` для секретов (только серверная среда).
- **Tailwind Purity**: Обязательное использование `cn()` (tailwind-merge) для избежания конфликтов классов.

### 2. 🗄️ [Backend Architect](./backend-architect/SKILL.md) (Инфраструктура и Данные)
*Гарантия свежести данных и защиты БД в бессерверной среде (Vercel).*
- **Prisma Serverless Crash Protection**: Использование Singleton-паттерна.
- **Трехуровневое кэширование**: Partial Prerendering (PPR) + Suspense, On-Demand Revalidation (`revalidateTag`), и Client-Side SWR для живых дашбордов.
- **Safe Server Actions**: Контракт данных `{ success, data, error }`.
- **Защита от N+1**: Группировка запросов в БД (никаких запросов в циклах).

### 3. 🪄 [UI/UX Architect](./ui-ux-architect/SKILL.md) (PWA & Perceived Performance)
*Продвинутые техники для нативного ощущения интерфейса.*
- **Тотальная Виртуализация**: `@tanstack/react-virtual` для списков > 50 элементов.
- **Intent-based Prefetching**: Загрузка данных по `onMouseEnter`.
- **Haptic Feedback**: Использование `navigator.vibrate` для критических действий.
- **Нативная физика**: `overscroll-contain`, скрытие скроллбаров и Swipe-to-Dismiss (Vaul/Framer Motion).
- **LCP & BlurData**: Оптимизация изображений (Base64 + priority).

### 4. 🍏 [Apple Design System](./apple-design-system/SKILL.md) (Эстетика и Визуал)
*Проектирование премиальных интерфейсов (High-End Minimalism).*
- **Glassmorphism**: Изолированные GPU-слои для блюра (`backdrop-filter-none` при анимациях).
- **Hybrid Animations**:
  - **CSS/Tailwind**: Строго для всех scroll-reveal (появление блоков, выезд текста). Высокая производительность и Zero CLS.
  - **Framer Motion**: Только для сложных интеракций: выпадающие меню, модалки (`AnimatePresence`), Drag-and-Drop и оркестрация.
- **Доступность**: Focus States, Apple Skeletons (бесконечный shimmer).
- **Defensive UX**: Защита от багов iOS Safari (Dynamic Viewport `h-dvh`, Safe Areas, `select-none`).

### 5. 🏢 [Enterprise Architect](./enterprise-architect/SKILL.md) (Формы, Стейт и Устойчивость)
*Отказоустойчивость для сложных клиентских интерфейсов.*
- **Zod + RHF Forms**: Строгий отказ от `useState` в формах, `useTransition` для сабмита.
- **Изоляция сбоев**: Локальные `error.tsx` и глобальные Toasts (Sonner) вместо белого экрана.
- **Zustand Store**: Отказ от React Context для стейта. Использование Zustand + `persist` (Local Storage).
- **Network Resiliency**: Авто-retry для SWR/ReactQuery и Optimistic UI с откатом при падении сети.

### 6. ⚡ [Enterprise UX](./enterprise-ux/SKILL.md) (Power Users & Pro Tools)
*Механики для профессионалов, проводящих в ERP 8+ часов в день.*
- **Keyboard-First**: Навигация с клавиатуры (`Cmd+Enter`, `Esc`), Command Palette (`cmdk`).
- **Fluid Typography**: Плавное масштабирование размеров через `clamp()` вместо брейкпоинтов.
- **Locale Formatting**: Нативный `Intl.NumberFormat` для локальных валют и `date-fns` для относительных дат.
- **Zero-Latency UI**: Хук `useOptimistic` для мгновенных мутаций и Autosave через Debounce.

### 7. 🧹 [Modern Syntax & Linting](./modern-syntax/SKILL.md) (Next.js 15, TS, Tailwind)
*Синтаксис 2026 года и Zero Warnings Policy для CI/CD.*
- **Next.js 15 API**: Асинхронные `params` и `searchParams` (CRITICAL), импорты только из `next/navigation`.
- **Tailwind Formatting**: Обязательный `cn()` для слияния, отказ от магических строк (arbitrary values).
- **React Hooks**: Никакого производного стейта в `useEffect`, исчерпывающие зависимости.
- **Strict TypeScript**: Никаких `React.FC` или non-null assertions (`!`).
- **Modern Framer Motion**: Отказ от устаревшего `AnimateSharedLayout`.

### 8. 🧽 [Engineering Hygiene](./engineering-hygiene/SKILL.md) (Масштабирование и Чистота)
*Защита архитектуры от "спагетти-кода" в долгоживущих проектах.*
- **Colocation Policy**: Хранение фича-компонентов и хуков локально, рядом со страницей.
- **Prisma Transactions**: Обязательная атомарность (`$transaction`) для связанных мутаций БД.
- **No Magic Strings**: Использование Prisma Enums и мапперов (Record) вместо хардкода строк в UI.
- **Production Logging**: Отказ от `console.log` в пользу централизованного `logger` (Sentry/Axiom) с бизнес-контекстом.

### 9. 🏗️ [Clean Architecture](./clean-architecture/SKILL.md) (Декомпозиция и Слои)
*Структура Enterprise-проекта для безболезненного масштабирования.*
- **Dictionary Pattern**: Отказ от хардкода текста в JSX, вынос в `@/dictionaries/`.
- **No Magic Values**: Константы в `UPPER_SNAKE_CASE` в `@/config/` или `constants.ts`.
- **Service Layer**: Разделение Server Actions (Контроллер/Zod) и работы с БД (Prisma переносится в `@/services/`).
- **Container/Presenter**: Разделение серверного фетчинга и клиентского UI, лимит в 150-200 строк на файл.

### 10. 🛡️ [System Custodian](./enterprise-scaling/SKILL.md) (Масштабирование и Рефакторинг)
*Безопасная эволюция системы и нулевой радиус поражения.*
- **Pure Logic**: Бизнес-логика в чистых `.ts` функциях (Unit-test ready), вне React-компонентов.
- **Controlled Blast Radius**: Итеративный рефакторинг (V2 паттерн) без полного переписывания.
- **Zero Downtime DB**: Миграции `Expand and Contract`, строгий запрет на `DROP` колонок.
- **Graceful Rollouts**: Использование Feature Flags и Dark Launching для крупных фич.
- **Contextual JSDoc**: Комментарии объясняют "ПОЧЕМУ", а не "ЧТО". Обязательное логирование "хаков".

---

**Директива ИИ:** При получении задачи, определи, какие из этих 10 слоев затронуты, и строго следуй их специализированным правилам. Код должен быть отказоустойчивым, строго типизированным и эстетически безупречным.
