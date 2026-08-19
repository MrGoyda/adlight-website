"use client";

import dynamic from "next/dynamic";
import { useModalStore } from "@/lib/store/useModalStore";

const ConsultationModal = dynamic(() => import("@/components/ConsultationModal"), { ssr: false });
const QuizModal = dynamic(() => import("@/components/QuizModal"), { ssr: false });
const VideoModal = dynamic(() => import("@/components/VideoModal"), { ssr: false });

export default function GlobalModals() {
  const { consultation, quiz, video, closeConsultation, closeQuiz, closeVideo } = useModalStore();

  return (
    <>
      {consultation.isOpen && (
        <ConsultationModal
          isOpen={consultation.isOpen}
          onClose={closeConsultation}
          source={consultation.options.source}
          title={consultation.options.title}
          subtitle={consultation.options.subtitle}
          buttonText={consultation.options.buttonText}
          customMessage={consultation.options.customMessage}
        />
      )}

      {quiz.isOpen && (
        <QuizModal
          isOpen={quiz.isOpen}
          onClose={closeQuiz}
          serviceContext={quiz.options?.serviceContext}
        />
      )}

      {video.isOpen && (
        <VideoModal
          isOpen={video.isOpen}
          onClose={closeVideo}
          videoUrl={video.options.videoUrl}
        />
      )}
    </>
  );
}
