---
name: ontology-corpus-indexer
description: Re-index HVDC ontology Markdown/PDF-derived text into section/hash evidence chunks. Trigger when corpus docs change or source traceability fails.
---

Workflow
1. Read `data/corpus/*.md` only. Do not read private P2 folders.
2. Ensure `CONSOLIDATED-00-master-ontology.md` exists.
3. Split documents by Markdown headings.
4. Generate docId, title, version, sectionPath, docHash, domains, and chunk id.
5. Write `data/index/corpus_index.json` and `data/index/corpus_inventory.csv`.
6. Run `npm run index` and `npm test`.

Output
- `data/index/corpus_index.json`
- `data/index/corpus_inventory.csv`
- validation note listing missing docs or duplicate docIds
