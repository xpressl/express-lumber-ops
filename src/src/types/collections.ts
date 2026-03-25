export type { CollectionStatus, PromiseStatus, DisputeStatus } from "@prisma/client";

export interface CollectionAccountSummary {
  id: string;
  customerId: string;
  customerName: string;
  status: string;
  currentBalance: number;
  agingCurrent: number;
  aging30: number;
  aging60: number;
  aging90: number;
  aging120Plus: number;
  collectorName: string | null;
  lastContactDate: string | null;
  nextActionDate: string | null;
  nextActionNote: string | null;
  promiseReliabilityScore: number | null;
  holdRecommended: boolean;
}

export interface PromiseSummary {
  id: string;
  amount: number;
  promiseDate: string;
  status: string;
  paymentReceived: number | null;
  notes: string | null;
}

export interface DisputeSummary {
  id: string;
  invoiceId: string | null;
  amount: number;
  reason: string;
  status: string;
  ownerName: string | null;
  createdAt: string;
}
