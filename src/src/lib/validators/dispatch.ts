import { z } from "zod";

export const assignTruckSchema = z.object({
  truckId: z.string().min(1),
  orderIds: z.array(z.string().min(1)).min(1),
});

export const createRouteSchema = z.object({
  date: z.string().datetime(),
  truckId: z.string().min(1),
  driverId: z.string().min(1),
  orderIds: z.array(z.string().min(1)).min(1),
  routeNotes: z.string().max(1000).optional(),
});

export const reorderStopsSchema = z.object({
  stopIds: z.array(z.string().min(1)).min(1),
});

export const dispatchChecklistSchema = z.object({
  routeId: z.string().min(1),
  truckInspected: z.boolean(),
  loadVerified: z.boolean(),
  documentsReady: z.boolean(),
  driverBriefed: z.boolean(),
  notes: z.string().max(500).optional(),
});

export const createTruckSchema = z.object({
  number: z.string().min(1).max(20),
  name: z.string().max(100).optional(),
  type: z.enum(["FLATBED", "BOX", "BOOM", "PICKUP", "MOFFETT"]),
  maxWeight: z.number().min(0),
  maxPieces: z.number().int().min(0).optional(),
  maxBundles: z.number().int().min(0).optional(),
  maxLength: z.number().min(0).optional(),
  axleCount: z.number().int().min(2).optional(),
  hasLiftgate: z.boolean().optional(),
  hasMoffett: z.boolean().optional(),
  locationId: z.string().min(1),
});

export type AssignTruckInput = z.infer<typeof assignTruckSchema>;
export type CreateRouteInput = z.infer<typeof createRouteSchema>;
