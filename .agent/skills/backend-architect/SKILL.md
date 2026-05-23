---
name: backend-architect
description: Архитектура Backend. Next.js 15, Prisma, Supabase, кэширование, безопасность и Serverless Infrastructure (Vercel).
---

# 🗄️ Backend & Infra Guardrails (Next.js 15 + Prisma + Supabase + Vercel)

Этот свод правил защищает проект от фатальных ошибок при работе с базами данных, сессиями пользователей и бессерверной инфраструктурой.

## 1. Защита от исчерпания пула соединений (Prisma Serverless Crash)
Самая частая ошибка ИИ — вызов `new PrismaClient()` внутри API роутов или Server Actions. В Serverless-среде (Vercel) каждый запрос поднимает новую микро-функцию.
- **Правило (Prisma Singleton):** Никогда не инстанцировать Prisma напрямую в функциональных файлах. Всегда импортировать клиент из единого файла (например, `@/lib/db.ts`), где реализован Singleton-паттерн через `globalThis`.
- **Правило (Edge Runtime):** Если код пишется для `middleware.ts` (Edge), стандартный Prisma Client использовать запрещено. Использовать Prisma Accelerate/Data Proxy или прямые REST/Fetch запросы к Supabase.

## 2. Защита аутентификации (Supabase SSR & RLS)
- **Правило (Только SSR-пакет):** Для работы с Supabase использовать ТОЛЬКО современный пакет `@supabase/ssr`. Использование `auth-helpers` строго запрещено.
- **Правило (Разделение клиентов):** Использовать `createBrowserClient` для клиентских компонентов и `createServerClient` для Server Components, Server Actions и Route Handlers (с пробросом cookies).
- **Правило (RLS Security):** Никогда не использовать `SUPABASE_SERVICE_ROLE_KEY` в обычных запросах. Приложение должно использовать анонимный `anon_key` и полагаться на RLS. Service Role нужен только для webhook-ов и админ-скриптов.

## 3. Контракт данных Server Actions (Error Swallowing)
Next.js в production-режиме перехватывает сырые ошибки (throw new Error) и заменяет их на бессмысленное "An error occurred".
- **Правило (Safe Actions):** Все Server Actions должны возвращать стандартизированный объект: `{ success: boolean, data: any | null, error: string | null }`. Не выбрасывать сырые исключения.

## 4. N+1 Problem (Жадные запросы Prisma)
- **Правило (Batching Queries):** Строго запрещено делать запросы к БД внутри циклов (`map`, `forEach`, `for...of`).
- **Решение:** Если нужно получить связанные данные, всегда использовать Prisma `include` или `select`. Если нужно найти массив записей по ID, использовать оператор `in`: `prisma.model.findMany({ where: { id: { in: idsArray } } })`.

---

# ⚡ Архитектура Кэширования и Производительности (TTFB vs Freshness)

Вместо примитивного `force-dynamic`, который убивает время ответа сервера (TTFB), применяются 3 продвинутых паттерна оптимизации загрузки:

## Паттерн 1: Partial Prerendering (PPR) & Suspense
Запрещено использовать `force-dynamic` на уровне всей страницы (`page.tsx`), если на ней есть тяжелый UI (сайдбары, фильтры).
1. **Изоляция данных:** Выносить все запросы к БД в отдельные асинхронные компоненты (например, `<OrdersTableData />`).
2. **Suspense Boundaries:** Оборачивать компоненты с данными в `<Suspense fallback={<AppleSkeleton />}>` прямо внутри `page.tsx`.
3. Оболочка (Shell) отдается из кэша мгновенно, а данные дотекают потоком без блокировки UI.

## Паттерн 2: On-Demand Revalidation (Кэширование по тегам)
Для тяжелых SQL-запросов (аналитика, агрегация) использовать Next.js Data Cache вместо полного отказа от кэша.
1. Оборачивать запросы в `unstable_cache` с присвоением тега (например, `tags: ['stats_tag']`).
2. **Инвалидация:** В Server Actions (например, при создании заказа) обязательно вызывать `revalidateTag('stats_tag')`. Это мгновенно обновит кэш по всему миру на Edge-нодах Vercel.

## Паттерн 3: Client-Side SWR (Для живых дашбордов)
Для компонентов с высокой частотой обновления данных (мониторинг, корзины, real-time):
1. Рендерить базовую структуру на сервере.
2. Использовать хуки `useSWR` или `@tanstack/react-query` на клиенте для поллинга данных в фоне.
3. **Optimistic UI:** При действиях пользователя использовать `useOptimistic` (Next.js 15) или мутации React Query, чтобы мгновенно перерисовать UI до ответа сервера.
