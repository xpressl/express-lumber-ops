import { z } from "zod";

export const createLeadSchema = z.object({
  companyName: z.string().min(1).max(200),
  contactName: z.string().min(1).max(100),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  source: z.string().max(50).optional(),
  notes: z.string().max(2000).optional(),
  locationId: z.string().min(1),
});

export const updateLeadSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "ESTIMATE_SENT", "FOLLOW_UP", "NEGOTIATION", "WON", "LOST"]).optional(),
  assignedTo: z.string().optional(),
  notes: z.string().max(2000).optional(),
  lostReason: z.string().max(500).optional(),
});

export const createEstimateSchema = z.object({
  customerId: z.string().optional(),
  leadId: z.string().optional(),
  jobName: z.string().max(200).optional(),
  jobAddress: z.string().max(500).optional(),
  expiresAt: z.string().datetime().optional(),
  notes: z.string().max(2000).optional(),
  locationId: z.string().min(1),
  lines: z.array(z.object({
    productId: z.string().optional(),
    description: z.string().min(1).max(500),
    quantity: z.number().min(0.01),
    uom: z.string().min(1),
    unitPrice: z.number().min(0),
    notes: z.string().max(500).optional(),
  })).min(1),
});

export const updateEstimateSchema = z.object({
  status: z.enum(["DRAFT", "SENT", "VIEWED", "FOLLOW_UP", "ACCEPTED", "DECLINED", "EXPIRED"]).optional(),
  followUpDate: z.string().datetime().optional(),
  lostReason: z.string().max(500).optional(),
  lostNotes: z.string().max(2000).optional(),
  notes: z.string().max(2000).optional(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type CreateEstimateInput = z.infer<typeof createEstimateSchema>;
