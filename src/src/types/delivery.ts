export type { PaymentType } from "@prisma/client";

export interface DeliveryProofSummary {
  id: string;
  stopId: string;
  signatureUrl: string | null;
  signedBy: string | null;
  photos: string[];
  notes: string | null;
  gpsLat: number;
  gpsLng: number;
  capturedAt: string;
}

export interface CODCollectionSummary {
  id: string;
  stopId: string;
  orderId: string;
  amountDue: number;
  amountCollected: number;
  paymentType: string;
  checkNumber: string | null;
  shortageAmount: number | null;
  shortageReason: string | null;
  collectedAt: string;
  verified: boolean;
}

export interface DriverLocation {
  driverId: string;
  lat: number;
  lng: number;
  timestamp: string;
}
