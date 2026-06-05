"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowUpRight } from "lucide-react";
import { HOME_SPEC_SERVICES } from "@/dictionaries/home";
import { cn } from "@/lib/utils";
import BlueprintGrid from "@/components/ui/BlueprintGrid";
import PremiumCard from "@/components/ui/PremiumCard";

export default function SpecializedServicesGrid() {
  
  // Тактильный отклик
  const triggerHaptic = () => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(12);
    }
  };

  return (
    <section className="relative py-16 md:py-24 bg-slate-50 text-slate-900 overflow-hidden border-b border-slate-200">
      {/* Чертежная сетка на фоне (Blueprint Grid) */}
      <BlueprintGrid showGradients={false} className="opacity-80" />

      {/* Декоративные световые пятна */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.02)_0%,transparent_70%)] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.015)_0%,transparent_70%)] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* ШАПКА СЕКЦИИ */}
        <div className="max-w-3xl text-left space-y-4 mb-10 md:mb-16">
          <div className="inline-flex">
            <span className="px-3.5 py-1 text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200/50 rounded-full">
              Специализированные услуги
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5.5xl font-black text-slate-950 tracking-tight leading-none">
            Профессиональный сервис <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-red-600">
              и спецпроекты в Астане
            </span>
          </h2>
          <p className="text-slate-700 text-base sm:text-lg md:text-xl leading-relaxed font-medium">
            Решаем узкоспециализированные коммерческие задачи бизнеса — от безопасной оклейки транспорта до продления жизни старым вывескам.
          </p>
        </div>

        {/* ГИБРИДНАЯ АДАПТИВНАЯ СЕТКА КАРТОЧЕК */}
        <div className="overflow-x-auto lg:overflow-x-visible pb-6 lg:pb-0 scrollbar-hide -webkit-overflow-scrolling-touch w-full -mx-4 lg:mx-0">
          <ul className="flex lg:grid lg:grid-cols-4 gap-6 lg:gap-8 snap-x snap-mandatory px-4 lg:px-0 w-max lg:w-full">
            {HOME_SPEC_SERVICES.map((item) => {
              // Extract numeric price for Schema Offer
              const priceMatch = item.price.replace(/[^\d]/g, "");
              const priceValue = priceMatch ? parseInt(priceMatch, 10) : 0;

              return (
                <li
                  key={item.id}
                  className="shrink-0 w-[285px] sm:w-[325px] lg:w-full lg:shrink snap-center"
                  itemScope
                  itemType="https://schema.org/Service"
                >
                  <PremiumCard
                    variant="default"
                    hoverEffect="lift"
                    className="group flex flex-col justify-between p-5 md:p-6 w-full h-full"
                  >
                    <meta itemProp="serviceType" content="Специализированные услуги рекламы" />
                    <div itemProp="provider" itemScope itemType="https://schema.org/LocalBusiness" className="hidden">
                      <meta itemProp="name" content="ADLight" />
                      <meta itemProp="address" content="Астана, ул. Аспара, 7" />
                      <meta itemProp="telephone" content="+77071356701" />
                    </div>

                    <div>
                      {/* Изображение услуги */}
                      <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-5 bg-slate-50 border border-slate-100">
                        <Image
                          src={item.image}
                          alt={item.imageAlt}
                          fill
                          className="object-cover rounded-2xl group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                          sizes="(max-width: 768px) 100vw, 25vw"
                          loading="lazy"
                          itemProp="image"
                        />
                        <div className="absolute inset-0 rounded-2xl border border-black/[0.03] z-20 pointer-events-none" />
                      </div>

                      {/* Скрытый поисковый LSI ключ */}
                      <span className="sr-only">{item.seoKey}</span>

                      {/* Контент и Заголовки */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-start justify-between gap-3">
                          <h3 itemProp="name" className="text-lg md:text-xl font-black tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                            {item.title}
                          </h3>
                          <Link
                            href={item.link}
                            onClick={triggerHaptic}
                            className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center shrink-0 text-slate-400 group-hover:text-slate-900 group-hover:border-orange-500 transition-all hover:scale-105 bg-slate-50"
                            aria-label={`Подробнее о ${item.title}`}
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>
                        </div>
                        
                        <p itemProp="description" className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
                          {item.desc}
                        </p>
                      </div>

                      {/* Короткий список фич (Bullet Points) */}
                      <ul className="space-y-2 mb-6">
                        {item.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Цена и ссылка на страницу */}
                    <div 
                      className="flex items-center justify-between pt-4 border-t border-slate-100"
                      itemProp="offers"
                      itemScope
                      itemType="https://schema.org/Offer"
                    >
                      <meta itemProp="priceCurrency" content="KZT" />
                      {priceValue > 0 ? (
                        <meta itemProp="price" content={priceValue.toString()} />
                      ) : (
                        <meta itemProp="price" content="0" />
                      )}
                      <meta itemProp="priceValidUntil" content="2027-12-31" />
                      <meta itemProp="availability" content="https://schema.org/InStock" />

                      <span className="text-xs sm:text-sm font-black text-slate-900">
                        {item.price}
                      </span>
                      
                      <Link
                        href={item.link}
                        onClick={triggerHaptic}
                        className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        Подробнее
                        <span className="inline-block transform group-hover:translate-x-0.5 transition-transform">→</span>
                      </Link>
                    </div>
                  </PremiumCard>
                </li>
              );
            })}
          </ul>
        </div>

      </div>
    </section>
  );
}
