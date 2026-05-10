import crypto from "node:crypto";

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE_RE = /(?:\+?\d[\d .()/-]{7,}\d)/g;
const TOKEN_RE = /(?:sk|pk|api|token|secret)[_-]?[A-Za-z0-9]{16,}/gi;

export function maskPii(input: string): { text: string; piiMasked: boolean } {
  let piiMasked = false;
  const text = input
    .replace(EMAIL_RE, () => {
      piiMasked = true;
      return "[EMAIL_MASKED]";
    })
    .replace(PHONE_RE, () => {
      piiMasked = true;
      return "[PHONE_MASKED]";
    })
    .replace(TOKEN_RE, () => {
      piiMasked = true;
      return "[TOKEN_MASKED]";
    });
  return { text, piiMasked };
}

export function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}
