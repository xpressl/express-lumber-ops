export type { LeadStatus, EstimateStatus } from "@prisma/client";

export interface LeadSummary {
  id: string;
  companyName: string;
  contactName: string;
  email: string | null;
  phone: string | null;
  source: string | null;
  status: string;
  assignedTo: string | null;
  assigneeName: string | null;
  createdAt: string;
}

export interface EstimateSummary {
  id: string;
  estimateNumber: string;
  customerName: string | null;
  leadName: string | null;
  salesRepName: string;
  jobName: string | null;
  status: string;
  totalAmount: number;
  marginPercent: number | null;
  expiresAt: string | null;
  followUpDate: string | null;
  createdAt: string;
}
