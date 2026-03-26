import { apiHandler, jsonResponse } from "@/lib/middleware/api-handler";
import { getReceivingById, completeReceiving } from "@/lib/services/receiving.service";
import { NotFoundError } from "@/lib/middleware/error-handler";

export const GET = apiHandler(async (_request, { params }) => {
  const id = params?.["id"];
  if (!id) throw new NotFoundError("ReceivingRecord");
  const record = await getReceivingById(id);
  if (!record) throw new NotFoundError("ReceivingRecord", id);
  return jsonResponse(record);
}, { permission: "receiving.view" });

export const POST = apiHandler(async (_request, { params, user }) => {
  const id = params?.["id"];
  if (!id) throw new NotFoundError("ReceivingRecord");
  const record = await completeReceiving(id, user.id);
  return jsonResponse(record);
}, { permission: "receiving.receive_po" });
