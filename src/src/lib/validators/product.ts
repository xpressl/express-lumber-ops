import { z } from "zod";

export const createProductSchema = z.object({
  sku: z.string().min(1).max(50),
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  categoryId: z.string().optional(),
  uom: z.string().min(1).max(10),
  isRandomLength: z.boolean().optional(),
  weight: z.number().min(0).optional(),
  currentCost: z.number().min(0),
  currentSell: z.number().min(0),
  primaryVendorId: z.string().optional(),
  status: z.enum(["ACTIVE", "DISCONTINUED", "SPECIAL_ORDER"]).optional(),
  minOrderQty: z.number().min(0).optional(),
  leadTimeDays: z.number().int().min(0).optional(),
  locationId: z.string().min(1),
});

export const updateProductSchema = createProductSchema.partial().omit({ locationId: true });

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  parentId: z.string().optional(),
  description: z.string().max(500).optional(),
  sortOrder: z.number().int().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
