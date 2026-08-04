"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectStatus } from "@prisma/client";
import { 
  FolderKanban, 
  Building2, 
  ArrowLeft, 
  FileCheck, 
  Paperclip, 
  FolderOpen, 
  Phone, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  FileText, 
  ExternalLink,
  MessageSquare,
  Image as ImageIcon,
  FileSpreadsheet,
  CheckCircle2
} from "lucide-react";
import Button from "@/components/ui/Button";
import { triggerHaptic } from "@/lib/haptics";
import MediaViewerModal from "@/app/admin/leads/[id]/_components/MediaViewerModal";
import CrmBreadcrumbs from "@/components/ui/CrmBreadcrumbs";

interface ProjectDetailProps {
  project: {
    id: string;
    createdAt: string;
    title: string;
    status: ProjectStatus;
    budget: number;
    notes: string | null;
    company: {
      id: string;
      name: string;
      contacts: {
        id: string;
        name: string;
        phone: string;
        position: string | null;
        isDecisionMaker: boolean;
      }[];
    };
    leads: {
      id: string;
      createdAt: string;
      name: string;
      phone: string;
      status: string;
      revenue: number;
      expenses: number;
      comment: string | null;
      address: string | null;
      files: {
        id: string;
        name: string;
        url: string;
        size: number;
        mimeType: string;
        category: string;
      }[];
      estimate?: {
        id: string;
        items: {
          id: string;
          name: string;
          quantity: number;
          costPrice: number;
          sellPrice: number;
        }[];
      } | null;
    }[];
    files: {
      id: string;
      name: string;
      url: string;
      size: number;
      mimeType: string;
      category: string;
    }[];
  };
}

const PROJECT_STATUS_MAP: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  PLANNING: { label: "Планируется", color: "text-slate-600 border-slate-200", bg: "bg-slate-50" },
  IN_PROGRESS: { label: "В работе 🟡", color: "text-amber-700 border-amber-200", bg: "bg-amber-50" },
  COMPLETED: { label: "Завершен 🟢", color: "text-emerald-700 border-emerald-200", bg: "bg-emerald-50" },
  ON_HOLD: { label: "На паузе 🔴", color: "text-rose-700 border-rose-200", bg: "bg-rose-50" },
};

