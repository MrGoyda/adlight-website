"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectStatus } from "@prisma/client";
import { 
  FolderKanban, 
  Search, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  FileCheck, 
  Paperclip, 
  FolderOpen, 
  ArrowLeft, 
  Plus, 
  FileText, 
  Clock,
  ArrowRight
} from "lucide-react";
import Button from "@/components/ui/Button";
import { triggerHaptic } from "@/lib/haptics";

interface ProjectItem {
  id: string;
  createdAt: string;
  title: string;
  status: ProjectStatus;
  budget: number;
  notes: string | null;
  company: {
    id: string;
    name: string;
  };
  leads: {
    id: string;
    files: any[];
    estimate: any | null;
  }[];
  files: any[];
}

interface ProjectsDashboardProps {
  initialProjects: ProjectItem[];
  companies: { id: string; name: string }[];
}

const PROJECT_STATUS_MAP: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  PLANNING: { label: "Планируется", color: "text-slate-600 border-slate-200", bg: "bg-slate-50" },
  IN_PROGRESS: { label: "В работе 🟡", color: "text-amber-700 border-amber-200", bg: "bg-amber-50" },
  COMPLETED: { label: "Завершен 🟢", color: "text-emerald-700 border-emerald-200", bg: "bg-emerald-50" },
  ON_HOLD: { label: "На паузе 🔴", color: "text-rose-700 border-rose-200", bg: "bg-rose-50" },
};

export default function ProjectsDashboard({ initialProjects, companies }: ProjectsDashboardProps) {
  const router = useRouter();
  const [projects] = useState<ProjectItem[]>(initialProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredProjects = projects.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(term) || p.company.name.toLowerCase().includes(term);
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 select-none">

      {/* ── ПОИСК И ФИЛЬТРЫ ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск проекта по названию или объекту компании..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 text-sm focus:border-purple-500 focus:outline-none transition"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-slate-800 font-extrabold text-xs focus:outline-none focus:border-purple-500 cursor-pointer"
        >
          <option value="ALL">Все статусы проектов</option>
          {Object.entries(PROJECT_STATUS_MAP).map(([key, val]) => (
            <option key={key} value={key}>
              {val.label}
            </option>
          ))}
        </select>
      </div>

      {/* ── СЕТКА КАРТОЧЕК ПРОЕКТОВ ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400 font-semibold">
            Проекты не найдены
          </div>
        ) : (
          filteredProjects.map((project) => {
            const status = PROJECT_STATUS_MAP[project.status];
            
            // Агрегируем файлы со всех связанных лидов + файлы самого проекта
            const leadFilesCount = project.leads.reduce((acc, l) => acc + (l.files?.length || 0), 0);
            const totalFilesCount = (project.files?.length || 0) + leadFilesCount;

            // Агрегируем все сметы лидов этого проекта
            const estimatesCount = project.leads.filter(l => l.estimate).length;

            return (
              <div
                key={project.id}
                onClick={() => { triggerHaptic("light"); router.push(`/admin/projects/${project.id}`); }}
                className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-purple-300 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> {project.company.name}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-base group-hover:text-purple-600 transition mt-0.5">
                        {project.title}
                      </h3>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${status.color} ${status.bg} shrink-0`}>
                      {status.label}
                    </span>
                  </div>

                  {/* Бюджет объекта */}
                  {project.budget > 0 && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 text-purple-700 font-black text-xs border border-purple-100">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Бюджет: {project.budget.toLocaleString("ru")} ₸
                    </div>
                  )}
                </div>

                {/* Нижний блок: Связанные файлы, сметы, этапы */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {totalFilesCount > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 font-bold text-slate-700 text-[11px]" title={`Файлов и чертежей объекта: ${totalFilesCount}`}>
                        <Paperclip className="w-3 h-3 text-slate-400" />
                        {totalFilesCount} файлов
                      </span>
                    )}

                    {estimatesCount > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold text-[11px]" title={`Смет к объекту: ${estimatesCount}`}>
                        <FileCheck className="w-3 h-3 text-purple-600" />
                        {estimatesCount} смет
                      </span>
                    )}

                    <span className="text-slate-400 font-medium text-[11px]">
                      {project.leads.length} этапов
                    </span>
                  </div>

                  <span className="font-bold text-purple-600 group-hover:translate-x-1 transition flex items-center gap-0.5">
                    Открыть <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
