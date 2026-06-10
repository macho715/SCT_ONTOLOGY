export interface ExportRecord {
  result: unknown;
  url: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __invoice_audit_exports: Map<string, ExportRecord> | undefined;
}

export const EXPORTS_MAP: Map<string, ExportRecord> =
  globalThis.__invoice_audit_exports ??
  (globalThis.__invoice_audit_exports = new Map<string, ExportRecord>());

export function isDevStub(): boolean {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  return !token || token.startsWith('dev-stub');
}
