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
        sourceLineId: "LS-000123",
        vendor: "Dong Yang",
        category: "Elec",
        poNo: "5000761114",
        invoiceNo: "HVDC-ADOPT-PPL-0003",
        incoterms: "FOB",
        declaredDestinationSet: "AGI|MIR",
        declaredDestinationCount: 2,
        currentStage: "M140_FINAL_DELIVERED",
        currentLocation: "AGI",
        routingPattern: "WH_MOSB_SITE",
        latestReceiptDt: "2024-02-26",
        finalDeliveryDt: "2024-02-25",
        siteCompletionRate: 1,
        missingRequiredDestination: null,
        receivedWithoutFlag: null
      }),
      getShipmentReport: async (shipmentUnitId) => ({
        shipmentUnitId,
        cargoSummary: {
          sourceLineId: "LS-000123",
          vendor: "Dong Yang",
          category: "Elec",
          poNo: "5000761114",
          invoiceNo: "HVDC-ADOPT-PPL-0003",
          incoterms: "FOB"
        },
        shipment: {
          shipmentUnitId,
          sourceLineId: "LS-000123",
          vendor: "Dong Yang",
          category: "Elec",
          poNo: "5000761114",
          invoiceNo: "HVDC-ADOPT-PPL-0003",
          incoterms: "FOB",
          declaredDestinationSet: "AGI|MIR",
          declaredDestinationCount: 2,
          currentStage: "M140_FINAL_DELIVERED",
          currentLocation: "AGI",
          routingPattern: "WH_MOSB_SITE",
          latestReceiptDt: "2024-02-26",
          finalDeliveryDt: "2024-02-25",
          siteCompletionRate: 1,
          missingRequiredDestination: null,
          receivedWithoutFlag: null
        },
        shipmentDates: {
          etd: "2024-01-10",
          atd: "2024-01-11",
          eta: "2024-02-20",
          ata: "2024-02-21",
          attestation: null,
          doCollected: "2024-02-23",
          customsStarted: "2024-02-24",
          customsClosed: "2024-02-24",
          finalDelivered: "2024-02-25"
        },
        milestones: [
          { milestoneCode: "M60_ETA", occurredAt: "2024-02-20", sourceColumn: "BG", sourceLineId: "LS-000123" },
          { milestoneCode: "M70_ATA", occurredAt: "2024-02-21", sourceColumn: "BH", sourceLineId: "LS-000123" }
        ],
        destinationRequirements: [
          {
            requirementId: "REQ-LS-000123-AGI",
            destinationCode: "AGI",
            requiredFlag: true,
            sourceColumn: "K",
            sourceLineId: "LS-000123",
            validationStatus: "PASS",
            reasonCode: null
          }
        ],
        siteReceipts: [
          {
            receiptEventId: "RE-LS-000123-AGI",
            locationCode: "AGI",
            locationType: "PROJECT_SITE",
            actualReceiptDt: "2024-02-26",
            sourceColumn: "BP",
            sourceLineId: "LS-000123",
            matchedRequiredDestination: true,
            validationStatus: "PASS",
            reasonCode: null
          }
        ],
        siteReceiptSummary: {
          requiredDestinationCount: 2,
          receivedDestinationCount: 1,
          latestReceiptDt: "2024-02-26",
          finalDeliveryDt: "2024-02-25",
          siteCompletionRate: 1,
          missingRequiredDestination: null,
          receivedWithoutFlag: null
        },
        validationFindings: [],
        openActions: [],
        reportStatus: "PASS",
        message: `Control Tower shipment report loaded for ${shipmentUnitId}.`,
        generatedAt: "2026-05-15T00:00:00.000Z"
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

  it("returns a one-shot D1 shipment report with shipment dates, cargo, and site receipts", async () => {
    await withClient(async (client) => {
      const result = await client.callTool({
        name: "resolve_any_key",
        arguments: { identifierOrQuestion: "HVDC-ADOPT-PPL-0003 ETA ATA receipt cargo" }
      });

      const content = result.structuredContent as {
        controlTowerReports: Array<{
          shipmentDates: { eta: string; ata: string };
          cargoSummary: { vendor: string; poNo: string };
          siteReceipts: Array<{ locationCode: string; actualReceiptDt: string }>;
          siteReceiptSummary: { latestReceiptDt: string };
        }>;
      };
      expect(content.controlTowerReports[0]).toMatchObject({
        shipmentDates: {
          eta: "2024-02-20",
          ata: "2024-02-21"
        },
        cargoSummary: {
          vendor: "Dong Yang",
          poNo: "5000761114"
        },
        siteReceiptSummary: {
          latestReceiptDt: "2024-02-26"
        }
      });
      expect(content.controlTowerReports[0].siteReceipts[0]).toMatchObject({
        locationCode: "AGI",
        actualReceiptDt: "2024-02-26"
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
