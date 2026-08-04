"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClientRating, ProjectStatus } from "@prisma/client";
import { 
  Building2, 
  Plus, 
  Search, 
  Phone, 
  UserCheck, 
  FolderKanban, 
  TrendingUp, 
  DollarSign, 
  Briefcase, 
  Users, 
  Star, 
  ExternalLink, 
  Trash2, 
  ArrowLeft,
  X,
  FileText,
  MapPin,
  CheckCircle2
} from "lucide-react";
import Button from "@/components/ui/Button";
import { triggerHaptic } from "@/lib/haptics";
import { createCompany, createContact, createProject, deleteCompany, deleteContact, linkLeadToB2B } from "../actions";

interface Contact {
  id: string;
  name: string;
  position: string | null;
  phone: string;
  email: string | null;
  whatsapp: string | null;
  isDecisionMaker: boolean;
  notes: string | null;
}

interface Project {
  id: string;
  title: string;
  status: ProjectStatus;
  budget: number;
  notes: string | null;
}

interface LeadSummary {
  id: string;
  revenue: number;
  expenses: number;
  status: string;
}

interface Company {
  id: string;
  createdAt: string;
  name: string;
  binIin: string | null;
  industry: string | null;
  legalAddress: string | null;
  bankAccount: string | null;
  rating: ClientRating;
  notes: string | null;
  contacts: Contact[];
  projects: Project[];
  leads: LeadSummary[];
}

interface SimpleLead {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  companyId: string | null;
}

interface CompaniesDashboardProps {
  initialCompanies: Company[];
  allLeads?: SimpleLead[];
}

const RATING_MAP: Record<ClientRating, { label: string; color: string; bg: string }> = {
  EASY: { label: "Адекватный 🟢", color: "text-emerald-700 border-emerald-200", bg: "bg-emerald-50" },
  STANDARD: { label: "Стандартный 🟡", color: "text-amber-700 border-amber-200", bg: "bg-amber-50" },
  PROBLEM: { label: "Сложный 🔴", color: "text-rose-700 border-rose-200", bg: "bg-rose-50" },
};

const PROJECT_STATUS_MAP: Record<ProjectStatus, { label: string; color: string }> = {
  PLANNING: { label: "Планируется", color: "bg-slate-100 text-slate-700" },
  IN_PROGRESS: { label: "В работе", color: "bg-amber-50 text-amber-700 border border-amber-200/60" },
  COMPLETED: { label: "Завершен", color: "bg-emerald-50 text-emerald-700 border border-emerald-200/60" },
  ON_HOLD: { label: "На паузе", color: "bg-rose-50 text-rose-700 border border-rose-200/60" },
};

