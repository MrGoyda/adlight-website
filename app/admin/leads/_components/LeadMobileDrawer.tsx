"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { LeadStatus } from "@prisma/client";
import { triggerHaptic } from "@/lib/haptics";
import { LEADS_DICTIONARY } from "../_data/leadsDictionary";
import { Lead, Client, Company } from "../_types/leadTypes";
import DrawerHeader from "./drawer/DrawerHeader";
import DrawerClientSection from "./drawer/DrawerClientSection";
import DrawerParamsSection from "./drawer/DrawerParamsSection";
import DrawerFinancesSection from "./drawer/DrawerFinancesSection";
import DrawerLocationNotesSection from "./drawer/DrawerLocationNotesSection";
import DrawerCompanyConvertModal from "./drawer/DrawerCompanyConvertModal";

interface LeadMobileDrawerProps {
  activeLead: Lead | null;
  clients: Client[];
  companies?: Company[];
  editName: string;
  setEditName: (val: string) => void;
  editPhone: string;
  setEditPhone: (val: string) => void;
  editAddress: string;
  setEditAddress: (val: string) => void;
  editManager: string;
  setEditManager: (val: string) => void;
  editAppDate: string;
  setEditAppDate: (val: string) => void;
  editDeadline: string;
  setEditDeadline: (val: string) => void;
  editOfferedPrice: string;
  setEditOfferedPrice: (val: string) => void;
  editIsDiscounted: boolean;
  setEditIsDiscounted: (val: boolean) => void;
  editPrepayment: string;
  setEditPrepayment: (val: string) => void;
  editComment: string;
  setEditComment: (val: string) => void;
  isSavingDetails: boolean;
  onClose: () => void;
  onSaveLeadDetails: (e: React.FormEvent) => void;
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void;
  onOpenEstimateModal: () => void;
  onOpenFullCard: (leadId: string) => void;
  onLinkLeadToClient: (leadId: string, clientId: string | null) => void;
  onCreateClientFromLead: (lead: Lead) => void;
  onOpenClientsPage: () => void;
  onConvertToCompanyAndProject?: (
    leadId: string,
    companyName: string,
    binIin: string,
    contactPosition: string,
    projectTitle: string
  ) => Promise<{ success: boolean; error?: string }>;
}

import BottomSheet from "@/components/ui/BottomSheet";

export default function LeadMobileDrawer({
  activeLead,
  clients,
  companies = [],
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
  onClose,
  onSaveLeadDetails,
  onStatusChange,
  onOpenEstimateModal,
  onOpenFullCard,
  onLinkLeadToClient,
  onCreateClientFromLead,
  onOpenClientsPage,
  onConvertToCompanyAndProject,
}: LeadMobileDrawerProps) {
  const dict = LEADS_DICTIONARY.drawer;
  const [showCompanyConvert, setShowCompanyConvert] = useState(false);

  return (
    <>
      <BottomSheet
        isOpen={Boolean(activeLead)}
        onClose={onClose}
        maxWidth="max-w-2xl"
        maxHeight="max-h-[90dvh]"
      >
        {activeLead && (
          <>
            {/* 1. ШАПКА ШТОРКИ */}
            <DrawerHeader
              activeLead={activeLead}
              onClose={onClose}
              onStatusChange={onStatusChange}
              onOpenFullCard={onOpenFullCard}
              onOpenCompanyConvert={() => setShowCompanyConvert(true)}
            />

            {/* 2. ТЕЛО ФОРМЫ (Плавный независимый скролл) */}
            <form onSubmit={onSaveLeadDetails} className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4">
              {/* Секция привязки к карточке клиента */}
              <DrawerClientSection
                activeLead={activeLead}
                clients={clients}
                onLinkLeadToClient={onLinkLeadToClient}
                onCreateClientFromLead={onCreateClientFromLead}
                onOpenClientsPage={onOpenClientsPage}
              />

              {/* Секция параметров: ФИО, Телефон, Менеджер, Даты */}
              <DrawerParamsSection
                editName={editName}
                setEditName={setEditName}
                editPhone={editPhone}
                setEditPhone={setEditPhone}
                editManager={editManager}
                setEditManager={setEditManager}
                editAppDate={editAppDate}
                setEditAppDate={setEditAppDate}
                editDeadline={editDeadline}
                setEditDeadline={setEditDeadline}
              />

              {/* Секция финансов: Озвученная цена, Скидка, Предоплата, Смета */}
              <DrawerFinancesSection
                activeLead={activeLead}
                editOfferedPrice={editOfferedPrice}
                setEditOfferedPrice={setEditOfferedPrice}
                editIsDiscounted={editIsDiscounted}
                setEditIsDiscounted={setEditIsDiscounted}
                editPrepayment={editPrepayment}
                setEditPrepayment={setEditPrepayment}
                onOpenEstimateModal={onOpenEstimateModal}
              />

              {/* Секция локации, заметок и первичного запроса */}
              <DrawerLocationNotesSection
                activeLead={activeLead}
                editAddress={editAddress}
                setEditAddress={setEditAddress}
                editComment={editComment}
                setEditComment={setEditComment}
              />

              {/* Кнопка сохранения параметров */}
              <div className="pt-2 sticky bottom-0 bg-white/95 pb-2">
                <Button
                  type="submit"
                  disabled={isSavingDetails}
                  variant="solid"
                  className="w-full py-3 text-xs font-black shadow-md shadow-orange-500/20"
                >
                  {isSavingDetails ? dict.savingBtn : dict.saveBtn}
                </Button>
              </div>
            </form>
          </>
        )}
      </BottomSheet>

      {/* Модальное окно быстрой конвертации */}
      {showCompanyConvert && onConvertToCompanyAndProject && activeLead && (
        <DrawerCompanyConvertModal
          activeLead={activeLead}
          companies={companies}
          onClose={() => setShowCompanyConvert(false)}
          onConvert={async (data) => {
            await onConvertToCompanyAndProject(
              activeLead.id,
              data.companyName,
              data.binIin,
              data.contactPosition,
              data.projectTitle
            );
            setShowCompanyConvert(false);
          }}
        />
      )}
    </>
  );
}
