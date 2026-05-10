import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const widgetHtml = readFileSync(resolve(process.cwd(), "public", "hvdc-answer-widget.html"), "utf8");

describe("HVDC answer widget", () => {
  it("renders verdict before route and evidence sections", () => {
    const verdictIndex = widgetHtml.indexOf("Verdict");
    const routeIndex = widgetHtml.indexOf("Route documents");
    const evidenceIndex = widgetHtml.indexOf("Evidence Drawer");

    expect(verdictIndex).toBeGreaterThan(-1);
    expect(routeIndex).toBeGreaterThan(verdictIndex);
    expect(evidenceIndex).toBeGreaterThan(routeIndex);
  });

  it("shows evidence inspection fields and review warnings", () => {
    for (const label of [
      "Source doc",
      "Section path",
      "Document hash",
      "Confidence",
      "Validation status",
      "PII state",
      "Stale or review warnings"
    ]) {
      expect(widgetHtml).toContain(label);
    }
  });

  it("keeps accessible fallback and focus-visible behavior", () => {
    expect(widgetHtml).toContain("Text fallback");
    expect(widgetHtml).toContain("aria-live=\"polite\"");
    expect(widgetHtml).toContain("aria-labelledby=\"verdict-title\"");
    expect(widgetHtml).toContain("focus-visible");
  });

  it("does not fetch external resources from the iframe", () => {
    expect(widgetHtml).not.toMatch(/\bfetch\s*\(/);
    expect(widgetHtml).not.toMatch(/https?:\/\//i);
  });
});
