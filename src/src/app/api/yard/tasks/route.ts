import { apiHandler, jsonResponse, createdResponse } from "@/lib/middleware/api-handler";
import { listTasks, createTask } from "@/lib/services/yard.service";
import { z } from "zod";

const createTaskSchema = z.object({
  type: z.enum(["ORDER_PREP", "LOADING", "UNLOADING", "TRANSFER", "RECEIVING", "CYCLE_COUNT", "DAMAGE_INSPECTION", "CLEANUP"]),
  orderId: z.string().optional(),
  assignedTo: z.string().optional(),
  priority: z.number().int().optional(),
  bay: z.string().optional(),
  notes: z.string().optional(),
  locationId: z.string().min(1),
});

export const GET = apiHandler(async (request, { user }) => {
  const url = new URL(request.url);
  const tasks = await listTasks({
    locationId: url.searchParams.get("locationId") ?? user.defaultLocationId ?? "",
    assignedTo: url.searchParams.get("assignedTo") ?? (url.searchParams.get("my") === "true" ? user.id : undefined),
    status: url.searchParams.get("status") ?? undefined,
    type: url.searchParams.get("type") ?? undefined,
  });
  return jsonResponse(tasks);
}, { permission: "yard.view_tasks" });

export const POST = apiHandler(async (request, { user }) => {
  const body = createTaskSchema.parse(await request.json());
  const task = await createTask(body, user.id);
  return createdResponse(task);
}, { permission: "yard.assign_tasks" });
