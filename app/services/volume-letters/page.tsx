import Link from "next/link";
import Image from "next/image";
import { 
  Calculator, 
  CheckCircle, 
  ArrowRight, 
  ChevronRight, 
  Thermometer, 
  PaintBucket, 
  Layers, 
  FileCheck,
  MessageCircle,
  Eye,          
  Sun,          
  Zap,          
  ShieldCheck,  
  Wrench,       
  Lightbulb,    
  Grid3X3,      
  Clock,
  Ruler,
  Moon
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import CallToAction from "@/components/CallToAction";
import ProjectsBento from "@/components/ProjectsBento";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import DesignCodeBlock from "@/components/DesignCodeBlock";

// --- БАЗА ДАННЫХ ТИПОВ БУКВ ---
export const volumeLettersCatalog = [
  {
    id: 1,
    slug: 'face-lit',
    title: 'Световое лицо', 
    description: 'Классический выбор. Светится только лицевая часть.',
    price: "от 450 ₸/см",
    images: {
      day: '/images/letters/face-lit-day.png',
      night: '/images/letters/face-lit-night.png',
    },
    badge: "Хит"
  },
  {
    id: 2,
    slug: 'full-lit',
    title: 'Лицо + Борт',
    description: 'Максимальная яркость. Буква светится целиком.',
    price: "от 650 ₸/см",
    images: {
      day: '/images/letters/full-lit-day.png',
      night: '/images/letters/full-lit-night.png',
    },
    badge: "Premium"
  },
  {
    id: 3,
    slug: 'back-lit',
    title: 'Контражур',
    description: 'Эффект парения. Свет падает на фасад.',
    price: "от 550 ₸/см",
    images: {
      day: '/images/letters/back-lit-day.png',
      night: '/images/letters/back-lit-night.png',
    },
  },
  {
    id: 4,
    slug: 'combo-lit',
    title: 'Лицо + Контражур',
    description: 'Комбинированная подсветка для вау-эффекта.',
    price: "от 850 ₸/см",
    images: {
      day: '/images/letters/combo-lit-day.png',
      night: '/images/letters/combo-lit-night.png',
    },
  },
  {
    id: 5,
    slug: 'side-lit',
    title: 'Светятся борта',
    description: 'Нестандартно: лицо глухое, светятся грани.',
    price: "от 600 ₸/см",
    images: {
      day: '/images/letters/side-lit-day.png',
      night: '/images/letters/side-lit-night.png',
    },
  },
  {
    id: 6,
    slug: 'perforated',
    title: 'Перфорация',
    description: 'Эффект мерцания и блеска на боковинах.',
    price: "от 750 ₸/см",
    images: {
      day: '/images/letters/perforated-day.png',
      night: '/images/letters/perforated-night.png',
    },
  },
  {
    id: 7,
    slug: 'acrylic-slim',
    title: 'Тонкие (Акрил)',
    description: 'Ультратонкие буквы из массива акрила.',
    price: "от 900 ₸/см",
    images: {
      day: '/images/letters/acrylic-slim-day.png',
      night: '/images/letters/acrylic-slim-night.png',
    },
  },
  {
    id: 8,
    slug: 'loft-lamps',
    title: 'Ретро (Лампы)',
    description: 'Лофт стиль с открытыми лампами.',
    price: "от 1200 ₸/см",
    images: {
      day: '/images/letters/loft-lamps-day.png',
      night: '/images/letters/loft-lamps-night.png',
    },
  },
  {
    id: 9,
    slug: 'pixel-led',
    title: 'Пиксельные',
    description: 'Открытые светодиоды. Сверхъяркость.',
    price: "от 800 ₸/см",
    images: {
      day: '/images/letters/pixel-led-day.png',
      night: '/images/letters/pixel-led-night.png',
    },
  },
  {
    id: 10,
    slug: 'wood-style',
    title: 'Дерево / Эко',
    description: 'Натуральные материалы для уюта.',
    price: "от 350 ₸/см",
    images: {
      day: '/images/letters/wood-style-day.png',
      night: '/images/letters/wood-style-night.png',
    },
  },
  {
    id: 11,
    slug: 'non-lit',
    title: 'Без подсветки',
    description: 'Бюджетное решение. ПВХ или акрил.',
    price: "от 200 ₸/см",
    images: {
      day: '/images/letters/non-lit-day.png',
      night: '/images/letters/non-lit-night.png',
    },
  },
  {
    id: 12,
    slug: 'day-night-effect',
    title: 'День / Ночь',
    description: 'Днем черные, ночью светятся белым.',
    price: "от 700 ₸/см",
    images: {
      day: '/images/letters/day-night-effect-day.png',
      night: '/images/letters/day-night-effect-night.png',
    },
  },
];

export const metadata = {
  title: "Изготовление объемных букв в Астане | ADLight",
  description: "Производство, монтаж и обслуживание световых вывесок любой сложности. Создаем визуальный образ, который продает ваш бизнес 24/7.",
};

export default function VolumeLettersPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative py-24 lg:py-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-orange-600/5"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           
           {/* ХЛЕБНЫЕ КРОШКИ */}
           <div data-aos="fade-down" className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4"/>
              <Link href="/services" className="hover:text-white transition">Услуги</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4"/>
              <span className="text-orange-500 font-medium">Объемные буквы</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                 <div data-aos="fade-right" className="inline-block px-4 py-1.5 mb-6 text-xs font-bold text-orange-500 bg-orange-500/10 border border-orange-500/20 rounded-full uppercase tracking-wider">
                    Гарантия 1 год по договору
                 </div>
                 {/* НОВЫЙ ЗАГОЛОВОК */}
                 <h1 data-aos="fade-right" data-aos-delay="100" className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    Изготовление объемных <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">букв в Астане</span>
                 </h1>
                 {/* НОВЫЙ ПОДЗАГОЛОВОК */}
                 <p data-aos="fade-right" data-aos-delay="200" className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl">
                    Яркие, долговечные и <strong>строго по Дизайн-коду</strong>. Сделаем вывеску, которая приведет клиентов и не вызовет вопросов у Акимата. Собственный цех, срок от 3 дней.
                 </p>
                 
                 <div data-aos="fade-right" data-aos-delay="300" className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition shadow-lg shadow-orange-900/20 active:scale-95">
                       <Calculator className="w-5 h-5"/> Рассчитать стоимость
                    </Link>
                    
                    <a href="https://wa.me/77071356701" target="_blank" className="flex items-center justify-center gap-2 border border-slate-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 hover:border-slate-500 transition active:scale-95">
                       <MessageCircle className="w-5 h-5 text-green-500"/> Написать в WhatsApp
                    </a>
                 </div>
              </div>

              {/* Визуал оставляем как был */}
              <div className="relative" data-aos="zoom-in" data-aos-delay="200">
                 <div className="aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden relative group shadow-2xl">
                    <Image 
                       src={volumeLettersCatalog[0].images.night} 
                       alt="Объемные буквы" 
                       fill 
                       className="object-cover opacity-80 group-hover:scale-105 transition duration-700"
                       sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4">
                       <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                          <FileCheck className="w-6 h-6"/>
                       </div>
                       <div>
                          <div className="text-white font-bold">Гарантия качества</div>
                          <div className="text-gray-400 text-xs">Соблюдаем Дизайн-код</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2. КЛИЕНТЫ */}
      <ClientsMarquee />

      {/* 3. ВВОДНЫЙ БЛОК: ПСИХОЛОГИЯ */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-[#0B1120] to-[#1a2035] rounded-3xl p-8 md:p-12 border border-slate-800 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>
               
               <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                  <div>
                     <h2 className="text-3xl font-bold text-white mb-6">Лицо вашего бизнеса начинается с вывески</h2>
                     <p className="text-gray-400 text-lg leading-relaxed mb-6">
                        Когда клиент впервые видит вашу компанию, он оценивает не только товары, но и статус бизнеса. В городской среде Астаны визуальный образ играет ключевую роль.
                     </p>
                     <div className="flex items-start gap-4">
                        <div className="p-3 bg-orange-500/20 rounded-xl text-orange-500 shrink-0">
                           <Eye className="w-6 h-6"/>
                        </div>
                        <div>
                           <h4 className="text-white font-bold mb-1">Визуальный якорь</h4>
                           <p className="text-gray-400 text-sm">Объемные буквы работают днем и ночью, формируют доверие и говорят о бренде без слов.</p>
                        </div>
                     </div>
                  </div>
                  
                  <div className="bg-slate-900/80 p-8 rounded-2xl border border-slate-700 text-center">
                     <div className="text-sm text-gray-500 uppercase tracking-widest mb-2">Научный факт</div>
                     <div className="text-6xl font-black text-white mb-2">42%</div>
                     <p className="text-gray-300">
                        На столько быстрее человеческий глаз фиксируется на <span className="text-orange-500 font-bold">объемном объекте</span>, чем на плоском.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. КАТАЛОГ ТИПОВ */}
      <section className="py-24 bg-[#0F172A] border-y border-slate-800">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Типы объемных букв</h2>
               <p className="text-gray-400">Наведите на карточку, чтобы увидеть, как вывеска выглядит днем</p>
            </div>
            
            <div className="flex overflow-x-auto pb-8 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0 md:px-0 hide-scrollbar snap-x snap-mandatory">
               
               {volumeLettersCatalog.map((type) => (
                  <Link 
                    href={`/services/volume-letters/${type.slug}`} 
                    key={type.id}
                    className="group relative flex flex-col min-w-[230px] md:min-w-0 snap-center flex-shrink-0 rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-orange-500/50 transition-all duration-300 cursor-pointer h-[340px] md:h-[400px]"
                  >
                     {/* Контейнер изображений */}
                     <div className="relative h-[160px] md:h-[220px] w-full overflow-hidden bg-black shrink-0">
                        {type.badge && (
                           <div className="absolute top-3 right-3 z-20 bg-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-lg">
                              {type.badge}
                           </div>
                        )}

                        {/* Ночь */}
                        <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0 z-10">
                           <Image 
                             src={type.images.night} 
                             alt={`${type.title} ночью`} 
                             fill 
                             className="object-cover"
                             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" // <-- ДОБАВЛЕН SIZES
                           />
                           <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] text-white flex items-center gap-1">
                              <Moon className="w-3 h-3 text-blue-400"/> Ночной вид
                           </div>
                        </div>

                        {/* День */}
                        <div className="absolute inset-0">
                           <Image 
                             src={type.images.day} 
                             alt={`${type.title} днем`} 
                             fill 
                             className="object-cover"
                             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" // <-- ДОБАВЛЕН SIZES
                           />
                           <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur px-2 py-1 rounded text-[10px] text-black flex items-center gap-1">
                              <Sun className="w-3 h-3 text-orange-500"/> Дневной вид
                           </div>
                        </div>
                     </div>

                     <div className="p-4 md:p-6 flex flex-col flex-1 justify-between">
                        <div>
                           <h3 className="text-base md:text-lg font-bold text-white mb-2 leading-tight group-hover:text-orange-500 transition-colors">
                              {type.title}
                           </h3>
                           <p className="text-xs md:text-sm text-gray-400 line-clamp-3 leading-relaxed">
                              {type.description}
                           </p>
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-800">
                           <span className="text-white font-medium text-xs md:text-sm bg-slate-800 px-2 py-1 rounded">
                              {type.price}
                           </span>
                           <div className="flex items-center text-orange-500 text-xs md:text-sm font-bold gap-1 group-hover:gap-2 transition-all">
                              <ArrowRight className="w-4 h-4"/>
                           </div>
                        </div>
                     </div>
                  </Link>
               ))}

            </div>
         </div>
      </section>

      {/* 5. ТЕХНИЧЕСКАЯ ЧАСТЬ */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
               <div>
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Инженерная точность</h2>
                  <p className="text-gray-400 max-w-xl text-lg">
                     Мы знаем суровый климат Астаны. Наши вывески выдерживают жару, морозы, сильные ветра и снег.
                  </p>
               </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800">
                  <div className="w-14 h-14 bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500 rounded-xl"><Layers className="w-7 h-7"/></div>
                  <h3 className="text-xl font-bold text-white mb-4">Материалы</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Используем ударопрочный акрил, ПВХ, алюминий и нержавеющую сталь. Никакой желтизны и трещин через год эксплуатации.
                  </p>
               </div>
               <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800">
                  <div className="w-14 h-14 bg-orange-500/10 flex items-center justify-center mb-6 text-orange-500 rounded-xl"><Zap className="w-7 h-7"/></div>
                  <h3 className="text-xl font-bold text-white mb-4">Свет</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Герметичные светодиодные модули и линзованные диоды. Равномерная засветка без пятен и теней. Запас яркости +30%.
                  </p>
               </div>
               <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800">
                  <div className="w-14 h-14 bg-green-500/10 flex items-center justify-center mb-6 text-green-500 rounded-xl"><ShieldCheck className="w-7 h-7"/></div>
                  <h3 className="text-xl font-bold text-white mb-4">Безопасность</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Скрытая проводка в кабель-каналах. Надежная герметизация всех узлов и блоков питания для защиты от влаги IP67.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* 6. ЦЕНООБРАЗОВАНИЕ */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800">
         <div className="container mx-auto px-4">
             <div className="max-w-4xl mx-auto text-center">
                 <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Сколько стоит ваша вывеска?</h2>
                 <p className="text-gray-400 text-lg mb-12 leading-relaxed">
                    Мы не используем фиксированные "пакетные" цены, потому что каждая вывеска уникальна. 
                    Стоимость складывается из точных размеров, типа шрифта и выбранных материалов.
                 </p>

                 <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 border border-slate-700 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-orange-500/20 transition duration-700"></div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-900/20 mb-6 transform -rotate-3 group-hover:rotate-0 transition duration-300">
                            <Calculator className="w-10 h-10 text-white"/>
                        </div>
                        
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Рассчитайте бюджет за 1 минуту</h3>
                        <p className="text-gray-400 max-w-lg mb-8">
                           Воспользуйтесь нашим онлайн-калькулятором. Введите текст вывески, выберите высоту букв и узнайте ориентировочную стоимость прямо сейчас.
                        </p>

                        <Link href="/calculator" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-orange-600 font-bold text-lg rounded-xl hover:bg-gray-100 transition shadow-xl active:scale-95">
                           Перейти в калькулятор <ArrowRight className="w-5 h-5"/>
                        </Link>
                    </div>
                 </div>

                 <div className="grid md:grid-cols-3 gap-6 mt-12 text-left">
                    <div className="flex gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                       <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-orange-500 shrink-0 border border-slate-700"><Ruler className="w-5 h-5"/></div>
                       <div>
                          <h4 className="text-white font-bold mb-1">Размеры</h4>
                          <p className="text-gray-500 text-xs leading-relaxed">Цена зависит от высоты букв. Считаем каждый сантиметр, без округлений.</p>
                       </div>
                    </div>
                    <div className="flex gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                       <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-500 shrink-0 border border-slate-700"><Layers className="w-5 h-5"/></div>
                       <div>
                          <h4 className="text-white font-bold mb-1">Материалы</h4>
                          <p className="text-gray-500 text-xs leading-relaxed">Литой акрил дороже обычного пластика, но служит в 3 раза дольше.</p>
                       </div>
                    </div>
                    <div className="flex gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                       <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-green-500 shrink-0 border border-slate-700"><Zap className="w-5 h-5"/></div>
                       <div>
                          <h4 className="text-white font-bold mb-1">Шрифт</h4>
                          <p className="text-gray-500 text-xs leading-relaxed">Простые шрифты дешевле. Рукописные или с засечками требуют сложной ручной сборки.</p>
                       </div>
                    </div>
                 </div>
             </div>
         </div>
      </section>

      {/* 7. ДИЗАЙН КОД */}
      <DesignCodeBlock />

      {/* 8. ЭТАПЫ */}
      <section className="py-24 bg-slate-950">
        <div className="container mx-auto px-4">
           <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">От заявки до монтажа — 5 шагов</h2>
           <div className="grid md:grid-cols-5 gap-8 relative">
              <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-slate-800 -z-10"></div>
              {[
                 {step: "01", title: "Заявка", desc: "Вы присылаете фото фасада и текст/логотип."},
                 {step: "02", title: "Макет", desc: "Делаем 2-3 варианта визуализации и смету под разный бюджет."},
                 {step: "03", title: "Договор", desc: "Фиксируем цену, сроки и гарантию документально."},
                 {step: "04", title: "Цех", desc: "Фрезеровка, сборка и установка светодиодов в нашем цехе."},
                 {step: "05", title: "Монтаж", desc: "Установка в удобное время, подключение и сдача работы."}
              ].map((item, i) => (
                 <div key={i} data-aos="fade-up" data-aos-delay={i * 100} className="relative group bg-slate-950">
                    <div className="w-16 h-16 bg-slate-900 border-2 border-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6 mx-auto z-10 shadow-lg shadow-orange-900/20">{item.step}</div>
                    <h3 className="text-lg font-bold text-white text-center mb-3">{item.title}</h3>
                    <p className="text-gray-400 text-center text-xs leading-relaxed">{item.desc}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 9. СОВЕТЫ */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800">
         <div className="container mx-auto px-4">
             <div className="flex items-start gap-6 mb-12">
                <div className="p-4 bg-green-500/10 rounded-2xl text-green-500 shrink-0 hidden md:block"><Wrench className="w-8 h-8"/></div>
                <div>
                   <h2 className="text-3xl font-bold text-white mb-2">Как продлить жизнь вывеске?</h2>
                   <p className="text-gray-400">Советы экспертов ADLight</p>
                </div>
             </div>
             
             <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                   <div className="flex items-center gap-3 mb-4 text-white font-bold"><Clock className="w-5 h-5 text-orange-500"/> Режим работы</div>
                   <p className="text-gray-400 text-sm leading-relaxed">Рекомендуем использовать фотореле или таймер для отключения вывески в светлое время суток. Это экономит ресурс диодов.</p>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                   <div className="flex items-center gap-3 mb-4 text-white font-bold"><PaintBucket className="w-5 h-5 text-blue-500"/> Чистка</div>
                   <p className="text-gray-400 text-sm leading-relaxed">Пыль и грязь снижают яркость на 20-30%. Рекомендуем проводить мойку вывески минимум 1-2 раза в год.</p>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                   <div className="flex items-center gap-3 mb-4 text-white font-bold"><ShieldCheck className="w-5 h-5 text-green-500"/> Обслуживание</div>
                   <p className="text-gray-400 text-sm leading-relaxed">Мы предоставляем гарантийное и постгарантийное обслуживание: замена блоков питания, проверка контактов.</p>
                </div>
             </div>
         </div>
      </section>

      {/* 10. КОМПОНЕНТЫ */}
      <ProjectsBento title="Примеры объемных букв" subtitle="Наши работы в Астане" />
      <ReviewsCarousel />
      <ServicesCarousel title="Что еще мы производим" subtitle="Другие виды наружной рекламы" hiddenLink="/services/volume-letters"/>
      <CallToAction source="Услуга: Объемные буквы" />

    </div>
  );
}