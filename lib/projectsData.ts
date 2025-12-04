// lib/projectsData.ts

export type ProjectCategory = 'letters' | 'lightbox' | 'neon' | 'panel' | 'roof' | 'entrance' | 'interior';

export interface Project {
  id: string;
  title: string;
  slug: string;
  date: string;       // Полная дата для сортировки
  year: string;       // Только год для отображения
  image: string;
  categories: ProjectCategory[];
  
  // Основные тексты
  description: string; // Краткое описание для превью
  location?: string;   // Где находится объект
  completionTime?: string; // Срок реализации

  // Storytelling (Блог)
  challenge: string;  // Задача / Проблема клиента
  process?: string;   // Как мы это делали (сложности, нюансы)
  solution: string;   // Итоговое решение

  // Траст-факторы (Технические характеристики)
  techSpecs: {
    face: string;     // Лицевая часть
    body: string;     // Борт / Корпус
    light: string;    // Светотехника
    mount: string;    // Тип монтажа
    warranty?: string;// Гарантия
  };

  // Медиа
  videoUrl?: string;  // Ссылка на YouTube (если есть)
  gallery?: string[]; // Доп. фото

  // Перелинковка
  relatedServiceSlug?: string; // Ссылка на страницу услуги (например, 'volume-letters/full-lit')
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
    year: '2023',
    image: '/qazpost.jpg',
    categories: ['letters', 'entrance'],
    description: 'Флагманское отделение QazPost. Комплексное оформление входной группы в строгом соответствии с брендбуком.',
    location: 'г. Астана, пр. Мангилик Ел, 55',
    completionTime: '10 рабочих дней',
    
    challenge: 'Необходимо было оформить входную группу государственного объекта. Главная сложность — строгое соответствие брендбуку (попадание в корпоративный синий цвет RAL 5005) и высокие требования к яркости, так как фасад выходит на оживленный проспект.',
    process: 'Мы использовали акрил Plexiglas специальной серии, который идеально передает цвет бренда при засветке. Каркас входной группы был усилен, чтобы выдержать ветровые нагрузки проспекта.',
    solution: 'Изготовили объемные буквы с лицевой подсветкой. Входной портал обшили алюминиевым композитом с фрезеровкой. Установили сверхъяркие модули ELF с линзой 160 градусов для равномерного свечения без пятен.',
    
