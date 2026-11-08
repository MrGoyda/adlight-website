# ADLight Mission Control: Tasks & Planning Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Построить единый центр задач и планирования ADLight CRM, объединяющий воронку заказов, производственные этапы цеха (замер, снабжение, раскрой, сборка букв, монтаж, сдача), автогенерацию чек-листов и списание расходов в 1 клик.

**Architecture:** Модульная архитектура Next.js 15 App Router: Server Components для начальной загрузки данных, Server Actions с атомарными транзакциями Prisma `$transaction`, чистая декомпозиция компонентов интерфейса (Things 3 Agenda, Linear Kanban, Timeline Calendar), строгая типизация TypeScript и словарь локализации (Zero hardcoded strings).

**Tech Stack:** Next.js 15, React 19, TypeScript 5, Tailwind CSS, Prisma 7, PostgreSQL (Supabase), Lucide Icons, Mobile BottomSheet, Web Haptics.

**Spec:** `C:\Users\user\.gemini\antigravity\brain\80973740-f3ad-49c5-aa1d-08dc48873b17\adlight-tasks-system-architecture.md`

## Global Constraints

- Zero hardcoded strings: все надписи, названия статусов, приоритетов и тостов должны находиться в `app/admin/tasks/_data/tasksDictionary.ts`.
- Zero TypeScript warnings / errors: обязательное прохождение `npx tsc --noEmit` без единой ошибки.
- Атомарность финансовых проводок: списание расходов из задач выполняется внутри `prisma.$transaction`.
- Apple HIG и мобильные стандарты: touch-таргеты $\ge 44\text{px}$, адаптивные BottomSheet на смартфонах, оптимистичные обновления чекбоксов (Optimistic UI).

## Review Focus

1. Поведение при удалении связанного заказа: задачи должны безопасно каскадно очищаться или сохраняться без поломки интерфейса (`onDelete: Cascade`).
2. Оптимистичный отклик чекбоксов: при тапе по чекбоксу галочка и зачеркивание должны отображаться мгновенно без зависания интерфейса.
3. Проводка расхода из задачи: при нажатии на «Списать расход» проводка должна одновременно списывать баланс со счета казначейства, создавать `DbTransaction` и привязываться к сметному учету сделки.
4. Отключение автогенерации: если у сделки выключена автогенерация, ручной перевод статуса не должен спамить дублирующимися задачами.
5. Мобильная верстка: отсутствие горизонтального скролла на экранах от 375px.

---

### Task 1: Database Schema & Migrations (`prisma/schema.prisma`)

**Files:**
- Modify: `prisma/schema.prisma`
- Execution: `npx prisma db push && npx prisma generate`

**Requirements:**
- Добавить `TaskStatus` (`TODO`, `IN_PROGRESS`, `DONE`, `CANCELLED`).
- Добавить `TaskPriority` (`URGENT`, `HIGH`, `NORMAL`, `LOW`).
- Добавить `TaskStage` (`MEASUREMENT`, `SUPPLY`, `PRODUCTION`, `ASSEMBLY`, `INSTALLATION`, `HANDOVER`, `GENERAL`).
- Создать модель `CrmTask` со всеми полями из архитектурного спека.
- Создать модель `CrmSubtask` для подпунктов чек-листа.
- Добавить связь `tasks CrmTask[]` в модель `Lead`.
- Добавить поле `autoTasksEnabled Boolean @default(true)` в `Lead`.

- [ ] 1.1 Добавить новые enum и модели `CrmTask` и `CrmSubtask` в `prisma/schema.prisma`.
- [ ] 1.2 Связать `CrmTask` с `Lead` и добавить `autoTasksEnabled` в `Lead`.
- [ ] 1.3 Выполнить `npx prisma db push` для синхронизации схемы с базой данных Supabase.
- [ ] 1.4 Выполнить `npx prisma generate` для обновления типов Prisma Client.

---

### Task 2: Type System & Dictionaries

**Files:**
- Create: `app/admin/tasks/_types/taskTypes.ts`
- Create: `app/admin/tasks/_data/tasksDictionary.ts`

**Requirements:**
- Строгие интерфейсы для задач, подзадач, фильтров, полезной нагрузки создания и обновления.
- Полный словарь локализации для всех надписей, кнопок, подсказок, названий этапов цеха и тостов.

- [ ] 2.1 Создать `app/admin/tasks/_types/taskTypes.ts`.
- [ ] 2.2 Создать `app/admin/tasks/_data/tasksDictionary.ts`.

---

### Task 3: Server Layer & Smart Pipelines Engine (`app/admin/tasks/actions.ts`)

**Files:**
- Create: `app/admin/tasks/actions.ts`
- Modify: `app/admin/leads/actions.ts` (хук триггера автогенерации)

**Requirements:**
- `getTasksInitialData(filters)`: выборка задач с оптимизированными `select`.
- `createTask(data)`: создание новой задачи (с поддержкой подзадач).
- `updateTaskStatus(taskId, status)`: обновление статуса задачи.
- `updateTaskStage(taskId, stage)`: обновление производственного этапа.
- `toggleSubtask(subtaskId, isCompleted)`: переключение чекбокса подзадачи.
- `deleteTask(taskId)`: удаление задачи.
- `recordTaskExpense(...)`: атомарное списание расхода из задачи с обновлением счета казначейства.
- `generateLeadPipelineTasks(leadId, newStatus)`: алгоритм регламентной нарезки задач цеха при смене статуса заказа.

