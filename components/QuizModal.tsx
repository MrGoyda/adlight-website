"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, ArrowRight, ArrowLeft, ShieldCheck, HelpCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Typography from "@/components/ui/Typography";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuizModal({ isOpen, onClose }: QuizModalProps) {
  const [step, setStep] = useState(1);
  const [signType, setSignType] = useState("");
  const [niche, setNiche] = useState("");
  const [timeline, setTimeline] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsSuccess(false);
      setStep(1);
      setSignType("");
      setNiche("");
      setTimeline("");
      setName("");
      setPhone("");
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      document.body.style.overflow = "";
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const source = `Квиз-Подбор: [Вывеска: ${signType}] [Ниша: ${niche}] [Сроки: ${timeline}]`;

    try {
      const res = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, source }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          if (isOpen) onClose();
        }, 4000);
      } else {
        alert("Ошибка при отправке. Попробуйте связаться напрямую в WhatsApp.");
      }
    } catch (error) {
      console.error(error);
      alert("Ошибка сети. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted || !shouldRender) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="w-full max-w-lg relative z-10">
        <Card 
          glass
          intensity="heavy"
          rounded="3xl"
          className={`w-full shadow-apple-modal border border-slate-700/80 overflow-hidden transition-all duration-300 ease-out transform ${
            isVisible ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
          }`}
        >
          {/* Top glowing effect */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-orange-500/10 blur-[80px] rounded-full pointer-events-none"></div>

          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition z-50"
            aria-label="Закрыть"
          >
            <X className="w-6 h-6"/>
          </button>

          <div className="p-8">
            {isSuccess ? (
              /* ЭКРАН УСПЕХА */
              <div className="text-center py-6 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
                  <CheckCircle className="w-10 h-10"/>
                </div>
                <Typography variant="h3" className="mb-2 text-white font-extrabold text-2xl">Смета рассчитана!</Typography>
                <Typography variant="body" className="mb-6 text-slate-400">
                  Спасибо! Мы подготовим для вас персональное предложение и перезвоним в течение 10 минут.
                </Typography>
                <Button onClick={onClose} variant="secondary" className="w-full h-[54px]">
                  Отлично
                </Button>
              </div>
            ) : (
              <div>
                {/* Индикатор шага */}
                <div className="flex items-center gap-1.5 mb-6">
                  {[1, 2, 3, 4].map((s) => (
                    <div 
                      key={s} 
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        s <= step ? "bg-orange-500 shadow-sm" : "bg-slate-800"
                      }`}
                    />
                  ))}
                  <span className="text-[10px] font-mono text-slate-500 font-extrabold ml-2">Шаг {step}/4</span>
                </div>

                {/* ШАГ 1: Тип вывески */}
                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                      <Typography variant="h3" className="text-white font-extrabold text-2xl mb-2 flex items-center gap-2">
                        <HelpCircle className="w-6 h-6 text-orange-500 shrink-0"/> Что необходимо изготовить?
                      </Typography>
                      <Typography variant="body" className="text-slate-400 text-sm">
                        Выберите тип конструкции, чтобы мы подобрали технологические карты и материалы
                      </Typography>
                    </div>

                    <div className="grid gap-2">
                      {[
                        "Объемные световые буквы",
                        "Световой короб / Лайтбокс",
                        "Интерьерный логотип / Неоновая вывеска",
                        "Оформление фасада композитом",
                        "Пока не знаю, нужна консультация инженера"
                      ].map((item) => (
                        <button
                          key={item}
                          onClick={() => { setSignType(item); nextStep(); }}
                          className={`w-full text-left p-4 rounded-xl border text-sm font-bold transition duration-200 active:scale-[0.99] ${
                            signType === item 
                              ? "bg-slate-900 border-orange-500 text-orange-400 shadow-lg" 
                              : "bg-slate-950/40 border-slate-900 hover:border-slate-800 text-gray-300 hover:text-white"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ШАГ 2: Ниша */}
                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                      <Typography variant="h3" className="text-white font-extrabold text-2xl mb-2">
                        Для какой сферы бизнеса?
                      </Typography>
                      <Typography variant="body" className="text-slate-400 text-sm">
                        Это поможет нам учесть требования законодательства и стандарты Дизайн-кода Астаны
                      </Typography>
                    </div>

                    <div className="grid gap-2">
                      {[
                        "Ресторан / Кафе / Кофейня",
                        "Салон красоты / Бьюти-сфера",
                        "Магазин / Продукты / Торговый центр",
                        "Офис компании / Ресепшн",
                        "СТО / Автомагазин / Услуги",
                        "Другое направление"
                      ].map((item) => (
                        <button
                          key={item}
                          onClick={() => { setNiche(item); nextStep(); }}
                          className={`w-full text-left p-4 rounded-xl border text-sm font-bold transition duration-200 active:scale-[0.99] ${
                            niche === item 
                              ? "bg-slate-900 border-orange-500 text-orange-400 shadow-lg" 
                              : "bg-slate-950/40 border-slate-900 hover:border-slate-800 text-gray-300 hover:text-white"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>

                    <button onClick={prevStep} className="flex items-center gap-2 text-xs text-slate-500 hover:text-white transition pt-2">
                      <ArrowLeft className="w-4 h-4"/> Назад
                    </button>
                  </div>
                )}

                {/* ШАГ 3: Сроки */}
                {step === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                      <Typography variant="h3" className="text-white font-extrabold text-2xl mb-2">
                        Желаемые сроки производства?
                      </Typography>
                      <Typography variant="body" className="text-slate-400 text-sm">
                        У нас собственный сборочный цех, мы можем реализовать вывеску от 3 дней!
                      </Typography>
                    </div>

                    <div className="grid gap-2">
                      {[
                        "Срочно (в течение 3-5 дней)",
                        "Стандартно (в течение 7-10 дней)",
                        "Не спешу (в процессе планирования открытия)"
                      ].map((item) => (
                        <button
                          key={item}
                          onClick={() => { setTimeline(item); nextStep(); }}
                          className={`w-full text-left p-4 rounded-xl border text-sm font-bold transition duration-200 active:scale-[0.99] ${
                            timeline === item 
                              ? "bg-slate-900 border-orange-500 text-orange-400 shadow-lg" 
                              : "bg-slate-950/40 border-slate-900 hover:border-slate-800 text-gray-300 hover:text-white"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>

                    <button onClick={prevStep} className="flex items-center gap-2 text-xs text-slate-500 hover:text-white transition pt-2">
                      <ArrowLeft className="w-4 h-4"/> Назад
                    </button>
                  </div>
                )}

                {/* ШАГ 4: Форма контактов */}
                {step === 4 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                      <Typography variant="h3" className="text-white font-extrabold text-2xl mb-2">
                        Получить расчет сметы
                      </Typography>
                      <Typography variant="body" className="text-slate-400 text-sm">
                        Мы зафиксируем за вашим номером скидку 10% и подготовим расчет.
                      </Typography>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input
                        label="Ваше имя"
                        hideLabel
                        id="quiz-name"
                        placeholder="Ваше имя"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                      <Input
                        label="Номер телефона"
                        hideLabel
                        id="quiz-phone"
                        type="tel"
                        placeholder="+7 (___) ___-__-__"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        disabled={isLoading}
                      />

                      <Button
                        type="submit"
                        variant="solid"
                        size="lg"
                        isLoading={isLoading}
                        className="w-full h-[58px]"
                        rightIcon={<ArrowRight className="w-5 h-5"/>}
                      >
                        Рассчитать вывеску
                      </Button>
                    </form>

                    <div className="flex items-center justify-between border-t border-slate-800/60 pt-4 mt-6">
                      <button onClick={prevStep} className="flex items-center gap-2 text-xs text-slate-500 hover:text-white transition">
                        <ArrowLeft className="w-4 h-4"/> Назад
                      </button>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5"/> Безопасная отправка
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>,
    document.body
  );
}
