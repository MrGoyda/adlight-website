"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClientRating, FileCategory, LeadStatus, PartnerName } from "@prisma/client";
import { ArrowLeft, MessageCircle, Calculator } from "lucide-react";
import Button from "@/components/ui/Button";
import { triggerHaptic } from "@/lib/haptics";
import { uploadFileToR2 } from "@/lib/upload";
import { crmDict } from "@/dictionaries/crm";
import { RATING_CONFIG } from "./config";
import LeadRatingSelector from "./LeadRatingSelector";
import LeadFilesManager from "./LeadFilesManager";
import LeadTimeline from "./LeadTimeline";
import LeadParamsSidebar from "./LeadParamsSidebar";
import MediaViewerModal from "./MediaViewerModal";
import CrmBreadcrumbs from "@/components/ui/CrmBreadcrumbs";
import EstimateModal from "../../_components/EstimateModal";
import { toast } from "@/lib/toast";
import { 
  updateLeadMainData, 
  addLeadActivity, 
  updateLeadActivity, 
  deleteLeadActivity, 
  saveLeadFileRecord, 
  deleteLeadFile 
} from "../actions";

interface LeadFileItem {
  id: string;
  name: string;
  url: string;
  fileKey: string;
  size: number;
  mimeType: string;
  category: FileCategory;
  createdAt: string;
}

interface LeadActivityItem {
  id: string;
  createdAt: string;
  text: string;
  author: string | null;
  type: string;
}

interface LeadData {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  message: string | null;
  calcDetails: string | null;
  status: LeadStatus;
  rating: ClientRating;
  comment: string | null;
  source: string | null;
  address: string | null;
  appointmentDate: string | null;
  deadline: string | null;
  manager: PartnerName | null;
  offeredPrice?: number | null;
  isDiscounted?: boolean;
  revenue: number;
  expenses: number;
  prepayment: number;
  isPrepaymentPaid: boolean;
  isBalancePaid: boolean;
  client: any | null;
  companyId?: string | null;
  projectId?: string | null;
  contactId?: string | null;
  files: LeadFileItem[];
  activities: LeadActivityItem[];
  estimate?: any | null;
}

interface LeadDetailPageProps {
  lead: LeadData;
  companies?: any[];
  warehouseItems?: any[];
  supplierPrices?: any[];
}

