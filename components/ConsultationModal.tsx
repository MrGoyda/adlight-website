"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Phone, User, ArrowRight, MessageCircle, CheckCircle, ShieldCheck } from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Typography from "@/components/ui/Typography";

import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { enrichLeadWithAnalytics } from "@/lib/utils";
import { trackClientConversion } from "@/lib/clientAnalytics";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: string; 
  title?: string;
  subtitle?: string;
  buttonText?: string;
  customMessage?: string;
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

export default function ConsultationModal({ 
  isOpen, 
  onClose, 
  source,
  title = "Нужна консультация?",
  subtitle = "Оставьте номер телефона. Мы перезвоним в течение 15 минут.",
  buttonText = "Жду звонка",
  customMessage
}: ConsultationModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [honeypot, setHoneypot] = useState("");
  
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
      setPhoneError("");
      setName("");
      setPhone("");
      setHoneypot("");
      lockScroll("consultation-modal");
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => {
        clearTimeout(timer);
      };
    } else {
      setIsVisible(false);
      unlockScroll("consultation-modal");
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  // Cleanup scroll lock on unmount
  useEffect(() => {
    return () => {
      unlockScroll("consultation-modal");
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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
    
    // Валидация полной длины (+7 + 10 цифр = 11 цифр)
    if (digits.length !== 11) {
      setPhoneError("Пожалуйста, введите полный номер телефона");
      setIsLoading(false);
      return;
    }

    // Валидация кода оператора (Казахстанские номера в формате +7 начинаются на 7, например: +7 (707)...)
    if (digits.charAt(1) !== "7") {
      setPhoneError("Некорректный код оператора (+7 7XX...)");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrichLeadWithAnalytics({ name, phone, source, message: customMessage, calcDetails: customMessage, website: honeypot })),
      });

      if (res.ok) {
        setIsSuccess(true);
        trackClientConversion('lead_form');
        setName("");
        setPhone("");
        // Авто-закрытие через 4 секунды
        setTimeout(() => {
           if (isOpen) onClose(); 
        }, 4000);
      } else {
        alert("Ошибка при отправке. Попробуйте написать в WhatsApp.");
      }
    } catch (error) {
      console.error(error);
      alert("Ошибка соединения.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectWhatsApp = () => {
     window.open(`https://wa.me/77071356701`, '_blank');
     onClose();
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

        {/* Modal Window using design system components */}
        <div 
            className={`w-full max-w-md relative z-10 max-h-[90dvh] overflow-y-auto rounded-[2.5rem] shadow-apple-modal border border-white/20 transition-all duration-300 ease-out transform ${
              isVisible ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
            }`}
        >
          <Card 
              glass
              intensity="light"
              rounded="3xl"
              className="w-full bg-white/80 backdrop-blur-2xl"
          >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[60px] rounded-full pointer-events-none"></div>

              <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition z-50"
                  aria-label="Закрыть"
              >
                  <X className="w-6 h-6"/>
              </button>

              <div className="p-8 relative z-10">
                  
                  {isSuccess ? (
                      // ЭКРАН УСПЕХА
                      <div className="text-center py-6 animate-in fade-in zoom-in duration-300">
                          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6 border border-emerald-100">
                              <CheckCircle className="w-10 h-10"/>
                          </div>
                          <Typography variant="h3" className="mb-2 text-slate-900 font-semibold">Заявка принята!</Typography>
                          <Typography variant="body" className="mb-6 text-slate-500">
                              Менеджер уже получил уведомление в Telegram и перезвонит вам в ближайшее время.
                          </Typography>
                          
                          <Button 
                              onClick={onClose}
                              variant="secondary"
                              className="w-full"
                          >
                              Отлично
                          </Button>
                      </div>
                  ) : (
                      // ЭКРАН ФОРМЫ
                      <>
                          <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 mb-6 border border-orange-500/20">
                              <Phone className="w-6 h-6"/>
                          </div>

                          <Typography variant="h3" className="mb-2 text-slate-900 font-semibold">{title}</Typography>
                          <Typography variant="body" className="mb-8 text-slate-500">
                              {subtitle}
                          </Typography>

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
                                  id="modal-name"
                                  name="name"
                                  autoComplete="name"
                                  placeholder="Ваше имя"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  icon={<User className="w-5 h-5 text-slate-400" />}
                                  required
                                  disabled={isLoading}
                              />
                              <Input 
                                  label="Номер телефона"
                                  hideLabel
                                  variant="light"
                                  id="modal-phone"
                                  name="phone"
                                  autoComplete="tel"
                                  type="tel"
                                  placeholder="+7 (777) 123-45-67"
                                  value={phone}
                                  onChange={handlePhoneChange}
                                  error={phoneError}
                                  icon={<Phone className="w-5 h-5 text-slate-400" />}
                                  required
                                  disabled={isLoading}
                              />

                              <Button 
                                  type="submit" 
                                  variant="solid"
                                  size="lg"
                                  isLoading={isLoading}
                                  className="w-full h-[58px]"
                                  rightIcon={<ArrowRight className="w-5 h-5" />}
                              >
                                  {buttonText}
                              </Button>
                          </form>
                          
                          {/* КНОПКА WHATSAPP */}
                          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                              <p className="text-slate-400 text-xs mb-3 font-medium">Не хотите ждать?</p>
                              
                              <Button 
                                  onClick={handleDirectWhatsApp}
                                  variant="outline"
                                  className="w-full text-emerald-600 hover:text-emerald-500 hover:bg-emerald-50 border-emerald-200/80 hover:border-emerald-300"
                                  leftIcon={<MessageCircle className="w-4 h-4" />}
                              >
                                  Написать в WhatsApp
                              </Button>
                          </div>

                          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
                              <ShieldCheck className="w-3 h-3 text-slate-500"/> Ваши данные в безопасности
                          </div>
                      </>
                  )}

              </div>
          </Card>
        </div>
    </div>,
    document.body
  );
}