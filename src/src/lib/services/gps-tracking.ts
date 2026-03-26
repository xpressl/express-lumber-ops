/** GPS tracking service for driver location updates */

export interface GpsPosition {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
}

/** Watch GPS position (client-side) */
export function watchPosition(
  onUpdate: (position: GpsPosition) => void,
  onError?: (error: GeolocationPositionError) => void,
): number | null {
  if (typeof navigator === "undefined" || !navigator.geolocation) return null;

  return navigator.geolocation.watchPosition(
    (pos) => {
      onUpdate({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        timestamp: pos.timestamp,
      });
    },
    onError,
    { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 },
  );
}

/** Stop watching GPS */
export function stopWatching(watchId: number): void {
  if (typeof navigator !== "undefined" && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
}

/** Get current position once */
export function getCurrentPosition(): Promise<GpsPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation not available"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        timestamp: pos.timestamp,
      }),
      reject,
      { enableHighAccuracy: true, timeout: 10000 },
    );
  });
}
