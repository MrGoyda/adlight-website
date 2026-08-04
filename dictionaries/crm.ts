// dictionaries/crm.ts
// Центральный словарь локализации для всей CRM-системы ADLight.
// Все строки интерфейса должны браться отсюда — никакого хардкода.

export const crmDict = {
  navigation: {
    dashboard: "Панель управления",
    title: "ADLight CRM",
    leads: "Заявки",
    clients: "Клиенты",
    warehouse: "Склад",
    finance: "Финансы",
    analytics: "Аналитика",
    logout: "Выйти",
  },

  // ── Страница Заявок (Leads) ──────────────────────────────────────────────
  leads: {
    addLeadBtn: "Добавить лид",
    searchPlaceholder: "Поиск по имени или телефону...",
    allStatuses: "Все статусы",
    notFound: "Лиды не найдены",

    sidebarTitle: "Редактирование лида",
    costPriceBtn: "Рассчитать себестоимость / смету",
    saveChangesBtn: "Сохранить изменения",
    saving: "Сохранение...",

    fioLabel: "ФИО клиента",
    phoneLabel: "Телефон",
    statusLabel: "Статус сделки",
    responsibleLabel: "Ответственный",
    sourceLabel: "Источник лида",
    addressLabel: "Адрес объекта / замера",
    appointmentDateLabel: "Замер запланирован",
    deadlineLabel: "Дедлайн проекта",
    notesLabel: "Заметки менеджера / История сделки",
    initialRequestLabel: "Изначальный запрос:",
    signParamsLabel: "Параметры вывески:",
    notAssigned: "Не назначен",

    completedBadge: "Сделка закрыта",
    revenueLabel: "Выручка",
    expenseLabel: "Расходы",

    // Связанный клиент
    clientCardHeader: "Карточка клиента",
    notLinked: "Клиент не привязан к базе",
    unlinkBtn: "Отвязать",
    unlinkConfirm: "Отвязать лид от клиента?",
    bindPlaceholder: "Привязать к существующему...",
    createClientFromLeadBtn: "Создать карточку клиента из лида",
    goToClientBtn: "Перейти в карточку клиента",
    clientCreatedAlert: "Карточка клиента успешно создана!",

    // Аналитика
    analyticsHeader: "Техническая аналитика",
    partnerRecommendation: "Рекомендация партнера",
    recommendedBy: "Этот клиент перешел по партнерской рекомендации от:",
    unknownPartner: "Неизвестный партнер",
    organicSearch: "Поиск из Интернета (SEO)",
    foundViaSearch: "Клиент нашел наш сайт через поисковую систему:",

    // Удаление лида
    deleteLeadConfirmTitle: "Удалить лид?",
    deleteLeadConfirmDesc: "Вы уверены, что хотите удалить этого клиента?",
    deleteLeadWarning:
      "Внимание: это действие также удалит все финансовые транзакции этого лида и вычтет прибыль из кассы фирмы.",
    cancel: "Отмена",
    delete: "Удалить",
  },

  // ── Модалка создания лида ────────────────────────────────────────────────
  createLeadModal: {
    title: "Создать новый лид",
    subtitle: "Введите данные нового клиента и параметры проекта",
    fioLabel: "ФИО Клиента *",
    phoneLabel: "Телефон *",
    managerLabel: "Ответственный менеджер",
    notAssigned: "Не назначен",
    appointmentLabel: "Запланировать замер",
    deadlineLabel: "Срок сдачи (Дедлайн)",
    addressLabel: "Адрес замера / доставки",
    notesLabel: "Заметки / Комментарий",
    cancel: "Отмена",
    createBtn: "Создать лид",
    creating: "Создание...",
  },

  // ── Модалка финансового закрытия сделки ─────────────────────────────────
  financeModal: {
    title: "Оформить продажу",
    subtitle: "Введите финансовые данные по лиду",
    revenueLabel: "Выручка (Сумма от клиента, ₸)",
    expenseLabel: "Прямые расходы на проект (₸)",
    cancel: "Отмена",
    submitBtn: "Провести",
    submitting: "Проведение...",
  },

  // ── Страница Клиентов (Clients) ──────────────────────────────────────────
  clients: {
    newClientBtn: "Новый клиент",
    searchPlaceholder: "Поиск по ФИО, телефону, компании или БИН...",
    notFound: "Клиенты не найдены",
    cardTitle: "Карточка клиента",
    saveChangesBtn: "Сохранить изменения",
    saving: "Сохранение...",
    savedAlert: "Карточка клиента обновлена!",

    // Поля формы
    fioLabel: "ФИО контакта *",
    phoneLabel: "Телефон *",
    emailLabel: "Email",
    fizLabel: "Физическое лицо",
    yurLabel: "Юридическое лицо",
    companyLabel: "Компания (Организация)",
    binLabel: "БИН / ИИН",
    contractLabel: "Номер договора",
    legalAddressLabel: "Юридический / Фактический адрес",
    bankAccountLabel: "Банковские реквизиты (Счет, БИК, Банк)",
    notesLabel: "Общие примечания и история взаимодействия",

    // Связанные проекты
    relatedProjectsHeader: "Связанные проекты",
    noRelatedProjects: "Связанных проектов пока нет",

    // Удаление
    deleteConfirmTitle: "Удалить карточку клиента?",
    deleteConfirmDesc: "Вы уверены, что хотите удалить этого клиента из базы данных?",
    deleteNote: "Связанные проекты (лиды) сохранятся, но связь с этим клиентом будет очищена.",
    cancel: "Отмена",
    delete: "Удалить",

    // Модалка создания
    createTitle: "Создать карточку клиента",
    createSubtitle: "Заполните профиль клиента для базы реквизитов",
    createModal: {
      fioLabel: "ФИО Контакта *",
      phoneLabel: "Телефон *",
      companyNameLabel: "Название компании",
      binLabel: "БИН / ИИН",
      contractLabel: "Номер договора",
      bankLabel: "Банковский счет (IBAN)",
      legalAddressLabel: "Юридический адрес",
      emailLabel: "Email",
      notesLabel: "Заметки / Примечания",
      cancel: "Отмена",
      createBtn: "Создать клиента",
      creating: "Создание...",
    },
  },

  // ── Страница Склада (Warehouse) ──────────────────────────────────────────
  warehouse: {
    tabStock: "Остатки",
    tabSuppliers: "Поставщики",
    tabHistory: "История",
    searchPlaceholder: "Поиск по названию...",
    allCategories: "Все категории",
    addItemBtn: "Добавить позицию",
    addSupplierBtn: "Добавить прайс",
    lowStockWarning: "Мало",
    noItems: "Позиции не найдены",
    noHistory: "История транзакций пуста",
    adjustStockBtn: "Корректировать",

    // Модалка позиции склада
    itemModal: {
      createTitle: "Новая позиция склада",
      editTitle: "Редактировать позицию",
      adjustTitle: "Корректировка остатка",
      nameLabel: "Название материала",
      categoryLabel: "Категория",
      quantityLabel: "Количество",
      unitLabel: "Ед. измерения",
      priceLabel: "Цена себестоимости (₸/ед.)",
      locationLabel: "Место хранения",
      minStockLabel: "Минимальный остаток (алерт)",
      adjustAmountLabel: "Изменение остатка (+ приход / − списание)",
      adjustDescLabel: "Причина / описание",
      cancel: "Отмена",
      saveBtn: "Сохранить",
      saving: "Сохранение...",
      createBtn: "Добавить",
      creating: "Добавление...",
      adjustBtn: "Применить",
      adjusting: "Применение...",
    },

    // Модалка поставщика
    supplierModal: {
      createTitle: "Добавить прайс поставщика",
      editTitle: "Редактировать прайс",
      nameLabel: "Название материала / услуги",
      supplierLabel: "Поставщик",
      priceLabel: "Цена (₸/ед.)",
      unitLabel: "Ед. измерения",
      cancel: "Отмена",
      saveBtn: "Сохранить",
      saving: "Сохранение...",
      createBtn: "Добавить",
      creating: "Добавление...",
    },

    deleteConfirmTitle: "Удалить позицию?",
    deleteConfirmDesc: "Это действие необратимо.",
    cancel: "Отмена",
    delete: "Удалить",
  },

  // ── Страница Финансов (Finance) ──────────────────────────────────────────
  finance: {
    title: "Финансовый отчет",
    subtitle: "Касса компании ADLight",
    totalRevenue: "Общая выручка",
    totalExpense: "Общие расходы",
    totalProfit: "Прибыль",
    margin: "Маржа",
    noTransactions: "Транзакции не найдены",
    searchPlaceholder: "Поиск по клиенту...",
  },

  // ── Детальная страница лида (Lead Detail Page) ───────────────────────────
  leadDetail: {
    backToLeads: "Назад к списку лидов",
    projectNumber: "Проект #",
    whatsAppBtn: "WhatsApp",
    saveChangesBtn: "Сохранить изменения",
    saving: "Сохранение...",
    ratingSectionTitle: "Оценка заказчика (для внутренних заметок)",

    // Хранилище R2
    storageTitle: "Хранилище файлов проекта (Cloudflare R2)",
    storageSubtitle: "Фото замеров, эскизы, договоры и счета без лимитов по трафику",
    uploadBtn: "Загрузить файл",
    uploading: "Загрузка в R2...",
    noFilesCategory: "Нет загруженных файлов в категории",
    openFile: "Просмотр",
    downloadFile: "Скачать",
    deleteR2: "Удалить из R2",
    deleteFileConfirm: "Удалить файл из Cloudflare R2?",

    // Уведомления и ошибки (Toast)
    savedSuccess: "Данные лида успешно обновлены",
    saveError: "Ошибка при сохранении данных",
    noteAddedSuccess: "Запись добавлена в историю",
    noteAddError: "Не удалось добавить запись",
    noteUpdatedSuccess: "Запись обновлена",
    noteUpdateError: "Не удалось обновить запись",
    noteDeletedSuccess: "Запись удалена из истории",
    noteDeleteError: "Не удалось удалить запись",
    fileUploadedSuccess: "Файл успешно загружен в Cloudflare R2",
    fileUploadError: "Ошибка при загрузке файла",
    fileDeletedSuccess: "Файл удален из R2",
    fileDeleteError: "Не удалось удалить файл",

    // Таймлайн
    timelineTitle: "Хронология коммуникаций и заметок",
    timelineSubtitle: "История звонков, договоренностей и изменений по проекту с привязкой к дате",
    timelinePlaceholder: "Например: Созвонились с заказчиком. Обсудили варианты свечения букв, попросил подготовку счета...",
    addHistoryBtn: "Добавить в историю",
    addingHistory: "Добавление...",
    noHistory: "История коммуникаций пока пуста. Добавьте первую заметку выше.",
    deleteNoteConfirm: "Удалить эту запись из истории?",
    deleteNoteTitle: "Удалить запись",
    editNoteTitle: "Редактировать запись",
    saveNoteBtn: "Сохранить",
    cancelEditBtn: "Отмена",

    // Параметры & Реквизиты
    parametersTitle: "Параметры и Реквизиты",
    fioLabel: "Имя / Контакт",
    phoneLabel: "Телефон",
    managerLabel: "Ответственный менеджер",
    addressLabel: "Адрес объекта / Замера",
    appointmentDateLabel: "Дата замера",
    deadlineLabel: "Дедлайн",
    saveParametersBtn: "Сохранить параметры",
    notAssigned: "Не назначен",

    // Смета & Финансы
    financeTitle: "Смета и Финансы",
    revenueLabel: "Выручка (Цена клиента):",
    expenseLabel: "Себестоимость:",
    profitLabel: "Чистая прибыль:",
    openKanbanBtn: "Открыть в канбан-доске",

    // Категории
    categories: {
      MEASUREMENT: "Замеры & Объект",
      SKETCH: "Эскизы & Макеты",
      CONTRACT: "Договоры",
      INVOICE: "Счета & Акты",
      OTHER: "Прочие файлы",
    },

    // Оценки
    ratings: {
      EASY: {
        label: "Легкий в общении",
        sub: "Адекватный, быстро принимает решения",
      },
      STANDARD: {
        label: "Обычный заказчик",
        sub: "Стандартные рабочие коммуникации",
      },
      PROBLEM: {
        label: "Требовательный / Сложный",
        sub: "Требует повышенного внимания и контроля",
      },
    },
  },
};
