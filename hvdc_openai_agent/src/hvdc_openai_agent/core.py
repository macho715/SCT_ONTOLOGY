from __future__ import annotations

import json
from dataclasses import dataclass, field
from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
from enum import StrEnum
from pathlib import Path
from typing import Any, Iterable

AED = Decimal("0.01")
HUMAN_GATE_THRESHOLD_AED = Decimal("100000.00")
DEMDET_FREE_HOURS = Decimal("72.00")

MILESTONE_ORDER: dict[str, int] = {
    "M00": 0,
    "M90": 90,   # ATA / port arrival
    "M91": 91,   # customs / BOE clearance
    "M92": 92,   # DO release
    "M100": 100, # gate out
    "M115": 115, # MOSB received
    "M116": 116, # MOSB inspected/handled
    "M117": 117, # MOSB dispatched
    "M130": 130, # site arrived
}


class Severity(StrEnum):
    PASS = "PASS"
    WARN = "WARN"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"
    BLOCK = "BLOCK"


class DataValidationError(ValueError):
    """Raised when local shipment master data cannot be trusted."""


@dataclass(frozen=True)
class MilestoneEvent:
    code: str
    occurred_at: datetime | None = None
    evidence_ref: str | None = None


@dataclass(frozen=True)
class Document:
    doc_type: str
    ref: str
    status: str = "available"


@dataclass(frozen=True)
class InvoiceLine:
    line_id: str
    item: str
    quantity: Decimal
    rate: Decimal
    draft_amount: Decimal
    standard_amount: Decimal | None = None
    currency: str = "AED"
    evidence_refs: tuple[str, ...] = field(default_factory=tuple)


@dataclass(frozen=True)
class ShipmentUnit:
    shipment_id: str
    identifiers: dict[str, str]
    routing_pattern: str
    milestones: tuple[MilestoneEvent, ...] = field(default_factory=tuple)
    documents: tuple[Document, ...] = field(default_factory=tuple)
    invoice_lines: tuple[InvoiceLine, ...] = field(default_factory=tuple)
    open_exceptions: tuple[str, ...] = field(default_factory=tuple)


@dataclass(frozen=True)
class RuleResult:
    severity: Severity
    rule: str
    detail: str
    evidence_refs: tuple[str, ...] = field(default_factory=tuple)
    human_gate: bool = False

    def as_dict(self) -> dict[str, Any]:
        return {
            "severity": self.severity.value,
            "rule": self.rule,
            "detail": self.detail,
            "evidence_refs": list(self.evidence_refs),
            "human_gate": self.human_gate,
        }


def normalize_key(value: str) -> str:
    return " ".join(value.strip().upper().split())


def parse_dt(value: str | None) -> datetime | None:
    if not value:
        return None
    normalized = value.replace("Z", "+00:00")
    dt = datetime.fromisoformat(normalized)
    return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)


def money(value: Decimal | str | int | float) -> Decimal:
    return Decimal(str(value)).quantize(AED, rounding=ROUND_HALF_UP)


