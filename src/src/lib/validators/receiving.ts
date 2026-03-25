import { z } from "zod";

export const startReceivingSchema = z.object({
  purchaseOrderId: z.string().min(1),
  locationId: z.string().min(1),
});

export const receiveLineSchema = z.object({
  receivedQty: z.number().min(0),
  status: z.enum(["RECEIVED", "SHORT", "OVER", "DAMAGED", "SUBSTITUTE", "REJECTED"]),
  damageNotes: z.string().max(500).optional(),
  photos: z.array(z.string()).optional(),
  notes: z.string().max(500).optional(),
});

export const resolveDiscrepancySchema = z.object({
  resolution: z.string().min(1).max(500),
  adjustInventory: z.boolean().optional(),
  createVendorIssue: z.boolean().optional(),
});

export const createVendorIssueSchema = z.object({
  vendorId: z.string().min(1),
  type: z.enum(["SHORT_SHIP", "DAMAGE", "WRONG_ITEM", "QUALITY", "PRICING"]),
  description: z.string().min(1).max(1000),
  amount: z.number().min(0).optional(),
  attachments: z.array(z.string()).optional(),
});

export type ReceiveLineInput = z.infer<typeof receiveLineSchema>;
