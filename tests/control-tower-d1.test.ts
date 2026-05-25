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
      getCaseStatus: async (caseNo) => ({
        shipmentUnitId: caseNo,
        cargoSummary: {
          sourceLineId: "CASE-0003",
          vendor: "Dong Yang",
          category: "Elec",
          poNo: "5000761114",
          invoiceNo: "HVDC-ADOPT-PPL-0003",
          incoterms: "FOB"
        },
        shipment: {
          shipmentUnitId: caseNo,
          sourceLineId: "CASE-0003",
          vendor: "Dong Yang",
          category: "Elec",
          poNo: "5000761114",
          invoiceNo: "HVDC-ADOPT-PPL-0003",
          incoterms: "FOB",
          declaredDestinationSet: "AGI|MIR",
          declaredDestinationCount: 2,
          currentStage: "M130_SITE_ARRIVED",
          currentLocation: "AGI",
          routingPattern: "WH_MOSB_SITE",
          latestReceiptDt: "2024-02-26",
          finalDeliveryDt: "2024-02-26",
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
          doCollected: null,
          customsStarted: null,
          customsClosed: null,
          finalDelivered: "2024-02-26"
        },
        warehouseDates: {
          warehouseIn: "2024-01-19",
          warehouseOut: "2025-05-13",
          warehouseInMilestone: "M110_WAREHOUSE_RECEIVED",
          warehouseOutMilestone: "M121_WAREHOUSE_DISPATCHED"
        },
        caseCard: [
          { label: "SCT Ref.No", value: "5000761114", isoDate: null },
          { label: "Site", value: "AGI", isoDate: null },
          { label: "Case No.", value: "CASE-0003", isoDate: null },
          { label: "ETD/ATD", value: "2024-01-10", isoDate: "2024-01-10" },
          { label: "DHL WH", value: null, isoDate: null }
        ],
        canonicalEvents: [
          {
            eventId: "EVT-WHCASE-CASE-0003-WH_RECEIPT-DSV-OUTDOOR",
            eventType: "WH_RECEIPT",
            eventDate: "2024-01-19",
            siteCode: "DSV_AUH",
            zoneCode: "OUTDOOR",
            sourceFile: "hvdc_wh_status.xlsx",
            sourceRow: 2,
            ingestId: "wh-status-test"
          },
          {
            eventId: "EVT-WHCASE-CASE-0003-WH_ISSUE-LAST-OUT-WH",
            eventType: "WH_ISSUE",
            eventDate: "2025-05-13",
            siteCode: "AGI",
            zoneCode: null,
            sourceFile: "hvdc_wh_status.xlsx",
            sourceRow: 2,
            ingestId: "wh-status-test"
          }
        ],
        latestStatus: {
          latestEventType: "SITE_RECEIPT",
          latestEventDate: "2024-02-26",
          siteCode: "AGI",
          zoneCode: null
        },
        whDwell: {
          warehouseIn: "2024-01-19",
          warehouseOut: "2025-05-13",
          dwellDays: 480
        },
        siteIntake: {
          siteReceiptDate: "2024-02-26",
          siteCodes: "AGI"
        },
        milestones: [
          { milestoneCode: "M110_WAREHOUSE_RECEIVED", occurredAt: "2024-01-19", sourceColumn: "hvdc_wh_status.xlsx", sourceLineId: "CASE-0003" },
          { milestoneCode: "M121_WAREHOUSE_DISPATCHED", occurredAt: "2025-05-13", sourceColumn: "hvdc_wh_status.xlsx", sourceLineId: "CASE-0003" },
          { milestoneCode: "M130_SITE_RECEIVED", occurredAt: "2024-02-26", sourceColumn: "AGI", sourceLineId: "CASE-0003" }
        ],
        destinationRequirements: [
          {
            requirementId: "REQ-CASE-0003-AGI",
            destinationCode: "AGI",
            requiredFlag: true,
            sourceColumn: "AGI",
            sourceLineId: "CASE-0003",
            validationStatus: "WARN",
            reasonCode: "MOSB_EVIDENCE_MISSING"
          }
        ],
        siteReceipts: [
          {
            receiptEventId: "RE-CASE-0003-AGI",
            locationCode: "AGI",
            locationType: "PROJECT_SITE",
            actualReceiptDt: "2024-02-26",
            sourceColumn: "AGI",
            sourceLineId: "CASE-0003",
            matchedRequiredDestination: true,
            validationStatus: "PASS",
            reasonCode: null
          }
        ],
        siteReceiptSummary: {
          requiredDestinationCount: 1,
          receivedDestinationCount: 1,
          latestReceiptDt: "2024-02-26",
          finalDeliveryDt: "2024-02-26",
          siteCompletionRate: 1,
          missingRequiredDestination: null,
          receivedWithoutFlag: null
        },
        validationFindings: [
          {
            validationId: "VAL-CASE-0003-MOSB",
            ruleId: "V-AGIDAS-001",
            severity: "WARN",
            field: "M115/M116/M117",
            value: "MISSING",
            reasonCode: "MOSB_EVIDENCE_MISSING"
          }
        ],
        openActions: [],
        reportStatus: "WARN",
        message: `Control Tower shipment report loaded for ${caseNo}.`,
        generatedAt: "2026-05-15T00:00:00.000Z"
      }),
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
        warehouseDates: {
          warehouseIn: "2024-01-19",
          warehouseOut: "2025-05-13",
          warehouseInMilestone: "M110_WAREHOUSE_RECEIVED",
          warehouseOutMilestone: "M121_WAREHOUSE_DISPATCHED"
        },
        caseCard: [
          { label: "SCT Ref.No", value: "5000761114", isoDate: null },
          { label: "Site", value: "AGI", isoDate: null },
          { label: "Case No.", value: "HVDC-ADOPT-PPL-0003", isoDate: null },
          { label: "ETD/ATD", value: "2024-01-10", isoDate: "2024-01-10" },
          { label: "DHL WH", value: null, isoDate: null }
        ],
        canonicalEvents: [
          {
            eventId: "EVT-WHCASE-LS-000123-WH_RECEIPT-DSV-OUTDOOR",
            eventType: "WH_RECEIPT",
            eventDate: "2024-01-19",
            siteCode: "DSV_AUH",
            zoneCode: "OUTDOOR",
            sourceFile: "hvdc_wh_status.xlsx",
            sourceRow: 2,
            ingestId: "wh-status-test"
          },
          {
            eventId: "EVT-WHCASE-LS-000123-WH_ISSUE-LAST-OUT-WH",
            eventType: "WH_ISSUE",
            eventDate: "2025-05-13",
            siteCode: "AGI",
            zoneCode: null,
            sourceFile: "hvdc_wh_status.xlsx",
            sourceRow: 2,
            ingestId: "wh-status-test"
          }
        ],
        latestStatus: {
          latestEventType: "SITE_RECEIPT",
          latestEventDate: "2024-02-26",
          siteCode: "AGI",
          zoneCode: null
        },
        whDwell: {
          warehouseIn: "2024-01-19",
          warehouseOut: "2025-05-13",
          dwellDays: 480
        },
        siteIntake: {
          siteReceiptDate: "2024-02-26",
          siteCodes: "AGI"
        },
        milestones: [
          { milestoneCode: "M110_WAREHOUSE_RECEIVED", occurredAt: "2024-01-19", sourceColumn: "hvdc_wh_status.xlsx", sourceLineId: "LS-000123" },
          { milestoneCode: "M121_WAREHOUSE_DISPATCHED", occurredAt: "2025-05-13", sourceColumn: "hvdc_wh_status.xlsx", sourceLineId: "LS-000123" },
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
          warehouseDates: { warehouseIn: string; warehouseOut: string };
          caseCard: Array<{ label: string; value: string | null; isoDate: string | null }>;
          canonicalEvents: Array<{ eventType: string; eventDate: string | null }>;
          whDwell: { warehouseIn: string | null; warehouseOut: string | null; dwellDays: number | null } | null;
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
        },
        warehouseDates: {
          warehouseIn: "2024-01-19",
          warehouseOut: "2025-05-13"
        }
      });
      expect(content.controlTowerReports[0].caseCard.map((field) => field.label)).toEqual([
        "SCT Ref.No",
        "Site",
        "Case No.",
        "ETD/ATD",
        "DHL WH"
      ]);
      expect(content.controlTowerReports[0].canonicalEvents[0]).toMatchObject({
        eventType: "WH_RECEIPT",
        eventDate: "2024-01-19"
      });
      expect(content.controlTowerReports[0].whDwell).toMatchObject({
        warehouseIn: "2024-01-19",
        warehouseOut: "2025-05-13"
      });
      expect(content.controlTowerReports[0].siteReceipts[0]).toMatchObject({
        locationCode: "AGI",
        actualReceiptDt: "2024-02-26"
      });
    });
  });

  it("returns a WH Status D1 case projection by Case No", async () => {
    await withClient(async (client) => {
      const result = await client.callTool({
        name: "get_hvdc_case_status",
        arguments: { caseNo: "CASE-0003" }
      });

      const content = result.structuredContent as {
        report: {
          shipmentUnitId: string;
          reportStatus: string;
          warehouseDates: { warehouseIn: string; warehouseOut: string };
          caseCard: Array<{ label: string; value: string | null; isoDate: string | null }>;
          canonicalEvents: Array<{ eventType: string; eventDate: string | null }>;
          whDwell: { warehouseIn: string | null; warehouseOut: string | null; dwellDays: number | null } | null;
          shipment: { deliveryStatus?: string; currentStage: string; currentLocation: string };
          validationFindings: Array<{ reasonCode: string }>;
        };
      };
      expect(content.report).toMatchObject({
        shipmentUnitId: "CASE-0003",
        reportStatus: "WARN",
        shipment: {
          currentStage: "M130_SITE_ARRIVED",
          currentLocation: "AGI"
        },
        warehouseDates: {
          warehouseIn: "2024-01-19",
          warehouseOut: "2025-05-13"
        }
      });
      expect(content.report.caseCard).toContainEqual({
        label: "Case No.",
        value: "CASE-0003",
        isoDate: null
      });
      expect(content.report.canonicalEvents.map((event) => event.eventType)).toContain("WH_RECEIPT");
      expect(content.report.whDwell).toMatchObject({
        warehouseIn: "2024-01-19",
        warehouseOut: "2025-05-13"
      });
      expect(content.report.validationFindings[0]).toMatchObject({
        reasonCode: "MOSB_EVIDENCE_MISSING"
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
        status: "WARN",
        appliedRule: "V-AGIDAS-001",
        missingMilestones: ["M115", "M116", "M117"],
        siteReceiptStatus: "ARRIVED",
        deliveryStatus: "DELIVERED",
        dataQualityFinding: {
          code: "MOSB_EVIDENCE_MISSING",
          severity: "AMBER",
          action: "Backfill M115/M116/M117 evidence",
          backfillRequired: true
        },
        humanGateRequired: false
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
