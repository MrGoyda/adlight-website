"use client";

import { useState } from "react";
import { MessageCircle, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import ConsultationModal from "@/components/ConsultationModal";

export default function DesignCodeHeroButtons() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4">
         <Button 
           onClick={() => setIsModalOpen(true)}
           variant="solid"
           size="xl"
           className="bg-blue-600 hover:bg-blue-700 text-white border-blue-500/20 shadow-blue-900/20"
           leftIcon={<MessageCircle className="w-5 h-5"/>}
         >
            Бесплатная консультация
         </Button>
         
         <Button 
            href="#check" 
            variant="secondary"
            size="xl"
            leftIcon={<Search className="w-5 h-5"/>}
         >
            Проверить вывеску
         </Button>
      </div>

      <ConsultationModal 
         isOpen={isModalOpen} 
         onClose={() => setIsModalOpen(false)} 
         source="Страница: Дизайн-код (Hero)"
         title="Консультация по дизайн-коду"
         subtitle="Поможем разобраться в новых правилах размещения рекламы в Астане и избежать штрафов."
         buttonText="Проконсультироваться"
      />
    </>
  );
}