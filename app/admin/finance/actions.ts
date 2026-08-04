"use server";

import { prisma } from "@/lib/prisma";
import { TransactionType, PartnerName } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function addCompanyExpense(amount: number, description: string) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Создаем транзакцию расхода
      await tx.dbTransaction.create({
        data: {
          type: TransactionType.EXPENSE_COMPANY,
          amount,
          description,
        },
      });

      // 2. Уменьшаем кассу фирмы
      const currentState = await tx.companyState.findUnique({
        where: { id: "global" },
      });

      if (currentState) {
        await tx.companyState.update({
          where: { id: "global" },
          data: { cashbox: currentState.cashbox - amount },
        });
      } else {
        await tx.companyState.create({
          data: { id: "global", cashbox: -amount },
        });
      }
    });

    revalidatePath("/admin/finance");
    return { success: true };
  } catch (error) {
    console.error("Failed to add company expense:", error);
    return { error: "Не удалось добавить расход" };
  }
}

export async function recordPartnerWithdrawal(
  partner: PartnerName,
  amount: number,
  description: string
) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Создаем транзакцию списания на личный счет партнера
      await tx.dbTransaction.create({
        data: {
          type: TransactionType.WITHDRAWAL_PARTNER,
          amount,
          description,
          partner,
        },
      });

      // 2. Уменьшаем кассу фирмы
      const currentState = await tx.companyState.findUnique({
        where: { id: "global" },
      });

      if (currentState) {
        await tx.companyState.update({
          where: { id: "global" },
          data: { cashbox: currentState.cashbox - amount },
        });
      } else {
        await tx.companyState.create({
          data: { id: "global", cashbox: -amount },
        });
      }
    });

    revalidatePath("/admin/finance");
    return { success: true };
  } catch (error) {
    console.error("Failed to record partner withdrawal:", error);
    return { error: "Не удалось записать вывод партнера" };
  }
}

export async function addCompanyIncome(
  amount: number,
  description: string,
  leadId?: string | null
) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Создаем транзакцию дохода
      await tx.dbTransaction.create({
        data: {
          type: TransactionType.INCOME,
          amount,
          description,
          leadId: leadId || null,
        },
      });

      // 2. Увеличиваем кассу фирмы
      const currentState = await tx.companyState.findUnique({
        where: { id: "global" },
      });

      if (currentState) {
        await tx.companyState.update({
          where: { id: "global" },
          data: { cashbox: currentState.cashbox + amount },
        });
      } else {
        await tx.companyState.create({
          data: { id: "global", cashbox: amount },
        });
      }

      // 3. Если привязан лид, проверяем/обновляем статус оплаты аванса
      if (leadId) {
        const lead = await tx.lead.findUnique({ where: { id: leadId } });
        if (lead) {
          if (!lead.isPrepaymentPaid && lead.prepayment > 0) {
            await tx.lead.update({
              where: { id: leadId },
              data: { isPrepaymentPaid: true },
            });
          }
        }
      }
    });

    revalidatePath("/admin/finance");
    revalidatePath("/admin/leads");
    return { success: true };
  } catch (error) {
    console.error("Failed to add company income:", error);
    return { error: "Не удалось добавить доход" };
  }
}
