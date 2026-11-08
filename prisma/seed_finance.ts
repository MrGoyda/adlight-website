import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { PrismaClient, AccountType, CategoryType, PartnerName } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🚀 Starting Finance System Seed & Migration...");

  // 1. Получаем текущее состояние старой кассы
  const companyState = await prisma.companyState.findUnique({
    where: { id: "global" },
  });
  const currentCashbox = companyState?.cashbox || 0;
  console.log(`📦 Current global cashbox: ${currentCashbox.toLocaleString("ru-RU")} ₸`);

  // 2. Создание счетов по умолчанию
  const defaultAccounts = [
    {
      name: "Kaspi Pay (ТОО)",
      type: AccountType.KASPI_PAY,
      balance: currentCashbox, // Переносим текущий баланс сюда
      color: "red",
      isDefault: true,
      currency: "KZT",
    },
    {
      name: "Расчетный счет (Halyk Bank)",
      type: AccountType.BANK_CHECKING,
      balance: 0,
      color: "emerald",
      isDefault: false,
      currency: "KZT",
    },
    {
      name: "Касса цеха (Наличные)",
      type: AccountType.CASH_OFFICE,
      balance: 0,
      color: "amber",
      isDefault: false,
      currency: "KZT",
    },
    {
      name: "Подотчет снабжения / монтажа",
      type: AccountType.PETTY_CASH,
      balance: 0,
      color: "blue",
      isDefault: false,
      currency: "KZT",
    },
  ];

  let primaryAccount = null;

  for (const acc of defaultAccounts) {
    let existing = await prisma.financeAccount.findFirst({
      where: { name: acc.name },
    });

    if (!existing) {
      existing = await prisma.financeAccount.create({
        data: acc,
      });
      console.log(`✅ Created account: ${acc.name} (Balance: ${acc.balance} ₸)`);
    } else {
      console.log(`ℹ️ Account already exists: ${acc.name}`);
    }

    if (acc.isDefault || !primaryAccount) {
      primaryAccount = existing;
    }
  }

  // 3. Создание статей расходов и доходов
  const defaultCategories = [
    // Доходы
    { name: "Поступления от клиентов", type: CategoryType.INCOME, color: "emerald", icon: "TrendingUp" },
    { name: "Прочие доходы", type: CategoryType.INCOME, color: "teal", icon: "PlusCircle" },

    // Прямые производственные (COGS)
    { name: "Закуп листовых материалов (Акрил, ПВХ, Композит)", type: CategoryType.EXPENSE_DIRECT, color: "blue", icon: "Layers" },
    { name: "Светодиоды, модули и блоки питания", type: CategoryType.EXPENSE_DIRECT, color: "amber", icon: "Zap" },
    { name: "Металл, профили и каркасы", type: CategoryType.EXPENSE_DIRECT, color: "indigo", icon: "Hammer" },
    { name: "Подрядные работы (Фрезеровка, УФ-печать, Лазер)", type: CategoryType.EXPENSE_DIRECT, color: "purple", icon: "Cpu" },
    { name: "Зарплата мастеров цеха за заказ", type: CategoryType.EXPENSE_DIRECT, color: "orange", icon: "Users" },
    { name: "Монтажные работы и спецтехника", type: CategoryType.EXPENSE_DIRECT, color: "cyan", icon: "Truck" },

    // Косвенные производственные (OPEX Цех)
    { name: "Аренда производственного цеха", type: CategoryType.EXPENSE_OVERHEAD, color: "rose", icon: "Building" },
    { name: "Коммунальные услуги и отопление цеха", type: CategoryType.EXPENSE_OVERHEAD, color: "amber", icon: "Flame" },
    { name: "Инструмент, расходники и оснастка", type: CategoryType.EXPENSE_OVERHEAD, color: "slate", icon: "Wrench" },
    { name: "Ремонт оборудования и ТО станков", type: CategoryType.EXPENSE_OVERHEAD, color: "stone", icon: "Cog" },

    // Коммерческие и административные (OPEX Офис)
    { name: "Реклама и маркетинг (Яндекс, Meta, 2ГИС)", type: CategoryType.EXPENSE_COMMERCIAL, color: "violet", icon: "Target" },
    { name: "Связь, интернет и софт", type: CategoryType.EXPENSE_COMMERCIAL, color: "sky", icon: "Wifi" },
    { name: "Зарплата офиса и менеджмента", type: CategoryType.EXPENSE_COMMERCIAL, color: "blue", icon: "Briefcase" },

    // Налоги и комиссии
    { name: "Банковские комиссии и эквайринг", type: CategoryType.EXPENSE_TAX, color: "slate", icon: "CreditCard" },
    { name: "Налоги и обязательные платежи", type: CategoryType.EXPENSE_TAX, color: "red", icon: "Landmark" },

    // Дивиденды партнеров
    { name: "Дивиденды Елисея", type: CategoryType.WITHDRAWAL, color: "orange", icon: "User" },
    { name: "Дивиденды Даниила", type: CategoryType.WITHDRAWAL, color: "blue", icon: "User" },
  ];

  for (const cat of defaultCategories) {
    const existing = await prisma.financeCategory.findFirst({
      where: { name: cat.name },
    });
    if (!existing) {
      await prisma.financeCategory.create({ data: cat });
      console.log(`✅ Created category: [${cat.type}] ${cat.name}`);
    }
  }

  // 4. Создание фондов компании
  const defaultFunds = [
    { name: "Резервный фонд (Подушка безопасности)", targetPercent: 10, balance: 0, color: "emerald" },
    { name: "Фонд нового оборудования и цеха", targetPercent: 10, balance: 0, color: "purple" },
    { name: "Налоговый резерв", targetPercent: 5, balance: 0, color: "rose" },
  ];

  for (const fund of defaultFunds) {
    const existing = await prisma.companyFund.findFirst({
      where: { name: fund.name },
    });
    if (!existing) {
      await prisma.companyFund.create({ data: fund });
      console.log(`✅ Created fund: ${fund.name} (${fund.targetPercent}%)`);
    }
  }

  // 5. Миграция существующих транзакций: привязка к основному счету
  if (primaryAccount) {
    const unlinkedCount = await prisma.dbTransaction.count({
      where: { accountId: null },
    });
    if (unlinkedCount > 0) {
      await prisma.dbTransaction.updateMany({
        where: { accountId: null },
        data: { accountId: primaryAccount.id },
      });
      console.log(`🔗 Linked ${unlinkedCount} historical transactions to account "${primaryAccount.name}"`);
    }
  }

  console.log("🎉 Finance System Migration & Seed successfully completed!");
}

main()
  .catch((e) => {
    console.error("❌ Migration error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
