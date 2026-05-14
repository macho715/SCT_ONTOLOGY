import { describe, expect, it } from "vitest";
import { expandIdentifierVariants, extractIdentifierLookupVariants } from "../server/src/identifier-normalizer.js";
import { resolveAnyKey } from "../server/src/router.js";

describe("HVDC identifier normalization", () => {
  it("normalizes full and abbreviated HVDC ADOPT codes without hardcoded SCT mappings", () => {
    for (const input of ["HVDC-ADOPT-SCT-0001", "SCT0001", "SCT001", "sct001"]) {
      const variants = expandIdentifierVariants(input).map((variant) => variant.normalized);
      expect(variants).toContain("HVDC-ADOPT-SCT-0001");
    }

    expect(expandIdentifierVariants("PPL7").map((variant) => variant.normalized)).toContain("HVDC-ADOPT-PPL-0007");
  });

  it("extracts unique lookup variants from mixed text", () => {
    const variants = extractIdentifierLookupVariants("Find sct001 and HVDC-ADOPT-SCT-0001").map((variant) => variant.normalized);
    expect(variants).toContain("HVDC-ADOPT-SCT-0001");
    expect(variants.filter((variant) => variant === "HVDC-ADOPT-SCT-0001")).toHaveLength(1);
  });

  it("resolves abbreviated codes as HVDC_CODE candidates", () => {
    const candidates = resolveAnyKey("SCT001");
    expect(candidates[0]).toMatchObject({
      entityType: "ShipmentUnit",
      identifierScheme: "HVDC_CODE",
      identifierValue: "SCT001",
      normalizedValue: "HVDC-ADOPT-SCT-0001",
      confidence: 0.95
    });
  });
});
