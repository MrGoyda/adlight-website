"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import VideoModal from "./VideoModal";

export default function VideoModalWrapper({ videoUrl }: { videoUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button 
        whileTap={{ scale: 0.95 }}
        whileHover={{ y: -2, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 500, damping: 14 }}
        onClick={() => setIsOpen(true)}
        className="group inline-flex items-center gap-3 pl-2 pr-6 py-2 bg-white/90 hover:bg-slate-50 border border-slate-200/80 text-slate-800 rounded-full shadow-xs transition-colors cursor-pointer"
      >
        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-md shadow-red-500/10 group-hover:scale-105 transition-transform relative">
           <Play className="w-4.5 h-4.5 text-white fill-current ml-0.5"/>
           <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-35"></div>
        </div>
        <span className="font-extrabold text-sm tracking-wide">Смотреть видеообзор</span>
      </motion.button>

      <VideoModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        videoUrl={videoUrl} 
      />
    </>
  );
}