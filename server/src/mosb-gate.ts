// MOSB Route Gate — V-AGIDAS-001
// AGI/DAS site receipt dates are accepted as M130 Site Arrived evidence.
// Missing M115/M116/M117 MOSB-chain evidence is an AMBER/WARN backfill gap, not a delivery block.

export type RouteGateStatus = "PASS" | "WARN" | "BLOCK";

export type RouteGateCard = {
  shipmentUnitId: string;
  declaredDestination: string;
  routingPattern: string;
  status: RouteGateStatus;
  appliedRule: string | null;
  missingMilestones: string[];
  requiredEvidence: string[];
  siteReceiptStatus?: "ARRIVED";
  deliveryStatus?: "DELIVERED";
  dataQualityFinding?: {
    code: "MOSB_EVIDENCE_MISSING";
    severity: "AMBER";
    action: string;
    backfillRequired: true;
  };
  ownerRole: string;
  nextAction: string;
  humanGateRequired: boolean;
  message: string;
  generatedAt: string;
};

export type MilestoneRecord = {
  code: string;
  actualDt?: string | null;
  approvedExceptionRef?: string | null;
};

const AGI_DAS_DESTINATIONS = new Set(["AGI", "DAS", "AGI/DAS"]);
const MOSB_ROUTING_PATTERNS = new Set(["MOSB_DIRECT", "WH_MOSB", "MIXED"]);

function normalize(v: string): string {
  return v.trim().toUpperCase();
}

function milestoneMatches(actualCode: string, expectedCode: string): boolean {
  const normalized = normalize(actualCode);
  const expected = normalize(expectedCode);
  return normalized === expected || normalized.startsWith(`${expected}_`) || normalized.startsWith(`${expected}-`);
}

function destinationRequiresMosbGate(declaredDestination: string): boolean {
  const normalized = normalize(declaredDestination);
  const parts = normalized.split(/[^A-Z0-9]+/).filter(Boolean);
  return AGI_DAS_DESTINATIONS.has(normalized) || parts.some((part) => part === "AGI" || part === "DAS");
}

function routingRequiresMosbGate(routingPattern: string): boolean {
  const normalized = normalize(routingPattern);
  return MOSB_ROUTING_PATTERNS.has(normalized) || normalized.includes("MOSB");
}

function hasMilestoneWithDate(milestones: MilestoneRecord[], code: string): boolean {
  return milestones.some(
    (m) => milestoneMatches(m.code, code) && Boolean(m.actualDt)
  );
}

function hasApprovedExceptionFor(milestones: MilestoneRecord[], code: string): boolean {
  return milestones.some(
    (m) => milestoneMatches(m.code, code) && Boolean(m.approvedExceptionRef)
  );
}

export function checkMosbGate(
  shipmentUnitId: string,
  declaredDestination: string,
  routingPattern: string,
  milestones: MilestoneRecord[]
): RouteGateCard {
  const dest = normalize(declaredDestination);
  const routing = normalize(routingPattern);
  const base: Omit<RouteGateCard, "status" | "appliedRule" | "missingMilestones" | "requiredEvidence" | "ownerRole" | "nextAction" | "humanGateRequired" | "message"> = {
    shipmentUnitId,
    declaredDestination: dest,
    routingPattern: routing,
    generatedAt: new Date().toISOString()
  };

  // Not an AGI/DAS MOSB route — no rule applies
  if (!destinationRequiresMosbGate(dest) || !routingRequiresMosbGate(routing)) {
    return {
      ...base,
      status: "PASS",
      appliedRule: null,
      missingMilestones: [],
      requiredEvidence: [],
      ownerRole: "Site Receiving Coordinator",
      nextAction: "No MOSB gate applies for this route/destination combination.",
      humanGateRequired: false,
      message: `Route ${routing} to ${dest} does not require MOSB gate checks.`
    };
  }

  const m130Closed = hasMilestoneWithDate(milestones, "M130");
  const m115Staged = hasMilestoneWithDate(milestones, "M115");
  const m116Loaded = hasMilestoneWithDate(milestones, "M116");
  const m117SailAway = hasMilestoneWithDate(milestones, "M117");

  const missingMilestones: string[] = [];
  const requiredEvidence: string[] = [];

  // V-AGIDAS-001: M130 is accepted from site evidence; missing M115 becomes AMBER backfill.
  if (m130Closed && !m115Staged) {
    missingMilestones.push("M115", ...(!m116Loaded ? ["M116"] : []), ...(!m117SailAway ? ["M117"] : []));
    requiredEvidence.push(
      "Backfill M115 MOSB staging record",
      "Backfill M116 LCT/Barge load manifest",
      "Backfill M117 sail-away approval document"
    );
    return {
      ...base,
      status: "WARN",
      appliedRule: "V-AGIDAS-001",
      missingMilestones,
      requiredEvidence,
      siteReceiptStatus: "ARRIVED",
      deliveryStatus: "DELIVERED",
      dataQualityFinding: {
        code: "MOSB_EVIDENCE_MISSING",
        severity: "AMBER",
        action: "Backfill M115/M116/M117 evidence",
        backfillRequired: true
      },
      ownerRole: "Marine Supervisor",
      nextAction: "Keep M130 Site Arrived as delivered; backfill missing M115/M116/M117 MOSB-chain evidence.",
      humanGateRequired: false,
      message: "AMBER/WARN: M130 Site Arrived is accepted from AGI/DAS site date; MOSB-chain evidence is missing and must be backfilled (V-AGIDAS-001)."
    };
  }

  // M116 / M117 check (general offshore transit, not exception-approved)
  if (!m116Loaded && !hasApprovedExceptionFor(milestones, "M116")) {
    missingMilestones.push("M116");
    requiredEvidence.push("LCT/Barge load manifest");
  }
  if (!m117SailAway && !hasApprovedExceptionFor(milestones, "M117")) {
    missingMilestones.push("M117");
    requiredEvidence.push("Sail-away approval document", "Weather/stability clearance");
  }

  if (missingMilestones.length > 0) {
    return {
      ...base,
      status: "WARN",
      appliedRule: "V-AGIDAS-002",
      missingMilestones,
      requiredEvidence,
      ownerRole: "Marine Supervisor",
      nextAction: `Obtain and record ${missingMilestones.join(", ")} evidence or submit approved exception.`,
      humanGateRequired: false,
      message: `WARN: Offshore transit milestones ${missingMilestones.join(", ")} not yet recorded.`
    };
  }

  return {
    ...base,
    status: "PASS",
    appliedRule: null,
    missingMilestones: [],
    requiredEvidence: [],
    ownerRole: "Marine Supervisor",
    nextAction: "All MOSB chain milestones satisfied.",
    humanGateRequired: false,
    message: `PASS: AGI/DAS MOSB gate satisfied for ${shipmentUnitId}.`
  };
}
