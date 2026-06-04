// app/contacts/_components/ContactsFaq.tsx

import { ChevronDown } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import { CONTACTS_DICT } from "@/dictionaries/contacts";

interface ContactsFaqProps {
  activeFaq: number | null;
  setActiveFaq: (index: number | null) => void;
  triggerHaptic: () => void;
}

export default function ContactsFaq({ activeFaq, setActiveFaq, triggerHaptic }: ContactsFaqProps) {
  const dict = CONTACTS_DICT.faq;

  // Данные FAQ аккордеона
  const faqList = [
    {
      q: "Работает ли ADLight с юридическими лицами и как производится оплата?",
      a: "Да, мы работаем как с физическими, так и с юридическими лицами по всему Казахстану. Оплата принимается наличным расчетом, банковскими картами и безналичным переводом на расчетный счет ИП Гойденко Е.И. Предоставляем полный пакет закрывающих документов."
    },
    {
      q: "Нужно ли договариваться о визите в цех заранее?",
      a: "Да, мы настоятельно рекомендуем согласовать время визита с менеджером отдела продаж по телефону. Это необходимо, чтобы наш ведущий технолог был на месте, подготовил для вас образцы материалов (акрила, жидкого акрила, светодиодов) и уделил вашему проекту максимум времени."
    },
    {
      q: "Осуществляете ли вы доставку и монтаж вывесок в других регионах?",
      a: "Наш цех находится в Астане (ул. Аспара, 7), где мы выполняем полный цикл производства и монтажа. Доставку готовых рекламных конструкций осуществляем во все регионы Казахстана надежными транспортными компаниями с жесткой обрешеткой."
    }
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 max-w-4xl">
        <FadeIn direction="up">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-955 tracking-tight text-center mb-10">
            {dict.title}
          </h2>
        </FadeIn>
        <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
          {faqList.map((item, idx) => (
            <FadeIn key={idx} direction="up" delay={idx * 0.1}>
              <div 
                itemScope 
                itemProp="mainEntity" 
                itemType="https://schema.org/Question" 
                className="border border-slate-250 rounded-2xl overflow-hidden bg-slate-50/50 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <button
                  onClick={() => {
                    triggerHaptic();
                    setActiveFaq(activeFaq === idx ? null : idx);
                  }}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span itemProp="name" className="font-extrabold text-slate-955 text-base md:text-lg pr-4">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-700 shrink-0 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  itemProp="acceptedAnswer" 
                  itemScope 
                  itemType="https://schema.org/Answer" 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${activeFaq === idx ? 'max-h-60 border-t border-slate-200' : 'max-h-0'}`}
                >
                  <div itemProp="text" className="px-6 py-5 text-slate-900 text-sm md:text-base leading-relaxed font-semibold bg-white">
                    {item.a}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
