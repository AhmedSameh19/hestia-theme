# Plan: Fully functional HESTIA store (home, collection w/ filters, product, checkout, dummy data)

## Global Constraints

- Theme root: `/mnt/hdd/Untitled Folder/hestia-theme`. All work happens there.
- The design tokens are frozen: brand colors Calmness `#F8F3EE`, Comfort `#DCC9B6`, Warmth `#C97B63`, Home `#6F5648`, Sage `#A9B29B`, Charcoal `#2D2D2D`; headline font Cormorant Garamond; body DM Sans. Do not restyle.
- Markup uses Tailwind utility classes compiled by `npm run build` → `assets/theme.css`. Any Liquid markup change MUST be followed by `npm run build` and the rebuilt `assets/theme.css` committed.
- `shopify theme check` must report 0 errors after each task.
- No Admin API access exists. Store data (products) must be delivered as a Shopify product CSV the merchant imports, NOT via API calls.
- Store: hestia-home-wear.myshopify.com. Shopify CLI is authenticated for THEME commands only.
- Network: Node fetch requires `NODE_OPTIONS="--dns-result-order=ipv4first"` (broken IPv6 on this machine).
- Commit after each task with a descriptive message.

## Task 1: Dummy product data package

Create `store-data/products.csv` (Shopify product CSV import format) plus `store-data/SETUP.md`.

**products.csv** — 10 products matching the mockup catalog. Format: standard Shopify CSV columns (Handle, Title, Body (HTML), Vendor, Product Category, Type, Tags, Published, Option1 Name, Option1 Value, Option2 Name, Option2 Value, Variant SKU, Variant Grams, Variant Inventory Tracker, Variant Inventory Qty, Variant Inventory Policy, Variant Fulfillment Service, Variant Price, Variant Compare At Price, Variant Requires Shipping, Variant Taxable, Image Src, Image Position, Status).

Products (title / price / type / tags / options):
1. Pure Silk Slip / 240.00 / Sleepwear / fabric:Silk, color:Champagne / Color(Champagne, Terracotta, Charcoal) × Size(XS,S,M,L,XL)
2. Silk Robe / 320.00 / Robes / fabric:Silk, color:Charcoal / Size(S,M,L)
3. Silk Pajama Set / 450.00 / Sleepwear / fabric:Silk, color:Sage / Size(XS,S,M,L)
4. Silk Camisole / 120.00 compare-at 160.00 (sale) / Sleepwear / fabric:Silk, color:Terracotta / Size(S,M,L)
5. Silk Sleep Mask / 45.00 / Accessories / fabric:Silk / single variant
6. Silk Shorts / 95.00 / Sleepwear / fabric:Silk, color:Ivory / Size(S,M,L)
7. Organic Linen Set / 185.00 / Loungewear / fabric:Linen, color:Sand / Size(S,M,L)
8. Waffle Knit Robe / 120.00 / Robes / fabric:Cotton, color:Charcoal / Size(S,M,L)
9. Cashmere Essential / 295.00 / Loungewear / fabric:Cashmere, color:Taupe / Size(S,M,L)
10. Linen Throw / 85.00 / Home / fabric:Linen / single variant

Rules:
- Every product also gets tag `new-arrivals`, silk products get tag `silk`.
- Image Src: use these public mockup image URLs (one per product, first 10 in order). They are in the HTML mockups under `/mnt/hdd/Untitled Folder/stitch_hestia_home_wear_theme/*/code.html` — extract real `https://lh3.googleusercontent.com/aida-public/...` URLs from those files (grep them), one distinct URL per product.
- Variant rows: first row carries product fields; additional variant rows carry Handle + option values + variant fields only.
- Inventory: qty 25 per variant, policy deny, fulfillment manual, tracker shopify. Make ONE size (Pure Silk Slip / XL / Champagne only) qty 0 to exercise sold-out UI.
- Body (HTML): 1-2 sentence luxe description per product, valid HTML `<p>`.

