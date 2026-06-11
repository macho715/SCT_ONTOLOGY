# HVDC TR Transport Report

## Project Overview
Single-file HTML operations report. No build step, no package manager.
Samsung C&T UAE — 7 × 765 kV transformers (217 t each), MZP → AGI, 7 trips via LCT Bushra.
Deploy: `git push` → Vercel auto-deploy.

## Architecture

One file: `index.html` (~524 KB). Edit this directly.

**CSS — 4 style blocks (order is the cascade, do not reorder):**
1. `ds-tokens` — all CSS custom properties (source of truth for every value)
2. `ds-components` — all UI component styles
3. `ds-overrides` — hero lift, responsive, print, nav height
4. _(unnamed)_ `design-upgrade-v3` — token completion, chapter identity, key facts, nav interaction, footer

**When adding new CSS:** always append to the `design-upgrade-v3` block (last style block).

**JS — key inline bundles:**
- GSAP 3.12.5 + ScrollTrigger (~200 KB bundled, do not touch)
- Lenis smooth scroll (~15 KB bundled, do not touch)
- App scripts: `initProgressBar`, `initHeroParallax`, `initHeroEntrance`, `initChapterOpeners`, `initVoyageCards`, `initOrbitSphere`, PATCH-B (glass blur), PATCH-C (nav observer)

**Assets:** `tr/` folder (33 images). `assets/video/` for background videos.

Full architecture details: `docs/ARCHITECTURE.md`

## Design System

Dials: `DESIGN_VARIANCE=7  MOTION_INTENSITY=6  VISUAL_DENSITY=8`

**Accent colors (single accent rule):**
- `--award-gold: #c9a84c` — primary accent: all metrics, kickers, go-state decisions
- `--award-cyan: #22d3ee` — operational indicator: destination markers, route highlights only
- `--award-indigo: #6366f1` — operational indicator: decision-gate state only

**Typography:**
- `--font-serif: 'Playfair Display'` — cinematic section headings
- `--font-sans: 'Inter'` — body (B2B exception; acceptable here)
- `--font-mono: 'JetBrains Mono'` — all KPI, metrics, numerical displays
- Always: `font-variant-numeric: tabular-nums` on numbers, `text-wrap: balance` on headings

**Before any visual change → read `.agents/skills/design-taste-frontend/SKILL.md`**

## Data Integrity (non-negotiable)

Real values from source report only. Never approximate or invent:

| Fact | Value |
|------|-------|
| Units | 7 transformers |
| Weight | 217.00 t each |
| Route | MZP → AGI (~18.00 km) |
| Vessel | LCT Bushra + SPMT |
| Period | 2026-01-27 to 2026-03-14 |

Route: `~200 km` label is frozen as TBC pending source confirmation — do not change.

## Rules

- **ZERO em-dashes** (`—`) → replace with middle dot `·` or colon
- No `window.addEventListener('scroll')` → use `ScrollTrigger` only
- No AI-purple gradients, no generic/placeholder names, no fake metrics
- Tables: `border-radius: 0` (sharp, data context)
- Radius: cards/panels 16–22 px, chips 999 px (pill)
- `prefers-reduced-motion`: snap cards visible, hide background videos

## Motion

- GSAP ScrollTrigger for all scroll reveals
- Lenis smooth scroll (desktop only; mobile uses native)
- All animations must be motivated by content (not decorative)

## Local Preview

```bash
# From tr_report-main/ directory
python -m http.server 8080
# then open http://localhost:8080
```

No build. No install. Edit `index.html`, refresh browser.

## Deployment

Vercel static hosting via `vercel.json`.
- `index.html` → `Cache-Control: no-cache` (always fresh)
- `assets/` → `max-age=31536000, immutable`
- Push to main branch → Vercel auto-deploys

## File Naming

Output files: `YYYYMMDD_설명_v1.확장자`
