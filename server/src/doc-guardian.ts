// Document Guardian — cross-document consistency validation
// Evidence-only layer: creates EvidenceAssertion + VerificationResult + AuditRecord
// Operational truth (ShipmentUnit / Invoice / CustomsEntry) is never mutated here.

export type DocGuardianStatus = "PASS" | "WARN" | "BLOCK";

export type CrossDocIssue = {
  field: string;
  sourceDoc: string;
  targetDoc: string;
  sourceValue: string;
  targetValue: string;
  delta: string;
  severity: "WARN" | "BLOCK";
};

export type DocGuardianResult = {
  docIds: string[];
  verificationStatus: DocGuardianStatus;
  crossDocIssues: CrossDocIssue[];
  numericIntegrityPct: number;
  evidenceAssertions: string[];
  auditRecordId: string;
  humanGateRequired: boolean;
  message: string;
  generatedAt: string;
};

export type DocumentInput = {
  docId: string;
  docType: "CI" | "PL" | "BL" | "BOE" | "DO" | "MRR" | "MRI" | "POD" | "GRN" | "OSDR" | string;
  docNo?: string;
  docHash?: string;
  shipmentUnitId?: string;
  qty?: number | null;
  weight?: number | null;
  currency?: "AED" | "USD";
  amount?: number | null;
  containerNo?: string | null;
  packageCount?: number | null;
};

const QTY_TOLERANCE = 0.01;
const WEIGHT_TOLERANCE = 0.01;

function fmtNum(v: number | null | undefined): string {
  return v == null ? "N/A" : v.toFixed(3);
}

function numericDelta(a: number | null | undefined, b: number | null | undefined): number | null {
  if (a == null || b == null) return null;
  return Math.abs(a - b);
}

function randomId(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function checkDocGuardian(documents: DocumentInput[]): DocGuardianResult {
  const docIds = documents.map((d) => d.docId);
  const auditRecordId = `ARD-${randomId()}`;
  const crossDocIssues: CrossDocIssue[] = [];
  const evidenceAssertions: string[] = [];

  let totalChecks = 0;
  let passedChecks = 0;

  // Cross-doc qty consistency
  const docsWithQty = documents.filter((d) => d.qty != null);
  for (let i = 0; i < docsWithQty.length; i++) {
    for (let j = i + 1; j < docsWithQty.length; j++) {
      const a = docsWithQty[i];
      const b = docsWithQty[j];
      totalChecks++;
      const delta = numericDelta(a.qty, b.qty);
      if (delta !== null && delta > QTY_TOLERANCE) {
        crossDocIssues.push({
          field: "qty",
          sourceDoc: a.docId,
          targetDoc: b.docId,
          sourceValue: fmtNum(a.qty),
          targetValue: fmtNum(b.qty),
          delta: delta.toFixed(3),
          severity: "BLOCK"
        });
      } else {
        passedChecks++;
        evidenceAssertions.push(`EVA-QTY-${a.docId}-${b.docId}`);
      }
    }
  }

  // Cross-doc weight consistency
  const docsWithWeight = documents.filter((d) => d.weight != null);
  for (let i = 0; i < docsWithWeight.length; i++) {
    for (let j = i + 1; j < docsWithWeight.length; j++) {
      const a = docsWithWeight[i];
      const b = docsWithWeight[j];
      totalChecks++;
      const delta = numericDelta(a.weight, b.weight);
      if (delta !== null && delta > WEIGHT_TOLERANCE) {
        crossDocIssues.push({
          field: "weight",
          sourceDoc: a.docId,
          targetDoc: b.docId,
          sourceValue: fmtNum(a.weight),
          targetValue: fmtNum(b.weight),
          delta: delta.toFixed(3),
          severity: "WARN"
        });
      } else {
        passedChecks++;
        evidenceAssertions.push(`EVA-WGT-${a.docId}-${b.docId}`);
      }
    }
  }

  // Container number consistency
  const docsWithContainer = documents.filter((d) => d.containerNo);
  const containerValues = new Set(docsWithContainer.map((d) => (d.containerNo ?? "").trim().toUpperCase()));
  if (docsWithContainer.length > 1 && containerValues.size > 1) {
    totalChecks++;
    crossDocIssues.push({
      field: "containerNo",
      sourceDoc: docsWithContainer[0].docId,
      targetDoc: docsWithContainer[1].docId,
      sourceValue: docsWithContainer[0].containerNo ?? "",
      targetValue: docsWithContainer[1].containerNo ?? "",
      delta: "MISMATCH",
      severity: "BLOCK"
    });
  } else if (docsWithContainer.length > 1) {
    totalChecks++;
    passedChecks++;
    evidenceAssertions.push(`EVA-CTR-${docIds.join("-")}`);
  }

  // Package count consistency (CI vs PL)
  const ci = documents.find((d) => d.docType === "CI");
  const pl = documents.find((d) => d.docType === "PL");
  if (ci?.packageCount != null && pl?.packageCount != null) {
    totalChecks++;
    if (Math.abs(ci.packageCount - pl.packageCount) > 0) {
      crossDocIssues.push({
        field: "packageCount",
        sourceDoc: ci.docId,
        targetDoc: pl.docId,
        sourceValue: String(ci.packageCount),
        targetValue: String(pl.packageCount),
        delta: String(Math.abs(ci.packageCount - pl.packageCount)),
        severity: "WARN"
      });
    } else {
      passedChecks++;
      evidenceAssertions.push(`EVA-PKG-${ci.docId}-${pl.docId}`);
    }
  }

  const numericIntegrityPct =
    totalChecks === 0 ? 100 : parseFloat(((passedChecks / totalChecks) * 100).toFixed(2));

  const hasBlock = crossDocIssues.some((i) => i.severity === "BLOCK");
  const hasWarn = crossDocIssues.some((i) => i.severity === "WARN");

  const verificationStatus: DocGuardianStatus = hasBlock ? "BLOCK" : hasWarn ? "WARN" : "PASS";
  const humanGateRequired = hasBlock;

  const message =
    verificationStatus === "PASS"
      ? `PASS: ${documents.length} document(s) cross-validated. NumericIntegrity ${numericIntegrityPct}%.`
      : `${verificationStatus}: ${crossDocIssues.length} cross-doc issue(s) found. NumericIntegrity ${numericIntegrityPct}%.`;

  return {
    docIds,
    verificationStatus,
    crossDocIssues,
    numericIntegrityPct,
    evidenceAssertions,
    auditRecordId,
    humanGateRequired,
    message,
    generatedAt: new Date().toISOString()
  };
}
