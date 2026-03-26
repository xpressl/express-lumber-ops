import { prisma } from "@/lib/prisma";

/** List role templates with filters */
export async function listRoleTemplates(filters?: {
  orgUnitId?: string;
  status?: string;
  search?: string;
}) {
  return prisma.roleTemplate.findMany({
    where: {
      deletedAt: null,
      ...(filters?.orgUnitId ? { orgUnitId: filters.orgUnitId } : {}),
      ...(filters?.status ? { status: filters.status as never } : {}),
      ...(filters?.search
        ? { title: { contains: filters.search, mode: "insensitive" as const } }
        : {}),
    },
    include: {
      orgUnit: { select: { id: true, name: true, code: true, type: true } },
      requiredSkills: { include: { skill: true } },
      _count: { select: { taskAssignments: true, coverageGaps: true } },
    },
    orderBy: { title: "asc" },
  });
}

/** Get a single role template with all related data */
export async function getRoleTemplateDetail(id: string) {
  return prisma.roleTemplate.findUnique({
    where: { id },
    include: {
      orgUnit: { select: { id: true, name: true, code: true, type: true } },
      requiredSkills: { include: { skill: true } },
      taskAssignments: {
        include: {
          task: true,
          user: { select: { id: true, firstName: true, lastName: true } },
        },
      },
      coverageGaps: true,
      hiringRequests: true,
      permissionReqs: true,
    },
  });
}

/** Create a new role template */
export async function createRoleTemplate(
  data: {
    title: string;
    orgUnitId?: string;
    summary?: string;
    mission?: string;
    criticality?: string;
    targetHeadcount?: number;
    status?: string;
  },
  createdBy: string,
) {
  return prisma.roleTemplate.create({
    data: {
      title: data.title,
      orgUnitId: data.orgUnitId,
      summary: data.summary,
      mission: data.mission,
      criticality: data.criticality ? (data.criticality as never) : undefined,
      targetHeadcount: data.targetHeadcount,
      status: data.status ? (data.status as never) : undefined,
      createdBy,
    },
    include: {
      orgUnit: { select: { id: true, name: true, code: true, type: true } },
      requiredSkills: { include: { skill: true } },
    },
  });
}

/** Update an existing role template */
export async function updateRoleTemplate(
  id: string,
  data: Partial<{
    title: string;
    orgUnitId: string;
    summary: string;
    mission: string;
    criticality: string;
    targetHeadcount: number;
    status: string;
    backupExpectations: string;
  }>,
) {
  return prisma.roleTemplate.update({
    where: { id },
    data: {
      ...data,
      criticality: data.criticality ? (data.criticality as never) : undefined,
      status: data.status ? (data.status as never) : undefined,
    },
    include: {
      orgUnit: { select: { id: true, name: true, code: true, type: true } },
      requiredSkills: { include: { skill: true } },
    },
  });
}
