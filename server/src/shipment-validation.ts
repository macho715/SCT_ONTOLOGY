import type { ActionRecommendation, ShipmentRuleResult, ValidationFinding } from "./types.js";

export type ShipmentValidationMerge = {
  findings: ValidationFinding[];
  actions: ActionRecommendation[];
};

function riskText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function riskSeverity(value: unknown): string {
  return riskText(value).toUpperCase();
}

function exposureNumber(value: string | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function mergeShipmentValidation(shipmentRule?: ShipmentRuleResult): ShipmentValidationMerge {
  const findings: ValidationFinding[] = [];
  const actions: ActionRecommendation[] = [];
  if (!shipmentRule?.found) return { findings, actions };

  const agiRisk = shipmentRule.risks.find((risk) => riskText(risk.rule).includes("AGI/DAS MOSB Gate"));
  if (agiRisk) {
    findings.push({
      ruleId: "V-SHIPMENT-AGIDAS-001",
      reasonCode: "SHIPMENT_AGIDAS_MOSB_CHAIN_REQUIRED",
      severity: "BLOCK",
      status: "BLOCK",
      targetObject: "ShipmentRule/AGI_DAS_MOSB",
      evidenceIds: [],
      message: riskText(agiRisk.detail) || "AGI/DAS M130 requires M115/M116/M117 chain evidence or approved exception."
    });
    actions.push({
      actionType: "REQUEST_SHIPMENT_RULE_HUMAN_GATE",
      ownerRole: "Marine / Material Chain Owner",
      parameters: {
        shipmentId: shipmentRule.shipmentId,
        requiredEvidence: "M115/M116/M117 or approved exception",
        source: shipmentRule.source
      },
      humanGateRequired: true,
      dueAt: null
    });
  }

  if ((shipmentRule.missingDocuments ?? []).length > 0) {
    findings.push({
      ruleId: "V-SHIPMENT-DOCS-001",
      reasonCode: "SHIPMENT_MISSING_DOCUMENTS",
      severity: (shipmentRule.missingDocuments ?? []).includes("SITE_RECEIPT") ? "BLOCK" : "WARN",
      status: (shipmentRule.missingDocuments ?? []).includes("SITE_RECEIPT") ? "BLOCK" : "WARN",
      targetObject: "ShipmentRule/MissingDocuments",
      evidenceIds: [],
      message: `Sample shipment ${shipmentRule.shipmentId} is missing documents: ${(shipmentRule.missingDocuments ?? []).join(", ")}.`
    });
  }

  const exposureRequiresGate = exposureNumber(shipmentRule.invoiceExposureAed) > 100000;
  const invoiceRequiresGate = (shipmentRule.invoiceAudit ?? []).some((line) => {
    const severity = riskSeverity(line.severity);
    return line.humanGate === true || severity === "BLOCK" || severity === "CRITICAL";
  });
  if (exposureRequiresGate || invoiceRequiresGate) {
    findings.push({
      ruleId: "V-SHIPMENT-INVOICE-001",
      reasonCode: "SHIPMENT_INVOICE_HUMAN_GATE_REQUIRED",
      severity: "BLOCK",
      status: "BLOCK",
      targetObject: "ShipmentRule/InvoiceAudit",
      evidenceIds: [],
      message: `Sample shipment ${shipmentRule.shipmentId} invoice audit requires Finance review; exposure ${shipmentRule.invoiceExposureAed ?? "0.00"} AED.`
    });
    actions.push({
      actionType: "REQUEST_FINANCE_GATE_REVIEW",
      ownerRole: "Finance Reviewer",
      parameters: {
        shipmentId: shipmentRule.shipmentId,
        invoiceExposureAed: shipmentRule.invoiceExposureAed ?? "0.00",
        source: shipmentRule.source
      },
      humanGateRequired: true,
      dueAt: null
    });
  }

  return { findings, actions };
}
