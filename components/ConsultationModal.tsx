"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Phone, User, ArrowRight, ShieldCheck } from "lucide-react";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: string; 
}

export default function ConsultationModal({ isOpen, onClose, source }: ConsultationModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [mounted, setMounted] = useState(false);

  // Состояние для CSS-анимации (отвечает за прозрачность и масштаб)
  const [isVisible, setIsVisible] = useState(false);
  // Состояние для рендеринга в DOM (отвечает за существование в HTML)
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Логика анимации появления/исчезновения
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true); // 1. Сначала монтируем в DOM (но прозрачным)
      document.body.style.overflow = "hidden";
      
      // 2. Через мгновение запускаем анимацию (добавляем классы видимости)
      const timer = setTimeout(() => {
        setIsVisible(true); 
      }, 50); // 50мс достаточно, чтобы браузер отрисовал начальный кадр
      
      return () => clearTimeout(timer);
    } else {
      // Закрытие
      setIsVisible(false); // 1. Сначала убираем прозрачность (анимация исчезновения)
      document.body.style.overflow = "";
      
      // 2. Ждем окончания анимации (300мс) и удаляем из DOM
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Закрытие по Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `👋 Заявка на консультацию!\n\n👤 Имя: ${name}\n📱 Телефон: ${phone}\n📍 Источник: ${source}`;
    window.open(`https://wa.me/77071356701?text=${encodeURIComponent(message)}`, '_blank');
    onClose();
  };

  if (!mounted || !shouldRender) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
        {/* Затемнение фона (Overlay) */}
        {/* Используем isVisible для управления прозрачностью */}
        <div 
            className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-out ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            onClick={onClose}
        ></div>

        {/* Окно (Modal) */}
        {/* Используем isVisible для масштаба и прозрачности */}
        <div 
            className={`relative w-full max-w-md bg-[#0F172A] border border-slate-700 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden transition-all duration-300 ease-out transform ${
              isVisible ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
            }`}
        >
            
            {/* Декор */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-[60px] rounded-full pointer-events-none"></div>

            {/* Кнопка Закрыть */}
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition z-50"
            >
                <X className="w-6 h-6"/>
            </button>

            <div className="p-8 relative z-10">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 mb-6 border border-orange-500/20">
                    <Phone className="w-6 h-6"/>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">Нужна консультация?</h3>
                <p className="text-gray-400 text-sm mb-8">
                    Оставьте номер телефона. Инженер перезвонит в течение 15 минут и ответит на вопросы по Дизайн-коду.
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

                    <button type="submit" className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2 group">
                        Жду звонка <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                    </button>
                </form>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-green-500 font-medium">
                    <ShieldCheck className="w-4 h-4"/> Ваши данные в безопасности
                </div>
            </div>
        </div>
    </div>,
    document.body
  );
}