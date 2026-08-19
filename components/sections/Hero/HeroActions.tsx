"use client";

import Button from "@/components/ui/Button";
import { useModalStore } from "@/lib/store/useModalStore";

export default function HeroActions() {
  const { openConsultation, openQuiz } = useModalStore();

  const handleOpenQuiz = () => {
    openQuiz();
  };

  const handleOpenConsultation = () => {
    openConsultation({
      source: "Главная (Hero Section - Заявка)",
      title: "Заявка на консультацию",
      subtitle: "Оставьте ваши контакты. Наш менеджер свяжется с вами для подбора оптимального решения по наружной рекламе.",
      buttonText: "Отправить заявку",
    });
  };

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-2">
      <Button
        onClick={handleOpenQuiz}
        variant="solid"
        size="xl"
        className="h-14 rounded-2xl text-base px-8 font-extrabold"
      >
        Подобрать услугу
      </Button>

      <Button
        onClick={handleOpenConsultation}
        variant="lightOutline"
        size="xl"
        className="h-14 rounded-2xl text-base px-8 border-slate-250 shadow-md hover:shadow-lg transition-colors duration-300"
      >
        Оставить заявку
      </Button>
    </div>
  );
}
