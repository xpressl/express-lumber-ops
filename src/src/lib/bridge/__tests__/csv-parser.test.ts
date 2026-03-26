import { describe, it, expect } from "vitest";
import { parseCSV } from "../parsers/csv-parser";

describe("CSV Parser", () => {
  it("parses simple CSV", () => {
    const csv = "name,email,phone\nJohn,john@test.com,555-0100\nJane,jane@test.com,555-0200";
    const result = parseCSV(csv);

    expect(result.headers).toEqual(["name", "email", "phone"]);
    expect(result.totalRows).toBe(2);
    expect(result.rows[0]!.data["name"]).toBe("John");
    expect(result.rows[1]!.data["email"]).toBe("jane@test.com");
    expect(result.errors).toHaveLength(0);
  });

  it("handles quoted fields with commas", () => {
    const csv = 'name,address\n"Smith, Inc","123 Main St, Suite 100"';
    const result = parseCSV(csv);

    expect(result.totalRows).toBe(1);
    expect(result.rows[0]!.data["name"]).toBe("Smith, Inc");
    expect(result.rows[0]!.data["address"]).toBe("123 Main St, Suite 100");
  });

  it("returns error for empty file", () => {
    const result = parseCSV("");
    expect(result.totalRows).toBe(0);
    expect(result.errors).toContain("Empty file");
  });

  it("handles header-only file", () => {
    const result = parseCSV("a,b,c");
    expect(result.headers).toEqual(["a", "b", "c"]);
    expect(result.totalRows).toBe(0);
  });

  it("handles missing trailing values", () => {
    const csv = "a,b,c\n1,2";
    const result = parseCSV(csv);

    expect(result.totalRows).toBe(1);
    expect(result.rows[0]!.data["a"]).toBe("1");
    expect(result.rows[0]!.data["b"]).toBe("2");
    expect(result.rows[0]!.data["c"]).toBe("");
  });
});
