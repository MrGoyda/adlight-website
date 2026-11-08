"use server";

import { prisma } from "@/lib/prisma";
import { 
  TransactionType, 
  PartnerName, 
  AccountType, 
  CategoryType 
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { 
  FinancePeriod, 
  FinanceAnalyticsSummary, 
  ProjectFinanceUnit, 
  PartnerEquityBreakdown 
} from "./_types/financeTypes";

/**
 * Получение всех стартовых данных для финансового дашборда
 */
export async function getFinanceInitialData() {
  try {
    const [accounts, categories, funds, transactions, leads] = await Promise.all([
      prisma.financeAccount.findMany({
        where: { isArchived: false },
        orderBy: [{ isDefault: "desc" }, { name: "asc" }],
        select: {
          id: true,
          name: true,
          type: true,
          balance: true,
          currency: true,
          isDefault: true,
          color: true,
          isArchived: true,
        },
      }),
      prisma.financeCategory.findMany({
        where: { isArchived: false },
        orderBy: [{ type: "asc" }, { name: "asc" }],
        select: {
          id: true,
          name: true,
          type: true,
          color: true,
          icon: true,
          isArchived: true,
        },
      }),
      prisma.companyFund.findMany({
        orderBy: { targetPercent: "desc" },
        select: {
          id: true,
          name: true,
          targetPercent: true,
          balance: true,
          color: true,
        },
      }),
      prisma.dbTransaction.findMany({
        take: 200,
        orderBy: [{ transactionDate: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          type: true,
          amount: true,
          description: true,
          createdAt: true,
          transactionDate: true,
          accountId: true,
          targetAccountId: true,
          categoryId: true,
          leadId: true,
          partner: true,
          receiptUrl: true,
          account: { select: { id: true, name: true, type: true, color: true } },
          targetAccount: { select: { id: true, name: true, type: true, color: true } },
          category: { select: { id: true, name: true, type: true, color: true, icon: true } },
          lead: { select: { id: true, name: true, phone: true } },
        },
      }),
      prisma.lead.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          name: true,
          phone: true,
        },
        orderBy: { updatedAt: "desc" },
        take: 100,
      }),
    ]);

    const totalCashbox = accounts.reduce((acc, a) => acc + a.balance, 0);

    return {
      success: true,
      data: {
        accounts,
        categories,
        funds,
        transactions: transactions.map((t) => ({
          ...t,
          createdAt: t.createdAt.toISOString(),
          transactionDate: t.transactionDate.toISOString(),
        })),
        leads,
        totalCashbox,
      },
    };
  } catch (error: any) {
    console.error("Failed to get finance initial data:", error);
    return { success: false, error: error.message || "Ошибка загрузки финансов" };
  }
}

/**
 * Проведение поступления средств (Доход)
 */
