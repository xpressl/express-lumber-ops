import { apiHandler, jsonResponse } from "@/lib/middleware/api-handler";
import { getMatchQueue } from "@/lib/services/purchasing.service";

export const GET = apiHandler(async (request, { user }) => {
  const url = new URL(request.url);
  const locationId = url.searchParams.get("locationId") ?? user.defaultLocationId ?? undefined;
  const queue = await getMatchQueue(locationId);
  return jsonResponse(queue);
}, { permission: "purchasing.approve_ap_match" });
