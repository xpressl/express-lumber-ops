import { apiHandler, jsonResponse } from "@/lib/middleware/api-handler";
import { capturePod } from "@/lib/services/delivery.service";
import { capturePodsSchema } from "@/lib/validators/delivery";
import { NotFoundError } from "@/lib/middleware/error-handler";

export const POST = apiHandler(async (request, { params, user }) => {
  const stopId = params?.["id"];
  if (!stopId) throw new NotFoundError("RouteStop");
  const body = capturePodsSchema.parse(await request.json());
  const proof = await capturePod(stopId, {
    signatureUrl: body.signatureDataUrl,
    signedBy: body.signedBy,
    photos: body.photos,
    notes: body.notes,
    gpsLat: body.gpsLat,
    gpsLng: body.gpsLng,
  }, user.id);
  return jsonResponse(proof);
}, { permission: "delivery.capture_pod" });