export async function recordIncome(data: {
  amount: number;
  description: string;
  accountId?: string;
  categoryId?: string;
  leadId?: string | null;
  transactionDate?: string;
}) {
  try {
    const { amount, description, accountId, categoryId, leadId, transactionDate } = data;
    if (!amount || amount <= 0) return { error: "Сумма должна быть больше нуля" };
    if (!description.trim()) return { error: "Укажите назначение платежа" };

    await prisma.$transaction(async (tx) => {
      // 1. Находим целевой счет или дефолтный
      let targetAcc = accountId 
        ? await tx.financeAccount.findUnique({ where: { id: accountId } })
        : await tx.financeAccount.findFirst({ where: { isDefault: true } });

      if (!targetAcc) {
        targetAcc = await tx.financeAccount.findFirst();
      }

      // 2. Создаем транзакцию
      await tx.dbTransaction.create({
        data: {
          type: TransactionType.INCOME,
          amount,
          description: description.trim(),
          accountId: targetAcc?.id || null,
          categoryId: categoryId || null,
          leadId: leadId || null,
          transactionDate: transactionDate ? new Date(transactionDate) : new Date(),
        },
      });

      // 3. Увеличиваем баланс счета
      if (targetAcc) {
        await tx.financeAccount.update({
          where: { id: targetAcc.id },
          data: { balance: targetAcc.balance + amount },
        });
      }

      // 4. Синхронизируем старый cashbox для обратной совместимости
      const state = await tx.companyState.findUnique({ where: { id: "global" } });
      if (state) {
        await tx.companyState.update({
          where: { id: "global" },
          data: { cashbox: state.cashbox + amount },
        });
      }

      // 5. Если привязана сделка — проверяем и отмечаем оплату аванса/баланса
      if (leadId) {
        const lead = await tx.lead.findUnique({ where: { id: leadId } });
        if (lead) {
          const totalCost = lead.offeredPrice || lead.revenue || 0;
          if (lead.prepayment > 0 && !lead.isPrepaymentPaid) {
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
  } catch (error: any) {
    console.error("Failed to record income:", error);
    return { error: error.message || "Не удалось провести доход" };
  }
}

/**
 * Проведение списания средств (Расход)
 */
export async function recordExpense(data: {
  amount: number;
  description: string;
  accountId: string;
  categoryId?: string;
  leadId?: string | null;
  transactionDate?: string;
  receiptUrl?: string | null;
}) {
  try {
    const { amount, description, accountId, categoryId, leadId, transactionDate, receiptUrl } = data;
    if (!amount || amount <= 0) return { error: "Сумма должна быть больше нуля" };
    if (!description.trim()) return { error: "Укажите назначение платежа" };
    await prisma.$transaction(async (tx) => {
      let sourceAcc = accountId 
        ? await tx.financeAccount.findUnique({ where: { id: accountId } })
        : await tx.financeAccount.findFirst({ where: { isDefault: true } });

      if (!sourceAcc) {
        sourceAcc = await tx.financeAccount.findFirst();
      }
      if (!sourceAcc) throw new Error("Счет списания не найден");

      // 1. Создаем транзакцию расхода
      await tx.dbTransaction.create({
        data: {
          type: TransactionType.EXPENSE_COMPANY,
          amount,
          description: description.trim(),
          accountId: sourceAcc.id,
          categoryId: categoryId || null,
          leadId: leadId || null,
          receiptUrl: receiptUrl || null,
          transactionDate: transactionDate ? new Date(transactionDate) : new Date(),
        },
      });

      // 2. Списываем с баланса счета
      await tx.financeAccount.update({
        where: { id: sourceAcc.id },
        data: { balance: sourceAcc.balance - amount },
      });

      // 3. Синхронизируем старый cashbox
      const state = await tx.companyState.findUnique({ where: { id: "global" } });
      if (state) {
        await tx.companyState.update({
          where: { id: "global" },
          data: { cashbox: state.cashbox - amount },
        });
      }
    });

    revalidatePath("/admin/finance");
    revalidatePath("/admin/leads");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to record expense:", error);
    return { error: error.message || "Не удалось зафиксировать расход" };
  }
}

/**
 * Перевод средств между счетами (Инкассация, пополнение подотчета)
 */
export async function recordTransfer(data: {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
  transactionDate?: string;
}) {
  try {
    const { fromAccountId, toAccountId, amount, description, transactionDate } = data;
    if (!amount || amount <= 0) return { error: "Сумма должна быть больше нуля" };
    if (fromAccountId === toAccountId) return { error: "Выберите разные счета для перевода" };

    await prisma.$transaction(async (tx) => {
      const [fromAcc, toAcc] = await Promise.all([
        tx.financeAccount.findUnique({ where: { id: fromAccountId } }),
        tx.financeAccount.findUnique({ where: { id: toAccountId } }),
      ]);

      if (!fromAcc) throw new Error("Счет списания не найден");
      if (!toAcc) throw new Error("Счет зачисления не найден");

      // 1. Создаем проводку перевода
      await tx.dbTransaction.create({
        data: {
          type: TransactionType.TRANSFER_BETWEEN_ACCOUNTS,
          amount,
          description: description?.trim() || `Перевод: ${fromAcc.name} → ${toAcc.name}`,
          accountId: fromAcc.id,
          targetAccountId: toAcc.id,
          transactionDate: transactionDate ? new Date(transactionDate) : new Date(),
        },
      });

      // 2. Списываем с первого счета
      await tx.financeAccount.update({
        where: { id: fromAcc.id },
        data: { balance: fromAcc.balance - amount },
      });

      // 3. Зачисляем на второй счет
      await tx.financeAccount.update({
        where: { id: toAcc.id },
        data: { balance: toAcc.balance + amount },
      });
    });

    revalidatePath("/admin/finance");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to record transfer:", error);
    return { error: error.message || "Не удалось провести перевод" };
  }
}

/**
 * Выплата дивидендов партнеру (Даниил или Елисей)
 */
export async function recordPartnerWithdrawal(
  partner: PartnerName,
  amount: number,
  description: string,
  accountId?: string,
  transactionDate?: string
) {
  try {
    if (!amount || amount <= 0) return { error: "Сумма должна быть больше нуля" };

    await prisma.$transaction(async (tx) => {
      let sourceAcc = accountId 
        ? await tx.financeAccount.findUnique({ where: { id: accountId } })
        : await tx.financeAccount.findFirst({ where: { isDefault: true } });

      if (!sourceAcc) {
        sourceAcc = await tx.financeAccount.findFirst();
      }
      if (!sourceAcc) throw new Error("Счет списания не найден");

      // 1. Создаем транзакцию вывода
      await tx.dbTransaction.create({
        data: {
          type: TransactionType.WITHDRAWAL_PARTNER,
          amount,
          description: description.trim() || `Вывод дивидендов: ${partner === "ELISEY" ? "Елисей" : "Даниил"}`,
          partner,
          accountId: sourceAcc.id,
          transactionDate: transactionDate ? new Date(transactionDate) : new Date(),
        },
      });

      // 2. Списываем со счета
      await tx.financeAccount.update({
        where: { id: sourceAcc.id },
        data: { balance: sourceAcc.balance - amount },
      });

      // 3. Обновляем старый cashbox
      const state = await tx.companyState.findUnique({ where: { id: "global" } });
      if (state) {
        await tx.companyState.update({
          where: { id: "global" },
          data: { cashbox: state.cashbox - amount },
        });
      }
    });

    revalidatePath("/admin/finance");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to record partner withdrawal:", error);
    return { error: error.message || "Не удалось записать вывод партнера" };
  }
}

/**
 * Удаление финансовой транзакции с автоматическим откатом балансов счетов
 */
export async function deleteTransaction(transactionId: string) {
  try {
    await prisma.$transaction(async (tx) => {
      const transaction = await tx.dbTransaction.findUnique({
        where: { id: transactionId },
      });

      if (!transaction) throw new Error("Транзакция не найдена");

      const { type, amount, accountId, targetAccountId } = transaction;

      // 1. Откат баланса основного счета
      if (accountId) {
        const acc = await tx.financeAccount.findUnique({ where: { id: accountId } });
        if (acc) {
          if (type === TransactionType.INCOME) {
            // Если удаляем доход — уменьшаем баланс счета
            await tx.financeAccount.update({
              where: { id: accountId },
              data: { balance: acc.balance - amount },
            });
          } else if (
            type === TransactionType.EXPENSE_COMPANY || 
            type === TransactionType.WITHDRAWAL_PARTNER ||
            type === TransactionType.TRANSFER_BETWEEN_ACCOUNTS
          ) {
            // Если удаляем расход/перевод — возвращаем средства на счет
            await tx.financeAccount.update({
              where: { id: accountId },
              data: { balance: acc.balance + amount },
            });
          }
        }
      }

      // 2. При удалении перевода — списываем со счета назначения
      if (type === TransactionType.TRANSFER_BETWEEN_ACCOUNTS && targetAccountId) {
        const targetAcc = await tx.financeAccount.findUnique({ where: { id: targetAccountId } });
        if (targetAcc) {
          await tx.financeAccount.update({
            where: { id: targetAccountId },
            data: { balance: targetAcc.balance - amount },
          });
        }
      }

      // 3. Откат глобального cashbox для обратной совместимости
      const state = await tx.companyState.findUnique({ where: { id: "global" } });
      if (state) {
        if (type === TransactionType.INCOME) {
          await tx.companyState.update({
            where: { id: "global" },
            data: { cashbox: state.cashbox - amount },
          });
        } else if (type === TransactionType.EXPENSE_COMPANY || type === TransactionType.WITHDRAWAL_PARTNER) {
          await tx.companyState.update({
            where: { id: "global" },
            data: { cashbox: state.cashbox + amount },
          });
        }
      }

      // 4. Удаляем транзакцию
      await tx.dbTransaction.delete({
        where: { id: transactionId },
      });
    });

    revalidatePath("/admin/finance");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete transaction:", error);
    return { error: error.message || "Не удалось удалить транзакцию" };
  }
}

/**
 * Создание или редактирование финансового счета
 */
export async function upsertFinanceAccount(data: {
  id?: string;
  name: string;
  type: AccountType;
  balance?: number;
  color?: string;
  isDefault?: boolean;
}) {
  try {
    const { id, name, type, balance = 0, color = "orange", isDefault = false } = data;
    if (!name.trim()) return { error: "Укажите название счета" };

    if (id) {
      await prisma.financeAccount.update({
        where: { id },
        data: { name: name.trim(), type, color, isDefault },
      });
    } else {
      if (isDefault) {
        await prisma.financeAccount.updateMany({
          data: { isDefault: false },
        });
      }
      await prisma.financeAccount.create({
        data: {
          name: name.trim(),
          type,
          balance,
          color,
          isDefault,
        },
      });
    }

    revalidatePath("/admin/finance");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to upsert finance account:", error);
    return { error: error.message || "Не удалось сохранить счет" };
  }
}

/**
 * Расчет аналитики ДДС и P&L (Прибыли и Убытки) за выбранный период
 */
export async function getFinanceAnalytics(period: FinancePeriod = "THIS_MONTH"): Promise<{
  success: boolean;
  data?: FinanceAnalyticsSummary;
  error?: string;
}> {
  try {
    const now = new Date();
    let startDate: Date | undefined;
    let endDate: Date = new Date();

    if (period === "TODAY") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === "YESTERDAY") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, -1);
    } else if (period === "THIS_WEEK") {
      const day = now.getDay() || 7;
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day + 1);
    } else if (period === "THIS_MONTH") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === "LAST_MONTH") {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    } else if (period === "THIS_QUARTER") {
      const quarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), quarter * 3, 1);
    } else if (period === "THIS_YEAR") {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    const whereClause: any = {};
    if (startDate) {
      whereClause.transactionDate = {
        gte: startDate,
        lte: endDate,
      };
    }

    const [transactions, categories] = await Promise.all([
      prisma.dbTransaction.findMany({
        where: whereClause,
        select: {
          type: true,
          amount: true,
          category: {
            select: {
              id: true,
              name: true,
              type: true,
              color: true,
            },
          },
        },
      }),
      prisma.financeCategory.findMany({
        where: { isArchived: false },
        select: {
          id: true,
          name: true,
          type: true,
          color: true,
        },
      }),
    ]);

    let totalRevenue = 0;
    let totalDirectExpenses = 0;
    let totalOverheadExpenses = 0;
    let totalCommercialExpenses = 0;
    let totalTaxes = 0;

    const categoryMap: Record<string, number> = {};

    for (const t of transactions) {
      if (t.type === TransactionType.INCOME) {
        totalRevenue += t.amount;
      } else if (t.type === TransactionType.EXPENSE_COMPANY) {
        const catType = t.category?.type;
        if (catType === CategoryType.EXPENSE_DIRECT) {
          totalDirectExpenses += t.amount;
        } else if (catType === CategoryType.EXPENSE_OVERHEAD) {
          totalOverheadExpenses += t.amount;
        } else if (catType === CategoryType.EXPENSE_COMMERCIAL) {
          totalCommercialExpenses += t.amount;
        } else if (catType === CategoryType.EXPENSE_TAX) {
          totalTaxes += t.amount;
        } else {
          totalDirectExpenses += t.amount; // fallback
        }

        const catName = t.category?.name || "Прочие расходы";
        categoryMap[catName] = (categoryMap[catName] || 0) + t.amount;
      }
    }

    const grossProfit = totalRevenue - totalDirectExpenses;
    const grossMarginPercent = totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 100) : 0;

    const totalExpenses = totalDirectExpenses + totalOverheadExpenses + totalCommercialExpenses + totalTaxes;
    const netProfit = totalRevenue - totalExpenses;
    const netMarginPercent = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

    const categoryBreakdown = Object.entries(categoryMap)
      .map(([name, amount]) => {
        const cat = categories.find((c) => c.name === name);
        return {
          id: cat?.id || name,
          name,
          type: cat?.type || CategoryType.EXPENSE_DIRECT,
          amount,
          percent: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
          color: cat?.color || "slate",
        };
      })
      .sort((a, b) => b.amount - a.amount);

    return {
      success: true,
      data: {
        period,
        totalRevenue,
        totalDirectExpenses,
        grossProfit,
        grossMarginPercent,
        totalOverheadExpenses,
        totalCommercialExpenses,
        totalTaxes,
        totalExpenses,
        netProfit,
        netMarginPercent,
        categoryBreakdown,
      },
    };
  } catch (error: any) {
    console.error("Failed to compute finance analytics:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Получение план-факт юнит-экономики по проектам цеха
 */
export async function getProjectsUnitEconomics(): Promise<{
  success: boolean;
  data?: ProjectFinanceUnit[];
  error?: string;
}> {
  try {
    // Получаем сделки, у которых есть смета либо связанные транзакции
    const leads = await prisma.lead.findMany({
      where: {
        deletedAt: null,
        OR: [
          { estimate: { isNot: null } },
          { transactions: { some: {} } },
        ],
      },
      select: {
        id: true,
        name: true,
        phone: true,
        status: true,
        offeredPrice: true,
        revenue: true,
        prepayment: true,
        expenses: true,
        isBalancePaid: true,
        isPrepaymentPaid: true,
        estimate: {
          select: {
            items: {
              select: {
                costPrice: true,
                quantity: true,
              },
            },
          },
        },
        transactions: {
          select: {
            id: true,
            type: true,
            amount: true,
            description: true,
            transactionDate: true,
            createdAt: true,
            category: { select: { id: true, name: true, type: true, color: true } },
            account: { select: { id: true, name: true, type: true, color: true } },
          },
          orderBy: { transactionDate: "desc" },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });

    const result: ProjectFinanceUnit[] = leads.map((lead) => {
      const contractPrice = lead.offeredPrice || lead.revenue || 0;
      const estimateItemsCost = lead.estimate?.items.reduce(
        (sum, item) => sum + (item.costPrice || 0) * (item.quantity || 1),
        0
      ) || 0;
      const estimatedCost = estimateItemsCost > 0 ? estimateItemsCost : (lead.expenses || 0);
      const plannedMargin = Math.max(0, contractPrice - estimatedCost);
      const plannedMarginPercent = contractPrice > 0 ? Math.round((plannedMargin / contractPrice) * 100) : 0;

      let paidByClient = 0;
      let actualDirectExpenses = 0;

      for (const t of lead.transactions) {
        if (t.type === TransactionType.INCOME) {
          paidByClient += t.amount;
        } else if (t.type === TransactionType.EXPENSE_COMPANY) {
          actualDirectExpenses += t.amount;
        }
      }

      // Если в сделке были старые поля выручки/расходов
      if (paidByClient === 0 && (lead.isBalancePaid || lead.isPrepaymentPaid)) {
        paidByClient = lead.isBalancePaid ? contractPrice : lead.prepayment;
      }
      if (actualDirectExpenses === 0 && lead.expenses > 0) {
        actualDirectExpenses = lead.expenses;
      }

      const actualMargin = paidByClient - actualDirectExpenses;
      const actualMarginPercent = paidByClient > 0 ? Math.round((actualMargin / paidByClient) * 100) : 0;
      const deltaCost = actualDirectExpenses - estimatedCost;

      return {
        leadId: lead.id,
        leadName: lead.name || "Без названия",
        phone: lead.phone || "",
        status: lead.status,
        contractPrice,
        estimatedCost,
        plannedMargin,
        plannedMarginPercent,
        paidByClient,
        actualDirectExpenses,
        actualMargin,
        actualMarginPercent,
        deltaCost,
        transactions: lead.transactions.map((t) => ({
          ...t,
          createdAt: t.createdAt.toISOString(),
          transactionDate: t.transactionDate.toISOString(),
        })),
      };
    });

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Failed to get projects unit economics:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Получение баланса долей партнеров (Даниил и Елисей 50/50)
 */
export async function getPartnersEquity(): Promise<{
  success: boolean;
  data?: PartnerEquityBreakdown[];
  error?: string;
}> {
  try {
    // 1. Вычисляем чистую прибыль за все время и агрегируем выводы партнеров прямо в базе
    const [allIncome, allExpenses, withdrawalsGroup] = await Promise.all([
      prisma.dbTransaction.aggregate({
        where: { type: TransactionType.INCOME },
        _sum: { amount: true },
      }),
      prisma.dbTransaction.aggregate({
        where: { type: TransactionType.EXPENSE_COMPANY },
        _sum: { amount: true },
      }),
      prisma.dbTransaction.groupBy({
        by: ["partner"],
        where: { 
          type: TransactionType.WITHDRAWAL_PARTNER,
          partner: { not: null },
        },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = allIncome._sum.amount || 0;
    const totalExpenses = allExpenses._sum.amount || 0;
    const netProfit = Math.max(0, totalIncome - totalExpenses);

    // Доля 50%
    const halfShare = Math.round(netProfit * 0.5);

    let eliseyWithdrawn = 0;
    let daniilWithdrawn = 0;

    for (const g of withdrawalsGroup) {
      if (g.partner === PartnerName.ELISEY) {
        eliseyWithdrawn = g._sum.amount || 0;
      } else if (g.partner === PartnerName.DANIIL) {
        daniilWithdrawn = g._sum.amount || 0;
      }
    }

    const result: PartnerEquityBreakdown[] = [
      {
        partner: PartnerName.ELISEY,
        name: "Елисей",
        sharePercent: 50,
        earnedShare: halfShare,
        withdrawnTotal: eliseyWithdrawn,
        availableBalance: halfShare - eliseyWithdrawn,
      },
      {
        partner: PartnerName.DANIIL,
        name: "Даниил",
        sharePercent: 50,
        earnedShare: halfShare,
        withdrawnTotal: daniilWithdrawn,
        availableBalance: halfShare - daniilWithdrawn,
      },
    ];

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Failed to get partners equity:", error);
    return { success: false, error: error.message };
  }
}

// ── СОВМЕСТИМОСТЬ СО СТАРЫМИ ФОРМАМИ И ТОПБАРОМ CRM ──
export async function addCompanyExpense(amount: number, description: string) {
  return recordExpense({
    amount,
    description,
    accountId: "",
  });
}

export async function addCompanyIncome(amount: number, description: string, leadId?: string | null) {
  return recordIncome({
    amount,
    description,
    leadId: leadId || null,
  });
}

