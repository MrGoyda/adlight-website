// app/services/facade-decoration/_components/FacadeDecorationRules.tsx

import { CheckCircle2, XCircle, FileText } from "lucide-react";

export default function FacadeDecorationRules() {
  const data = {
    title: "Дизайн-код Астаны для оформления фасадов и витрин",
    subtitle: "Проектируем и оформляем фасады коммерческих помещений в строгом соответствии с градостроительным регламентом Астаны",
    badgeAllowed: "Разрешено Акиматом",
    badgeForbidden: "Запрещено законом",
    allowed: [
      {
        title: "Облицовка в тон здания",
        desc: "Цветовая гамма композитных панелей фриза или входной группы должна гармонировать с общим фасадом жилого комплекса."
      },
      {
        title: "Сохранение пропорций остекления",
        desc: "Оформление витрин рекламной пленкой должно сохранять светопропускную способность оконных проемов."
      },
      {
        title: "Интеграция вывесок в фриз",
        desc: "Облицовочный композитный короб (фриз) служит идеальным и законным местом для размещения объемных букв."
      },
      {
        title: "Качественные материалы облицовки",
        desc: "Использование сертифицированных негорючих композитных панелей алюкобонда класса Г1."
      }
    ],
    forbidden: [
      {
        title: "Сплошная оклейка окон (более 30%)",
        desc: "Запрещено полностью заклеивать стекла витрин глухой непрозрачной пленкой. Окна должны оставаться открытыми для обзора."
      },
      {
        title: "Зашивание архитектурного декора",
        desc: "Категорически запрещено закрывать композитом пилястры, карнизы, колонны и другие декоративные элементы фасада."
      },
      {
        title: "Использование дешевого сайдинга",
        desc: "Акимат запрещает использовать дешевые пластиковые и виниловые панели для облицовки коммерческих объектов."
      },
      {
        title: "Перекрытие вентиляционных шахт",
        desc: "Облицовочный фасад не должен блокировать выходы вентиляции и доступ к общедомовым коммуникациям."
      }
    ]
  };

  return (
    <section id="rules" className="py-24 bg-slate-50 border-t border-slate-200/80 relative">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded-full uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            Дизайн-код Астаны
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {data.title}
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Allowed Column */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                {data.badgeAllowed}
              </span>
            </h3>
            <div className="space-y-6">
              {data.allowed.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0 font-bold text-xs border border-green-100 mt-1">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-slate-800 font-bold text-base mb-1">{item.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Forbidden Column */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <XCircle className="w-6 h-6 text-red-500 shrink-0" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">
                {data.badgeForbidden}
              </span>
            </h3>
            <div className="space-y-6">
              {data.forbidden.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0 font-bold text-xs border border-red-100 mt-1">
                    ✕
                  </div>
                  <div>
                    <h4 className="text-slate-800 font-bold text-base mb-1">{item.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
