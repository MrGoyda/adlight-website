// app/design-code/page.tsx

import Link from "next/link";
import { Metadata } from "next";
import { 
  CheckCircle, 
  XCircle, 
  Ruler, 
  ChevronRight, 
  BookOpen,
  MapPin,
  Layout,
  Ban,
  Languages, 
  FileText,  
  Copyright, 
  Clock,     
  Info,
  ShieldAlert
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import DesignCodeHeroButtons from "@/components/DesignCodeHeroButtons"; 
import DesignCodeTabs from "@/components/DesignCodeTabs"; 
import Card from "@/components/ui/Card";
import Typography from "@/components/ui/Typography";

// --- ИМПОРТ СЛОВАРЯ ---
import { DESIGN_CODE_WAYS, DESIGN_CODE_RULES, DESIGN_CODE_BANS } from "@/dictionaries/design-code";

// 1. УЛУЧШЕННЫЕ METADATA (SEO/GEO)
export const metadata: Metadata = {
  title: "Дизайн-код Астаны 2025 | Требования к вывескам и рекламе",
  description: "Правила размещения наружной рекламы в Астане. Как избежать штрафов и демонтажа? Согласование эскизов, получение паспорта рекламы, языковые нормы.",
  keywords: ["дизайн код астана", "паспорт рекламы", "согласование вывески", "штраф за рекламу", "закон о языках", "урбанистика астана"],
  openGraph: {
    title: "Гид по Дизайн-коду Астаны",
    description: "Единые правила оформления фасадов. Узнайте, соответствует ли ваша вывеска закону.",
    images: ["/images/design-code/hero.webp"]
  }
};

const IconMap = {
  Languages,
  FileText,
  Copyright,
  MapPin,
  Layout,
  Ruler
};

function renderIcon(iconName: string, className = "w-7 h-7") {
  const IconComponent = IconMap[iconName as keyof typeof IconMap] || Info;
  return <IconComponent className={className} />;
}

export default function DesignCodePage() {

  // 2. SCHEMA.ORG (FAQ + Article) для ИИ
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": "Правила Дизайн-кода Астаны для вывесок",
        "description": "Руководство по размещению наружной рекламы: разрешенные размеры, места и типы конструкций.",
        "author": { "@type": "Organization", "name": "ADLight" },
        "publisher": { 
           "@type": "Organization", 
           "name": "ADLight", 
           "logo": { "@type": "ImageObject", "url": "https://adlight.kz/logo.png" } 
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": DESIGN_CODE_WAYS.map(way => ({
           "@type": "Question",
           "name": way.title,
           "acceptedAnswer": { "@type": "Answer", "text": way.desc }
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-orange-500/30">
      
      {/* Вставляем Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* 1. HERO SECTION */}
      <section className="relative py-24 lg:py-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-blue-900/10"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           {/* Хлебные крошки */}
           <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4"/>
              <span className="text-blue-500 font-medium">Дизайн-код</span>
           </div>

           <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6 uppercase tracking-wider">
                 <BookOpen className="w-4 h-4"/> Гид по Дизайн-коду Астаны
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                 Создаем облик <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">столицы вместе</span>
              </h1>
              <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-xl">
                 Единые правила оформления фасадов, вывесок и городской среды. Узнайте требования для вашего бизнеса за 3 минуты, чтобы избежать штрафов и демонтажа.
              </p>
              
              <DesignCodeHeroButtons />
           </div>
        </div>
      </section>

      {/* 2. ТРИ ПУТИ СОГЛАСОВАНИЯ */}
      <section id="check" className="py-24 bg-[#0B1120] scroll-mt-20 border-b border-slate-800">
         <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">3 способа узаконить название</h2>
                 <p className="text-gray-400 max-w-2xl mx-auto">
                    Есть только три официальных варианта согласования вывески с отделом языков. Выберите свой путь.
                 </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                 {DESIGN_CODE_WAYS.map((way, idx) => (
                    <Card key={idx} hover className="p-8 border border-slate-800/80">
                       <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
                          {renderIcon(way.iconName, "w-7 h-7")}
                       </div>
                       <Typography variant="h3" className="mb-4 text-xl">
                          {way.title}
                       </Typography>
                       <Typography variant="body" className="mb-6 min-h-[60px] text-gray-400">
                          {way.desc}
                          <br/><span className="text-slate-500 text-xs">{way.example}</span>
                       </Typography>
                       <div className="pt-6 border-t border-slate-800">
                          <div className="flex justify-between items-center text-sm">
                             <span className="text-white font-bold flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500"/> {way.badge}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 font-mono">
                             <Clock className="w-4 h-4"/> {way.term}
                          </div>
                       </div>
                    </Card>
                 ))}
              </div>
         </div>
      </section>

      {/* 3. ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Технические требования</h2>
               <p className="text-gray-400">Где и как разрешено размещать вывески в Астане</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
               {DESIGN_CODE_RULES.map((rule) => (
                  <Card key={rule.id} hover className="p-8 bg-[#0F172A] border border-slate-800/80">
                     <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition">
                        {renderIcon(rule.iconName, "w-20 h-20 text-blue-500")}
                     </div>
                     <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold mb-6">{rule.badge}</div>
                     <Typography variant="h3" className="mb-6 text-xl">
                        {rule.title}
                     </Typography>
                     <ul className="space-y-4">
                        {rule.items.map((item, idx) => {
                           const isBold = item.includes(":");
                           const parts = isBold ? item.split(":") : [item];
                           return (
                              <li key={idx} className="flex gap-3">
                                 <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"/>
                                 <span className="text-gray-400 text-sm">
                                    {isBold ? (
                                       <><strong>{parts[0]}:</strong>{parts[1]}</>
                                    ) : (
                                       item
                                    )}
                                 </span>
                              </li>
                           );
                        })}
                     </ul>
                  </Card>
               ))}
            </div>
         </div>
      </section>

      {/* 4. СТОП-ЛИСТ (ЗАПРЕТЫ) */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800">
         <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-12">
               <div className="h-px flex-1 bg-slate-800"></div>
               <h2 className="text-3xl font-bold text-white text-center flex items-center gap-3">
                  <ShieldAlert className="w-8 h-8 text-red-500"/>
                  <span>СТОП-ЛИСТ: Как делать нельзя</span>
               </h2>
               <div className="h-px flex-1 bg-slate-800"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
               {DESIGN_CODE_BANS.map((item, i) => (
                  <div key={i} className="flex gap-4 p-5 bg-red-900/5 border border-red-900/20 rounded-2xl hover:bg-red-900/10 transition">
                     <Ban className="w-6 h-6 text-red-500 flex-shrink-0 mt-1"/>
                     <div>
                        <h4 className="text-white font-bold mb-2">{item.title}</h4>
                        <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. КАТАЛОГ ФОРМАТОВ (ИНТЕРАКТИВНЫЙ КОМПОНЕНТ) */}
      <DesignCodeTabs />

      {/* 6. ЛИД-МАГНИТ */}
      <CallToAction 
          source="Страница: Дизайн-код" 
          title="Сделаем вывеску строго по Дизайн-коду" 
          subtitle="Мы знаем все требования наизусть. Проверим ваш фасад, подготовим эскиз и гарантируем отсутствие штрафов."
          buttonText="Проверить вывеску"
      />

      {/* 7. ДРУГИЕ УСЛУГИ */}
      <ServicesCarousel title="Наши услуги" subtitle="Производство по Дизайн-коду" />

    </div>
  );
}