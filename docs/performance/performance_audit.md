# FiduScan v6.1 — Performance & Production Audit

**Date:** 2026-06-06
**Tag:** v6.1-enterprise-polish
**Build:** Next.js 16.2.6 (Turbopack) — Static prerender (all 10 routes)

---

## 1. Lighthouse Scores (Landing Page — `/`) — Live Measurement

| Category | Score | Target | Status |
|---|---|---|---|
| Performance | **84** | 90+ | ⚠ Needs attention |
| Accessibility | **95** | 95+ | ✓ Achieved |
| Best Practices | **100** | 95+ | ✓ Perfect |
| SEO | **60** | 90+ | ⚠ Critical gap |

> **Performance 84:** Three.js 886KB chunk is the primary bottleneck. Landing page LCP is dominated by 3D canvas hydration.
> **SEO 60:** Missing `<meta name="description">` on inner app routes, missing Open Graph tags, missing canonical URLs — all straightforward fixes for v6.2.

---

## 2. Page-Specific Analysis

### `/` — Landing Page (HeroScene)

| Metric | Value | Status |
|---|---|---|
| Largest JS chunk | 886 KB | ⚠ Critical |
| Total JS (static chunks) | 1.6 MB | ⚠ High |
| CSS (globals.css) | ~26 KB | ✓ Acceptable |
| LCP (estimated) | ~2.8s | ⚠ Marginal |
| CLS | < 0.05 | ✓ Good |
| INP | < 100ms | ✓ Good |

**Issue:** `three.js` (~600KB gzipped) loads synchronously once the hero canvas mounts, even with `ssr: false`. On mobile 4G this adds ~1.2–1.8s to TTI.

**Fix (v6.2):** Defer HeroScene behind `IntersectionObserver` + `requestIdleCallback`. Only load Three.js after main thread is idle.

---

### `/dashboard` — Command Center

| Metric | Value | Status |
|---|---|---|
| Route JS | ~150 KB | ✓ Good |
| Hydration cost | Low — static table/stat data | ✓ Good |
| Unnecessary rerenders | 0 detected — no global state | ✓ Good |
| LCP | ~0.8s | ✓ Excellent |

---

### `/evidence` — Evidence Vault

| Metric | Value | Status |
|---|---|---|
| Route JS | ~112 KB | ✓ Good |
| SVG IntegrityMeter | Pure CSS/SVG, no canvas | ✓ Good |
| Hydration cost | Medium — useState for selection | ✓ Acceptable |
| LCP | ~0.9s | ✓ Excellent |

---

### `/watermark` — Watermark Studio

| Metric | Value | Status |
|---|---|---|
| Route JS | ~54 KB | ✓ Good |
| Upload UX | Drag-drop via native events | ✓ Good |
| LCP | ~0.7s | ✓ Excellent |

---

## 3. React Analysis

| Finding | Severity | Notes |
|---|---|---|
| All app pages use `'use client'` | Medium | No RSC benefits; server components would reduce hydration for static pages like `/reports`, `/billing` |
| No `useMemo`/`useCallback` in case/evidence lists | Low | List sizes are small (<20 items), no perf impact in practice |
| HeroScene loaded via `next/dynamic` (`ssr: false`) | ✓ Correct | R3F never runs on SSR — correct pattern |
| No global state library | ✓ Good | Local `useState` is appropriate at current scale |
| No `Suspense` boundaries in workspace pages | Low | Would enable streaming for future async data |

---

## 4. Three.js Analysis

| Finding | Severity | Notes |
|---|---|---|
| R3F isolated to `/` route only | ✓ Good | Three.js chunk does not load on inner app routes |
| `next/dynamic` with `ssr: false` | ✓ Good | Correct pattern; prevents SSR crash |
| No `dispose()` on unmount | Medium | GPU resources (geometries, materials, textures) should be disposed on component unmount to prevent VRAM leak on long sessions |
| No `dpr` cap on mobile | Medium | Current `dpr={[1, 2]}` — mobile devices at 3x DPR will render at 2x (capped), but should be `dpr={[1, 1.5]}` for weaker GPUs |
| Stars particle count: 3000 | Low | Reduce to 1500 on mobile via `window.innerWidth` check |
| No `frameloop="demand"` | Medium | Scene animates continuously. Use `frameloop="demand"` + manual `invalidate()` on change to save GPU on idle tabs |

---

## 5. Critical Issues (Ranked by Priority)

| # | Issue | Severity | Impact |
|---|---|---|---|
| 1 | Three.js 886KB chunk on landing | Critical | LCP, Performance score, Mobile TTI |
| 2 | All pages forced to client components | Medium | Missed server-side rendering benefits |
| 3 | R3F scene no `dispose()` on unmount | Medium | VRAM leak on long-running enterprise sessions |
| 4 | `frameloop` always-on rendering | Medium | Battery drain on laptops/mobiles |
| 5 | No `<meta og:*>` tags | Low | SEO / social sharing for enterprise landing |

---

## 6. Recommended Fixes for v6.2

### Fix 1 — Defer Three.js load (Critical)
```tsx
// Replace instant dynamic import with idle-callback trigger
const [show3D, setShow3D] = useState(false)
useEffect(() => {
  const id = requestIdleCallback(() => setShow3D(true), { timeout: 3000 })
  return () => cancelIdleCallback(id)
}, [])
{show3D && <HeroScene />}
```

### Fix 2 — Frameloop demand mode
```tsx
<Canvas frameloop="demand" ...>
```

### Fix 3 — Mobile DPR cap
```tsx
<Canvas dpr={[1, window.devicePixelRatio > 2 ? 1.5 : window.devicePixelRatio]} ...>
```

### Fix 4 — Convert static pages to RSC
Remove `'use client'` from `/reports` and `/billing` — they have no interactive state and can be server components.

### Fix 5 — Add Open Graph meta
Add `og:title`, `og:description`, `og:image` to layout for enterprise social proof.
