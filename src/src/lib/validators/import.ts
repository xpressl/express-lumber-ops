import { z } from "zod";

export const uploadImportSchema = z.object({
  type: z.enum(["ORDERS", "CUSTOMERS", "INVOICES", "AR_AGING", "VENDOR_PRICES", "PRODUCTS", "INVENTORY", "QUOTES"]),
  fileName: z.string().min(1),
  fileUrl: z.string().min(1),
  locationId: z.string().min(1),
});

export const applyMappingSchema = z.object({
  mappingTemplateId: z.string().optional(),
  fieldMappings: z.record(z.string(), z.string()),
});

export const approveImportSchema = z.object({
  approvedRowIds: z.array(z.string()).optional(),
  rejectedRowIds: z.array(z.string()).optional(),
  notes: z.string().max(500).optional(),
});

export const saveMappingTemplateSchema = z.object({
  name: z.string().min(1).max(100),
  importType: z.enum(["ORDERS", "CUSTOMERS", "INVOICES", "AR_AGING", "VENDOR_PRICES", "PRODUCTS", "INVENTORY", "QUOTES"]),
  fieldMappings: z.record(z.string(), z.string()),
});

export type UploadImportInput = z.infer<typeof uploadImportSchema>;
