# 🚀 План Архитектуры и Миграции Фотографий в Cloudflare R2

Этот документ описывает целевую структуру хранения медиафайлов рекламного агентства **ADLight**, стандарты именования, логику разграничения статичного/динамического контента и пошаговый план миграции.

---

## 1. Концепция разграничения медиа-контента

В новой архитектуре мы разделяем медиафайлы на **3 категории**:

```
                              ┌────────────────────────┐
                              │  Cloudflare R2 Bucket  │
                              │     "adlight-media"    │
                              └───────────┬────────────┘
                                          │
        ┌─────────────────────────────────┼─────────────────────────────────┐
        ▼                                 ▼                                 ▼
┌───────────────┐                 ┌───────────────┐                 ┌───────────────┐
│ static/       │                 │ portfolio/    │                 │ crm/          │
│ (Элементы UI, │                 │ (Галереи      │                 │ (Файлы сделок,│
│ обложки услуг)│                 │ вывесок,      │                 │ чертежи,      │
│               │                 │ кейсы работ)  │                 │ сметы)        │
└───────────────┘                 └───────────────┘                 └───────────────┘
```

1. **`static/` (Публичный UI контент сайта)**:
   * Иконки, логотипы клиентов, фоны, обложки категорий услуг, фото производства.
   * *Особенность:* Изменяется редко, агрессивно кэшируется (1 год) на Edge CDN.

2. **`portfolio/` (Галерея выполненных проектов)**:
   * Фото реальных объектов (объемные буквы, неон, лайтбоксы, крышные установки, пилоны).
   * *Особенность:* Иерархия по типам вывесок и по конкретным объектам клиентов.

3. **`crm/` (Приватный & Динамический контент CRM)**:
   * Чертежи (.dwg, .pdf, .png), сметы, договора, фото фасадов клиентов из заявок.
   * *Особенность:* Загружаются менеджерами через CRM-панель. Называются по `UUID` сделки.

---

## 2. Идеальная структура подпапок в R2 (`adlight-media`)

Ниже представлена полная схема папок, эквивалентная текущей структуре `public/images/`:

```
adlight-media/
├── static/
│   ├── brand/
│   │   ├── logo-light.svg
│   │   ├── logo-dark.svg
│   │   └── favicon.ico
│   ├── clients/                  # Логотипы партнеров и клиентов (Marquee)
│   │   ├── kmg.png
│   │   └── qazpost.png
│   ├── services-covers/          # Обложки для страниц услуг
│   │   ├── volume-letters.webp
│   │   ├── lightboxes.webp
│   │   ├── neon.webp
│   │   ├── roof-installations.webp
│   │   └── ...
│   ├── factory/                  # Фото цеха, ЧПУ-станков, команды
│   │   ├── ceh.webp
│   │   └── assembly_workshop.png
│   ├── calc/                     # 3D превью для калькулятора вывесок
│   │   ├── acrylic-slim.webp
│   │   └── back-lit.webp
│   └── design-code/              # Иллюстрации раздела Дизайн-код Астаны
│       ├── dk_approved.png
│       └── design-code-hero.jpg
│
├── portfolio/
│   ├── categories/               # Галереи по видам изделий (Для Hero и разводных страниц)
│   │   ├── volume-letters/       # Объемные буквы (подтипы)
│   │   │   ├── face-lit/
│   │   │   ├── back-lit/
│   │   │   ├── full-lit/
│   │   │   ├── combo-lit/
│   │   │   ├── side-lit/
│   │   │   ├── acrylic-slim/
│   │   │   ├── non-lit/
│   │   │   ├── perforated/
│   │   │   ├── pixel-led/
│   │   │   └── day-night-effect/
│   │   ├── lightboxes/           # Световые короба
│   │   ├── neon/                 # Гибкий неон
│   │   ├── panel-brackets/       # Панель-кронштейны
│   │   ├── roof-installations/   # Крышные установки
│   │   ├── pylons/               # Стелы и пилоны
│   │   ├── entrance-groups/      # Входные группы
│   │   ├── facade-decoration/    # Оформление фасадов
│   │   ├── interior/             # Интерьерные вывески & лофт
│   │   ├── navigation/           # Навигация и указатели
│   │   ├── branding-cars/        # Оклейка авто
│   │   ├── window-branding/      # Брендирование окон / пленок
│   │   ├── led-screens/          # LED экраны и бегущие строки
│   │   └── architectural-lighting/# Архитектурная подсветка
│   │
│   └── projects/                 # Детальные кейсы конкретных объектов (Bento & Portfolio Slug)
│       ├── arustone/
│       │   ├── arustone-01.webp
│       │   └── arustone-02.webp
│       ├── kmg/
│       ├── aigelova-beauty/
│       └── [slug]/               # 90+ папок реальных вывесок
│
└── crm/
    ├── leads/
    │   └── {lead_id}/            # Файлы и фото от клиента к заявке
    │       ├── photo_facade.jpg
    │       └── tz.pdf
    └── projects/
        └── {project_id}/          # Рабочие чертежи и сметы объекта
            ├── blueprint_v1.dwg
            └── estimate.pdf
```

