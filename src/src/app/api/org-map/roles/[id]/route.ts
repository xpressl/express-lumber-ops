import { apiHandler, jsonResponse } from "@/lib/middleware/api-handler";
import { validateBody } from "@/lib/middleware/validate";
import { getRoleTemplateDetail, updateRoleTemplate } from "@/lib/services/role-template.service";
import { NotFoundError } from "@/lib/middleware/error-handler";
import { z } from "zod";

const updateRoleSchema = z.object({
  title: z.string().min(1).optional(),
  orgUnitId: z.string().optional(),
  summary: z.string().optional(),
  mission: z.string().optional(),
  criticality: z.string().optional(),
  targetHeadcount: z.number().int().optional(),
  status: z.string().optional(),
});

export const GET = apiHandler(async (_request, { params }) => {
  const id = params?.["id"];
  if (!id) throw new NotFoundError("RoleTemplate");
  const role = await getRoleTemplateDetail(id);
  if (!role) throw new NotFoundError("RoleTemplate", id);
  return jsonResponse(role);
}, { permission: "admin.manage_users" });

export const PUT = apiHandler(async (request, { params }) => {
  const id = params?.["id"];
  if (!id) throw new NotFoundError("RoleTemplate");
  const body = await validateBody(request, updateRoleSchema);
  const updated = await updateRoleTemplate(id, body);
  return jsonResponse(updated);
}, { permission: "admin.manage_users" });