export default function LeadDetailPage({ 
  lead, 
  companies = [],
  warehouseItems = [],
  supplierPrices = []
}: LeadDetailPageProps) {
  const router = useRouter();

  // Модалка сметы
  const [showEstimateModal, setShowEstimateModal] = useState(false);

  // Состояния формы
  const [rating, setRating] = useState<ClientRating>(lead.rating || "STANDARD");
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [name, setName] = useState(lead.name);
  const [phone, setPhone] = useState(lead.phone);
  const [address, setAddress] = useState(lead.address || "");
  const [comment, setComment] = useState(lead.comment || "");
  const [manager, setManager] = useState<PartnerName | "">(lead.manager || "");
  
  const appDateStr = lead.appointmentDate ? new Date(lead.appointmentDate).toISOString().slice(0, 16) : "";
  const [appDate, setAppDate] = useState(appDateStr);

  const deadlineStr = lead.deadline ? new Date(lead.deadline).toISOString().slice(0, 10) : "";
  const [deadline, setDeadline] = useState(deadlineStr);

  const [offeredPrice, setOfferedPrice] = useState(lead.offeredPrice !== undefined && lead.offeredPrice !== null ? String(lead.offeredPrice) : "");
  const [isDiscounted, setIsDiscounted] = useState(Boolean(lead.isDiscounted));

  const [companyId, setCompanyId] = useState(lead.companyId || "");
  const [projectId, setProjectId] = useState(lead.projectId || "");

  const [isSaving, setIsSaving] = useState(false);
  
  // Таймлайн
  const [newNoteText, setNewNoteText] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Файлы R2 & Просмотрщик
  const [selectedCategory, setSelectedCategory] = useState<FileCategory>("MEASUREMENT");
  const [isUploading, setIsUploading] = useState(false);
  const [viewerFileId, setViewerFileId] = useState<string | null>(null);

  // Быстрое сохранение реквизитов и полей
  const handleSaveMainData = async (newRating?: ClientRating, newStatus?: LeadStatus) => {
    setIsSaving(true);
    triggerHaptic("success");

    const formatSafeDate = (val: string) => {
      if (!val || !val.trim()) return null;
      const parsed = new Date(val);
      return isNaN(parsed.getTime()) ? null : parsed.toISOString();
    };

    const targetRating = newRating || rating;
    const targetStatus = newStatus || status;

    const res = await updateLeadMainData(lead.id, JSON.stringify({
      name,
      phone,
      status: targetStatus,
      rating: targetRating,
      address,
      comment,
      appointmentDate: formatSafeDate(appDate),
      deadline: formatSafeDate(deadline),
      manager: (manager as PartnerName) || null,
      offeredPrice: offeredPrice ? parseFloat(offeredPrice) : null,
      isDiscounted: isDiscounted,
      companyId: companyId || null,
      projectId: projectId || null,
    }));

    if (res.success) {
      if (newRating) setRating(newRating);
      if (newStatus) setStatus(newStatus);
      toast.success(crmDict.leadDetail.savedSuccess);
      router.refresh();
    } else {
      toast.error(res.error || crmDict.leadDetail.saveError);
    }
    setIsSaving(false);
  };

  // Добавление записи в хронологию
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    setIsAddingNote(true);
    triggerHaptic("success");

    const res = await addLeadActivity(lead.id, newNoteText);
    if (res.success) {
      setNewNoteText("");
      toast.success(crmDict.leadDetail.noteAddedSuccess);
      router.refresh();
    } else {
      toast.error(res.error || crmDict.leadDetail.noteAddError);
    }
    setIsAddingNote(false);
  };

  // Редактирование заметки
  const handleUpdateNote = async (activityId: string, text: string): Promise<boolean> => {
    triggerHaptic("success");
    const res = await updateLeadActivity(activityId, text, lead.id);
    if (res.success) {
      toast.success(crmDict.leadDetail.noteUpdatedSuccess);
      router.refresh();
      return true;
    } else {
      toast.error(res.error || crmDict.leadDetail.noteUpdateError);
      return false;
    }
  };

  // Удаление заметки из хронологии
  const handleDeleteNote = async (activityId: string) => {
    triggerHaptic("light");
    const res = await deleteLeadActivity(activityId, lead.id);
    if (res.success) {
      toast.success(crmDict.leadDetail.noteDeletedSuccess);
      router.refresh();
    } else {
      toast.error(res.error || crmDict.leadDetail.noteDeleteError);
    }
  };

  // Загрузка файла в Cloudflare R2
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    triggerHaptic("light");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const folder = selectedCategory === "MEASUREMENT" ? "portfolio" : "documents";
      const uploadRes = await uploadFileToR2(file, folder);

      if (uploadRes.success && uploadRes.publicUrl && uploadRes.fileKey) {
        await saveLeadFileRecord(lead.id, {
          name: file.name,
          url: uploadRes.publicUrl,
          fileKey: uploadRes.fileKey,
          size: file.size,
          mimeType: file.type || "application/octet-stream",
          category: selectedCategory,
        });
        toast.success(crmDict.leadDetail.fileUploadedSuccess);
      } else {
        toast.error(`${crmDict.leadDetail.fileUploadError}: ${file.name}`);
      }
    }

    setIsUploading(false);
    triggerHaptic("success");
    router.refresh();
    e.target.value = "";
  };

  // Удаление файла
  const handleDeleteFile = async (fileId: string) => {
    triggerHaptic("light");
    const res = await deleteLeadFile(fileId, lead.id);
    if (res.success) {
      toast.success(crmDict.leadDetail.fileDeletedSuccess);
      router.refresh();
    } else {
      toast.error(res.error || crmDict.leadDetail.fileDeleteError);
    }
  };

  const ratingObj = RATING_CONFIG[rating] || RATING_CONFIG.STANDARD;
  const RatingIcon = ratingObj.icon;

  const activeCompanyObj = companies.find((c: any) => c.id === companyId);
  const activeProjectObj = activeCompanyObj?.projects?.find((p: any) => p.id === projectId);

  return (
    <div className="space-y-6 select-none">
      
      {/* ХЛЕБНЫЕ КРОШКИ НАВИГАЦИИ */}
      <CrmBreadcrumbs
        items={[
          { label: "Заявки", href: "/admin/leads" },
          ...(activeCompanyObj ? [{ label: `Компания ${activeCompanyObj.name}`, href: "/admin/companies" }] : []),
          ...(activeProjectObj ? [{ label: `Проект: ${activeProjectObj.title}`, href: `/admin/projects/${activeProjectObj.id}` }] : []),
          { label: `Заявка #${lead.id.slice(0, 8)}` }
        ]}
      />

      {/* ── ШАПКА ДЕТАЛЬНОЙ СТРАНИЦЫ ── */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => { triggerHaptic("light"); router.push("/admin/leads"); }}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer active:scale-95 shrink-0"
            title={crmDict.leadDetail.backToLeads}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">
                {crmDict.leadDetail.projectNumber}{lead.id.slice(0, 8)}
              </span>
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${ratingObj.bg} ${ratingObj.color} ${ratingObj.border} flex items-center gap-1.5`}>
                <RatingIcon className="w-3.5 h-3.5" />
                {ratingObj.label}
              </span>
              {activeCompanyObj && (
                <button
                  onClick={() => router.push("/admin/companies")}
                  className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-0.5 rounded-full border border-slate-200 transition cursor-pointer"
                >
                  🏢 {activeCompanyObj.name}
                </button>
              )}
              {activeProjectObj && (
                <button
                  onClick={() => router.push(`/admin/projects/${activeProjectObj.id}`)}
                  className="text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200 transition cursor-pointer"
                >
                  📂 {activeProjectObj.title}
                </button>
              )}
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">{lead.name}</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => {
              triggerHaptic("light");
              setShowEstimateModal(true);
            }}
            variant="lightOutline"
            leftIcon={<Calculator className="w-4 h-4 text-purple-600" />}
            className="text-xs font-bold text-purple-700 border-purple-200 hover:bg-purple-50"
          >
            Смета / Расчет
          </Button>

          <a
            href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 font-extrabold text-xs hover:bg-emerald-100 transition active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-500 text-emerald-500" />
            {crmDict.leadDetail.whatsAppBtn}
          </a>

          <Button
            onClick={() => handleSaveMainData()}
            disabled={isSaving}
            variant="solid"
            className="text-xs font-extrabold py-2.5 px-6"
          >
            {isSaving ? crmDict.leadDetail.saving : crmDict.leadDetail.saveChangesBtn}
          </Button>
        </div>
      </div>

      {/* ── ОЦЕНКА КЛИЕНТА ── */}
      <LeadRatingSelector
        currentRating={rating}
        onSelectRating={(rKey) => handleSaveMainData(rKey)}
      />

      {/* ── ОСНОВНОЙ СЕТЧАТЫЙ МАКЕТ ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* ЛЕВАЯ КОЛОНКА (2/3): ФАЙЛЫ R2 И ХРОНОЛОГИЯ ЗАМЕТОК */}
        <div className="lg:col-span-2 space-y-8">
          
          <LeadFilesManager
            files={lead.files}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onFileUpload={handleFileUpload}
            onDeleteFile={handleDeleteFile}
            onOpenFile={(fId) => setViewerFileId(fId)}
            isUploading={isUploading}
          />

          <LeadTimeline
            activities={lead.activities}
            newNoteText={newNoteText}
            onNoteChange={setNewNoteText}
            onAddNote={handleAddNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
            isAddingNote={isAddingNote}
          />
        </div>

        {/* ПРАВАЯ КОЛОНКА (1/3): РЕКВИЗИТЫ И СМЕТА */}
        <div className="space-y-6">
          
          <LeadParamsSidebar
            leadId={lead.id}
            name={name}
            onNameChange={setName}
            phone={phone}
            onPhoneChange={setPhone}
            manager={manager}
            onManagerChange={setManager}
            companyId={companyId}
            onCompanyChange={setCompanyId}
            projectId={projectId}
            onProjectChange={setProjectId}
            companies={companies}
            address={address}
            onAddressChange={setAddress}
            appDate={appDate}
            onAppDateChange={setAppDate}
            deadline={deadline}
            onDeadlineChange={setDeadline}
            offeredPrice={offeredPrice}
            onOfferedPriceChange={setOfferedPrice}
            isDiscounted={isDiscounted}
            onIsDiscountedChange={setIsDiscounted}
            onSave={handleSaveMainData}
            isSaving={isSaving}
          />

          {/* КАРТОЧКА СМЕТЫ И ФИНАНСОВ */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 pb-3 border-b border-slate-100 uppercase tracking-wider">
              {crmDict.leadDetail.financeTitle}
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold">{crmDict.leadDetail.revenueLabel}</span>
                <span className="font-black text-slate-900">{lead.revenue.toLocaleString()} ₸</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold">{crmDict.leadDetail.expenseLabel}</span>
                <span className="font-bold text-slate-700">{lead.expenses.toLocaleString()} ₸</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100">
                <span className="text-slate-500 font-semibold">{crmDict.leadDetail.profitLabel}</span>
                <span className="font-black text-emerald-600 text-sm">
                  {(lead.revenue - lead.expenses).toLocaleString()} ₸
                </span>
              </div>
            </div>

            <Button
              onClick={() => router.push(`/admin/leads?id=${lead.id}`)}
              variant="lightOutline"
              className="w-full text-xs font-bold py-2.5 border-slate-200 hover:border-orange-500/20"
            >
              {crmDict.leadDetail.openKanbanBtn}
            </Button>
          </div>
        </div>
      </div>

      {/* ── ПОЛНОЭКРАННЫЙ МУЛЬТИМЕДИА & DOCS ПРОСМОТРЩИК ── */}
      {viewerFileId && (
        <MediaViewerModal
          isOpen={Boolean(viewerFileId)}
          onClose={() => setViewerFileId(null)}
          files={lead.files}
          initialFileId={viewerFileId}
        />
      )}

      {/* ── МОДАЛКА КАЛЬКУЛЯТОРА СМЕТЫ ── */}
      {showEstimateModal && (
        <EstimateModal
          isOpen={showEstimateModal}
          onClose={() => setShowEstimateModal(false)}
          leadId={lead.id}
          leadName={lead.name}
          initialItems={lead.estimate?.items || []}
          isStockDeducted={Boolean(lead.estimate?.isStockDeducted)}
          warehouseItems={warehouseItems}
          supplierPrices={supplierPrices}
          onSaveSuccess={() => {
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
