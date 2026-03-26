import { prisma } from "@/lib/prisma";

/** Aggregate coverage gap statistics by type and severity */
export async function getCoverageStats() {
  const gaps = await prisma.coverageGap.findMany({
    where: { status: { not: "RESOLVED" } },
    select: { gapType: true, severity: true },
  });

  const byType: Record<string, number> = {};
  const bySeverity: Record<string, number> = {};

  for (const gap of gaps) {
    byType[gap.gapType] = (byType[gap.gapType] ?? 0) + 1;
    bySeverity[gap.severity] = (bySeverity[gap.severity] ?? 0) + 1;
  }

  return { byType, bySeverity, total: gaps.length };
}

/** List coverage gaps with filters and related data */
export async function listCoverageGaps(filters?: {
  gapType?: string;
  severity?: string;
  status?: string;
  locationId?: string;
}) {
  return prisma.coverageGap.findMany({
    where: {
      ...(filters?.gapType ? { gapType: filters.gapType as never } : {}),
      ...(filters?.severity ? { severity: filters.severity as never } : {}),
      ...(filters?.status
        ? { status: filters.status as never }
        : { status: { not: "RESOLVED" as never } }),
      ...(filters?.locationId ? { locationId: filters.locationId } : {}),
    },
    include: {
      task: { select: { id: true, name: true, category: true } },
      roleTemplate: { select: { id: true, title: true } },
      user: { select: { id: true, firstName: true, lastName: true } },
      orgUnit: { select: { id: true, name: true, code: true } },
      location: { select: { id: true, name: true, code: true } },
    },
    orderBy: [{ severity: "desc" }, { createdAt: "desc" }],
  });
}

/** List hiring requests with filters and related data */
export async function listHiringRequests(filters?: {
  status?: string;
  urgency?: string;
  locationId?: string;
}) {
  return prisma.hiringRequest.findMany({
    where: {
      ...(filters?.status
        ? { status: filters.status as never }
        : { status: { notIn: ["FILLED", "CANCELLED"] } }),
      ...(filters?.urgency ? { urgency: filters.urgency as never } : {}),
      ...(filters?.locationId ? { locationId: filters.locationId } : {}),
    },
    include: {
      location: { select: { id: true, name: true, code: true } },
      orgUnit: { select: { id: true, name: true, code: true } },
      roleTemplate: { select: { id: true, title: true } },
      linkedGap: {
        select: { id: true, gapType: true, severity: true, summary: true },
      },
    },
    orderBy: [{ urgency: "desc" }, { createdAt: "desc" }],
  });
}

/** Build data for the RACI responsibility matrix view */
export async function getMatrixData(filters?: {
  locationId?: string;
  category?: string;
}) {
  const [tasks, roles] = await Promise.all([
    prisma.businessTask.findMany({
      where: {
        deletedAt: null,
        status: "ACTIVE",
        ...(filters?.category ? { category: filters.category } : {}),
      },
      include: {
        assignments: {
          include: {
            roleTemplate: { select: { id: true, title: true } },
            user: { select: { id: true, firstName: true, lastName: true } },
            location: { select: { id: true, name: true, code: true } },
          },
          ...(filters?.locationId
            ? { where: { locationId: filters.locationId } }
            : {}),
        },
      },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    }),
    prisma.roleTemplate.findMany({
      where: { deletedAt: null, status: "ACTIVE" },
      select: { id: true, title: true, orgUnitId: true },
      orderBy: { title: "asc" },
    }),
  ]);

  return { tasks, roles };
}