export default function CompaniesDashboard({ initialCompanies, allLeads = [] }: CompaniesDashboardProps) {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);

  // Модалка создания компании
  const [showCreateCompanyModal, setShowCreateCompanyModal] = useState(false);
  const [newCompName, setNewCompName] = useState("");
  const [newCompBin, setNewCompBin] = useState("");
  const [newCompIndustry, setNewCompIndustry] = useState("");
  const [newCompAddress, setNewCompAddress] = useState("");
  const [newCompRating, setNewCompRating] = useState<ClientRating>(ClientRating.STANDARD);
  const [newCompNotes, setNewCompNotes] = useState("");
  const [isCreatingCompany, setIsCreatingCompany] = useState(false);

  // Модалка создания контакта (ЛПР)
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [contactMode, setContactMode] = useState<"MANUAL" | "FROM_LEAD">("FROM_LEAD");
  const [selectedLeadIdForContact, setSelectedLeadIdForContact] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPosition, setContactPosition] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactWhatsapp, setContactWhatsapp] = useState("");
  const [contactIsLPR, setContactIsLPR] = useState(false);
  const [isAddingContact, setIsAddingContact] = useState(false);

  // Модалка создания проекта
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [projectMode, setProjectMode] = useState<"MANUAL" | "FROM_LEAD">("MANUAL");
  const [selectedLeadIdForProject, setSelectedLeadIdForProject] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectBudget, setProjectBudget] = useState("");
  const [isAddingProject, setIsAddingProject] = useState(false);

  // Фильтрация компаний
  const filteredCompanies = companies.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      (c.binIin && c.binIin.includes(term)) ||
      (c.industry && c.industry.toLowerCase().includes(term)) ||
      c.contacts.some(cnt => cnt.name.toLowerCase().includes(term) || cnt.phone.includes(term))
    );
  });

  // Обработка создания компании
  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName.trim()) return;

    setIsCreatingCompany(true);
    triggerHaptic("success");

    const res = await createCompany({
      name: newCompName,
      binIin: newCompBin,
      industry: newCompIndustry,
      legalAddress: newCompAddress,
      rating: newCompRating,
      notes: newCompNotes,
    });

    if (res.success) {
      setShowCreateCompanyModal(false);
      setNewCompName("");
      setNewCompBin("");
      setNewCompIndustry("");
      setNewCompAddress("");
      setNewCompNotes("");
      router.refresh();
    } else {
      alert(res.error);
    }
    setIsCreatingCompany(false);
  };

  // Обработка добавления контакта
  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCompany || !contactName.trim() || !contactPhone.trim()) return;

    setIsAddingContact(true);
    triggerHaptic("success");

    const res = await createContact({
      companyId: activeCompany.id,
      name: contactName,
      position: contactPosition,
      phone: contactPhone,
      whatsapp: contactWhatsapp || `https://wa.me/${contactPhone.replace(/\D/g, "")}`,
      isDecisionMaker: contactIsLPR,
    });

    if (res.success) {
      setShowAddContactModal(false);
      setContactName("");
      setContactPosition("");
      setContactPhone("");
      setContactWhatsapp("");
      setContactIsLPR(false);
      router.refresh();
    } else {
      alert(res.error);
    }
    setIsAddingContact(false);
  };

  // Обработка добавления проекта
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCompany || !projectTitle.trim()) return;

    setIsAddingProject(true);
    triggerHaptic("success");

    const res = await createProject({
      companyId: activeCompany.id,
      title: projectTitle,
      budget: parseFloat(projectBudget) || 0,
    });

    if (res.success) {
      if (selectedLeadIdForProject && res.projectId) {
        await linkLeadToB2B(selectedLeadIdForProject, {
          companyId: activeCompany.id,
          projectId: res.projectId,
        });
      }
      setShowAddProjectModal(false);
      setProjectTitle("");
      setProjectBudget("");
      setSelectedLeadIdForProject("");
      router.refresh();
    } else {
      alert(res.error);
    }
    setIsAddingProject(false);
  };

  return (
    <div className="space-y-8 select-none">
      
      {/* ── НАВИГАЦИОННАЯ ШАПКА B2B CRM ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <button 
            onClick={() => router.push("/admin/leads")}
            className="text-xs font-bold text-slate-450 hover:text-slate-700 flex items-center gap-1 mb-1 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> К списку лидов
          </button>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-orange-500" /> B2B Компании & Объекты
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => { triggerHaptic("light"); setShowCreateCompanyModal(true); }}
            variant="solid"
            leftIcon={<Plus className="w-4 h-4" />}
            className="text-xs font-black py-2.5 shadow-sm shadow-orange-500/10"
          >
            Добавить компанию
          </Button>
        </div>
      </div>

      {/* ── ОСНОВНОЙ КОНТЕНТ ── */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* ЛЕВАЯ ЧАСТЬ: СПИСОК КОМПАНИЙИ ПОИСК */}
        <div className="w-full lg:flex-1 space-y-4">
          
          {/* Поиск компаний */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Поиск компании по названию, БИН или имени ЛПР..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-orange-500/50 focus:outline-none text-sm transition"
              />
            </div>
          </div>

          {/* Карточки компаний */}
          <div className="space-y-3">
            {filteredCompanies.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400 font-semibold">
                Компании не найдены. Создайте первую B2B компанию!
              </div>
            ) : (
              filteredCompanies.map((company) => {
                const totalLTV = company.leads.reduce((acc, l) => acc + l.revenue, 0);
                const isSelected = activeCompany?.id === company.id;
                const rating = RATING_MAP[company.rating];
                const decisionMakers = company.contacts.filter(c => c.isDecisionMaker);

                return (
                  <div
                    key={company.id}
                    onClick={() => { triggerHaptic("light"); setActiveCompany(company); }}
                    className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isSelected 
                        ? "bg-orange-50/40 border-orange-300 shadow-md shadow-orange-500/5" 
                        : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-slate-900 text-base truncate">{company.name}</h3>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${rating.color} ${rating.bg}`}>
                            {rating.label}
                          </span>
                        </div>

                        {/* Мета-данные компании */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          {company.industry && (
                            <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                              <Briefcase className="w-3 h-3 text-slate-400" /> {company.industry}
                            </span>
                          )}
                          {company.binIin && (
                            <span className="font-mono text-slate-400">БИН: {company.binIin}</span>
                          )}
                        </div>

                        {/* ЛПР и контакты */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="text-[11px] text-slate-450 font-bold flex items-center gap-1">
                            <Users className="w-3 h-3 text-slate-400" /> Контакты ({company.contacts.length}):
                          </span>
                          {company.contacts.length === 0 ? (
                            <span className="text-[11px] text-slate-400 italic">Нет контактов</span>
                          ) : (
                            company.contacts.slice(0, 3).map((cnt) => (
                              <span 
                                key={cnt.id} 
                                className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                                  cnt.isDecisionMaker 
                                    ? "bg-orange-100 text-orange-800 border border-orange-200" 
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {cnt.isDecisionMaker && "⭐️ "}
                                {cnt.name} {cnt.position ? `(${cnt.position})` : ""}
                              </span>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Правый столб: LTV & Проекты */}
                      <div className="text-right shrink-0 space-y-1.5 flex flex-col items-end">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">LTV (Выручка)</span>
                        <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100 inline-flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" />
                          {totalLTV.toLocaleString("ru")} ₸
                        </span>
                        
                        <div className="text-[11px] text-slate-500 font-bold pt-1">
                          Проектов: <span className="text-slate-900">{company.projects.length}</span> | Сделок: <span className="text-slate-900">{company.leads.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── ПРАВАЯ ЧАСТЬ: ДЕТАЛИ ВЫБРАННОЙ КОМПАНИИ ── */}
        {activeCompany && (
          <aside className="w-full lg:w-[460px] bg-white rounded-3xl border border-slate-200 p-6 shadow-xl sticky top-8 space-y-6 overflow-y-auto max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">B2B Клиент</span>
                <h2 className="text-lg font-black text-slate-900">{activeCompany.name}</h2>
              </div>
              <button
                onClick={() => setActiveCompany(null)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Секция 1: Реквизиты компании */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-2 text-xs">
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">БИН / ИИН:</span>
                <span className="font-bold text-slate-800">{activeCompany.binIin || "Не указан"}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Сфера:</span>
                <span className="font-bold text-slate-800">{activeCompany.industry || "Не указана"}</span>
              </div>
              {activeCompany.legalAddress && (
                <div className="pt-1 border-t border-slate-200/50 text-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Адрес:</span>
                  {activeCompany.legalAddress}
                </div>
              )}
            </div>

            {/* Секция 2: Сотрудники & ЛПР */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-orange-500" /> Contacts / ЛПР ({activeCompany.contacts.length})
                </h3>
                <button
                  onClick={() => { triggerHaptic("light"); setShowAddContactModal(true); }}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Добавить
                </button>
              </div>

              {activeCompany.contacts.length === 0 ? (
                <div className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl text-center">
                  Контакты еще не добавлены
                </div>
              ) : (
                <div className="space-y-2">
                  {activeCompany.contacts.map((cnt) => (
                    <div key={cnt.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-slate-900">{cnt.name}</span>
                          {cnt.isDecisionMaker && (
                            <span className="text-[9px] font-black bg-orange-500 text-white px-1.5 py-0.5 rounded uppercase">
                              ЛПР
                            </span>
                          )}
                        </div>
                        {cnt.position && (
                          <div className="text-[11px] font-medium text-slate-500">{cnt.position}</div>
                        )}
                        <a href={`tel:${cnt.phone}`} className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1 pt-0.5">
                          <Phone className="w-3 h-3" /> {cnt.phone}
                        </a>
                      </div>
                      <button
                        onClick={async () => {
                          if (confirm(`Удалить контакт ${cnt.name}?`)) {
                            await deleteContact(cnt.id, activeCompany.id);
                            router.refresh();
                          }
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Секция 3: Проекты & Объекты */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                  <FolderKanban className="w-4 h-4 text-purple-600" /> Проекты ({activeCompany.projects.length})
                </h3>
                <button
                  onClick={() => { triggerHaptic("light"); setShowAddProjectModal(true); }}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Проект
                </button>
              </div>

              {activeCompany.projects.length === 0 ? (
                <div className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl text-center">
                  У компании пока нет крупных проектов
                </div>
              ) : (
                <div className="space-y-2">
                  {activeCompany.projects.map((proj) => {
                    const status = PROJECT_STATUS_MAP[proj.status];
                    return (
                      <div 
                        key={proj.id} 
                        onClick={() => router.push(`/admin/projects/${proj.id}`)}
                        className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 hover:border-purple-300 space-y-1 cursor-pointer transition group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-slate-900 group-hover:text-purple-600 transition flex items-center gap-1">
                            {proj.title} <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-purple-500" />
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        {proj.budget > 0 && (
                          <div className="text-[11px] font-bold text-emerald-600">
                            Бюджет: {proj.budget.toLocaleString("ru")} ₸
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Секция 4: Сделки и Заявки компании */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-orange-500" /> Сделки компании ({activeCompany.leads.length})
              </h3>

              {activeCompany.leads.length === 0 ? (
                <div className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl text-center">
                  У компании пока нет активных сделок
                </div>
              ) : (
                <div className="space-y-2">
                  {activeCompany.leads.map((l) => (
                    <div 
                      key={l.id}
                      onClick={() => router.push(`/admin/leads/${l.id}`)}
                      className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 hover:border-orange-300 transition flex items-center justify-between cursor-pointer group"
                    >
                      <div>
                        <span className="font-extrabold text-xs text-slate-900 group-hover:text-orange-600 transition flex items-center gap-1">
                          Заявка #{l.id.slice(0, 8)} <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-orange-500" />
                        </span>
                        {l.revenue > 0 && (
                          <span className="text-[11px] font-bold text-emerald-600 block">
                            +{l.revenue.toLocaleString("ru")} ₸
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        {l.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* ── МОДАЛКА СОЗДАНИЯ КОМПАНИИ ── */}
      {showCreateCompanyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">Новая B2B Компания</h3>
              <button onClick={() => setShowCreateCompanyModal(false)} className="text-slate-400 hover:bg-slate-100 p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCompany} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Название компании *</label>
                <input
                  type="text"
                  required
                  placeholder="ООО Вектор / ТРЦ Ардагер"
                  value={newCompName}
                  onChange={(e) => setNewCompName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">БИН / ИИН</label>
                  <input
                    type="text"
                    placeholder="123456789012"
                    value={newCompBin}
                    onChange={(e) => setNewCompBin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Сфера деятельности</label>
                  <input
                    type="text"
                    placeholder="Рестораны / Ритейл"
                    value={newCompIndustry}
                    onChange={(e) => setNewCompIndustry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Категория / Сложность</label>
                <select
                  value={newCompRating}
                  onChange={(e) => setNewCompRating(e.target.value as ClientRating)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-orange-500"
                >
                  <option value="EASY">🟢 Адекватный / Легкий</option>
                  <option value="STANDARD">🟡 Стандартный</option>
                  <option value="PROBLEM">🔴 Сложный / Требовательный</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Юридический адрес</label>
                <input
                  type="text"
                  placeholder="г. Астана, ул. Достык 5"
                  value={newCompAddress}
                  onChange={(e) => setNewCompAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <Button type="button" variant="lightOutline" onClick={() => setShowCreateCompanyModal(false)} className="text-xs font-bold">
                  Отмена
                </Button>
                <Button type="submit" variant="solid" disabled={isCreatingCompany} className="text-xs font-black">
                  {isCreatingCompany ? "Создание..." : "Создать компанию"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── МОДАЛКА ДОБАВЛЕНИЯ КОНТАКТА ── */}
      {showAddContactModal && activeCompany && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Новый контакт: {activeCompany.name}</h3>
              <button onClick={() => setShowAddContactModal(false)} className="text-slate-400 hover:bg-slate-100 p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Табы способа добавления */}
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setContactMode("FROM_LEAD")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  contactMode === "FROM_LEAD" ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Из существующего лида
              </button>
              <button
                type="button"
                onClick={() => setContactMode("MANUAL")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  contactMode === "MANUAL" ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Ввести вручную
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-3">
              {contactMode === "FROM_LEAD" ? (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Выберите лид / клиента</label>
                  <select
                    value={selectedLeadIdForContact}
                    onChange={(e) => {
                      const leadId = e.target.value;
                      setSelectedLeadIdForContact(leadId);
                      const found = allLeads.find(l => l.id === leadId);
                      if (found) {
                        setContactName(found.name);
                        setContactPhone(found.phone);
                        setContactWhatsapp(`https://wa.me/${found.phone.replace(/\D/g, "")}`);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="">-- Выберите лид из списка --</option>
                    {allLeads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.phone})
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">ФИО контакта *</label>
                <input
                  type="text"
                  required
                  placeholder="Иван Иванов"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Должность</label>
                <input
                  type="text"
                  placeholder="Маркетолог / Директор"
                  value={contactPosition}
                  onChange={(e) => setContactPosition(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Телефон * (проверка дубликатов +7 / 8 / 7)</label>
                <input
                  type="text"
                  required
                  placeholder="+7 (700) 000-00-00"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={contactIsLPR}
                  onChange={(e) => setContactIsLPR(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
                />
                <span className="text-xs font-bold text-slate-800">
                  ⭐️ Является ЛПР (Лицо Принимающее Решения)
                </span>
              </label>

              <div className="pt-3 flex justify-end gap-2">
                <Button type="button" variant="lightOutline" onClick={() => setShowAddContactModal(false)} className="text-xs font-bold">
                  Отмена
                </Button>
                <Button type="submit" variant="solid" disabled={isAddingContact} className="text-xs font-black">
                  {isAddingContact ? "Добавление..." : "Сохранить контакт"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── МОДАЛКА ДОБАВЛЕНИЯ ПРОЕКТА ── */}
      {showAddProjectModal && activeCompany && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Новый Проект / Объект</h3>
              <button onClick={() => setShowAddProjectModal(false)} className="text-slate-400 hover:bg-slate-100 p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Табы режима проекта */}
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setProjectMode("FROM_LEAD")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  projectMode === "FROM_LEAD" ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Из существующего лида
              </button>
              <button
                type="button"
                onClick={() => setProjectMode("MANUAL")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  projectMode === "MANUAL" ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Ввести вручную
              </button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-3">
              {projectMode === "FROM_LEAD" ? (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Выберите существующий лид</label>
                  <select
                    value={selectedLeadIdForProject}
                    onChange={(e) => {
                      const leadId = e.target.value;
                      setSelectedLeadIdForProject(leadId);
                      const found = allLeads.find(l => l.id === leadId);
                      if (found) {
                        setProjectTitle(`Объект: ${found.name} ${found.address ? `(${found.address})` : ""}`);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="">-- Выберите лид из списка --</option>
                    {allLeads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} {l.address ? `- ${l.address}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Название проекта / объекта *</label>
                <input
                  type="text"
                  required
                  placeholder="Оформление сети ресторанов 'Шеф'"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Целевой / Плановый бюджет (₸)</label>
                <input
                  type="number"
                  placeholder="1500000"
                  value={projectBudget}
                  onChange={(e) => setProjectBudget(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <Button type="button" variant="lightOutline" onClick={() => setShowAddProjectModal(false)} className="text-xs font-bold">
                  Отмена
                </Button>
                <Button type="submit" variant="solid" disabled={isAddingProject} className="text-xs font-black">
                  {isAddingProject ? "Создание..." : "Создать проект"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
