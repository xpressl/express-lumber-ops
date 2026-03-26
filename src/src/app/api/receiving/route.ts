import { apiHandler, jsonResponse, createdResponse } from "@/lib/middleware/api-handler";
import { listReceivingRecords, startReceiving } from "@/lib/services/receiving.service";
import { startReceivingSchema } from "@/lib/validators/receiving";

export const GET = apiHandler(async (request, { user }) => {
  const url = new URL(request.url);
  const locationId = url.searchParams.get("locationId") ?? user.defaultLocationId ?? "";
  const status = url.searchParams.get("status") ?? undefined;
  const records = await listReceivingRecords(locationId, status);
  return jsonResponse(records);
}, { permission: "receiving.view" });

export const POST = apiHandler(async (request, { user }) => {
  const body = startReceivingSchema.parse(await request.json());
  const record = await startReceiving(body.purchaseOrderId, body.locationId, user.id);
  return createdResponse(record);
}, { permission: "receiving.receive_po" });
