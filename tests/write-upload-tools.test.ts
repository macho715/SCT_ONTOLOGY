import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { describe, expect, it } from "vitest";
import { createHvdcServer } from "../server/src/index.js";

const approval = {
  approvedByRole: "Ops Manager",
  approvalRef: "APPROVAL-2026-05-13-001",
  reason: "User explicitly approved MCP write/upload tool testing."
};

async function withClient(options: Record<string, unknown>, fn: (client: Client) => Promise<void>) {
  const mcpServer = createHvdcServer(options as never);
  const client = new Client({ name: "write-upload-test", version: "0.0.1" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  await Promise.all([mcpServer.connect(serverTransport), client.connect(clientTransport)]);

  try {
    await fn(client);
  } finally {
    await client.close();
    await mcpServer.close();
  }
}

describe("OAuth-protected upload and write tools", () => {
  it("fails closed when upload or write tools are called without Bearer scopes", async () => {
    await withClient({}, async (client) => {
      const upload = await client.callTool({
        name: "create_upload_url",
        arguments: {
          fileName: "packing-list.pdf",
          mimeType: "application/pdf",
          byteLength: 1024,
          purpose: "evidence_attachment",
          approval
        }
      });

      const write = await client.callTool({
        name: "write_file_dry_run",
        arguments: {
          targetPath: "ops/mosb-note.md",
          content: "# MOSB note\n\nDraft.",
          changeReason: "Prepare controlled write proposal.",
          approval
        }
      });

      expect((upload.structuredContent as { status?: string }).status).toBe("AUTH_REQUIRED");
      expect((write.structuredContent as { status?: string }).status).toBe("AUTH_REQUIRED");
    });
  });

  it("creates a dry-run write proposal and commits it through the storage adapter", async () => {
    const proposals = new Map<string, { targetPath: string; objectKey: string; contentHash: string }>();

    await withClient(
      {
        auth: { authenticated: true, subject: "ops@example.com", scopes: ["files:write"] },
        storage: {
          createWriteProposal: async (input: { targetPath: string; content: string }) => {
            const proposalId = "wrp_test_001";
            const contentHash = "sha256-test-content";
            proposals.set(proposalId, {
              targetPath: input.targetPath,
              objectKey: `writes/proposals/${proposalId}.txt`,
              contentHash
            });
            return {
              status: "DRY_RUN_READY",
              proposalId,
              targetPath: input.targetPath,
              proposedObjectKey: `writes/proposals/${proposalId}.txt`,
              contentHash,
              diffSummary: {
                mode: "CREATE",
                addedLines: 3,
                removedLines: 0,
                previousHash: null
              },
              humanGateRequired: true,
              message: "Dry-run proposal created."
            };
          },
          commitWriteProposal: async (input: { proposalId: string }) => {
            const proposal = proposals.get(input.proposalId);
            if (!proposal) throw new Error("missing proposal");
            return {
              status: "COMMITTED",
              proposalId: input.proposalId,
              commitId: "wrc_test_001",
              targetPath: proposal.targetPath,
              objectKey: `writes/committed/${proposal.targetPath}`,
              contentHash: proposal.contentHash,
              humanGateRequired: true,
              message: "Write proposal committed."
            };
          }
        }
      },
      async (client) => {
        const dryRun = await client.callTool({
          name: "write_file_dry_run",
          arguments: {
            targetPath: "ops/mosb-note.md",
            content: "# MOSB note\n\nDraft.",
            changeReason: "Prepare controlled write proposal.",
            approval
          }
        });

        expect((dryRun.structuredContent as { status?: string }).status).toBe("DRY_RUN_READY");
        expect((dryRun.structuredContent as { proposalId?: string }).proposalId).toBe("wrp_test_001");

        const commit = await client.callTool({
          name: "write_file_commit",
          arguments: {
            proposalId: "wrp_test_001",
            commitReason: "Commit approved controlled write proposal.",
            approval
          }
        });

        expect((commit.structuredContent as { status?: string }).status).toBe("COMMITTED");
        expect((commit.structuredContent as { objectKey?: string }).objectKey).toBe("writes/committed/ops/mosb-note.md");
      }
    );
  });
});
