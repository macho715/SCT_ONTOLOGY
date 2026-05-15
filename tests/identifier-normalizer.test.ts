import { describe, expect, it } from "vitest";
import { expandIdentifierVariants, extractIdentifierLookupVariants } from "../server/src/identifier-normalizer.js";
import { resolveAnyKey } from "../server/src/router.js";

describe("HVDC identifier normalization", () => {
  it("normalizes full and abbreviated HVDC ADOPT codes across logistics_status prefixes", () => {
    const cases = [
      ["HVDC-ADOPT-SCT-0001", "HVDC-ADOPT-SCT-0001"],
      ["SCT0001", "HVDC-ADOPT-SCT-0001"],
      ["SCT001", "HVDC-ADOPT-SCT-0001"],
      ["sct001", "HVDC-ADOPT-SCT-0001"],
      ["PPL7", "HVDC-ADOPT-PPL-0007"],
      ["HS1", "HVDC-ADOPT-HS-0001"],
      ["HE85", "HVDC-ADOPT-HE-0085"],
      ["SEI21", "HVDC-ADOPT-SEI-0021"],
      ["SIM42", "HVDC-ADOPT-SIM-0042"],
      ["ZEN19", "HVDC-ADOPT-ZEN-0019"]
    ];

    for (const [input, expected] of cases) {
      const variants = expandIdentifierVariants(input).map((variant) => variant.normalized);
      expect(variants).toContain(expected);
    }
  });

  it("keeps SCT0001 mapping but rejects zero-sequence prefix input", () => {
    const validVariants = expandIdentifierVariants("SCT0001").map((variant) => variant.normalized);
    const zeroVariants = expandIdentifierVariants("SCT0").map((variant) => variant.normalized);

    expect(validVariants).toContain("HVDC-ADOPT-SCT-0001");
    expect(zeroVariants).toContain("SCT0");
    expect(zeroVariants).not.toContain("HVDC-ADOPT-SCT-0000");
    expect(zeroVariants).not.toContain("SCT0000");
  });

  it("preserves logistics_status suffix patterns for split shipment codes", () => {
    const cases = [
      ["HVDC-ADOPT-HE-0068-1", "HVDC-ADOPT-HE-0068-1"],
      ["HE68-1", "HVDC-ADOPT-HE-0068-1"],
      ["sim5-2a", "HVDC-ADOPT-SIM-0005-2A"],
      ["SEI17-03", "HVDC-ADOPT-SEI-0017-03"],
      ["HVDC-ADOPT-SIM-0012-C", "HVDC-ADOPT-SIM-0012-C"]
    ];

    for (const [input, expected] of cases) {
      const variants = expandIdentifierVariants(input).map((variant) => variant.normalized);
      expect(variants).toContain(expected);
    }
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

  it("does not emit a fake ShipmentUnit for zero sequence codes", () => {
    expect(resolveAnyKey("SCT0")).toEqual([]);
    expect(resolveAnyKey("HVDC-ADOPT-SCT-0000")).toEqual([]);
  });

  it("resolves suffixed split shipment codes as HVDC_CODE candidates", () => {
    const candidates = resolveAnyKey("sim5-2a");
    expect(candidates[0]).toMatchObject({
      entityType: "ShipmentUnit",
      identifierScheme: "HVDC_CODE",
      identifierValue: "sim5-2a",
      normalizedValue: "HVDC-ADOPT-SIM-0005-2A",
      confidence: 0.95
    });
  });
});
