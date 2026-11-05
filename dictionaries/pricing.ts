/**
 * Единый источник UI-текстов для модуля ценообразования и каталога материалов.
 * Clean Architecture Dictionary: отказ от хардкода текстов в компонентах.
 */

export const pricingDict = {
  header: {
    title: "База товаров и Тарифы сметы",
    subtitle: "Единый центр управления себестоимостью, прайсами поставщиков, логистикой и ставками ЗП",
    tabs: {
      materials: {
        label: "Каталог товаров и материалов",
        shortLabel: "Материалы",
      },
      rates: {
        label: "Тарифы сметы (Газель, Вышка, ЗП)",
        shortLabel: "Тарифы сметы",
      },
      suppliers: {
        label: "База поставщиков",
        shortLabel: "Поставщики",
      },
    },
    actions: {
      addMaterial: "Добавить материал",
      addRate: "Добавить тариф",
      addSupplier: "Добавить поставщика",
    },
  },

  sidebar: {
    photoFilter: {
      title: "С фото",
      subtitle: "Только с изображениями",
    },
    categories: {
      title: "Каталог материалов",
      all: "Все категории",
      allPositions: (count: number) => `Все позиции (${count})`,
    },
    suppliers: {
      title: "Поставщики",
      all: "Все поставщики",
      contactInfoTooltip: "Контакты и прайс-лист",
    },
    facets: {
      title: "Характеристики",
      activeCount: (count: number) => `${count} выбрано`,
      resetAll: "Сбросить параметры",
      allOption: (label: string) => `Все (${label.toLowerCase()})`,
    },
  },

  toolbar: {
    searchPlaceholder: "Поиск по названию, характеристикам, поставщику...",
    clearSearchTooltip: "Очистить поиск",
    cartButton: "Закупка",
    taxonomyButton: "Категории и фильтры",
    addMaterialButton: "Добавить материал",
    createShort: "Создать",
    sort: {
      title: "Сортировка",
      default: "По умолчанию (по фото)",
      priceAsc: "Сначала дешевле",
      priceDesc: "Сначала дороже",
      nameAsc: "По названию (А–Я)",
      nameDesc: "По названию (Я–А)",
    },
    viewMode: {
      table: "Табличный вид",
      grid: "Вид плиткой (сетка)",
    },
    counter: {
      shown: (visible: number, total: number) => `Показано: ${visible} из ${total} позиций`,
      selected: (name: string) => `Выбрано: ${name}`,
    },
  },

  breadcrumbs: {
    allMaterials: "Все материалы",
    resetFilterTooltip: (name: string) => `Сбросить фильтр «${name}»`,
    resetAllFilters: "Сбросить все параметры",
  },

  table: {
    columns: {
      item: "Материал / Услуга",
      subcategory: "Подкатегория",
      supplier: "Поставщик",
      costPrice: "Себестоимость",
      actions: "Действия",
    },
    badges: {
      service: "Перезаказ",
      inCart: (qty: number) => `В корзине (${qty})`,
    },
    tooltips: {
      inspect: "Открыть инспектор",
      edit: "Редактировать позицию",
      delete: "Удалить позицию",
      savePrice: "Сохранить цену",
      cancelPrice: "Отмена",
      addToCart: "Добавить в корзину закупки",
      removeFromCart: (qty: number) => `Удалить из корзины (в корзине: ${qty})`,
      supplierCard: "Карточка поставщика",
    },
  },

  ratesTab: {
    allCategories: (count: number) => `Все категории (${count})`,
    addRateButton: "Добавить тариф",
    positionsCount: (count: number) => `${count} позиций`,
    emptyCategory: "Нет настроенных тарифов в этой категории. Нажмите «Добавить тариф».",
    columns: {
      operation: "Операция / Вид работы",
      cost: "ЗП (Себестоимость)",
      price: "Цена в смете",
      margin: "Маржа / Наценка",
      actions: "Действия",
    },
    row: {
      unitLabel: "Ед. измерения:",
      costMobile: "ЗП мастера:",
      priceMobile: "В смете:",
      marginMobile: "Маржа компании:",
      editTooltip: "Редактировать тариф",
      deleteTooltip: "Удалить тариф",
    },
  },

  emptyState: {
    title: "Ничего не найдено",
    description: "Попробуйте изменить поисковый запрос, сбросить фильтры характеристик или добавить новую позицию в каталог.",
    resetFilters: "Сбросить все фильтры",
    createMaterial: "Добавить первый материал",
  },

  modals: {
    material: {
      titleNew: "Новый материал / товар",
      titleEdit: "Редактировать позицию",
      titleServiceNew: "Новая услуга подрядчика (перезаказ)",
      titleServiceEdit: "Редактировать услугу подрядчика",
      subtitleMaterial: "Каталог себестоимости и закупа",
      subtitleService: "Внешние подрядчики (фрезеровка, УФ-печать, гибка)",
      serviceSwitch: {
        title: "Перезаказ услуги у подрядчика",
        subtitle: "Фрезеровка, лазерная резка, УФ-печать, гибка",
      },
      fields: {
        name: "Название материала / товара *",
        nameService: "Название услуги подрядчика *",
        namePlaceholder: "Напр. Акрил 3мм молочный Plexiglas (2.05x3.05м)",
        nameServicePlaceholder: "Напр. Фрезерная резка АКП / акрила",
        category: "Категория (1-й уровень)",
        subcategory: "Подкатегория (2-й уровень)",
        customSubcategoryOption: "+ Своя подкатегория...",
        customSubcategoryLabel: "Название своей подкатегории",
        customSubcategoryPlaceholder: "Напр. Листовой вспененный ПВХ 5мм",
        unit: "Единица измерения",
        price: "Себестоимость (₸) *",
        pricePlaceholder: "0.00",
        supplier: "Поставщик материала *",
        supplierService: "Подрядчик / Исполнитель *",
        supplierManualOption: "Другой / Вручную",
        sourceUrl: "Ссылка на товар у поставщика",
        sourceUrlPlaceholder: "https://signtech.kz/catalog/...",
        photo: "Фотография позиции",
        photoUploadButton: "Загрузить фото",
        photoUploading: "Загрузка...",
        photoDelete: "Удалить фото",
        photoUrlPlaceholder: "https://... или ссылка на фото",
        photoOrUrl: "или вставьте URL:",
        specs: "Характеристики для умных фильтров",
        specsHint: "Кликните для добавления",
        specsPlaceholder: "Размер листа 2.05х3.05м, толщина 3мм, цвет белый...",
      },
      footer: {
        hotkeyHint: "для быстрого сохранения",
        cancel: "Отмена",
        save: "Сохранить изменения",
        create: "Создать позицию",
        saving: "Сохранение...",
      },
    },

    taxonomy: {
      title: "Центр управления каталогом и фильтрами",
      subtitle: "Настройка категорий, подкатегорий и характеристик сайдбара",
      tabs: {
        subcategories: "Подкатегории",
        facets: "Фильтры",
        synonyms: "Синонимы и сленг",
      },
      sidebar: {
        categoriesTitle: (count: number) => `Категории (${count})`,
        resetDefaults: "Сбросить к заводским",
      },
      subcategories: {
        addPlaceholder: (cat: string) => `Новая подкатегория в «${cat}»...`,
        addButton: "Добавить",
        itemsCount: (count: number) => `${count} поз.`,
        renameTooltip: "Переименовать подкатегорию",
        deleteTooltip: "Удалить подкатегорию",
        saveTooltip: "Сохранить",
        cancelTooltip: "Отмена",
      },
      facets: {
        selectLabel: "Выберите подкатегорию для настройки фильтров:",
        activeBadge: (count: number) => `${count} активно`,
        optionsCount: (count: number) => `${count} знач.`,
      },
      synonyms: {
        formTitle: "Добавить новое сокращение или сленг",
        formBadge: "Обучение поиска",
        aliasesLabel: "Что вводят менеджеры (через запятую)",
        aliasesPlaceholder: "Напр. плекс, стекло, оргстекло",
        targetLabel: "К какому слову в каталоге привязать",
        targetPlaceholder: "Напр. акрил",
        submitButton: "Обучить поиск этому правилу",
        zeroQueriesTitle: (count: number) => `Что искали менеджеры и не нашли (${count})`,
        zeroQueriesClear: "Очистить журнал",
        zeroQueriesHelp: "По этим фразам каталог вернул 0 результатов. Кликните «Обучить», чтобы привязать фразу:",
        zeroQueryTrain: "Обучить",
        rulesTitle: (count: number) => `База синонимов и сленга (${count})`,
        rulesSearchPlaceholder: "Поиск по правилам...",
        systemRuleBadge: "Системный",
        customRuleBadge: "Ваш",
        deleteRuleTooltip: "Удалить это правило",
      },
      footer: {
        autoSave: "Все изменения сохраняются автоматически",
        close: "Закрыть",
      },
      confirm: {
        resetTitle: "Сбросить к заводским настройкам?",
        resetDescription: "Все созданные вами подкатегории и кастомные фильтры будут возвращены к исходной структуре таксономии по умолчанию.",
        deleteSubTitle: "Удалить подкатегорию?",
        deleteSubDescriptionWithCount: (name: string, count: number) =>
          `В подкатегории «${name}» сейчас находится ${count} позиций. Если удалить подкатегорию, эти товары останутся в категории, но потеряют привязку.`,
        deleteSubDescription: (name: string) => `Вы уверены, что хотите удалить подкатегорию «${name}»?`,
        confirmDelete: "Да, удалить",
        cancel: "Отмена",
      },
    },

    cart: {
      title: "Корзина закупки (снабжение)",
      emptyTitle: "Корзина закупки пуста",
      emptySubtitle: "Добавляйте необходимые материалы в корзину кнопкой в строке или инспекторе.",
      totalSum: "Итого закупка:",
      clearCart: "Очистить корзину",
      orderWhatsApp: "Заказать в WhatsApp",
    },

    rate: {
      editTitle: "Редактировать тариф",
      createTitle: "Новый тариф сметы",
      subtitle: "Ставки работ, логистики или спецтехники",
      closeTooltip: "Закрыть (Esc)",
      categoryLabel: "Категория тарифа",
      nameLabel: "Название услуги / операции *",
      namePlaceholder: "Напр. Сборка объемных световых букв",
      unitLabel: "Единица расчета",
      costLabel: "ЗП мастера (Себестоимость)",
      priceLabel: "В смете для клиента",
      marginLabel: "Маржа компании:",
      markupLabel: "наценка",
      cancel: "Отмена",
      save: "Сохранить изменения",
      create: "Создать тариф",
    },

    inspector: {
      badge: "Инспектор материала",
      inCartBadge: (count: number) => `В корзине (${count})`,
      copyNameTooltip: "Скопировать наименование",
      copiedNotice: "Наименование скопировано",
      zoomTooltip: "Нажмите для увеличения фото",
      characteristicsTitle: "Характеристики и спецификация",
      supplierSectionTitle: "Поставщик и ссылка",
      openSourceLink: "Открыть страницу товара",
      quickPriceUpdate: "Быстрое изменение себестоимости:",
      priceSave: "Сохранить",
      addToCartButton: "В корзину снабжения",
      removeFromCartTooltip: "Удалить позицию из корзины закупки",
      removeFromCartButton: "Удалить из корзины",
      inCartStatus: (qty: number, unit: string) => `В корзине: ${qty} ${unit}`,
    },
  },

  toasts: {
    photoSaved: "Фотография сохранена",
    photoUploadError: (msg: string) => `Ошибка загрузки: ${msg}`,
    photoInvalidFormat: "Пожалуйста, выберите файл изображения (JPG, PNG, WebP)",
    priceUpdated: "Цена успешно обновлена",
    priceUpdateError: "Не удалось сохранить цену",
    cartItemAdded: (name: string, qty: number, unit: string) => `«${name}» (${qty} ${unit}) в корзине`,
    cartItemRemoved: (name: string) => `«${name}» удалено из корзины`,
    cartCleared: "Корзина закупа очищена",
  },
} as const;

export type PricingDictionary = typeof pricingDict;
