# Mobile Horizontal Carousels Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the homepage's Featured Pieces and Customer Testimonials sections into smooth, peeking horizontal carousels on mobile devices while maintaining the 3-column static grid on desktop.

**Architecture:** Utilize native CSS scroll-snap (`overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar`) with card peek widths (`w-[72vw]` for products, `w-[82vw]` for testimonials) and negative bleed margins (`-mx-6 px-6 md:mx-0 md:px-0`), falling back to standard Tailwind CSS grid on `md:` breakpoints (`md:grid md:grid-cols-3`). Reset scroll position to 0 upon tab filter changes in JavaScript.

**Tech Stack:** Shopify Liquid, Tailwind CSS v3.4.19, Vanilla JavaScript (ES6).

## Global Constraints

- Desktop view (`md:` breakpoint and above) must remain a 3-column grid untouched visually.
- Zero external carousel libraries (no Swiper, Slick, or Flickity); rely strictly on native CSS scroll-snap.
- Support smooth touch dragging with peeking next-card preview on mobile screens.
- Hide scrollbars using `.no-scrollbar`.
- Reset Featured Products carousel scroll to 0 when category filter tabs are clicked.

---

### Task 1: Mobile Horizontal Carousel for Featured Products

**Files:**
- Modify: `sections/featured-products.liquid:26-465`
- Modify: `assets/theme.js:725-730`
- Test: `tests/verify-featured-carousel.js`

**Interfaces:**
- Consumes: Existing `.product-card-item` elements and `[data-featured-grid]` container.
- Produces: CSS scroll-snap horizontal container on mobile with peek cards, and JS scroll-reset on tab filtering.

- [ ] **Step 1: Write verification test for Featured Products mobile carousel**

Create `tests/verify-featured-carousel.js`:
```javascript
const fs = require('fs');
const assert = require('assert');

const liquid = fs.readFileSync('sections/featured-products.liquid', 'utf8');
const js = fs.readFileSync('assets/theme.js', 'utf8');

// 1. Check container has mobile flex + scroll-snap + no-scrollbar + desktop md:grid
const containerMatch = liquid.match(/<div data-featured-grid class="([^"]+)">/);
assert(containerMatch, 'featured-grid container not found');
const containerClass = containerMatch[1];
assert(containerClass.includes('overflow-x-auto'), 'Missing overflow-x-auto');
assert(containerClass.includes('snap-x'), 'Missing snap-x');
assert(containerClass.includes('snap-mandatory'), 'Missing snap-mandatory');
assert(containerClass.includes('scroll-smooth'), 'Missing scroll-smooth');
assert(containerClass.includes('no-scrollbar'), 'Missing no-scrollbar');
assert(containerClass.includes('md:grid'), 'Missing md:grid');
assert(containerClass.includes('md:grid-cols-3'), 'Missing md:grid-cols-3');
assert(containerClass.includes('-mx-6 px-6 md:mx-0 md:px-0'), 'Missing edge bleed margins');

// 2. Check product cards have mobile peek width and snap-start
const cardMatches = liquid.match(/class="[^"]*product-card-item[^"]*"/g);
assert(cardMatches && cardMatches.length === 12, `Expected 12 product cards, found ${cardMatches ? cardMatches.length : 0}`);
cardMatches.forEach((cls, idx) => {
  assert(cls.includes('w-[72vw]'), `Card ${idx + 1} missing w-[72vw]`);
  assert(cls.includes('shrink-0'), `Card ${idx + 1} missing shrink-0`);
  assert(cls.includes('snap-start'), `Card ${idx + 1} missing snap-start`);
  assert(cls.includes('md:w-auto'), `Card ${idx + 1} missing md:w-auto`);
});

// 3. Check theme.js resets scroll to 0 in applyFilter
assert(js.includes("data-featured-grid"), 'theme.js missing data-featured-grid query');
assert(js.includes("scrollTo({ left: 0"), 'theme.js missing scrollTo reset');

console.log('PASS: Featured Products mobile carousel verification successful.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify-featured-carousel.js`  
Expected: FAIL with assertion error indicating missing classes.

- [ ] **Step 3: Update `sections/featured-products.liquid` and `assets/theme.js`**

In `sections/featured-products.liquid`:
Change:
```html
    <div data-featured-grid class="grid grid-cols-2 md:grid-cols-3 gap-5 lg:gap-8">
```
To:
```html
    <div data-featured-grid class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar md:grid md:grid-cols-3 gap-5 lg:gap-8 pb-4 -mx-6 px-6 md:mx-0 md:px-0">
```

Update each of the 12 product card divs:
Change:
```html
      <div class="group cursor-pointer product-card-item" ...>
```
and
```html
      <div class="group cursor-pointer product-card-item hidden" ...>
```
To include: `w-[72vw] sm:w-[48vw] md:w-auto shrink-0 snap-start`:
```html
      <div class="group cursor-pointer product-card-item w-[72vw] sm:w-[48vw] md:w-auto shrink-0 snap-start" ...>
```
and for the initially hidden ones:
```html
      <div class="group cursor-pointer product-card-item hidden w-[72vw] sm:w-[48vw] md:w-auto shrink-0 snap-start" ...>
```

