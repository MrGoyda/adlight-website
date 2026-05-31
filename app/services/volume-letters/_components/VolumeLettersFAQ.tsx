"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { VOLUME_LETTERS_DICT } from "@/dictionaries/services/volume-letters";

export default function VolumeLettersFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqData = VOLUME_LETTERS_DICT.faq;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded-full uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              {faqData.badge}
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              {faqData.title}
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
              {faqData.subtitle}
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {faqData.items.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? "border-orange-500 shadow-lg shadow-orange-500/5 ring-1 ring-orange-500/20"
                      : "border-slate-200 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-2xl group"
                    aria-expanded={isOpen}
                  >
                    <span className="font-bold text-slate-800 text-lg leading-snug group-hover:text-orange-600 transition-colors pr-4">
                      {item.question}
                    </span>
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                        isOpen
                          ? "bg-orange-500 text-white"
                          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700"
                      } shrink-0`}
                    >
                      {isOpen ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </span>
                  </button>

                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      isOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-6 pt-0 border-t border-slate-100 text-slate-600 leading-relaxed text-base">
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
