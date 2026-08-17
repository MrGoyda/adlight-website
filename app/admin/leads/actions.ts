"use server";

import { prisma } from "@/lib/prisma";
import { LeadStatus, TransactionType, PartnerName } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { sendMetaConversionEvent, sendYandexConversionEvent } from "@/lib/analytics";
import { normalizePhone } from "@/lib/phoneUtils";

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { status },
    });
    
    revalidatePath("/admin/leads");
    return { success: true };
  } catch (error) {
    console.error("Failed to update lead status:", error);
    return { error: "Не удалось обновить статус лида" };
  }
}

export async function closeLeadWithFinance(
  leadId: string,
  revenue: number,
  expenses: number,
  prepayment: number = 0,
  isPrepaymentPaid: boolean = false,
  isBalancePaid: boolean = false
) {
  try {
    // Используем Prisma transaction для атомарности изменений кассы и статуса
    await prisma.$transaction(async (tx) => {
      // 1. Обновляем лид (вносим финансы и переводим в статус COMPLETED)
      const updatedLead = await tx.lead.update({
        where: { id: leadId },
        data: {
          status: LeadStatus.COMPLETED,
          revenue,
          expenses,
          prepayment,
          isPrepaymentPaid,
          isBalancePaid,
        },
      });

      // 2. Рассчитываем и создаем транзакцию доходов (выручка за вычетом уже внесенных авансов)
      const existingIncomes = await tx.dbTransaction.findMany({
        where: {
          leadId: leadId,
          type: TransactionType.INCOME,
        },
      });

      const totalExistingIncome = existingIncomes.reduce((sum, t) => sum + t.amount, 0);
      let incomeToRecord = 0;

      if (isBalancePaid) {
        incomeToRecord = revenue - totalExistingIncome;
      } else if (isPrepaymentPaid) {
        incomeToRecord = prepayment - totalExistingIncome;
      }

      if (incomeToRecord > 0) {
        await tx.dbTransaction.create({
          data: {
            type: TransactionType.INCOME,
            amount: incomeToRecord,
            description: `Расчет по проекту (остаток): ${updatedLead.name} (${updatedLead.phone})`,
            leadId: leadId,
          },
        });
      }

      // 3. Создаем транзакцию расходов (затраты по проекту)
      const existingExpenses = await tx.dbTransaction.findMany({
        where: {
          leadId: leadId,
          type: TransactionType.EXPENSE_COMPANY,
        },
      });
      const totalExistingExpense = existingExpenses.reduce((sum, t) => sum + t.amount, 0);
      const expenseToRecord = expenses - totalExistingExpense;

      if (expenseToRecord > 0) {
        await tx.dbTransaction.create({
          data: {
            type: TransactionType.EXPENSE_COMPANY,
            amount: expenseToRecord,
            description: `Прямые расходы по проекту: ${updatedLead.name} (${updatedLead.phone})`,
            leadId: leadId,
          },
        });
      }

      // 4. Обновляем кассу фирмы (прибавляем дельту доходов, вычитаем расходы)
      const cashboxDelta = incomeToRecord - expenseToRecord;
      
      if (cashboxDelta !== 0) {
        const currentState = await tx.companyState.findUnique({
          where: { id: "global" },
        });

        if (currentState) {
          await tx.companyState.update({
            where: { id: "global" },
            data: { cashbox: currentState.cashbox + cashboxDelta },
          });
        } else {
          await tx.companyState.create({
            data: { id: "global", cashbox: cashboxDelta },
          });
        }
      }
    });

    // Отправляем офлайн-конверсии после завершения транзакции
    try {
      const lead = await prisma.lead.findUnique({
        where: { id: leadId },
      });

      if (lead) {
        if (revenue > 0) {
          sendMetaConversionEvent({
            name: lead.name,
            phone: lead.phone,
            revenue,
            fbBrowserId: lead.fbBrowserId,
            leadId: lead.id,
          }).catch((err) => console.error("Meta CAPI async send error:", err));
        }

        if (lead.yandexClientId && revenue > 0) {
          sendYandexConversionEvent(lead.yandexClientId, revenue).catch((err) =>
            console.error("Yandex Metrica async send error:", err)
          );
        }
      }
    } catch (analyticError) {
      console.error("Failed to trigger post-transaction offline analytics:", analyticError);
    }

    revalidatePath("/admin/leads");
    revalidatePath("/admin/finance");
    return { success: true };
  } catch (error) {
    console.error("Failed to close lead with finance:", error);
    return { error: "Не удалось провести финансовые операции по лиду" };
  }
}

