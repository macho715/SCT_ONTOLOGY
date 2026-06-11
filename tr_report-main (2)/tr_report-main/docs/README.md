# HVDC TR Transport Operations Report

**Independent Subsea HVDC System Project (Project Lightning) — UAE**
Internal operations report covering 765 kV single-phase transformer transport from Mina Zayed Port (MZP) to Al Ghallan Island (AGI).

## Overview

This single-page HTML report documents the full transport operation for **7 × 765 kV single-phase transformers (217 t each)** using LCT Bushra and SPMT across 7 individual trips.

| Item | Value |
|------|-------|
| Cargo | TM-63 Transformer × 7 units |
| Unit Weight | 217.0 t |
| Transport Mode | LCT (sea) + SPMT (road) |
| Trips | 7 × single-unit |
| Period | 2026-01-27 ~ 2026-03-14 |
| Route | MZP → AGI (approx. 18 km) |

## Operation Flow

```mermaid
flowchart TD
    A["🏭 Mina Zayed Port (MZP)\nLoad-out via SPMT"] --> B["⛴ LCT Bushra\nSea Transit ~2h"]
    B --> C["🏝 Al Ghallan Island (AGI)\nLoad-in via SPMT"]
    C --> D["🏗 Jack-down & Skid\nFinal Positioning"]
    D --> E["✅ Trip Complete\n+1 Unit Installed"]
    E -->|"× 7 trips"| A

    style A fill:#1a1f3c,color:#c9a84c,stroke:#c9a84c
    style B fill:#1a1f3c,color:#22d3ee,stroke:#22d3ee
    style C fill:#1a1f3c,color:#c9a84c,stroke:#c9a84c
    style D fill:#1a1f3c,color:#6366f1,stroke:#6366f1
    style E fill:#1a1f3c,color:#34d399,stroke:#34d399
```

## Project Milestones

```mermaid
timeline
    title HVDC TR Transport — Key Events
    2026-01-20 : Mammoet proposes 1-TR-per-trip (no ballast)
               : Samsung confirms revision
    2026-01-27 : Trip 1 — First transformer dispatched
    2026-01-31 : Trip 2 — Dual SPMT configuration deployed
    2026-02-11 : Trip 3 — Steady-state operations
    2026-02-12 : Trip 4
    2026-03-14 : Trip 7 — Final unit delivered
               : All 7 transformers installed at AGI
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 (single-file, self-contained) |
| Styling | CSS Custom Properties (Design System) |
| Animation | GSAP 3.12.5 + ScrollTrigger |
| Scroll | Lenis smooth scroll |
| Maps | Inline SVG + GSAP path animation |
| Fonts | Google Fonts (Playfair Display, Source Serif 4, Inter, JetBrains Mono) |

## CSS Design System

```mermaid
graph LR
    T["ds-tokens\n53 CSS custom props"] --> C["ds-components\nAll UI components"]
    C --> O["ds-overrides\nResponsive + layout"]
    O --> V["design-upgrade-v3\nStep 1–6 enhancements"]

    style T fill:#07091a,color:#c9a84c,stroke:#c9a84c
    style C fill:#07091a,color:#22d3ee,stroke:#22d3ee
    style O fill:#07091a,color:#6366f1,stroke:#6366f1
    style V fill:#07091a,color:#34d399,stroke:#34d399
```

## Local Usage

```bash
# Clone
git clone https://github.com/macho715/tr_report.git
cd tr_report

# Open (no build step required)
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

> **Note:** Requires internet connection for Google Fonts. All JS libraries are bundled inline.

## Live Demo

🌐 Deployed via Vercel — see [Deployment](#) for URL.

## File Structure

```
tr_report/
├── index.html          Main report (single-file, 469 KB)
├── tr/                 Image assets (33 files, 8 MB compressed)
├── docs/
│   ├── README.md       This file
│   ├── LAYOUT.md       Page layout documentation
│   ├── ARCHITECTURE.md CSS/JS architecture
│   └── CHANGELOG.md    Version history
├── .gitignore
└── vercel.json
```

## License

Internal document — Samsung C&T / QJC. Not for public distribution.
