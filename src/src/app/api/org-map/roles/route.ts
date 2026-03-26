import { apiHandler, jsonResponse, createdResponse } from "@/lib/middleware/api-handler";
import { validateBody } from "@/lib/middleware/validate";
import { listRoleTemplates, createRoleTemplate } from "@/lib/services/role-template.service";
import { z } from "zod";

const createRoleSchema = z.object({
  title: z.string().min(1),
  orgUnitId: z.string().optional(),
  summary: z.string().optional(),
  mission: z.string().optional(),
  criticality: z.string().optional(),
  targetHeadcount: z.number().int().optional(),
  status: z.string().optional(),
});

export const GET = apiHandler(async (request) => {
  const url = new URL(request.url);
  const result = await listRoleTemplates({
    orgUnitId: url.searchParams.get("orgUnitId") ?? undefined,
    status: url.searchParams.get("status") ?? undefined,
    search: url.searchParams.get("search") ?? undefined,
  });
  return jsonResponse(result);
}, { permission: "admin.manage_users" });

export const POST = apiHandler(async (request, { user }) => {
  const body = await validateBody(request, createRoleSchema);
  const role = await createRoleTemplate(body, user.id);
  return createdResponse(role);
}, { permission: "admin.manage_users" });
