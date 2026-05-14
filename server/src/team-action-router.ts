// Team Action Router — milestone × domain → owner role → ActionProposal
// PII principle: no raw contact; role-first assignment only.
// Source of truth for team_role_matrix; D1 lookup can override at runtime.

export type ActionProposal = {
  actionType: string;
  targetObject: string;
  ownerRole: string;
  backupRole: string | null;
  humanGateRequired: boolean;
  dueAt: string | null;
  requiredDocs: string[];
  piiMasked: true;
};

export type TeamActionResult = {
  shipmentUnitId: string;
  milestoneCode: string;
  domain: string;
  proposals: ActionProposal[];
  message: string;
  generatedAt: string;
};

type RoleMatrixEntry = {
  ownerRole: string;
  backupRole: string | null;
  requiredDocs: string[];
  humanGateRequired: boolean;
};

// Inline matrix matching the D1 seed in migration 0003
const ROLE_MATRIX: Array<{
  milestoneMin: number;
  milestoneMax: number;
  domain: string;
  entry: RoleMatrixEntry;
}> = [
  {
    milestoneMin: 80, milestoneMax: 92, domain: "customs",
    entry: {
      ownerRole: "Inbound Customs Documentation",
      backupRole: "Port/Field Gate Coordinator",
      requiredDocs: ["BOE", "DO", "BL", "MSDS", "permit"],
      humanGateRequired: true
    }
  },
  {
    milestoneMin: 100, milestoneMax: 100, domain: "port",
    entry: {
      ownerRole: "Port/Field Gate Coordinator",
      backupRole: "Warehouse Execution Coordinator",
      requiredDocs: ["DO", "gate_pass", "EIR"],
      humanGateRequired: false
    }
  },
  {
    milestoneMin: 110, milestoneMax: 121, domain: "warehouse",
    entry: {
      ownerRole: "Warehouse Execution Coordinator",
      backupRole: "Site Logistics",
      requiredDocs: ["WH_receipt", "PL", "DN", "MTC"],
      humanGateRequired: false
    }
  },
  {
    milestoneMin: 115, milestoneMax: 117, domain: "marine",
    entry: {
      ownerRole: "Marine Supervisor",
      backupRole: "Site Logistics",
      requiredDocs: ["SR", "load_manifest", "sail_away_approval"],
      humanGateRequired: true
    }
  },
  {
    milestoneMin: 130, milestoneMax: 140, domain: "site",
    entry: {
      ownerRole: "Site Receiving Coordinator",
      backupRole: "Material/Cost Review",
      requiredDocs: ["delivery_note", "MRR", "MRI", "POD", "GRN", "OSDR"],
      humanGateRequired: false
    }
  },
  {
    milestoneMin: 160, milestoneMax: 160, domain: "cost",
    entry: {
      ownerRole: "Material/Cost Review",
      backupRole: "Finance Approver",
      requiredDocs: ["invoice", "CostGuardResult", "proof_artifact"],
      humanGateRequired: true
    }
  }
];

function parseMilestoneCode(code: string): number {
  const num = parseInt(code.replace(/^M/i, ""), 10);
  return Number.isFinite(num) ? num : -1;
}

function lookupEntry(milestoneCode: string, domain: string): RoleMatrixEntry | null {
  const num = parseMilestoneCode(milestoneCode);
  const domainLower = domain.toLowerCase();

  // Exact domain match first
  for (const row of ROLE_MATRIX) {
    if (
      num >= row.milestoneMin &&
      num <= row.milestoneMax &&
      row.domain === domainLower
    ) {
      return row.entry;
    }
  }

  // Fallback: milestone range match without domain filter
  for (const row of ROLE_MATRIX) {
    if (num >= row.milestoneMin && num <= row.milestoneMax) {
      return row.entry;
    }
  }

  return null;
}

function actionTypeForMilestone(milestoneCode: string, domain: string): string {
  const num = parseMilestoneCode(milestoneCode);
  if (num >= 80 && num <= 92) return "REQUEST_CUSTOMS_DOC_FOLLOWUP";
  if (num === 100) return "CONFIRM_GATE_RELEASE";
  // Specific marine milestones must be checked before the wider warehouse range
  if (num === 115) return "REQUEST_MOSB_M115_EVIDENCE";
  if (num === 116) return "REQUEST_LCT_LOAD_MANIFEST";
  if (num === 117) return "REQUEST_SAIL_AWAY_APPROVAL";
  if (num >= 110 && num <= 121) return "CONFIRM_WAREHOUSE_RECEIPT";
  if (num >= 130 && num <= 140) return "CONFIRM_SITE_ARRIVAL_POD";
  if (num === 160) return "REVIEW_INVOICE_COST_DISCREPANCY";
  return `ACTION_M${num}_${domain.toUpperCase()}`;
}

function dueAtHours(hoursFromNow: number): string {
  const dt = new Date(Date.now() + hoursFromNow * 60 * 60 * 1000);
  return dt.toISOString();
}

function defaultDueAt(milestoneCode: string): string | null {
  const num = parseMilestoneCode(milestoneCode);
  // Customs / customs docs: 24h
  if (num >= 80 && num <= 92) return dueAtHours(24);
  // Marine gate milestones: 12h
  if (num >= 115 && num <= 117) return dueAtHours(12);
  // Cost close: 48h
  if (num === 160) return dueAtHours(48);
  return null;
}

export function routeTeamAction(
  shipmentUnitId: string,
  milestoneCode: string,
  domain: string,
  openExceptions: string[] = []
): TeamActionResult {
  const entry = lookupEntry(milestoneCode, domain);
  const proposals: ActionProposal[] = [];

  if (entry) {
    proposals.push({
      actionType: actionTypeForMilestone(milestoneCode, domain),
      targetObject: `ShipmentUnit:${shipmentUnitId}`,
      ownerRole: entry.ownerRole,
      backupRole: entry.backupRole,
      humanGateRequired: entry.humanGateRequired,
      dueAt: defaultDueAt(milestoneCode),
      requiredDocs: [...entry.requiredDocs],
      piiMasked: true
    });
  }

  // Additional proposals for each open exception
  for (const exception of openExceptions) {
    const exceptionDomain = exception.toLowerCase().includes("invoice") || exception.toLowerCase().includes("cost")
      ? "cost"
      : exception.toLowerCase().includes("doc") || exception.toLowerCase().includes("customs")
        ? "customs"
        : domain;
    const exceptionEntry = lookupEntry(milestoneCode, exceptionDomain);
    if (exceptionEntry && exceptionEntry.ownerRole !== entry?.ownerRole) {
      proposals.push({
        actionType: `RESOLVE_EXCEPTION:${exception.substring(0, 40).replace(/\s+/g, "_")}`,
        targetObject: `ShipmentUnit:${shipmentUnitId}`,
        ownerRole: exceptionEntry.ownerRole,
        backupRole: exceptionEntry.backupRole,
        humanGateRequired: true,
        dueAt: dueAtHours(24),
        requiredDocs: exceptionEntry.requiredDocs,
        piiMasked: true
      });
    }
  }

  return {
    shipmentUnitId,
    milestoneCode,
    domain,
    proposals,
    message: proposals.length === 0
      ? `No action matrix entry for milestone ${milestoneCode} / domain ${domain}.`
      : `${proposals.length} action proposal(s) generated for ${shipmentUnitId} at ${milestoneCode}.`,
    generatedAt: new Date().toISOString()
  };
}
