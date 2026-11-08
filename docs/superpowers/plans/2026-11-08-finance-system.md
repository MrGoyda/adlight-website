# [Финансовая система ADLight] Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Построить полноценную систему управленческого финансового учета для производственной компании ADLight: Казначейство с мульти-счетами, классификатор статей ДДС/P&L, юнит-экономика проектов (План-Факт смет) и баланс долей партнеров (Даниил и Елисей).

**Architecture:** Расширение существующей схемы Prisma (`FinanceAccount`, `FinanceCategory`, `CompanyFund`, расширенный `DbTransaction`) с бесшовной миграцией текущей кассы, сервисным слоем с атомарными транзакциями пересчета балансов и декомпозицией UI на 4 независимых рабочих пространства в Apple/Linear стиле.

**Tech Stack:** Next.js 15 (App Router, Server Actions), Prisma ORM, PostgreSQL (Supabase), Tailwind CSS, Lucide Icons, TypeScript (строгий режим).

**Spec:** `C:\Users\user\.gemini\antigravity\brain\80973740-f3ad-49c5-aa1d-08dc48873b17\finance-system-architecture.md`

## Global Constraints

- Сохранять полную обратную совместимость с существующими заявками и сметами.
- Все текстовые надписи, наименования статей, подсказки и статусы строго выносить в словарь `financeDictionary.ts` (Zero hardcoded strings).
- Строгая политика Zero Warnings / Zero TypeScript Errors (`npx tsc --noEmit`).
- Соответствие Apple Design System: безопасные зоны iOS (`pb-safe`), сенсорные области >= 44px (`touch-manipulation`), предотвращение зума шрифтов на мобильных (`text-base sm:text-xs`).
- Атомарность балансов: все операции изменения баланса счетов и проводок выполняются исключительно внутри интерактивных транзакций `prisma.$transaction`.

---

### Task 1: Prisma Schema & Безопасная Миграция Базы Данных
- [x] **Step 1:** Добавить в `prisma/schema.prisma` enum `AccountType` и модель `FinanceAccount`.
- [x] **Step 2:** Добавить enum `CategoryType` и модель `FinanceCategory`.
- [x] **Step 3:** Добавить модель `CompanyFund`.
- [x] **Step 4:** Расширить модель `DbTransaction` полями `accountId`, `targetAccountId`, `categoryId`, `transactionDate`, `receiptUrl` с реляционными связями.
- [x] **Step 5:** Создать сид-скрипт `seed_finance.ts`, инициализирующий базовые счета, категории и переносящий баланс `companyState.cashbox`.
- [x] **Step 6:** Применить миграцию с помощью `npx prisma db push` и выполнить скрипт инициализации.
- [x] **Step 7:** Проверить генерацию Prisma-клиента `npx prisma generate`.

### Task 2: Словарь Финансов и Типизация (Clean Architecture)
- [x] **Step 1:** Создать `financeTypes.ts` с типами счетов, категорий, расширенных транзакций, фильтров периодов и структур аналитических отчетов P&L.
- [x] **Step 2:** Создать `financeDictionary.ts` со всеми текстами без хардкода.
- [x] **Step 3:** Проверить сборку типов `npx tsc --noEmit`.

### Task 3: Серверный слой Казначейства и Финансовой аналитики
- [x] **Step 1:** Реализовать `getFinanceInitialData()` в `app/admin/finance/actions.ts`.
- [x] **Step 2:** Реализовать `recordIncome(data)` с атомарным обновлением баланса.
- [x] **Step 3:** Реализовать `recordExpense(data)` с атомарным списанием.
- [x] **Step 4:** Реализовать `recordTransfer(...)` для мгновенных переводов (инкассация/подотчет).
- [x] **Step 5:** Реализовать `recordPartnerWithdrawal(...)` для дивидендов.
- [x] **Step 6:** Реализовать `deleteTransaction(...)` с откатом балансов счетов.
- [x] **Step 7:** Реализовать `getFinanceAnalytics(...)` для P&L и ДДС.
- [x] **Step 8:** Реализовать `getProjectsUnitEconomics()` для план-факта проектов.
- [x] **Step 9:** Реализовать `getPartnersEquity()` для долей Даниила и Елисея 50/50.

### Task 4: Модуль Казначейства: Bento-счета, Модальные окна и Лента операций
- [x] **Step 1:** Разработать `FinanceAccountsBento.tsx` с карточками счетов и фильтром по клику.
- [x] **Step 2:** Создать модальные окна `FinanceIncomeModal`, `FinanceExpenseModal`, `FinanceTransferModal`, `FinanceWithdrawalModal`.
- [x] **Step 3:** Разработать `FinanceTransactionsTable.tsx` с умным поиском и фильтрами.
- [x] **Step 4:** Интегрировать модуль Казначейства в `FinanceDashboard.tsx`.

### Task 5: Аналитика ДДС (Cash Flow) и P&L (Прибыли и Убытки)
- [x] **Step 1:** Разработать `FinancePeriodPicker.tsx` с быстрыми интервалами.
- [x] **Step 2:** Реализовать `FinanceAnalyticsView.tsx` с финансовой лестницей P&L (Выручка -> COGS -> Валовая прибыль -> OPEX -> Налоги -> Чистая прибыль).
- [x] **Step 3:** Реализовать `FinanceCategoryDonut.tsx` с круговой SVG-диаграммой структуры затрат.

### Task 6: План-Факт по заказам цеха (Юнит-экономика вывесок)
- [x] **Step 1:** Реализовать сопоставление плановой сметы и фактических списаний по заказам.
- [x] **Step 2:** Создать `ProjectFinanceCard.tsx` со шкалой выручки, себестоимости и дельтой перерасхода.
- [x] **Step 3:** Собрать реестр в `FinanceProjectsView.tsx` с фильтрами по статусам перерасхода.

### Task 7: Баланс Партнеров (Даниил & Елисей) и Фонды Компании
- [x] **Step 1:** Реализовать `PartnerEquityCard.tsx` с начислением прибыли 50/50 и вычетом дивидендов.
- [x] **Step 2:** Реализовать `CompanyFundsCard.tsx` для подушки безопасности, оборудования и налогов.
- [x] **Step 3:** Объединить в `FinancePartnersView.tsx`.

### Task 8: Главный Layout Финансов, Мобильная Адаптивность и Сквозная Верификация
- [x] **Step 1:** Создать `FinanceTabBar.tsx` с горизонтальным скроллом на мобильных.
- [x] **Step 2:** Обеспечить мобильную адаптивность модалок, карточек счетов и таблиц.
- [x] **Step 3:** Пройти верификацию типов `npx tsc --noEmit` (0 ошибок).
- [x] **Step 4:** Проверить работоспособность HTTP 200 OK для `/admin/finance` и `/admin/leads`.
