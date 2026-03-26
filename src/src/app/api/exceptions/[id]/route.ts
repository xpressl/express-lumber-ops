import { apiHandler, jsonResponse } from "@/lib/middleware/api-handler";
import { acknowledgeException, resolveException, escalateException } from "@/lib/exceptions/engine";
import { NotFoundError } from "@/lib/middleware/error-handler";
import { z } from "zod";

const actionSchema = z.object({
  action: z.enum(["acknowledge", "resolve", "escalate"]),
  note: z.string().optional(),
  escalateTo: z.string().optional(),
});

export const POST = apiHandler(async (request, { params, user }) => {
  const id = params?.["id"];
  if (!id) throw new NotFoundError("Exception");
  const body = actionSchema.parse(await request.json());

  switch (body.action) {
    case "acknowledge": return jsonResponse(await acknowledgeException(id, user.id));
    case "resolve": return jsonResponse(await resolveException(id, user.id, body.note ?? ""));
    case "escalate": return jsonResponse(await escalateException(id, body.escalateTo ?? user.id));
    default: return jsonResponse({ error: "Unknown action" }, 400);
  }
});
