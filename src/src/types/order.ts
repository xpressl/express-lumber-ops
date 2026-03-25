export type { OrderType, OrderStatus, ItemReadyStatus } from "@prisma/client";

export interface OrderSummary {
  id: string;
  orderNumber: string;
  type: string;
  status: string;
  customerName: string;
  customerId: string;
  requestedDate: string;
  totalAmount: number | null;
  totalPieces: number | null;
  readinessPercent: number;
  locationId: string;
  createdAt: string;
}

export interface OrderDetail extends OrderSummary {
  customerPO: string | null;
  jobsiteName: string | null;
  deliveryAddress: Record<string, string> | null;
  contactName: string | null;
  contactPhone: string | null;
  salesRepId: string | null;
  appointmentFlag: boolean;
  appointmentWindow: string | null;
  codFlag: boolean;
  codAmount: number | null;
  holdReasons: string[];
  specialInstructions: string | null;
  internalNotes: string | null;
  totalWeight: number | null;
  marginPercent: number | null;
  items: OrderItemDetail[];
}

export interface OrderItemDetail {
  id: string;
  productId: string;
  lineNumber: number;
  description: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  unitCost: number;
  extendedPrice: number;
  length: number | null;
  weight: number | null;
  readyStatus: string;
  substitutionAllowed: boolean;
  issueFlag: boolean;
  issueNote: string | null;
  notes: string | null;
}
