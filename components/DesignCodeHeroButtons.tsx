"use client";

import { useState } from "react";
import { MessageCircle, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import ConsultationModal from "@/components/ConsultationModal";

import { DESIGN_CODE_TEXTS } from "@/dictionaries/design-code";

export default function DesignCodeHeroButtons() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4">
         <Button 
           onClick={() => setIsModalOpen(true)}
           variant="solid"
           size="xl"
           leftIcon={<MessageCircle className="w-5 h-5"/>}
         >
            {DESIGN_CODE_TEXTS.hero.btnConsult}
         </Button>
         
         <Button 
            href="#check" 
            variant="secondary"
            size="xl"
            leftIcon={<Search className="w-5 h-5"/>}
         >
            {DESIGN_CODE_TEXTS.hero.btnCheck}
         </Button>
      </div>

      <ConsultationModal 
         isOpen={isModalOpen} 
         onClose={() => setIsModalOpen(false)} 
         source="Страница: Дизайн-код (Hero)"
         title={DESIGN_CODE_TEXTS.hero.modal.title}
         subtitle={DESIGN_CODE_TEXTS.hero.modal.subtitle}
         buttonText={DESIGN_CODE_TEXTS.hero.modal.btnText}
      />
    </>
  );
}