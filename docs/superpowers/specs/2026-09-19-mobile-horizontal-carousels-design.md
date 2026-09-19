# Design Specification: Mobile Horizontal Smooth Carousels

**Date:** 2026-09-19  
**Status:** Approved  
**Target Files:**
- `sections/featured-products.liquid`
- `sections/testimonial.liquid`
- `assets/theme.js`

---

## 1. Overview & Goal

Currently, the homepage's **Featured Pieces** section renders as a 2-column vertical grid on mobile (`grid grid-cols-2`), and the **What Our Customers Say** (Testimonial) section stacks cards vertically in a 1-column grid (`grid grid-cols-1`).

The goal is to convert both sections on mobile (`< md` breakpoint) into smooth, touch-friendly horizontal carousels with native CSS scroll snap and peeking preview cards. On desktop (`md:` and above), both sections must seamlessly preserve their clean 3-column static grid layouts.

---

## 2. Technical Architecture & Approach

We use **Native CSS Scroll-Snap** powered by Tailwind utility classes:
- **No external JS carousel library:** 100% hardware-accelerated, lightweight, zero runtime dependency overhead.
- **Peek UX:** Cards on mobile are sized (`72vw` for products, `82vw` for testimonials) so that the subsequent card peeks out on the right edge of the viewport. This provides an immediate, intuitive cue for horizontal touch-swiping.
- **Edge bleed with container alignment:** Using negative margins and matching padding (`-mx-6 px-6 md:mx-0 md:px-0`) allows the scroll track to extend cleanly to screen edges without clipping shadows or content, while keeping the first item perfectly aligned with the page container margin.
- **Scrollbar suppression:** Utilizes the existing `.no-scrollbar` Tailwind utility.

---

## 3. Section Specifications

### 3.1 Featured Pieces (`sections/featured-products.liquid`)

#### Container:
- Replace:
  ```html
  <div data-featured-grid class="grid grid-cols-2 md:grid-cols-3 gap-5 lg:gap-8">
  ```
- With:
  ```html
  <div data-featured-grid class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar md:grid md:grid-cols-3 gap-5 lg:gap-8 pb-4 -mx-6 px-6 md:mx-0 md:px-0">
  ```

#### Product Card Item:
- Current classes:
  `product-card-item group relative flex flex-col justify-between ...`
- Update card classes to include mobile sizing and snap alignment:
  `product-card-item group relative flex flex-col justify-between w-[72vw] sm:w-[48vw] md:w-auto shrink-0 snap-start ...`
- This ensures:
  - Mobile (`< sm`): Card occupies `72vw`, leaving ~28vw for the next card peek.
  - Small tablet (`sm` to `md`): Card occupies `48vw` (2 cards visible).
  - Desktop (`md+`): Width resets to `auto` and `shrink-0` is neutralized inside the CSS grid.

#### Filtering Behavior (`assets/theme.js`):
- In `applyFilter(tabName)`:
  When switching collection tabs (e.g., "All", "Sets", "Robes"), query `[data-featured-grid]` and reset scroll position:
  ```javascript
  const featuredGrid = document.querySelector('[data-featured-grid]');
  if (featuredGrid) {
    featuredGrid.scrollTo({ left: 0, behavior: 'smooth' });
  }
  ```

---

### 3.2 Customer Testimonials (`sections/testimonial.liquid`)

#### Container:
- Replace:
  ```html
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  ```
- With:
  ```html
  <div class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar md:grid md:grid-cols-3 gap-4 pb-4 -mx-6 px-6 md:mx-0 md:px-0">
  ```

#### Testimonial Card Item:
- Inside `{% for block in section.blocks %}`:
- Current card container:
  ```html
  <div class="bg-surface-elevated/40 border border-brand-charcoal/10 rounded-2xl p-7 flex flex-col justify-between hover:border-brand-accent/40 transition-colors duration-300">
  ```
- Update with mobile width and snap alignment:
  ```html
  <div class="w-[82vw] sm:w-[60vw] md:w-auto shrink-0 snap-start bg-surface-elevated/40 border border-brand-charcoal/10 rounded-2xl p-7 flex flex-col justify-between hover:border-brand-accent/40 transition-colors duration-300">
  ```

---

## 4. Verification & Testing Strategy

1. **Build Verification:** Run `npm run build` to confirm Tailwind CSS compiles all new classes (`w-[72vw]`, `w-[82vw]`, etc.) without syntax issues.
2. **Layout & Responsiveness Inspection:**
   - Verify mobile view (`< 768px`):
     - Scroll containers have `overflow-x-auto`, `flex`, `snap-x`, `scroll-smooth`.
     - Individual cards have `shrink-0` and `snap-start`.
     - First card aligns to left padding; subsequent cards peek on the right.
   - Verify desktop view (`>= 768px`):
     - Displays exactly 3 columns in a grid.
     - `w-auto` takes precedence, disabling flex shrink and horizontal scrolling.
3. **JS Filter Verification:**
   - Filter tab change scrolls the grid back to `0` smoothly.
