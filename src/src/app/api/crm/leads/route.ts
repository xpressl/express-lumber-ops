import { apiHandler, jsonResponse, createdResponse } from "@/lib/middleware/api-handler";
import { listLeads, createLead } from "@/lib/services/crm.service";
import { createLeadSchema } from "@/lib/validators/crm";

export const GET = apiHandler(async (request, { user }) => {
  const url = new URL(request.url);
  const leads = await listLeads({
    status: url.searchParams.get("status") ?? undefined,
    assignedTo: url.searchParams.get("assignedTo") ?? undefined,
    locationId: url.searchParams.get("locationId") ?? user.defaultLocationId ?? undefined,
    search: url.searchParams.get("search") ?? undefined,
  });
  return jsonResponse(leads);
}, { permission: "crm.view_leads" });

export const POST = apiHandler(async (request, { user }) => {
  const body = createLeadSchema.parse(await request.json());
  const lead = await createLead(body, user.id);
  return createdResponse(lead);
}, { permission: "crm.view_leads" });
