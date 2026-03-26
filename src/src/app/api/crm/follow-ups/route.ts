import { apiHandler, jsonResponse } from "@/lib/middleware/api-handler";
import { getFollowUpQueue, getDormantAccounts } from "@/lib/services/crm.service";

export const GET = apiHandler(async (request, { user }) => {
  const url = new URL(request.url);
  const view = url.searchParams.get("view");
  const locationId = url.searchParams.get("locationId") ?? user.defaultLocationId ?? undefined;

  if (view === "dormant") {
    const accounts = await getDormantAccounts(locationId);
    return jsonResponse(accounts);
  }

  const queue = await getFollowUpQueue(
    url.searchParams.get("salesRepId") ?? undefined,
    locationId,
  );
  return jsonResponse(queue);
}, { permission: "crm.view_leads" });
