import { apiHandler, createdResponse } from "@/lib/middleware/api-handler";
import { createDispute } from "@/lib/services/collections.service";
import { createDisputeSchema } from "@/lib/validators/collections";

export const POST = apiHandler(async (request, { params, user }) => {
  const accountId = params?.["id"] ?? "";
  const body = createDisputeSchema.parse(await request.json());
  const dispute = await createDispute(accountId, "", body, user.id);
  return createdResponse(dispute);
}, { permission: "collections.create_dispute" });
