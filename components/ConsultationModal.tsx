"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Phone, User, ArrowRight, MessageCircle, Loader2, CheckCircle, ShieldCheck } from "lucide-react";

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
        // Авто-закрытие через 3 секунды
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

        {/* Modal */}
        <div 
            className={`relative w-full max-w-md bg-[#0F172A] border border-slate-700 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden transition-all duration-300 ease-out transform ${
              isVisible ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
            }`}
        >
            {/* Декор */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-[60px] rounded-full pointer-events-none"></div>

            <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition z-50"
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
                        <h3 className="text-2xl font-bold text-white mb-2">Заявка принята!</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            Менеджер уже получил уведомление в Telegram и перезвонит вам в ближайшее время.
                        </p>
                        <button 
                            onClick={onClose}
                            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition font-bold text-sm w-full"
                        >
                            Отлично
                        </button>
                    </div>
                ) : (
                    // ЭКРАН ФОРМЫ
                    <>
                        <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 mb-6 border border-orange-500/20">
                            <Phone className="w-6 h-6"/>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2">Нужна консультация?</h3>
                        <p className="text-gray-400 text-sm mb-8">
                            Оставьте номер телефона. Мы перезвоним в течение 15 минут.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"/>
                                <input 
                                    type="text" 
                                    placeholder="Ваше имя"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition placeholder:text-gray-600"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"/>
                                <input 
                                    type="tel" 
                                    placeholder="+7 (___) ___-__-__"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition placeholder:text-gray-600"
                                    required
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <><Loader2 className="w-5 h-5 animate-spin"/> Отправка...</>
                                ) : (
                                    <>Жду звонка <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/></>
                                )}
                            </button>
                        </form>
                        
                        {/* КНОПКА WHATSAPP */}
                        <div className="mt-6 pt-6 border-t border-slate-800 text-center">
                            <p className="text-gray-500 text-xs mb-3">Не хотите ждать?</p>
                            <button 
                                onClick={handleDirectWhatsApp}
                                className="inline-flex items-center justify-center gap-2 text-green-500 hover:text-green-400 font-bold transition text-sm py-2 px-4 rounded-lg hover:bg-green-500/10 w-full sm:w-auto"
                            >
                                <MessageCircle className="w-4 h-4"/> Написать в WhatsApp
                            </button>
                        </div>

                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-600 font-medium">
                            <ShieldCheck className="w-3 h-3"/> Ваши данные в безопасности
                        </div>
                    </>
                )}

            </div>
        </div>
    </div>,
    document.body
  );
}