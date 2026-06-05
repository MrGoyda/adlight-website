"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, Phone, MapPin, Calculator, Folder, Sparkles, MessageSquare } from "lucide-react";
import Button from "@/components/ui/Button";
import BlueprintGrid from "@/components/ui/BlueprintGrid";
import PremiumCard from "@/components/ui/PremiumCard";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    } else {
      router.back();
    }
  };

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  return (
    <main className="relative min-h-[90vh] flex items-center justify-center py-20 bg-white overflow-hidden text-slate-900 border-b border-slate-200">
      {/* Чертежная фоновая сетка */}
      <BlueprintGrid showGradients={false} className="opacity-70" />

      {/* Мягкие размытые градиенты для премиум-эффекта */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-orange-500/[0.03] rounded-full filter blur-[80px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/[0.02] rounded-full filter blur-[100px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
        {/* Анимированный шильдик 404 */}
        <div className="inline-flex mb-6">
          <span className="px-4 py-1.5 text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200/60 rounded-full animate-bounce">
            Ошибка 404
          </span>
        </div>

        {/* Гигантский стильный номер 404 */}
        <h1 className="text-8xl sm:text-9.5xl font-black tracking-tighter leading-none mb-4 text-slate-950 select-none">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-red-600">
            404
          </span>
        </h1>

        <h2 className="text-2xl sm:text-3.5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
          Упс! Страница не найдена
        </h2>

        <p className="text-slate-500 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10 font-medium">
          Возможно, вы перешли по устаревшей ссылке, адрес страницы изменился или она была удалена. Давайте вернем вас к полезному контенту.
        </p>

        {/* Основные действия */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button
            onClick={handleGoBack}
            variant="lightOutline"
            size="lg"
            className="w-full sm:w-auto h-13 text-sm font-extrabold px-6"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Вернуться назад
          </Button>
          <Button
            href="/"
            onClick={triggerHaptic}
            variant="solid"
            size="lg"
            className="w-full sm:w-auto h-13 text-sm font-extrabold px-6"
            leftIcon={<Home className="w-4 h-4" />}
          >
            На главную
          </Button>
        </div>

        {/* Разделы сайта для навигации */}
        <div className="border-t border-slate-150 pt-12 text-left">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 text-center sm:text-left">
            Рекомендуемые разделы:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            
            <Link href="/services" onClick={triggerHaptic} className="group block">
              <PremiumCard className="p-5 flex flex-col justify-center h-full bg-slate-50 hover:bg-white border border-slate-200/60 hover:border-orange-500/20 shadow-sm transition-all duration-300 min-h-[90px]">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors">
                    Услуги рекламы
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 font-semibold leading-tight">
                    Каталог вывесок под ключ
                  </p>
                </div>
              </PremiumCard>
            </Link>

            <Link href="/calculator" onClick={triggerHaptic} className="group block">
              <PremiumCard className="p-5 flex flex-col justify-center h-full bg-slate-50 hover:bg-white border border-slate-200/60 hover:border-orange-500/20 shadow-sm transition-all duration-300 min-h-[90px]">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors">
                    Калькулятор
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 font-semibold leading-tight">
                    Онлайн-расчет стоимости
                  </p>
                </div>
              </PremiumCard>
            </Link>

            <Link href="/portfolio" onClick={triggerHaptic} className="group block">
              <PremiumCard className="p-5 flex flex-col justify-center h-full bg-slate-50 hover:bg-white border border-slate-200/60 hover:border-orange-500/20 shadow-sm transition-all duration-300 min-h-[90px]">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors">
                    Портфолио работ
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 font-semibold leading-tight">
                    Более 300 готовых кейсов
                  </p>
                </div>
              </PremiumCard>
            </Link>

            <Link href="/contacts" onClick={triggerHaptic} className="group block">
              <PremiumCard className="p-5 flex flex-col justify-center h-full bg-slate-50 hover:bg-white border border-slate-200/60 hover:border-orange-500/20 shadow-sm transition-all duration-300 min-h-[90px]">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors">
                    Контакты
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 font-semibold leading-tight">
                    Адрес цеха и наши телефоны
                  </p>
                </div>
              </PremiumCard>
            </Link>

          </div>
        </div>

        {/* Контакты для оперативной связи */}
        <div className="border-t border-slate-150 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <MapPin className="w-4.5 h-4.5 text-orange-500 shrink-0" />
            <span>Астана, ул. Аспара, 7 (собственное производство)</span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6">
            <a href="tel:+77071356701" onClick={triggerHaptic} className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
              <Phone className="w-4 h-4 text-orange-600" />
              <span>+7 (707) 135-67-01</span>
            </a>
            
            <a 
              href="https://wa.me/77071356701" 
              target="_blank" 
              rel="nofollow noopener noreferrer"
              onClick={triggerHaptic}
              className="inline-flex items-center justify-center font-black text-white bg-[#25D366] px-3 py-1 rounded-xl hover:bg-[#20ba59] transition duration-200"
            >
              <MessageSquare className="w-3.5 h-3.5 mr-1 fill-current" />
              WhatsApp
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}
