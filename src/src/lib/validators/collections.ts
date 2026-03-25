import { z } from "zod";

export const logCallSchema = z.object({
  type: z.enum(["CALL", "EMAIL", "LETTER", "VISIT", "SMS"]),
  direction: z.enum(["INBOUND", "OUTBOUND"]),
  contactMethod: z.string().max(50).optional(),
  outcome: z.enum(["REACHED", "VOICEMAIL", "NO_ANSWER", "BUSY", "WRONG_NUMBER", "PROMISE", "DISPUTE", "PAYMENT"]),
  notes: z.string().max(2000).optional(),
  followUpDate: z.string().datetime().optional(),
  promiseAmount: z.number().min(0).optional(),
});

export const createPromiseSchema = z.object({
  amount: z.number().min(0.01),
  promiseDate: z.string().datetime(),
  notes: z.string().max(500).optional(),
});

export const updatePromiseSchema = z.object({
  status: z.enum(["KEPT", "BROKEN", "PARTIAL", "CANCELLED"]),
  paymentReceived: z.number().min(0).optional(),
  notes: z.string().max(500).optional(),
});

export const createDisputeSchema = z.object({
  invoiceId: z.string().optional(),
  amount: z.number().min(0.01),
  reason: z.string().min(1).max(1000),
  notes: z.string().max(2000).optional(),
  attachments: z.array(z.string()).optional(),
});

export const createPaymentPlanSchema = z.object({
  totalAmount: z.number().min(0.01),
  installments: z.number().int().min(2).max(24),
  frequency: z.enum(["WEEKLY", "BIWEEKLY", "MONTHLY"]),
  startDate: z.string().datetime(),
  notes: z.string().max(500).optional(),
});

export const recommendHoldSchema = z.object({
  reason: z.string().min(1).max(500),
});

export type LogCallInput = z.infer<typeof logCallSchema>;
export type CreatePromiseInput = z.infer<typeof createPromiseSchema>;
