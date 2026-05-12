import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { CorpusChunk, DomainHint, EvidenceSnippet } from "./types.js";
import { maskPii, sha256 } from "./redact.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..", "..");
const DEFAULT_CORPUS_DIR = path.join(ROOT_DIR, "data", "corpus");

const DOMAIN_BY_DOC: Array<[RegExp, DomainHint[]]> = [
  [/00|master/i, ["master"]],
  [/01|framework|infra/i, ["compliance"]],
  [/02|warehouse|whp/i, ["warehouse"]],
  [/03|document|ocr/i, ["document"]],
  [/04|marine|barge|bulk|oog/i, ["marine"]],
  [/05|invoice|cost/i, ["cost"]],
  [/06|material|chain/i, ["material"]],
  [/07|port|ofco/i, ["port"]],
  [/08|communication/i, ["communication"]],
  [/09|operations|analytics/i, ["operations"]]
];

function domainsForFile(fileName: string): DomainHint[] {
  const domains = new Set<DomainHint>();
  for (const [pattern, values] of DOMAIN_BY_DOC) {
    if (pattern.test(fileName)) values.forEach((value) => domains.add(value));
  }
  if (domains.size === 0) domains.add("master");
  return Array.from(domains);
}

function parseFrontmatterVersion(text: string): string {
  const versionMatch = text.match(/version:\s*["']?([^"'\n]+)["']?/i);
  const dateMatch = text.match(/date:\s*["']?([^"'\n]+)["']?/i);
  return (versionMatch?.[1] ?? dateMatch?.[1] ?? "sample-2026-05-10").trim();
}

function sectionize(text: string): Array<{ sectionPath: string; text: string }> {
  const lines = text.split(/\r?\n/);
  const sections: Array<{ sectionPath: string; text: string }> = [];
  let currentTitle = "Document Root";
  let buffer: string[] = [];

  const flush = () => {
    const body = buffer.join("\n").trim();
    if (body) sections.push({ sectionPath: currentTitle, text: body });
    buffer = [];
  };

  for (const line of lines) {
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flush();
      currentTitle = heading[2].trim();
    } else {
      buffer.push(line);
    }
  }
  flush();
  return sections.length > 0 ? sections : [{ sectionPath: "Document Root", text }];
}

export function loadCorpus(corpusDir = DEFAULT_CORPUS_DIR): CorpusChunk[] {
  if (!fs.existsSync(corpusDir)) return [];
  const files = fs
    .readdirSync(corpusDir)
    .filter((file) => file.toLowerCase().endsWith(".md"))
    .sort();

  const chunks: CorpusChunk[] = [];
  for (const file of files) {
    const fullPath = path.join(corpusDir, file);
    let raw: string;
    try {
      raw = fs.readFileSync(fullPath, "utf8");
    } catch (err) {
      // CR-03: Skip unreadable files rather than crashing the entire corpus load
      console.warn(`corpus: skipping unreadable file ${file}:`, err);
      continue;
    }
    const docHash = sha256(raw);
    const docId = file.replace(/\.md$/i, "");
    const title = raw.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? docId;
    const version = parseFrontmatterVersion(raw);
    const domains = domainsForFile(file);

    for (const [idx, section] of sectionize(raw).entries()) {
      chunks.push({
        id: `${docId}#${idx + 1}`,
        docId,
        title,
        version,
        sectionPath: section.sectionPath,
        text: section.text,
        docHash,
        domains
      });
    }
  }
  return chunks;
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
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return scored.map(({ chunk, score }) => {
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
