"use client";

import { useState, useTransition, useEffect } from "react";
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
}

export function useLeadDetailState({ lead, onUpdateLead, onClose }: UseLeadDetailStateProps) {
  const [activeTab, setActiveTab] = useState<DetailTabType>("params");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Основные поля
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
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [viewerFile, setViewerFile] = useState<LeadFileItem | null>(null);

  // Синхронизация при смене входящего лида
  useEffect(() => {
    if (!lead) return;
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

  // Сохранение всех данных карточки
  const handleSave = async (customRating?: ClientRating, customStatus?: LeadStatus) => {
    setIsSaving(true);
    triggerHaptic("success");

    const targetRating = customRating || rating;
    const targetStatus = customStatus || status;

    const calcDetailsPayload = JSON.stringify({
      techSpec,
      checklist,
      cancellationReason,
      originalMessage: lead.message,
    });

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim() || null,
      comment: comment.trim() || null,
      manager: manager || null,
      rating: targetRating,
      status: targetStatus,
      appointmentDate: appDate ? new Date(appDate).toISOString() : null,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      offeredPrice: offeredPrice ? parseFloat(offeredPrice) : null,
      isDiscounted,
      prepayment: prepayment ? parseFloat(prepayment) : 0,
      isPrepaymentPaid,
      isBalancePaid,
      calcDetails: calcDetailsPayload,
    };

    const res = await updateLeadMainData(lead.id, JSON.stringify(payload));
    setIsSaving(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Данные заявки сохранены!");
      setIsEditing(false);
      if (onUpdateLead) {
        onUpdateLead({
          ...lead,
          ...payload,
          appointmentDate: payload.appointmentDate,
          deadline: payload.deadline,
          techSpec,
          checklist,
          cancellationReason,
          files,
          activities,
        });
      }
    }
  };

  // Переключение чек-листа
  const handleToggleChecklistItem = async (itemId: string) => {
    triggerHaptic("light");
    const next = { ...checklist, [itemId]: !checklist[itemId] };
    setChecklist(next);

    // Фоновое автосохранение чек-листа
    const calcDetailsPayload = JSON.stringify({
      techSpec,
      checklist: next,
      cancellationReason,
      originalMessage: lead.message,
    });

    try {
      await updateLeadMainData(lead.id, JSON.stringify({ calcDetails: calcDetailsPayload }));
      if (onUpdateLead) {
        onUpdateLead({
          ...lead,
          checklist: next,
        });
      }
    } catch (err) {
      console.error("Failed to auto-save checklist:", err);
    }
  };

  // Быстрая смена статуса в шапке
  const handleStatusChange = (newStatus: LeadStatus) => {
    setStatus(newStatus);
    handleSave(rating, newStatus);
  };

  // Быстрая смена рейтинга в шапке
  const handleRatingChange = (newRating: ClientRating) => {
    setRating(newRating);
    handleSave(newRating, status);
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
          setFiles((prev) => {
            const nextFiles = [saveRes.data, ...prev];
            if (onUpdateLead) {
              onUpdateLead({
                ...lead,
                files: nextFiles,
              });
            }
            return nextFiles;
          });
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
    const res = await deleteLeadFile(fileId, lead.id);
    if (res.error) {
      toast.error(res.error);
    } else {
      setFiles((prev) => {
        const nextFiles = prev.filter((f) => f.id !== fileId);
        if (onUpdateLead) {
          onUpdateLead({
            ...lead,
            files: nextFiles,
          });
        }
        return nextFiles;
      });
      toast.success("Файл удален");
    }
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
    const res = await deleteLeadActivity(activityId, lead.id);
    if (res.error) {
      toast.error(res.error);
    } else {
      setActivities((prev) => prev.filter((a) => a.id !== activityId));
      toast.success("Запись удалена");
    }
  };

  return {
    activeTab,
    setActiveTab,
    isEditing,
    setIsEditing,
    isSaving,
    isPending,
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
    handleSave,
    handleStatusChange,
    handleRatingChange,
    handleToggleChecklistItem,
    handleUploadFiles,
    handleDeleteFile,
    handleAddNote,
    handleDeleteActivity,
  };
}
