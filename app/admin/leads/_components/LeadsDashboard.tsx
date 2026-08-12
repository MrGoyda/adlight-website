"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { LeadStatus, PartnerName } from "@prisma/client";
import { 
  Search, 
  Filter, 
  Calendar, 
  Phone, 
  User, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  LogOut,
  FolderOpen,
  ChevronRight,
  TrendingDown,
  Trash2,
  Plus,
  MapPin,
  UserCheck,
  FileText,
  Paperclip,
  Image as ImageIcon,
  FileSpreadsheet,
  MessageSquare,
  FileCheck,
  Building2,
  CalendarCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { updateLeadStatus, closeLeadWithFinance, createLeadManual, updateLeadDetails, deleteLead } from "../actions";
import { linkLeadToClient, createClientFromLead } from "../../clients/actions";
import { triggerHaptic } from "@/lib/haptics";
import Button from "@/components/ui/Button";
import { crmDict } from "@/dictionaries/crm";
import ClickMatcherWidget from "@/components/admin/ClickMatcherWidget";

interface Client {
  id: string;
  name: string;
  phone: string;
  companyName: string | null;
}

interface EstimateItem {
  id?: string;
  type: any;
  name: string;
  quantity: number;
  unit: any;
  costPrice: number;
  sellPrice: number;
  warehouseItemId?: string | null;
}

interface Lead {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  message: string | null;
  calcDetails: string | null;
  status: LeadStatus;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  yandexClientId: string | null;
  googleClientId: string | null;
  fbBrowserId: string | null;
  revenue: number;
  expenses: number;
  prepayment: number;
  isPrepaymentPaid: boolean;
  isBalancePaid: boolean;
  comment: string | null;
  source: string | null;
  address: string | null;
  appointmentDate: string | null;
  deadline: string | null;
  manager: PartnerName | null;
  clientId: string | null;
  client?: Client | null;
  files?: { id: string; mimeType: string; category: string }[];
  activities?: { id: string }[];
  estimate?: {
    id: string;
    isStockDeducted: boolean;
    items: EstimateItem[];
  } | null;
}

interface LeadsDashboardProps {
  initialLeads: Lead[];
  initialClients: Client[];
  initialWarehouseItems: any[];
  initialSupplierPrices: any[];
  initialPendingClicks?: any[];
  selectedLeadId?: string;
}

const STATUS_MAP: Record<LeadStatus, { label: string; color: string; bg: string }> = {
  NEW: { label: "Новый", color: "text-blue-600 border-blue-200", bg: "bg-blue-50" },
  IN_PROGRESS: { label: "В работе", color: "text-amber-600 border-amber-200", bg: "bg-amber-50" },
  ESTIMATE: { label: "Смета/Замер", color: "text-purple-600 border-purple-200", bg: "bg-purple-50" },
  PROCESSED: { label: "Производство", color: "text-indigo-600 border-indigo-200", bg: "bg-indigo-50" },
  COMPLETED: { label: "Выполнен", color: "text-emerald-600 border-emerald-200", bg: "bg-emerald-50" },
  CANCELLED: { label: "Отказ", color: "text-rose-600 border-rose-200", bg: "bg-rose-50" },
};

import EstimateModal from "./EstimateModal";
import CreateLeadModal from "./CreateLeadModal";
import FinanceModal from "./FinanceModal";
import { Calculator } from "lucide-react";

export default function LeadsDashboard({ 
  initialLeads, 
  initialClients, 
  initialWarehouseItems,
  initialSupplierPrices,
  selectedLeadId 
}: LeadsDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  // Стейты калькулятора смет
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  
  // Состояния для модалки закрытия сделки с финансами
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const [financeLead, setFinanceLead] = useState<Lead | null>(null);
  const [revenueInput, setRevenueInput] = useState("");
  const [expenseInput, setExpenseInput] = useState("");
  const [isFinancing, setIsFinancing] = useState(false);

  // Состояния для ручного создания лида
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadPhone, setNewLeadPhone] = useState("");
  const [newLeadMessage, setNewLeadMessage] = useState("");
  const [newLeadSource, setNewLeadSource] = useState("Вручную");
  const [newLeadComment, setNewLeadComment] = useState("");
  const [newLeadAddress, setNewLeadAddress] = useState("");
  const [newLeadAppDate, setNewLeadAppDate] = useState("");
  const [newLeadDeadline, setNewLeadDeadline] = useState("");
  const [newLeadManager, setNewLeadManager] = useState<PartnerName | "">("");
  const [newLeadStatus, setNewLeadStatus] = useState<LeadStatus>(LeadStatus.NEW);
  const [isCreatingLead, setIsCreatingLead] = useState(false);

  // Состояния для удаления лида
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [leadToDeleteId, setLeadToDeleteId] = useState<string | null>(null);

  // Состояния для редактирования полей в правой карточке
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [editComment, setEditComment] = useState("");
  const [editSource, setEditSource] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editAppDate, setEditAppDate] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editManager, setEditManager] = useState<PartnerName | "">("");
  const [editPrepayment, setEditPrepayment] = useState("");
  const [editIsPrepaymentPaid, setEditIsPrepaymentPaid] = useState(false);
  const [editIsBalancePaid, setEditIsBalancePaid] = useState(false);
  const [isSavingDetails, setIsSavingDetails] = useState(false);

  useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);

  useEffect(() => {
    setClients(initialClients);
  }, [initialClients]);

  // Синхронизация полей редактирования при выборе активного лида
  useEffect(() => {
    if (activeLead) {
      setEditName(activeLead.name || "");
      setEditPhone(activeLead.phone || "");
      setEditMessage(activeLead.message || "");
      setEditComment(activeLead.comment || "");
      setEditSource(activeLead.source || "Сайт");
      setEditAddress(activeLead.address || "");
      
      const appDateStr = activeLead.appointmentDate 
        ? new Date(activeLead.appointmentDate).toISOString().slice(0, 16) 
        : "";
      setEditAppDate(appDateStr);

      const deadlineStr = activeLead.deadline 
        ? new Date(activeLead.deadline).toISOString().slice(0, 10) 
        : "";
      setEditDeadline(deadlineStr);
      setEditManager(activeLead.manager || "");
      setEditPrepayment(activeLead.prepayment ? activeLead.prepayment.toString() : "");
      setEditIsPrepaymentPaid(activeLead.isPrepaymentPaid || false);
      setEditIsBalancePaid(activeLead.isBalancePaid || false);
    } else {
      setEditName("");
      setEditPhone("");
      setEditMessage("");
      setEditComment("");
      setEditSource("");
      setEditAddress("");
      setEditAppDate("");
      setEditDeadline("");
      setEditManager("");
      setEditPrepayment("");
      setEditIsPrepaymentPaid(false);
      setEditIsBalancePaid(false);
    }
  }, [activeLead]);

  // Обработка перехода по ID лида из Telegram
  useEffect(() => {
    if (selectedLeadId) {
      const found = leads.find((l) => l.id === selectedLeadId);
      if (found) {
        setActiveLead(found);
      }
    }
  }, [selectedLeadId, leads]);

  // Выход из системы
  const handleLogout = async () => {
    triggerHaptic("light");
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  // Изменение статуса лида
  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    triggerHaptic("light");
    if (newStatus === "COMPLETED") {
      const targetLead = leads.find((l) => l.id === leadId);
      if (targetLead) {
        setFinanceLead(targetLead);
        setRevenueInput("");
        setExpenseInput("");
        setShowFinanceModal(true);
      }
      return;
    }

    const res = await updateLeadStatus(leadId, newStatus);
    if (res.success) {
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      );
      if (activeLead && activeLead.id === leadId) {
        setActiveLead((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } else {
      alert(res.error);
    }
  };

  // Завершение лида с финансами
  const handleFinanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!financeLead) return;

    setIsFinancing(true);
    triggerHaptic("success");

    const rev = parseFloat(revenueInput) || 0;
    const exp = parseFloat(expenseInput) || 0;

    const res = await closeLeadWithFinance(
      financeLead.id,
      rev,
      exp,
      financeLead.prepayment || 0,
      financeLead.isPrepaymentPaid || false,
      financeLead.isBalancePaid || false
    );
    if (res.success) {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === financeLead.id
            ? {
                ...l,
                status: "COMPLETED" as LeadStatus,
                revenue: rev,
                expenses: exp,
                isPrepaymentPaid: financeLead.isPrepaymentPaid,
                isBalancePaid: financeLead.isBalancePaid,
              }
            : l
        )
      );
      if (activeLead && activeLead.id === financeLead.id) {
        setActiveLead((prev) =>
          prev
            ? {
                ...prev,
                status: "COMPLETED" as LeadStatus,
                revenue: rev,
                expenses: exp,
                isPrepaymentPaid: financeLead.isPrepaymentPaid,
                isBalancePaid: financeLead.isBalancePaid,
              }
            : null
        );
      }
      setShowFinanceModal(false);
      setFinanceLead(null);
    } else {
      alert(res.error);
    }
    setIsFinancing(false);
  };

  // Ручное создание лида
  const handleCreateLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadPhone) {
      alert("Заполните Имя и Телефон");
      return;
    }

    setIsCreatingLead(true);
    triggerHaptic("success");

    const res = await createLeadManual({
      name: newLeadName,
      phone: newLeadPhone,
      message: newLeadMessage,
      status: newLeadStatus,
      comment: newLeadComment,
      source: newLeadSource,
      address: newLeadAddress,
      appointmentDate: newLeadAppDate || undefined,
      deadline: newLeadDeadline || undefined,
      manager: newLeadManager || null,
    });

    if (res.success) {
      // Перезагружаем страницу/роутер, чтобы подтянуть свежие лиды с сервера
      router.refresh();
      setShowCreateModal(false);
      // Очищаем форму
      setNewLeadName("");
      setNewLeadPhone("");
      setNewLeadMessage("");
      setNewLeadSource("Вручную");
      setNewLeadComment("");
      setNewLeadAddress("");
      setNewLeadAppDate("");
      setNewLeadDeadline("");
      setNewLeadManager("");
      setNewLeadStatus(LeadStatus.NEW);
    } else {
      alert(res.error);
    }
    setIsCreatingLead(false);
  };

  // Сохранение отредактированных полей
  const handleSaveLeadDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead) return;

    setIsSavingDetails(true);
    triggerHaptic("success");
    const prep = parseFloat(editPrepayment) || 0;

    const res = await updateLeadDetails(activeLead.id, {
      name: editName,
      phone: editPhone,
      message: editMessage,
      comment: editComment,
      source: editSource,
      address: editAddress,
      appointmentDate: editAppDate || null,
      deadline: editDeadline || null,
      manager: (editManager as PartnerName) || null,
      prepayment: prep,
      isPrepaymentPaid: editIsPrepaymentPaid,
      isBalancePaid: editIsBalancePaid,
    });

    if (res.success) {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === activeLead.id
            ? {
                ...l,
                name: editName,
                phone: editPhone,
                message: editMessage,
                comment: editComment,
                source: editSource,
                address: editAddress,
                appointmentDate: editAppDate ? new Date(editAppDate).toISOString() : null,
                deadline: editDeadline ? new Date(editDeadline).toISOString() : null,
                manager: (editManager as PartnerName) || null,
                prepayment: prep,
                isPrepaymentPaid: editIsPrepaymentPaid,
                isBalancePaid: editIsBalancePaid,
              }
            : l
        )
      );
      setActiveLead((prev) =>
        prev
          ? {
              ...prev,
              name: editName,
              phone: editPhone,
              message: editMessage,
              comment: editComment,
              source: editSource,
              address: editAddress,
              appointmentDate: editAppDate ? new Date(editAppDate).toISOString() : null,
              deadline: editDeadline ? new Date(editDeadline).toISOString() : null,
              manager: (editManager as PartnerName) || null,
              prepayment: prep,
              isPrepaymentPaid: editIsPrepaymentPaid,
              isBalancePaid: editIsBalancePaid,
            }
          : null
      );
      router.refresh();
      alert("Данные успешно сохранены!");
    } else {
      alert(res.error);
    }
    setIsSavingDetails(false);
  };

  // Инициация удаления лида
  const handleDeleteClick = (leadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("light");
    setLeadToDeleteId(leadId);
    setShowDeleteConfirm(true);
  };

  // Подтверждение удаления лида
  const handleDeleteConfirm = async () => {
    if (!leadToDeleteId) return;

    triggerHaptic("success");
    const res = await deleteLead(leadToDeleteId);

    if (res.success) {
      setLeads((prev) => prev.filter((l) => l.id !== leadToDeleteId));
      if (activeLead && activeLead.id === leadToDeleteId) {
        setActiveLead(null);
      }
      setShowDeleteConfirm(false);
      setLeadToDeleteId(null);
      router.refresh();
    } else {
      alert(res.error);
    }
  };

  // Фильтрация и поиск лидов
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm);
      const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchTerm, statusFilter]);

  return (
    <div className="space-y-8 select-none">
      
      {/* ── НАВИГАЦИОННАЯ ШАПКА АДМИНКИ ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.015)]">
        <div className="shrink-0">
          <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{crmDict.navigation.dashboard}</span>
          <h1 className="text-xl font-black text-slate-900 mt-0.5">{crmDict.navigation.title}</h1>
        </div>
        
        {/* Группа 1: Действия (Добавить лид, Составить смету) */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => { triggerHaptic("light"); setShowCreateModal(true); }}
              variant="solid"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="text-xs font-black py-2 px-3 shadow-sm shadow-orange-500/10 shrink-0"
            >
              {crmDict.leads.addLeadBtn}
            </Button>

            <Button 
              onClick={() => { triggerHaptic("light"); setActiveLead(null); setShowEstimateModal(true); }}
              variant="lightOutline"
              leftIcon={<Calculator className="w-3.5 h-3.5 text-orange-500" />}
              className="text-xs font-bold py-2 px-3 border-slate-200 hover:border-orange-500/20 text-slate-700 bg-white hover:bg-slate-50 shrink-0"
            >
              Смета
            </Button>
          </div>

          <div className="h-5 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

          {/* Группа 2: Разделы CRM */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Button 
              variant="lightGlass" 
              className="text-orange-600 bg-orange-50 border-orange-200/50 text-xs font-bold py-2 px-3"
            >
              {crmDict.navigation.leads}
            </Button>

            <Button 
              onClick={() => router.push("/admin/companies")}
              variant="lightOutline" 
              className="text-slate-600 border-slate-200 hover:border-slate-300 text-xs font-bold py-2 px-3"
            >
              Компании
            </Button>

            <Button 
              onClick={() => router.push("/admin/projects")}
              variant="lightOutline" 
              className="text-slate-600 border-slate-200 hover:border-slate-300 text-xs font-bold py-2 px-3"
            >
              Проекты
            </Button>

            <Button 
              onClick={() => router.push("/admin/clients")}
              variant="lightOutline" 
              className="text-slate-600 border-slate-200 hover:border-slate-300 text-xs font-bold py-2 px-3"
            >
              {crmDict.navigation.clients}
            </Button>

            <Button 
              onClick={() => router.push("/admin/warehouse")}
              variant="lightOutline" 
              className="text-slate-600 border-slate-200 hover:border-slate-300 text-xs font-bold py-2 px-3"
            >
              {crmDict.navigation.warehouse}
            </Button>

            <Button 
              onClick={() => router.push("/admin/finance")}
              variant="lightOutline" 
              className="text-slate-600 border-slate-200 hover:border-slate-300 text-xs font-bold py-2 px-3"
            >
              {crmDict.navigation.finance}
            </Button>

            <Button 
              onClick={() => router.push("/admin/analytics")}
              variant="lightOutline" 
              className="text-slate-600 border-slate-200 hover:border-slate-300 text-xs font-bold py-2 px-3"
            >
              {crmDict.navigation.analytics}
            </Button>
          </div>
          
          <div className="h-5 w-[1px] bg-slate-200 mx-1 hidden sm:block" />
          
          {/* Группа 3: Выйти */}
          <Button 
            onClick={handleLogout}
            variant="lightOutline"
            leftIcon={<LogOut className="w-3.5 h-3.5 text-rose-500" />}
            className="text-rose-600 border-rose-200/60 bg-rose-50/30 hover:bg-rose-50 text-xs font-extrabold py-2 px-3 shrink-0"
          >
            {crmDict.navigation.logout}
          </Button>
        </div>
      </div>

      {/* ── ОСНОВНОЙ КОНТЕНТ: ВХОДЯЩИЕ КЛИКИ WHATSAPP/ТЕЛЕФОН ── */}
      <ClickMatcherWidget leadId="" />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* ЛЕВАЯ ЧАСТЬ: СПИСОК ЛИДОВ И ФИЛЬТРЫ */}
        <div className="w-full lg:flex-1 space-y-4">
          
          {/* Фильтры и поиск */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={crmDict.leads.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/10 text-sm transition"
                />
              </div>
              
              {/* Статус селект */}
              <div className="relative group">
                <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500 pointer-events-none transition group-hover:scale-110 duration-200" />
                <select
                  value={statusFilter}
                  onChange={(e) => { triggerHaptic("light"); setStatusFilter(e.target.value); }}
                  className="bg-slate-50 hover:bg-slate-100/70 border border-slate-200 hover:border-slate-300 rounded-xl py-2.5 pl-10 pr-9 text-slate-800 font-extrabold focus:border-orange-500/50 focus:outline-none text-xs transition appearance-none cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  <option value="ALL">{crmDict.leads.allStatuses}</option>
                  {Object.entries(STATUS_MAP).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-slate-450 font-bold select-none">▼</div>
              </div>
            </div>
          </div>

          {/* Список лидов */}
          <div className="space-y-3">
            {filteredLeads.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400 font-semibold">
                {crmDict.leads.notFound}
              </div>
            ) : (
              filteredLeads.map((lead) => {
                const status = STATUS_MAP[lead.status] || { label: lead.status, color: "text-slate-600", bg: "bg-slate-100" };
                const isSelected = activeLead?.id === lead.id;

                return (
                  <motion.div
                    layoutId={`lead-card-${lead.id}`}
                    key={lead.id}
                    onClick={() => { triggerHaptic("light"); setActiveLead(lead); }}
                    className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isSelected 
                        ? "bg-orange-50/40 border-orange-300 shadow-md shadow-orange-500/5" 
                        : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base truncate">{lead.name}</h3>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${status.color} ${status.bg}`}>
                            {status.label}
                          </span>
                        </div>
                        
                        <p className="text-slate-500 text-sm flex items-center gap-1.5 font-medium">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {lead.phone}
                        </p>

                        {/* Индикаторы наполненности карточки */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {/* Файлы с группировкой по типам */}
                          {lead.files && lead.files.length > 0 && (() => {
                            const imagesCount = lead.files.filter(f => f.mimeType.startsWith("image/")).length;
                            const docsCount = lead.files.filter(f => 
                              f.mimeType.includes("word") || 
                              f.mimeType.includes("document") || 
                              f.mimeType.includes("pdf")
                            ).length;
                            const tablesCount = lead.files.filter(f => 
                              f.mimeType.includes("excel") || 
                              f.mimeType.includes("sheet") || 
                              f.mimeType.includes("csv")
                            ).length;
                            const otherCount = lead.files.length - (imagesCount + docsCount + tablesCount);

                            return (
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700" title={`Всего файлов: ${lead.files.length}`}>
                                <Paperclip className="w-3 h-3 text-slate-500" />
                                <span>{lead.files.length}</span>
                                <div className="flex items-center gap-1 border-l border-slate-200 pl-1 ml-0.5">
                                  {imagesCount > 0 && (
                                    <span className="flex items-center text-blue-600 font-extrabold" title={`Изображений: ${imagesCount}`}>
                                      <ImageIcon className="w-3 h-3 mr-0.5" />{imagesCount}
                                    </span>
                                  )}
                                  {docsCount > 0 && (
                                    <span className="flex items-center text-indigo-600 font-extrabold" title={`Документов (Word/PDF): ${docsCount}`}>
                                      <FileText className="w-3 h-3 mr-0.5" />{docsCount}
                                    </span>
                                  )}
                                  {tablesCount > 0 && (
                                    <span className="flex items-center text-emerald-600 font-extrabold" title={`Таблиц (Excel): ${tablesCount}`}>
                                      <FileSpreadsheet className="w-3 h-3 mr-0.5" />{tablesCount}
                                    </span>
                                  )}
                                  {otherCount > 0 && (
                                    <span className="text-slate-500 font-extrabold" title={`Прочих файлов: ${otherCount}`}>
                                      +{otherCount}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })()}

                          {/* Смета */}
                          {lead.estimate && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200/60 text-[11px] font-bold text-purple-700" title={`Смета: ${lead.estimate.items?.length || 0} позиций`}>
                              <FileCheck className="w-3 h-3 text-purple-600" />
                              Смета ({lead.estimate.items?.length || 0})
                            </span>
                          )}

                          {/* Заметки/Комментарий менеджера */}
                          {lead.comment && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200/60 text-[11px] font-bold text-amber-700" title={`Заметка: ${lead.comment}`}>
                              <MessageSquare className="w-3 h-3 text-amber-600" />
                              Заметка
                            </span>
                          )}

                          {/* Хронология / Записи активности */}
                          {lead.activities && lead.activities.length > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200/60 text-[11px] font-bold text-blue-700" title={`Событий в истории: ${lead.activities.length}`}>
                              <Clock className="w-3 h-3 text-blue-600" />
                              {lead.activities.length}
                            </span>
                          )}

                          {/* Адрес замера/монтажа */}
                          {lead.address && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-600 max-w-[140px] truncate" title={`Адрес: ${lead.address}`}>
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{lead.address}</span>
                            </span>
                          )}

                          {/* Ответственный менеджер */}
                          {lead.manager && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-bold text-slate-700" title={`Менеджер: ${lead.manager}`}>
                              <UserCheck className="w-3 h-3 text-orange-500" />
                              {lead.manager}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0 space-y-2 flex flex-col items-end">
                        <span className="text-[10px] text-slate-400 font-semibold block">
                          {new Date(lead.createdAt).toLocaleDateString("ru-RU", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {lead.revenue > 0 && (
                          <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                            +{lead.revenue.toLocaleString("ru")} ₸
                          </span>
                        )}
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerHaptic("light");
                              setActiveLead(lead);
                              setShowEstimateModal(true);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/70 transition cursor-pointer active:scale-95"
                            title="Открыть / составить смету"
                          >
                            <Calculator className="w-3 h-3 text-purple-600" />
                            Смета
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerHaptic("light");
                              router.push(`/admin/leads/${lead.id}`);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer shadow-sm active:scale-95"
                            title="Открыть карточку и файлы проекта"
                          >
                            <FolderOpen className="w-3 h-3 text-orange-400" />
                            Карточка
                          </button>
                          <button
                            onClick={(e) => handleDeleteClick(lead.id, e)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Удалить лид"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* ── ПРАВАЯ ЧАСТЬ: ДЕТАЛИ ЛИДА (STICKY ИЛИ OVERLAY) ── */}
        <AnimatePresence>
          {activeLead && (
            <motion.aside
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="w-full lg:w-[420px] bg-white rounded-3xl border border-slate-200 p-6 shadow-xl sticky top-8 space-y-5 overflow-y-auto max-h-[85vh] scrollbar-hide"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-lg font-black text-slate-900">{crmDict.leads.sidebarTitle}</h2>
                <button
                  onClick={() => setActiveLead(null)}
                  className="p-1 rounded-full text-slate-450 hover:bg-slate-100 cursor-pointer"
                  type="button"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveLeadDetails} className="space-y-4">
                {/* Кнопка открытия калькулятора себестоимости и Карточки Лида */}
                <div className="pt-1 space-y-2">
                  <button
                    type="button"
                    onClick={() => { triggerHaptic("light"); router.push(`/admin/leads/${activeLead.id}`); }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition cursor-pointer active:scale-95 shadow-md"
                  >
                    <FolderOpen className="w-4 h-4 text-orange-400" />
                    Открыть карточку и файлы проекта
                  </button>

                  <button
                    type="button"
                    onClick={() => { triggerHaptic("light"); setShowEstimateModal(true); }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-orange-50 border border-orange-200/50 hover:bg-orange-100/30 text-orange-600 font-extrabold text-xs transition cursor-pointer active:scale-95 shadow-sm"
                  >
                    <Calculator className="w-4 h-4 text-orange-500" />
                    {crmDict.leads.costPriceBtn}
                  </button>
                </div>

                {/* Имя и Телефон */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                      {crmDict.leads.fioLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:border-orange-500/50 focus:outline-none text-xs transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                      {crmDict.leads.phoneLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:border-orange-500/50 focus:outline-none text-xs transition"
                    />
                  </div>
                </div>

                {/* Статус сделки */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                      {crmDict.leads.statusLabel}
                    </label>
                    <select
                      value={activeLead.status}
                      onChange={(e) => handleStatusChange(activeLead.id, e.target.value as LeadStatus)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:border-orange-500/50 focus:outline-none text-xs transition appearance-none cursor-pointer"
                    >
                      {Object.entries(STATUS_MAP).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                      {crmDict.leads.responsibleLabel}
                    </label>
                    <select
                      value={editManager}
                      onChange={(e) => setEditManager(e.target.value as PartnerName | "")}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:border-orange-500/50 focus:outline-none text-xs transition appearance-none cursor-pointer"
                    >
                      <option value="">{crmDict.leads.notAssigned}</option>
                      <option value="DANIIL">Даниил</option>
                      <option value="ELISEY">Елисей</option>
                    </select>
                  </div>
                </div>

                {/* Источник и Адрес */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                      {crmDict.leads.sourceLabel}
                    </label>
                    <input
                      type="text"
                      value={editSource}
                      onChange={(e) => setEditSource(e.target.value)}
                      placeholder="WhatsApp, Звонок, Вручную..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:border-orange-500/50 focus:outline-none text-xs transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> {crmDict.leads.addressLabel}
                    </label>
                    <input
                      type="text"
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      placeholder="ул. Кабанбай Батыра, 17..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:border-orange-500/50 focus:outline-none text-xs transition"
                    />
                  </div>
                </div>

                {/* Даты замеров и дедлайны */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> {crmDict.leads.appointmentDateLabel}
                    </label>
                    <input
                      type="datetime-local"
                      value={editAppDate}
                      onChange={(e) => setEditAppDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-800 font-semibold focus:border-orange-500/50 focus:outline-none text-xs transition cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {crmDict.leads.deadlineLabel}
                    </label>
                    <input
                      type="date"
                      value={editDeadline}
                      onChange={(e) => setEditDeadline(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-800 font-semibold focus:border-orange-500/50 focus:outline-none text-xs transition cursor-pointer"
                    />
                  </div>
                </div>

                {/* Финансы сделки */}
                <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl space-y-3">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Финансы сделки</span>
                  
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                      Сумма аванса (₸)
                    </label>
                    <input
                      type="number"
                      value={editPrepayment}
                      onChange={(e) => setEditPrepayment(e.target.value)}
                      placeholder="0"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:border-orange-500/50 focus:outline-none text-xs transition"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Аванс оплачен:</span>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={editIsPrepaymentPaid}
                        onChange={(e) => { triggerHaptic("light"); setEditIsPrepaymentPaid(e.target.checked); }}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-305 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Проект полностью оплачен:</span>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={editIsBalancePaid}
                        onChange={(e) => { triggerHaptic("light"); setEditIsBalancePaid(e.target.checked); }}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-305 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                </div>

                {/* Комментарии менеджера */}
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                    {crmDict.leads.notesLabel}
                  </label>
                  <textarea
                    rows={3}
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    placeholder="Например: Обсудили неон, клиент думает..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700 font-medium focus:border-orange-500/50 focus:outline-none text-xs transition leading-relaxed"
                  />
                </div>

                {/* Сообщение клиента (только для чтения, если пришло с сайта) */}
                {activeLead.message && (
                  <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/50 text-xs">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Изначальный запрос:</span>
                    <p className="text-slate-600 mt-1 font-medium">{activeLead.message}</p>
                  </div>
                )}

                {/* Расчет калькулятора (если есть) */}
                {activeLead.calcDetails && (
                  <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/50 text-[10px]">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Параметры вывески:</span>
                    <pre className="text-slate-600 mt-1 font-mono whitespace-pre-wrap leading-tight">{activeLead.calcDetails}</pre>
                  </div>
                )}

                {/* Финансовый итог (если сделка закрыта) */}
                {activeLead.status === "COMPLETED" && (
                  <div className="bg-emerald-50/40 border border-emerald-200/60 rounded-xl p-3 space-y-1.5 text-xs">
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> {crmDict.leads.completedBadge}
                    </span>
                    <div className="grid grid-cols-2 gap-3 font-semibold">
                      <div>
                        <span className="text-[9px] text-slate-450 block">{crmDict.leads.revenueLabel}</span>
                        <span className="text-slate-800 text-xs">{activeLead.revenue.toLocaleString("ru")} ₸</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-450 block">{crmDict.leads.expenseLabel}</span>
                        <span className="text-rose-600 text-xs">{activeLead.expenses.toLocaleString("ru")} ₸</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Кнопка отправки формы */}
                <Button
                  type="submit"
                  disabled={isSavingDetails}
                  variant="solid"
                  className="w-full text-xs font-extrabold py-3 bg-gradient-to-r from-orange-600 to-red-600 shadow-md hover:from-orange-500 hover:to-red-500"
                >
                  {isSavingDetails ? crmDict.leads.saving : crmDict.leads.saveChangesBtn}
                </Button>
              </form>

              {/* ── СВЯЗАННЫЙ КЛИЕНТ ── */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">
                  {crmDict.leads.clientCardHeader}
                </span>
                
                {activeLead.client ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 text-xs relative text-left">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-slate-900 text-xs">
                        {activeLead.client.name}
                      </h4>
                      <button
                        type="button"
                        onClick={async () => {
                          triggerHaptic("light");
                          if (confirm("Отвязать лид от клиента?")) {
                            const res = await linkLeadToClient(activeLead.id, null);
                            if (res.success) {
                              setLeads(prev => prev.map(l => l.id === activeLead.id ? { ...l, clientId: null, client: null } : l));
                              setActiveLead(prev => prev ? { ...prev, clientId: null, client: null } : null);
                              router.refresh();
                            } else {
                              alert(res.error);
                            }
                          }
                        }}
                        className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                      >
                        {crmDict.leads.unlinkBtn}
                      </button>
                    </div>
                    
                    {activeLead.client.companyName && (
                      <p className="text-slate-600 font-medium">
                        Компания: <span className="font-bold">{activeLead.client.companyName}</span>
                      </p>
                    )}
                    <p className="text-slate-650 flex items-center gap-1 font-semibold">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {activeLead.client.phone}
                    </p>
                    
                    <button
                      type="button"
                      onClick={() => router.push(`/admin/clients`)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[10px] font-bold text-slate-600 transition cursor-pointer"
                    >
                      Перейти в карточку клиента <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-550 italic text-left">{crmDict.leads.notLinked}</p>
                    
                    <div className="flex flex-col gap-2">
                      <select
                        onChange={async (e) => {
                          const cid = e.target.value;
                          if (!cid) return;
                          triggerHaptic("light");
                          const res = await linkLeadToClient(activeLead.id, cid);
                          if (res.success) {
                            const matched = clients.find(c => c.id === cid);
                            setLeads(prev => prev.map(l => l.id === activeLead.id ? { ...l, clientId: cid, client: matched } : l));
                            setActiveLead(prev => prev ? { ...prev, clientId: cid, client: matched } : null);
                            router.refresh();
                          } else {
                            alert(res.error);
                          }
                        }}
                        value=""
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:border-orange-500/50 focus:outline-none text-xs transition cursor-pointer"
                      >
                        <option value="">{crmDict.leads.bindPlaceholder}</option>
                        {clients.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.phone}) {c.companyName ? `- ${c.companyName}` : ""}
                          </option>
                        ))}
                      </select>
                      
                      <button
                        type="button"
                        onClick={async () => {
                          triggerHaptic("success");
                          const res = await createClientFromLead(activeLead.id);
                          if (res.success && res.clientId) {
                            alert("Карточка клиента успешно создана!");
                            window.location.reload();
                          } else {
                            alert(res.error);
                          }
                        }}
                        className="w-full text-center py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black transition cursor-pointer"
                      >
                        {crmDict.leads.createClientFromLeadBtn}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Источник рекомендации или SEO (если есть) */}
              {(activeLead.utmSource === "recommendation" || activeLead.utmMedium === "organic") && (
                <div className="space-y-2.5">
                  {activeLead.utmSource === "recommendation" && (
                    <div className="bg-orange-50/50 border border-orange-200/50 rounded-xl p-3.5 space-y-1 text-xs">
                      <span className="font-bold text-orange-700 flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-orange-600" /> Рекомендация партнера
                      </span>
                      <p className="text-slate-650 font-medium leading-relaxed">
                        Этот клиент перешел по партнерской рекомендации от: <span className="font-bold text-slate-900 bg-orange-100/60 px-1.5 py-0.5 rounded">{activeLead.utmMedium || "Неизвестный партнер"}</span>
                      </p>
                    </div>
                  )}

                  {activeLead.utmMedium === "organic" && (
                    <div className="bg-blue-50/50 border border-blue-200/50 rounded-xl p-3.5 space-y-1 text-xs">
                      <span className="font-bold text-blue-700 flex items-center gap-1.5">
                        <Search className="w-4 h-4 text-blue-600" /> Поиск из Интернета (SEO)
                      </span>
                      <p className="text-slate-650 font-medium leading-relaxed">
                        Клиент нашел наш сайт через поисковую систему: <span className="font-bold text-slate-900 uppercase bg-blue-100/60 px-1.5 py-0.5 rounded">{activeLead.utmSource}</span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Аналитические данные (UTM / Client IDs) */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-[10px]">
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">{crmDict.leads.analyticsHeader}</span>
                <div className="grid grid-cols-3 gap-1.5 text-slate-600 font-medium">
                  <div>
                    <span className="text-[8px] text-slate-400 block">UTM Source</span>
                    <span className="truncate block">{activeLead.utmSource || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 block">UTM Medium</span>
                    <span className="truncate block">{activeLead.utmMedium || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 block">UTM Campaign</span>
                    <span className="truncate block">{activeLead.utmCampaign || "—"}</span>
                  </div>
                </div>
                {activeLead.yandexClientId && (
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>Yandex ID:</span>
                    <span>{activeLead.yandexClientId}</span>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* ── МОДАЛКА ВВОДА ФИНАНСОВ ПРИ ЗАКРЫТИИ СДЕЛКИ ── */}
      {showFinanceModal && typeof window !== "undefined" && createPortal(
        <FinanceModal
          isOpen={showFinanceModal}
          onClose={() => { setShowFinanceModal(false); setFinanceLead(null); }}
          leadName={financeLead?.name || ""}
          revenueInput={revenueInput}
          setRevenueInput={setRevenueInput}
          expenseInput={expenseInput}
          setExpenseInput={setExpenseInput}
          isFinancing={isFinancing}
          onSubmit={handleFinanceSubmit}
          prepayment={financeLead?.prepayment || 0}
          isPrepaymentPaid={financeLead?.isPrepaymentPaid || false}
          setIsPrepaymentPaid={(val) => { if (financeLead) setFinanceLead({ ...financeLead, isPrepaymentPaid: val }); }}
          isBalancePaid={financeLead?.isBalancePaid || false}
          setIsBalancePaid={(val) => { if (financeLead) setFinanceLead({ ...financeLead, isBalancePaid: val }); }}
        />,
        document.body
      )}

      {/* ── МОДАЛКА СОЗДАНИЯ ЛИДА ВРУЧНУЮ ── */}
      {showCreateModal && typeof window !== "undefined" && createPortal(
        <CreateLeadModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateLeadSubmit}
          newLeadName={newLeadName}
          setNewLeadName={setNewLeadName}
          newLeadPhone={newLeadPhone}
          setNewLeadPhone={setNewLeadPhone}
          newLeadManager={newLeadManager}
          setNewLeadManager={setNewLeadManager}
          newLeadAppDate={newLeadAppDate}
          setNewLeadAppDate={setNewLeadAppDate}
          newLeadDeadline={newLeadDeadline}
          setNewLeadDeadline={setNewLeadDeadline}
          newLeadAddress={newLeadAddress}
          setNewLeadAddress={setNewLeadAddress}
          newLeadComment={newLeadComment}
          setNewLeadComment={setNewLeadComment}
          isCreatingLead={isCreatingLead}
        />,
        document.body
      )}


      {/* ── ПОДТВЕРЖДЕНИЕ УДАЛЕНИЯ ЛИДА ── */}
      {showDeleteConfirm && typeof window !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300"
            onClick={() => { setShowDeleteConfirm(false); setLeadToDeleteId(null); }}
          />

          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="w-full max-w-sm bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 p-6 shadow-apple-modal relative z-10 text-center animate-in fade-in zoom-in-95"
          >
            <h3 className="text-lg font-black text-slate-900 mb-2">{crmDict.leads.deleteLeadConfirmTitle}</h3>
            <p className="text-slate-500 text-xs mb-6 font-medium">
              {crmDict.leads.deleteLeadConfirmDesc}
              <br />
              <strong className="text-rose-600 block mt-2">
                {crmDict.leads.deleteLeadWarning}
              </strong>
            </p>

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => { setShowDeleteConfirm(false); setLeadToDeleteId(null); }}
                variant="lightOutline"
                className="flex-1 py-3 text-xs font-bold text-slate-650"
              >
                {crmDict.leads.cancel}
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                variant="secondary"
                className="flex-1 py-3 text-xs font-bold bg-rose-600 border-rose-500 text-white hover:bg-rose-700 shadow-lg shadow-rose-500/10 hover:shadow-rose-500/20 active:scale-95"
              >
                {crmDict.leads.delete}
              </Button>
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* ── МОДАЛЬНЫЙ КАЛЬКУЛЯТОР СЕБЕСТОИМОСТИ СДЕЛКИ ── */}
      {showEstimateModal && (
        <EstimateModal
          isOpen={showEstimateModal}
          onClose={() => setShowEstimateModal(false)}
          leadId={activeLead ? activeLead.id : null}
          leadName={activeLead ? activeLead.name : ""}
          initialItems={activeLead?.estimate?.items || []}
          isStockDeducted={activeLead?.estimate?.isStockDeducted || false}
          warehouseItems={initialWarehouseItems}
          supplierPrices={initialSupplierPrices}
          leads={leads}
          onSaveSuccess={(revenue, expenses, newEstimate) => {
            if (newEstimate.leadId) {
              setLeads(prev => prev.map(l => l.id === newEstimate.leadId ? { 
                ...l, 
                revenue, 
                expenses,
                estimate: newEstimate
              } : l));
            }
            if (activeLead && activeLead.id === newEstimate.leadId) {
              setActiveLead(prev => prev ? { 
                ...prev, 
                revenue, 
                expenses,
                estimate: newEstimate
              } : null);
            }
            router.refresh();
          }}
        />
      )}

    </div>
  );
}