**SETUP.md** — exact click-path admin steps, in order:
1. Import CSV (Products → Import).
2. Create automated collections: "The Silk Collection" (handle `silk`, rule: tag equals silk), "New Arrivals" (handle `new-arrivals`, rule: tag equals new-arrivals), "Sleepwear" (product type), "Loungewear" (product type), "Robes" (product type).
3. Navigation: main-menu = Shop (/collections/all), Collections (/collections), About (/pages/about), Journal (/blogs/news). Footer menu links.
4. Search & Discovery app: install (free, by Shopify), Filters → add Availability, Price, Color, Size, Fabric-tag. Note: until this is done the theme falls back to tag filtering (Task 2).
5. Payments: enable "Bogus Gateway" test provider (Settings → Payments → activate a test payment provider) so checkout can be tested end to end with card number 1.

Verify CSV integrity: column count consistent on every row, no unescaped commas/quotes (write a tiny python check inline, run it, show output).

Commit: `store-data: dummy product CSV + admin setup guide`.

## Task 2: Theme functional fixes

All in the theme root; markup changes → `npm run build` → commit rebuilt CSS too.

2a. `templates/index.json`: featured-products section gets `"settings": { "collection": "new-arrivals" }` merged with existing defaults. `templates/cart.json`: recommendations section gets `"collection": "all"` added to its settings.

2b. `sections/main-collection.liquid`: today the sidebar renders `collection.filters` (Search & Discovery) or a "no filters" note. Add a native tag fallback so filtering works without the app: when `collection.filters` is empty and `collection.all_tags` is non-empty, render filter groups from tags. Tags use `group:Value` convention (`fabric:Silk`, `color:Champagne`). Group them by prefix (`fabric` → "Fabric", `color` → "Color"); tags without a prefix are skipped. Each tag renders as a link — active tag links to the collection URL without the tag (toggle off), inactive tag links to `{{ collection.url }}/{{ tag | handle }}`. Highlight the active tag (`current_tags`). Shopify natively supports one active tag per collection URL — that's the accepted ceiling of this fallback; note it with a `ponytail:` comment.
Also: the tag labels must display without their prefix (show "Silk", not "fabric:Silk") — use `| split: ':' | last`.

2c. Sold-out UX on product card: in `snippets/product-card.liquid`, if product is not available, show a charcoal "Sold out" pill in place of the sale badge.

2d. Run `shopify theme check` — must be 0 errors. Run `npm run build`. Commit: `theme: default collections, tag-filter fallback, sold-out badge`.

## Task 3: End-to-end verification against the live dev store

Prereq: tasks 1-2 done. The merchant may not have imported the CSV yet — verify what is verifiable and produce a clear PASS/BLOCKED-on-import report per item.

1. Start `NODE_OPTIONS="--dns-result-order=ipv4first" shopify theme dev --store hestia-home-wear.myshopify.com --theme-editor-sync` in the background from the theme root; wait for the local URL (http://127.0.0.1:9292).
2. `curl -s http://127.0.0.1:9292/` — assert: hero heading present, featured-products section present, carousel prev/next buttons (`data-carousel-prev`) present, footer wordmark img present, `theme.css` and `theme.js` linked.
3. `curl -s http://127.0.0.1:9292/collections/all` — assert: product grid markup present; if products exist, product-card anchors present; sidebar renders either S&D filters or the tag fallback.
4. If a product exists: curl its URL — assert variant radios (`data-option-index`), add-to-cart button, accordions.
5. `curl -s http://127.0.0.1:9292/cart` — assert cart renders (empty state or items), checkout button `name="checkout"` present.
6. JS sanity: `node --check assets/theme.js`.
7. Kill the dev server. Write findings to the report: table of checks → PASS / FAIL / BLOCKED (needs CSV import). Any FAIL in theme code must be fixed (smallest diff), rebuilt, re-verified, committed.

Commit (only if fixes were made): `theme: e2e fixes`.
