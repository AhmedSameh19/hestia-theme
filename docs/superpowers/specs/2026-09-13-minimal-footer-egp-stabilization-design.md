# Minimal Footer & EGP Currency Stabilization — Design

## 1. Overview
Streamline the store footer to remove e-commerce clutter (newsletter form, payment method badges, corporate placeholder links, and currency dropdown), and stabilize Egyptian Pound (EGP) as the sole, default currency across the entire Aurca storefront.

## 2. Footer Redesign (`sections/footer.liquid`)

### Visual & Structural Layout
Replace the 183-line mega-footer with a clean, two-row split layout styled with Aurca's brand tokens (`#2D2E2D` dark charcoal surface, white/30–white/80 typography, `#A87052` clay accent):

1. **Top Row (Brand & Navigation):**
   - **Left Column (Brand Identity & Socials):**
     - Aurca Monogram SVG (`logo-monogram-dark.svg`, 64px width).
     - Tagline: *"Luxury homewear for the sacred hours between waking and sleeping."* in subtle muted text (`rgba(255,255,255,0.4)`).
     - Social Links: **Instagram** and **TikTok** only (Pinterest removed). Styled as 28×28px minimal bordered icon buttons.
   - **Right Column (Customer Care & Collections):**
     - Group 1: **Client Care**
       - Size Guide (`<button data-size-guide-open>`)
       - Shipping & Returns (`<button data-support-open>`)
       - Contact Us (`<button data-support-open>`)
       - FAQs (`<button data-support-open>`)
     - Group 2: **Collections**
       - Women's Sleepwear (`<a href="#featured-products" data-nav-filter="Women">`)
       - Men's Homewear (`<a href="#featured-products" data-nav-filter="Men">`)
       - Together Edition (`<a href="#featured-products" data-nav-filter="Together">`)

2. **Bottom Row (Legal & Copyright):**
   - Left: `© 2024 Aurca Homewear. All rights reserved.`
   - Right: Clean text links for `Privacy` and `Terms`.

3. **Explicit Removals:**
   - "Join the Circle" newsletter bar, email input, and subscribe button.
   - Payment method chips (Visa, MC, Amex, PayPal, Apple Pay).
   - "Soon" placeholder buttons and corporate fluff (Careers, Stockists, Press, Craftsmanship, Sustainability, Gift Sets, Store Locator).
   - Currency selector dropdown `<select data-currency-selector>`.

4. **Schema:**
   - Clean Shopify schema with preset:
     ```json
     {% schema %}
     {
       "name": "Footer",
       "settings": [],
       "presets": [{ "name": "Footer" }]
     }
     {% endschema %}
     ```

## 3. EGP Currency Stabilization

### Target Behavior
The store operates exclusively in the Egyptian market using Egyptian Pounds (EGP). All customer-facing prices, drawer cart calculations, quick views, checkout modal totals, announcements, and trust marquees must render consistently in EGP without any dollar signs (`$`) or unformatted fallback states.

### Changes by File

#### A. `assets/theme.js`
1. **Currency Default & Storage:**
   - Set `currentCurrency = 'EGP'` by default.
   - Automatically persist `aurca:currency = 'EGP'` to `localStorage` to overwrite any previous `'USD'` values.
2. **`formatPrice(amountInUSD)` Function:**
   - Conversion calculation: `const converted = Math.round(amountInUSD * 49.5);`
   - English formatting (`currentLang === 'en'`): `${converted.toLocaleString('en-US')} EGP` (e.g. `12,325 EGP`).
   - Arabic formatting (`currentLang === 'ar'`): `${converted.toLocaleString('ar-EG')} ج.م` (e.g. `١٢,٣٢٥ ج.م`).
3. **Cart Free Shipping Threshold:**
   - Threshold updated from legacy `$150` to **2,500 EGP** (equivalent to ~50.5 base units: `thresholdBase = 2500 / 49.5`).
   - Drawer cart progress bar and remaining amount text calculated against 2,500 EGP.
4. **Translations (`TRANSLATIONS.en` and `TRANSLATIONS.ar`):**
   - Update `announcement` text in EN: `'Free shipping over 2,500 EGP · Complimentary gift wrapping · 30-day returns'`
   - Update `announcement` text in AR: `'شحن مجاني للطلبات فوق 2,500 ج.م · تغليف هدايا مجاني · إرجاع خلال 30 يوم'`
5. **Initial Sweep on Load:**
   - On `DOMContentLoaded`, immediately iterate over all `.product-card-item` elements to run `formatPrice` on their rendered price spans, guaranteeing immediate synchronization.
   - Remove obsolete `data-currency-selector` change listeners.

#### B. `sections/featured-products.liquid`
Replace static HTML USD values in server-rendered product cards with pre-calculated EGP values to eliminate any flash of dollar signs:
- Product 1: `12,325 EGP` (was `$249`)
- Product 2: `9,355 EGP` (was `$189`)
- Product 3: `17,275 EGP` (was `$349`)
- Product 4: `9,850 EGP` / `12,325 EGP` (was `$199` / `$249`)
- Product 5: `10,840 EGP` (was `$219`)
- Product 6: `20,740 EGP` (was `$419`)
- Product 7: `8,860 EGP` (was `$179`)
- Product 8: `9,850 EGP` (was `$199`)
- Product 9: `19,255 EGP` / `21,235 EGP` (was `$389` / `$429`)
- Product 10: `10,840 EGP` (was `$219`)
- Product 11: `11,830 EGP` (was `$239`)
- Product 12: `22,720 EGP` (was `$459`)

#### C. `snippets/aurca-modals.liquid`
- Cart Drawer shipping notice: update `"Free shipping over $150"` &rarr; `"Free shipping over 2,500 EGP"`.
- Cart Drawer empty subtotal: update `"$0.00"` &rarr; `"0 EGP"`.
- Quick View Modal shipping guarantee: update `"Free shipping on orders over $150"` &rarr; `"Free shipping on orders over 2,500 EGP"`.
- Checkout Modal total: update `"$0.00"` &rarr; `"0 EGP"`.

#### D. `sections/header.liquid` & `sections/trust-marquee.liquid`
- `sections/header.liquid`: Default announcement bar text set to:
  `"Free shipping over 2,500 EGP · Complimentary gift wrapping · 30-day returns"`.
- `sections/trust-marquee.liquid`: Update marquee string:
  `"FREE SHIPPING OVER 2,500 EGP|HANDCRAFTED WITH LOVE|NEW ARRIVALS WEEKLY|ETHICALLY SOURCED FABRICS|COMPLIMENTARY GIFT WRAPPING|FREE RETURNS WITHIN 30 DAYS"`.

## 4. Verification & Testing
1. **Static Analysis:**
   - Grep search for any remaining occurrences of `$` or `150` across sections, snippets, and assets to confirm no stray dollar symbols or outdated thresholds remain.
2. **Behavioral Testing:**
   - Verify footer layout: Instagram & TikTok icons present; Pinterest removed; newsletter removed; payment icons removed; currency dropdown removed; Client Care and Collections links operational.
   - Verify modal triggers: Size Guide (`data-size-guide-open`) and Support (`data-support-open`) open expected drawers/modals.
   - Verify price formatting: All homepage cards, modal quick-views, and cart subtotals render with `EGP` in English and `ج.م` in Arabic.
   - Verify cart threshold progress bar: updates accurately toward 2,500 EGP.
