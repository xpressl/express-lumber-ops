import { describe, it, expect } from "vitest";
import { calculateOverallConfidence, classifyConfidence, requiresApproval } from "../confidence";

describe("Confidence Scoring", () => {
  it("returns high confidence for perfect data", () => {
    const score = calculateOverallConfidence({
      fieldCompleteness: 1.0,
      formatValidity: 1.0,
      duplicateRate: 1.0,
      matchRate: 1.0,
    });
    expect(score).toBe(1.0);
  });

  it("returns low confidence for poor data", () => {
    const score = calculateOverallConfidence({
      fieldCompleteness: 0.3,
      formatValidity: 0.4,
      duplicateRate: 0.5,
      matchRate: 0.2,
    });
    expect(score).toBeLessThan(0.5);
  });

  it("classifies high confidence correctly", () => {
    expect(classifyConfidence(0.95)).toBe("HIGH");
    expect(classifyConfidence(0.90)).toBe("HIGH");
  });

  it("classifies medium confidence correctly", () => {
    expect(classifyConfidence(0.80)).toBe("MEDIUM");
    expect(classifyConfidence(0.70)).toBe("MEDIUM");
  });

  it("classifies low confidence correctly", () => {
    expect(classifyConfidence(0.60)).toBe("LOW");
  });

  it("classifies critical confidence correctly", () => {
    expect(classifyConfidence(0.30)).toBe("CRITICAL");
  });

  it("requires approval below threshold", () => {
    expect(requiresApproval(0.80)).toBe(true);
    expect(requiresApproval(0.90)).toBe(false);
  });

  it("uses custom threshold", () => {
    expect(requiresApproval(0.60, 0.50)).toBe(false);
    expect(requiresApproval(0.40, 0.50)).toBe(true);
  });
});
