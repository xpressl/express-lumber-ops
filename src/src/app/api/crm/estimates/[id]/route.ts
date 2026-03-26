import { apiHandler, jsonResponse } from "@/lib/middleware/api-handler";
import { getEstimateById } from "@/lib/services/crm.service";
import { NotFoundError } from "@/lib/middleware/error-handler";

export const GET = apiHandler(async (_request, { params }) => {
  const id = params?.["id"];
  if (!id) throw new NotFoundError("Estimate");
  const estimate = await getEstimateById(id);
  if (!estimate) throw new NotFoundError("Estimate", id);
  return jsonResponse(estimate);
}, { permission: "crm.create_estimate" });
