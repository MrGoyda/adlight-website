"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LeadStatus, PartnerName } from "@prisma/client";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { 
  updateLeadStatus, 
  closeLeadWithFinance, 
  createLeadManual, 
  updateLeadDetails, 
  deleteLead, 
  convertLeadToProjectAndCompany 
} from "../actions";
import { linkLeadToClient, createClientFromLead } from "../../clients/actions";
import { Lead, Client } from "../_types/leadTypes";

interface UseLeadOperationsProps {
  initialLeads: Lead[];
  initialClients: Client[];
  selectedLeadId?: string;
}

export function useLeadOperations({
  initialLeads,
  initialClients,
  selectedLeadId,
}: UseLeadOperationsProps) {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  // Состояния для модалки закрытия сделки с финансами
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const [financeLead, setFinanceLead] = useState<Lead | null>(null);
  const [isFinancing, setIsFinancing] = useState(false);

  // Состояния для ручного создания лида
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreatingLead, setIsCreatingLead] = useState(false);

  // Состояния для удаления лида
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [leadToDeleteId, setLeadToDeleteId] = useState<string | null>(null);

  // Состояния для редактирования полей в шторке
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [editComment, setEditComment] = useState("");
  const [editSource, setEditSource] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editAppDate, setEditAppDate] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editManager, setEditManager] = useState("");
  const [editOfferedPrice, setEditOfferedPrice] = useState("");
  const [editIsDiscounted, setEditIsDiscounted] = useState(false);
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
      setEditOfferedPrice(activeLead.offeredPrice !== undefined && activeLead.offeredPrice !== null ? String(activeLead.offeredPrice) : "");
      setEditIsDiscounted(Boolean(activeLead.isDiscounted));
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
      setEditOfferedPrice("");
      setEditIsDiscounted(false);
      setEditPrepayment("");
      setEditIsPrepaymentPaid(false);
      setEditIsBalancePaid(false);
    }
  }, [activeLead]);

  // Обработка перехода по ID лида из внешних ссылок
  useEffect(() => {
    if (selectedLeadId) {
      const found = leads.find((l) => l.id === selectedLeadId);
      if (found) {
        setActiveLead(found);
      }
    }
  }, [selectedLeadId, leads]);

  // Изменение статуса лида
  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    triggerHaptic("light");
    if (newStatus === "COMPLETED") {
      const targetLead = leads.find((l) => l.id === leadId);
      if (targetLead) {
        setFinanceLead(targetLead);
        setShowFinanceModal(true);
      }
      return;
    }

    const res = await updateLeadStatus(leadId, newStatus);
    if (res.success) {
      toast.success("Статус сделки обновлен");
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      );
      if (activeLead && activeLead.id === leadId) {
        setActiveLead((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } else {
      toast.error(res.error || "Не удалось обновить статус");
    }
  };

  // Завершение лида с финансами
  const handleFinanceSubmit = async (rev: number, exp: number) => {
    if (!financeLead) return;

    setIsFinancing(true);
    triggerHaptic("success");

    const res = await closeLeadWithFinance(
      financeLead.id,
      rev,
      exp,
      financeLead.prepayment || 0,
      financeLead.isPrepaymentPaid || false,
      financeLead.isBalancePaid || false
    );
    if (res.success) {
      toast.success("Сделка закрыта, финансы зафиксированы!");
      setLeads((prev) =>
        prev.map((l) =>
          l.id === financeLead.id
            ? { ...l, status: LeadStatus.COMPLETED, revenue: rev, expenses: exp }
            : l
        )
      );
      if (activeLead && activeLead.id === financeLead.id) {
        setActiveLead((prev) =>
          prev
            ? { ...prev, status: LeadStatus.COMPLETED, revenue: rev, expenses: exp }
            : null
        );
      }
      setShowFinanceModal(false);
      setFinanceLead(null);
    } else {
      toast.error(res.error || "Ошибка при сохранении финансов");
    }
    setIsFinancing(false);
  };

  // Ручное создание нового лида
  const handleCreateLeadSubmit = async (data: {
    name: string;
    phone: string;
    message: string;
    status: LeadStatus;
    comment: string;
    source: string;
    address: string;
    appointmentDate?: string;
    deadline?: string;
    manager: PartnerName | null;
  }) => {
    setIsCreatingLead(true);
    triggerHaptic("success");

    const res = await createLeadManual(data);

    if (res.success) {
      toast.success("Новая заявка успешно зарегистрирована!");
      router.refresh();
      setShowCreateModal(false);
    } else {
      toast.error(res.error || "Не удалось создать заявку");
    }
    setIsCreatingLead(false);
  };

  // Сохранение отредактированных полей
  const handleSaveLeadDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead) return;

    setIsSavingDetails(true);
    triggerHaptic("light");
    const prep = parseFloat(editPrepayment) || 0;
    const offeredPr = editOfferedPrice ? parseFloat(editOfferedPrice) : null;

    try {
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
        offeredPrice: offeredPr,
        isDiscounted: editIsDiscounted,
        prepayment: prep,
        isPrepaymentPaid: editIsPrepaymentPaid,
        isBalancePaid: editIsBalancePaid,
      });

      if (res.success) {
        toast.success("Данные заявки успешно сохранены");
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
                  manager: editManager || null,
                  offeredPrice: offeredPr,
                  isDiscounted: editIsDiscounted,
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
                address: editAddress,
                manager: editManager || null,
                appointmentDate: editAppDate ? new Date(editAppDate).toISOString() : null,
                deadline: editDeadline ? new Date(editDeadline).toISOString() : null,
                offeredPrice: offeredPr,
                isDiscounted: editIsDiscounted,
                prepayment: prep,
                comment: editComment,
                isPrepaymentPaid: editIsPrepaymentPaid,
                isBalancePaid: editIsBalancePaid,
              }
            : null
        );

        router.refresh();
      } else {
        toast.error(res.error || "Не удалось сохранить изменения");
      }
    } catch {
      toast.error("Сетевая ошибка при сохранении");
    }
    setIsSavingDetails(false);
  };

  // Удаление лида
  const handleDeleteClick = (leadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("light");
    setLeadToDeleteId(leadId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!leadToDeleteId) return;
    triggerHaptic("error");

    const res = await deleteLead(leadToDeleteId);
    if (res.success) {
      toast.success("Заявка успешно удалена");
      setLeads((prev) => prev.filter((l) => l.id !== leadToDeleteId));
      if (activeLead && activeLead.id === leadToDeleteId) {
        setActiveLead(null);
      }
      setShowDeleteConfirm(false);
      setLeadToDeleteId(null);
      router.refresh();
    } else {
      toast.error(res.error || "Не удалось удалить заявку");
    }
  };

  const handleRestoreLead = async (leadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("success");
    const res = await updateLeadStatus(leadId, LeadStatus.NEW);
    if (res.success) {
      toast.success("Заявка восстановлена в статус «Новый»!");
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: LeadStatus.NEW } : l))
      );
      if (activeLead && activeLead.id === leadId) {
        setActiveLead((prev) => (prev ? { ...prev, status: LeadStatus.NEW } : null));
      }
      router.refresh();
    } else {
      toast.error(res.error || "Не удалось восстановить заявку");
    }
  };

  // Привязка к клиенту
  const handleLinkLeadToClient = async (leadId: string, clientId: string | null) => {
    triggerHaptic("light");
    const res = await linkLeadToClient(leadId, clientId);
    if (res.success) {
      toast.success(clientId ? "Клиент успешно привязан" : "Клиент отвязан");
      const clientObj = clientId ? clients.find((c) => c.id === clientId) || null : null;
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, clientId, client: clientObj } : l))
      );
      if (activeLead && activeLead.id === leadId) {
        setActiveLead((prev) => (prev ? { ...prev, clientId, client: clientObj } : null));
      }
      router.refresh();
    } else {
      toast.error(res.error || "Ошибка привязки");
    }
  };

  const handleCreateClientFromLead = async (lead: Lead) => {
    triggerHaptic("success");
    const res = await createClientFromLead(lead.id);
    if (res.success && res.clientId) {
      toast.success("Клиент создан и привязан!");
      const newClientObj: Client = {
        id: res.clientId,
        name: lead.name,
        phone: lead.phone,
        companyName: null,
      } as Client;
      setClients((prev) => [newClientObj, ...prev]);
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, clientId: res.clientId, client: newClientObj } : l))
      );
      if (activeLead && activeLead.id === lead.id) {
        setActiveLead((prev) =>
          prev ? { ...prev, clientId: res.clientId, client: newClientObj } : null
        );
      }
      router.refresh();
    } else {
      toast.error(res.error || "Не удалось создать клиента");
    }
  };

  const handleConvertToCompanyAndProject = async (
    leadId: string,
    companyName: string,
    binIin: string,
    contactPosition: string,
    projectTitle: string
  ) => {
    triggerHaptic("success");
    const res = await convertLeadToProjectAndCompany(leadId, {
      companyName,
      binIin,
      contactPosition,
      projectTitle,
    });
    if (res.success) {
      toast.success("Лид успешно квалифицирован в Проект!");
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: LeadStatus.PROCESSED } : l))
      );
      if (activeLead && activeLead.id === leadId) {
        setActiveLead((prev) => (prev ? { ...prev, status: LeadStatus.PROCESSED } : null));
      }
      router.refresh();
      return { success: true };
    } else {
      toast.error(res.error || "Ошибка при квалификации");
      return { success: false, error: res.error };
    }
  };

  return {
    leads,
    setLeads,
    clients,
    setClients,
    activeLead,
    setActiveLead,
    // Модалка финансов
    showFinanceModal,
    setShowFinanceModal,
    financeLead,
    setFinanceLead,
    isFinancing,
    handleFinanceSubmit,
    // Модалка создания
    showCreateModal,
    setShowCreateModal,
    isCreatingLead,
    handleCreateLeadSubmit,
    // Модалка удаления
    showDeleteConfirm,
    setShowDeleteConfirm,
    leadToDeleteId,
    handleDeleteClick,
    handleDeleteConfirm,
    handleRestoreLead,
    // Форма шторки
    editName,
    setEditName,
    editPhone,
    setEditPhone,
    editAddress,
    setEditAddress,
    editManager,
    setEditManager,
    editAppDate,
    setEditAppDate,
    editDeadline,
    setEditDeadline,
    editOfferedPrice,
    setEditOfferedPrice,
    editIsDiscounted,
    setEditIsDiscounted,
    editPrepayment,
    setEditPrepayment,
    editComment,
    setEditComment,
    isSavingDetails,
    handleSaveLeadDetails,
    handleStatusChange,
    handleLinkLeadToClient,
    handleCreateClientFromLead,
    handleConvertToCompanyAndProject,
  };
}
