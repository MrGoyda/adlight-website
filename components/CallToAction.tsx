"use client";

import { useState } from "react";
import { ShieldCheck, XCircle, Ruler, CheckCircle, User, Phone } from "lucide-react";
import Button from "@/components/ui/Button";

interface CallToActionProps {
  source: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

export default function CallToAction({ 
  source, 
  title = "Получите бесплатный дизайн-проект вывески", 
  subtitle = "Оставьте контакты, и мы пришлём пример фотопривязки «до / после» для вашего фасада.",
  buttonText = "Отправить заявку"
}: CallToActionProps) {
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    
    if (phoneError) setPhoneError("");

    const digits = inputVal.replace(/\D/g, "");
    
    if (digits.length === 0) {
      setPhone("");
      return;
    }

    let formatted = "+7 ";
    let core = digits;
    if (digits.startsWith("7") || digits.startsWith("8")) {
      core = digits.slice(1);
    }

    if (core.length > 0) {
      formatted += "(" + core.slice(0, 3);
    }
    if (core.length > 3) {
      formatted += ") " + core.slice(3, 6);
    }
    if (core.length > 6) {
      formatted += "-" + core.slice(6, 8);
    }
    if (core.length > 8) {
      formatted += "-" + core.slice(8, 10);
    }

    setPhone(formatted);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (nameError) setNameError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic();

    let valid = true;

    if (name.trim().length < 2) {
      setNameError("Введите корректное имя");
      valid = false;
    }

    const digitsCount = phone.replace(/\D/g, "").length;
    if (digitsCount < 11) {
      setPhoneError("Введите корректный номер телефона");
      valid = false;
    }

    if (!valid) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          message: "Заявка с блока Call To Action",
          source: source
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setName("");
        setPhone("");
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        alert("Произошла ошибка. Попробуйте позже или напишите нам в WhatsApp.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ошибка соединения.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-white overflow-hidden relative border-t border-slate-200/50">
      
      {/* Decorative ambient glass glows */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-orange-500/[0.02] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-orange-500/[0.012] rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-slate-50/50 p-8 md:p-16 rounded-[2.5rem] border border-slate-200/80 shadow-[0_15px_40px_rgba(0,0,0,0.01)] max-w-5xl mx-auto relative overflow-hidden">
          
          <div className="absolute -top-24 -left-24 w-[300px] h-[300px] bg-orange-500/[0.01] rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl mx-auto text-center relative z-10">
            
            <h2 className="mb-4 text-3xl md:text-5.5xl font-black tracking-tight text-slate-950 leading-tight">
              Получите бесплатный <span className="text-orange-500">дизайн-проект</span> вывески
            </h2>
            
            <p className="mb-10 text-slate-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-semibold">
              {subtitle}
            </p>
            
            {isSuccess ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-6 animate-in fade-in zoom-in duration-300 max-w-xl mx-auto">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-950">Заявка успешно отправлена!</h3>
                  <p className="text-slate-500 text-sm">Свяжемся с вами в течение 10 минут.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 w-full max-w-2xl mx-auto mb-6 items-end">
                
                {/* Input Name */}
                <div className="flex-1 w-full text-left space-y-2">
                  <label htmlFor="cta-name" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Ваше имя</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-450" />
                    <input 
                      id="cta-name"
                      type="text"
                      placeholder="Имя"
                      value={name}
                      onChange={handleNameChange}
                      className={`w-full bg-white border ${nameError ? 'border-red-500 focus:border-red-500' : 'border-slate-200/80 focus:border-orange-500'} text-slate-900 rounded-2xl py-4 pl-12 pr-4 transition outline-none placeholder:text-slate-400 font-semibold text-sm`}
                      disabled={isLoading}
                    />
                  </div>
                  {nameError && <p className="text-[10px] text-red-500 font-bold pl-1">{nameError}</p>}
                </div>
                
                {/* Input Phone */}
                <div className="flex-1 w-full text-left space-y-2">
                  <label htmlFor="cta-phone" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Номер телефона</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-455" />
                    <input 
                      id="cta-phone"
                      type="tel"
                      placeholder="+7 (707) 000-00-00"
                      value={phone}
                      onChange={handlePhoneChange}
                      className={`w-full bg-white border ${phoneError ? 'border-red-500 focus:border-red-500' : 'border-slate-200/80 focus:border-orange-500'} text-slate-900 rounded-2xl py-4 pl-12 pr-4 transition outline-none placeholder:text-slate-400 font-semibold text-sm`}
                      disabled={isLoading}
                    />
                  </div>
                  {phoneError && <p className="text-[10px] text-red-500 font-bold pl-1">{phoneError}</p>}
                </div>

                <Button 
                  type="submit" 
                  variant="solid" 
                  size="lg"
                  isLoading={isLoading}
                  className="w-full md:w-auto h-[54px] min-w-[180px] bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg active:scale-97 text-center shrink-0 border border-orange-600"
                >
                  {buttonText}
                </Button>
              </form>
            )}
            
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-xs font-bold text-slate-400">
              <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600"/> Гарантия по договору</div>
              <div className="flex items-center gap-1.5"><XCircle className="w-4 h-4 text-rose-600"/> Без спама и наценок</div>
              <div className="flex items-center gap-1.5"><Ruler className="w-4 h-4 text-orange-500"/> Замер и проект бесплатно</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}