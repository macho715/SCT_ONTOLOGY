# Contrast Flows

This file defines the contrast governance layer for the HVDC TR operations report.
It is a design and test contract.
It is not a claim that the live CSS has already been fully converted to OKLCH.

## Current State

- Design source: `design-md/DESIGN.md`
- Live implementation: `../index.html`
- Current live color state: core, inline, and SVG-facing colors are OKLCH-first role tokens with fallback values
- Remaining live color state: script-driven canvas paint may still use direct color strings
- Target color state: all reusable CSS/HTML/SVG colors are tokenized; canvas colors are read from CSS tokens when refactored
- Automated visual gate state: not wired

## Flow Order

| Priority | Layer | Visual job | Required behavior |
| --- | --- | --- | --- |
| 1 | Background media | Provides logistics context | Stays darkest and never competes with text |
| 2 | Section surface | Separates report chapters | Sits above media but below evidence cards |
| 3 | Evidence panel | Holds mission, KPI, table, or gate content | Reads clearly without hover or animation |
| 4 | Primary text | Carries claims, cargo facts, dates, and routes | Highest neutral contrast |
| 5 | Decision accent | Marks active navigation, approved gates, key facts | Uses gold as the primary accent |
| 6 | Operational signal | Marks route, destination, or decision context | Uses cyan or indigo only when the role is explicit |

## OKLCH Rules

- Define new color tokens in OKLCH first.
- Keep hex or rgba only as browser/export fallback values.
- Use lightness to create hierarchy before changing hue or chroma.
- Keep the page dark without using pure black.
- Treat gold as the single primary accent.

## Taste Skill Adaptation

The active taste skill is a premium landing-page engine, but this project is not a landing page.
Apply only the parts that strengthen an operational evidence report.

Use these adapted rules:

- Keep one primary accent: gold.
- Use cyan and indigo only as operational signals, not decorative accent variants.
- Preserve dense report scanning over conversion-style hero or CTA patterns.
- Use glass only for hierarchy, mission panels, evidence cards, and floating controls.
- Do not turn full sections into glass cards.
- Keep cinematic motion motivated by transport, route, document flow, or field context.
- Do not add emojis, generic placeholder imagery, fake urgency, fake testimonials, or fake metrics.
- Keep `Inter` as an approved project exception for dense operational UI text.
- Preserve `100dvh` viewport sections and reduced-motion fallbacks.
- Prefer grid-based evidence layouts over flex percentage math.

## Anti-patterns

- Background, card, body copy, and CTA have the same perceived lightness.
- Glassmorphism is applied to entire page sections.
- Blur is used to hide weak contrast.
- A centered generic CTA becomes the visual priority over operational evidence.
- Purple or blue AI-gradient styling becomes the main palette.
- A new color has no evidence, status, navigation, route, or decision role.
- A landing-page conversion block replaces operational evidence.
- A decorative animation makes the logistics state harder to read.
- A font rule from a generic landing-page template overrides the report typography system.

## Test-first Checks

Run these checks before implementing a visual patch:

1. Name the layer affected by the change.
2. Confirm the target contrast flow order still holds.
3. Confirm text remains readable with media loaded.
4. Confirm text remains readable when video or image media is missing.
5. Confirm reduced-motion mode does not hide evidence.
6. Confirm status is readable by label and contrast, not color alone.

## Future Automation

Playwright and Vizly can be added later as visual regression gates.
When they are added, they should compare screenshots for:

- hero and chapter media readability
- glass card text contrast
- active navigation contrast
- status badge contrast
- reduced-motion fallback readability

Until those gates are wired, do not report automated contrast validation as complete.
