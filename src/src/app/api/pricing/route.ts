import { apiHandler, jsonResponse } from "@/lib/middleware/api-handler";
import { getCostChanges, getQuotesAtRisk } from "@/lib/services/pricing.service";

export const GET = apiHandler(async (request) => {
  const url = new URL(request.url);
  const view = url.searchParams.get("view");

  if (view === "quotes-at-risk") {
    const quotes = await getQuotesAtRisk();
    return jsonResponse(quotes);
  }

  const changes = await getCostChanges({
    dateFrom: url.searchParams.get("dateFrom") ?? undefined,
    dateTo: url.searchParams.get("dateTo") ?? undefined,
  });
  return jsonResponse(changes);
}, { permission: "pricing.view_catalogue" });
