// app/design-code/_components/DesignCodeBans.tsx
// Server Component — нет хуков/браузерных API

import { Ban, ShieldAlert } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import { DESIGN_CODE_BANS, DESIGN_CODE_TEXTS } from "@/dictionaries/design-code";

export default function DesignCodeBans() {
  return (
    <section
      id="bans"
      className="py-24 bg-white border-t border-slate-100 scroll-mt-20"
      aria-labelledby="bans-heading"
    >
      <div className="container mx-auto px-4">
        <FadeIn direction="up">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-slate-200" />
            <h2
              id="bans-heading"
              className="text-3xl font-black text-slate-950 text-center flex items-center gap-3 tracking-tight"
            >
              <ShieldAlert className="w-8 h-8 text-red-500 animate-pulse" aria-hidden="true" />
              <span>{DESIGN_CODE_TEXTS.bans.title}</span>
            </h2>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
        </FadeIn>

        {/* ul/li — правильная семантика для скринридеров и SEO */}
        <ul role="list" className="grid md:grid-cols-3 gap-6 list-none">
          {DESIGN_CODE_BANS.map((item, i) => (
            <FadeIn key={item.title} direction="up" delay={i * 50}>
              <li className="flex gap-4 p-6 bg-red-50/30 border border-red-100/60 rounded-3xl hover:bg-red-50/60 hover:scale-[1.01] hover:shadow-md transition-all duration-300">
                <Ban className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" aria-hidden="true" />
                <div>
                  {/* h3 — корректная иерархия: section(h2) → карточка(h3) */}
                  <h3 className="text-slate-950 font-bold mb-2 tracking-tight text-base">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed font-semibold">
                    {item.desc}
                  </p>
                </div>
              </li>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
