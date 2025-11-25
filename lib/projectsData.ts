// lib/projectsData.ts

export type ProjectCategory = 'letters' | 'lightbox' | 'neon' | 'panel' | 'roof' | 'entrance' | 'interior';

export interface Project {
  id: string;
  title: string;
  slug: string;
  date: string;
  image: string;
  categories: ProjectCategory[];
  description: string;
  location?: string;
  completionTime?: string;
  challenge?: string;
  solution?: string;
  specs?: { label: string; value: string }[];
  gallery?: string[];
  
  // НОВОЕ ПОЛЕ (Необязательное)
  videoUrl?: string; 
}

export const CATEGORIES: { id: ProjectCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Все работы' },
  { id: 'letters', label: 'Объемные буквы' },
  { id: 'lightbox', label: 'Лайтбоксы' },
  { id: 'neon', label: 'Неон' },
  { id: 'panel', label: 'Панель-кронштейны' },
  { id: 'roof', label: 'Крышные установки' },
  { id: 'entrance', label: 'Входные группы' },
  { id: 'interior', label: 'Интерьер' },
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'БЦ "Monolith" / QazPost',
    slug: 'qazpost-monolith',
    date: '2023-11-15',
    image: '/qazpost.jpg',
    categories: ['letters', 'entrance'],
    description: 'Комплексное оформление входной группы...',
    location: 'г. Астана, пр. Мангилик Ел, 55',
    
    // ДОБАВИМ СЮДА ВИДЕО (Пример)
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Сюда вставлять ID видео или Embed ссылку
    
    completionTime: '10 дней',
    challenge: 'Оформить входную группу государственного объекта в строгом соответствии с брендбуком и дизайн-кодом столицы. Требовалась повышенная яркость для видимости с проспекта.',
    solution: 'Мы изготовили объемные буквы с лицевой подсветкой из акрила Plexiglas. Для максимальной яркости использовали модули ELF с линзой 160 градусов. Входная группа обшита алюминиевым композитом.',
    specs: [
      { label: 'Высота букв', value: '80 см' },
      { label: 'Материал лица', value: 'Акрил 4мм' },
      { label: 'Подсветка', value: 'Светодиодные модули IP67' },
      { label: 'Гарантия', value: '2 года' }
    ],
    gallery: ['/qazpost2.jpg', '/images/calc/face.jpg', '/panel.jpg']
  },
  {
    id: '2',
    title: 'Юридическая компания 1Solution',
    slug: '1solution-office',
    date: '2023-10-20',
    image: '/1solution.jpg',
    categories: ['letters', 'interior', 'lightbox'],
    description: 'Интерьерная вывеска для офиса. Лайтбокс с инкрустацией и контражурные буквы.',
    location: 'г. Астана, БЦ "Москва"',
    completionTime: '5 дней',
    challenge: 'Создать премиальную вывеску для зоны ресепшн. Важно было подчеркнуть статус компании и вписаться в строгий интерьер.',
    solution: 'Использовали технологию контражурной подсветки — буквы "парят" в воздухе. Логотип выполнен методом инкрустации (акрил врезан в композит).',
    specs: [
      { label: 'Тип', value: 'Интерьерная вывеска' },
      { label: 'Технология', value: 'Контражур + Инкрустация' },
      { label: 'Монтаж', value: 'Скрытый крепеж' }
    ],
    gallery: ['/neon.jpg', '/images/calc/back.jpg']
  },
  {
    id: '3',
    title: 'Аптека "Агро Семья"',
    slug: 'agro-semya',
    date: '2023-12-05',
    image: '/agro.jpg',
    categories: ['neon', 'letters', 'entrance'],
    description: 'Яркое оформление аптеки. Зеленый гибкий неон и объемные буквы на подложке.',
    location: 'г. Астана, ул. Кенесары',
    completionTime: '7 дней',
    challenge: 'Сделать аптеку максимально заметной в ночное время среди конкурентов.',
    solution: 'Комбинированное решение: основной текст выполнен объемными буквами, а декоративные элементы (крест, сердце) — из яркого гибкого неона 2-го поколения.',
    specs: [
      { label: 'Неон', value: 'Flex Neon 12V' },
      { label: 'Основа', value: 'Композитная подложка' },
      { label: 'Защита', value: 'Уличная (IP65)' }
    ],
    gallery: ['/agro.jpg', '/neon.jpg']
  },
  {
    id: '4',
    title: 'Агентство Fortuna',
    slug: 'fortuna-agency',
    date: '2024-01-10',
    image: '/fortuna.jpg',
    categories: ['letters', 'panel'],
    description: 'Фасадная вывеска и двусторонний панель-кронштейн для видимости с тротуара.',
    location: 'г. Астана, ЖК "Highvill"',
    challenge: 'Обеспечить видимость вывески не только с дороги, но и для пешеходов, идущих вдоль здания.',
    solution: 'Установили основную вывеску над входом и дополнили её ярким двусторонним панель-кронштейном (торцевой вывеской), который отлично видно с тротуара.',
    specs: [
        { label: 'Вывеска', value: 'Объемные буквы' },
        { label: 'Кронштейн', value: 'Лайтбокс 50х50 см' }
    ],
    gallery: ['/fortuna.jpg', '/panel.jpg']
  },
  {
    id: '5',
    title: 'KMG (КазМунайГаз)',
    slug: 'kmg-gas-station',
    date: '2023-09-01',
    image: '/kmg.jpeg',
    categories: ['roof', 'letters', 'entrance'],
    description: 'Масштабный проект: крышная установка и брендирование стелы АЗС.',
    location: 'Трасса Астана-Караганда',
    challenge: 'Ребрендинг АЗС. Изготовление крупногабаритных букв, устойчивых к сильным ветровым нагрузкам в степи.',
    solution: 'Разработали проект КМД (конструкции металлические деталировочные). Усилили каркас. Использовали алюминиевый борт для букв.',
    specs: [
        { label: 'Высота букв', value: '1.5 метра' },
        { label: 'Каркас', value: 'Профильная труба' },
        { label: 'Расчет', value: 'Ветровая нагрузка III район' }
    ],
    gallery: ['/kmg.jpeg', '/images/city.png']
  },
  {
    id: '6',
    title: 'Магазин BagNaz',
    slug: 'bagnaz-store',
    date: '2023-11-28',
    image: '/bagnaz.jpg',
    categories: ['lightbox', 'letters'],
    description: 'Световой короб сложной формы и объемные элементы.',
    location: 'г. Астана',
    challenge: 'Сделать бюджетную, но яркую вывеску.',
    solution: 'Использовали фигурный лайтбокс вместо отдельных букв, что позволило снизить стоимость, сохранив площадь свечения.',
    specs: [
        { label: 'Тип', value: 'Фигурный короб' },
        { label: 'Лицо', value: 'Сотовый поликарбонат + пленка' }
    ],
    gallery: ['/bagnaz.jpg']
  },
  {
    id: '7',
    title: 'Neon Bar (Concept)',
    slug: 'neon-bar',
    date: '2024-02-14',
    image: '/neon.jpg',
    categories: ['neon', 'interior'],
    description: 'Декоративное неоновое оформление фотозоны.',
    location: 'Bar "Clouds"',
    challenge: 'Создать "Instagrammable" место в заведении.',
    solution: 'Сложная неоновая надпись на прозрачном акриле. Невидимые провода.',
    specs: [
        { label: 'Материал', value: 'Силиконовый неон 6мм' },
        { label: 'Подложка', value: 'Прозрачный акрил 5мм' }
    ],
    gallery: [
        '/qazpost.jpg', 
        '/qazpost2.jpg', 
        '/images/calc/face.jpg', 
        '/images/calc/lightbox-1.jpg', 
        '/panel.jpg'
    ]
  }
];