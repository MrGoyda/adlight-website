import Link from "next/link";
import { 
  ArrowRight, 
  Store,      
  Zap,        
  Building,   
  Layers,
  CheckCircle,
  Shield,
  Clock,
  ChevronRight
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import ComplexCTA from "@/components/ComplexCTA";

export const metadata = {
  title: "Каталог услуг ADLight | Наружная реклама в Астане",
  description: "Полный спектр услуг: вывески, лайтбоксы, неон, крышные установки.",
};

// Данные для каталога (с ID для якорей)
const catalog = [
  {
    id: "facade", // Якорь для скролла
    category: "Фасадная реклама",
    icon: <Store className="w-5 h-5"/>,
    color: "text-orange-500",
    items: [
      {
        title: "Объемные буквы",
        price: "от 400 ₸/см",
        link: "/services/volume-letters",
        image: "/images/calc/face.jpg",
        tags: ["Хит продаж", "Согласование", "Гарантия 1 год"]
      },
      {
        title: "Световые короба",
        price: "от 45 000 ₸/м²",
        link: "#", 
        image: "/images/calc/lightbox-1.jpg",
        tags: ["Много текста", "Яркость", "Любая форма"]
      },
      {
        title: "Панель-кронштейны",
        price: "от 35 000 ₸",
        link: "#",
        image: "/panel.jpg",
        tags: ["Двусторонние", "Для пешеходов", "Компактно"]
      }
    ]
  },
  {
    id: "interior", // Якорь
    category: "Интерьер и Атмосфера",
    icon: <Zap className="w-5 h-5"/>,
    color: "text-purple-500",
    items: [
      {
        title: "Неоновые вывески",
        price: "Индивидуально",
        link: "#",
        image: "/neon.jpg",
        tags: ["Flex Neon 2.0", "Для фотозон", "Безопасно"]
      },
      {
        title: "Интерьерные лого",
        price: "от 25 000 ₸",
        link: "#",
        image: "/1solution.jpg",
        tags: ["Тонкий акрил", "Ресепшн", "Контражур"]
      }
    ]
  },
  {
    id: "scale", // Якорь
    category: "Инженерные проекты",
    icon: <Building className="w-5 h-5"/>,
    color: "text-blue-500",
    items: [
      {
        title: "Крышные установки",
        price: "Проектно",
        link: "#",
        image: "/krisha.jpg",
        tags: ["Документация", "Нагрузки", "Масштаб"]
      },
      {
        title: "Входные группы",
        price: "Проектно",
        link: "#",
        image: "/agro.jpg",
        tags: ["Композит", "Козырьки", "Облицовка"]
      }
    ]
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#020617] font-sans selection:bg-orange-500/30">
      
      {/* 1. HERO SECTION (ТОТ САМЫЙ, С ГОРОДОМ) */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/80 to-[#020617]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
           
           {/* ХЛЕБНЫЕ КРОШКИ */}
           <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4"/>
              <span className="text-blue-500 font-medium">Услуги</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Левая часть: Текст */}
              <div className="max-w-2xl relative z-20">
                  <h1 data-aos="fade-up" className="text-5xl md:text-7xl font-bold text-white mb-8 leading-[0.95] tracking-tight">
                     Комплексное оформление <br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">бизнеса в Астане</span>
                  </h1>
                  <p data-aos="fade-up" data-aos-delay="100" className="text-gray-400 text-lg md:text-xl mb-12 leading-relaxed border-l-2 border-blue-500/30 pl-6">
                     От таблички на дверь до крышной установки. Собственное производство. Делаем рекламу, которая переживет зиму и пройдет согласование в Акимате.
                  </p>
                  
                  {/* Навигация (Якоря) */}
                  <div data-aos="fade-up" data-aos-delay="200" className="flex flex-wrap gap-3">
                     <a href="#facade" className="group px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-orange-500/50 transition flex items-center gap-3 text-white text-sm sm:text-base">
                        <div className="p-1.5 bg-orange-500/20 rounded-lg text-orange-500 group-hover:text-white group-hover:bg-orange-500 transition"><Store className="w-4 h-4"/></div>
                        <span className="font-bold">Фасадные</span>
                     </a>
                     <a href="#interior" className="group px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition flex items-center gap-3 text-white text-sm sm:text-base">
                        <div className="p-1.5 bg-purple-500/20 rounded-lg text-purple-500 group-hover:text-white group-hover:bg-purple-500 transition"><Zap className="w-4 h-4"/></div>
                        <span className="font-bold">Интерьер</span>
                     </a>
                     <a href="#scale" className="group px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition flex items-center gap-3 text-white text-sm sm:text-base">
                        <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-500 group-hover:text-white group-hover:bg-blue-500 transition"><Building className="w-4 h-4"/></div>
                        <span className="font-bold">Крупные</span>
                     </a>
                  </div>
              </div>

              {/* Правая часть: 3D Город (СКРЫТ НА МОБИЛЬНЫХ) */}
              <div className="hidden lg:flex relative h-[500px] w-full items-center justify-center" data-aos="fade-left" data-aos-delay="300">
                  <div className="absolute inset-0 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none"></div>
                  <img 
                    src="/images/city.png" 
                    alt="Комплексное оформление города" 
                    className="relative w-full h-full object-contain drop-shadow-2xl z-10"
                  />
              </div>
           </div>
        </div>
      </section>

      {/* 2. КАТАЛОГ (КОМПАКТНЫЙ GRID) */}
      <div className="container mx-auto px-4 pb-24">
         
         {catalog.map((group, idx) => (
            <div key={idx} id={group.id} className="mb-16 last:mb-0 scroll-mt-24">
               {/* Заголовок группы */}
               <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4" data-aos="fade-up">
                  <div className={`p-2 rounded-lg bg-white/5 ${group.color}`}>
                     {group.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-white">{group.category}</h2>
               </div>

               {/* Сетка карточек */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.items.map((item, i) => (
                     <Link 
                        href={item.link} 
                        key={i}
                        data-aos="fade-up"
                        data-aos-delay={i * 100}
                        className="group relative h-[280px] rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all duration-300 bg-[#0B1221]"
                     >
                        {/* Картинка */}
                        <div className="absolute inset-0">
                           <img 
                              src={item.image} 
                              className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700" 
                              alt={item.title}
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent"></div>
                        </div>

                        {/* Контент */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-between">
                           
                           {/* Верх: Ярлыки (Tags) */}
                           <div className="flex flex-wrap gap-2">
                              {item.tags.map((tag, t) => (
                                 <span key={t} className="px-2 py-1 rounded-md bg-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white/90 border border-white/5">
                                    {tag}
                                 </span>
                              ))}
                           </div>

                           {/* Низ: Заголовок и Цена */}
                           <div>
                              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">
                                 {item.title}
                              </h3>
                              <div className="flex items-center justify-between mt-2">
                                 <span className="text-gray-400 text-sm font-medium">{item.price}</span>
                                 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-orange-500 transition-colors">
                                    <ArrowRight className="w-4 h-4"/>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </Link>
                  ))}
               </div>
            </div>
         ))}

      </div>

      {/* 4. ЛИД-МАГНИТ */}
      <ComplexCTA source="Страница: Каталог Услуг" />

    </div>
  );
}