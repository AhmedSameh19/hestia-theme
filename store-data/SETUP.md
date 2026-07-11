# HESTIA Shopify Store Setup Guide (Egypt Edition)

This guide details the steps required to configure the Shopify Admin so the store features and mock catalog are fully functional.

## 0. Store settings (Egypt)

1. Admin → **Settings** → **Store details** → Store currency: **EGP** (must be set BEFORE importing products — prices in the CSV are EGP).
2. Admin → **Settings** → **Markets**: keep a single market, **Egypt** only. Remove/deactivate any international market.
3. Admin → **Settings** → **Shipping and delivery** → create one profile, zone **Egypt**, with dummy rates (client to confirm):
   - Standard — Cairo & Giza: LE 70, 1–2 business days
   - Standard — all other governorates: LE 100, 2–4 business days
   - Free shipping: orders over LE 2,500 (matches the cart progress bar and announcement bar defaults)
4. Admin → **Settings** → **Taxes and duties**: Egypt VAT is 14% — confirm with the client's accountant whether prices are tax-inclusive; set "Include tax in prices" accordingly (dummy default: inclusive).

## 0b. Metafield definition (before CSV import)

Admin → **Settings** → **Custom data** → **Products** → **Add definition**:
- Name: **Fabric & Care**
- Namespace and key: `custom.fabric_care`
- Type: **Multi-line text** (one entry per product)

The CSV contains a `Fabric & Care (product.metafields.custom.fabric_care)` column that populates this on import. Values are DUMMY copy.

## 1. Import Product CSV

1. Log in to your Shopify Admin.
2. Go to **Products**.
3. Click **Import** at the top right.
4. Choose the generated `store-data/products.csv` file.
5. Click **Upload and preview**, then click **Import products**.
*Note: Re-import with **Overwrite existing products** checked if products were imported before this revision (prices are now EGP; size tags and fabric-care metafields were added).*

## 2. Create Automated Collections
Navigate to **Products** → **Collections** and create the following 5 collections. Ensure they use the exact handles and rules specified below:

1. **New Arrivals**
   - **Collection type**: Automated
   - **Conditions**: Product tag **is equal to** `new-arrivals`
   - **Handle**: `new-arrivals` (or `/collections/new-arrivals`)

2. **The Silk Collection**
   - **Collection type**: Automated
   - **Conditions**: Product tag **is equal to** `silk`
   - **Handle**: `silk` (or `/collections/silk`)

3. **Sleepwear**
   - **Collection type**: Automated
   - **Conditions**: Product type **is equal to** `Sleepwear`
   - **Handle**: `sleepwear`

4. **Loungewear**
   - **Collection type**: Automated
   - **Conditions**: Product type **is equal to** `Loungewear`
   - **Handle**: `loungewear`

5. **Robes**
   - **Collection type**: Automated
   - **Conditions**: Product type **is equal to** `Robes`
   - **Handle**: `robes`

## 3. Navigation Setup

Go to **Online Store** → **Navigation** to configure the menus.

### Main Menu (`main-menu`)
Configure the main menu links as follows:
- **Shop** → Link: `/collections/all` (All Products)
- **Collections** → Link: `/collections` (All Collections)
- **About** → Link: `/pages/about`

> Note: /pages/about must exist first — create an **About** page (Admin → Content → Pages) before linking to it, or the link will 404.

### Footer Menus
Configure footer menus to link to relevant policy/about pages or collection links. Include the following links:
- **Shop** → Link: `/collections/all`
- **Collections** → Link: `/collections`
- **About** → Link: `/pages/about`
- **Size Guide** → Link: `/pages/size-guide`
- **Refund Policy** → Link: Policies → Refund Policy
- **Privacy Policy** → Link: Policies → Privacy Policy
- **Terms of Service** → Link: Policies → Terms of Service

## 4. Pages & policies (all DUMMY copy — replace with client content)

1. Admin → **Settings** → **Policies** → click **Create from template** for Refund, Privacy, and Terms of service. Mark each with a leading line "DUMMY — pending legal review." Shopify links them at checkout automatically.
2. Admin → **Content** → **Pages** → create:
   - **About** (handle `about`) — 2 short dummy paragraphs about the brand.
   - **Size Guide** (handle `size-guide` — must match exactly; the product page links to it) — a dummy table: XS (EU 34) / S (36) / M (38) / L (40) / XL (42) with bust/waist/hip cm columns.
   - **Contact** (handle `contact`) — the theme injects a contact form on this handle automatically; body text is one dummy line.
3. Add Shipping/Returns/Privacy links to one of the footer menus.

## 5. Search & Discovery App Configuration
1. Install the free **Shopify Search & Discovery** app from the Shopify App Store.
2. Go to **Apps** → **Search & Discovery** → **Filters**.
3. Add the following filter options:
   - **Availability**
   - **Price**
   - **Color** (Standard product options)
   - **Size** (Standard product options)
   - **Fabric** (Select **Tag** prefix or use tag filters)
*Note: If the Search & Discovery app is not yet installed/configured, the theme will automatically fall back to native tag filtering (e.g. `fabric:Silk`, `color:Champagne`).*

## 6. Payments and Checkout Setup

To test the checkout process end-to-end:
1. Go to **Settings** → **Payments**.
2. If Shopify Payments is active, click **Manage**, scroll down to **Test mode**, check **Enable test mode**, and click **Save**.
3. Alternatively, under **Payment providers**, choose a test provider like **(for testing) Bogus Gateway** and activate it.
4. Use credit card number `1` (or `1`, `2`, `3` for CVV/expiry) to complete checkout test transactions.

*Note: For go-live in Egypt, the client will need a local provider — Paymob or PayTabs via the Shopify App Store (Shopify Payments is not available in Egypt). Decision pending client.*

## Dummy data register (client must replace before launch)

| Item | Where | Status |
|---|---|---|
| Product photos (1 per product, AI-generated, external CDN) | products.csv Image Src / store-data/images/ | DUMMY |
| Product titles, descriptions, prices (EGP) | products.csv | DUMMY |
| Fabric & care copy | products.csv metafield column | DUMMY |
| Shipping rates & delivery promises | Admin shipping + product shipping accordion + announcement bar | DUMMY |
| Free-shipping threshold (LE 2,500) | Cart section setting + announcement bar | DUMMY |
| Refund / Privacy / Terms policies | Admin → Settings → Policies | DUMMY |
| About page, Size guide, Contact page copy | Admin → Content → Pages | DUMMY |
| Testimonial quote/author | Homepage section settings | DUMMY |
| Hero + bento images | Homepage section settings | DUMMY |
| Social media URLs | Footer section settings | EMPTY (client to provide) |
| VAT-inclusive pricing decision | Admin → Taxes | PENDING CLIENT |
| Arabic storefront (yes/no) | locales/ — not built | PENDING CLIENT |
| Payment provider (Paymob/PayTabs) | Admin → Payments | PENDING CLIENT |
