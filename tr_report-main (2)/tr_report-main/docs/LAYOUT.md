
---
# Page Layout Documentation

## Section Structure

The report is a single scrolling page with 7 major sections.

```mermaid
block-beta
  columns 1
  hero["🎬 HERO SECTION\nfullscreen · background video · orbit sphere canvas · GSAP entrance"]
  nav["📌 CHAPTER NAVIGATION\nsticky · 78px height · IntersectionObserver active state"]
  block:ch1["CHAPTER 01 — Cargo Specifications"]:1
    op1["Chapter Opener\nparallax bg · clip-path reveal"]
    kf1["Key Fact Interstitial\n217 t · count-up animation"]
    ed1["Editorial Split\nimage left · data points right"]
    cg1["Card Grid\nSuccess criteria · Failure modes"]
  end
  block:ch2["CHAPTER 02 — Voyage Log"]:1
    op2["Chapter Opener"]
    kf2["Key Fact · 7 trips"]
    vc["Voyage Cards\n7 cards · clip-path wipe reveal"]
    rmap["Route Map\nSVG inline · animated ship · GSAP path"]
  end
  block:ch3["CHAPTER 03 — Operations Analysis"]:1
    op3["Chapter Opener"]
    kf3["Key Fact · KPI metrics"]
    gngo["Go/No-Go Decision Table\nverdict badges · row hover"]
    gate["Gate Flow Timeline\nvertical timeline · scroll-in"]
    raci["RACI Matrix\ntable · role highlight"]
  end
  block:ch4["CHAPTER 04 — Lessons & Close-out"]:1
    op4["Chapter Opener"]
    stat["Hero Stats · 3 metrics"]
    ed4["Editorial · Pull quotes"]
    attr["Attribution\nglassmorphism card"]
  end
  footer["🔻 SITE FOOTER\nbrand · links · credits"]
```

## Z-index Stacking Order

```mermaid
graph BT
    F["z-index: auto\nnormal flow elements"]
    A["z-index: 1\n.hero-bg, orbit container"]
    B["z-index: 2\n.rmap-svg-container\n(critical: prevents ocean overlay)"]
    C["z-index: 100\n.chapter-nav (sticky)"]
    D["z-index: 3000\n.floating-actions (FAB buttons)"]
    E["z-index: 9999\n#progress-bar"]

    F --> A --> B --> C --> D --> E
```

## Responsive Breakpoints

| Breakpoint | Width | Layout Change |
|-----------|-------|---------------|
| `--bp-xs` | 480px | Single column, reduced padding |
| `--bp-sm` | 640px | Mobile nav condensed |
| `--bp-md` | 768px | Editorial splits stack |
| `--bp-lg` | 1024px | Full desktop layout |
| `--bp-xl` | 1280px | Max content width |
| `--bp-2xl` | 1536px | Wide screen spacing |

## Hero Section Layout

```mermaid
graph TD
    subgraph Hero ["#hero (100svh, flex column, align-items: flex-end)"]
        BG[".hero-bg\nbackground-image, parallax"]
        OV[".hero-overlay\ngradient overlay"]
        OC["#heroOrbitContainer\ncanvas · 456px×456px · bottom:18%"]
        GO[".hero-grid-overlay\nCSS grid lines"]
        HC[".hero-content\neyebrow · title · subtitle · scroll hint"]
    end
    BG -.->|"z:0"| OC
    OC -.->|"z:1"| GO
    GO -.->|"z:1"| HC
```

## Animation Timeline (Page Load)

```mermaid
sequenceDiagram
    participant B as Browser
    participant G as GSAP
    participant L as Lenis

    B->>G: DOMContentLoaded
    G->>G: registerPlugin(ScrollTrigger)
    G->>G: initHeroEntrance() — fade-up 1.0s
    G->>L: new Lenis({ duration: 1.15 })
    L->>G: lenis.on('scroll', ScrollTrigger.update)
    B->>G: scroll event
    G->>G: chapter parallax · card reveal · count-up
    G->>G: orbit sphere — rAF loop
```
---
