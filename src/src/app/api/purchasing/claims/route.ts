import { apiHandler, jsonResponse } from "@/lib/middleware/api-handler";
import { listClaims } from "@/lib/services/purchasing.service";

export const GET = apiHandler(async (request) => {
  const url = new URL(request.url);
  const claims = await listClaims(url.searchParams.get("vendorId") ?? undefined);
  return jsonResponse(claims);
}, { permission: "purchasing.view" });
