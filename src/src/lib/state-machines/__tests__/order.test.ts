import { describe, it, expect } from "vitest";
import {
  canTransition,
  getNextStates,
  isTerminal,
  validateTransition,
  computeReadinessPercent,
} from "../order";

describe("Order State Machine", () => {
  describe("canTransition", () => {
    it("allows DRAFT -> APPROVED", () => {
      expect(canTransition("DRAFT", "APPROVED")).toBe(true);
    });

    it("allows DRAFT -> CANCELLED", () => {
      expect(canTransition("DRAFT", "CANCELLED")).toBe(true);
    });

    it("disallows DRAFT -> DELIVERED", () => {
      expect(canTransition("DRAFT", "DELIVERED")).toBe(false);
    });

    it("allows APPROVED -> READY", () => {
      expect(canTransition("APPROVED", "READY")).toBe(true);
    });

    it("allows APPROVED -> ON_CREDIT_HOLD", () => {
      expect(canTransition("APPROVED", "ON_CREDIT_HOLD")).toBe(true);
    });

    it("allows ON_CREDIT_HOLD -> APPROVED (credit released)", () => {
      expect(canTransition("ON_CREDIT_HOLD", "APPROVED")).toBe(true);
    });

    it("disallows ON_CREDIT_HOLD -> DISPATCHED", () => {
      expect(canTransition("ON_CREDIT_HOLD", "DISPATCHED")).toBe(false);
    });

    it("allows READY -> LOADING", () => {
      expect(canTransition("READY", "LOADING")).toBe(true);
    });

    it("allows LOADING -> LOADED", () => {
      expect(canTransition("LOADING", "LOADED")).toBe(true);
    });

    it("allows LOADED -> DISPATCHED", () => {
      expect(canTransition("LOADED", "DISPATCHED")).toBe(true);
    });

    it("allows OUT_FOR_DELIVERY -> DELIVERED", () => {
      expect(canTransition("OUT_FOR_DELIVERY", "DELIVERED")).toBe(true);
    });

    it("allows OUT_FOR_DELIVERY -> REFUSED", () => {
      expect(canTransition("OUT_FOR_DELIVERY", "REFUSED")).toBe(true);
    });

    it("allows REFUSED -> RESCHEDULED", () => {
      expect(canTransition("REFUSED", "RESCHEDULED")).toBe(true);
    });

    it("allows RESCHEDULED -> APPROVED (re-enter flow)", () => {
      expect(canTransition("RESCHEDULED", "APPROVED")).toBe(true);
    });

    it("allows DELIVERED -> CLOSED", () => {
      expect(canTransition("DELIVERED", "CLOSED")).toBe(true);
    });

    it("allows READY -> PICKUP_READY", () => {
      expect(canTransition("READY", "PICKUP_READY")).toBe(true);
    });

    it("allows PICKUP_READY -> PICKED_UP", () => {
      expect(canTransition("PICKUP_READY", "PICKED_UP")).toBe(true);
    });
  });

  describe("terminal states", () => {
    it("CANCELLED is terminal", () => {
      expect(isTerminal("CANCELLED")).toBe(true);
    });

    it("CLOSED is terminal", () => {
      expect(isTerminal("CLOSED")).toBe(true);
    });

    it("DRAFT is not terminal", () => {
      expect(isTerminal("DRAFT")).toBe(false);
    });

    it("DELIVERED is not terminal", () => {
      expect(isTerminal("DELIVERED")).toBe(false);
    });
  });

  describe("getNextStates", () => {
    it("returns valid transitions from DRAFT", () => {
      const next = getNextStates("DRAFT");
      expect(next).toContain("APPROVED");
      expect(next).toContain("CANCELLED");
      expect(next).not.toContain("DELIVERED");
    });

    it("returns empty for CANCELLED", () => {
      expect(getNextStates("CANCELLED")).toEqual([]);
    });

    it("returns empty for CLOSED", () => {
      expect(getNextStates("CLOSED")).toEqual([]);
    });
  });

  describe("validateTransition", () => {
    it("valid transition returns valid: true", () => {
      const result = validateTransition("DRAFT", "APPROVED");
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("invalid transition returns error", () => {
      const result = validateTransition("DRAFT", "DELIVERED");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Invalid transition");
    });

    it("terminal state returns error", () => {
      const result = validateTransition("CANCELLED", "APPROVED");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("terminal state");
    });
  });

  describe("computeReadinessPercent", () => {
    it("returns 0 for empty items", () => {
      expect(computeReadinessPercent([])).toBe(0);
    });

    it("returns 100 when all READY", () => {
      const items = [{ readyStatus: "READY" }, { readyStatus: "READY" }];
      expect(computeReadinessPercent(items)).toBe(100);
    });

    it("returns 50 when half READY", () => {
      const items = [{ readyStatus: "READY" }, { readyStatus: "NOT_READY" }];
      expect(computeReadinessPercent(items)).toBe(50);
    });

    it("counts SUBSTITUTED as ready", () => {
      const items = [{ readyStatus: "SUBSTITUTED" }, { readyStatus: "NOT_READY" }];
      expect(computeReadinessPercent(items)).toBe(50);
    });

    it("returns 0 when none ready", () => {
      const items = [{ readyStatus: "NOT_READY" }, { readyStatus: "BACKORDERED" }];
      expect(computeReadinessPercent(items)).toBe(0);
    });
  });
});