- [ ] 3.1 Реализовать `app/admin/tasks/actions.ts` со всеми экшенами и авто-пайплайном.
- [ ] 3.2 Встроить вызов `generateLeadPipelineTasks` в `updateLeadStatus` в `app/admin/leads/actions.ts`.

---

### Task 4: UI Presentation Components (Card, Modals & Checkboxes)

**Files:**
- Create: `app/admin/tasks/_components/TaskCard.tsx`
- Create: `app/admin/tasks/_components/TaskQuickCreateModal.tsx`
- Create: `app/admin/tasks/_components/TaskExpenseModal.tsx`
- Create: `app/admin/tasks/_components/TaskDetailModal.tsx`

**Requirements:**
- `TaskCard`: интерактивный элемент с быстрым чекбоксом, бейджем этапа, тегом приоритета, ссылкой на заказ, аккордеоном подзадач и кнопкой `[💸 Списать расход]`.
- `TaskQuickCreateModal`: BottomSheet создания задачи с выбором исполнителя, срока, приоритета и связанного заказа.
- `TaskExpenseModal`: шторка списания расхода на материалы/монтаж с предзаполненной сделкой.

- [ ] 4.1 Создать `TaskCard.tsx` с Optimistic UI и тактильным откликом.
- [ ] 4.2 Создать `TaskQuickCreateModal.tsx`.
- [ ] 4.3 Создать `TaskExpenseModal.tsx` для 1-клик финансовой проводки.
- [ ] 4.4 Создать `TaskDetailModal.tsx` для просмотра и редактирования задачи.

---

### Task 5: View 1 — Agenda / Focus Day (`TasksAgendaView.tsx`)

**Files:**
- Create: `app/admin/tasks/_components/views/TasksAgendaView.tsx`

**Requirements:**
- Отображение в стиле Things 3:
  - Секция `🔥 Горит сегодня / Просрочено`.
  - Секция `📅 Предстоящие (на этой неделе)`.
  - Секция `📌 Без даты / Хозяйственные дела цеха`.
  - Секция `✅ Завершенные`.
- Фильтр по исполнителю (Все / Даниил / Елисей).

- [ ] 5.1 Создать `app/admin/tasks/_components/views/TasksAgendaView.tsx`.

---

### Task 6: View 2 — Production Kanban (`TasksKanbanView.tsx`)

**Files:**
- Create: `app/admin/tasks/_components/views/TasksKanbanView.tsx`

**Requirements:**
- Колонки по этапам цеха:
  - `📐 Замер и осмотр`
  - `🛒 Снабжение (Закупка)`
  - `⚙️ В цеху (Раскрой / Сборка)`
  - `🏗️ Монтаж на объекте`
  - `🤝 Сдано заказчику`
- Быстрое перемещение задачи между этапами.

- [ ] 6.1 Создать `app/admin/tasks/_components/views/TasksKanbanView.tsx`.

---

### Task 7: View 3 — Timeline / Measurements & Installs Calendar (`TasksCalendarView.tsx`)

**Files:**
- Create: `app/admin/tasks/_components/views/TasksCalendarView.tsx`

**Requirements:**
- Календарная сетка по датам.
- Карточки выездов на замер и монтаж с адресом, кнопкой звонка клиенту и прямой ссылкой на маршрут в 2GIS / Яндекс.Карты.

- [ ] 7.1 Создать `app/admin/tasks/_components/views/TasksCalendarView.tsx`.

---

### Task 8: Shell, Dashboard & CRM Navigation Integration

**Files:**
- Create: `app/admin/tasks/_components/TasksTabBar.tsx`
- Create: `app/admin/tasks/_components/TasksDashboard.tsx`
- Create: `app/admin/tasks/page.tsx`
- Modify: `components/admin/CrmAppShell.tsx` (добавление вкладки «Задачи»)

**Requirements:**
- Сегментированный таб-бар переключения видов (Фокус дня / Канбан / Календарь).
- Главный дашборд задач с ленивой загрузкой модалок и адаптивным лейаутом.
- Добавление пункта меню «Задачи» (CheckSquare) в десктопный Sidebar и мобильный BottomBar `CrmAppShell`.

- [ ] 8.1 Создать `TasksTabBar.tsx`, `TasksDashboard.tsx`, `app/admin/tasks/page.tsx`.
- [ ] 8.2 Добавить раздел «Задачи» в `CrmAppShell.tsx`.

---

### Task 9: Verification, Optimization & Production Build

**Files:**
- Verification: `npx tsc --noEmit`
- Build: `npm run build`
- Git: commit and push

**Requirements:**
- `npx tsc --noEmit` без единой ошибки.
- Локальная компиляция `npm run build` успешна (страница `/admin/tasks` сгенерирована).
- Коммит и пуш в репозиторий с проверкой деплоя Vercel.

- [ ] 9.1 Запустить `npx tsc --noEmit` и устранить любые несоответствия.
- [ ] 9.2 Проверить локальный запуск `/admin/tasks`.
- [ ] 9.3 Запустить `npm run build`.
- [ ] 9.4 Зафиксировать изменения в Git и отправить в `origin main`.
