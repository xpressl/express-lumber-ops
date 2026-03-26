import { apiHandler, jsonResponse } from "@/lib/middleware/api-handler";
import { getAccountDetail, recommendHold } from "@/lib/services/collections.service";
import { NotFoundError } from "@/lib/middleware/error-handler";
import { z } from "zod";

export const GET = apiHandler(async (_request, { params }) => {
  const id = params?.["id"];
  if (!id) throw new NotFoundError("CollectionAccount");
  const account = await getAccountDetail(id);
  if (!account) throw new NotFoundError("CollectionAccount", id);
  return jsonResponse(account);
}, { permission: "collections.view_aging" });

const holdSchema = z.object({ reason: z.string().min(1) });

export const POST = apiHandler(async (request, { params, user }) => {
  const id = params?.["id"];
  if (!id) throw new NotFoundError("CollectionAccount");
  const body = holdSchema.parse(await request.json());
  await recommendHold(id, body.reason, user.id);
  return jsonResponse({ success: true });
}, { permission: "collections.recommend_hold" });
