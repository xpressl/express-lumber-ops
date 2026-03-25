import { z } from "zod";

const addressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(2).max(2),
  zip: z.string().min(5),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const createCustomerSchema = z.object({
  accountNumber: z.string().min(1).max(20),
  companyName: z.string().min(1).max(200),
  dba: z.string().max(200).optional(),
  type: z.enum(["COMMERCIAL", "RESIDENTIAL", "CONTRACTOR", "GOVERNMENT"]),
  creditLimit: z.number().min(0).optional(),
  paymentTerms: z.string().optional(),
  taxExempt: z.boolean().optional(),
  taxId: z.string().optional(),
  defaultSalesRepId: z.string().optional(),
  billingAddress: addressSchema.optional(),
  shippingAddress: addressSchema.optional(),
  defaultDeliveryInstructions: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
  locationId: z.string().min(1),
});

export const updateCustomerSchema = createCustomerSchema.partial().omit({ locationId: true });

export const createContactSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  mobile: z.string().max(20).optional(),
  role: z.string().max(100).optional(),
  isPrimary: z.boolean().optional(),
  preferredContactMethod: z.enum(["phone", "email", "sms"]).optional(),
  notes: z.string().max(500).optional(),
});

export const createJobsiteSchema = z.object({
  name: z.string().min(1).max(200),
  address: addressSchema,
  gateCode: z.string().max(20).optional(),
  deliveryInstructions: z.string().max(500).optional(),
  contactName: z.string().max(100).optional(),
  contactPhone: z.string().max(20).optional(),
  notes: z.string().max(500).optional(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
