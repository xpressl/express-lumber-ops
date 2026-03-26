/** Geofence service for delivery stop proximity detection */

const EARTH_RADIUS_M = 6371000;

/** Calculate distance between two coordinates in meters (Haversine) */
export function distanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Check if a position is within a geofence radius (default 100m) */
export function isWithinGeofence(
  driverLat: number,
  driverLng: number,
  stopLat: number,
  stopLng: number,
  radiusMeters = 100,
): boolean {
  return distanceMeters(driverLat, driverLng, stopLat, stopLng) <= radiusMeters;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
