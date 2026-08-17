import { LeadStatus } from "@prisma/client";

export interface StatusConfig {
  label: string;
  color: string;
  bg: string;
}

export const STATUS_MAP: Record<LeadStatus, StatusConfig> = {
  NEW: { label: "Новый", color: "text-blue-700 border-blue-200", bg: "bg-blue-50" },
  IN_PROGRESS: { label: "В работе", color: "text-amber-700 border-amber-200", bg: "bg-amber-50" },
  ESTIMATE: { label: "Смета / Замер", color: "text-purple-700 border-purple-200", bg: "bg-purple-50" },
  PROCESSED: { label: "Производство", color: "text-indigo-700 border-indigo-200", bg: "bg-indigo-50" },
  COMPLETED: { label: "Выполнен", color: "text-emerald-700 border-emerald-200", bg: "bg-emerald-50" },
  CANCELLED: { label: "Отказ", color: "text-rose-700 border-rose-200", bg: "bg-rose-50" },
  UNPROCESSED: { label: "Не отработан", color: "text-red-700 border-red-200", bg: "bg-red-50" },
};

export const MANAGER_MAP: Record<string, string> = {
  DANIIL: "Даниил",
  ELISEY: "Елисей",
  "Даниил": "Даниил",
  "Елисей": "Елисей",
};

export function formatManagerName(manager?: string | null): string {
  if (!manager) return "";
  return MANAGER_MAP[manager] || manager;
}

export const LEADS_DICTIONARY = {
  title: "Заявки клиентов",
  subtitle: "Управление лидами, сметами и заказами",
  searchPlaceholder: "Поиск по имени, телефону, адресу...",
  allStatuses: "Все статусы",
  newLeadBtn: "Новый лид",
  noLeadsFound: "Заявок не найдено",
  totalLeads: "Всего заявок",
  newLeadsCount: "Новые",
  inProgressCount: "В работе",
  revenueSum: "Общая выручка",

  card: {
    estimateBtn: "Смета",
    cardBtn: "Карточка",
    deleteTooltip: "Удалить заявку",
    managerNotAssigned: "Менеджер не назначен",
    addressNotSpecified: "Адрес не указан",
    commentsCount: "заметок",
    filesCount: "файлов",
    noteBadge: "Заметка",
    noNote: "Без заметки",
    noAddress: "Без адреса",
    noManager: "Не назначен",
    photosCount: "фото",
    docsCount: "док",
    noEstimate: "Без сметы",
    estimateLabel: "Смета",
    offeredPrice: "Озвучено",
    discountBadge: "Скидка",
    copyAddressSuccess: "Адрес скопирован в буфер!",
    copyAddressError: "Не удалось скопировать адрес",
    compactMode: "Компактно",
    detailedMode: "Подробно",
    openMap: "Открыть в 2GIS",
    copyAddressTooltip: "Скопировать адрес",
    responsibleLabel: "Ответственный",
    offeredPriceLabel: "Озвученная стоимость клиенту",
    initialSiteRequest: "Исходный запрос с сайта",
  },

  drawer: {
    title: "Детали лида",
    closeBtn: "Закрыть",
    openFullCard: "Открыть карточку",
    calculateCostBtn: "Расчет сметы",
    saveBtn: "Сохранить изменения",
    savingBtn: "Сохранение...",
    fioLabel: "ФИО клиента",
    phoneLabel: "Телефон",
    statusLabel: "Статус сделки",
    addressLabel: "Адрес объекта",
    managerLabel: "Ответственный менеджер",
    dateLabel: "Дата встречи",
    deadlineLabel: "Срок выполнения",
    financesTitle: "Финансы и расчеты",
    offeredPriceTitle: "Озвученная стоимость клиенту",
    offeredPriceAmount: "Озвученная сумма (₸)",
    discountCheckbox: "🏷️ Озвучено со скидкой",
    discountSubtext: "Была предложена спец-цена",
    prepaymentLabel: "Сумма предоплаты",
    commentLabel: "Заметка / Комментарий",
    initialRequestLabel: "Первичный запрос с сайта",
    clientSectionTitle: "Привязать карточку клиента",
    unlinkClientBtn: "Отвязать клиента",
    openClientCard: "Перейти в базу клиентов",
    notLinked: "Клиент не привязан к базе",
    createClientBtn: "+ Создать клиента из лида",
    analyticsHeader: "Маркетинговые метки (UTM)",
    clientTab: "Данные",
    estimateTab: "Смета",
    filesTab: "Файлы",
    historyTab: "История",
    saveSuccess: "Данные успешно сохранены",
    clientName: "Имя клиента",
    phone: "Телефон",
    manager: "Ответственный менеджер",
    appointmentDate: "Дата замера / встречи",
    deadline: "Срок сдачи",
    address: "Адрес объекта",
    comment: "Комментарий / заметка",
    status: "Статус заявки",
    clientCardCreated: "Клиент привязан",
    prepayment: "Предоплата",
    prepaymentPaid: "Предоплата внесена",
    balancePaid: "Полный расчет закрыт",
    convertToCompanyBtn: "🏢 Квалифицировать в Проект",
    companyConvertTitle: "Квалификация лида в Проект",
  },

  deleteModal: {
    title: "Удалить заявку?",
    description: "Вы действительно хотите безвозвратно удалить эту заявку? Это действие нельзя будет отменить.",
    warning: "Это действие невозможно отменить.",
    cancelBtn: "Отмена",
    confirmBtn: "Да, удалить",
  },

  createModal: {
    title: "Новая заявка",
    subtitle: "Заполните первичные данные клиента",
    nameLabel: "ФИО или Организация",
    namePlaceholder: "например, ООО Свет или Алексей",
    phoneLabel: "Номер телефона",
    phonePlaceholder: "+7 (999) 000-00-00",
    managerLabel: "Менеджер",
    appointmentLabel: "Дата замера/встречи",
    deadlineLabel: "Срок выполнения",
    addressLabel: "Адрес объекта",
    commentLabel: "Заметка / Комментарий",
    submitBtn: "Создать заявку",
  },

  financeModal: {
    title: "Закрытие сделки и Фиксация",
    subtitle: "Укажите финансовые показатели выполненного проекта",
    revenueLabel: "Финальная выручка (₸)",
    expenseLabel: "Себестоимость / Расходы (₸)",
    profitLabel: "Чистая прибыль",
    submitBtn: "Зафиксировать и завершить",
    cancelBtn: "Отмена",
  },

  stats: {
    total: "Всего заявок",
    new: "Новые",
    inProgress: "В работе",
    revenue: "Общая выручка",
    conversion: "Конверсия",
  },
};
