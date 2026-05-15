import { describe, it, expect } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createHvdcServer } from "../server/src/index.js";

// Integration: requires local D1 with seeds applied (wrangler dev --local)
// In CI without miniflare D1, this test verifies tool call structure only.
describe("D1 seed — resolve_any_key smoke", () => {
  it("resolve_any_key returns structured result without throwing", async () => {
    const mcpServer = createHvdcServer();
    const client = new Client({ name: "seed-test", version: "0.0.1" });
    const [ct, st] = InMemoryTransport.createLinkedPair();
    await Promise.all([mcpServer.connect(st), client.connect(ct)]);

    try {
      const result = await client.callTool({
        name: "resolve_any_key",
        arguments: { identifierOrQuestion: "BL-SAMPLE-2025-001" }
      });
      expect(result).toBeDefined();
      expect(result.isError).toBeFalsy();
    } finally {
      await client.close();
      await mcpServer.close();
    }
  });
});