def pct(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def milestone_rank(code: str) -> int:
    code = normalize_key(code)
    if code not in MILESTONE_ORDER:
        raise DataValidationError(f"Unknown milestone code: {code}")
    return MILESTONE_ORDER[code]


def load_shipments(raw: list[dict[str, Any]], *, strict: bool = True) -> list[ShipmentUnit]:
    shipments: list[ShipmentUnit] = []
    for row in raw:
        milestones = tuple(
            MilestoneEvent(
                code=normalize_key(item["code"]),
                occurred_at=parse_dt(item.get("occurred_at")),
                evidence_ref=item.get("evidence_ref"),
            )
            for item in row.get("milestones", [])
        )
        documents = tuple(
            Document(doc_type=normalize_key(item["doc_type"]), ref=item["ref"], status=item.get("status", "available"))
            for item in row.get("documents", [])
        )
        invoice_lines = tuple(
            InvoiceLine(
                line_id=str(item["line_id"]),
                item=str(item["item"]),
                quantity=Decimal(str(item["quantity"])),
                rate=money(item["rate"]),
                draft_amount=money(item["draft_amount"]),
                standard_amount=money(item["standard_amount"]) if item.get("standard_amount") is not None else None,
                currency=str(item.get("currency", "AED")).upper(),
                evidence_refs=tuple(str(ref) for ref in item.get("evidence_refs", [])),
            )
            for item in row.get("invoice_lines", [])
        )
        shipment = ShipmentUnit(
            shipment_id=str(row["shipment_id"]),
            identifiers={str(key): str(value) for key, value in row.get("identifiers", {}).items()},
            routing_pattern=str(row["routing_pattern"]),
            milestones=milestones,
            documents=documents,
            invoice_lines=invoice_lines,
            open_exceptions=tuple(str(item) for item in row.get("open_exceptions", [])),
        )
        shipments.append(shipment)
    if strict:
        validate_shipments(shipments)
    return shipments


def load_shipments_file(path: Path, *, strict: bool = True) -> list[ShipmentUnit]:
    return load_shipments(json.loads(path.read_text(encoding="utf-8")), strict=strict)


def iter_identifier_pairs(shipment: ShipmentUnit) -> Iterable[tuple[str, str]]:
    yield "shipment_id", shipment.shipment_id
    yield from shipment.identifiers.items()


def validate_shipments(shipments: list[ShipmentUnit]) -> None:
    seen: dict[str, str] = {}
    for shipment in shipments:
        for event in shipment.milestones:
            milestone_rank(event.code)
        for line in shipment.invoice_lines:
            if line.currency != "AED":
                raise DataValidationError(f"Only AED sample data is supported in this MVP: {line.currency}")
            if line.quantity < 0 or line.rate < 0 or line.draft_amount < 0:
                raise DataValidationError(f"Negative invoice value in {shipment.shipment_id}/{line.line_id}")
        for scheme, value in iter_identifier_pairs(shipment):
            normalized = normalize_key(value)
            if not normalized:
                continue
            if normalized in seen and seen[normalized] != shipment.shipment_id:
                raise DataValidationError(f"Duplicate identifier {scheme}={value}: {seen[normalized]} vs {shipment.shipment_id}")
            seen[normalized] = shipment.shipment_id


def resolve_any_key(shipments: list[ShipmentUnit], query: str) -> ShipmentUnit | None:
    needle = normalize_key(query)
    for shipment in shipments:
        if any(normalize_key(value) == needle for _, value in iter_identifier_pairs(shipment)):
            return shipment
    return None


def current_stage(shipment: ShipmentUnit) -> str:
    completed = [event for event in shipment.milestones if event.occurred_at]
    if not completed:
        return "M00_NOT_STARTED"
    return max(completed, key=lambda event: milestone_rank(event.code)).code


def has_doc(shipment: ShipmentUnit, doc_type: str) -> bool:
    target = normalize_key(doc_type)
    return any(doc.doc_type == target and doc.status.lower() == "available" for doc in shipment.documents)


def milestone_at(shipment: ShipmentUnit, code: str) -> datetime | None:
    target = normalize_key(code)
    for event in shipment.milestones:
        if event.code == target:
            return event.occurred_at
    return None


def missing_documents(shipment: ShipmentUnit) -> list[str]:
    required_by_stage = {
        "M90": ("BOE",),
        "M92": ("DO", "BOE"),
        "M100": ("DO", "BOE"),
        "M130": ("DO", "BOE", "SITE_RECEIPT"),
    }
    stage = current_stage(shipment)
    if stage == "M00_NOT_STARTED":
        return []
    stage_rank = milestone_rank(stage)
    required: set[str] = set()
    for gate, docs in required_by_stage.items():
        if stage_rank >= milestone_rank(gate):
            required.update(docs)
    return sorted(doc for doc in required if not has_doc(shipment, doc))


def elapsed_hours(start: datetime, end: datetime) -> Decimal:
    return Decimal(str((end - start).total_seconds() / 3600)).quantize(Decimal("0.01"))


def port_release_risks(
    shipment: ShipmentUnit,
    now: datetime | None = None,
    demdet_hours: Decimal = DEMDET_FREE_HOURS,
) -> list[dict[str, Any]]:
    now = now or datetime.now(timezone.utc)
    risks: list[RuleResult] = []

    ata = milestone_at(shipment, "M90")
    boe_clear = milestone_at(shipment, "M91")
    do_release = milestone_at(shipment, "M92")
    gate_out = milestone_at(shipment, "M100")

    if ata and not boe_clear:
        risks.append(RuleResult(Severity.WARN, "Customs Delay Alert", "ATA M90 exists but BOE clearance M91 is missing."))

    if do_release:
        end = gate_out or now
        hours = elapsed_hours(do_release, end)
        if hours > demdet_hours:
            status = "closed late" if gate_out else "open"
            risks.append(
                RuleResult(
                    Severity.HIGH,
                    "DEM/DET Risk Alert",
                    f"M92→M100 {status}; elapsed {hours} hrs > {demdet_hours} hrs.",
                )
            )

    if gate_out and not has_doc(shipment, "DO"):
        risks.append(RuleResult(Severity.BLOCK, "BLOCK Gate-out closure", "M100 exists but DO document is missing."))

    if current_stage(shipment) == "M130" and not has_doc(shipment, "SITE_RECEIPT"):
        risks.append(RuleResult(Severity.BLOCK, "BLOCK Site receipt closure", "M130 exists but SITE_RECEIPT is missing."))

    return [risk.as_dict() for risk in risks]


def agi_das_gate_risk(shipment: ShipmentUnit) -> dict[str, Any] | None:
    cargo_type = shipment.identifiers.get("cargo_type", "").upper()
    if cargo_type not in {"AGI", "DAS", "AGI/DAS"}:
        return None
    has_site_arrived = milestone_at(shipment, "M130") is not None
    required = ["M115", "M116", "M117"]
    missing = [code for code in required if milestone_at(shipment, code) is None]
    if has_site_arrived and missing:
        return RuleResult(
            Severity.BLOCK,
            "AGI/DAS MOSB Gate",
            f"M130 exists but missing {', '.join(missing)}.",
            human_gate=True,
        ).as_dict()
    return None


def invoice_line_severity(delta_pct: Decimal, *, rate_mismatch: bool, missing_evidence: bool, zero_standard: bool) -> Severity:
    if zero_standard or rate_mismatch or missing_evidence:
        return Severity.BLOCK
    abs_pct = abs(delta_pct)
    if abs_pct <= Decimal("2.00"):
        return Severity.PASS
    if abs_pct <= Decimal("5.00"):
        return Severity.WARN
    if abs_pct <= Decimal("10.00"):
        return Severity.HIGH
    return Severity.CRITICAL


def audit_invoice_lines(shipment: ShipmentUnit) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []
    for line in shipment.invoice_lines:
        expected_by_rate = money(line.quantity * line.rate)
        standard = line.standard_amount or expected_by_rate
        amount_delta = money(line.draft_amount - standard)
        zero_standard = standard == Decimal("0.00")
        delta_pct = Decimal("0.00") if zero_standard else pct((amount_delta / standard) * Decimal("100.00"))
        rate_mismatch = abs(line.draft_amount - expected_by_rate) > Decimal("0.01")
        missing_evidence = not line.evidence_refs
        severity = invoice_line_severity(
            delta_pct,
            rate_mismatch=rate_mismatch,
            missing_evidence=missing_evidence,
            zero_standard=zero_standard,
        )
        checks = {
            "expected_by_rate_aed": f"{expected_by_rate:.2f}",
            "rate_mismatch": rate_mismatch,
            "missing_evidence": missing_evidence,
            "zero_standard": zero_standard,
        }
        results.append(
            {
                "line_id": line.line_id,
                "item": line.item,
                "currency": line.currency,
                "draft_amount_aed": f"{line.draft_amount:.2f}",
                "standard_amount_aed": f"{standard:.2f}",
                "delta_amount_aed": f"{amount_delta:.2f}",
                "delta_pct": f"{delta_pct:.2f}",
                "severity": severity.value,
                "human_gate": line.draft_amount >= HUMAN_GATE_THRESHOLD_AED or severity in {Severity.CRITICAL, Severity.BLOCK},
                "evidence_refs": list(line.evidence_refs),
                "checks": checks,
            }
        )
    return results


def shipment_snapshot(shipment: ShipmentUnit, now: datetime | None = None) -> dict[str, Any]:
    risks = port_release_risks(shipment, now=now)
    if agi_risk := agi_das_gate_risk(shipment):
        risks.append(agi_risk)
    invoice_audit = audit_invoice_lines(shipment)
    exposure = sum((line.draft_amount for line in shipment.invoice_lines), Decimal("0.00"))
    return {
        "shipment_id": shipment.shipment_id,
        "current_stage": current_stage(shipment),
        "routing_pattern": shipment.routing_pattern,
        "identifiers": shipment.identifiers,
        "missing_documents": missing_documents(shipment),
        "open_exceptions": list(shipment.open_exceptions),
        "risks": risks,
        "invoice_audit": invoice_audit,
        "invoice_exposure_aed": f"{exposure:.2f}",
        "human_gate_required": any(risk.get("human_gate") for risk in risks)
        or any(line["human_gate"] for line in invoice_audit),
    }
