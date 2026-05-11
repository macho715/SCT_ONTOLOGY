import type { GroundedAnswer, EvidenceSnippet, ValidationFinding, ActionRecommendation } from "./types.js";

export function parseGroundedAnswer(input: unknown): GroundedAnswer {
  if (!input || typeof input !== "object") throw new Error("parseGroundedAnswer: invalid input");
  const obj = input as Record<string, unknown>;

  let core: Record<string, unknown>;
  if (obj._meta && typeof obj._meta === "object") {
    // ChatGPT format: has _meta with openai keys
    core = (obj.structuredContent ?? obj) as Record<string, unknown>;
  } else if (obj.structuredContent && typeof obj.structuredContent === "object") {
    // Wrapped structuredContent without _meta
    core = obj.structuredContent as Record<string, unknown>;
  } else {
    // Claude format: direct GroundedAnswer
    core = obj;
  }

  // Strip ChatGPT-only ui field before returning
  const { ui: _ui, ...answer } = core as Partial<GroundedAnswer> & { ui?: unknown };
  return answer as GroundedAnswer;
}

function verdictBadge(verdict: string): string {
  const badges: Record<string, string> = {
    PASS: "✅ PASS",
    WARN: "⚠️ WARN",
    BLOCK: "🚫 BLOCK",
    INFO: "ℹ️ INFO",
    NO_EVIDENCE: "❓ NO_EVIDENCE"
  };
  return badges[verdict] ?? verdict;
}

function renderEvidence(ev: EvidenceSnippet[]): string {
  if (!ev.length) return "_No evidence found._";
  return ev
    .map((e) => `- **[${e.docId}]** ${e.sectionPath} — confidence ${(e.confidence * 100).toFixed(0)}%\n  > ${e.snippet}`)
    .join("\n");
}

function renderValidation(findings: ValidationFinding[]): string {
  if (!findings.length) return "_No validation findings._";
  return findings.map((f) => `- [${f.severity}] **${f.ruleId}**: ${f.message}`).join("\n");
}

function renderActions(actions: ActionRecommendation[]): string {
  if (!actions.length) return "_No actions required._";
  return actions
    .map((a) => {
      const gate = a.humanGateRequired ? " 🔒 Human gate required" : "";
      return `- **${a.actionType}** (owner: ${a.ownerRole}${gate})`;
    })
    .join("\n");
}

export function renderAnswerMarkdown(answer: GroundedAnswer): string {
  const verdict = verdictBadge(answer.verdict);
  const requiredDocs = answer.route?.requiredDocs?.join(", ") ?? "—";
  const domains = answer.route?.domains?.join(", ") ?? "—";
  const evidenceCount = answer.evidence?.length ?? 0;

  const parts: string[] = [
    `## HVDC Ontology Answer — ${verdict}`,
    "",
    `**Route:** ${requiredDocs}  `,
    `**Domains:** ${domains}  `,
    `**Validation Status:** ${answer.validationStatus}`,
    "",
    `### Summary`,
    answer.summary,
    "",
    `### Business Impact`,
    answer.businessImpact,
    ""
  ];

  if (answer.details?.length) {
    parts.push("### Details");
    answer.details.forEach((d) => parts.push(`- ${d}`));
    parts.push("");
  }

  parts.push(`### Evidence (${evidenceCount}건)`);
  parts.push(renderEvidence(answer.evidence ?? []));
  parts.push("");

  parts.push("### Validation");
  parts.push(renderValidation(answer.validation ?? []));
  parts.push("");

  parts.push("### Next Actions");
  parts.push(renderActions(answer.actions ?? []));

  if (answer.piiMasked) {
    parts.push("");
    parts.push("_⚠️ PII fields have been masked in this response._");
  }

  return parts.join("\n");
}
