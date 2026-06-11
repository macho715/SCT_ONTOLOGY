# Handoff Spec: 배경 영상 시네마틱 시스템 (TR Report)

> Last updated: 2026-06-11 · Source: `index.html` (실측값 추출, 추측 없음)

## Overview

Samsung C&T HVDC TR 리포트의 풀블리드 배경 영상 레이어. 각 챕터 섹션에 muted·loop·autoplay 장식 영상을 깔고, 스크롤 연동 모션(등장·패럴랙스·비네트)으로 시네마틱 톤을 부여한다. **컨트롤 없는 앰비언트 배경** — 사용자는 영상을 직접 조작하지 않으며, 콘텐츠 가독성이 최우선이다. 단일 자립형 `index.html`(인라인 GSAP, 외부 JS CDN 0)로 `file://`·Vercel 동일 동작.

## Layout

- 콘텐츠 max-width: **`--content-max` = 1280px**, 영상 래퍼는 `position:absolute; inset:0` 풀블리드
- 섹션 스택 순서(z-index): `chapter-opener-bg`(0, 정적 포스터 fallback) → `section-video-wrap`(chapter:1 / hero·route:0) → `chapter-opener-overlay`(2) → `chapter-opener-text`(3)
- 영상 래퍼 내부: `video`(1) → 동적 오버레이 `.video-vignette`·`.video-reveal`(1, 비디오 뒤 DOM순서로 위) — **콘텐츠 오버레이(2)·제목(3) 아래** 유지

## Design Tokens Used

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-void` | `#07091a` | reveal 오버레이 기준 암전색 (구현은 `#05081a`) |
| `--accent-gold` | `#c9a84c` | 챕터 태그·라인 액센트 |
| `--accent-gold-lt` | `#e8c97a` | marquee 강조 숫자 |
| `--font-display` | `'Playfair Display'` 900 | 챕터 제목 |
| `--font-serif` | `'Source Serif 4'` | 챕터 서브카피 |
| `--font-mono` | `'JetBrains Mono'` | 챕터 태그·nav |
| `--text-primary` | `#f0f2ff` | 제목 텍스트 |
| `--content-max` | `1280px` | 콘텐츠 폭 |

## Components (영상 레이어)

| Component | Variant | 핵심 속성 | Notes |
|-----------|---------|----------|-------|
| `.section-bg-video` | **chapter-opener** | `opacity:1` · `filter:saturate(.85) contrast(1.08) brightness(.62)` · `z-index:1` | 불투명(고스팅 방지). 코덱 **H.264 8-bit yuv420p** 필수, `faststart` |
| `.section-bg-video` | **hero / route** | `opacity:0.48` · `filter:contrast(1.08) saturate(.88) brightness(.65)` | 어두운 베이스 위 반투명 합성 |
| `.video-reveal` | 동적 생성 (JS) | `bg:#05081a; opacity:1→0; z-index:1` | fade-from-black 등장 레이어 |
| `.video-vignette` | 동적 생성 (JS) | `radial-gradient(ellipse 70% 70% at 50% 50%, transparent 38%, rgba(5,8,20,.78))` | 중앙 초점 비네트 |
| `<video>` 속성 | 전 섹션 공통 | `autoplay muted loop playsinline preload="metadata"` | muted = autoplay 정책 충족 |

## States and Interactions

| Element | State | Behavior |
|---------|-------|----------|
| 배경 영상 | 뷰포트 진입 | IntersectionObserver(threshold 0.01) → `tryPlayVideo()` 재생 |
| 배경 영상 | 뷰포트 이탈 | `video.pause()` (성능) |
| 배경 영상 | 탭 전환 복귀 | `visibilitychange`·`focus`·`pageshow` → `playAllVisibleVideos()` 재시도 |
| 배경 영상 | autoplay 차단 | `play().catch()` → `console.warn('[BG-VIDEO BLOCKED]')`, 포스터 유지 |
| 영상 src 갱신 | 교체 시 | 파일명 동일 시 **`?v=N` 캐시버스터 증가** 필수 (브라우저 캐시 우회) |

## Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| Desktop (>768px) | chapter `opacity:1` / hero `0.48`, 풀 모션 |
| Mobile (≤768px) | `.section-bg-video { opacity:0.32; filter:contrast(1.02) brightness(.55) }` — 텍스트 대비 강화 |
| `.chapter-opener` | `height:70vh; min-height:480px` (모바일 `min-height:400px`) |

