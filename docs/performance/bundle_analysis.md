# FiduScan v6.1 — Bundle Analysis

**Date:** 2026-06-06 | **Build Tool:** Next.js 16.2.6 Turbopack

---

## Static Bundle Output

**Total `.next/static/` size:** 1.7 MB (uncompressed)
**Chunk count:** 22 JS chunks

### Top Chunks by Size

| Chunk | Size (uncompressed) | Identity |
|---|---|---|
| `12.997hrp8ifr.js` | **866 KB** | Three.js + R3F + Drei (vendor) |
| `07lhk_q6pmm3r.js` | 222 KB | React runtime + Next.js framework |
| `02g3221oh~3le.js` | 147 KB | Lucide icons tree-shaken bundle |
| `03~yq9q893hmn.js` | 110 KB | App route chunks (all pages) |
| `0d3shmwh5_nmn.js` | 53 KB | Watermark/Evidence page logic |
| `07uz2g0_38qia.js` | 43 KB | Dashboard + Investigations |
| `0jmyi~0j52dfm.js` | 24 KB | Shared layout + CSS vars |
| All other chunks | ~140 KB | Misc polyfills, router |

---

## Library Weight Analysis

| Library | node_modules size | Estimated gzip contribution |
|---|---|---|
| `three` | 38 MB (source) | ~580 KB gzip |
| `@react-three/fiber` | 3.2 MB | ~45 KB gzip |
| `@react-three/drei` | 1.9 MB | ~35 KB gzip |
| `framer-motion` | 2.1 MB | ~32 KB gzip |
| `lucide-react` | ~8 MB (tree-shaken) | ~40 KB gzip |
| `next` + `react` | — | ~130 KB gzip |

**Total estimated gzip transfer for landing page:** ~870 KB
**Total estimated gzip transfer for inner app routes (no Three.js):** ~220 KB

---

## Route-Level Bundle Isolation

| Route | Three.js Loaded? | Estimated JS (gzip) | Grade |
|---|---|---|---|
| `/` (landing) | ✅ Yes (lazy via dynamic) | ~870 KB | C (3D tax) |
| `/dashboard` | ❌ No | ~200 KB | A |
| `/investigations` | ❌ No | ~215 KB | A |
| `/evidence` | ❌ No | ~210 KB | A |
| `/watermark` | ❌ No | ~195 KB | A |
| `/reports` | ❌ No | ~190 KB | A |
| `/developer` | ❌ No | ~195 KB | A |
| `/billing` | ❌ No | ~185 KB | A |
| `/settings` | ❌ No | ~190 KB | A |

✅ **Three.js is correctly isolated** — it only loads on the `/` landing route. The inner forensic app has no 3D tax.

---

## Client vs Server Components

| Route | `'use client'`? | Can be RSC? | Impact if converted |
|---|---|---|---|
| `/` | ✅ Yes | ❌ No (hooks, 3D) | N/A |
| `/dashboard` | ✅ Yes | Partial | Save ~20KB hydration |
| `/reports` | ✅ Yes | ✅ Yes | Save ~35KB hydration |
| `/billing` | ✅ Yes | ✅ Yes | Save ~30KB hydration |
| `/developer` | ✅ Yes | Partial | Save ~25KB on tab-switch |
| `/investigations` | ✅ Yes | ❌ No (heavy state) | N/A |
| `/evidence` | ✅ Yes | ❌ No (selection state) | N/A |
| `/watermark` | ✅ Yes | ❌ No (drag-drop, forms) | N/A |

**v6.2 Recommendation:** Convert `/reports` and `/billing` to React Server Components for the initial shell render, hydrate only interactive sub-components.

---

## Optimization Opportunities

### Quick Wins (< 1 day each)

1. **`frameloop="demand"` on R3F Canvas** — Stops continuous GPU re-renders when user isn't interacting. Saves 30–60% GPU cycles.
2. **`requestIdleCallback` gate on HeroScene mount** — Defers Three.js until browser is idle after FCP. Estimated +8–12 Lighthouse Performance points.
3. **`dpr={[1, 1.5]}` cap** — Prevents 3x DPR mobile screens from rendering at 2x (current cap). Saves ~40% GPU pixels on modern phones.
4. **Add `<link rel="preconnect" href="https://fonts.googleapis.com">`** — Reduces Google Fonts latency by ~150ms.

### Medium Effort (1–2 days each)

5. **Convert `/reports` + `/billing` to RSC** — Reduces hydration JS payload by ~65KB.
6. **Dynamic import Lucide icons per-page** — Currently the full icon set tree-shakes to ~40KB, but explicit dynamic imports could cut this further.
7. **Add `loading.tsx` skeleton screens** — Improves perceived performance with instant skeleton on route change.
