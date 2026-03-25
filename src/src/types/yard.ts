export type { YardTaskType, YardTaskStatus, PickupStatus } from "@prisma/client";

export interface YardTaskSummary {
  id: string;
  type: string;
  orderId: string | null;
  orderNumber: string | null;
  assignedTo: string | null;
  assigneeName: string | null;
  priority: number;
  status: string;
  bay: string | null;
  locationId: string;
  createdAt: string;
}

export interface PickupTicketSummary {
  id: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  status: string;
  lane: string | null;
  bay: string | null;
  arrivedAt: string | null;
  readyAt: string | null;
}