---

## 3. Стандарты именования файлов и оптимизации

1. **Формат медиа:**
   * Все фото для сайта автоматически конвертируются в **WebP** или **AVIF**.
   * Графика/векторы — **SVG**.
   * Документы CRM — исходный формат (`.pdf`, `.dwg`, `.xlsx`, `.jpg`).
2. **Система наименования (Naming Convention):**
   * Только строчные латинские буквы (`kebab-case`).
   * Никаких пробелов, кириллицы и спецсимволов.
   * Пример: `face-lit-arustone-night-01.webp`.
3. **Разрешения и размеры:**
   * `hero-banner`: 1920x1080px (макс. 200 КБ).
   * `card-preview`: 800x600px (макс. 80 КБ).
   * `gallery-thumb`: 400x300px (макс. 30 КБ).

---

## 4. Архитектура работы кода после миграции

### До миграции (Проблема):
```ts
// fs.readdirSync физически сканирует папки серверного диска Vercel
const files = fs.readdirSync(path.join(process.cwd(), 'public', 'images', slug));
```

### После миграции (Решение 2026):
1. **Кастомный CDN-домен:** `https://cdn.adlight.kz/` (направлен на R2 через Cloudflare).
2. **Манифест галлерей (`lib/media-manifest.json`):**
   При сборке генерируется или используется статичный JSON-индекс имеющихся файлов R2:
   ```json
   {
     "volume-letters/face-lit": [
       "https://cdn.adlight.kz/portfolio/categories/volume-letters/face-lit/01.webp",
       "https://cdn.adlight.kz/portfolio/categories/volume-letters/face-lit/02.webp"
     ]
   }
   ```
3. **Отдача через Next Image:**
   ```tsx
   <Image 
     src="https://cdn.adlight.kz/portfolio/categories/volume-letters/face-lit/01.webp"
     alt="Световые буквы"
     fill
   />
   ```

---

## 5. Пошаговый план миграции (Checklist)

- [ ] **Шаг 1. Настройка Cloudflare R2**
  - [ ] Создать бакет `adlight-media` в панели Cloudflare.
  - [ ] Подключить Custom Domain `cdn.adlight.kz` (или использовать домен R2 `.r2.dev`).
  - [ ] Настроить CORS и Caching Rules (Browser Cache TTL = 1 year).

- [ ] **Шаг 2. Автоматическая загрузка контента в R2**
  - [ ] Запустить скрипт загрузки папок `public/images/` в структуры `static/` и `portfolio/` R2.

- [ ] **Шаг 3. Обновление кода приложения**
  - [ ] Добавить `cdn.adlight.kz` в `next.config.ts` (`images.remotePatterns`).
  - [ ] Обновить `lib/serverUtils.ts` для работы с CDN-ссылками вместо `fs.readdirSync`.
  - [ ] Обновить словари `dictionaries/` на прямые CDN-ссылки.

- [ ] **Шаг 4. Очистка репозитория**
  - [ ] Удалить тяжёлые статические фото из `public/images/`.
  - [ ] Проверить уменьшение размера Git-репозитория и скорости сборки на Vercel.
