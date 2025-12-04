"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import VideoModal from "./VideoModal";

export default function VideoModalWrapper({ videoUrl }: { videoUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-3 pl-2 pr-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full backdrop-blur-md transition-all active:scale-95"
      >
        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-900/50 group-hover:scale-110 transition-transform relative">
           <Play className="w-4 h-4 text-white fill-current ml-0.5"/>
           <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-30"></div>
        </div>
        <span className="text-white font-bold text-sm tracking-wide">Смотреть обзор</span>
      </button>

      <VideoModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        videoUrl={videoUrl} 
      />
    </>
  );
}