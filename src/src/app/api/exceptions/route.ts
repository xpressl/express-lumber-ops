import { apiHandler, jsonResponse } from "@/lib/middleware/api-handler";
import { prisma } from "@/lib/prisma";
import { getExceptionSummary } from "@/lib/exceptions/engine";

export const GET = apiHandler(async (request, { user }) => {
  const url = new URL(request.url);
  const view = url.searchParams.get("view");
  const locationId = url.searchParams.get("locationId") ?? user.defaultLocationId ?? undefined;

  if (view === "summary") {
    const summary = await getExceptionSummary(locationId);
    return jsonResponse(summary);
  }

  const exceptions = await prisma.exception.findMany({
    where: {
      ...(locationId ? { locationId } : {}),
      ...(url.searchParams.get("status") ? { status: url.searchParams.get("status") as "OPEN" | "ACKNOWLEDGED" | "IN_PROGRESS" | "ESCALATED" } : {
        status: { in: ["OPEN", "ACKNOWLEDGED", "IN_PROGRESS", "ESCALATED"] },
      }),
      ...(url.searchParams.get("category") ? { category: url.searchParams.get("category")! } : {}),
      ...(url.searchParams.get("severity") ? { severity: url.searchParams.get("severity") as "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" } : {}),
    },
    orderBy: [{ priorityScore: "desc" }, { createdAt: "desc" }],
    take: 50,
  });

  return jsonResponse(exceptions);
});
