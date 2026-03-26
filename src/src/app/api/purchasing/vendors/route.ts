import { apiHandler, jsonResponse } from "@/lib/middleware/api-handler";
import { listVendors } from "@/lib/services/purchasing.service";

export const GET = apiHandler(async (request) => {
  const url = new URL(request.url);
  const vendors = await listVendors({
    search: url.searchParams.get("search") ?? undefined,
    status: url.searchParams.get("status") ?? undefined,
  });
  return jsonResponse(vendors);
}, { permission: "purchasing.view" });
