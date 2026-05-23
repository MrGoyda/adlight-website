"use client";

import { useState } from "react";
import { ShieldCheck, XCircle, Ruler, CheckCircle, User, Phone } from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Typography from "@/components/ui/Typography";

interface CallToActionProps {
  source: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

export default function CallToAction({ 
  source, 
  title = "Получите бесплатный дизайн-проект", 
  subtitle = "Оставьте контакты, и мы пришлём пример фотопривязки для вашей вывески.",
  buttonText = "Отправить"
}: CallToActionProps) {
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const renderTitle = () => {
    const highlights = [
      "Дизайн-кодом", "Дизайн-коду", "Дизайн-код", "Дизайн код",
      "дизайн-проект", "бесплатно", "подарок"
    ].sort((a, b) => b.length - a.length);
    
    let html = title;
    const regex = new RegExp(`(${highlights.join('|')})`, 'gi');
    html = html.replace(regex, '<span class="text-orange-500">$1</span>');

    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <section data-aos="fade-up" className="py-24 bg-[#0F172A]">
      <div className="container mx-auto px-4">
        <Card 
          glass 
          rounded="3xl" 
          className="p-8 md:p-16 shadow-apple-card border border-slate-800"
        >
          <div className="absolute top-0 left-1/2 w-full h-full bg-orange-600/10 blur-[150px] -z-10 rounded-full pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            
            <Typography variant="h2" className="mb-4 text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {renderTitle()}
            </Typography>
            
            <Typography variant="lead" className="mb-10 max-w-2xl mx-auto">
              {subtitle}
            </Typography>
            
            {isSuccess ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 mb-6 animate-in fade-in zoom-in duration-300 max-w-2xl mx-auto">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Заявка успешно отправлена!</h3>
                  <p className="text-slate-300 text-sm">Наш менеджер свяжется с вами в ближайшее время.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 w-full max-w-2xl mx-auto mb-6 items-end">
                <div className="flex-1 w-full">
                  <Input 
                    label="Ваше имя"
                    hideLabel
                    id="cta-name"
                    name="name"
                    autoComplete="name"
                    placeholder="Ваше имя" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    icon={<User className="w-5 h-5 text-slate-500" />}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="flex-1 w-full">
                  <Input 
                    label="Номер телефона"
                    hideLabel
                    id="cta-phone"
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
                </div>

                <Button 
                  type="submit" 
                  variant="solid" 
                  size="lg"
                  isLoading={isLoading}
                  className="w-full md:w-auto h-[58px] min-w-[150px]"
                >
                  {buttonText}
                </Button>
              </form>
            )}
            
            <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2 text-gray-400"><ShieldCheck className="w-5 h-5 text-green-500"/> Гарантия по договору</div>
              <div className="flex items-center gap-2 text-gray-400"><XCircle className="w-5 h-5 text-red-500"/> Без спама и звонков</div>
              <div className="flex items-center gap-2 text-gray-400"><Ruler className="w-5 h-5 text-orange-500"/> Замер бесплатно</div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}