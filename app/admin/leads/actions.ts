"use server";

import { prisma } from "@/lib/prisma";
import { LeadStatus, TransactionType, PartnerName } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { sendMetaConversionEvent, sendYandexConversionEvent } from "@/lib/analytics";

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
  prepayment?: number;
  isPrepaymentPaid?: boolean;
  isBalancePaid?: boolean;
}) {
  try {
    const appDate = data.appointmentDate ? new Date(data.appointmentDate) : null;
    const dlDate = data.deadline ? new Date(data.deadline) : null;

    await prisma.lead.create({
      data: {
        name: data.name,
        phone: data.phone,
        message: data.message || null,
        calcDetails: data.calcDetails || null,
        status: data.status || LeadStatus.NEW,
        comment: data.comment || null,
        source: data.source || "Вручную",
        address: data.address || null,
        appointmentDate: appDate,
        deadline: dlDate,
        manager: data.manager || null,
        prepayment: data.prepayment || 0,
        isPrepaymentPaid: data.isPrepaymentPaid || false,
        isBalancePaid: data.isBalancePaid || false,
      },
    });

    revalidatePath("/admin/leads");
    return { success: true };
  } catch (error) {
    console.error("Failed to create manual lead:", error);
    return { error: "Не удалось создать лид вручную" };
  }
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
    manager?: PartnerName | null;
    status?: LeadStatus;
    prepayment?: number;
    isPrepaymentPaid?: boolean;
    isBalancePaid?: boolean;
  }
) {
  try {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.message !== undefined) updateData.message = data.message;
    if (data.comment !== undefined) updateData.comment = data.comment;
    if (data.source !== undefined) updateData.source = data.source;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.prepayment !== undefined) updateData.prepayment = data.prepayment;
    if (data.isPrepaymentPaid !== undefined) updateData.isPrepaymentPaid = data.isPrepaymentPaid;
    if (data.isBalancePaid !== undefined) updateData.isBalancePaid = data.isBalancePaid;
    
    if (data.appointmentDate !== undefined) {
      updateData.appointmentDate = data.appointmentDate ? new Date(data.appointmentDate) : null;
    }
    if (data.deadline !== undefined) {
      updateData.deadline = data.deadline ? new Date(data.deadline) : null;
    }
    if (data.manager !== undefined) {
      updateData.manager = data.manager;
    }

    await prisma.lead.update({
      where: { id: leadId },
      data: updateData,
    });

    revalidatePath("/admin/leads");
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
