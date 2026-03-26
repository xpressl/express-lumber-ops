import { apiHandler, jsonResponse } from "@/lib/middleware/api-handler";

/** Report data endpoint - returns data for specific report types */
export const GET = apiHandler(async (request) => {
  const url = new URL(request.url);
  const type = url.searchParams.get("type") ?? "overview";

  // Placeholder: In production, each report type would query specific aggregations
  const reportData = {
    type,
    generatedAt: new Date().toISOString(),
    data: [],
    message: `Report "${type}" data will be populated from operational database`,
  };

  return jsonResponse(reportData);
}, { permission: "admin.export_reports" });
