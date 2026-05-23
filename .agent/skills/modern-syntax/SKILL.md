---
name: modern-syntax
description: Современный синтаксис 2026 года. Next.js 15, строгий TypeScript, чистота Tailwind и React Hooks (Zero Warnings Policy).
---

# 🧹 Modern Syntax & Linter Strictness

Этот свод правил гарантирует чистоту синтаксиса, прохождение всех проверок ESLint/Prettier и использование только актуальных API 2026 года. Сгенерированный код не должен вызывать ни единого Warning'а при сборке (CI/CD Ready).

## 1. Управление классами Tailwind (Class Formatting)
- **Строгий порядок классов:** Сортировать классы по логике `prettier-plugin-tailwindcss` (Layout -> Flexbox -> Spacing -> Typography -> Colors -> Effects).
- **Безопасное слияние (Merge):** Категорически запрещено использовать сырые шаблонные строки для динамических классов. Использовать ТОЛЬКО утилиту `cn` (`className={cn("flex px-4", isActive && "bg-blue-500")}`).
- **Никаких магических строк (Arbitrary Values):** Строгий запрет на использование произвольных значений вроде `w-[245px]`, `backdrop-blur-[20px]`, `saturate-[180%]`. Всегда выносите их в токены темы (theme variables), например: `backdrop-blur-apple`, `saturate-apple`.

## 2. Next.js 15 Breaking Changes (Защита от устаревшего API)
- **Асинхронные параметры (CRITICAL):** В Next.js 15 `params` и `searchParams` в страницах, лейаутах и API-роутах являются **Promises**. ОБЯЗАТЕЛЬНО использовать `await`.
  - *ОТЛИЧНО:* `export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; }`
- **Отказ от `next/router`:** Строгий запрет на импорт из `next/router`. Все хуки (`useRouter`, `usePathname`, `useSearchParams`) импортировать ТОЛЬКО из `next/navigation`.
- **Метаданные:** В `generateMetadata` параметры также нужно `await`ить.

## 3. React Hooks & Linter (Zero Warnings Policy)
- **Исчерпывающие зависимости:** Массив зависимостей в хуках должен содержать ВСЕ используемые переменные. Запрещено использовать `// eslint-disable-next-line react-hooks/exhaustive-deps`.
- **Отказ от `useEffect` для производных данных (Derived State):** Если данные можно вычислить на лету, запрещено создавать для них стейт. Использовать обычные константы или `useMemo`.
- **Чистота импортов:** Удалять неиспользуемые переменные и импорты перед финальным выводом.

## 4. Бескомпромиссный TypeScript
- **React.FC Deprecated:** Запрещено использовать `React.FC`. Типизировать пропсы напрямую (`({ title }: Props) =>`).
- **Типизация `children`:** Всегда использовать `React.ReactNode`.
- **Non-Null Assertion (`!`):** Строгий запрет на `!`. Использовать Optional Chaining (`?.`) или проверку `if (!user)`.
- **Запрет пустых интерфейсов:** Запрещено использовать пустые интерфейсы (`interface Props extends BaseProps {}`). Используйте `type Props = BaseProps`, чтобы избежать ошибки `@typescript-eslint/no-empty-interface` или `An interface declaring no members is equivalent to its supertype`.

## 5. Современный Framer Motion (v11+)
- **Hybrid Strategy (CRITICAL)**: Запрещено использовать Framer Motion для простых scroll-reveal анимаций. Использовать CSS transitions + IntersectionObserver.
- Framer Motion остается только для: `AnimatePresence`, сложных жестов, Drag-and-Drop и оркестрации.
- Избегать устаревшего пропа `layoutId` в простых компонентах.
- Использовать `<LayoutGroup>` для связанных анимаций.
