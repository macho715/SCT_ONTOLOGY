# Taste Skill Configuration — tr_report

## Design Read
B2B heavy logistics operations evidence report. Audience: engineering, project management, client reporting. Mood: serious, premium, operational, cinematic. Not a SaaS landing page.

## Dial Settings
```
DESIGN_VARIANCE  = 7   // Award-style asymmetry with structured report hierarchy
MOTION_INTENSITY = 6   // Cinematic scroll reveals — motivated, not decorative
VISUAL_DENSITY   = 8   // Evidence/KPI density required; cockpit-style data display
```

## Design System
Single-file HTML + GSAP ScrollTrigger + Lenis. No framework migration.
Aesthetic: Carbon-adjacent dark operational UI (IBM-style B2B analytics) with cinematic motion layer.

## Accent Color System (single accent rule)
- Primary: `--award-gold: #c9a84c` — all primary metrics, kickers, decision-go states
- Secondary: `--award-cyan: #22d3ee` — destination markers, route highlights
- Tertiary: `--award-indigo: #6366f1` — decision-gate state only
- One accent = gold. Cyan/indigo are operational indicators, not accent variants.

## Corner Radius System
- Cards/panels: `border-radius: 16px–22px`
- Chips/badges: `border-radius: 999px` (pill)
- Tables: `border-radius: 0` (sharp, data-context)

## Typography
- Display/serif: Playfair Display (cinematic headings)
- Body: Inter (dense report context, acceptable exception to no-Inter rule)
- Mono: JetBrains Mono (all KPI, code, metrics)
- `font-variant-numeric: tabular-nums` on all numerical displays
- `text-wrap: balance` on all headings

## Motion Rules
- GSAP ScrollTrigger for all scroll reveals
- Lenis smooth scroll (desktop only, native on mobile)
- `prefers-reduced-motion: reduce` → scene cards snap visible, videos hidden
- No `window.addEventListener('scroll')` (CSS scroll-driven fallback in use)

## Banned (applied)
- ❌ Scroll cue removed from hero
- ❌ Em-dashes in chapter-desc replaced with `·`
- ❌ AI-purple gradients — not used
- ❌ Generic names — real project/vessel names only
- ❌ Fake metrics — all values from source report only

## Video Pilot
- `assets/video/hero-transformer.mp4` → #hero background
- `assets/video/route-corridor.mp4` → #route-map-hero background
- Fallback: static image when video file not present
- Mobile: opacity 0.32, reduced filter

## Data Integrity
- Route distance: `approx. 18.00 km` (spec basis) — `~200 km` frozen as TBC pending source confirmation
- All logistics values from source report: 7 units × 217.00 t, MZP → AGI, LCT Bushra, 2026-01-27 to 2026-03-14
