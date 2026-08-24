"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { LeadStatus, ClientRating, FileCategory } from "@prisma/client";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { uploadFileToR2 } from "@/lib/upload";
import { 
  updateLeadMainData, 
  addLeadActivity, 
  deleteLeadActivity, 
  saveLeadFileRecord, 
  deleteLeadFile
} from "../../[id]/actions";
import { convertLeadToProjectAndCompany } from "../../actions";
import { linkLeadToClient, createClientFromLead } from "../../../clients/actions";
import { DetailTabType } from "../../_data/leadDetailDictionary";
import { 
  LeadFullDetails, 
  LeadTechSpec, 
  LeadChecklistState, 
  LeadFileItem, 
  LeadActivityItem 
} from "../../_types/leadDetailTypes";

interface UseLeadDetailStateProps {
  lead: LeadFullDetails;
  onUpdateLead?: (updated: LeadFullDetails) => void;
  onClose: () => void;
  clients?: any[];
  companies?: any[];
}

export function useLeadDetailState({ lead, onUpdateLead, onClose, clients = [], companies = [] }: UseLeadDetailStateProps) {
  const [activeTab, setActiveTab] = useState<DetailTabType>("params");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Основные поля
  const [client, setClient] = useState<any>(lead.client || null);
  const [rating, setRating] = useState<ClientRating>(lead.rating || "STANDARD");
  const [status, setStatus] = useState<LeadStatus>(lead.status || "NEW");
  const [name, setName] = useState(lead.name || "");
  const [phone, setPhone] = useState(lead.phone || "");
  const [address, setAddress] = useState(lead.address || "");
  const [comment, setComment] = useState(lead.comment || "");
  const [manager, setManager] = useState<string>(lead.manager || "");

  const appDateStr = lead.appointmentDate ? new Date(lead.appointmentDate).toISOString().slice(0, 16) : "";
  const [appDate, setAppDate] = useState(appDateStr);

  const deadlineStr = lead.deadline ? new Date(lead.deadline).toISOString().slice(0, 10) : "";
  const [deadline, setDeadline] = useState(deadlineStr);

  const [offeredPrice, setOfferedPrice] = useState(
    lead.offeredPrice !== undefined && lead.offeredPrice !== null ? String(lead.offeredPrice) : ""
  );
  const [isDiscounted, setIsDiscounted] = useState(Boolean(lead.isDiscounted));
  const [prepayment, setPrepayment] = useState(
    lead.prepayment !== undefined && lead.prepayment !== null ? String(lead.prepayment) : ""
  );
  const [isPrepaymentPaid, setIsPrepaymentPaid] = useState(Boolean(lead.isPrepaymentPaid));
  const [isBalancePaid, setIsBalancePaid] = useState(Boolean(lead.isBalancePaid));

  // Парсинг кастомных деталей (TechSpec, Checklist, Причина отказа) из calcDetails
  const parsedMeta = (() => {
    try {
      if (lead.calcDetails && lead.calcDetails.startsWith("{")) {
        return JSON.parse(lead.calcDetails);
      }
    } catch {}
    return {};
  })();

  const [techSpec, setTechSpec] = useState<LeadTechSpec>(
    lead.techSpec || parsedMeta.techSpec || { signTypes: [] }
  );
  const [checklist, setChecklist] = useState<LeadChecklistState>(
    lead.checklist || parsedMeta.checklist || {}
  );
  const [cancellationReason, setCancellationReason] = useState<string>(
    lead.cancellationReason || parsedMeta.cancellationReason || ""
  );

  // Файлы и активности
  const [files, setFiles] = useState<LeadFileItem[]>(lead?.files || []);
  const [activities, setActivities] = useState<LeadActivityItem[]>(lead?.activities || []);
  const [isUploading, setIsUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [viewerFile, setViewerFile] = useState<LeadFileItem | null>(null);
  const lastLeadIdRef = useRef<string | null>(lead?.id || null);

  // Синхронизация при смене входящего лида (сброс вкладки на первую дефолтную)
  useEffect(() => {
    if (!lead) return;

    if (lastLeadIdRef.current !== lead.id) {
      lastLeadIdRef.current = lead.id;
      setActiveTab("params");
    }

    setClient(lead.client || null);
    setRating(lead.rating || "STANDARD");
    setStatus(lead.status || "NEW");
    setName(lead.name || "");
    setPhone(lead.phone || "");
    setAddress(lead.address || "");
    setComment(lead.comment || "");
    setManager(lead.manager || "");
    setAppDate(lead.appointmentDate ? new Date(lead.appointmentDate).toISOString().slice(0, 16) : "");
    setDeadline(lead.deadline ? new Date(lead.deadline).toISOString().slice(0, 10) : "");
    setOfferedPrice(lead.offeredPrice !== undefined && lead.offeredPrice !== null ? String(lead.offeredPrice) : "");
    setIsDiscounted(Boolean(lead.isDiscounted));
    setPrepayment(lead.prepayment !== undefined && lead.prepayment !== null ? String(lead.prepayment) : "");
    setIsPrepaymentPaid(Boolean(lead.isPrepaymentPaid));
    setIsBalancePaid(Boolean(lead.isBalancePaid));

    try {
      if (lead.calcDetails && typeof lead.calcDetails === "string" && lead.calcDetails.startsWith("{")) {
        const p = JSON.parse(lead.calcDetails);
        setTechSpec(p.techSpec || { signTypes: [] });
        setChecklist(p.checklist || {});
        setCancellationReason(p.cancellationReason || "");
      }
    } catch {}

    setFiles(lead.files || []);
    setActivities(lead.activities || []);
  }, [lead]);

  // Универсальное фоновое автосохранение полей лида
  const autoSaveLead = async (overrides?: any) => {
    setSaveStatus("saving");

    const targetRating = overrides?.rating !== undefined ? overrides.rating : rating;
    const targetStatus = overrides?.status !== undefined ? overrides.status : status;
    const targetName = overrides?.name !== undefined ? overrides.name : name;
    const targetPhone = overrides?.phone !== undefined ? overrides.phone : phone;
    const targetAddress = overrides?.address !== undefined ? overrides.address : address;
    const targetComment = overrides?.comment !== undefined ? overrides.comment : comment;
    const targetManager = overrides?.manager !== undefined ? overrides.manager : manager;
    const targetAppDate = overrides?.appDate !== undefined ? overrides.appDate : appDate;
    const targetDeadline = overrides?.deadline !== undefined ? overrides.deadline : deadline;
    const targetOfferedPrice = overrides?.offeredPrice !== undefined ? overrides.offeredPrice : offeredPrice;
    const targetIsDiscounted = overrides?.isDiscounted !== undefined ? overrides.isDiscounted : isDiscounted;
    const targetPrepayment = overrides?.prepayment !== undefined ? overrides.prepayment : prepayment;
    const targetIsPrepaymentPaid = overrides?.isPrepaymentPaid !== undefined ? overrides.isPrepaymentPaid : isPrepaymentPaid;
    const targetIsBalancePaid = overrides?.isBalancePaid !== undefined ? overrides.isBalancePaid : isBalancePaid;
    const targetTechSpec = overrides?.techSpec !== undefined ? overrides.techSpec : techSpec;
    const targetChecklist = overrides?.checklist !== undefined ? overrides.checklist : checklist;
    const targetCancellationReason = overrides?.cancellationReason !== undefined ? overrides.cancellationReason : cancellationReason;

    const calcDetailsPayload = JSON.stringify({
      techSpec: targetTechSpec,
      checklist: targetChecklist,
      cancellationReason: targetCancellationReason,
      originalMessage: lead.message,
    });

    const payload = {
      name: (targetName || "").trim(),
      phone: (targetPhone || "").trim(),
      address: (targetAddress || "").trim() || null,
      comment: (targetComment || "").trim() || null,
      manager: targetManager || null,
      rating: targetRating,
      status: targetStatus,
      appointmentDate: targetAppDate ? new Date(targetAppDate).toISOString() : null,
      deadline: targetDeadline ? new Date(targetDeadline).toISOString() : null,
      offeredPrice: targetOfferedPrice ? parseFloat(targetOfferedPrice) : null,
      isDiscounted: targetIsDiscounted,
      prepayment: targetPrepayment ? parseFloat(targetPrepayment) : 0,
      isPrepaymentPaid: targetIsPrepaymentPaid,
      isBalancePaid: targetIsBalancePaid,
      calcDetails: calcDetailsPayload,
    };

    try {
      const res = await updateLeadMainData(lead.id, JSON.stringify(payload));
      if (res.error) {
        setSaveStatus("error");
        toast.error(res.error);
      } else {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2500);

        if (overrides?.appDate !== undefined) setAppDate(overrides.appDate || "");
        if (overrides?.deadline !== undefined) setDeadline(overrides.deadline || "");
        if (overrides?.manager !== undefined) setManager(overrides.manager || "");
        if (overrides?.name !== undefined) setName(overrides.name || "");
        if (overrides?.phone !== undefined) setPhone(overrides.phone || "");
        if (overrides?.address !== undefined) setAddress(overrides.address || "");

        if (onUpdateLead) {
          onUpdateLead({
            ...lead,
            ...payload,
            appointmentDate: payload.appointmentDate,
            deadline: payload.deadline,
            techSpec: targetTechSpec,
            checklist: targetChecklist,
            cancellationReason: targetCancellationReason,
            files,
            activities,
          });
        }
      }
    } catch {
      setSaveStatus("error");
    }
  };

  // Сохранение всех данных карточки (совместимость)
  const handleSave = async (customRating?: ClientRating, customStatus?: LeadStatus) => {
    await autoSaveLead({ rating: customRating, status: customStatus });
  };

  // Переключение чек-листа с моментальным автосохранением
  const handleToggleChecklistItem = async (itemId: string) => {
    triggerHaptic("light");
    const next = { ...checklist, [itemId]: !checklist[itemId] };
    setChecklist(next);
    await autoSaveLead({ checklist: next });
  };

  // Быстрая смена статуса в шапке
  const handleStatusChange = async (newStatus: LeadStatus) => {
    setStatus(newStatus);
    await autoSaveLead({ status: newStatus });
  };

  // Быстрая смена рейтинга в шапке
  const handleRatingChange = async (newRating: ClientRating) => {
    setRating(newRating);
    await autoSaveLead({ rating: newRating });
  };

  // Загрузка файлов в R2
  const handleUploadFiles = async (e: React.ChangeEvent<HTMLInputElement>, category: FileCategory) => {
    const filesList = e.target.files;
    if (!filesList || filesList.length === 0) return;

    setIsUploading(true);
    triggerHaptic("medium");

    try {
      for (let i = 0; i < filesList.length; i++) {
        const file = filesList[i];
        const uploadRes = await uploadFileToR2(file, "leads");
        if (uploadRes.error || !uploadRes.publicUrl) {
          toast.error(uploadRes.error || "Ошибка загрузки файла в R2");
          continue;
        }

        const saveRes = await saveLeadFileRecord(lead.id, {
          name: file.name,
          url: uploadRes.publicUrl,
          fileKey: uploadRes.fileKey || file.name,
          size: file.size,
          mimeType: file.type || "application/octet-stream",
          category,
        });

        if (saveRes.data) {
          const uploadedFile = saveRes.data;
          setFiles((prev) => [uploadedFile, ...prev]);
        }
      }
      toast.success("Файлы успешно загружены в хранилище!");
    } catch (err: any) {
      toast.error(err.message || "Ошибка загрузки");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  // Удаление файла
  const handleDeleteFile = async (fileId: string) => {
    const fileItem = files.find((f) => f.id === fileId);
    const fileName = fileItem?.name || "файл";
    toast.confirm({
      title: `Удалить «${fileName}»?`,
      message: "Файл будет удален из облачного хранилища без возможности восстановления.",
      confirmText: "Да, удалить",
      cancelText: "Отмена",
      isDestructive: true,
      onConfirm: async () => {
        const res = await deleteLeadFile(fileId, lead.id);
        if (res.error) {
          toast.error(res.error);
        } else {
          setFiles((prev) => prev.filter((f) => f.id !== fileId));
          toast.success("Файл удален");
        }
      },
    });
  };

  // Добавление заметки в таймлайн
  const handleAddNote = async (text: string) => {
    setIsAddingNote(true);
    const res = await addLeadActivity(lead.id, text, "NOTE", manager || "Менеджер");
    setIsAddingNote(false);

    if (res.error) {
      toast.error(res.error);
    } else if (res.data) {
      setActivities((prev) => [res.data, ...prev]);
      toast.success("Заметка добавлена в историю");
    }
  };

  // Удаление заметки
  const handleDeleteActivity = async (activityId: string) => {
    toast.confirm({
      title: "Удалить запись из истории?",
      message: "Заметка будет безвозвратно удалена из таймлайна сделки.",
      confirmText: "Да, удалить",
      cancelText: "Отмена",
      isDestructive: true,
      onConfirm: async () => {
        const res = await deleteLeadActivity(activityId, lead.id);
        if (res.error) {
          toast.error(res.error);
        } else {
          setActivities((prev) => prev.filter((a) => a.id !== activityId));
          toast.success("Запись удалена");
        }
      },
    });
  };

  // Привязка лида к клиенту
  const handleLinkLeadToClient = async (clientId: string | null) => {
    triggerHaptic("light");
    const res = await linkLeadToClient(lead.id, clientId);
    if (res.success) {
      toast.success(clientId ? "Клиент успешно привязан" : "Клиент отвязан");
      const clientObj = clientId && clients ? clients.find((c: any) => c.id === clientId) || null : null;
      setClient(clientObj);
      if (onUpdateLead) {
        onUpdateLead({
          ...lead,
          clientId,
          client: clientObj,
        });
      }
    } else {
      toast.error(res.error || "Ошибка привязки");
    }
  };

  // Создание клиента из лида
  const handleCreateClientFromLead = async () => {
    triggerHaptic("success");
    const res = await createClientFromLead(lead.id);
    if (res.success && res.clientId) {
      toast.success("Клиент создан и привязан!");
      const newClientObj = {
        id: res.clientId,
        name: lead.name,
        phone: lead.phone,
        companyName: null,
      };
      setClient(newClientObj);
      if (onUpdateLead) {
        onUpdateLead({
          ...lead,
          clientId: res.clientId,
          client: newClientObj,
        });
      }
    } else {
      toast.error(res.error || "Не удалось создать клиента");
    }
  };

  // Конвертация в компанию и проект
  const handleConvertToCompanyAndProject = async (
    companyName: string,
    binIin: string,
    contactPosition: string,
    projectTitle: string
  ) => {
    triggerHaptic("success");
    const res = await convertLeadToProjectAndCompany(lead.id, {
      companyName,
      binIin,
      contactPosition,
      projectTitle,
    });
    if (res.success) {
      toast.success("Лид успешно квалифицирован в Проект!");
      setStatus(LeadStatus.PROCESSED);
      if (onUpdateLead) {
        onUpdateLead({
          ...lead,
          status: LeadStatus.PROCESSED,
        });
      }
      return { success: true };
    } else {
      toast.error(res.error || "Ошибка при квалификации");
      return { success: false, error: res.error };
    }
  };

  return {
    activeTab,
    setActiveTab,
    isEditing,
    setIsEditing,
    isSaving,
    isPending,
    client,
    clients,
    companies,
    rating,
    status,
    name,
    setName,
    phone,
    setPhone,
    address,
    setAddress,
    appDate,
    setAppDate,
    deadline,
    setDeadline,
    manager,
    setManager,
    offeredPrice,
    setOfferedPrice,
    isDiscounted,
    setIsDiscounted,
    prepayment,
    setPrepayment,
    isPrepaymentPaid,
    setIsPrepaymentPaid,
    isBalancePaid,
    setIsBalancePaid,
    comment,
    setComment,
    techSpec,
    setTechSpec,
    checklist,
    cancellationReason,
    setCancellationReason,
    files,
    activities,
    isUploading,
    isAddingNote,
    viewerFile,
    setViewerFile,
    saveStatus,
    autoSaveLead,
    handleSave,
    handleStatusChange,
    handleRatingChange,
    handleToggleChecklistItem,
    handleUploadFiles,
    handleDeleteFile,
    handleAddNote,
    handleDeleteActivity,
    handleLinkLeadToClient,
    handleCreateClientFromLead,
    handleConvertToCompanyAndProject,
  };
}
