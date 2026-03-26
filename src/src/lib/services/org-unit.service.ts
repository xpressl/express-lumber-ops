import { prisma } from "@/lib/prisma";

/** Nested include for 5-level org tree (COMPANY > REGION > BRANCH > DEPARTMENT > TEAM) */
const headSelect = { select: { id: true, firstName: true, lastName: true } } as const;
const locationSelect = { select: { id: true, name: true, code: true } } as const;
const countSelect = { select: { roleTemplates: true, coverageGaps: true, hiringRequests: true } } as const;

const childInclude = {
  head: headSelect,
  location: locationSelect,
  _count: countSelect,
} as const;

const unitInclude = {
  head: headSelect,
  location: locationSelect,
  _count: countSelect,
  children: {
    where: { deletedAt: null },
    include: {
      ...childInclude,
      children: {
        where: { deletedAt: null },
        include: {
          ...childInclude,
          children: {
            where: { deletedAt: null },
            include: {
              ...childInclude,
              children: {
                where: { deletedAt: null },
                include: childInclude,
              },
            },
          },
        },
      },
    },
  },
} as const;

/** Fetch the full org tree starting from root units */
export async function getOrgTree(filters?: {
  type?: string;
  locationId?: string;
  status?: string;
}) {
  return prisma.organizationUnit.findMany({
    where: {
      parentId: null,
      deletedAt: null,
      ...(filters?.type ? { type: filters.type as never } : {}),
      ...(filters?.locationId ? { locationId: filters.locationId } : {}),
      ...(filters?.status
        ? { status: filters.status as never }
        : { status: "ACTIVE" }),
    },
    include: unitInclude,
    orderBy: { sortOrder: "asc" },
  });
}

/** Aggregate stats for the org map dashboard */
export async function getOrgStats() {
  const [totalUnits, activeRoles, coverageGaps, hiringRequests] =
    await Promise.all([
      prisma.organizationUnit.count({
        where: { deletedAt: null, status: "ACTIVE" },
      }),
      prisma.roleTemplate.count({
        where: { deletedAt: null, status: "ACTIVE" },
      }),
      prisma.coverageGap.count({
        where: { status: "OPEN" },
      }),
      prisma.hiringRequest.count({
        where: { status: { notIn: ["FILLED", "CANCELLED"] } },
      }),
    ]);

  return { totalUnits, activeRoles, coverageGaps, hiringRequests };
}

/** Get a single org unit with full related data */
export async function getUnitDetail(unitId: string) {
  return prisma.organizationUnit.findUnique({
    where: { id: unitId },
    include: {
      head: headSelect,
      location: locationSelect,
      parent: { include: { head: headSelect } },
      children: {
        where: { deletedAt: null },
        include: { head: headSelect },
        orderBy: { sortOrder: "asc" },
      },
      roleTemplates: {
        where: { deletedAt: null },
        include: { requiredSkills: { include: { skill: true } } },
      },
      coverageGaps: {
        where: { status: { not: "RESOLVED" } },
      },
      hiringRequests: {
        where: { status: { notIn: ["FILLED", "CANCELLED"] } },
      },
    },
  });
}

/** Create a new organization unit */
export async function createOrgUnit(
  data: {
    parentId?: string;
    type: string;
    name: string;
    code: string;
    description?: string;
    headId?: string;
    locationId?: string;
  },
  createdBy: string,
) {
  return prisma.organizationUnit.create({
    data: {
      parentId: data.parentId,
      type: data.type as never,
      name: data.name,
      code: data.code,
      description: data.description,
      headId: data.headId,
      locationId: data.locationId,
      createdBy,
    },
    include: {
      head: headSelect,
      location: locationSelect,
      parent: true,
    },
  });
}

/** Update an existing organization unit */
export async function updateOrgUnit(
  id: string,
  data: Partial<{
    parentId: string;
    type: string;
    name: string;
    code: string;
    description: string;
    headId: string;
    locationId: string;
    status: string;
    sortOrder: number;
  }>,
) {
  return prisma.organizationUnit.update({
    where: { id },
    data: {
      ...data,
      type: data.type ? (data.type as never) : undefined,
      status: data.status ? (data.status as never) : undefined,
    },
    include: {
      head: headSelect,
      location: locationSelect,
      parent: true,
    },
  });
}
