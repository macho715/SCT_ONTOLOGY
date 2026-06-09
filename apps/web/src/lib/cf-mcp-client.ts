import { randomUUID } from 'node:crypto';
import { checkAndConvertCurrency } from './fx-check';

export interface CfMcpClient {
  validate(jobId: string, payload: { invoice_lines: unknown[]; evidence_index: unknown[]; rule_version?: string }): Promise<{
    sct_trace_id: string;
    cf_mcp_tool_calls: Array<{ tool: string; latency_ms: number; status: 'OK' | 'ERROR' | 'TIMEOUT' }>;
    type_b_results: Array<{ line_id: string; type_b: string | null }>;
    rate_checks: Array<{ line_id: string; rate_status: string; validity_status: 'VALID'|'EXPIRED'|'PENDING'|null }>;
    evidence_requirements: Array<{ line_id: string; required_evidence: string[] }>;
    costguard_results: Array<{ line_id: string; band: 'PASS'|'WARN'|'HIGH'|'CRITICAL'; verdict: string; delta_pct: number | null; prism_kernel_proof_ref: string | null; fx_policy_id?: string | null }>;
    doc_guardian_results: Array<{ line_id: string | null; code: string; severity: 'AMBER'|'ZERO' }>;
    gate_results: Array<{ line_id: string | null; gate_status: 'PASS'|'AMBER'|'ZERO'|'FAILED'; reason_codes: string[] }>;
    confidence: number;
    reason_codes: string[];
    warnings: string[];
  }>;
}

export class McpUnavailableError extends Error {
  readonly code = 'MCP_UNAVAILABLE';
  constructor(msg: string) { super(msg); this.name = 'McpUnavailableError'; }
}

export function createCfMcpClient(opts: { baseUrl: string; timeoutMs: number; retries: number; backoffMs?: number }): CfMcpClient {
  const { baseUrl, timeoutMs, retries, backoffMs = 1000 } = opts;
  const url = `${baseUrl.replace(/\/$/, '')}/mcp`;

  async function callTool<T>(name: string, args: Record<string, unknown>): Promise<{ result: T; latency_ms: number; status: 'OK' | 'ERROR' | 'TIMEOUT' }> {
    let lastErr: unknown = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const start = Date.now();
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', id: randomUUID(), method: 'tools/call', params: { name, arguments: args } }),
          signal: controller.signal
        });
        const latency_ms = Date.now() - start;
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json() as { result?: T; error?: { message: string } };
        if (json.error) throw new Error(json.error.message);
        return { result: json.result as T, latency_ms, status: 'OK' };
      } catch (e) {
        lastErr = e;
        const latency_ms = Date.now() - start;
        const isTimeout = (e as Error).name === 'AbortError';
        clearTimeout(timer);
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, backoffMs * Math.pow(2, attempt)));
          continue;
        }
        if (isTimeout) throw new McpUnavailableError(`MCP_UNAVAILABLE: tool ${name} timeout after ${retries + 1} attempts`);
        throw new McpUnavailableError(`MCP_UNAVAILABLE: tool ${name} unavailable: ${(e as Error).message}`);
      }
    }
    throw new McpUnavailableError(`MCP_UNAVAILABLE: tool ${name} exhausted retries: ${String(lastErr)}`);
  }

  return {
    async validate(jobId, payload) {
      const sct_trace_id = `sct_${randomUUID().replace(/-/g, '').slice(0, 12)}`;
      const toolCalls: Array<{ tool: string; latency_ms: number; status: 'OK' | 'ERROR' | 'TIMEOUT' }> = [];

      // Check and convert cross-currency lines using FxPolicy before running CostGuard
      const processedLines = [];
      let activeFxPolicyId: string | null = null;

      for (const line of (payload.invoice_lines as any[])) {
        const lineCurrency = line.currency;
        const rateCurrency = line.rate_ref_currency || line.contract_currency;

        if (rateCurrency && lineCurrency !== rateCurrency) {
          const checkRes = await checkAndConvertCurrency(lineCurrency, rateCurrency, line.amount, line.rate_date);
          if (!checkRes.allowed) {
            const err = new Error(checkRes.error_message);
            (err as any).code = checkRes.error_code;
            throw err;
          }
          activeFxPolicyId = checkRes.fx_policy_id || null;
          processedLines.push({
            ...line,
            amount: checkRes.converted_amount,
            rate: line.rate ? line.rate * (checkRes.fx_rate || 1) : line.rate,
            currency: rateCurrency
          });
        } else {
          processedLines.push(line);
        }
      }

      const route = await callTool<{ domain: string; requiredCorpus: string[] }>('route_question', { question: `audit:${jobId}`, userRole: 'ops_user' });
      toolCalls.push({ tool: 'route_question', latency_ms: route.latency_ms, status: route.status });

      const costguard = await callTool<{ lineResults: Array<{ lineId: string; band: 'PASS'|'WARN'|'HIGH'|'CRITICAL'; deltaPct: number | null; verdict: string; proofRef: string | null }> }>('check_cost_guard', {
        invoiceNo: jobId,
        currency: processedLines[0]?.currency ?? 'AED',
        lines: processedLines.map(l => ({
          lineNo: l.line_id,
          item: l.description,
          qty: l.qty ?? 1,
          rate: l.rate ?? l.amount,
          draftAmount: l.amount,
          standardAmount: l.standard_amount ?? null,
          currency: l.currency,
          evidenceIds: []
        }))
      });
      toolCalls.push({ tool: 'check_cost_guard', latency_ms: costguard.latency_ms, status: costguard.status });

      const doc = await callTool<{ findings: Array<{ lineId: string | null; code: string; severity: 'AMBER' | 'ZERO' }> }>('check_doc_guardian', { jobId, evidence: payload.evidence_index });
      toolCalls.push({ tool: 'check_doc_guardian', latency_ms: doc.latency_ms, status: doc.status });

      const costguard_results = costguard.result.lineResults.map(lr => ({
        line_id: lr.lineId,
        band: lr.band,
        verdict: lr.verdict,
        delta_pct: lr.deltaPct,
        prism_kernel_proof_ref: lr.proofRef,
        fx_policy_id: activeFxPolicyId
      }));

      const gate_results = costguard_results.map(cr => ({
        line_id: cr.line_id,
        gate_status: cr.band === 'PASS' ? 'PASS' as const : cr.band === 'WARN' ? 'AMBER' as const : 'ZERO' as const,
        reason_codes: [`COSTGUARD_${cr.band}`]
      }));

      return {
        sct_trace_id,
        cf_mcp_tool_calls: toolCalls,
        type_b_results: [],
        rate_checks: [],
        evidence_requirements: [],
        costguard_results,
        doc_guardian_results: doc.result.findings.map(f => ({
          line_id: f.lineId,
          code: f.code,
          severity: f.severity
        })),
        gate_results,
        confidence: 0.95,
        reason_codes: [],
        warnings: []
      };
    }
  };
}
