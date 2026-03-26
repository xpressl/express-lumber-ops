import { describe, it, expect } from "vitest";
import { distanceMeters, isWithinGeofence } from "../geofence";

describe("Geofence Service", () => {
  // Approximate coordinates for testing
  const nyLat = 40.7128;
  const nyLng = -74.0060;

  it("calculates zero distance for same point", () => {
    const d = distanceMeters(nyLat, nyLng, nyLat, nyLng);
    expect(d).toBe(0);
  });

  it("calculates reasonable distance between nearby points", () => {
    // ~111m per 0.001 degree latitude
    const d = distanceMeters(nyLat, nyLng, nyLat + 0.001, nyLng);
    expect(d).toBeGreaterThan(100);
    expect(d).toBeLessThan(120);
  });

  it("detects within geofence", () => {
    expect(isWithinGeofence(nyLat, nyLng, nyLat + 0.0001, nyLng, 100)).toBe(true);
  });

  it("detects outside geofence", () => {
    expect(isWithinGeofence(nyLat, nyLng, nyLat + 0.01, nyLng, 100)).toBe(false);
  });

  it("respects custom radius", () => {
    // ~111m apart
    expect(isWithinGeofence(nyLat, nyLng, nyLat + 0.001, nyLng, 50)).toBe(false);
    expect(isWithinGeofence(nyLat, nyLng, nyLat + 0.001, nyLng, 200)).toBe(true);
  });
});
