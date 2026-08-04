"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, ArrowRight, ArrowLeft, ShieldCheck, HelpCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Typography from "@/components/ui/Typography";

import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { QUIZ_CONFIGS, getQuizContextKey } from "@/dictionaries/quiz-configs";
import { enrichLeadWithAnalytics } from "@/lib/utils";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceContext?: string;
}

// Легковесная функция маскирования для номеров Казахстана (+7 (7XX) XXX-XX-XX)
const formatKazakhstanPhone = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  
  if (digits.length === 0) return "";
  
  // Нормализуем, отсекая первую 7 или 8
  let cleanDigits = digits;
  if (digits.startsWith("7") || digits.startsWith("8")) {
    cleanDigits = digits.substring(1);
  }
  
  // Ограничиваем 10 цифрами (7XX XXX XX XX)
  cleanDigits = cleanDigits.substring(0, 10);
  
  let formatted = "+7";
  if (cleanDigits.length > 0) {
    const area = cleanDigits.substring(0, 3);
    formatted += ` (${area}`;
    if (cleanDigits.length >= 3) {
      formatted += ") ";
      const main = cleanDigits.substring(3, 6);
      formatted += main;
      if (cleanDigits.length >= 6) {
        formatted += "-";
        const part1 = cleanDigits.substring(6, 8);
        formatted += part1;
        if (cleanDigits.length >= 8) {
          formatted += "-";
          const part2 = cleanDigits.substring(8, 10);
          formatted += part2;
        }
      }
    }
  }
  return formatted;
};



export default function QuizModal({ isOpen, onClose, serviceContext }: QuizModalProps) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const configKey = getQuizContextKey(serviceContext);
  const config = QUIZ_CONFIGS[configKey] || QUIZ_CONFIGS["general"];
  const totalSteps = config.steps.length + 1; // +1 для формы контактов

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsSuccess(false);
      setStep(1);
      setAnswers({});
      setName("");
      setPhone("");
      setHoneypot("");
      setPhoneError("");
      lockScroll("quiz-modal");
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => {
        clearTimeout(timer);
      };
    } else {
      setIsVisible(false);
      unlockScroll("quiz-modal");
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      unlockScroll("quiz-modal");
    };
  }, []);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatKazakhstanPhone(e.target.value);
    setPhone(formatted);
    if (phoneError) setPhoneError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPhoneError("");

    const digits = phone.replace(/\D/g, "");
    
    if (digits.length !== 11) {
      setPhoneError("Пожалуйста, введите полный номер телефона");
      setIsLoading(false);
      return;
      }
  
      if (digits.charAt(1) !== "7") {
        setPhoneError("Некорректный код оператора (+7 7XX...)");
        setIsLoading(false);
        return;
      }
  
      // Форматируем ответы в один текстовый лог
      const answersText = config.steps.map((q, idx) => {
        const ans = answers[idx + 1] || "Не выбрано";
        return `[Вопрос ${idx + 1}: ${q.title}] -> [Ответ: ${ans}]`;
      }).join(" | ");
  
      const source = `Квиз: ${config.title}. Контекст: ${serviceContext || "general"}. Ответы: ${answersText}`;
  
      try {
        const res = await fetch("/api/telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(enrichLeadWithAnalytics({ name, phone, source, website: honeypot })),
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
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 pb-safe">
        {/* Overlay */}
        <div 
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300 ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          onClick={onClose}
        ></div>
  
        {/* Modal */}
        <div 
          className={`w-full max-w-lg relative z-10 max-h-[90dvh] overflow-y-auto rounded-[2.5rem] shadow-apple-modal border border-white/20 transition-all duration-300 ease-out transform ${
            isVisible ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
          }`}
        >
          <Card 
            glass
            intensity="light"
            rounded="3xl"
            className="w-full bg-white/80 backdrop-blur-2xl text-slate-900"
          >
            {/* Top glowing effect */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-orange-500/10 blur-[80px] rounded-full pointer-events-none"></div>
  
            {/* Close button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition z-50 cursor-pointer"
              aria-label="Закрыть"
            >
              <X className="w-6 h-6"/>
            </button>
  
            <div className="px-8 pb-8 pt-14 relative z-10">
              {isSuccess ? (
                /* ЭКРАН УСПЕХА */
                <div className="text-center py-6 animate-in fade-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6 border border-emerald-100">
                    <CheckCircle className="w-10 h-10"/>
                  </div>
                  <Typography variant="h3" className="mb-2 text-slate-900 font-extrabold text-2xl">Смета рассчитана!</Typography>
                  <Typography variant="body" className="mb-6 text-slate-500">
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
                    {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
                      <div 
                        key={s} 
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          s <= step ? "bg-orange-500 shadow-sm" : "bg-slate-200"
                        }`}
                      />
                    ))}
                    <span className="text-[10px] font-mono text-slate-500 font-extrabold ml-2">Шаг {step}/{totalSteps}</span>
                  </div>
  
                  {/* Динамические вопросы */}
                  {step <= config.steps.length && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div>
                        <Typography variant="h3" className="text-slate-900 font-extrabold text-xl sm:text-2xl mb-2 flex items-center gap-2">
                          <HelpCircle className="w-6 h-6 text-orange-500 shrink-0"/> {config.steps[step - 1].title}
                        </Typography>
                        <Typography variant="body" className="text-slate-500 text-sm">
                          {config.steps[step - 1].description}
                        </Typography>
                      </div>
  
                      <div className="grid gap-2">
                        {config.steps[step - 1].options.map((item) => (
                          <button
                            key={item}
                            onClick={() => {
                              setAnswers(prev => ({ ...prev, [step]: item }));
                              nextStep();
                            }}
                            className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition duration-200 active:scale-[0.99] cursor-pointer ${
                              answers[step] === item 
                                ? "bg-orange-50 border-orange-500 text-orange-600 shadow-md font-bold" 
                                : "bg-slate-50/50 border-slate-200 hover:border-slate-350 text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
  
                      {step > 1 && (
                        <button onClick={prevStep} className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 transition pt-2 font-medium cursor-pointer">
                          <ArrowLeft className="w-4 h-4"/> Назад
                        </button>
                      )}
                    </div>
                  )}
  
                  {/* ФОРМА КОНТАКТОВ (ПОСЛЕДНИЙ ШАГ) */}
                  {step === totalSteps && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div>
                        <Typography variant="h3" className="text-slate-900 font-extrabold text-2xl mb-2">
                          Получить расчет сметы
                        </Typography>
                        <Typography variant="body" className="text-slate-500 text-sm">
                          Мы зафиксируем за вашим номером скидку 10% и подготовим расчет.
                        </Typography>
                      </div>
  
                      <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Honeypot скрытое поле для защиты от спам-ботов */}
                        <input 
                          type="text" 
                          name="website" 
                          className="sr-only" 
                          tabIndex={-1} 
                          autoComplete="off" 
                          value={honeypot} 
                          onChange={(e) => setHoneypot(e.target.value)} 
                        />
                        <Input
                          label="Ваше имя"
                          hideLabel
                          variant="light"
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
                          variant="light"
                          id="quiz-phone"
                          type="tel"
                          placeholder="+7 (777) 123-45-67"
                          value={phone}
                          onChange={handlePhoneChange}
                          error={phoneError}
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
  
                      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
                        <button onClick={prevStep} className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 transition font-medium cursor-pointer">
                          <ArrowLeft className="w-4 h-4"/> Назад
                        </button>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                          <ShieldCheck className="w-3.5 h-3.5 text-slate-500"/> Безопасная отправка
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
