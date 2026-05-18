export type IdentifierVariant = {
  raw: string;
  normalized: string;
};

const TOKEN_PATTERN = /[A-Za-z0-9][A-Za-z0-9._/-]{2,}/g;
const HVDC_ADOPT_PATTERN = /^HVDC[-_ ]ADOPT[-_ ]([A-Z]{2,8})[-_ ]0*(\d{1,8})(?:[-_ ]([A-Z0-9]{1,8}))?$/i;
const SHORT_ADOPT_PATTERN = /^([A-Z]{2,8})[-_ ]?0*(\d{1,8})(?:[-_ ]([A-Z0-9]{1,8}))?$/i;
const RULE_ID_PATTERN = /^(?:A|V|SCT|SYS|CARD|SEC|SRC)-[A-Z0-9]+(?:-[A-Z0-9]+)*-\d{3,}$/;

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

export function normalizeLookupToken(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, "-").replace(/_/g, "-");
}

function compactToken(value: string): string {
  return normalizeLookupToken(value).replace(/[-./]/g, "");
}

function hasPositiveSequenceNumber(digits: string): boolean {
  const parsed = Number.parseInt(digits, 10);
  return Number.isFinite(parsed) && parsed > 0;
}

export function isRuleIdLikeToken(value: string): boolean {
  return RULE_ID_PATTERN.test(normalizeLookupToken(value));
}

function canonicalHvdcAdoptCode(prefix: string, digits: string, suffix?: string): string {
  const parsed = Number.parseInt(digits, 10);
  const padded = Number.isFinite(parsed) ? String(parsed).padStart(4, "0") : digits;
  const suffixPart = suffix ? `-${suffix.toUpperCase()}` : "";
  return `HVDC-ADOPT-${prefix.toUpperCase()}-${padded}${suffixPart}`;
}

function compactHvdcAdoptCode(prefix: string, digits: string, suffix?: string): string {
  const parsed = Number.parseInt(digits, 10);
  const padded = Number.isFinite(parsed) ? String(parsed).padStart(4, "0") : digits;
  const suffixPart = suffix ? `-${suffix.toUpperCase()}` : "";
  return `${prefix.toUpperCase()}${padded}${suffixPart}`;
}

export function expandIdentifierVariants(raw: string): IdentifierVariant[] {
  const normalized = normalizeLookupToken(raw);
  if (isRuleIdLikeToken(normalized)) return [];

  const compact = compactToken(raw);
  const variants = [normalized, compact];

  const fullMatch = HVDC_ADOPT_PATTERN.exec(normalized);
  if (fullMatch && hasPositiveSequenceNumber(fullMatch[2])) {
    variants.push(canonicalHvdcAdoptCode(fullMatch[1], fullMatch[2], fullMatch[3]));
    variants.push(compactHvdcAdoptCode(fullMatch[1], fullMatch[2], fullMatch[3]));
  }

  const shortMatch = SHORT_ADOPT_PATTERN.exec(normalized) ?? SHORT_ADOPT_PATTERN.exec(compact);
  if (shortMatch && hasPositiveSequenceNumber(shortMatch[2])) {
    variants.push(canonicalHvdcAdoptCode(shortMatch[1], shortMatch[2], shortMatch[3]));
    variants.push(compactHvdcAdoptCode(shortMatch[1], shortMatch[2], shortMatch[3]));
  }

  return unique(variants).map((variant) => ({
    raw,
    normalized: variant
  }));
}

export function extractIdentifierLookupVariants(input: string): IdentifierVariant[] {
  const rawTokens = input.match(TOKEN_PATTERN) ?? [];
  const variants = rawTokens.flatMap(expandIdentifierVariants);
  const seen = new Set<string>();
  return variants.filter((variant) => {
    if (seen.has(variant.normalized)) return false;
    seen.add(variant.normalized);
    return true;
  });
}
