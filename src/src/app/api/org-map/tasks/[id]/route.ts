import { apiHandler, jsonResponse } from "@/lib/middleware/api-handler";
import { validateBody } from "@/lib/middleware/validate";
import { getBusinessTaskDetail, updateBusinessTask, assignTask } from "@/lib/services/business-task.service";
import { NotFoundError } from "@/lib/middleware/error-handler";
import { z } from "zod";

const updateTaskSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().optional(),
  processArea: z.string().optional(),
  frequency: z.string().optional(),
  description: z.string().optional(),
  isCritical: z.boolean().optional(),
  status: z.string().optional(),
});

const assignTaskSchema = z.object({
  roleTemplateId: z.string().min(1),
  isPrimary: z.boolean().optional(),
});

export const GET = apiHandler(async (_request, { params }) => {
  const id = params?.["id"];
  if (!id) throw new NotFoundError("BusinessTask");
  const task = await getBusinessTaskDetail(id);
  if (!task) throw new NotFoundError("BusinessTask", id);
  return jsonResponse(task);
}, { permission: "admin.manage_users" });

export const PUT = apiHandler(async (request, { params }) => {
  const id = params?.["id"];
  if (!id) throw new NotFoundError("BusinessTask");
  const body = await validateBody(request, updateTaskSchema);
  const updated = await updateBusinessTask(id, body);
  return jsonResponse(updated);
}, { permission: "admin.manage_users" });

export const POST = apiHandler(async (request, { params, user }) => {
  const url = new URL(request.url);
  const action = url.searchParams.get("action");
  const id = params?.["id"];
  if (!id) throw new NotFoundError("BusinessTask");

  if (action === "assign") {
    const body = await validateBody(request, assignTaskSchema);
    const result = await assignTask(
      { taskId: id, assignmentType: "RESPONSIBLE", ...body },
      user.id,
    );
    return jsonResponse(result);
  }

  throw new NotFoundError("Action");
}, { permission: "admin.manage_users" });
