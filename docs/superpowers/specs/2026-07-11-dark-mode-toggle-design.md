# Dark Mode Toggle — Design

Finishes design.md §6. The palette (`src/vars.css` `.dark` block), `darkMode: 'class'`,
the before-paint script reading `localStorage['hestia:appearance']` + the
light/dark/system merchant setting, and the `dark:invert` header logo already exist.
Sections use flipping tokens, so the site inverts once `.dark` is set. Fixed brand
colors (sold-out badge, terracotta CTA, beige/30 summary card) are mode-invariant by
design and stay.

## Changes

1. **Header toggle button** (`sections/header.liquid`) — Material Symbols button in the
   icon row with `data-theme-toggle`; icon swaps via CSS (`dark:hidden` /
   `hidden dark:inline` spans for `dark_mode`/`light_mode`). Localized aria-label.
2. **Handler** (`assets/theme.js`) — click flips `.dark` on `<html>`, writes
   `light`/`dark` to `localStorage['hestia:appearance']` (overrides merchant setting
   per browser), updates `theme-color` meta.
3. **`theme-color` meta** (`layout/theme.liquid`) — before-paint script sets it to
   charcoal `#2D2D2D` when dark is active so mobile browser chrome matches.
4. **Build & verify** — `npm run build`; visual check against `*_dark_mode/screen.png`.

## Out of scope

Per-mode logo pickers (invert covers it), toggle animation, cross-tab sync.