export async function createLeadManual(data: {
  name: string;
  phone: string;
  message?: string;
  calcDetails?: string;
  status?: LeadStatus;
  comment?: string;
  source?: string;
  address?: string;
  appointmentDate?: string;
  deadline?: string;
  manager?: PartnerName | null;
  offeredPrice?: number;
  isDiscounted?: boolean;
  prepayment?: number;
  isPrepaymentPaid?: boolean;
  isBalancePaid?: boolean;
}) {
  try {
    const appDate = data.appointmentDate ? new Date(data.appointmentDate) : null;
    const dlDate = data.deadline ? new Date(data.deadline) : null;
    const cleanPhone = data.phone.trim();

    // Автоматический поиск или создание контакта в базе клиентов
    let clientId: string | null = null;
    if (cleanPhone.length >= 10) {
      let client = await prisma.client.findFirst({
        where: {
          OR: [
            { phone: cleanPhone },
            { phone: cleanPhone.replace(/\D/g, "") },
          ]
        }
      });

      if (!client) {
        client = await prisma.client.create({
          data: {
            name: data.name.trim() || "Новый клиент",
            phone: cleanPhone,
            notes: `Создан автоматически из сделки (${data.source || "Вручную"})`,
          }
        });
      }
      clientId = client.id;
    }

    await prisma.lead.create({
      data: {
        name: data.name,
        phone: cleanPhone,
        message: data.message || null,
        calcDetails: data.calcDetails || null,
        status: data.status || LeadStatus.NEW,
        comment: data.comment || null,
        source: data.source || "Вручную",
        address: data.address || null,
        appointmentDate: appDate,
        deadline: dlDate,
        manager: parsePartnerName(data.manager),
        offeredPrice: data.offeredPrice !== undefined && !isNaN(Number(data.offeredPrice)) ? Number(data.offeredPrice) : null,
        isDiscounted: Boolean(data.isDiscounted),
        prepayment: data.prepayment || 0,
        isPrepaymentPaid: data.isPrepaymentPaid || false,
        isBalancePaid: data.isBalancePaid || false,
        clientId: clientId,
      },
    });

    revalidatePath("/admin/leads");
    revalidatePath("/admin/clients");
    return { success: true };
  } catch (error) {
    console.error("Failed to create manual lead:", error);
    return { error: "Не удалось создать лид вручную" };
  }
}

function parsePartnerName(val?: string | null): PartnerName | null {
  if (!val) return null;
  const upper = String(val).toUpperCase().trim();
  if (upper === "DANIIL" || upper === "ДАНИИЛ" || upper === "DANIL" || upper === "ДАНИЛ") {
    return PartnerName.DANIIL;
  }
  if (upper === "ELISEY" || upper === "ЕЛИСЕЙ" || upper === "ELISEI") {
    return PartnerName.ELISEY;
  }
  return null;
}

export async function updateLeadDetails(
  leadId: string,
  data: {
    name?: string;
    phone?: string;
    message?: string;
    comment?: string;
    source?: string;
    address?: string;
    appointmentDate?: string | null;
    deadline?: string | null;
    manager?: any;
    status?: LeadStatus;
    offeredPrice?: number | null;
    isDiscounted?: boolean;
    prepayment?: number;
    isPrepaymentPaid?: boolean;
    isBalancePaid?: boolean;
  }
) {
  try {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.phone !== undefined) {
      updateData.phone = normalizePhone(data.phone) || data.phone.trim();
    }
    if (data.message !== undefined) updateData.message = data.message ? data.message.trim() : null;
    if (data.comment !== undefined) updateData.comment = data.comment ? data.comment.trim() : null;
    if (data.source !== undefined) updateData.source = data.source ? data.source.trim() : null;
    if (data.address !== undefined) updateData.address = data.address ? data.address.trim() : null;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.offeredPrice !== undefined) {
      updateData.offeredPrice = data.offeredPrice === null || isNaN(Number(data.offeredPrice)) ? null : Number(data.offeredPrice);
    }
    if (data.isDiscounted !== undefined) {
      updateData.isDiscounted = Boolean(data.isDiscounted);
    }
    if (data.prepayment !== undefined) {
      updateData.prepayment = isNaN(Number(data.prepayment)) ? 0 : Number(data.prepayment);
    }
    if (data.isPrepaymentPaid !== undefined) updateData.isPrepaymentPaid = Boolean(data.isPrepaymentPaid);
    if (data.isBalancePaid !== undefined) updateData.isBalancePaid = Boolean(data.isBalancePaid);
    
    if (data.appointmentDate !== undefined) {
      if (!data.appointmentDate) {
        updateData.appointmentDate = null;
      } else {
        const parsed = new Date(data.appointmentDate);
        updateData.appointmentDate = isNaN(parsed.getTime()) ? null : parsed;
      }
    }
    if (data.deadline !== undefined) {
      if (!data.deadline) {
        updateData.deadline = null;
      } else {
        const parsed = new Date(data.deadline);
        updateData.deadline = isNaN(parsed.getTime()) ? null : parsed;
      }
    }
    if (data.manager !== undefined) {
      updateData.manager = parsePartnerName(data.manager);
    }

    await prisma.lead.update({
      where: { id: leadId },
      data: updateData,
    });

    revalidatePath("/admin/leads");
    revalidatePath("/admin/clients");
    return { success: true };
  } catch (error) {
    console.error("Failed to update lead details:", error);
    return { error: "Не удалось обновить данные лида" };
  }
}

