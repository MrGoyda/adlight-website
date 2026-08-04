"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, FileCheck, BookOpen, ShieldCheck } from "lucide-react";
import { getCdnUrl } from "@/lib/serverUtils";
import ConsultationModal from "./ConsultationModal";
import BlueprintGrid from "@/components/ui/BlueprintGrid";
import Button from "@/components/ui/Button";

interface DesignCodeBlockProps {
  title?: string;
  description?: string;
  source?: string;
}

export default function DesignCodeBlock({
  title = "Согласование вывески в Акимате — бесплатно!",
  description = "Вам не нужно изучать СНиПы и ходить по кабинетам. Мы берем на себя весь цикл согласования: от разработки фотопривязки до подачи документов. Вы получаете 100% законную вывеску по Дизайн-коду Астаны.",
  source = "Форма: Бесплатное согласование вывески"
}: DesignCodeBlockProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const openConsultation = () => {
    triggerHaptic();
    setIsModalOpen(true);
  };

  return (
    <section className="py-20 lg:py-28 bg-slate-50/50 relative overflow-hidden border-y border-slate-200/60">
      {/* Чертежная сетка на фоне (Blueprint Grid) */}
      <BlueprintGrid showGradients={false} className="opacity-80" />

      {/* Soft warm ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-orange-500/[0.01] rounded-full pointer-events-none -z-10" />
      
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* LEFT COLUMN: CONVERSION COPY & CHECKPOINTS */}
          <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/40 text-orange-600 text-xs font-black uppercase tracking-wider">
                Бесплатная услуга
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5.5xl font-black text-slate-950 tracking-tight leading-none">
                {title.includes(" в Акимате ") ? (
                  <>
                    Согласование вывески <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-red-600">
                      в Акимате — бесплатно!
                    </span>
                  </>
                ) : title}
              </h2>
              
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium">
                {description}
              </p>

              <ul className="space-y-4 pt-2">
                <li className="flex items-start gap-3.5">
                  <div className="p-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100/60 rounded-lg mt-0.5"><CheckCircle className="w-5 h-5"/></div>
                  <div>
                    <strong className="text-slate-950 font-extrabold text-sm block">Полный аудит фасада</strong>
                    <span className="text-slate-500 text-xs font-semibold">Проверяем допустимые габариты и формат размещения вывески по паспорту вашего здания.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3.5">
                  <div className="p-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100/60 rounded-lg mt-0.5"><CheckCircle className="w-5 h-5"/></div>
                  <div>
                    <strong className="text-slate-950 font-extrabold text-sm block">Разработка эскизного проекта</strong>
                    <span className="text-slate-500 text-xs font-semibold">Создаем правильные фотопривязки «до / после», готовим комплект чертежей и формируем эскизный альбом.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3.5">
                  <div className="p-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100/60 rounded-lg mt-0.5"><CheckCircle className="w-5 h-5"/></div>
                  <div>
                    <strong className="text-slate-950 font-extrabold text-sm block">Сопровождение в e-Otinish</strong>
                    <span className="text-slate-500 text-xs font-semibold">Полностью берем на себя подачу документов в Управление архитектуры до получения официального одобрения.</span>
                  </div>
                </li>
              </ul>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Button 
                  onClick={openConsultation}
                  variant="solid"
                  className="bg-orange-600 hover:bg-orange-700"
                  leftIcon={<ShieldCheck className="w-5 h-5"/>}
                  rightIcon={<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"/>}
                >
                  Получить согласование
                </Button>

                <Button 
                  href="/design-code" 
                  onClick={triggerHaptic}
                  variant="lightOutline"
                  leftIcon={<BookOpen className="w-5 h-5 text-slate-400"/>}
                >
                  Гид по Дизайн-коду
                </Button>
              </div>
          </div>

          {/* RIGHT COLUMN: DOCUMENT APPROVAL SPECIMEN CARD */}
          <div className="lg:col-span-5 relative">
             <div className="relative bg-white border border-slate-200 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] transform lg:rotate-2 hover:rotate-0 transition duration-500">
                <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center"><FileCheck className="w-5 h-5"/></div>
                      <div>
                         <div className="text-slate-950 font-black text-sm">Эскизный проект</div>
                         <div className="text-emerald-600 text-[10px] font-black uppercase tracking-wider">Одобрено Акиматом</div>
                      </div>
                   </div>
                </div>
                
                {/* Visual spec card with scan background mock */}
                <div className="aspect-video bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden relative">
                   <Image 
                      src={getCdnUrl("/images/pages/dk_approved.png")} 
                      alt="Эскизный проект вывески, одобренный Акиматом"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                   />
                </div>

                <div className="mt-6 bg-emerald-50/50 border border-emerald-100/60 rounded-2xl p-4 flex items-start gap-3">
                   <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5"/>
                   <p className="text-slate-700 text-xs leading-relaxed font-semibold">
                      Объект полностью соответствует Дизайн-коду Астаны и градостроительным стандартам РК. Размещение наружной рекламы одобрено.
                   </p>
                </div>
             </div>
          </div>

        </div>
      </div>

      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        source={source}
        title="Согласование вывески"
        subtitle="Проверим вашу вывеску на соответствие Дизайн-коду Астаны и поможем получить разрешение."
        buttonText="Проверить вывеску"
      />
    </section>
  );
}