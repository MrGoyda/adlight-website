"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader2, Phone, User } from "lucide-react";

interface ComplexCTAProps {
  source?: string; 
}

export default function ComplexCTA({ source = "Complex CTA (По умолчанию)" }: ComplexCTAProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          message: "Заявка с большого блока (Complex CTA)",
          source: source
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({ name: "", phone: "" });
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        alert("Ошибка отправки. Попробуйте позже.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ошибка соединения.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 bg-[#020617] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12 lg:p-16 backdrop-blur-sm shadow-2xl flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Работаем прямо сейчас
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              Готовы обсудить <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">ваш проект?</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Оставьте номер телефона. Инженер перезвонит в течение 15 минут, ответит на вопросы и сделает предварительный расчет сметы.
            </p>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-4">
                <div className="w-12 h-12 rounded-full border-2 border-slate-900 bg-slate-700"></div>
                <div className="w-12 h-12 rounded-full border-2 border-slate-900 bg-slate-600"></div>
                <div className="w-12 h-12 rounded-full border-2 border-slate-900 bg-slate-500 flex items-center justify-center text-white font-bold text-xs">+300</div>
              </div>
              <div className="text-sm text-slate-400">
                <strong className="text-white block">Довольных клиентов</strong>
                по всей Астане
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl relative">
            {isSuccess ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-slate-950 rounded-2xl animate-in fade-in zoom-in">
                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Заявка принята!</h3>
                <p className="text-slate-400">Менеджер уже получил ваше сообщение и свяжется с вами в ближайшее время.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="complex-name" className="block text-sm font-medium text-slate-400 mb-2">Ваше имя</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      type="text" 
                      id="complex-name"
                      name="name"
                      autoComplete="name"
                      required
                      placeholder="Алексей"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition outline-none placeholder:text-slate-600"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="complex-phone" className="block text-sm font-medium text-slate-400 mb-2">Номер телефона</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      type="tel" 
                      id="complex-phone"
                      name="phone"
                      autoComplete="tel"
                      required
                      placeholder="+7 (777) 000-00-00"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition outline-none placeholder:text-slate-600"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Отправка...
                    </>
                  ) : (
                    <>
                      Отправить заявку <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
                
                <p className="text-center text-xs text-slate-500 mt-4">
                  Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}