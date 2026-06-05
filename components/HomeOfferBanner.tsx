"use client";

import { useState } from "react";
import { BadgePercent, MapPin, CheckCircle2, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import BlueprintGrid from "@/components/ui/BlueprintGrid";
import QuizModal from "@/components/QuizModal";
import ConsultationModal from "@/components/ConsultationModal";

import { SITE_CONTACTS } from "@/config/site";

interface HomeOfferBannerProps {
  title?: React.ReactNode;
  subtitle?: string;
  description?: string;
  source?: string;
  discountValue?: string;
}

export default function HomeOfferBanner({
  title,
  subtitle,
  description = "Планируете открытие бизнеса? Закажите расчет стоимости вывески сегодня. Мы зафиксируем за вашим номером 10% скидку, выполним бесплатный профессиональный замер на объекте и подготовим 3D-фотопривязку вывески к вашему фасаду!",
  source = "Промо-баннер (Скидка 10%)",
  discountValue = "-10%"
}: HomeOfferBannerProps) {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const defaultSubtitle = subtitle || `на изготовление вывески в ${SITE_CONTACTS.locality}`;
  const displayTitle = title || (
    <>
      Зафиксируйте скидку <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">{discountValue}</span> <br/>
      <span className="text-xl sm:text-2xl md:text-3.5xl font-extrabold text-slate-700">{defaultSubtitle}</span>
    </>
  );

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden border-b border-slate-200 bg-[#F8FAFB]">
      
      {/* --- Чертежная сетка на фоне (Blueprint Grid) --- */}
      <BlueprintGrid showGradients={false} className="opacity-80" />
      
      {/* Свечения за стеклом */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-orange-500/[0.04] to-red-500/[0.04] blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Полноразмерный стеклянный баннер Apple Glass с крупной типографикой */}
        <div 
          className="relative rounded-[32px] bg-white border border-slate-200/80 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-xl shadow-slate-200/40"
        >
          {/* Световые блики внутри стекла */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/5 blur-[80px] rounded-full pointer-events-none"></div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            {/* ЛЕВАЯ ЧАСТЬ: КРУПНЫЙ ОФФЕР */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold uppercase tracking-wider w-fit">
                 <BadgePercent className="w-4 h-4"/> Специальное предложение
              </div>

              <h2 className="text-3.5xl sm:text-5xl md:text-6xl font-black text-slate-950 leading-[1.05] tracking-tight">
                {displayTitle}
              </h2>
 
              <p className="text-slate-655 text-base sm:text-lg leading-relaxed font-medium max-w-2xl">
                {description}
              </p>
 
              <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-green-50 border border-green-200 text-green-600 rounded-lg mt-0.5 shrink-0">
                    <CheckCircle2 className="w-4 h-4"/>
                  </div>
                  <div>
                    <strong className="text-slate-900 text-sm block">Снижение сметы на 10%</strong>
                    <span className="text-slate-500 text-xs font-medium">Скидка закрепляется за вашим номером телефона</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-green-50 border border-green-200 text-green-600 rounded-lg mt-0.5 shrink-0">
                    <CheckCircle2 className="w-4 h-4"/>
                  </div>
                  <div>
                    <strong className="text-slate-900 text-sm block">Бесплатный выезд инженера</strong>
                    <span className="text-slate-500 text-xs font-medium">Бесплатный точный замер на объекте в Астане</span>
                  </div>
                </div>
 
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-green-50 border border-green-200 text-green-600 rounded-lg mt-0.5 shrink-0">
                    <CheckCircle2 className="w-4 h-4"/>
                  </div>
                  <div>
                    <strong className="text-slate-900 text-sm block">Визуализация на фасаде</strong>
                    <span className="text-slate-500 text-xs font-medium">Сделаем фотопривязку вывески под Дизайн-код</span>
                  </div>
                </div>
 
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-green-50 border border-green-200 text-green-600 rounded-lg mt-0.5 shrink-0">
                    <CheckCircle2 className="w-4 h-4"/>
                  </div>
                  <div>
                    <strong className="text-slate-900 text-sm block">Юридический договор</strong>
                    <span className="text-slate-500 text-xs font-medium">Сроки и гарантия до 3 лет зафиксированы на бумаге</span>
                  </div>
                </div>
              </div>
            </div>
 
            {/* ПРАВАЯ ЧАСТЬ: КРУПНЫЕ ПРУЖИННЫЕ КНОПКИ ДЕЙСТВИЯ (5 колонок) */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-4 lg:pl-6">
              <Button 
                onClick={() => setIsQuizOpen(true)}
                variant="solid"
                size="xl"
                className="w-full h-[64px] bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 hover:from-orange-500 hover:to-red-400 border border-orange-500/20 shadow-xl shadow-orange-500/10 rounded-2xl text-base px-8 text-white font-extrabold"
              >
                Рассчитать стоимость со скидкой {discountValue}
              </Button>
              
              <Button 
                onClick={() => setIsModalOpen(true)}
                variant="lightOutline"
                size="xl"
                className="w-full h-[64px] rounded-2xl text-base px-8 font-bold"
              >
                Быстрая консультация
              </Button>
 
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium pt-2">
                <ShieldCheck className="w-4 h-4 text-slate-400"/>
                <span>Предложение действительно до конца месяца</span>
              </div>
            </div>
 
          </div>
        </div>
 
      </div>
 
      {/* КВИЗ-ПОДБОР УСЛУГИ СО СКИДКОЙ */}
      <QuizModal 
        isOpen={isQuizOpen} 
        onClose={() => setIsQuizOpen(false)} 
      />
 
      {/* КЛАССИЧЕСКАЯ ФОРМА СВЯЗИ */}
      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        source={source}
        title={`Зафиксировать скидку ${discountValue}`}
        subtitle={`Оставьте заявку сейчас, и мы закрепим за вашим номером телефона скидку ${discountValue} на любое производство наружной рекламы.`}
        buttonText="Зафиксировать скидку"
      />
    </section>
  );
}
