import { z } from "zod";

export const importVendorPricesSchema = z.object({
  vendorId: z.string().min(1),
  effectiveDate: z.string().datetime(),
  fileUrl: z.string().min(1),
});

export const updateSellPriceSchema = z.object({
  newSellPrice: z.number().min(0),
  reason: z.string().max(500).optional(),
});

export const quoteSimulatorSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().min(0.01),
    overridePrice: z.number().min(0).optional(),
  })).min(1),
  customerId: z.string().optional(),
});

export const createPOSchema = z.object({
  vendorId: z.string().min(1),
  expectedDate: z.string().datetime().optional(),
  notes: z.string().max(1000).optional(),
  locationId: z.string().min(1),
  lines: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().min(0.01),
    unitCost: z.number().min(0),
    notes: z.string().max(500).optional(),
  })).min(1),
});

export const createRFQSchema = z.object({
  vendorIds: z.array(z.string().min(1)).min(1),
  products: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().min(0.01),
    notes: z.string().max(500).optional(),
  })).min(1),
  dueDate: z.string().datetime().optional(),
  notes: z.string().max(1000).optional(),
});

export type CreatePOInput = z.infer<typeof createPOSchema>;
