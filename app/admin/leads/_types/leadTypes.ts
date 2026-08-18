import { LeadStatus, ClientRating, FileCategory } from "@prisma/client";

export interface LeadFile {
  id: string;
  url: string;
  name: string;
  size: number;
  mimeType: string;
  fileKey?: string;
  category?: FileCategory;
  createdAt?: string;
}

export interface LeadActivity {
  id: string;
  type: string;
  text?: string;
  title?: string;
  comment?: string | null;
  author: string | null;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  status: LeadStatus;
  rating?: ClientRating | null;
  offeredPrice?: number | null;
  isDiscounted?: boolean;
  revenue: number;
  expenses: number;
  prepayment: number;
  isPrepaymentPaid: boolean;
  isBalancePaid: boolean;
  appointmentDate: string | null;
  deadline: string | null;
  comment: string | null;
  source?: string | null;
  address: string | null;
  manager: string | null;
  message: string | null;
  calcDetails: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  yandexClientId: string | null;
  clientId: string | null;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: string;
    name: string;
    phone: string;
    companyName: string | null;
  } | null;
  estimate?: {
    id: string;
    items: Array<{
      id: string;
      name: string;
      unit: string;
      quantity: number;
      pricePerUnit: number;
      totalCost: number;
    }>;
    isStockDeducted: boolean;
  } | null;
  companyId?: string | null;
  company?: {
    id: string;
    name: string;
    binIin?: string | null;
    legalAddress?: string | null;
  } | null;
  projectId?: string | null;
  project?: {
    id: string;
    title: string;
    status: string;
  } | null;
  contactId?: string | null;
  contact?: {
    id: string;
    name: string;
    phone: string;
    position?: string | null;
  } | null;
  files?: LeadFile[];
  activities?: LeadActivity[];
}

export interface Company {
  id: string;
  name: string;
  binIin?: string | null;
  legalAddress?: string | null;
  bankAccount?: string | null;
  projects?: Array<{ id: string; title: string; status: string }>;
  contacts?: Array<{ id: string; name: string; phone: string; position?: string | null }>;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  companyName: string | null;
  notes: string | null;
  createdAt: string;
}

export interface SupplierPrice {
  id: string;
  name: string;
  supplier: string;
  price: number;
  unit: any;
}

export interface WarehouseItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: any;
}
