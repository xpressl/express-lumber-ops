import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createAuditEvent } from "@/lib/events/audit";
import type { POStatus } from "@prisma/client";

/** Create PO */
export async function createPO(input: {
  vendorId: string; expectedDate?: string; notes?: string; locationId: string;
  lines: Array<{ productId: string; quantity: number; unitCost: number; notes?: string }>;
}, actorId: string) {
  const poNumber = await generatePONumber();
  const totalAmount = input.lines.reduce((s, l) => s + l.quantity * l.unitCost, 0);

  const po = await prisma.purchaseOrder.create({
    data: {
      poNumber, vendorId: input.vendorId, status: "DRAFT", totalAmount,
      expectedDate: input.expectedDate ? new Date(input.expectedDate) : null,
      notes: input.notes, locationId: input.locationId, createdBy: actorId,
      lines: {
        create: input.lines.map((l, i) => ({
          productId: l.productId, lineNumber: i + 1,
          quantity: l.quantity, unitCost: l.unitCost,
          extendedCost: l.quantity * l.unitCost, notes: l.notes,
        })),
      },
    },
    include: { lines: true },
  });

  await createAuditEvent({
    actorId, actorName: "System", action: "purchasing.po_created",
    entityType: "PurchaseOrder", entityId: po.id, entityName: poNumber,
    locationId: input.locationId,
  });

  return po;
}

/** List POs */
export async function listPOs(params: { vendorId?: string; status?: string; locationId?: string }) {
  return prisma.purchaseOrder.findMany({
    where: {
      deletedAt: null,
      ...(params.vendorId ? { vendorId: params.vendorId } : {}),
      ...(params.status ? { status: params.status as POStatus } : {}),
      ...(params.locationId ? { locationId: params.locationId } : {}),
    },
    include: { vendor: { select: { name: true } }, _count: { select: { lines: true } } },
    orderBy: { createdAt: "desc" },
  });
}

/** List vendors */
export async function listVendors(params?: { search?: string; status?: string }) {
  return prisma.vendor.findMany({
    where: {
      deletedAt: null,
      ...(params?.search ? {
        OR: [
          { name: { contains: params.search, mode: "insensitive" as const } },
          { code: { contains: params.search, mode: "insensitive" as const } },
        ],
      } : {}),
      ...(params?.status ? { status: params.status as "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PROBATION" } : {}),
    },
    include: { _count: { select: { purchaseOrders: true, prices: true } } },
    orderBy: { name: "asc" },
  });
}

/** Get vendor detail with scorecard */
export async function getVendorById(vendorId: string) {
  return prisma.vendor.findUnique({
    where: { id: vendorId },
    include: {
      contacts: true,
      purchaseOrders: { take: 10, orderBy: { createdAt: "desc" } },
      prices: { where: { isActive: true }, take: 20, include: { product: { select: { sku: true, name: true } } } },
    },
  });
}

/** Get three-way match queue */
export async function getMatchQueue(locationId?: string) {
  return prisma.vendorInvoice.findMany({
    where: {
      matchStatus: { in: ["UNMATCHED", "PARTIAL"] },
      ...(locationId ? { locationId } : {}),
    },
    include: { vendor: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

/** List vendor claims */
export async function listClaims(vendorId?: string) {
  return prisma.vendorClaim.findMany({
    where: {
      ...(vendorId ? { vendorId } : {}),
      status: { in: ["OPEN", "INVESTIGATING"] },
    },
    include: { vendor: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

async function generatePONumber(): Promise<string> {
  const today = new Date();
  const prefix = `PO-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}`;
  const count = await prisma.purchaseOrder.count({ where: { poNumber: { startsWith: prefix } } });
  return `${prefix}-${String(count + 1).padStart(4, "0")}`;
}
