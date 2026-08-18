"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Search, 
  User, 
  Phone, 
  Mail, 
  Building, 
  FileText, 
  MapPin, 
  CreditCard, 
  Edit3, 
  Trash2, 
  Plus, 
  LogOut, 
  XCircle,
  Briefcase,
  ChevronRight,
  ExternalLink,
  FileSpreadsheet,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { createClient, updateClient, deleteClient } from "../actions";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import Button from "@/components/ui/Button";
import { crmDict } from "@/dictionaries/crm";
import { BatchImportClientsModal } from "./BatchImportClientsModal";
import { ExportAudienceModal } from "./ExportAudienceModal";

interface Lead {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  status: string;
  revenue: number;
}

interface Client {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string | null;
  companyName: string | null;
  binIin: string | null;
  contractNum: string | null;
  legalAddress: string | null;
  bankAccount: string | null;
  notes: string | null;
  leads: Lead[];
}

interface ClientsDashboardProps {
  initialClients: Client[];
}

export default function ClientsDashboard({ initialClients }: ClientsDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeClient, setActiveClient] = useState<Client | null>(null);
  
  // Создание нового клиента
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBatchImportModal, setShowBatchImportModal] = useState(false);
  const [showExportAudienceModal, setShowExportAudienceModal] = useState(false);

  const [newClientType, setNewClientType] = useState<"FIZ" | "YUR">("FIZ");
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newBinIin, setNewBinIin] = useState("");
  const [newContractNum, setNewContractNum] = useState("");
  const [newLegalAddress, setNewLegalAddress] = useState("");
  const [newBankAccount, setNewBankAccount] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Редактирование клиента
  const [editClientType, setEditClientType] = useState<"FIZ" | "YUR">("FIZ");
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editCompanyName, setEditCompanyName] = useState("");
  const [editBinIin, setEditBinIin] = useState("");
  const [editContractNum, setEditContractNum] = useState("");
  const [editLegalAddress, setEditLegalAddress] = useState("");
  const [editBankAccount, setEditBankAccount] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Удаление клиента
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [clientToDeleteId, setClientToDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setClients(initialClients);
  }, [initialClients]);

  // Заполнение полей при выборе клиента
  useEffect(() => {
    if (activeClient) {
      setEditName(activeClient.name || "");
      setEditPhone(activeClient.phone || "");
      setEditEmail(activeClient.email || "");
      setEditCompanyName(activeClient.companyName || "");
      setEditBinIin(activeClient.binIin || "");
      setEditContractNum(activeClient.contractNum || "");
      setEditLegalAddress(activeClient.legalAddress || "");
      setEditBankAccount(activeClient.bankAccount || "");
      setEditNotes(activeClient.notes || "");
      
      if (activeClient.companyName || activeClient.binIin || activeClient.contractNum || activeClient.legalAddress) {
        setEditClientType("YUR");
      } else {
        setEditClientType("FIZ");
      }
    }
  }, [activeClient]);

  // Слушатель быстрого создания клиента
  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "create-client") {
      setShowCreateModal(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleOpenCreateClient = () => {
      triggerHaptic("light");
      setShowCreateModal(true);
    };
    const handleOpenBatchImport = () => {
      triggerHaptic("light");
      setShowBatchImportModal(true);
    };
    const handleOpenExportAudience = () => {
      triggerHaptic("light");
      setShowExportAudienceModal(true);
    };

    window.addEventListener("crm:open-create-client", handleOpenCreateClient);
    window.addEventListener("crm:open-batch-import", handleOpenBatchImport);
    window.addEventListener("crm:open-export-audience", handleOpenExportAudience);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("action") === "create-client") {
        setShowCreateModal(true);
      }
    }

    return () => {
      window.removeEventListener("crm:open-create-client", handleOpenCreateClient);
      window.removeEventListener("crm:open-batch-import", handleOpenBatchImport);
      window.removeEventListener("crm:open-export-audience", handleOpenExportAudience);
    };
  }, []);

  const handleLogout = async () => {
    triggerHaptic("light");
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      toast.error("Имя и номер телефона обязательны");
      return;
    }

    setIsCreating(true);
    triggerHaptic("success");

    const isFiz = newClientType === "FIZ";
    const res = await createClient({
      name: newName,
      phone: newPhone,
      email: newEmail,
      companyName: isFiz ? "" : newCompanyName,
      binIin: isFiz ? "" : newBinIin,
      contractNum: isFiz ? "" : newContractNum,
      legalAddress: isFiz ? "" : newLegalAddress,
      bankAccount: isFiz ? "" : newBankAccount,
      notes: newNotes,
    });

    if (res.success && res.client) {
      toast.success("Клиент успешно добавлен в базу!");
      const typedClient: Client = {
        ...res.client,
        createdAt: res.client.createdAt.toISOString(),
        leads: [],
      };
      setClients((prev) => [typedClient, ...prev]);
      setActiveClient(typedClient);
      setShowCreateModal(false);
      
      // Очистить поля
      setNewName("");
      setNewPhone("");
      setNewEmail("");
      setNewCompanyName("");
      setNewBinIin("");
      setNewContractNum("");
      setNewLegalAddress("");
      setNewBankAccount("");
      setNewNotes("");
      setNewClientType("FIZ");
    } else {
      toast.error(res.error || "Не удалось создать клиента");
    }
    setIsCreating(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClient) return;

    setIsSaving(true);
    triggerHaptic("success");

    const isEditFiz = editClientType === "FIZ";
    const res = await updateClient(activeClient.id, {
      name: editName,
      phone: editPhone,
      email: editEmail || null,
      companyName: isEditFiz ? null : (editCompanyName || null),
      binIin: isEditFiz ? null : (editBinIin || null),
      contractNum: isEditFiz ? null : (editContractNum || null),
      legalAddress: isEditFiz ? null : (editLegalAddress || null),
      bankAccount: isEditFiz ? null : (editBankAccount || null),
      notes: editNotes || null,
    });

    if (res.success && res.client) {
      toast.success("Данные клиента успешно обновлены!");
      setClients((prev) =>
        prev.map((c) =>
          c.id === activeClient.id
            ? {
                ...c,
                name: editName,
                phone: editPhone,
                email: editEmail || null,
                companyName: isEditFiz ? null : (editCompanyName || null),
                binIin: isEditFiz ? null : (editBinIin || null),
                contractNum: isEditFiz ? null : (editContractNum || null),
                legalAddress: isEditFiz ? null : (editLegalAddress || null),
                bankAccount: isEditFiz ? null : (editBankAccount || null),
                notes: editNotes || null,
              }
            : c
        )
      );
      setActiveClient((prev) =>
        prev
          ? {
              ...prev,
              name: editName,
              phone: editPhone,
              email: editEmail || null,
              companyName: isEditFiz ? null : (editCompanyName || null),
              binIin: isEditFiz ? null : (editBinIin || null),
              contractNum: isEditFiz ? null : (editContractNum || null),
              legalAddress: isEditFiz ? null : (editLegalAddress || null),
              bankAccount: isEditFiz ? null : (editBankAccount || null),
              notes: editNotes || null,
            }
          : null
      );
    } else {
      toast.error(res.error || "Не удалось сохранить изменения");
    }
    setIsSaving(false);
  };

  const handleDeleteConfirm = async () => {
    if (!clientToDeleteId) return;
    
    triggerHaptic("success");
    const res = await deleteClient(clientToDeleteId);

    if (res.success) {
      toast.success("Клиент удален из базы");
      setClients((prev) => prev.filter((c) => c.id !== clientToDeleteId));
      if (activeClient && activeClient.id === clientToDeleteId) {
        setActiveClient(null);
      }
      setShowDeleteConfirm(false);
      setClientToDeleteId(null);
    } else {
      toast.error(res.error || "Не удалось удалить клиента");
    }
  };

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const term = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(term) ||
        c.phone.includes(term) ||
        (c.companyName && c.companyName.toLowerCase().includes(term)) ||
        (c.binIin && c.binIin.includes(term))
      );
    });
  }, [clients, searchTerm]);

  return (
    <div className="space-y-6 select-none">
      {/* Панель быстрого действия страницы Клиентов */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-orange-500" />
          База Клиентов и Контрагентов
        </h2>
        
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              triggerHaptic("light");
              setShowBatchImportModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer active:scale-95 shadow-2xs"
            title="Импорт контактов из списка/Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-purple-600" />
            <span>Импорт базы</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic("light");
              setShowExportAudienceModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer active:scale-95 shadow-2xs"
            title="Экспорт аудиторий для Facebook/Yandex"
          >
            <Target className="w-4 h-4 text-emerald-600" />
            <span>Экспорт аудиторий</span>
          </button>

          <Button 
            onClick={() => { triggerHaptic("light"); setShowCreateModal(true); }}
            variant="solid"
            leftIcon={<Plus className="w-4 h-4" />}
            className="text-xs font-black py-2.5 shadow-sm shadow-orange-500/10"
          >
            {crmDict.clients.newClientBtn}
          </Button>
        </div>
      </div>

      {/* ── ОСНОВНОЙ КОНТЕНТ ── */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* ЛЕВАЯ ЧАСТЬ: СПИСОК КЛИЕНТОВ И ПОИСК */}
        <div className="w-full lg:flex-1 space-y-4">
          
          {/* Поиск */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={crmDict.clients.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/10 text-sm transition"
              />
            </div>
          </div>

          {/* Список клиентов */}
          <div className="space-y-3">
            {filteredClients.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400 font-semibold">
                {crmDict.clients.notFound}
              </div>
            ) : (
              filteredClients.map((client) => {
                const isSelected = activeClient?.id === client.id;

                return (
                  <motion.div
                    layoutId={`client-card-${client.id}`}
                    key={client.id}
                    onClick={() => { triggerHaptic("light"); setActiveClient(client); }}
                    className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isSelected 
                        ? "bg-orange-50/40 border-orange-300 shadow-md shadow-orange-500/5" 
                        : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base truncate">{client.name}</h3>
                          {client.companyName && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-slate-200 text-slate-500 bg-slate-50">
                              {client.companyName}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-slate-500 text-sm flex items-center gap-1.5 font-medium">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {client.phone}
                        </p>
                      </div>

                      <div className="text-right shrink-0 flex flex-col items-end gap-2">
                        <span className="text-[10px] text-slate-400 font-bold px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-slate-500" /> {client.leads?.length || 0}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerHaptic("light");
                            setClientToDeleteId(client.id);
                            setShowDeleteConfirm(true);
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Удалить клиента"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* ── ПРАВАЯ ЧАСТЬ: ДЕТАЛЬНАЯ КАРТОЧКА КЛИЕНТА ── */}
        <AnimatePresence>
          {activeClient && (
            <motion.aside
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="w-full lg:w-[460px] bg-white rounded-3xl border border-slate-200 p-6 shadow-xl sticky top-8 space-y-5 overflow-y-auto max-h-[85vh] scrollbar-hide text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-lg font-black text-slate-900">{crmDict.clients.cardTitle}</h2>
                <button
                  onClick={() => setActiveClient(null)}
                  className="p-1 rounded-full text-slate-450 hover:bg-slate-100 cursor-pointer"
                  type="button"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                {/* ФИО и Контакты */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                      ФИО контакта *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 font-semibold focus:border-orange-500/50 focus:outline-none text-xs transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                      Телефон *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 font-semibold focus:border-orange-500/50 focus:outline-none text-xs transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Выбор типа клиента */}
                <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                  <button
                    type="button"
                    onClick={() => { triggerHaptic("light"); setEditClientType("FIZ"); }}
                    className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all ${
                      editClientType === "FIZ"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Физическое лицо
                  </button>
                  <button
                    type="button"
                    onClick={() => { triggerHaptic("light"); setEditClientType("YUR"); }}
                    className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all ${
                      editClientType === "YUR"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Юридическое лицо
                  </button>
                </div>

                {/* Email (всегда виден) */}
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 font-semibold focus:border-orange-500/50 focus:outline-none text-xs transition"
                      placeholder="client@mail.ru"
                    />
                  </div>
                </div>

                {/* Поля юридического лица */}
                <AnimatePresence initial={false}>
                  {editClientType === "YUR" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                          Компания (Организация)
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                          <input
                            type="text"
                            value={editCompanyName}
                            onChange={(e) => setEditCompanyName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 font-semibold focus:border-orange-500/50 focus:outline-none text-xs transition"
                            placeholder="ТОО Вектор"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                            БИН / ИИН
                          </label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input
                              type="text"
                              value={editBinIin}
                              onChange={(e) => setEditBinIin(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 font-semibold focus:border-orange-500/50 focus:outline-none text-xs transition"
                              placeholder="12-значный номер"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                            Номер договора
                          </label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input
                              type="text"
                              value={editContractNum}
                              onChange={(e) => setEditContractNum(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 font-semibold focus:border-orange-500/50 focus:outline-none text-xs transition"
                              placeholder="Д-45/26"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                          Юридический / Фактический адрес
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-400" />
                          <textarea
                            rows={2}
                            value={editLegalAddress}
                            onChange={(e) => setEditLegalAddress(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 font-medium focus:border-orange-500/50 focus:outline-none text-xs transition leading-relaxed"
                            placeholder="г. Астана, ул. Кабанбай Батыра, 17, офис 5"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                          Банковские реквизиты (Счет, БИК, Банк)
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-400" />
                          <textarea
                            rows={2}
                            value={editBankAccount}
                            onChange={(e) => setEditBankAccount(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 font-medium focus:border-orange-500/50 focus:outline-none text-xs transition leading-relaxed"
                            placeholder="KZ123456789012345678 в АО 'Kaspi Bank', БИК..."
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Заметки по клиенту */}
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                    Общие примечания и история взаимодействия
                  </label>
                  <textarea
                    rows={3}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700 font-medium focus:border-orange-500/50 focus:outline-none text-xs transition leading-relaxed"
                    placeholder="Важные детали о клиенте, его предпочтениях..."
                  />
                </div>

                {/* Кнопка отправки формы */}
                <Button
                  type="submit"
                  disabled={isSaving}
                  variant="solid"
                  className="w-full text-xs font-extrabold py-3 bg-gradient-to-r from-orange-600 to-red-600 shadow-md hover:from-orange-500 hover:to-red-500"
                >
                  {isSaving ? crmDict.clients.saving : crmDict.clients.saveChangesBtn}
                </Button>
              </form>

              {/* Связанные проекты */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Связанные проекты ({activeClient.leads?.length || 0})</span>
                {activeClient.leads?.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">Связанных проектов пока нет</p>
                ) : (
                  <div className="space-y-2">
                    {activeClient.leads.map((lead) => (
                      <div 
                        key={lead.id}
                        onClick={() => router.push(`/admin/leads?id=${lead.id}`)}
                        className="flex items-center justify-between p-3 bg-slate-50 hover:bg-orange-50/30 rounded-xl border border-slate-200/60 cursor-pointer group transition duration-200"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate group-hover:text-orange-600 transition-colors">
                            {lead.name}
                          </p>
                          <span className="text-[9px] text-slate-450" suppressHydrationWarning>
                            {new Date(lead.createdAt).toLocaleDateString("ru-RU")}
                          </span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* ── МОДАЛКА СОЗДАНИЯ КЛИЕНТА ВРУЧНУЮ ── */}
      {showCreateModal && typeof window !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Overlay с анимацией и блюром */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300"
            onClick={() => { triggerHaptic("light"); setShowCreateModal(false); }}
          />

          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className="w-full max-w-lg bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 p-8 shadow-apple-modal relative z-10 my-auto max-h-[90dvh] overflow-y-auto scrollbar-hide"
          >
            <button
              onClick={() => { triggerHaptic("light"); setShowCreateModal(false); }}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 rounded-full transition cursor-pointer active:scale-95 z-50"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 mb-1 tracking-tight">{crmDict.clients.createTitle}</h3>
            <p className="text-slate-500 text-xs mb-6 font-semibold">
              {crmDict.clients.createSubtitle}
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    ФИО Контакта *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-slate-50/60 border border-slate-200/80 rounded-xl py-2.5 px-3.5 text-slate-900 font-semibold focus:border-orange-500/50 focus:outline-none transition text-sm focus:ring-2 focus:ring-orange-500/10"
                    placeholder="Сергей Петров"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Телефон *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-50/60 border border-slate-200/80 rounded-xl py-2.5 px-3.5 text-slate-900 font-semibold focus:border-orange-500/50 focus:outline-none transition text-sm focus:ring-2 focus:ring-orange-500/10"
                    placeholder="+77071112233"
                  />
                </div>
              </div>

              {/* Выбор типа клиента */}
              <div className="flex bg-slate-100/70 p-1 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => { triggerHaptic("light"); setNewClientType("FIZ"); }}
                  className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    newClientType === "FIZ"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Физическое лицо
                </button>
                <button
                  type="button"
                  onClick={() => { triggerHaptic("light"); setNewClientType("YUR"); }}
                  className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    newClientType === "YUR"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Юридическое лицо
                </button>
              </div>

              {newClientType === "YUR" && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 pt-2 border-t border-slate-100/50"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Название компании
                      </label>
                      <input
                        type="text"
                        value={newCompanyName}
                        onChange={(e) => setNewCompanyName(e.target.value)}
                        className="w-full bg-slate-50/60 border border-slate-200/80 rounded-xl py-2.5 px-3.5 text-slate-900 font-semibold focus:border-orange-500/50 focus:outline-none transition text-sm focus:ring-2 focus:ring-orange-500/10"
                        placeholder="ТОО Вектор"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        БИН / ИИН
                      </label>
                      <input
                        type="text"
                        value={newBinIin}
                        onChange={(e) => setNewBinIin(e.target.value)}
                        className="w-full bg-slate-50/60 border border-slate-200/80 rounded-xl py-2.5 px-3.5 text-slate-900 font-semibold focus:border-orange-500/50 focus:outline-none transition text-sm focus:ring-2 focus:ring-orange-500/10"
                        placeholder="12-значный БИН"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Номер договора
                      </label>
                      <input
                        type="text"
                        value={newContractNum}
                        onChange={(e) => setNewContractNum(e.target.value)}
                        className="w-full bg-slate-50/60 border border-slate-200/80 rounded-xl py-2.5 px-3.5 text-slate-900 font-semibold focus:border-orange-500/50 focus:outline-none transition text-sm focus:ring-2 focus:ring-orange-500/10"
                        placeholder="№ 124-2026"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Банковский счет (IBAN)
                      </label>
                      <input
                        type="text"
                        value={newBankAccount}
                        onChange={(e) => setNewBankAccount(e.target.value)}
                        className="w-full bg-slate-50/60 border border-slate-200/80 rounded-xl py-2.5 px-3.5 text-slate-900 font-semibold focus:border-orange-500/50 focus:outline-none transition text-sm focus:ring-2 focus:ring-orange-500/10"
                        placeholder="KZ..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Юридический адрес
                    </label>
                    <input
                      type="text"
                      value={newLegalAddress}
                      onChange={(e) => setNewLegalAddress(e.target.value)}
                      className="w-full bg-slate-50/60 border border-slate-200/80 rounded-xl py-2.5 px-3.5 text-slate-900 font-semibold focus:border-orange-500/50 focus:outline-none transition text-sm focus:ring-2 focus:ring-orange-500/10"
                      placeholder="Адрес регистрации..."
                    />
                  </div>
                </motion.div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-slate-50/60 border border-slate-200/80 rounded-xl py-2.5 px-3.5 text-slate-900 font-semibold focus:border-orange-500/50 focus:outline-none transition text-sm focus:ring-2 focus:ring-orange-500/10"
                  placeholder="client@mail.ru"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Заметки / Примечания
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-50/60 border border-slate-200/80 rounded-xl p-3 text-slate-900 font-medium focus:border-orange-500/50 focus:outline-none transition text-sm focus:ring-2 focus:ring-orange-500/10 leading-relaxed"
                  placeholder="Особые условия, требования..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => { triggerHaptic("light"); setShowCreateModal(false); }}
                  variant="lightOutline"
                  className="flex-1 py-3 text-xs font-bold text-slate-650"
                >
                  {crmDict.clients.createModal.cancel}
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating}
                  variant="solid"
                  className="flex-1 py-3 text-xs font-extrabold bg-gradient-to-r from-orange-600 to-red-600 shadow-md"
                >
                  {isCreating ? crmDict.clients.createModal.creating : crmDict.clients.createModal.createBtn}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>,
        document.body
      )}

      {/* ── ПОДТВЕРЖДЕНИЕ УДАЛЕНИЯ КЛИЕНТА ── */}
      {showDeleteConfirm && typeof window !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300"
            onClick={() => { setShowDeleteConfirm(false); setClientToDeleteId(null); }}
          />

          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="w-full max-w-sm bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 p-6 shadow-apple-modal relative z-10 text-center animate-in fade-in zoom-in-95"
          >
            <h3 className="text-lg font-black text-slate-900 mb-2">{crmDict.clients.deleteConfirmTitle}</h3>
            <p className="text-slate-500 text-xs mb-6 font-medium">
              {crmDict.clients.deleteConfirmDesc}
              <br />
              <span className="text-slate-400 block mt-2 text-[10px]">
                {crmDict.clients.deleteNote}
              </span>
            </p>

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => { setShowDeleteConfirm(false); setClientToDeleteId(null); }}
                variant="lightOutline"
                className="flex-1 py-3 text-xs font-bold text-slate-650"
              >
                {crmDict.clients.cancel}
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                variant="secondary"
                className="flex-1 py-3 text-xs font-bold bg-rose-600 border-rose-500 text-white hover:bg-rose-700 shadow-lg shadow-rose-500/10 hover:shadow-rose-500/20 active:scale-95"
              >
                {crmDict.clients.delete}
              </Button>
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* ── МОДАЛКА МАССОВОГО ИМПОРТА КЛИЕНТСКОЙ БАЗЫ ── */}
      <BatchImportClientsModal
        isOpen={showBatchImportModal}
        onClose={() => setShowBatchImportModal(false)}
        onSuccess={() => {
          router.refresh();
        }}
      />

      {/* ── МОДАЛКА ЭКСПОРТА АУДИТОРИЙ (LOOKALIKE / РЕТАРГЕТИНГ) ── */}
      <ExportAudienceModal
        isOpen={showExportAudienceModal}
        onClose={() => setShowExportAudienceModal(false)}
      />

    </div>
  );
}
