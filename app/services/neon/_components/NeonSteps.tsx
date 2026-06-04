// app/services/neon/_components/NeonSteps.tsx

export default function NeonSteps() {
  const steps = [
    {
      step: "01",
      title: "Эскиз и Размеры",
      desc: "Дизайнер подбирает шрифт, согласовывает цвет неона и делает макет с привязкой к вашему интерьеру или витрине."
    },
    {
      step: "02",
      title: "Фрезеровка основы",
      desc: "На ЧПУ станке вырезаем фигурный или прямоугольный задник из оргстекла с пазами для укладки неонового провода."
    },
    {
      step: "03",
      title: "Укладка силикона",
      desc: "Мастер нарезает гибкий силиконовый неон нужной длины и аккуратно вклеивает его в направляющие пазы."
    },
    {
      step: "04",
      title: "Пайка контактов",
      desc: "Все элементы соединяются тонким прозрачным проводом. Контакты запаиваются и закрываются термоусадкой."
    },
    {
      step: "05",
      title: "Сдача и Монтаж",
      desc: "Тестируем свечение 24 часа. Доставляем, крепим на стену или подвешиваем на тросы и подключаем к сети."
    }
  ];

  return (
    <section className="py-24 bg-white border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="text-sm font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Процесс работы
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Как мы создаем неоновые шедевры
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            От макета в векторе до сочной светящейся вывески на вашей стене
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8 relative">
          {steps.map((item, idx) => (
            <div key={idx} className="relative flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center font-black text-2xl mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300 shadow-sm">
                {item.step}
              </div>
              <h3 className="text-slate-900 font-extrabold text-lg mb-2 group-hover:text-orange-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-[240px]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
