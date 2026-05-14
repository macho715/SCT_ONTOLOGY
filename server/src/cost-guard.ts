// Invoice COST-GUARD engine
// Δ% = (draft - standard) / standard × 100
// Band: ≤2.00 PASS | 2.01–5.00 WARN | 5.01–10.00 HIGH | >10.00 CRITICAL
// Human-gate: total > 100,000 AED OR band ∈ {HIGH, CRITICAL}

export type CostGuardBand = "PASS" | "WARN" | "HIGH" | "CRITICAL";
export type CostGuardVerdict = "PASS" | "BLOCK_FOR_REVIEW";

export type CostGuardLineResult = {
  lineNo: string;
  item: string;
  qty: number;
  rate: number;
  draftAmount: number;
  standardAmount: number;
  expectedByRate: number;
  currency: "AED" | "USD";
  deltaPct: number | null;
  band: CostGuardBand;
  rateMismatch: boolean;
  zeroStandard: boolean;
  missingEvidence: boolean;
  verdict: CostGuardVerdict;
  humanGateRequired: boolean;
  ruleViolations: string[];
  evidenceIds: string[];
};

export type CostGuardResult = {
  invoiceNo: string;
  lines: CostGuardLineResult[];
  invoiceTotalDraft: number;
  invoiceTotalStandard: number;
  invoiceTotalDeltaPct: number | null;
  currency: "AED" | "USD";
  overallBand: CostGuardBand;
  overallVerdict: CostGuardVerdict;
  humanGateRequired: boolean;
  blockReasons: string[];
  evidenceIds: string[];
  generatedAt: string;
};

export type InvoiceLineInput = {
  lineNo: string;
  item?: string;
  qty: number;
  rate: number;
  draftAmount: number;
  standardAmount?: number | null;
  currency?: "AED" | "USD";
  evidenceIds?: string[];
};

const HUMAN_GATE_AED = 100_000;
const DELTA_WARN = 2.0;
const DELTA_HIGH = 5.0;
const DELTA_CRITICAL = 10.0;

function toBand(absDeltaPct: number): CostGuardBand {
  if (absDeltaPct <= DELTA_WARN) return "PASS";
  if (absDeltaPct <= DELTA_HIGH) return "WARN";
  if (absDeltaPct <= DELTA_CRITICAL) return "HIGH";
  return "CRITICAL";
}

function money(v: number): number {
  return Number.isFinite(v) ? v : 0;
}

function calcLine(input: InvoiceLineInput): CostGuardLineResult {
  const qty = money(input.qty);
  const rate = money(input.rate);
  const draftAmount = money(input.draftAmount);
  const expectedByRate = qty * rate;
  const standardAmount = input.standardAmount != null && input.standardAmount !== undefined
    ? money(input.standardAmount)
    : expectedByRate;
  const currency = input.currency ?? "AED";
  const evidenceIds = input.evidenceIds ?? [];

  const ruleViolations: string[] = [];
  const rateMismatch = Math.abs(draftAmount - expectedByRate) > 0.01;
  const zeroStandard = standardAmount === 0;
  const missingEvidence = evidenceIds.length === 0;

  if (rateMismatch) ruleViolations.push("V-COST-001: qty×rate≠amount±0.01");
  if (missingEvidence) ruleViolations.push("V-COST-003: no evidence reference");

  const deltaAmount = draftAmount - standardAmount;
  const deltaPct = zeroStandard ? null : (deltaAmount / standardAmount) * 100;

  const band: CostGuardBand =
    zeroStandard || rateMismatch || missingEvidence
      ? "CRITICAL"
      : toBand(Math.abs(deltaPct ?? 0));

  const humanGateRequired =
    draftAmount >= HUMAN_GATE_AED ||
    band === "HIGH" ||
    band === "CRITICAL";

  const verdict: CostGuardVerdict =
    band === "PASS" || band === "WARN" ? "PASS" : "BLOCK_FOR_REVIEW";

  return {
    lineNo: input.lineNo,
    item: input.item ?? "",
    qty,
    rate,
    draftAmount,
    standardAmount,
    expectedByRate,
    currency,
    deltaPct: deltaPct !== null ? parseFloat(deltaPct.toFixed(2)) : null,
    band,
    rateMismatch,
    zeroStandard,
    missingEvidence,
    verdict,
    humanGateRequired,
    ruleViolations,
    evidenceIds
  };
}

export function calcCostGuard(
  invoiceNo: string,
  lines: InvoiceLineInput[],
  currency: "AED" | "USD" = "AED"
): CostGuardResult {
  const calcedLines = lines.map(calcLine);

  const invoiceTotalDraft = calcedLines.reduce((sum, l) => sum + l.draftAmount, 0);
  const invoiceTotalStandard = calcedLines.reduce((sum, l) => sum + l.standardAmount, 0);
  const zeroTotalStandard = invoiceTotalStandard === 0;
  const totalDelta = invoiceTotalDraft - invoiceTotalStandard;
  const invoiceTotalDeltaPct = zeroTotalStandard
    ? null
    : parseFloat(((totalDelta / invoiceTotalStandard) * 100).toFixed(2));

  // V-COST-002: Σline amounts vs invoice total Δ > 2% is already reflected per line
  const blockReasons: string[] = [];
  if (!zeroTotalStandard && invoiceTotalDeltaPct !== null && Math.abs(invoiceTotalDeltaPct) > 2) {
    blockReasons.push(`V-COST-002: invoice total Δ ${invoiceTotalDeltaPct.toFixed(2)}% exceeds 2.00%`);
  }

  const worstBand = ((): CostGuardBand => {
    if (calcedLines.some((l) => l.band === "CRITICAL")) return "CRITICAL";
    if (calcedLines.some((l) => l.band === "HIGH")) return "HIGH";
    if (calcedLines.some((l) => l.band === "WARN")) return "WARN";
    return "PASS";
  })();

  const overallHumanGate =
    invoiceTotalDraft >= HUMAN_GATE_AED ||
    worstBand === "HIGH" ||
    worstBand === "CRITICAL" ||
    calcedLines.some((l) => l.humanGateRequired);

  if (overallHumanGate && invoiceTotalDraft >= HUMAN_GATE_AED) {
    blockReasons.push(`V-COST-GATE: invoice total ${invoiceTotalDraft.toFixed(2)} ${currency} exceeds ${HUMAN_GATE_AED.toLocaleString()} ${currency} human-gate threshold`);
  }

  const overallVerdict: CostGuardVerdict =
    worstBand === "PASS" || worstBand === "WARN" ? "PASS" : "BLOCK_FOR_REVIEW";

  const evidenceIds = [...new Set(calcedLines.flatMap((l) => l.evidenceIds))];

  return {
    invoiceNo,
    lines: calcedLines,
    invoiceTotalDraft: parseFloat(invoiceTotalDraft.toFixed(2)),
    invoiceTotalStandard: parseFloat(invoiceTotalStandard.toFixed(2)),
    invoiceTotalDeltaPct,
    currency,
    overallBand: worstBand,
    overallVerdict,
    humanGateRequired: overallHumanGate,
    blockReasons,
    evidenceIds,
    generatedAt: new Date().toISOString()
  };
}
