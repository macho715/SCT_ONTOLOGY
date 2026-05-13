import type { CorpusChunk, DomainHint, EvidenceSnippet } from "./types.js";
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
      return { chunk, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  const requiredSelections = Array.from(requiredDocs)
    .map((docId) => scored.find(({ chunk }) => chunk.docId.toLowerCase() === docId))
    .filter((item): item is (typeof scored)[number] => Boolean(item));

  const selected = [...requiredSelections, ...scored]
    .filter((item, index, all) => all.findIndex((candidate) => candidate.chunk.id === item.chunk.id) === index)
    .slice(0, topK);

  return selected.map(({ chunk, score }) => {
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
      confidence: Number(Math.min(0.99, 0.45 + score / 40).toFixed(2)),
      sourceType: "ontology_corpus"
    };
  });
}
