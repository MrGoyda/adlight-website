"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { X, Phone, User, ArrowRight, MessageCircle, CheckCircle, ShieldCheck, Calculator } from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Typography from "@/components/ui/Typography";

import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { SITE_PRICES_NUMERIC, formatPrice, SITE_CONTACTS } from "@/config/site";
import { VOLUME_LETTERS_CATALOG } from "@/dictionaries/services/volume-letters";

import CustomDropdown, { DropdownOption } from "./CustomDropdown";
import PriceDisplay from "./PriceDisplay";
import CalculatorBanner from "./CalculatorBanner";

import { enrichLeadWithAnalytics } from "@/lib/utils";
import { trackClientConversion } from "@/lib/clientAnalytics";

interface CalculatePriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: string;
}

// Легковесная функция маскирования для номеров Казахстана (+7 (7XX) XXX-XX-XX)
const formatKazakhstanPhone = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return "";
  
  let cleanDigits = digits;
  if (digits.startsWith("7") || digits.startsWith("8")) {
    cleanDigits = digits.substring(1);
  }
  
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

export default function CalculatePriceModal({ isOpen, onClose, source }: CalculatePriceModalProps) {
  const pathname = usePathname();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [honeypot, setHoneypot] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Получение структуры цен и логики (мемоизация по пути)
  const serviceInfo = useMemo(() => {
    const path = pathname || "";
    if (path === "/services/volume-letters") {
      const options = VOLUME_LETTERS_CATALOG.map(item => ({
        label: item.title,
        value: item.slug,
        price: item.price
      }));
      return {
        title: "Расчет стоимости объемных букв",
        showDropdown: true,
        dropdownOptions: options,
        showCalculatorLink: true,
        priceText: ""
      };
    }
    
    if (path.startsWith("/services/volume-letters/")) {
      const slug = path.split("/").pop() || "";
      const tech = VOLUME_LETTERS_CATALOG.find(t => t.slug === slug);
      const priceVal = SITE_PRICES_NUMERIC.letters[slug as keyof typeof SITE_PRICES_NUMERIC.letters] || 550;
      return {
        title: `Расчет: ${tech?.title || "Объемные буквы"}`,
        priceText: `Цена на такие вывески в среднем от ${priceVal} ₸/см`,
        showDropdown: false,
        showCalculatorLink: true
      };
    }
    
    if (path === "/services/lightboxes") {
      const options = [
        { label: "Акриловый световой короб", value: "acrylic", price: `от ${formatPrice(SITE_PRICES_NUMERIC.lightboxes.acrylic)} ₸/м²` },
        { label: "Фигурный лайтбокс", value: "figured", price: `от ${formatPrice(SITE_PRICES_NUMERIC.lightboxes.figured)} ₸/м²` },
        { label: "Композитный световой короб", value: "composite", price: `от ${formatPrice(SITE_PRICES_NUMERIC.lightboxes.composite)} ₸/м²` },
        { label: "Баннерный световой короб", value: "banner", price: `от ${formatPrice(SITE_PRICES_NUMERIC.lightboxes.banner)} ₸/м²` },
      ];
      return {
        title: "Расчет стоимости световых коробов",
        showDropdown: true,
        dropdownOptions: options,
        showCalculatorLink: true,
        priceText: ""
      };
    }
    
    // Все остальные услуги
    const slug = path.split("/").pop() || "";
    let serviceTitle = "Наружная реклама";
    let priceText = "Цена по запросу";
    
    switch (slug) {
      case "panel-brackets":
        serviceTitle = "Панель-кронштейны";
        priceText = `Цена в среднем от ${formatPrice(SITE_PRICES_NUMERIC.services.panelBrackets)} ₸`;
        break;
      case "neon":
        serviceTitle = "Неоновые вывески";
        priceText = `Цена в среднем от ${formatPrice(SITE_PRICES_NUMERIC.services.neon)} ₸/пог.м`;
        break;
      case "interior":
        serviceTitle = "Интерьерные логотипы";
        priceText = `Цена в среднем от ${formatPrice(SITE_PRICES_NUMERIC.services.interior)} ₸`;
        break;
      case "navigation":
        serviceTitle = "Таблички и навигация";
        priceText = `Цена в среднем от ${formatPrice(SITE_PRICES_NUMERIC.services.navigation)} ₸`;
        break;
      case "banners-plates":
        serviceTitle = "Баннеры и стенды";
        priceText = `Цена в среднем от ${formatPrice(SITE_PRICES_NUMERIC.services.bannersPlates)} ₸/м²`;
        break;
      case "roof-installations":
        serviceTitle = "Крышные установки";
        priceText = "Цена рассчитывается индивидуально под проект";
        break;
      case "entrance-groups":
        serviceTitle = "Входные группы";
        priceText = "Цена рассчитывается индивидуально под проект";
        break;
      case "pylons":
        serviceTitle = "Стелы и пилоны";
        priceText = `Цена в среднем от ${formatPrice(SITE_PRICES_NUMERIC.services.pylons)} ₸`;
        break;
      case "led-screens":
        serviceTitle = "LED-экраны";
        priceText = `Цена в среднем от ${formatPrice(SITE_PRICES_NUMERIC.services.ledScreens)} ₸/м²`;
        break;
      case "exhibition-stands":
        serviceTitle = "Вывески на выставку";
        priceText = `Цена в среднем от ${formatPrice(SITE_PRICES_NUMERIC.services.exhibitionStands)} ₸`;
        break;
      case "branding-cars":
        serviceTitle = "Брендирование авто";
        priceText = `Цена в среднем от ${formatPrice(SITE_PRICES_NUMERIC.services.brandingCars)} ₸`;
        break;
      case "signboard-repair":
        serviceTitle = "Ремонт вывесок";
        priceText = `Цена в среднем от ${formatPrice(SITE_PRICES_NUMERIC.services.signboardRepair)} ₸`;
        break;
      case "facade-decoration":
        serviceTitle = "Оформление фасадов";
        priceText = `Цена в среднем от ${formatPrice(SITE_PRICES_NUMERIC.services.facadeDecoration)} ₸/м²`;
        break;
      case "window-branding":
        serviceTitle = "Брендирование витрин";
        priceText = `Цена в среднем от ${formatPrice(SITE_PRICES_NUMERIC.services.windowBranding)} ₸/м²`;
        break;
      case "architectural-lighting":
        serviceTitle = "Архитектурная подсветка";
        priceText = `Цена в среднем от ${formatPrice(SITE_PRICES_NUMERIC.services.architecturalLighting)} ₸`;
        break;
      case "design-code":
        serviceTitle = "Согласование вывесок";
        priceText = `Цена в среднем от ${formatPrice(SITE_PRICES_NUMERIC.services.designCode)} ₸`;
        break;
      default:
        serviceTitle = "Рекламные конструкции";
        priceText = "Цена рассчитывается индивидуально";
    }
    
    return {
      title: `Расчет: ${serviceTitle}`,
      priceText,
      showDropdown: false,
      showCalculatorLink: false
    };
  }, [pathname]);

  // Выбор первой опции, если это общий каталог
  useEffect(() => {
    if (serviceInfo.showDropdown && serviceInfo.dropdownOptions && serviceInfo.dropdownOptions.length > 0 && !selectedOption) {
      setSelectedOption(serviceInfo.dropdownOptions[0]);
    }
  }, [serviceInfo, selectedOption]);

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
      setSelectedOption(null);
      lockScroll("calculate-price-modal");
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Autofocus on open
        nameInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      unlockScroll("calculate-price-modal");
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

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatKazakhstanPhone(e.target.value);
    setPhone(formatted);
    if (phoneError) setPhoneError("");
  }, [phoneError]);

  const handleDropdownChange = useCallback((option: DropdownOption) => {
    setSelectedOption(option);
  }, []);

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

    const typeDetails = selectedOption ? ` (Тип: ${selectedOption.label}, Цена: ${selectedOption.price})` : "";
    const fullSource = `${source}${typeDetails}`;

    try {
      const res = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrichLeadWithAnalytics({ name, phone, source: fullSource, website: honeypot })),
      });

      if (res.ok) {
        setIsSuccess(true);
        trackClientConversion('form_calculate_price', {
          page_location: typeof window !== 'undefined' ? window.location.href : '',
          form_name: source || 'Calculate Price Modal',
          service_title: serviceInfo.title,
          selected_option: selectedOption?.label || '',
        });
        setName("");
        setPhone("");
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

  const handleDirectWhatsApp = useCallback(() => {
    trackClientConversion('click_whatsapp', {
      page_location: typeof window !== 'undefined' ? window.location.href : '',
      form_name: 'Calculate Price Modal Direct WhatsApp',
    });
    const typeDetails = selectedOption ? `%20(${selectedOption.label})` : "";
    window.open(`https://wa.me/${SITE_CONTACTS.phoneRaw}?text=Здравствуйте!%20Хочу%20рассчитать%20стоимость%20по%20направлению:%20${encodeURIComponent(serviceInfo.title)}${typeDetails}`, '_blank');
    onClose();
  }, [selectedOption, serviceInfo.title, onClose]);

  // Вычисление цены для рендеринга
  const priceToDisplay = useMemo(() => {
    if (serviceInfo.showDropdown) {
      return selectedOption?.price || "по запросу";
    }
    return serviceInfo.priceText || "Цена по запросу";
  }, [serviceInfo, selectedOption]);

  if (!mounted || !shouldRender) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-4 sm:p-6 pb-safe"
      role="dialog"
      aria-modal="true"
      aria-labelledby="calc-modal-title"
      ref={modalRef}
    >
      {/* Overlay */}
      <div 
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Modal Window */}
      <div 
        className={`w-full max-w-md relative z-10 max-h-[90dvh] overflow-y-auto custom-scrollbar rounded-[2.5rem] shadow-apple-modal border border-white/20 transition-all duration-300 ease-out transform ${
          isVisible ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
        }`}
      >
        <Card 
          glass
          intensity="light"
          rounded="3xl"
          className="w-full bg-white/80 backdrop-blur-2xl"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[60px] rounded-full pointer-events-none" aria-hidden="true"></div>

          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition z-50 cursor-pointer"
            aria-label="Закрыть"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>

          <div className="p-8 relative z-10">
            {isSuccess ? (
              <div className="text-center py-6 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6 border border-emerald-100" aria-hidden="true">
                  <CheckCircle className="w-10 h-10"/>
                </div>
                <Typography variant="h3" id="calc-modal-title" className="mb-2 text-slate-900 font-semibold">Расчет запрошен!</Typography>
                <Typography variant="body" className="mb-6 text-slate-500">
                  Специалист рассчитает стоимость и перезвонит вам в течение 15 минут.
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
              <>
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 mb-6 border border-orange-500/20" aria-hidden="true">
                  <Calculator className="w-6 h-6"/>
                </div>

                <Typography variant="h3" id="calc-modal-title" className="mb-2 text-slate-900 font-semibold">{serviceInfo.title}</Typography>
                
                {/* Кастомный селект для выбора технологии */}
                {serviceInfo.showDropdown && serviceInfo.dropdownOptions && (
                  <CustomDropdown 
                    label="Выберите тип конструкции"
                    options={serviceInfo.dropdownOptions}
                    selectedOption={selectedOption}
                    onChange={handleDropdownChange}
                  />
                )}

                {/* Вывод цен */}
                <PriceDisplay price={priceToDisplay} />

                <form onSubmit={handleSubmit} className="space-y-4">
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
                    ref={nameInputRef}
                    label="Ваше имя"
                    hideLabel
                    variant="light"
                    id="calc-modal-name"
                    name="name"
                    autoComplete="name"
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    icon={<User className="w-5 h-5 text-slate-400" aria-hidden="true" />}
                    required
                    disabled={isLoading}
                  />
                  <Input 
                    label="Номер телефона"
                    hideLabel
                    variant="light"
                    id="calc-modal-phone"
                    name="phone"
                    autoComplete="tel"
                    type="tel"
                    placeholder="+7 (707) 123-45-67"
                    value={phone}
                    onChange={handlePhoneChange}
                    error={phoneError}
                    icon={<Phone className="w-5 h-5 text-slate-400" aria-hidden="true" />}
                    required
                    disabled={isLoading}
                  />

                  <Button 
                    type="submit" 
                    variant="solid"
                    size="lg"
                    isLoading={isLoading}
                    className="w-full h-[58px]"
                    rightIcon={<ArrowRight className="w-5 h-5" aria-hidden="true" />}
                  >
                    Получить расчет
                  </Button>
                </form>

                {/* Ссылка на полноценный онлайн-калькулятор */}
                {serviceInfo.showCalculatorLink && (
                  <CalculatorBanner onClose={onClose} />
                )}
                
                {/* КНОПКА WHATSAPP */}
                <div className="mt-10 pt-8 border-t border-slate-200/80 text-center">
                  <p className="text-slate-500 text-xs mb-4 font-medium">Предпочитаете мессенджер?</p>
                  <Button 
                    onClick={handleDirectWhatsApp}
                    variant="outline"
                    className="w-full text-emerald-600 hover:text-emerald-500 hover:bg-emerald-50 border-emerald-200/80 hover:border-emerald-300 py-3.5"
                    leftIcon={<MessageCircle className="w-4 h-4" aria-hidden="true" />}
                  >
                    Написать в WhatsApp
                  </Button>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                  <span>Данные шифруются и не передаются третьим лицам</span>
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
