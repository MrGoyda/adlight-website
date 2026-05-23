---
name: accessibility-and-loading
description: Focus States, Reduced Motion и премиальные скелетоны загрузки.
---

# ♿ Доступность и Состояния Загрузки

## 1. Focus States (Навигация с клавиатуры)
Никогда не убирать `outline: none` без замены. Использовать Apple Focus Ring:
```tsx
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2"
```

## 2. Reduced Motion (Защита от укачивания)
Интегрировать проверку системных настроек во все интерактивные компоненты.
```tsx
import { useReducedMotion } from 'framer-motion'

const shouldReduceMotion = useReducedMotion()
const initial = shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }
```

## 3. Состояния загрузки (Skeleton Loading)
Эстетика разрушается при дергающихся лоадерах. Скелетон должен:
1. Повторять финальный `border-radius`.
2. Использовать бесконечную градиентную CSS-анимацию (shimmer), а не прозрачность.

```tsx
// Tailwind утилита для скелетона
export const AppleSkeleton = ({ className }: { className?: string }) => (
  <div className={cn(
    "relative overflow-hidden bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl",
    "after:absolute after:inset-0 after:-translate-x-full",
    "after:animate-[shimmer_1.5s_infinite] after:bg-gradient-to-r",
    "after:from-transparent after:via-white/40 dark:after:via-white/10 after:to-transparent",
    className
  )} />
)
```
