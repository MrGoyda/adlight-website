import { 
  TransactionType, 
  AccountType, 
  CategoryType, 
  PartnerName 
} from "@prisma/client";

export interface FinanceAccountItem {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  isDefault: boolean;
  color: string;
  icon?: string | null;
  isArchived: boolean;
  transactionsCount?: number;
}

export interface FinanceCategoryItem {
  id: string;
  name: string;
  type: CategoryType;
  color: string;
  icon?: string | null;
  parentId?: string | null;
  isArchived: boolean;
  totalSpent?: number;
}

export interface CompanyFundItem {
  id: string;
  name: string;
  targetPercent: number;
  balance: number;
  color: string;
}

export interface FinanceTransactionItem {
  id: string;
  createdAt: string;
  transactionDate: string;
  type: TransactionType;
  amount: number;
  description: string;
  partner?: PartnerName | null;
  accountId?: string | null;
  account?: {
    id: string;
    name: string;
    type: AccountType;
    color: string;
  } | null;
  targetAccountId?: string | null;
  targetAccount?: {
    id: string;
    name: string;
    type: AccountType;
    color: string;
  } | null;
  categoryId?: string | null;
  category?: {
    id: string;
    name: string;
    type: CategoryType;
    color: string;
    icon?: string | null;
  } | null;
  leadId?: string | null;
  lead?: {
    id: string;
    name: string;
    phone: string;
  } | null;
  receiptUrl?: string | null;
}

export type FinancePeriod = 
  | "TODAY" 
  | "YESTERDAY" 
  | "THIS_WEEK" 
  | "THIS_MONTH" 
  | "LAST_MONTH" 
  | "THIS_QUARTER" 
  | "THIS_YEAR" 
  | "ALL";

export interface FinanceAnalyticsSummary {
  period: FinancePeriod;
  totalRevenue: number;          // Общая выручка (Поступления от клиентов)
  totalDirectExpenses: number;   // Прямые затраты цеха (COGS)
  grossProfit: number;           // Валовая прибыль (Выручка - Прямые)
  grossMarginPercent: number;    // Рентабельность валовая %
  totalOverheadExpenses: number; // Накладные цеха (OPEX Цех)
  totalCommercialExpenses: number; // Маркетинг, офис (OPEX Офис)
  totalTaxes: number;            // Налоги и банковские комиссии
  totalExpenses: number;         // Все расходы
  netProfit: number;             // Чистая операционная прибыль
  netMarginPercent: number;      // Чистая рентабельность %
  categoryBreakdown: {
    id: string;
    name: string;
    type: CategoryType;
    amount: number;
    percent: number;
    color: string;
  }[];
}

export interface ProjectFinanceUnit {
  leadId: string;
  leadName: string;
  phone: string;
  status: string;
  contractPrice: number;       // Стоимость по договору
  estimatedCost: number;       // Плановая себестоимость по смете
  plannedMargin: number;       // Плановая маржа
  plannedMarginPercent: number;
  paidByClient: number;        // Фактически оплачено клиентом
  actualDirectExpenses: number;// Фактические списания цеха
  actualMargin: number;        // Фактическая маржа
  actualMarginPercent: number;
  deltaCost: number;           // Перерасход/экономия (Факт - План себестоимости)
  transactions: FinanceTransactionItem[];
}

export interface PartnerEquityBreakdown {
  partner: PartnerName;
  name: string;
  sharePercent: number;        // 50%
  earnedShare: number;         // Начисленная доля прибыли
  withdrawnTotal: number;      // Фактически выведено
  availableBalance: number;    // Доступно к выводу
}
