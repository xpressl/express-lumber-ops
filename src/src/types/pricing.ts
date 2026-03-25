export type { ProductStatus, VendorStatus, POStatus } from "@prisma/client";

export interface ProductPricingSummary {
  id: string;
  sku: string;
  name: string;
  uom: string;
  currentCost: number;
  currentSell: number;
  marginPercent: number | null;
  primaryVendorName: string | null;
  status: string;
}

export interface CostChangeSummary {
  id: string;
  productId: string;
  sku: string;
  productName: string;
  oldCost: number;
  newCost: number;
  changePercent: number;
  source: string;
  vendorName: string | null;
  effectiveAt: string;
}

export interface VendorScorecard {
  id: string;
  code: string;
  name: string;
  reliabilityScore: number | null;
  fillRate: number | null;
  costVolatility: number | null;
  activePOs: number;
  totalProducts: number;
}
