import type { CorpusChunk, DomainHint, EvidenceScore, EvidenceSnippet } from "./types.js";
import { CORPUS_CHUNKS } from "./generated/corpus-data.js";
import { maskPii } from "./redact.js";

export function loadCorpus(_corpusDir?: string): CorpusChunk[] {
  return CORPUS_CHUNKS;
}

function tokenize(input: string): string[] {
  return Array.from(
    new Set(
      input
        .toLowerCase()
        .replace(/[^a-z0-9가-힣_/-]+/g, " ")
        .split(/\s+/)
        .filter((term) => term.length >= 2)
    )
  );
}

const OPERATIONAL_ACTION_TERMS = new Set([
  "approve",
  "approval",
  "block",
  "blocked",
  "customs",
  "delivery",
  "dispatch",
  "evidence",
  "export",
  "gate",
  "invoice",
  "milestone",
  "mosb",
  "publish",
  "release",
  "report",
  "route",
  "site",
  "warehouse",
  "write",
  "근거",
  "승인",
  "통관",
  "창고",
  "현장",
  "보고서"
]);

function clamp01(value: number): number {
  return Number(Math.max(0, Math.min(1, value)).toFixed(2));
}

function supportStateFor(directSupport: number): EvidenceScore["supportState"] {
  if (directSupport >= 0.8) return "SUPPORTED";
  if (directSupport >= 0.35) return "PARTIAL";
  return "NO_DIRECT_EVIDENCE";
}

function buildEvidenceScore(args: {
  chunk: CorpusChunk;
  score: number;
  terms: readonly string[];
  requiredDocs: ReadonlySet<string>;
  domainHints: ReadonlySet<DomainHint>;
}): EvidenceScore {
  const searchable = `${args.chunk.docId} ${args.chunk.title} ${args.chunk.sectionPath} ${args.chunk.text}`.toLowerCase();
  const matchedTerms = args.terms.filter((term) => searchable.includes(term));
  const directSupport = args.terms.length === 0 ? 1 : clamp01(matchedTerms.length / args.terms.length);
  const domainSpecificity = args.domainHints.size === 0
    ? 0.5
    : clamp01(args.chunk.domains.filter((domain) => args.domainHints.has(domain)).length / args.domainHints.size);
  const requiredDocMatch = args.requiredDocs.has(args.chunk.docId.toLowerCase());
  const authorityLevel = clamp01((args.chunk.docId.includes("CONSOLIDATED-00") ? 0.4 : 0) + (requiredDocMatch ? 0.4 : 0) + 0.2);
  const operationalHits = Array.from(OPERATIONAL_ACTION_TERMS).filter((term) => searchable.includes(term)).length;
  const operationalActionability = clamp01(operationalHits / 6);
  const recency = clamp01(/\b20\d{2}\b|v\d+|\d+x/i.test(`${args.chunk.version} ${args.chunk.sectionPath}`) ? 0.8 : 0.5);
  const intentRelevance = clamp01(args.score / Math.max(10, args.terms.length * 3 + 12));
  const finalScore = clamp01(
    intentRelevance * 0.24 +
    directSupport * 0.32 +
    domainSpecificity * 0.16 +
    authorityLevel * 0.12 +
    operationalActionability * 0.1 +
    recency * 0.06
  );

  return {
    evidenceId: args.chunk.id,
    intentRelevance,
    domainSpecificity,
    directSupport,
    authorityLevel,
    operationalActionability,
    recency,
    finalScore,
    supportState: supportStateFor(directSupport)
  };
}

export function searchCorpus(args: {
  query: string;
  requiredDocs?: string[];
  domainHints?: DomainHint[];
  topK?: number;
  corpus?: CorpusChunk[];
}): EvidenceSnippet[] {
  const corpus = args.corpus ?? loadCorpus();
  const terms = tokenize(args.query);
  const requiredDocs = new Set((args.requiredDocs ?? []).map((doc) => doc.toLowerCase()));
  const domainHints = new Set(args.domainHints ?? []);
  const topK = Math.min(Math.max(args.topK ?? 8, 1), 20);

  const scored = corpus
    .map((chunk) => {
      const haystack = `${chunk.docId} ${chunk.title} ${chunk.sectionPath} ${chunk.text}`.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (haystack.includes(term)) score += term.length > 4 ? 3 : 1;
      }
      if (requiredDocs.has(chunk.docId.toLowerCase())) score += 5;
      if (Array.from(domainHints).some((domain) => chunk.domains.includes(domain))) score += 4;
      if (chunk.docId.includes("CONSOLIDATED-00")) score += 3;
      const evidenceScore = buildEvidenceScore({ chunk, score, terms, requiredDocs, domainHints });
      return { chunk, score, evidenceScore };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.evidenceScore.finalScore - a.evidenceScore.finalScore || b.score - a.score);

  const requiredSelections = Array.from(requiredDocs)
    .map((docId) => scored.find(({ chunk }) => chunk.docId.toLowerCase() === docId))
    .filter((item): item is (typeof scored)[number] => Boolean(item));

  const requiredIds = new Set(requiredSelections.map((item) => item.chunk.id));
  const selected = [
    ...requiredSelections.sort((a, b) => b.evidenceScore.finalScore - a.evidenceScore.finalScore || b.score - a.score),
    ...scored.filter((item) => !requiredIds.has(item.chunk.id))
  ].slice(0, topK);

  return selected.map(({ chunk, evidenceScore }) => {
    const normalized = chunk.text.replace(/\s+/g, " ").trim();
    const snippetText = normalized.length > 500 ? `${normalized.slice(0, 500)}…` : normalized;
    const masked = maskPii(snippetText);
    return {
      id: chunk.id,
      docId: chunk.docId,
      title: chunk.title,
      version: chunk.version,
      sectionPath: chunk.sectionPath,
      snippet: masked.text,
      docHash: chunk.docHash,
      confidence: Number(Math.min(0.99, 0.45 + evidenceScore.finalScore * 0.54).toFixed(2)),
      evidenceScore,
      sourceType: "ontology_corpus"
    };
  });
}
