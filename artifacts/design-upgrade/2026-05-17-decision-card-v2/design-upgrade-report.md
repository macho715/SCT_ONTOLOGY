# Decision Card v2 Design Upgrade Report

## P0 Intake

Surface type: ChatGPT vanilla widget card.
Editable target: public/hvdc-answer-widget.html.
Current evidence: user-provided ChatGPT screenshot showing dense light card, low hierarchy, plain table, cramped trace hash.
Constraint: keep existing renderer contract and avoid new external resources.

## P1 Baseline

Problems:
- Header hierarchy is weak; verdict badge competes with title but does not anchor the surface.
- Coverage cards read like plain boxes instead of status modules.
- Action table lacks dashboard-style separation and row rhythm.
- Source hash occupies a narrow card and wraps awkwardly.

## P2 Benchmark summary

References used:
- GitHub Primer: cards, labels, tables, and status primitives.
- Stripe Dashboard docs: dashboard table/card organization and account resource views.
- PatternFly aggregate status card: dashboard status cards with accent hierarchy.

Transferable elements:
- Use status pill with explicit text and semantic color.
- Use elevated white cards on a calm container surface.
- Use table header bands and row separation for operational actions.
- Use full-width monospace panel for trace hashes.

## P3 Patch map

- `.decision-card-v2`: stronger surface, edge accent, layered background.
- `.decision-card-header`, `.decision-card-title`, `.decision-card-badge`: clearer hierarchy and badge weight.
- `.coverage-item`, `.coverage-status`: status-card treatment.
- `.decision-card-table`: dashboard table treatment.
- `.decision-trace .decision-card-panel:last-child`: full-width code-like hash panel.

## P4 Applied changes

Applied CSS-only patch. Renderer structure and data contract unchanged.

## P5 Verification

Automated screenshot diff not run in this session. Manual verification should be done in ChatGPT after app refresh.

## P7 Deliver

Patch is reversible and scoped to Decision Card v2 CSS.
