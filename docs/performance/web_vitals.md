# FiduScan v6.1 — Core Web Vitals

**Date:** 2026-06-06 | **Tag:** v6.1-enterprise-polish

---

## Measured Lighthouse Scores (Live Run)

| Score | Value |
|---|---|
| Performance | **84 / 100** |
| Accessibility | **95 / 100** |
| Best Practices | **100 / 100** |
| SEO | **60 / 100** |

---

## Core Web Vitals Estimates

### Landing Page (`/`)

| Metric | Estimated | Target | Status |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | ~2.2s | < 2.5s | ✓ Pass |
| **CLS** (Cumulative Layout Shift) | < 0.05 | < 0.1 | ✓ Pass |
| **INP** (Interaction to Next Paint) | < 80ms | < 200ms | ✓ Pass |
| **FCP** (First Contentful Paint) | ~0.8s | < 1.8s | ✓ Pass |
| **TTI** (Time to Interactive) | ~3.1s | < 3.8s | ✓ Pass |

> LCP element: Hero headline text (`<h1>Verify. Authenticate. Anchor.`). The 3D canvas renders below LCP threshold — correct.

### Inner App Routes (`/dashboard`, `/evidence`, etc.)

| Metric | Estimated | Target | Status |
|---|---|---|---|
| **LCP** | ~0.7s | < 2.5s | ✓ Excellent |
| **CLS** | ~0.01 | < 0.1 | ✓ Excellent |
| **INP** | < 50ms | < 200ms | ✓ Excellent |
| **FCP** | ~0.4s | < 1.8s | ✓ Excellent |

Inner routes are statically pre-rendered — navigation is near-instant.

---

## SEO Gap Analysis (Score: 60 — Critical)

### Missing Items

| Item | Fix |
|---|---|
| ❌ `<meta name="description">` missing on `/dashboard`, `/evidence`, `/watermark`, etc. | Add per-page metadata in each `page.tsx` |
| ❌ Open Graph tags (`og:title`, `og:description`, `og:image`) absent | Add to root `layout.tsx` with page-specific overrides |
| ❌ `<link rel="canonical">` not present | Add to layout |
| ❌ Inner app routes have title "FiduScan Platform" (generic) | Use Next.js `generateMetadata()` per route |
| ✅ Semantic HTML structure (h1, nav, main, aside) | Already correct from v6.1 |
| ✅ `lang="en"` on `<html>` | Already set |

### v6.2 SEO Fix (5-minute implementation)

```tsx
// layout.tsx — root metadata
export const metadata = {
  title: { template: '%s | FiduScan', default: 'FiduScan — Digital Forensic Intelligence' },
  description: 'Enterprise forensic platform for deepfake detection, digital watermarking, and immutable evidence chains.',
  openGraph: {
    siteName: 'FiduScan',
    type: 'website',
    locale: 'en_US',
  },
  robots: { index: false, follow: false } // Private platform — prevent indexing of app routes
}

// dashboard/page.tsx
export const metadata = { title: 'Dashboard' }

// evidence/page.tsx
export const metadata = { title: 'Evidence Vault' }
```

---

## Accessibility Score: 95 ✓

Achieved via v6.1 polish sprint. Remaining gap:

| Item | Issue | Fix |
|---|---|---|
| Color contrast on `--fs-text-3` | `rgba(255,255,255,0.28)` on dark background = 2.8:1 (fails WCAG AA for small text) | Increase to `rgba(255,255,255,0.40)` = 4.1:1 |
| Upload zone missing `role="button"` | Div used as interactive drop target | Add `role="button"` + `tabIndex={0}` |

---

## Performance Roadmap to Score 90+

| Action | Estimated Gain | Effort |
|---|---|---|
| `requestIdleCallback` gate on HeroScene | +6 Performance | 1hr |
| `frameloop="demand"` on R3F Canvas | +3 Performance | 15min |
| Fix SEO meta tags | +30 SEO | 1hr |
| Fix `--fs-text-3` contrast | +2 Accessibility | 15min |
| Add `role="button"` to upload zone | +1 Accessibility | 15min |
| Convert `/reports` + `/billing` to RSC | +3 Performance | 4hrs |

**Projected v6.2 scores after fixes:**

| Category | Current | Projected |
|---|---|---|
| Performance | 84 | **92** |
| Accessibility | 95 | **98** |
| Best Practices | 100 | **100** |
| SEO | 60 | **92** |
