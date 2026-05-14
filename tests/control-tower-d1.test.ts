import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { describe, expect, it } from "vitest";
import { createHvdcServer } from "../server/src/index.js";

async function withClient(fn: (client: Client) => Promise<void>) {
  const mcpServer = createHvdcServer({
    controlTower: {
      resolveAnyKey: async () => [
        {
          entityType: "ShipmentUnit",
          identifierScheme: "ShipmentUnit",
          identifierValue: "HVDC-ADOPT-PPL-0003",
          normalizedValue: "HVDC-ADOPT-PPL-0003",
          targetRid: "HVDC-ADOPT-PPL-0003",
          confidence: 0.98
        }
      ],
      getShipmentUnit: async (shipmentUnitId) => ({
        shipmentUnitId,
        declaredDestinationSet: "AGI|MIR",
        currentStage: "M140_FINAL_DELIVERED",
        currentLocation: "AGI",
        routingPattern: "WH_MOSB_SITE",
        latestReceiptDt: "2024-02-26",
        missingRequiredDestination: null
      }),
      listMilestones: async () => [
        { code: "M130_SITE_RECEIVED", actualDt: "2024-02-26" }
      ],
      listActionQueue: async (shipmentUnitId) => [
        {
          actionType: "REQUEST_MOSB_STAGING_EVIDENCE",
          targetObject: `ShipmentUnit:${shipmentUnitId}@MOSB`,
          ownerRole: "Marine Supervisor",
          backupRole: "Site Logistics",
          humanGateRequired: true,
          dueAt: null,
          requiredDocs: ["MOSB_MISSING_FOR_OFFSHORE"],
          piiMasked: true
        }
      ]
    }
  });
  const client = new Client({ name: "control-tower-d1-test", version: "0.0.1" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  await Promise.all([mcpServer.connect(serverTransport), client.connect(clientTransport)]);

  try {
    await fn(client);
  } finally {
    await client.close();
    await mcpServer.close();
  }
}

describe("Control Tower D1 MCP lookup integration", () => {
  it("prefers D1 shipment_unit candidates in resolve_any_key", async () => {
    await withClient(async (client) => {
      const result = await client.callTool({
        name: "resolve_any_key",
        arguments: { identifierOrQuestion: "HVDC-ADOPT-PPL-0003" }
      });

      const candidates = (result.structuredContent as { candidates: Array<{ targetRid: string; confidence: number }> }).candidates;
      expect(candidates[0]).toMatchObject({
        targetRid: "HVDC-ADOPT-PPL-0003",
        confidence: 0.98
      });
    });
  });

  it("loads shipment_unit and milestone_event rows when check_mosb_gate input omits route details", async () => {
    await withClient(async (client) => {
      const result = await client.callTool({
        name: "check_mosb_gate",
        arguments: { shipmentUnitId: "HVDC-ADOPT-PPL-0003" }
      });

      expect(result.structuredContent).toMatchObject({
        shipmentUnitId: "HVDC-ADOPT-PPL-0003",
        declaredDestination: "AGI|MIR",
        routingPattern: "WH_MOSB_SITE",
        status: "BLOCK",
        appliedRule: "V-AGIDAS-001",
        missingMilestones: ["M115"],
        humanGateRequired: true
      });
    });
  });

  it("uses D1 action_queue before falling back to static role routing", async () => {
    await withClient(async (client) => {
      const result = await client.callTool({
        name: "get_team_actions",
        arguments: {
          shipmentUnitId: "HVDC-ADOPT-PPL-0003",
          milestoneCode: "M115",
          domain: "marine"
        }
      });

      const content = result.structuredContent as {
        proposals: Array<{ actionType: string; ownerRole: string; requiredDocs: string[] }>;
        message: string;
      };
      expect(content.message).toContain("Control Tower action_queue");
      expect(content.proposals[0]).toMatchObject({
        actionType: "REQUEST_MOSB_STAGING_EVIDENCE",
        ownerRole: "Marine Supervisor",
        requiredDocs: ["MOSB_MISSING_FOR_OFFSHORE"]
      });
    });
  });
});