    techSpecs: {
      face: 'Акрил Plexiglas 4мм (Германия)',
      body: 'ПВХ пластик 5мм + Пленка Oracal 641',
      light: 'Модули ELF Sol+ (IP67)',
      mount: 'На алюминиевый композит',
      warranty: '24 месяца'
    },

    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Пример
    relatedServiceSlug: 'volume-letters/face-lit',
    gallery: ['/qazpost2.jpg', '/images/calc/face.jpg', '/panel.jpg']
  },
  {
    id: '2',
    title: 'Юридическая компания 1Solution',
    slug: '1solution-office',
    date: '2023-10-20',
    year: '2023',
    image: '/1solution.jpg',
    categories: ['letters', 'interior', 'lightbox'],
    description: 'Премиальная интерьерная вывеска для зоны ресепшн. Сочетание контражура и инкрустации.',
    location: 'г. Астана, БЦ "Москва"',
    completionTime: '5 рабочих дней',
    
    challenge: 'Клиент хотел вывеску, которая подчеркнет статус юридической фирмы. Важно было избежать "дешевого пластикового блеска" и видимых проводов на дорогой декоративной штукатурке.',
    solution: 'Мы предложили комбинированное решение. Логотип выполнен методом инкрустации (акрил врезан в композитную основу заподлицо), а название компании — объемные буквы с контражурной подсветкой ("эффект парения").',
    
    techSpecs: {
      face: 'Композит "Царапанное серебро"',
      body: 'Прозрачный акрил 10мм',
      light: 'Контражур (Warm White 3000K)',
      mount: 'Скрытый, на дистанционные держатели',
      warranty: '36 месяцев'
    },
    
    relatedServiceSlug: 'volume-letters/back-lit',
    gallery: ['/neon.jpg', '/images/calc/back.jpg']
  },
  {
    id: '3',
    title: 'Аптека "Агро Семья"',
    slug: 'agro-semya',
    date: '2023-12-05',
    year: '2023',
    image: '/agro.jpg',
    categories: ['neon', 'letters', 'entrance'],
    description: 'Яркая комбинированная вывеска: классические буквы + гибкий неон 2-го поколения.',
    location: 'г. Астана, ул. Кенесары',
    completionTime: '7 рабочих дней',
    
    challenge: 'Аптека работает круглосуточно, поэтому вывеска должна "кричать" о себе в темноте. Нужно было совместить читабельность названия и эмоциональный визуальный образ (сердце/крест).',
    solution: 'Основной текст "DÄRIHANA" выполнен в виде классических световых букв для четкости. Декоративные элементы (логотип) сделаны из яркого зеленого гибкого неона, который привлекает внимание с 300 метров.',
    
    techSpecs: {
      face: 'Акрил 3мм + Пленка Oracal 8500',
      body: 'Силиконовый неон 12V (Neon Flex)',
      light: 'Комбинированная (Лицо + Неон)',
      mount: 'На металлокаркас (профтруба 20х20)',
      warranty: '12 месяцев'
    },
    
    relatedServiceSlug: 'neon',
    gallery: ['/agro.jpg', '/neon.jpg']
  },
  {
    id: '4',
    title: 'Агентство Fortuna',
    slug: 'fortuna-agency',
    date: '2024-01-10',
    year: '2024',
    image: '/fortuna.jpg',
    categories: ['letters', 'panel'],
    description: 'Фасадная группа с двухсторонним панель-кронштейном для захвата пешеходного трафика.',
    location: 'г. Астана, ЖК "Highvill"',
    completionTime: '8 рабочих дней',
    
    challenge: 'Офис находится в глубине аллеи. Проблема: клиенты проходили мимо, не замечая основную вывеску над дверью, так как шли вдоль стены.',
    solution: 'Мы установили яркую фасадную вывеску и дополнили её перпендикулярным панель-кронштейном (торцевым лайтбоксом). Теперь вывеску видно с обоих концов улицы.',
    
    techSpecs: {
      face: 'Молочный акрил 3мм',
      body: 'ПВХ 130мм (Глубокий борт)',
      light: 'Светодиодные кластеры 1.5W',
      mount: 'Фасадный анкерный крепеж',
      warranty: '24 месяца'
    },
    
    relatedServiceSlug: 'panel-brackets',
    gallery: ['/fortuna.jpg', '/panel.jpg']
  },
  {
    id: '5',
    title: 'KMG (КазМунайГаз)',
    slug: 'kmg-gas-station',
    date: '2023-09-01',
    year: '2023',
    image: '/kmg.jpeg',
    categories: ['roof', 'letters', 'entrance'],
    description: 'Ребрендинг АЗС. Крышная установка с расчетом ветровых нагрузок.',
    location: 'Трасса Астана-Караганда',
    completionTime: '14 рабочих дней',
    
    challenge: 'Объект находится в степной зоне с экстремальными ветровыми нагрузками. Требовалась конструкция, которая выдержит порывы ветра до 25 м/с и перепады температур от -40 до +40.',
    process: 'Инженеры разработали проект КМД. Сварили усиленный несущий каркас с дополнительными ребрами жесткости.',
    solution: 'Установили объемные буквы с алюминиевым бортом (он не трескается на морозе, в отличие от пластика). Использовали герметичные блоки питания IP67 с защитой от перепадов напряжения.',
    
    techSpecs: {
      face: 'Акрил 5мм (Усиленный)',
      body: 'Алюминиевый профиль (Порошковая покраска)',
      light: 'Герметичные модули Maxtor',
      mount: 'Крышная рама с пригрузами',
      warranty: '5 лет на конструкцию'
    },
    
    relatedServiceSlug: 'roof-installations',
    gallery: ['/kmg.jpeg', '/images/city.png']
  },
  {
    id: '6',
    title: 'Магазин BagNaz',
    slug: 'bagnaz-store',
    date: '2023-11-28',
    year: '2023',
    image: '/bagnaz.jpg',
    categories: ['lightbox', 'letters'],
    description: 'Фигурный световой короб. Оптимальное решение по соотношению цена/яркость.',
    location: 'г. Астана',
    completionTime: '4 рабочих дня',
    
    challenge: 'У клиента был ограниченный бюджет, но требовалась максимально яркая и большая вывеска.',
    solution: 'Вместо дорогих отдельных букв мы предложили фигурный лайтбокс. Это позволило сделать вывеску в 2 раза крупнее за те же деньги, сохранив яркость и читаемость.',
    
    techSpecs: {
      face: 'Сотовый поликарбонат + Транслюцентная пленка',
      body: 'Оцинкованная сталь',
      light: 'Светодиодная лента',
      mount: 'Прямой монтаж на фасад',
      warranty: '12 месяцев'
    },
    
    relatedServiceSlug: 'lightboxes',
    gallery: ['/bagnaz.jpg']
  },
  {
    id: '7',
    title: 'Neon Bar (Concept)',
    slug: 'neon-bar',
    date: '2024-02-14',
    year: '2024',
    image: '/neon.jpg',
    categories: ['neon', 'interior'],
    description: 'Инстаграмная фотозона из неона. Сложный шрифт и невидимая проводка.',
    location: 'Bar "Clouds", Астана',
    completionTime: '3 дня',
    
    challenge: 'Создать точку притяжения для гостей, где они будут делать селфи и отмечать бар в Instagram. Важна была эстетика вблизи: никаких торчащих проводов.',
    solution: 'Изготовили неоновую надпись на прозрачной акриловой подложке. Использовали микро-кабель 0.2мм для соединений, который практически не виден глазу.',
    
    techSpecs: {
      face: 'Силиконовый неон 6мм (Розовый)',
      body: 'Прозрачный акрил 5мм (Лазерная резка по контуру)',
      light: 'Свечение 360 градусов',
      mount: 'Дистанционные держатели (хром)',
      warranty: '12 месяцев'
    },
    
    relatedServiceSlug: 'neon',
    gallery: [
        '/qazpost.jpg', 
        '/qazpost2.jpg', 
        '/images/calc/face.jpg', 
        '/images/calc/lightbox-1.jpg', 
        '/panel.jpg'
    ]
  }
];