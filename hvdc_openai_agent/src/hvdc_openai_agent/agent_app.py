from __future__ import annotations

import argparse
import asyncio
import json
import os
from datetime import datetime
from pathlib import Path
from typing import Any, Callable, TypeVar

from hvdc_openai_agent.core import load_shipments_file, resolve_any_key, shipment_snapshot
from hvdc_openai_agent.reporting import render_brief, snapshot_to_csv, snapshot_to_json

DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "sample_shipments.json"
MODEL = os.getenv("OPENAI_MODEL", "gpt-5.4-mini")
F = TypeVar("F", bound=Callable[..., Any])

try:  # OpenAI Agents SDK is optional for offline validation and CI.
    from agents import Agent, Runner, function_tool
except ImportError:  # pragma: no cover - exercised via CLI behavior, not SDK import.
    Agent = None  # type: ignore[assignment]
    Runner = None  # type: ignore[assignment]

    def function_tool(func: F) -> F:  # type: ignore[misc]
        return func


def load_dataset(path: Path = DATA_PATH):
    return load_shipments_file(path)


def _snapshot_for_key(any_key: str, *, data_path: Path = DATA_PATH, now: datetime | None = None) -> dict[str, Any]:
    shipment = resolve_any_key(load_dataset(data_path), any_key)
    if shipment is None:
        return {"found": False, "query": any_key, "message": "No matching ShipmentUnit."}
    return {"found": True, "snapshot": shipment_snapshot(shipment, now=now)}


@function_tool
def search_shipment(any_key: str) -> dict[str, Any]:
    """Resolve BL, BOE, DO, Invoice, Container, HVDC_CODE, Package No. and return shipment snapshot."""
    return _snapshot_for_key(any_key)


@function_tool
def cost_guard(any_key: str) -> dict[str, Any]:
    """Run COST-GUARD invoice audit for a shipment and return line-level AED deltas and approval hold flags."""
    result = _snapshot_for_key(any_key)
    if not result["found"]:
        return result
    snapshot = result["snapshot"]
    return {
        "found": True,
        "shipment_id": snapshot["shipment_id"],
        "invoice_exposure_aed": snapshot["invoice_exposure_aed"],
        "invoice_audit": snapshot["invoice_audit"],
        "human_gate_required": snapshot["human_gate_required"],
    }


@function_tool
def port_release_board(any_key: str) -> dict[str, Any]:
    """Return M90/M91/M92/M100 release risks, missing documents, and DEM/DET exposure indicators."""
    result = _snapshot_for_key(any_key)
    if not result["found"]:
        return result
    snapshot = result["snapshot"]
    return {
        "found": True,
        "shipment_id": snapshot["shipment_id"],
        "current_stage": snapshot["current_stage"],
        "missing_documents": snapshot["missing_documents"],
        "risks": snapshot["risks"],
        "human_gate_required": snapshot["human_gate_required"],
    }


def build_agent():
    if Agent is None:
        raise RuntimeError(
            "OpenAI Agents SDK is not installed. Run `pip install openai-agents` or use `--offline`."
        )
    return Agent(
        name="HVDC Logistics Control Agent",
        model=MODEL,
        instructions=(
            "You are a UAE HVDC project logistics control assistant. "
            "Use the provided tools before answering shipment, DEM/DET, document, or invoice questions. "
            "Never invent shipment status, tariff, HS, or regulatory facts. "
            "If tool evidence is missing, answer ZERO and list required inputs. "
            "For invoice BLOCK/CRITICAL or exposure >= 100,000.00 AED, state that Finance/Human gate is required. "
            "Format money as AED with 2 decimals. Keep responses in Korean unless identifiers require English."
        ),
        tools=[search_shipment, cost_guard, port_release_board],
    )


async def run_agent(question: str) -> str:
    if Runner is None:
        raise RuntimeError("OpenAI Agents SDK is not installed. Run `pip install openai-agents` or use `--offline`.")
    result = await Runner.run(build_agent(), question)
    return str(result.final_output)


def deterministic_snapshot(any_key: str, *, data_path: Path = DATA_PATH, now: datetime | None = None) -> dict[str, Any]:
    return _snapshot_for_key(any_key, data_path=data_path, now=now)


def _parse_now(value: str | None) -> datetime | None:
    if value is None:
        return None
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def main() -> None:
    parser = argparse.ArgumentParser(description="HVDC OpenAI Agents SDK logistics control demo")
    parser.add_argument("query", help="BL/BOE/DO/Invoice/Container/HVDC_CODE/Package No. or natural language question")
    parser.add_argument("--offline", action="store_true", help="Run deterministic local snapshot without OpenAI API call")
    parser.add_argument("--data", type=Path, default=DATA_PATH, help="Path to shipment JSON dataset")
    parser.add_argument("--now", help="ISO timestamp for deterministic DEM/DET checks, e.g. 2026-05-11T00:00:00+00:00")
    parser.add_argument("--format", choices=["json", "brief", "csv"], default="json", help="Offline output format")
    parser.add_argument("--output", type=Path, help="Write offline result to a file instead of stdout")
    args = parser.parse_args()

    if args.offline:
        result = deterministic_snapshot(args.query, data_path=args.data, now=_parse_now(args.now))
        if args.format == "brief":
            rendered = render_brief(result)
        elif args.format == "csv":
            rendered = snapshot_to_csv(result)
        else:
            rendered = snapshot_to_json(result)
        if args.output:
            args.output.write_text(rendered, encoding="utf-8")
        else:
            print(rendered)
        return

    print(asyncio.run(run_agent(args.query)))


if __name__ == "__main__":
    main()