## Edge Cases

- **코덱 미지원**: 소스가 HEVC/10-bit → Chrome 재생 불가. **반드시 H.264 8-bit yuv420p로 재인코딩** (`-pix_fmt yuv420p -movflags faststart`)
- **포스터 fallback**: 재생 전/실패 시 `poster=` 속성 + `.chapter-opener-bg` 정적 이미지 표시
- **캐시 고착**: 동일 파일명 교체 시 이전 영상 캐시 → `?v=N` 증가로 강제 리로드 (Vercel은 `Cache-Control: immutable`)
- **로딩**: `preload="metadata"` — 초기 메타만, 진입 시 본로드 (배포 사이즈/초기로딩 균형)
- **`file://` 환경**: muted autoplay는 MEI·프로토콜 무관 항상 허용 (검증됨)

## Animation / Motion (GSAP ScrollTrigger, 인라인)

| Element | Trigger | Animation | Duration / Scrub | Easing |
|---------|---------|-----------|------------------|--------|
| `.video-reveal` | `start: top 82%` | opacity 1→0 (암전 해제) | 1.1s (one-time, `toggleActions: play none none reverse`) | `power2.out` |
| `.section-bg-video` | `top bottom → bottom top` | scale 1.0→1.06 (Ken Burns) | scrub 1.2 | `none` |
| `.section-bg-video` | `top bottom → bottom top` | y 20→-20px (parallax) | scrub 1.2 | `none` |
| `.video-vignette` | `top bottom → bottom top` | opacity 0.85→0→0.85 (중앙 최선명) | scrub 1 | `none` |
| `.chapter-opener-bg` | `top bottom → bottom top` | yPercent -8→8 (bg parallax) | scrub 1.5 | `none` |
| `.chapter-opener-text` 자식 | `top 95%` | y 32→0, opacity 0→1, stagger 0.1 | 0.9s | `power3.out` |

## Accessibility Notes

- **`prefers-reduced-motion: reduce`**: `initCinematicEffects()` 전체 skip — 영상은 계속 autoplay, **모션만 제거** (정적 프레이밍). CSS도 `.section-bg-video { transform:none !important }`로 일관
- 배경 영상은 전부 `aria-hidden="true"` + `pointer-events:none` (장식, 스크린리더 무시)
- 동적 오버레이도 `aria-hidden="true"` 부여
- 제목/콘텐츠는 z-index 2~3로 항상 영상 위 → 대비 유지 (모바일에서 opacity↓로 추가 보강)
- **포커스 순서**: 영상 레이어는 비포커스(장식), nav→콘텐츠 순서 유지

## 핵심 JS 함수 참조 (`index.html`)

| 함수 | 라인 | 역할 |
|------|------|------|
| `tryPlayVideo(video)` | ~8232 | muted 강제 + `play().catch()` 로깅 + visibilitychange 재시도 |
| `playAllVisibleVideos()` | ~8265 | 뷰포트 내 영상 일괄 재생 |
| `initSectionVideoPlayback()` | ~8365 | IntersectionObserver 재생/정지 + canplay |
| `initCinematicEffects()` | ~8278 | reveal·parallax·Ken Burns·vignette + reduced-motion 가드 |
| `gsap.registerPlugin(ScrollTrigger)` | ~6992 | ScrollTrigger 등록 (인라인) |

## 영상 교체 절차 (운영)

```bash
# 1. 소스 코덱 확인
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,pix_fmt SRC.mp4

# 2a. 이미 H.264 8-bit → 무손실 re-mux (faststart만)
ffmpeg -y -i SRC.mp4 -c copy -movflags faststart assets/video/<target>.mp4

# 2b. HEVC/10-bit → H.264 8-bit 재인코딩
ffmpeg -y -i SRC.mp4 -c:v libx264 -crf 23 -preset fast -pix_fmt yuv420p -an -movflags faststart assets/video/<target>.mp4

# 3. 포스터 갱신 (1초 프레임)
ffmpeg -y -ss 1 -i assets/video/<target>.mp4 -frames:v 1 -q:v 3 tr/<target>-poster.jpg

# 4. index.html 캐시버스터 ?v=N 증가 (src + poster + chapter-opener-bg)

# 5. 강력 새로고침 Ctrl+Shift+R
```
