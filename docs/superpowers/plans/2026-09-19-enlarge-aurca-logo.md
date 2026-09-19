# Enlarge Aurca Logo in Header and Footer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enlarge and enhance the Aurca logo in both the header and footer by switching from heavily padded 1080×1080 square SVGs to the clean, crisp `logo-wordmark-cream.svg` asset with responsive sizing.

**Architecture:** Update `sections/header.liquid` to render `logo-wordmark-cream.svg` at `h-9 md:h-11` with `max-height: 44px`. Update `sections/footer.liquid` to render `logo-wordmark-cream.svg` at `h-7 md:h-8` with `max-height: 32px`. Validate with a dedicated automated test suite and rebuild Tailwind CSS if needed.

**Tech Stack:** Shopify Liquid, Tailwind CSS v3.4.19, Node.js assert.

## Global Constraints

- Header logo must be clearly legible and prominent on mobile and desktop without overflowing the 110px header bar.
- Footer logo must be clean, crisp, and prominent above the brand tagline without overflowing the footer section.
- Use the existing SVG asset `assets/logo-wordmark-cream.svg` (`viewBox="0 0 322.22 64.75"`).
- Preserve links (`routes.root_url`) and accessibility attributes (`alt="Aurca — Luxury Homewear"` and `alt="Aurca"`).

---

### Task 1: Enlarge Logo in Header and Footer with TDD Verification

**Files:**
- Create: `tests/verify-logos.js`
- Modify: `sections/header.liquid:41-45`
- Modify: `sections/footer.liquid:6-9`

**Interfaces:**
- Consumes: `assets/logo-wordmark-cream.svg`
- Produces: Prominently sized wordmarks in header and footer.

- [ ] **Step 1: Write verification test for enlarged logos**

Create `tests/verify-logos.js`:
```javascript
const fs = require('fs');
const assert = require('assert');

const header = fs.readFileSync('sections/header.liquid', 'utf8');
const footer = fs.readFileSync('sections/footer.liquid', 'utf8');

// 1. Header checks
assert(header.includes("logo-wordmark-cream.svg"), 'Header missing logo-wordmark-cream.svg');
assert(!header.includes("logo-monogram-copper.svg"), 'Header still references padded logo-monogram-copper.svg');
assert(header.includes("h-9") && header.includes("md:h-11"), 'Header missing responsive height classes h-9 md:h-11');

// 2. Footer checks
assert(footer.includes("logo-wordmark-cream.svg"), 'Footer missing logo-wordmark-cream.svg');
assert(!footer.includes("logo-monogram-dark.svg"), 'Footer still references padded logo-monogram-dark.svg');
assert(footer.includes("h-7") && footer.includes("md:h-8"), 'Footer missing responsive height classes h-7 md:h-8');

console.log('PASS: Aurca logo verification successful.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify-logos.js`  
Expected: FAIL with assertion error indicating missing wordmark in header.

- [ ] **Step 3: Update `sections/header.liquid` and `sections/footer.liquid`**

In `sections/header.liquid`:
Replace:
```liquid
      {%- comment -%} Center Brand Monogram Logo (110px x 110px) {%- endcomment -%}
      <a href="{{ routes.root_url }}" class="flex-1 lg:flex-none flex justify-center items-center">
        <img src="{{ 'logo-monogram-copper.svg' | asset_url }}" alt="Aurca — Luxury Homewear" width="110" height="110" class="object-contain flex-shrink-0" style="width: 110px; height: 110px;">
      </a>
```
With:
```liquid
      {%- comment -%} Center Brand Wordmark Logo {%- endcomment -%}
      <a href="{{ routes.root_url }}" class="flex-1 lg:flex-none flex justify-center items-center">
        <img src="{{ 'logo-wordmark-cream.svg' | asset_url }}" alt="Aurca — Luxury Homewear" class="h-9 md:h-11 w-auto object-contain flex-shrink-0" style="max-height: 44px;">
      </a>
```

In `sections/footer.liquid`:
Replace:
```liquid
        <img src="{{ 'logo-monogram-dark.svg' | asset_url }}" alt="Aurca" width="64" height="64"
             class="object-contain mb-4" style="width: 64px; height: 64px;">
```
With:
```liquid
        <img src="{{ 'logo-wordmark-cream.svg' | asset_url }}" alt="Aurca" class="h-7 md:h-8 w-auto object-contain mb-4" style="max-height: 32px;">
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify-logos.js`  
Expected: PASS with "PASS: Aurca logo verification successful."

- [ ] **Step 5: Rebuild Tailwind assets**

Run: `npm run build`  
Expected: Command exits 0 and rebuilds `assets/theme.css`.

- [ ] **Step 6: Live verify on local dev server**

Verify on `http://127.0.0.1:9292` that the header and footer display the larger, sharp Aurca wordmark.
