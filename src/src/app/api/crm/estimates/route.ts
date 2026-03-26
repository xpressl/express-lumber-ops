import { apiHandler, jsonResponse, createdResponse } from "@/lib/middleware/api-handler";
import { listEstimates, createEstimate } from "@/lib/services/crm.service";
import { createEstimateSchema } from "@/lib/validators/crm";

export const GET = apiHandler(async (request, { user }) => {
  const url = new URL(request.url);
  const estimates = await listEstimates({
    status: url.searchParams.get("status") ?? undefined,
    salesRepId: url.searchParams.get("salesRepId") ?? undefined,
    locationId: url.searchParams.get("locationId") ?? user.defaultLocationId ?? undefined,
  });
  return jsonResponse(estimates);
}, { permission: "crm.create_estimate" });

export const POST = apiHandler(async (request, { user }) => {
  const body = createEstimateSchema.parse(await request.json());
  const estimate = await createEstimate(body, user.id);
  return createdResponse(estimate);
}, { permission: "crm.create_estimate" });
