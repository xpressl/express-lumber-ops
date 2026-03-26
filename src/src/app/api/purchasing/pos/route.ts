import { apiHandler, jsonResponse, createdResponse } from "@/lib/middleware/api-handler";
import { listPOs, createPO } from "@/lib/services/purchasing.service";
import { createPOSchema } from "@/lib/validators/pricing";

export const GET = apiHandler(async (request, { user }) => {
  const url = new URL(request.url);
  const pos = await listPOs({
    vendorId: url.searchParams.get("vendorId") ?? undefined,
    status: url.searchParams.get("status") ?? undefined,
    locationId: url.searchParams.get("locationId") ?? user.defaultLocationId ?? undefined,
  });
  return jsonResponse(pos);
}, { permission: "purchasing.view" });

export const POST = apiHandler(async (request, { user }) => {
  const body = createPOSchema.parse(await request.json());
  const po = await createPO(body, user.id);
  return createdResponse(po);
}, { permission: "purchasing.create_po" });
