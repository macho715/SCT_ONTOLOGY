# Mobile Optimization Plan — HVDC TR Report

**Date:** 2026-04-03
**Target:** `index.html` + Vercel deployment

---

## 현재 상태 분석 (Research 결과)

### 발견된 문제점

| 우선순위 | 항목 | 현재값 | 기준 |
|---------|------|--------|------|
| 🔴 P1 | 소형 폰트 (9-11px) | `.chapter-nav-link` 9px, `.hero-attribution-team` 9px, `.rmap-strip-label` 9px | WCAG: 최소 12px 권장 |
| 🔴 P1 | Touch target < 44px | `.lightbox-btn` 42px | Apple HIG / WCAG 2.5.5: 44px |
| 🔴 P1 | 이미지 lazy loading 없음 | `<img>` 33개 즉시 로드 | 모바일 초기 로딩 지연 |
| 🟡 P2 | Safe area 미처리 | `bottom: 12px` 고정 | iPhone notch/home indicator 침범 |
| 🟡 P2 | tap highlight 표시 | 기본 파란 박스 | 모바일 UX 저하 |
| 🟡 P2 | `touch-action` 없음 | 300ms tap delay | 반응성 저하 |
| 🟡 P2 | Route map SVG 모바일 | 고정 viewBox 900×500 | 좁은 화면에서 너무 작음 |
| 🟢 P3 | Table overscroll | 기본값 | 스크롤 체인 발생 |
| 🟢 P3 | evidence-table 폰트 | 13px | 모바일 600px 이하 너무 작음 |

---

## 패치 계획

### Patch 1 — CSS `<style id="mobile-optimize-v1-20260403">`

```
1. Touch baseline
   - * { -webkit-tap-highlight-color: transparent }
   - button, a { touch-action: manipulation }

2. 폰트 최소 크기 보정 (모바일 768px 이하)
   - .editorial-image-caption: 11px → 12px
   - .gngo-voyage / .gngo-date: 11px → 12px
   - .rmap-strip-label: 9px → 10px
   - .hero-attribution-team: 9px → 10px

3. Touch target 44px 보장
   - .floating-actions button: min-height 44px
   - .lightbox-btn (768px): 42px → 44px
   - .chapter-nav-link (768px): min-height 44px, inline-flex

4. Safe area insets (iPhone 홈 인디케이터)
   - body (480px): padding-bottom → max(84px, env(safe-area-inset-bottom)+60px)
   - .floating-actions: bottom → max(12px, env(safe-area-inset-bottom)+8px)

5. Route map SVG 모바일 대응
   - 600px 이하: overflow-x: auto, SVG min-width: 480px

6. Table scroll 개선
   - .table-scroll-wrap: overscroll-behavior-x: contain

7. evidence-table 모바일
   - 600px 이하: font-size 12px, padding 압축
```

### Patch 2 — HTML `<img loading="lazy">`

Python으로 전체 `<img>` 태그에 `loading="lazy" decoding="async"` 추가.
예외: 히어로 배경은 CSS background-image이므로 해당 없음.

---

## 검증 방법

1. Claude Preview MCP로 375px (iPhone SE) 뷰포트 스크린샷
2. Chrome DevTools 에뮬레이션: 360px, 390px, 414px
3. Lighthouse mobile score 확인

---

## 실행 순서

```
Wave 1: CSS 패치 삽입 + HTML lazy loading (병렬)
Wave 2: 검증 (Preview 스크린샷)
Wave 3: Git commit + push
Wave 4: Vercel 재배포 + 최종 확인
```
