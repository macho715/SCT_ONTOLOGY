#!/usr/bin/env python3
# Update OpenAPI servers.url to the given public URL (forces openapi=3.1.0, single server)
# Usage:
#   python update_openapi_schema.py --in openapi.yaml --out openapi.updated.yaml --url https://foo.ngrok.app
import argparse, os, sys
from typing import Any, Dict
try:
    import yaml, requests  # type: ignore
except Exception as e:
    print("Install deps first: python -m pip install pyyaml requests", file=sys.stderr); raise

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--in",  dest="path_in",  required=True)
    ap.add_argument("--out", dest="path_out", default=None)
    ap.add_argument("--url", dest="url",      required=True,
                    help="Base public URL, e.g., https://abc.ngrok-free.app")
    args = ap.parse_args()

    base = args.url.rstrip("/")
    if not (base.startswith("https://") or base.startswith("http://")):
        sys.exit("Provide a valid http(s) URL")

    # read yaml
    with open(args.path_in, "r", encoding="utf-8") as f:
        doc = yaml.safe_load(f)
    if not isinstance(doc, dict):
        sys.exit("Invalid YAML root")

    # patch
    doc["openapi"] = "3.1.0"
    doc["servers"] = [{"url": f"{base}/v1", "description": "Public"}]

    # optional: quick health check (ignore errors but warn)
    try:
        r = requests.get(f"{base}/v1/health", timeout=5)
        r.raise_for_status()
        js = r.json()
        if js.get("status") != "ok":
            print(f"Warning: health payload unexpected: {js}", file=sys.stderr)
    except Exception as e:
        print(f"Warning: health check failed: {e}", file=sys.stderr)

    # write yaml
    out = args.path_out or (os.path.splitext(args.path_in)[0] + ".updated.yaml")
    with open(out, "w", encoding="utf-8") as f:
        yaml.safe_dump(doc, f, sort_keys=False, allow_unicode=True)
    print(f"Wrote updated schema: {out}")

if __name__ == "__main__":
    main()
