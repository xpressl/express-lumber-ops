export type { ReceivingStatus, ReceivingLineStatus } from "@prisma/client";

export interface ReceivingRecordSummary {
  id: string;
  purchaseOrderId: string;
  poNumber: string;
  vendorName: string;
  status: string;
  totalLinesExpected: number;
  totalLinesReceived: number;
  hasDiscrepancy: boolean;
  receivedAt: string;
  locationId: string;
}

export interface ReceivingLineSummary {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  lineNumber: number;
  expectedQty: number;
  receivedQty: number;
  status: string;
  damageNotes: string | null;
}
