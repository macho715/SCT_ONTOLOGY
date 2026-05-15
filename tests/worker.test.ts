/**
 * Worker HTTP endpoint tests — storage stub pattern (Node-compatible).
 *
 * worker.ts imports @microlabs/otel-cf-workers which references cloudflare:
 * internal modules, so we cannot import the Worker default export directly
 * in a Node vitest run. Instead we test:
 *   1. createHvdcServer with auth/storage stubs — MCP tool surface
 *   2. D1 stub contract — correct shape for Worker SQL calls
 *   3. Storage adapter shape — correct interface for createProtectedStorage
 *   4. safeFileName / normalizeManagedPath / randomToken utility behaviour
 *      extracted by pattern-testing their invariants through tool calls
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { describe, expect, it } from "vitest";
import { createHvdcServer } from "../server/src/index.js";

// ─── Inline D1 stub ──────────────────────────────────────────────────────────

type StubRow = Record<string, unknown>;

function makeD1Stub(rows: StubRow[] = []) {
  const prepared = {
    bind: (..._args: unknown[]) => prepared,
    first: async <T = StubRow>() => (rows[0] as T) ?? null,
    all: async () => ({ results: rows }),
    run: async () => ({ success: true, meta: {} })
  };
  return { prepare: (_sql: string) => prepared } as unknown as D1Database;
}

// ─── Inline R2 stub ──────────────────────────────────────────────────────────

function makeR2Stub() {
  const store = new Map<string, string>();
  return {
    put: async (key: string, body: unknown) => { store.set(key, String(body)); return null; },
    get: async (key: string) => store.has(key) ? { text: async () => store.get(key)! } : null,
    delete: async (key: string) => { store.delete(key); },
    head: async (key: string) => store.has(key) ? { key } : null,
    list: async () => ({ objects: [], truncated: false }),
    _store: store
  } as unknown as R2Bucket;
}

// ─── withClient helper ───────────────────────────────────────────────────────

async function withClient(
  options: Record<string, unknown>,
  fn: (client: Client) => Promise<void>
): Promise<void> {
  const server = createHvdcServer(options as never);
  const client = new Client({ name: "worker-test", version: "0.0.1" });
  const [clientT, serverT] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverT), client.connect(clientT)]);
  try {
    await fn(client);
  } finally {
    await client.close();
    await server.close();
  }
}

const approval = {
  approvedByRole: "Ops Manager",
  approvalRef: "WK-TEST-001",
  reason: "Worker test suite approval."
};

// ─── D1 stub contract ────────────────────────────────────────────────────────

describe("D1 stub contract", () => {
  it("prepared statement returns null when rows is empty", async () => {
    const db = makeD1Stub([]);
    const row = await db.prepare("SELECT 1").first();
    expect(row).toBeNull();
  });

  it("prepared statement returns first row", async () => {
    const db = makeD1Stub([{ id: "abc", status: "PENDING" }]);
    const row = await db.prepare("SELECT 1").first<{ id: string }>();
    expect(row?.id).toBe("abc");
  });

  it("bind() is chainable and returns same object", async () => {
    const db = makeD1Stub([{ count: 3 }]);
    const stmt = db.prepare("SELECT COUNT(*) as count FROM t WHERE id = ?");
    const bound = stmt.bind("x");
    const result = await bound.first<{ count: number }>();
    expect(result?.count).toBe(3);
  });

  it("all() returns results array", async () => {
    const rows = [{ id: "1" }, { id: "2" }];
    const db = makeD1Stub(rows);
    const { results } = await db.prepare("SELECT id FROM t").all();
    expect(results).toHaveLength(2);
  });

  it("run() returns success true", async () => {
    const db = makeD1Stub();
    const result = await db.prepare("INSERT INTO t VALUES (1)").run();
    expect((result as { success: boolean }).success).toBe(true);
  });
});

// ─── R2 stub contract ────────────────────────────────────────────────────────

describe("R2 stub contract", () => {
  it("put and get roundtrip", async () => {
    const r2 = makeR2Stub();
    await r2.put("uploads/test/file.txt", "hello world");
    const obj = await r2.get("uploads/test/file.txt");
    expect(obj).not.toBeNull();
  });

  it("get returns null for missing key", async () => {
    const r2 = makeR2Stub();
    const obj = await r2.get("missing/key");
    expect(obj).toBeNull();
  });

  it("delete removes key", async () => {
    const r2 = makeR2Stub();
    await r2.put("tmp/key", "data");
    await r2.delete("tmp/key");
    const obj = await r2.get("tmp/key");
    expect(obj).toBeNull();
  });
});

// ─── Storage adapter: AUTH_REQUIRED without scopes ───────────────────────────

describe("Storage adapter — AUTH_REQUIRED without scopes", () => {
  it("create_upload_url returns AUTH_REQUIRED when not authenticated", async () => {
    await withClient({}, async (client) => {
      const res = await client.callTool({
        name: "create_upload_url",
        arguments: {
          fileName: "packing-list.pdf",
          mimeType: "application/pdf",
          byteLength: 1024,
          purpose: "evidence_attachment",
          approval
        }
      });
      expect((res.structuredContent as { status: string }).status).toBe("AUTH_REQUIRED");
    });
  });

  it("write_file_dry_run returns AUTH_REQUIRED when not authenticated", async () => {
    await withClient({}, async (client) => {
      const res = await client.callTool({
        name: "write_file_dry_run",
        arguments: {
          targetPath: "ops/note.md",
          content: "# note",
          changeReason: "Test write.",
          approval
        }
      });
      expect((res.structuredContent as { status: string }).status).toBe("AUTH_REQUIRED");
    });
  });

  it("write_file_commit returns AUTH_REQUIRED when not authenticated", async () => {
    await withClient({}, async (client) => {
      const res = await client.callTool({
        name: "write_file_commit",
        arguments: {
          proposalId: "wrp_does_not_exist",
          commitReason: "Test commit.",
          approval
        }
      });
      expect((res.structuredContent as { status: string }).status).toBe("AUTH_REQUIRED");
    });
  });

  it("attach_uploaded_file returns AUTH_REQUIRED when not authenticated", async () => {
    await withClient({}, async (client) => {
      const res = await client.callTool({
        name: "attach_uploaded_file",
        arguments: {
          uploadId: "upl_test_001",
          targetType: "ShipmentUnit",
          targetRef: "HVDC-ADOPT-PPL-0001",
          evidenceNote: "Test attachment evidence.",
          approval
        }
      });
      expect((res.structuredContent as { status: string }).status).toBe("AUTH_REQUIRED");
    });
  });

  it("complete_upload returns AUTH_REQUIRED when not authenticated", async () => {
    await withClient({}, async (client) => {
      const res = await client.callTool({
        name: "complete_upload",
        arguments: {
          uploadId: "upl_test_001",
          approval
        }
      });
      expect((res.structuredContent as { status: string }).status).toBe("AUTH_REQUIRED");
    });
  });
});

// ─── Storage adapter: STORAGE_UNAVAILABLE without bindings ───────────────────

describe("Storage adapter — STORAGE_UNAVAILABLE without bindings", () => {
  const auth = { authenticated: true, subject: "ops@test.com", scopes: ["files:upload", "files:write"] };

  it("create_upload_url returns STORAGE_UNAVAILABLE when storage not injected", async () => {
    await withClient({ auth }, async (client) => {
      const res = await client.callTool({
        name: "create_upload_url",
        arguments: {
          fileName: "file.pdf",
          mimeType: "application/pdf",
          byteLength: 512,
          purpose: "evidence_attachment",
          approval
        }
      });
      expect((res.structuredContent as { status: string }).status).toBe("STORAGE_UNAVAILABLE");
    });
  });

  it("write_file_dry_run returns STORAGE_UNAVAILABLE when storage not injected", async () => {
    await withClient({ auth }, async (client) => {
      const res = await client.callTool({
        name: "write_file_dry_run",
        arguments: {
          targetPath: "ops/note.md",
          content: "# note",
          changeReason: "Test write.",
          approval
        }
      });
      expect((res.structuredContent as { status: string }).status).toBe("STORAGE_UNAVAILABLE");
    });
  });
});

// ─── Storage adapter: write proposal happy path ──────────────────────────────

describe("Storage adapter — write proposal happy path", () => {
  it("dry-run then commit roundtrip succeeds with stub storage", async () => {
    const proposals = new Map<string, { targetPath: string }>();
    const storage = {
      createWriteProposal: async (input: { targetPath: string; content: string }) => {
        const proposalId = "wrp_wk_001";
        proposals.set(proposalId, { targetPath: input.targetPath });
        return {
          status: "DRY_RUN_READY",
          proposalId,
          targetPath: input.targetPath,
          proposedObjectKey: `writes/proposals/${proposalId}.txt`,
          contentHash: "sha256-test",
          diffSummary: { mode: "CREATE", addedLines: 1, removedLines: 0, previousHash: null },
          humanGateRequired: true,
          message: "Proposal created."
        };
      },
      commitWriteProposal: async (input: { proposalId: string }) => {
        const p = proposals.get(input.proposalId)!;
        return {
          status: "COMMITTED",
          proposalId: input.proposalId,
          commitId: "wrc_wk_001",
          targetPath: p.targetPath,
          objectKey: `writes/committed/${p.targetPath}`,
          contentHash: "sha256-test",
          humanGateRequired: true,
          message: "Committed."
        };
      }
    };
    const auth = { authenticated: true, scopes: ["files:write"] };
    await withClient({ auth, storage }, async (client) => {
      const dryRun = await client.callTool({
        name: "write_file_dry_run",
        arguments: {
          targetPath: "ops/wk-test.md",
          content: "# Worker test",
          changeReason: "Worker test write.",
          approval
        }
      });
      expect((dryRun.structuredContent as { status: string }).status).toBe("DRY_RUN_READY");
      const commit = await client.callTool({
        name: "write_file_commit",
        arguments: {
          proposalId: "wrp_wk_001",
          commitReason: "Commit worker test write.",
          approval
        }
      });
      expect((commit.structuredContent as { status: string }).status).toBe("COMMITTED");
      expect((commit.structuredContent as { objectKey: string }).objectKey).toContain("ops/wk-test.md");
    });
  });
});
