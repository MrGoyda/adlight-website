"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Phone, User, ArrowRight, MessageCircle, CheckCircle, ShieldCheck } from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Typography from "@/components/ui/Typography";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: string; 
}

export default function ConsultationModal({ isOpen, onClose, source }: ConsultationModalProps) {
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, source }),
      });

      if (res.ok) {
        setIsSuccess(true);
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
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
        {/* Overlay */}
        <div 
            className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-out ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            onClick={onClose}
        ></div>

        {/* Modal Window using design system components */}
        <div className="w-full max-w-md relative">
          <Card 
              glass
              intensity="heavy"
              rounded="3xl"
              className={`w-full shadow-apple-modal border border-slate-700/80 overflow-hidden transition-all duration-300 ease-out transform ${
                isVisible ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
              }`}
          >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-[60px] rounded-full pointer-events-none"></div>

              <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition z-50"
                  aria-label="Закрыть"
              >
                  <X className="w-6 h-6"/>
              </button>

              <div className="p-8 relative z-10">
                  
                  {isSuccess ? (
                      // ЭКРАН УСПЕХА
                      <div className="text-center py-6 animate-in fade-in zoom-in duration-300">
                          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
                              <CheckCircle className="w-10 h-10"/>
                          </div>
                          <Typography variant="h3" className="mb-2">Заявка принята!</Typography>
                          <Typography variant="body" className="mb-6">
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

                          <Typography variant="h3" className="mb-2">Нужна консультация?</Typography>
                          <Typography variant="body" className="mb-8">
                              Оставьте номер телефона. Мы перезвоним в течение 15 минут.
                          </Typography>

                          <form onSubmit={handleSubmit} className="space-y-4">
                              <Input 
                                  label="Ваше имя"
                                  hideLabel
                                  id="modal-name"
                                  name="name"
                                  autoComplete="name"
                                  placeholder="Ваше имя"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  icon={<User className="w-5 h-5 text-slate-500" />}
                                  required
                                  disabled={isLoading}
                              />
                              <Input 
                                  label="Номер телефона"
                                  hideLabel
                                  id="modal-phone"
                                  name="phone"
                                  autoComplete="tel"
                                  type="tel"
                                  placeholder="+7 (___) ___-__-__"
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  icon={<Phone className="w-5 h-5 text-slate-500" />}
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
                                  Жду звонка
                              </Button>
                          </form>
                          
                          {/* КНОПКА WHATSAPP */}
                          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
                              <p className="text-gray-500 text-xs mb-3">Не хотите ждать?</p>
                              
                              <Button 
                                  onClick={handleDirectWhatsApp}
                                  variant="outline"
                                  className="w-full text-green-500 hover:text-green-400 hover:bg-green-500/10 border-green-500/20 hover:border-green-500/50"
                                  leftIcon={<MessageCircle className="w-4 h-4" />}
                              >
                                  Написать в WhatsApp
                              </Button>
                          </div>

                          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-600 font-medium">
                              <ShieldCheck className="w-3 h-3"/> Ваши данные в безопасности
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