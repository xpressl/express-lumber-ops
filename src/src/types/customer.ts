export type { CustomerType, CustomerStatus } from "@prisma/client";

export interface CustomerSummary {
  id: string;
  accountNumber: string;
  companyName: string;
  dba: string | null;
  type: string;
  status: string;
  creditLimit: number;
  currentBalance: number;
  paymentTerms: string;
  locationId: string;
}

export interface CustomerDetail extends CustomerSummary {
  taxExempt: boolean;
  taxId: string | null;
  defaultSalesRepId: string | null;
  billingAddress: Address | null;
  shippingAddress: Address | null;
  defaultDeliveryInstructions: string | null;
  notes: string | null;
  contacts: CustomerContact[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  role: string | null;
  isPrimary: boolean;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  lat?: number;
  lng?: number;
}
