import { apiHandler, jsonResponse } from "@/lib/middleware/api-handler";
import { updateLead } from "@/lib/services/crm.service";
import { updateLeadSchema } from "@/lib/validators/crm";
import { NotFoundError } from "@/lib/middleware/error-handler";

export const PATCH = apiHandler(async (request, { params, user }) => {
  const id = params?.["id"];
  if (!id) throw new NotFoundError("Lead");
  const body = updateLeadSchema.parse(await request.json());
  const lead = await updateLead(id, body, user.id);
  return jsonResponse(lead);
}, { permission: "crm.view_leads" });