In `assets/theme.js` inside `applyFilter(tabName)`:
Add:
```javascript
      if (loadMoreBtn) {
        loadMoreBtn.hidden = matchCount <= visibleCount;
      }

      const featuredGrid = document.querySelector('[data-featured-grid]');
      if (featuredGrid) {
        featuredGrid.scrollTo({ left: 0, behavior: 'smooth' });
      }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify-featured-carousel.js`  
Expected: PASS with "Featured Products mobile carousel verification successful."

- [ ] **Step 5: Commit**

```bash
git add sections/featured-products.liquid assets/theme.js tests/verify-featured-carousel.js
git commit -m "feat: add mobile smooth horizontal carousel to featured products"
```

---

### Task 2: Mobile Horizontal Carousel for Customer Testimonials

**Files:**
- Modify: `sections/testimonial.liquid:21-68`
- Test: `tests/verify-testimonials-carousel.js`

**Interfaces:**
- Consumes: Testimonials container and card items in `sections/testimonial.liquid`.
- Produces: CSS scroll-snap horizontal container on mobile with peeking review cards, preserving desktop 3-column grid.

- [ ] **Step 1: Write verification test for Testimonials mobile carousel**

Create `tests/verify-testimonials-carousel.js`:
```javascript
const fs = require('fs');
const assert = require('assert');

const liquid = fs.readFileSync('sections/testimonial.liquid', 'utf8');

// 1. Check container has mobile flex + scroll-snap + no-scrollbar + desktop md:grid
assert(liquid.includes('flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar md:grid md:grid-cols-3 gap-4 pb-4 -mx-6 px-6 md:mx-0 md:px-0'), 'Testimonial container classes missing or incorrect');

// 2. Check 3 review cards have mobile peek width and snap-start
const cardMatches = liquid.match(/class="[^"]*w-\[82vw\][^"]*"/g);
assert(cardMatches && cardMatches.length === 3, `Expected 3 cards with w-[82vw], found ${cardMatches ? cardMatches.length : 0}`);
cardMatches.forEach((cls, idx) => {
  assert(cls.includes('shrink-0'), `Testimonial card ${idx + 1} missing shrink-0`);
  assert(cls.includes('snap-start'), `Testimonial card ${idx + 1} missing snap-start`);
  assert(cls.includes('md:w-auto'), `Testimonial card ${idx + 1} missing md:w-auto`);
});

console.log('PASS: Testimonials mobile carousel verification successful.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify-testimonials-carousel.js`  
Expected: FAIL with assertion error.

- [ ] **Step 3: Update `sections/testimonial.liquid`**

In `sections/testimonial.liquid`:
Change:
```html
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
```
To:
```html
    <div class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar md:grid md:grid-cols-3 gap-4 pb-4 -mx-6 px-6 md:mx-0 md:px-0">
```

For each of the 3 review cards (Review 1: Isabelle M., Review 2: Amara L., Review 3: Sofia R.):
Change:
```html
      <div class="px-6 py-5 bg-[#FAF8F5] dark:bg-[#242424] transition-colors duration-300">
```
To:
```html
      <div class="w-[82vw] sm:w-[60vw] md:w-auto shrink-0 snap-start px-6 py-5 bg-[#FAF8F5] dark:bg-[#242424] transition-colors duration-300">
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify-testimonials-carousel.js`  
Expected: PASS with "Testimonials mobile carousel verification successful."

- [ ] **Step 5: Commit**

```bash
git add sections/testimonial.liquid tests/verify-testimonials-carousel.js
git commit -m "feat: add mobile smooth horizontal carousel to customer testimonials"
```

---

### Task 3: Build Tailwind CSS Assets & End-to-End Verification

**Files:**
- Modify: `assets/theme.css` (via build)
- Test: `tests/verify-all.js`

**Interfaces:**
- Consumes: Updated `.liquid` files.
- Produces: Compiled `assets/theme.css` including newly generated utilities (`w-[72vw]`, `w-[82vw]`, `w-[48vw]`, `w-[60vw]`).

- [ ] **Step 1: Write end-to-end verification script**

Create `tests/verify-all.js`:
```javascript
const fs = require('fs');
const assert = require('assert');
const { execSync } = require('child_process');

console.log('Verifying featured carousel...');
require('./verify-featured-carousel.js');

console.log('Verifying testimonials carousel...');
require('./verify-testimonials-carousel.js');

console.log('Verifying compiled CSS assets...');
const css = fs.readFileSync('assets/theme.css', 'utf8');
assert(css.includes('72vw'), 'assets/theme.css missing 72vw utility');
assert(css.includes('82vw'), 'assets/theme.css missing 82vw utility');

console.log('ALL VERIFICATIONS PASSED SUCCESSFULLY.');
```

- [ ] **Step 2: Run build to compile Tailwind CSS**

Run: `npm run build`  
Expected: Command exits with 0 and builds `assets/theme.css`.

- [ ] **Step 3: Run end-to-end verification script**

Run: `node tests/verify-all.js`  
Expected: PASS with "ALL VERIFICATIONS PASSED SUCCESSFULLY."

- [ ] **Step 4: Commit and push changes**

```bash
git add assets/theme.css tests/verify-all.js
git commit -m "build: compile tailwind assets with mobile carousel utilities"
```
