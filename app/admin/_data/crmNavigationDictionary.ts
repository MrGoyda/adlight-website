import { 
  Inbox, 
  Wallet, 
  FolderKanban, 
  BarChart3, 
  UserPlus, 
  Calculator, 
  Building2 
} from "lucide-react";

export const CRM_NAV_ITEMS = [
  {
    label: "Заявки",
    href: "/admin/leads",
    icon: Inbox,
  },
  {
    label: "Финансы",
    href: "/admin/finance",
    icon: Wallet,
  },
  // Кнопка ПЛЮС (Action Button)
  {
    isAction: true,
  },
  {
    label: "Проекты",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    label: "Аналитика",
    href: "/admin/analytics",
    icon: BarChart3,
  },
];

export const CRM_QUICK_ACTIONS = [
  {
    id: "lead" as const,
    title: "Новая заявка (Лид)",
    description: "Быстрое добавление нового входящего обращения",
    icon: UserPlus,
    gradient: "from-orange-500 to-amber-500",
    shadow: "shadow-orange-500/20",
  },
  {
    id: "estimate" as const,
    title: "Быстрая смета",
    description: "Расчет стоимости наружной рекламы и конструкций",
    icon: Calculator,
    gradient: "from-blue-600 to-indigo-600",
    shadow: "shadow-blue-500/20",
  },
  {
    id: "client" as const,
    title: "Новый клиент",
    description: "Занесение контакта в постоянную базу клиентов",
    icon: Building2,
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20",
  },
];
