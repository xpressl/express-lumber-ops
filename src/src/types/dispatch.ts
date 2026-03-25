export type { TruckType, TruckStatus, RouteStatus, StopStatus, StopOutcome } from "@prisma/client";

export interface TruckSummary {
  id: string;
  number: string;
  name: string | null;
  type: string;
  maxWeight: number;
  maxPieces: number | null;
  maxLength: number | null;
  status: string;
  currentDriverId: string | null;
  currentDriverName: string | null;
  locationId: string;
}

export interface RouteSummary {
  id: string;
  routeNumber: string;
  date: string;
  truckNumber: string;
  driverName: string;
  status: string;
  totalStops: number;
  completedStops: number;
  totalWeight: number | null;
  estimatedMiles: number | null;
  locationId: string;
}

export interface RouteStopSummary {
  id: string;
  sequence: number;
  orderId: string;
  orderNumber: string;
  customerName: string;
  address: Record<string, string>;
  status: string;
  outcome: string | null;
  estimatedArrival: string | null;
  appointmentWindow: string | null;
}
