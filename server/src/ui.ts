import type { GroundedAnswer, UiRenderStatus } from "./types.js";

export const WIDGET_URI = "ui://hvdc/answer-card-v5.html";
export const TEMPLATE_VERSION = "answer-card-v5";
export const UI_SCHEMA_VERSION = "1.0.0";
export const UI_RENDER_ERROR_CODE = "CARD_TEMPLATE_RENDER_FAILED";

export function buildUiState(status: UiRenderStatus = "READY", errorMessage?: string): GroundedAnswer["ui"] {
  const failed = status === "TEMPLATE_FETCH_FAILED";
  return {
    dataStatus: "OK",
    uiRenderStatus: status,
    businessResultVisible: true,
    fallbackUsed: failed,
    cardEnabled: !failed,
    templateUrl: WIDGET_URI,
    templateVersion: TEMPLATE_VERSION,
    schemaVersion: UI_SCHEMA_VERSION,
    ...(failed ? { errorCode: UI_RENDER_ERROR_CODE, errorMessage } : {}),
    doNotChange: ["verdict", "validationStatus", "evidenceIds", "actions"]
  };
}

export function withUiState(
  answer: GroundedAnswer,
  status: UiRenderStatus = "READY",
  errorMessage?: string
): GroundedAnswer {
  return {
    ...answer,
    ui: buildUiState(status, errorMessage)
  };
}

export function logUiRenderFailure(answer: GroundedAnswer, error: Error): void {
  console.warn("HVDC_CARD_UI_RENDER_FAILED", {
    answerId: answer.answerId,
    routeId: answer.route?.routeId,
    verdict: answer.verdict,
    validationStatus: answer.validationStatus,
    evidenceCount: answer.evidenceIds?.length ?? 0,
    templateVersion: answer.ui?.templateVersion,
    schemaVersion: answer.ui?.schemaVersion,
    errorMessage: error.message,
    ts: new Date().toISOString()
  });
}
