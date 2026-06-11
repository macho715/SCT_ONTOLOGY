---
# System Architecture

## Overview

`index.html` is a fully self-contained single-file web application. No build step required.

```mermaid
graph TB
    subgraph HTML ["index.html (469 KB)"]
        subgraph CSS ["CSS — 4 Style Blocks (100 KB)"]
            T["ds-tokens\n53 custom properties\n:root variables"]
            C["ds-components\nAll UI components\nrmap z-index fix"]
            O["ds-overrides\nHero lift · nav height\nResponsive · print"]
            V["design-upgrade-v3\nToken completion\nChapter identity\nKey facts · GoNoGo\nNav interaction · Footer"]
        end
        subgraph JS ["JavaScript — 10 Script Blocks (270 KB minified)"]
            G["GSAP 3.12.5\n+ ScrollTrigger"]
            LE["Lenis\nSmooth scroll"]
            APP["App Scripts\ninitProgressBar\ninitHeroParallax\ninitHeroEntrance\ninitChapterOpeners\ninitOrbitSphere\ninitVoyageCards\nPATCH-B (glass blur)\nPATCH-C (nav observer)"]
        end
        subgraph ASSETS ["Assets"]
            IMG["tr/\n33 images\n8 MB compressed"]
            SVG["Inline SVG\nRoute Map\nship animation"]
        end
    end

    T -->|cascade| C --> O --> V
    G --> APP
    LE --> APP
    IMG -.->|referenced| HTML
```

## CSS Token System

```mermaid
graph LR
    subgraph TOKENS ["ds-tokens — :root"]
        direction TB
        COLOR["Color Scale\n--bg-void · --bg-deep · --bg-card\n--accent-gold · --accent-gold-lt\n--accent-cyan · --accent-indigo\n--status-ok · --status-warn · --status-crit"]
        TYPO["Typography\n--font-serif · --font-sans · --font-mono\n--fs-hero · --fs-h1 · --fs-body\n--lh-body · --lh-heading"]
        SPACE["Spacing\n--spacing-xs → --spacing-3xl"]
        SHADOW["Shadow\n--shadow-sm → --shadow-xl\n--shadow-glow-gold · --shadow-glow-cyan"]
        RADIUS["Radius\n--radius-sm → --radius-full"]
        MOTION["Motion\n--dur-fast → --dur-slow\n--ease-bounce · --ease-smooth"]
        ZINDEX["Z-index\n--z-base → --z-max"]
    end
```

## JavaScript Module Map

```mermaid
graph LR
    subgraph INIT ["Initialization (DOMContentLoaded)"]
        P["initProgressBar\nscroll % → width"]
        H["initHeroParallax\nGSAP yPercent 35"]
        E["initHeroEntrance\ngsap.set + gsap.to\nfade-up stagger"]
        CH["initChapterOpeners\nparallax + scrub-out"]
        KF["initKeyFactFloat\ncount-up on scroll"]
        VC["initVoyageCards\nclip-path wipe"]
        OS["initOrbitSphere\ncanvas rAF loop\nUnicode 3D sphere"]
        LN["Lenis\nraf ticker"]
    end
    subgraph SCROLL ["Scroll-driven"]
        ST["ScrollTrigger\n.glass-card blur→sharp\n.chapter-opener clip-path\nNav IntersectionObserver\nheroStat tooltips"]
    end
    INIT --> SCROLL
```

## Route Map SVG Architecture

```mermaid
graph TD
    subgraph RMAP [".rmap-svg-container (position:relative z-index:2)"]
        direction TB
        OCEAN[".rmap-bg-ocean\nposition:absolute z-index:0\n⚠ sits above normal flow"]
        SVG["SVG viewBox 0 0 900 500"]
        subgraph LAYERS ["SVG Layers (bottom → top)"]
            DEFS["defs\nfilters · gradients · markers\nrmGoldGlow · pathGlow · seaPattern"]
            BG["Sea tiles + land polygons"]
            ROUTE["Animated route path\nstroke-dashoffset → 0"]
            STOPS["Port markers\nMZP · AGI pulse rings"]
            SHIP["#rmap-ship-icon\ntop-down silhouette\ntranslate(665,222)"]
            LABELS["Port labels · distance badge"]
        end
    end
    OCEAN -.->|"z-index:2 override prevents\nocean covering SVG"| SVG
```

## External Dependencies

| Dependency | Version | Load Method | Size |
|-----------|---------|-------------|------|
| Google Fonts | — | `<link>` CDN | ~40KB |
| GSAP | 3.12.5 | Inline bundle | ~200KB |
| ScrollTrigger | 3.12.5 | Inline bundle | ~40KB |
| Lenis | latest | Inline bundle | ~15KB |

> All JS is bundled inline — the report works **offline** after first load (Google Fonts cached).

## Browser Compatibility

| Feature | Min Version |
|---------|------------|
| CSS custom properties | Chrome 49 / Safari 9.1 |
| `clamp()` | Chrome 79 / Safari 13.1 |
| `inset:` shorthand | Chrome 87 / Safari 14.1 |
| Canvas 2D | Universal |
| GSAP ScrollTrigger | IE not supported |
---
