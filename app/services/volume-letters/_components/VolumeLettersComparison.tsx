// app/services/volume-letters/_components/VolumeLettersComparison.tsx

import { ShieldCheck, HelpCircle } from "lucide-react";
import { VOLUME_LETTERS_EXPERT, VOLUME_LETTERS_DICT } from "@/dictionaries/services/volume-letters";

export default function VolumeLettersComparison() {
  const data = VOLUME_LETTERS_EXPERT.comparison;

  return (
    <section id="comparison" className="py-24 bg-slate-50 border-t border-slate-200/80 w-full overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded-full uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            {VOLUME_LETTERS_DICT.comparison.badge}
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {data.title}
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="max-w-5xl mx-auto overflow-hidden bg-white border border-slate-200 shadow-sm rounded-3xl hidden md:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {data.headers.map((h, i) => (
                  <th key={i} className="p-6 text-sm font-bold text-slate-800 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors duration-200">
                  <td className="p-6 text-slate-900 font-bold text-base whitespace-nowrap">
                    {row.name}
                  </td>
                  <td className="p-6 text-slate-700 font-semibold text-sm">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 border border-orange-100">
                      {row.premium}
                    </span>
                  </td>
                  <td className="p-6 text-slate-600 text-sm">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {row.budget}
                    </span>
                  </td>
                  <td className="p-6 text-slate-500 text-sm leading-relaxed max-w-xs">
                    {row.importance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card-List View (Edge-to-Edge Responsive Horizontal Scroll) */}
        <div className="flex overflow-x-auto w-auto -mx-4 px-4 pb-8 gap-4 snap-x snap-mandatory md:hidden hide-scrollbar">
          {data.rows.map((row, idx) => (
            <div 
              key={idx} 
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm w-[82vw] max-w-[320px] snap-center flex flex-col shrink-0 justify-between"
            >
              <div>
                <h4 className="text-slate-900 font-bold text-lg mb-4 border-b border-slate-100 pb-2">
                  {row.name}
                </h4>
                <div className="flex flex-col gap-3 mb-4">
                  {/* Premium column stack */}
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">{VOLUME_LETTERS_DICT.comparison.premiumLabel}</span>
                    <span className="text-orange-700 font-bold bg-orange-50 px-2.5 py-1.5 rounded-lg border border-orange-100 text-xs self-start whitespace-normal break-words leading-relaxed">
                      {row.premium}
                    </span>
                  </div>
                  {/* Budget column stack */}
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">{VOLUME_LETTERS_DICT.comparison.budgetLabel}</span>
                    <span className="text-slate-700 font-bold bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs self-start whitespace-normal break-words leading-relaxed">
                      {row.budget}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-slate-500 text-xs leading-relaxed border-t border-slate-100 pt-3 flex gap-2 items-start mt-2">
                <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="flex-1 min-w-0 whitespace-normal break-words leading-relaxed">{row.importance}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
