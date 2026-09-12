# Aurca Rebrand — Design

Rebrand this theme (currently "Hestia") to **Aurca**, a luxury home-wear/pyjamas brand,
matching the reference site at https://strong-chef-63840685.figma.site/. Same store,
same product catalog — this is identity + homepage redesign, not a new shop.

Reference captured 2026-09-12: homepage copy (`/tmp` scratchpad transcript), 6 section
screenshots, full CSS palette check, and all 36 files in `aurca assets/` inspected by
viewBox/fill (they're outlined vector paths, not live text — original wordmark font
`Bagnard` isn't needed as a webfont).

## 1. Design tokens

The theme already generates `src/vars.css` from `gen-vars.js` (Material-3-style token
set, light + dark, single source of truth) — reuse this pipeline, don't hand-edit
`vars.css`. Update the `light`, `dark`, and `brand` hex objects in `gen-vars.js`:

| Token | Current (Hestia) | New (Aurca) | Source |
|---|---|---|---|
| `brand.terracotta` (primary/CTA) | `#C97B63` | `#a87052` | 11/36 asset fills — primary clay |
| `brand.charcoal` / dark surface | `#2D2D2D` | `#2d2e2d` | near-identical, trivial swap |
| `brand.cream` / background | `#F8F3EE` | `#f8f6f1` | asset fill |
| `brand.beige` | `#DCC9B6` | `#e5d7cd` | asset fill |
| `brand.warm-brown` | `#6F5648` | `#97606c` (dusty rose) | secondary accent, 5 uses |
| `brand.sage` | `#A9B29B` | drop or repurpose as `#494d57` (slate) | Aurca palette has no green |
| new: badge/sale accent | — | `#4a1a28` / `#472e30` (dark maroon) | matches on-site Bestseller/Limited badges |

Light/dark maps otherwise keep their existing structural relationships (surface,
on-surface, outline, etc.), just re-anchored to the new hex values — dark mode
(`.dark` class, `data-theme-toggle`, `localStorage['hestia:appearance']`, merchant
light/dark/system setting) is already fully built per
`docs/superpowers/specs/2026-07-11-dark-mode-toggle-design.md` and needs no new
mechanism, only new token values. Ship both light and dark palettes.

After editing `gen-vars.js`: `node gen-vars.js && npm run build`.

## 2. Fonts

- `font-display` (italic accent headlines) → **Cormorant Garamond** — already
  self-hosted in `assets/`, no change.
- `font-heading` (section titles, currently DM Sans via tailwind heading utilities)
  → add **Playfair Display** (Google Fonts `<link>` in `layout/theme.liquid`,
  alongside the existing DM Sans/Material Symbols links).
- Body font: swap the Google Fonts `DM+Sans` link to **Inter**; update
  `tailwind.config.js` `fontFamily` accordingly.
- `Bagnard` (logo wordmark's original typeface) is NOT added — logo art ships as
  outlined SVG paths, matching how the asset files already exist.

## 3. Logo & asset mapping

`aurca assets/*.svg` sorted by inspection (viewBox/fill), to be renamed into
`assets/` during implementation:
- Wordmark lockup (viewBox `322.22 64.75`): Asset 1 (white), Asset 3 & 5 (clay) →
  `logo-wordmark-cream.svg` / `logo-wordmark-clay.svg` replacing current PNGs.
- Square monogram (viewBox `213.34 213.34` and `1080×1080`): Assets 6/8/10/19 and
  2/4/7/9/39 → `logo-monogram.svg` (+ color variants), replacing
  `logo-monogram.png` / `logo-monogram-cream-bg.png`.
- Assets 22–30 (small text-lockup variants, live `font-family` text) — reference only,
  not shipped (would need the Bagnard font).
- Remaining assets (13,14,17,18,20,21,26,32-35) are lifestyle/pattern art — mapped
  ad hoc to hero/lookbook imagery slots as implementation proceeds; not pre-assigned.

## 4. Homepage sections (existing `sections/*.liquid` map ~1:1 to the reference)

| Reference section | File | Changes |
|---|---|---|
| Announcement bar | new partial in `header.liquid` or new snippet | "Free shipping over $150 · Complimentary gift wrapping · 30-day returns" strip above header |
| Header/nav | `header.liquid` | Women / Men / Together / Lookbook nav, centered wordmark, existing search/account/wishlist/cart/dark-toggle icons kept; currency selector added (§5); no language switcher (§5) |
| Hero | `slider.liquid` | Re-skin to new copy/imagery ("Refined comfort, without compromise.", "Dressed for the Hours Between", etc.), italic accent word styling via `font-display` |
| Trust marquee | `brand-banner.liquid` | New copy: Free Shipping / Handcrafted With Love / New Arrivals Weekly / Ethically Sourced / Gift Wrapping / Free Returns |
| Shop by Collection | `category-bento.liquid` | 3 cards Women/Men/Together, badge tags (New Arrivals/Limited Edition), "The Feminine Edit"-style eyebrow copy |
| Featured Pieces | `featured-products.liquid` | Filter pills (All/Women/Men/Together), badges (Bestseller/New/-20%/Together), color swatches, Load More / View All — pulls from real Shopify product data, not hardcoded |
| Testimonials | `testimonial.liquid` | 3 quotes + name/city + star rating, copy pulled verbatim from reference |
| Instagram/UGC grid | **new section** `instagram-grid.liquid` | "Life in Aurca" masonry grid, doesn't exist in current theme |
| Footer | `footer.liquid` | Newsletter bar, 3 link columns (Collections/Company/Help), payment icons, socials, "Est. 2018" tagline |

Non-homepage pages (product, cart, collection listing, account, etc.) get new
tokens/fonts/logo only — layout unchanged; the reference has no other pages designed.

## 5. Functional scope for header controls

- **Dark mode toggle**: already wired (§1); only token values change.
- **Currency selector**: implement via Shopify's native `{% form 'localization' %}` /
  Markets — this makes prices actually convert via real exchange rates. Requires the
  merchant (you) to enable and configure Markets/currencies in Shopify admin; the
  theme-side form works against whatever markets are configured there. Flagged as an
  admin-side dependency, not a code gap.
- **Language switcher**: dropped from this pass — English only, no Arabic strings or
  RTL layout. Remove the `عربي` control from the header rather than ship it inert.

## Out of scope
- New product/collection data model — same catalog.
- Arabic translation/RTL (see §5).
- Licensing/embedding the `Bagnard` display font.
