# Design Specification: Enlarge Aurca Logo in Header and Footer

**Date:** 2026-09-19  
**Status:** Approved  
**Target Files:**
- `sections/header.liquid`
- `sections/footer.liquid`
- `tests/verify-logos.js`

---

## 1. Overview & Goal

The current header and footer reference SVG files (`logo-monogram-copper.svg` and `logo-monogram-dark.svg`) which place the Aurca letters inside a 1080×1080 canvas with massive margins. Consequently, within their containers (110×110px in header and 64×64px in footer), the visible logo text is rendered very small (~15px in the header and ~9px in the footer).

The goal is to replace these padded icons with the clean, full-width `logo-wordmark-cream.svg` asset (viewBox `322.22 × 64.75`, fill `#fff`) and size them appropriately so the Aurca logo is prominent, sharp, and luxurious across all viewports.

---

## 2. Changes by Component

### 2.1 Header (`sections/header.liquid`)
- Target: lines ~41-45 (Center Brand Logo container).
- Replace:
  ```liquid
  <a href="{{ routes.root_url }}" class="flex-1 lg:flex-none flex justify-center items-center">
    <img src="{{ 'logo-monogram-copper.svg' | asset_url }}" alt="Aurca — Luxury Homewear" width="110" height="110" class="object-contain flex-shrink-0" style="width: 110px; height: 110px;">
  </a>
  ```
- With:
  ```liquid
  <a href="{{ routes.root_url }}" class="flex-1 lg:flex-none flex justify-center items-center">
    <img src="{{ 'logo-wordmark-cream.svg' | asset_url }}" alt="Aurca — Luxury Homewear" class="h-9 md:h-11 w-auto object-contain flex-shrink-0" style="max-height: 44px;">
  </a>
  ```
- Sizing on mobile: 36px height (`h-9`), ~180px width.
- Sizing on desktop: 44px height (`md:h-11`), ~220px width.

### 2.2 Footer (`sections/footer.liquid`)
- Target: lines ~6-9 (Left Brand Tagline container).
- Replace:
  ```liquid
  <img src="{{ 'logo-monogram-dark.svg' | asset_url }}" alt="Aurca" width="64" height="64"
       class="object-contain mb-4" style="width: 64px; height: 64px;">
  ```
- With:
  ```liquid
  <img src="{{ 'logo-wordmark-cream.svg' | asset_url }}" alt="Aurca" class="h-7 md:h-8 w-auto object-contain mb-4" style="max-height: 32px;">
  ```
- Sizing: 28px height on mobile (`h-7`), 32px height on desktop (`md:h-8`), ~140px to 160px width.

---

## 3. Verification & Testing

1. **Automated Test (`tests/verify-logos.js`):**
   - Check `sections/header.liquid` contains `logo-wordmark-cream.svg`, `h-9`, and `md:h-11`.
   - Check `sections/footer.liquid` contains `logo-wordmark-cream.svg`, `h-7`, and `md:h-8`.
   - Verify neither file references the padded 1080×1080 SVGs (`logo-monogram-copper.svg` or `logo-monogram-dark.svg`).
2. **Build & Live Verification:**
   - Run `npm run build` to compile Tailwind utility classes if necessary.
   - Verify visually via the live dev server at `http://127.0.0.1:9292`.
