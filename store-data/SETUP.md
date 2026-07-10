# HESTIA Dev Store — Admin Setup Guide

Follow these steps in order after cloning/pushing the theme, to bring the dev
store to a fully functional state using the data in `products.csv`.

## 1. Import the product CSV

1. Shopify Admin → **Products** → **Import**.
2. Choose file: `store-data/products.csv`.
3. Leave "Overwrite existing products that have the same handle" unchecked
   (first import).
4. Click **Import products**, then **View import summary** once it finishes
   — confirm 10 products / 39 variants were created.

## 2. Create automated collections

Admin → **Products** → **Collections** → **Create collection** for each of
the following (all: type = **Automated**):

| Title | Handle | Condition |
|---|---|---|
| The Silk Collection | `silk` | Product tag **is equal to** `silk` |
| New Arrivals | `new-arrivals` | Product tag **is equal to** `new-arrivals` |
| Sleepwear | `sleepwear` | Product type **is equal to** `Sleepwear` |
| Loungewear | `loungewear` | Product type **is equal to** `Loungewear` |
| Robes | `robes` | Product type **is equal to** `Robes` |

Set the collection **handle** explicitly in each collection's URL/SEO section
if Shopify doesn't auto-generate the exact handle above (it usually does from
the title, but verify — the theme's navigation and links below depend on
these exact handles).

## 3. Navigation

Admin → **Content** → **Menus**.

**Main menu** — add/edit items in this order:
1. Shop → `/collections/all`
2. Collections → `/collections`
3. About → `/pages/about`
4. Journal → `/blogs/news`

**Footer menu** — add the same links (Shop, Collections, About, Journal) plus
any policy pages the store already has (Shipping, Returns, Privacy) if
present under Settings → Policies.

> Note: `/pages/about` and `/blogs/news` must exist first — create an
> **About** page (Admin → Content → Pages) and confirm the default **News**
> blog exists (Admin → Content → Blog posts) before linking to them, or the
> links will 404.

## 4. Search & Discovery app (filtering)

1. Admin → **Apps** → **Shopify App Store** → search "Search & Discovery"
   (free, published by Shopify) → **Install**.
2. Open the app → **Filters** → **Add filter** for each of:
   - Availability
   - Price
   - Color (variant option)
   - Size (variant option)
   - Fabric (product tag, prefix `fabric:`)
3. Save.

**Until this app is installed and configured**, the theme's collection page
falls back to plain tag-based filtering (see Task 2) — product discovery
still works, just without the native filter UI/facets.

## 5. Payments (test checkout)

1. Admin → **Settings** → **Payments**.
2. Under "Payment providers" (or "Manage" if a provider prompt is shown),
   activate the built-in test provider — **Bogus Gateway** (dev/test stores
   only; on stores where it's hidden, use **Shopify Payments test mode** if
   offered, and enable "Use test mode" instead).
3. Save.
4. Test checkout end-to-end with the standard test card number `1` (Bogus
   Gateway accepts card number `1` for a successful test authorization, `2`
   for a decline) — any future expiry date, any CVV, any name.

Once steps 1–5 are complete, the storefront should have full product,
navigation, filtering, and checkout coverage for demoing/QA.
