import { apiHandler, jsonResponse } from "@/lib/middleware/api-handler";
import { validateBody } from "@/lib/middleware/validate";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { createAuditEvent } from "@/lib/events/audit";
import { z } from "zod";

const updateSettingSchema = z.object({
  locationId: z.string().min(1),
  key: z.string().min(1),
  value: z.unknown(),
  category: z.string().min(1),
  description: z.string().optional(),
});

export const GET = apiHandler(async (request) => {
  const url = new URL(request.url);
  const locationId = url.searchParams.get("locationId");
  const category = url.searchParams.get("category");

  const where: Record<string, unknown> = {};
  if (locationId) where["locationId"] = locationId;
  if (category) where["category"] = category;

  const settings = await prisma.branchSetting.findMany({ where, orderBy: [{ category: "asc" }, { key: "asc" }] });
  return jsonResponse(settings);
}, { permission: "admin.manage_settings" });

export const POST = apiHandler(async (request, { user }) => {
  const body = await updateSettingSchema.parseAsync(await request.json());

  const setting = await prisma.branchSetting.upsert({
    where: { locationId_key: { locationId: body.locationId, key: body.key } },
    update: { value: body.value as Prisma.InputJsonValue, description: body.description },
    create: {
      locationId: body.locationId,
      key: body.key,
      value: body.value as Prisma.InputJsonValue,
      category: body.category,
      description: body.description,
    },
  });

  await createAuditEvent({
    actorId: user.id,
    actorName: `${user.firstName} ${user.lastName}`,
    action: "branch_setting.updated",
    entityType: "BranchSetting",
    entityId: setting.id,
    entityName: body.key,
    locationId: body.locationId,
    after: { key: body.key, value: body.value } as Record<string, unknown>,
  });

  return jsonResponse(setting);
}, { permission: "admin.manage_settings" });