export async function deleteLead(leadId: string) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Получаем лид и его транзакции
      const lead = await tx.lead.findUnique({
        where: { id: leadId },
      });

      if (!lead) {
        throw new Error("Лид не найден");
      }

      // 2. Если лид COMPLETED, скорректируем баланс кассы
      if (lead.status === LeadStatus.COMPLETED) {
        const netProfit = lead.revenue - lead.expenses;
        
        const currentState = await tx.companyState.findUnique({
          where: { id: "global" },
        });

        if (currentState && netProfit > 0) {
          await tx.companyState.update({
            where: { id: "global" },
            data: { cashbox: Math.max(0, currentState.cashbox - netProfit) },
          });
        }
      }

      // 3. Удаляем транзакции по этому лиду
      await tx.dbTransaction.deleteMany({
        where: { leadId: leadId },
      });

      // 4. Удаляем сам лид
      await tx.lead.delete({
        where: { id: leadId },
      });
    });

    revalidatePath("/admin/leads");
    revalidatePath("/admin/finance");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete lead:", error);
    return { error: "Не удалось удалить лид" };
  }
}

/**
 * Конвертация лида в производственный Проект и привязка Компании (B2B CRM)
 */
export async function convertLeadToProjectAndCompany(
  leadId: string,
  data: {
    companyName: string;
    binIin?: string;
    legalAddress?: string;
    bankAccount?: string;
    contactPosition?: string;
    projectTitle?: string;
  }
) {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Получаем лид
      const lead = await tx.lead.findUnique({
        where: { id: leadId },
        include: { files: true },
      });

      if (!lead) {
        throw new Error("Лид не найден");
      }

      // 2. Ищем существующую компанию по имени или БИН, либо создаем новую
      let company = null;
      if (data.binIin && data.binIin.trim()) {
        company = await tx.company.findFirst({
          where: { binIin: data.binIin.trim() },
        });
      }
      if (!company) {
        company = await tx.company.findFirst({
          where: { name: { equals: data.companyName.trim(), mode: "insensitive" } },
        });
      }

      if (!company) {
        company = await tx.company.create({
          data: {
            name: data.companyName.trim(),
            binIin: data.binIin?.trim() || null,
            legalAddress: data.legalAddress?.trim() || null,
            bankAccount: data.bankAccount?.trim() || null,
            notes: `Создано автоматически из лида ${lead.name} (${lead.phone})`,
          },
        });
      } else {
        // Дополняем реквизиты если их не было
        await tx.company.update({
          where: { id: company.id },
          data: {
            ...(data.binIin && !company.binIin ? { binIin: data.binIin.trim() } : {}),
            ...(data.legalAddress && !company.legalAddress ? { legalAddress: data.legalAddress.trim() } : {}),
            ...(data.bankAccount && !company.bankAccount ? { bankAccount: data.bankAccount.trim() } : {}),
          },
        });
      }

      // 3. Создаем/находим контакт в этой компании
      let contact = await tx.contact.findFirst({
        where: {
          companyId: company.id,
          phone: lead.phone,
        },
      });

      if (!contact) {
        contact = await tx.contact.create({
          data: {
            companyId: company.id,
            name: lead.name,
            phone: lead.phone,
            position: data.contactPosition || "Представитель",
            isDecisionMaker: true,
          },
        });
      }

      // 4. Создаем проект для компании
      const projectTitle = data.projectTitle?.trim() || `${lead.name} — ${lead.address || "Вывеска и оформление"}`;
      const project = await tx.project.create({
        data: {
          companyId: company.id,
          title: projectTitle,
          budget: lead.revenue || 0,
          notes: lead.comment || lead.message || null,
        },
      });

      // 5. Переносим файлы лида в проект
      if (lead.files && lead.files.length > 0) {
        await tx.leadFile.updateMany({
          where: { leadId: lead.id },
          data: { projectId: project.id },
        });
      }

      // 6. Обновляем статус лида и привязываем к компании, проекту и контакту
      await tx.lead.update({
        where: { id: lead.id },
        data: {
          companyId: company.id,
          projectId: project.id,
          contactId: contact.id,
          status: LeadStatus.PROCESSED, // Перевод в статус "В производстве"
        },
      });

      // 7. Фиксируем запись в таймлайн
      await tx.leadActivity.create({
        data: {
          leadId: lead.id,
          type: "STATUS_CHANGE",
          text: `Лид успешно квалифицирован в Проект «${project.title}» и привязан к компании «${company.name}»`,
          author: lead.manager === "DANIIL" ? "Даниил" : lead.manager === "ELISEY" ? "Елисей" : (lead.manager ? String(lead.manager) : "Система"),
        },
      });

      revalidatePath("/admin/leads");
      revalidatePath("/admin/projects");
      revalidatePath("/admin/companies");
      revalidatePath("/admin/clients");

      return {
        success: true as const,
        companyId: company.id,
        projectId: project.id,
        contactId: contact.id,
      };
    });
  } catch (error: any) {
    console.error("Failed to convert lead to project and company:", error);
    return { success: false as const, error: error.message || "Не удалось конвертировать лид в проект" };
  }
}

