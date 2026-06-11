# invoice-audit-parser (worker-py)

FastAPI worker for invoice/evidence parsing (xlsx, md, txt, **pdf** from P3A).

## Endpoints
- `POST /parse` — accepts ParseRequest (file_type: xlsx|md|txt|**pdf**)
- `POST /v1/export` — 7-sheet Audit Pack xlsx (see exporters)

## P3A (2026-06-09)
- New `pdf_text` parser using `pdfplumber>=0.11` (text spans, table candidates, custom confidence, evidence extraction).
- `file_type='pdf'` now supported (no longer 422).
- Returns standard ParseResponse (normalized with evidence_candidates + parser_confidence); detailed `PdfParseResponse` (spans, tables, issues, is_text_based, page_count) available for orchestrator (P3B+).
- Low-confidence / scanned pages surface `SCANNED_PAGE_DETECTED` + force AMBER in later stages (P3C).
- Fixtures: `tests/fixtures/text-pdf-00[1-5].pdf` (generated text-based invoice samples; one low-text for AMBER path).

## Run (dev)
```bash
python -m pip install -e ".[dev]" pdfplumber
python -m uvicorn app.main:app --port 8000
pytest -q
```

## Versioning
parser_version e.g. `parser-0.2.0-pdf-0.1.0`

See plan `2026-06-09-invoice-audit-phase3-plan.md` (P3A) and SPEC §14.
