// MOSB Route Gate — V-AGIDAS-001
// AGI/DAS offshore routes require M115 MOSB staging evidence before M130 Site Arrived closes.
// M116 LCT/Barge Loaded and M117 Sail-away Approved are also checked unless exception approved.

export type RouteGateStatus = "PASS" | "WARN" | "BLOCK";

export type RouteGateCard = {
  shipmentUnitId: string;
  declaredDestination: string;
  routingPattern: string;
  status: RouteGateStatus;
  appliedRule: string | null;
  missingMilestones: string[];
  requiredEvidence: string[];
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

function hasMilestoneWithDate(milestones: MilestoneRecord[], code: string): boolean {
  return milestones.some(
    (m) => normalize(m.code) === normalize(code) && Boolean(m.actualDt)
  );
}

function hasApprovedExceptionFor(milestones: MilestoneRecord[], code: string): boolean {
  return milestones.some(
    (m) => normalize(m.code) === normalize(code) && Boolean(m.approvedExceptionRef)
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
  if (!AGI_DAS_DESTINATIONS.has(dest) || !MOSB_ROUTING_PATTERNS.has(routing)) {
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

  // V-AGIDAS-001: M130 close requires M115
  if (m130Closed && !m115Staged) {
    missingMilestones.push("M115");
    requiredEvidence.push("MOSB staging record", "Staging confirmation from Marine Supervisor");
    return {
      ...base,
      status: "BLOCK",
      appliedRule: "V-AGIDAS-001",
      missingMilestones,
      requiredEvidence,
      ownerRole: "Marine Supervisor",
      nextAction: "Provide M115 MOSB staging evidence before M130 can be closed.",
      humanGateRequired: true,
      message: "BLOCK: M130 Site Arrived cannot close without M115 MOSB Staged evidence (V-AGIDAS-001)."
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
