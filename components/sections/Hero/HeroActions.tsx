"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Play } from "lucide-react";
import Button from "@/components/ui/Button";

// Ленивая подгрузка модалок (Dynamic Imports) для снижения TBT и улучшения первой загрузки
const ConsultationModal = dynamic(() => import("@/components/ConsultationModal"), { ssr: false });
const QuizModal = dynamic(() => import("@/components/QuizModal"), { ssr: false });
const VideoModal = dynamic(() => import("@/components/VideoModal"), { ssr: false });

export default function HeroActions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // URL видеоприветствия на Cloudflare Stream
  const videoUrl = "https://customer-k57fhnmtl06s1m6v.cloudflarestream.com/5d5b305d05486d34bfda7cda928dfa57/iframe";

  return (
    <>
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-2">
        <Button
          onClick={() => setIsQuizOpen(true)}
          variant="solid"
          size="xl"
          className="h-14 rounded-2xl text-base px-8 font-extrabold"
        >
          Подобрать услугу
        </Button>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="lightOutline"
          size="xl"
          className="h-14 rounded-2xl text-base px-8 border-slate-250 shadow-md hover:shadow-lg transition-colors duration-300"
        >
          Оставить заявку
        </Button>

        <Button
          onClick={() => setIsVideoOpen(true)}
          variant="lightGlass"
          size="xl"
          className="h-14 rounded-2xl text-base pl-4 pr-7 border-slate-200 shadow-md hover:shadow-lg transition-colors duration-300"
          leftIcon={
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center relative">
              <Play className="w-3.5 h-3.5 text-white fill-current ml-0.5" />
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-30"></div>
            </div>
          }
        >
          Видеоприветствие
        </Button>
      </div>

      {/* Рендерим модальные окна только при необходимости */}
      {isModalOpen && (
        <ConsultationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          source="Главная (Hero Section - Заявка)"
          title="Заявка на консультацию"
          subtitle="Оставьте ваши контакты. Наш менеджер свяжется с вами для подбора оптимального решения по наружной рекламе."
          buttonText="Отправить заявку"
        />
      )}

      {isQuizOpen && (
        <QuizModal
          isOpen={isQuizOpen}
          onClose={() => setIsQuizOpen(false)}
        />
      )}

      {isVideoOpen && (
        <VideoModal
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
          videoUrl={videoUrl}
        />
      )}
    </>
  );
}