export default function ProjectDetailPage({ project }: ProjectDetailProps) {
  const router = useRouter();
  const status = PROJECT_STATUS_MAP[project.status];

  // Просмотрщик медиа
  const [viewerFileId, setViewerFileId] = useState<string | null>(null);

  // Агрегируем все файлы всех этапов (лидов) проекта + файлы самого проекта
  const allProjectFiles = [
    ...project.files.map(f => ({ ...f, origin: "Файл проекта" })),
    ...project.leads.flatMap(l => l.files.map(f => ({ ...f, origin: `Этап: ${l.name}` })))
  ];

  // Вычисляем суммарные финансовые показатели объекта
  const totalRevenue = project.leads.reduce((acc, l) => acc + l.revenue, 0);
  const totalExpenses = project.leads.reduce((acc, l) => acc + l.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;

  return (
    <div className="space-y-6 select-none">
      
      {/* ХЛЕБНЫЕ КРОШКИ НАВИГАЦИИ */}
      <CrmBreadcrumbs
        items={[
          { label: "Проекты", href: "/admin/projects" },
          { label: `Компания ${project.company.name}`, href: `/admin/companies` },
          { label: project.title }
        ]}
      />

      {/* ── ШАПКА ДЕТАЛЬНОЙ СТРАНИЦЫ ПРОЕКТА ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button 
              onClick={() => router.push(`/admin/companies`)}
              className="text-xs font-extrabold text-orange-600 bg-orange-50 hover:bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200/60 transition cursor-pointer flex items-center gap-1"
            >
              🏢 {project.company.name} <ExternalLink className="w-3 h-3" />
            </button>
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${status.color} ${status.bg}`}>
              {status.label}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-purple-600" /> {project.title}
          </h1>
        </div>

        {/* Фин. сводка проекта */}
        <div className="flex items-center gap-3 text-right">
          <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl">
            <span className="text-[10px] font-bold text-emerald-600 uppercase block">Выручка</span>
            <span className="text-base font-black text-emerald-700">{totalRevenue.toLocaleString("ru")} ₸</span>
          </div>
          {totalProfit !== 0 && (
            <div className="bg-purple-50 border border-purple-100 p-3 rounded-2xl">
              <span className="text-[10px] font-bold text-purple-600 uppercase block">Чистая прибыль</span>
              <span className="text-base font-black text-purple-700">{totalProfit.toLocaleString("ru")} ₸</span>
            </div>
          )}
        </div>
      </div>

      {/* ── ДВЕ КОЛОНКИ: ЭТАПЫ/СМЕТЫ И ОБЛАКО ФАЙЛОВ ОБЪЕКТА ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ЛЕВАЯ КОЛОНКА (2/3): ЭТАПЫ (ЛИДЫ) И СМЕТЫ ПРОЕКТА */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider flex items-center justify-between border-b border-slate-100 pb-3">
              <span>📋 Этапы и Сделки объекта ({project.leads.length})</span>
            </h3>

            {project.leads.length === 0 ? (
              <div className="text-xs text-slate-400 italic text-center py-6">
                К проекту еще не привязаны заявки
              </div>
            ) : (
              <div className="space-y-4">
                {project.leads.map((lead) => (
                  <div key={lead.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">{lead.name}</h4>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" /> {lead.phone}
                          {lead.address && <span>• 📍 {lead.address}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          onClick={() => router.push(`/admin/leads/${lead.id}`)}
                          variant="solid"
                          leftIcon={<ExternalLink className="w-3 h-3 text-orange-400" />}
                          className="text-[11px] font-extrabold py-1.5 px-3 bg-slate-900 text-white hover:bg-slate-800 shrink-0 whitespace-nowrap"
                        >
                          Карточка этапа
                        </Button>
                      </div>
                    </div>

                    {/* Смета этапа (если есть) */}
                    {lead.estimate && lead.estimate.items.length > 0 && (
                      <div className="bg-white p-3 rounded-xl border border-purple-100 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-purple-700">
                          <span className="flex items-center gap-1">
                            <FileCheck className="w-3.5 h-3.5 text-purple-600" /> Смета этапа ({lead.estimate.items.length} поз.)
                          </span>
                          <span>
                            {lead.estimate.items.reduce((a, b) => a + (b.sellPrice * b.quantity), 0).toLocaleString("ru")} ₸
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 space-y-1">
                          {lead.estimate.items.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex justify-between border-b border-slate-50 pb-0.5">
                              <span>• {item.name} ({item.quantity} шт.)</span>
                              <span className="font-semibold">{(item.sellPrice * item.quantity).toLocaleString("ru")} ₸</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* ПРАВАЯ КОЛОНКА (1/3): ОБЛАКО ФАЙЛОВ ОБЪЕКТА & ЛПР КОНТАКТЫ */}
        <div className="space-y-6">
          
          {/* ОБЛАКО ФАЙЛОВ ОБЪЕКТА (Агрегировано) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Paperclip className="w-4 h-4 text-orange-500" /> Файлы и Чертежи объекта ({allProjectFiles.length})
            </h3>

            {allProjectFiles.length === 0 ? (
              <div className="text-xs text-slate-400 italic text-center py-6">
                Файлы ещё не загружены
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {allProjectFiles.map((file) => {
                  const isImage = file.mimeType.startsWith("image/");
                  return (
                    <div 
                      key={file.id} 
                      onClick={() => setViewerFileId(file.id)}
                      className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 hover:border-orange-300 transition flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {isImage ? (
                          <ImageIcon className="w-4 h-4 text-blue-500 shrink-0" />
                        ) : (
                          <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <span className="font-bold text-xs text-slate-800 truncate block">{file.name}</span>
                          <span className="text-[10px] text-slate-400 font-semibold block">{file.origin}</span>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* КОНТАКТЫ ЛПР КОМПАНИИ */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              ⭐️ ЛПР компании {project.company.name}
            </h3>

            <div className="space-y-2">
              {project.company.contacts.map((cnt) => (
                <div key={cnt.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-xs">
                  <div className="font-extrabold text-slate-900">{cnt.name}</div>
                  {cnt.position && <div className="text-[11px] text-slate-500">{cnt.position}</div>}
                  <a href={`tel:${cnt.phone}`} className="text-orange-600 font-bold hover:underline block pt-1">
                    📞 {cnt.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* МОДАЛКА ПРОСМОТРА МЕДИАФАЙЛОВ */}
      {viewerFileId && (
        <MediaViewerModal
          isOpen={!!viewerFileId}
          onClose={() => setViewerFileId(null)}
          files={allProjectFiles as any}
          initialFileId={viewerFileId}
        />
      )}

    </div>
  );
}
