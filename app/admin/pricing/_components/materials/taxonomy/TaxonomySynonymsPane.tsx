"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, Plus, AlertCircle, Search, Trash2 } from "lucide-react";
import { SynonymRule } from "../../../_data/synonymsDictionary";
import { ZeroResultQuery } from "../../../_hooks/useCustomSynonyms";
import { triggerHaptic } from "@/lib/haptics";
import { pricingDict } from "@/dictionaries/pricing";

interface TaxonomySynonymsPaneProps {
  synonymRules: SynonymRule[];
  zeroQueries: ZeroResultQuery[];
  onAddCustomSynonym?: (target: string, aliases: string[], description?: string) => boolean;
  onDeleteCustomSynonym?: (ruleId: string) => boolean;
  onClearZeroQueries?: () => void;
}

export default function TaxonomySynonymsPane({
  synonymRules,
  zeroQueries,
  onAddCustomSynonym,
  onDeleteCustomSynonym,
  onClearZeroQueries,
}: TaxonomySynonymsPaneProps) {
  const [newSynTarget, setNewSynTarget] = useState("");
  const [newSynAliases, setNewSynAliases] = useState("");
  const [synSearchFilter, setSynSearchFilter] = useState("");

  const handleAddSynonymSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSynTarget.trim() || !newSynAliases.trim() || !onAddCustomSynonym) return;

    const aliases = newSynAliases
      .split(/[,;\n]/)
      .map((a) => a.trim())
      .filter(Boolean);

    const ok = onAddCustomSynonym(newSynTarget.trim(), aliases);
    if (ok) {
      setNewSynTarget("");
      setNewSynAliases("");
    }
  };

  const filteredSynonymRules = useMemo(() => {
    if (!synSearchFilter.trim()) return synonymRules;
    const q = synSearchFilter.toLowerCase().trim();
    return synonymRules.filter(
      (r) =>
        r.target.toLowerCase().includes(q) ||
        r.aliases.some((a) => a.toLowerCase().includes(q))
    );
  }, [synonymRules, synSearchFilter]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
      {/* Блок быстрого обучения (добавления синонима) */}
      <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/90 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black text-slate-900">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>{pricingDict.modals.taxonomy.synonyms.formTitle}</span>
          </div>
          <span className="text-[10px] text-orange-700 font-extrabold bg-orange-100 px-2 py-0.5 rounded-full">
            {pricingDict.modals.taxonomy.synonyms.formBadge}
          </span>
        </div>

        <form onSubmit={handleAddSynonymSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">
                {pricingDict.modals.taxonomy.synonyms.aliasesLabel}
              </label>
              <input
                type="text"
                required
                value={newSynAliases}
                onChange={(e) => setNewSynAliases(e.target.value)}
                placeholder={pricingDict.modals.taxonomy.synonyms.aliasesPlaceholder}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:border-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">
                {pricingDict.modals.taxonomy.synonyms.targetLabel}
              </label>
              <input
                type="text"
                required
                value={newSynTarget}
                onChange={(e) => setNewSynTarget(e.target.value)}
                placeholder={pricingDict.modals.taxonomy.synonyms.targetPlaceholder}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={!newSynAliases.trim() || !newSynTarget.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-extrabold text-xs transition active:scale-95 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{pricingDict.modals.taxonomy.synonyms.submitButton}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Блок: Что искали менеджеры и не нашли (Zero-Result) */}
      {zeroQueries.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <h5 className="text-xs font-black text-amber-950">
                {pricingDict.modals.taxonomy.synonyms.zeroQueriesTitle(zeroQueries.length)}
              </h5>
            </div>

            {onClearZeroQueries && (
              <button
                type="button"
                onClick={onClearZeroQueries}
                className="text-[10px] font-bold text-amber-700 hover:underline cursor-pointer"
              >
                {pricingDict.modals.taxonomy.synonyms.zeroQueriesClear}
              </button>
            )}
          </div>

          <p className="text-[11px] text-amber-850 leading-relaxed font-medium">
            {pricingDict.modals.taxonomy.synonyms.zeroQueriesHelp}
          </p>

          <div className="flex flex-wrap gap-2">
            {zeroQueries.map((zq) => (
              <div
                key={zq.query}
                className="inline-flex items-center gap-2 pl-3 pr-1.5 py-1 rounded-xl bg-white border border-amber-200 shadow-2xs text-xs font-bold text-slate-800"
              >
                <span>«{zq.query}»</span>
                {zq.count > 1 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black">
                    {zq.count}x
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setNewSynAliases(zq.query);
                    setNewSynTarget("");
                    triggerHaptic("light");
                  }}
                  className="px-2 py-0.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-black cursor-pointer transition active:scale-95"
                >
                  {pricingDict.modals.taxonomy.synonyms.zeroQueryTrain}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Список всех активных правил поиска */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            {pricingDict.modals.taxonomy.synonyms.rulesTitle(filteredSynonymRules.length)}
          </h5>

          <div className="relative">
            <input
              type="text"
              value={synSearchFilter}
              onChange={(e) => setSynSearchFilter(e.target.value)}
              placeholder={pricingDict.modals.taxonomy.synonyms.rulesSearchPlaceholder}
              className="pl-7 pr-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredSynonymRules.map((rule) => (
            <div
              key={rule.id}
              className="p-3 rounded-2xl border border-slate-200/90 bg-white hover:border-slate-300 transition space-y-1.5 shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-900 capitalize">
                    {rule.target}
                  </span>
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.2 rounded-md ${
                      rule.isBuiltIn
                        ? "bg-slate-100 text-slate-500"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {rule.isBuiltIn
                      ? pricingDict.modals.taxonomy.synonyms.systemRuleBadge
                      : pricingDict.modals.taxonomy.synonyms.customRuleBadge}
                  </span>
                </div>

                {!rule.isBuiltIn && onDeleteCustomSynonym && (
                  <button
                    type="button"
                    onClick={() => onDeleteCustomSynonym(rule.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title={pricingDict.modals.taxonomy.synonyms.deleteRuleTooltip}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1 pt-0.5">
                {rule.aliases.map((alias) => (
                  <span
                    key={alias}
                    className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold"
                  >
                    {alias}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
