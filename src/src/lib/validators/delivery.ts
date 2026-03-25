import { z } from "zod";

export const capturePodsSchema = z.object({
  signatureDataUrl: z.string().optional(),
  signedBy: z.string().max(100).optional(),
  photos: z.array(z.string()).optional(),
  notes: z.string().max(1000).optional(),
  gpsLat: z.number().min(-90).max(90),
  gpsLng: z.number().min(-180).max(180),
});

export const captureCodSchema = z.object({
  amountDue: z.number().min(0),
  amountCollected: z.number().min(0),
  paymentType: z.enum(["CASH", "CHECK", "CREDIT_CARD", "OTHER"]),
  checkNumber: z.string().max(50).optional(),
  shortageReason: z.string().max(500).optional(),
  refusalReason: z.string().max(500).optional(),
  proofPhotoUrl: z.string().optional(),
});

export const completeStopSchema = z.object({
  outcome: z.enum(["DELIVERED", "PARTIAL", "REFUSED", "NO_ANSWER", "SITE_CLOSED", "RESCHEDULED", "DAMAGED", "LEFT_ON_SITE"]),
  notes: z.string().max(1000).optional(),
});

export const updateDriverLocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const escalateIssueSchema = z.object({
  description: z.string().min(1).max(1000),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  photos: z.array(z.string()).optional(),
});

export type CapturePodInput = z.infer<typeof capturePodsSchema>;
export type CaptureCodInput = z.infer<typeof captureCodSchema>;
