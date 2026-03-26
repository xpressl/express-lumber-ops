import { prisma } from "@/lib/prisma";

/** List business tasks with filters and pagination */
export async function listBusinessTasks(filters?: {
  category?: string;
  processArea?: string;
  status?: string;
  isCritical?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 20;
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
    ...(filters?.category ? { category: filters.category } : {}),
    ...(filters?.processArea ? { processArea: filters.processArea } : {}),
    ...(filters?.status ? { status: filters.status as never } : {}),
    ...(filters?.isCritical !== undefined
      ? { isCritical: filters.isCritical }
      : {}),
    ...(filters?.search
      ? { name: { contains: filters.search, mode: "insensitive" as const } }
      : {}),
  };

  const [data, total] = await Promise.all([
    prisma.businessTask.findMany({
      where,
      include: {
        assignments: {
          include: {
            roleTemplate: {
              select: { id: true, title: true },
            },
            user: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
        _count: { select: { permissionReqs: true, coverageGaps: true } },
      },
      skip,
      take: limit,
      orderBy: [{ isCritical: "desc" }, { name: "asc" }],
    }),
    prisma.businessTask.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

/** Get a single business task with full related data */
export async function getBusinessTaskDetail(id: string) {
  return prisma.businessTask.findUnique({
    where: { id },
    include: {
      assignments: {
        include: {
          roleTemplate: { select: { id: true, title: true } },
          user: { select: { id: true, firstName: true, lastName: true } },
          location: { select: { id: true, name: true, code: true } },
        },
      },
      permissionReqs: true,
      coverageGaps: true,
    },
  });
}

/** Create a new business task */
export async function createBusinessTask(
  data: {
    name: string;
    category: string;
    processArea: string;
    description?: string;
    frequency: string;
    riskLevel?: string;
    isCritical?: boolean;
  },
  createdBy: string,
) {
  return prisma.businessTask.create({
    data: {
      name: data.name,
      category: data.category,
      processArea: data.processArea,
      description: data.description,
      frequency: data.frequency as never,
      riskLevel: data.riskLevel ? (data.riskLevel as never) : undefined,
      isCritical: data.isCritical ?? false,
      createdBy,
    },
  });
}

/** Update an existing business task */
export async function updateBusinessTask(
  id: string,
  data: Partial<{
    name: string;
    category: string;
    processArea: string;
    description: string;
    frequency: string;
    riskLevel: string;
    isCritical: boolean;
    status: string;
  }>,
) {
  return prisma.businessTask.update({
    where: { id },
    data: {
      ...data,
      frequency: data.frequency ? (data.frequency as never) : undefined,
      riskLevel: data.riskLevel ? (data.riskLevel as never) : undefined,
      status: data.status ? (data.status as never) : undefined,
    },
  });
}

/** Create a task assignment (RACI entry) */
export async function assignTask(
  data: {
    taskId: string;
    roleTemplateId?: string;
    userId?: string;
    locationId?: string;
    assignmentType: string;
    isPrimary?: boolean;
    isTemporary?: boolean;
    notes?: string;
  },
  createdBy: string,
) {
  return prisma.taskAssignment.create({
    data: {
      taskId: data.taskId,
      roleTemplateId: data.roleTemplateId,
      userId: data.userId,
      locationId: data.locationId,
      assignmentType: data.assignmentType as never,
      isPrimary: data.isPrimary ?? true,
      isTemporary: data.isTemporary ?? false,
      notes: data.notes,
      createdBy,
    },
    include: {
      task: { select: { id: true, name: true } },
      roleTemplate: { select: { id: true, title: true } },
      user: { select: { id: true, firstName: true, lastName: true } },
    },
  });
}

/** Remove a task assignment */
export async function removeAssignment(assignmentId: string) {
  return prisma.taskAssignment.delete({
    where: { id: assignmentId },
  });
}
