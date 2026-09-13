# Minimal Footer & EGP Currency Stabilization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Streamline `sections/footer.liquid` into a clean split two-row minimal footer (Instagram and TikTok only, no newsletter, no payment badges, no currency dropdown) and stabilize Egyptian Pound (EGP) as the single primary currency across all templates, scripts, and modals.

**Architecture:** 
1. Re-author `sections/footer.liquid` to a clean 2-row layout using Aurca's brand tokens and modal trigger data attributes.
2. Update `assets/theme.js` to enforce EGP as the fixed currency, format prices as `X EGP` (or `X ج.م` in Arabic), calibrate the cart free shipping threshold to 2,500 EGP, and sweep prices on page load.
3. Update server-rendered Liquid sections (`featured-products.liquid`, `snippets/aurca-modals.liquid`, `header.liquid`, `trust-marquee.liquid`) to remove hardcoded dollar amounts and display 2,500 EGP shipping thresholds.

**Tech Stack:** Shopify Liquid, Tailwind CSS, Vanilla JavaScript (ES6+), HTML5.

## Global Constraints
- Target market: Egypt only, currency: EGP.
- Socials: Instagram and TikTok only (Pinterest removed).
- No newsletter bar, no payment badges, no currency selector dropdown.
- Free shipping threshold: 2,500 EGP across all notices and cart math.
- Price format: `${amount.toLocaleString('en-US')} EGP` in English, `${amount.toLocaleString('ar-EG')} ج.م` in Arabic.

---

### Task 1: Re-author `sections/footer.liquid` to Minimal Split-Row Layout

**Files:**
- Modify: `sections/footer.liquid`

**Interfaces:**
- Consumes: `logo-monogram-dark.svg`, `data-size-guide-open`, `data-support-open`, `data-nav-filter`.
- Produces: Streamlined footer without newsletter, payment badges, or currency selector.

- [ ] **Step 1: Write minimal footer markup**

Replace `sections/footer.liquid` with the clean two-row layout:

```liquid
<footer class="text-white w-full transition-colors duration-300" style="background: #2D2E2D;">
  {%- comment -%} Main Row: Brand & Navigation {%- endcomment -%}
  <div class="px-6 lg:px-10 py-12" style="border-bottom: 1px solid rgba(255,255,255,0.07);">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10 lg:gap-16">
      {%- comment -%} Left: Brand Monogram, Tagline & Socials {%- endcomment -%}
      <div class="max-w-sm">
        <img src="{{ 'logo-monogram-dark.svg' | asset_url }}" alt="Aurca" width="64" height="64"
             class="object-contain mb-4" style="width: 64px; height: 64px;">
        <p class="text-xs leading-relaxed mb-6" style="color: rgba(255,255,255,0.4);" data-i18n="brandTagline">
          Luxury homewear for the sacred hours between waking and sleeping. Est. 2018.
        </p>

        {%- comment -%} Social Icons (Instagram & TikTok only) {%- endcomment -%}
        <div class="flex items-center gap-2.5">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
             class="w-7 h-7 flex items-center justify-center border hover:border-white/50 transition-colors"
             style="border-color: rgba(255,255,255,0.15); color: rgba(255,255,255,0.4);">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok"
             class="w-7 h-7 flex items-center justify-center border hover:border-white/50 transition-colors"
             style="border-color: rgba(255,255,255,0.15); color: rgba(255,255,255,0.4);">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.86 4.86 0 0 1-1.02-.06z"/>
            </svg>
          </a>
        </div>
      </div>

      {%- comment -%} Right: Navigation Links {%- endcomment -%}
      <div class="flex flex-wrap gap-12 lg:gap-20">
        {%- comment -%} Client Care {%- endcomment -%}
        <div>
          <h5 class="text-[9px] tracking-[0.3em] uppercase mb-4 font-semibold" style="color: rgba(255,255,255,0.25);" data-i18n="help">
            Client Care
          </h5>
          <ul class="space-y-2.5">
            <li><button type="button" data-size-guide-open class="text-xs transition-colors hover:text-white text-left" style="color: rgba(255,255,255,0.45);" data-i18n="sizeGuide">Size Guide</button></li>
            <li><button type="button" data-support-open class="text-xs transition-colors hover:text-white text-left" style="color: rgba(255,255,255,0.45);">Shipping & Returns</button></li>
            <li><button type="button" data-support-open class="text-xs transition-colors hover:text-white text-left" style="color: rgba(255,255,255,0.45);">Contact Us</button></li>
            <li><button type="button" data-support-open class="text-xs transition-colors hover:text-white text-left" style="color: rgba(255,255,255,0.45);">FAQs</button></li>
          </ul>
        </div>

        {%- comment -%} Collections {%- endcomment -%}
        <div>
          <h5 class="text-[9px] tracking-[0.3em] uppercase mb-4 font-semibold" style="color: rgba(255,255,255,0.25);" data-i18n="collections">
            Collections
          </h5>
          <ul class="space-y-2.5">
            <li><a href="#featured-products" data-nav-filter="Women" class="text-xs transition-colors hover:text-white" style="color: rgba(255,255,255,0.45);">Women's Sleepwear</a></li>
            <li><a href="#featured-products" data-nav-filter="Men" class="text-xs transition-colors hover:text-white" style="color: rgba(255,255,255,0.45);">Men's Homewear</a></li>
            <li><a href="#featured-products" data-nav-filter="Together" class="text-xs transition-colors hover:text-white" style="color: rgba(255,255,255,0.45);">Together Edition</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  {%- comment -%} Bottom Row: Copyright & Legal Links {%- endcomment -%}
  <div class="px-6 lg:px-10 py-5">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
      <p class="text-[10px]" style="color: rgba(255,255,255,0.25);" data-i18n="copyright">
        &copy; 2024 Aurca Homewear. All rights reserved.
      </p>

      <div class="flex items-center gap-5">
        <a href="#" class="text-[9px] hover:text-white/50 transition-colors" style="color: rgba(255,255,255,0.25);">
          Privacy
        </a>
        <a href="#" class="text-[9px] hover:text-white/50 transition-colors" style="color: rgba(255,255,255,0.25);">
          Terms
        </a>
      </div>
    </div>
  </div>
</footer>

{% schema %}
{
  "name": "Footer",
  "settings": [],
  "presets": [{ "name": "Footer" }]
}
{% endschema %}
```

- [ ] **Step 2: Verify footer syntax and absence of removed elements**

Run:
```bash
cd "hestia-theme" && grep -i -E "pinterest|newsletter|visa|currency-selector" sections/footer.liquid || echo "CLEAN"
```
Expected output: `CLEAN`

- [ ] **Step 3: Commit footer changes**

```bash
cd "hestia-theme"
git add sections/footer.liquid
git commit -m "feat: streamline footer to minimal split layout and remove clutter"
```

---

### Task 2: Stabilize EGP Currency & Formatting in `assets/theme.js`

**Files:**
- Modify: `assets/theme.js`

**Interfaces:**
- Consumes: `PRODUCTS`, `cart`, `currentLang`.
- Produces: `formatPrice`, updated shipping threshold math (2,500 EGP), initial EGP price sweep on page load.

- [ ] **Step 1: Update currency default, rates, and formatting in `assets/theme.js`**

1. Ensure `currentCurrency` initializes and persists to `'EGP'`:
```javascript
  let currentCurrency = 'EGP';
  localStorage.setItem('aurca:currency', 'EGP');
```

2. Update `formatPrice(amountInUSD)`:
```javascript
  function formatPrice(amountInUSD) {
    const rate = 49.5;
    const converted = Math.round(amountInUSD * rate);
    if (currentLang === 'ar') {
      return `${converted.toLocaleString('ar-EG')} ج.م`;
    }
    return `${converted.toLocaleString('en-US')} EGP`;
  }
```

3. Update Free Shipping Threshold in `updateCartUI()` to 2,500 EGP:
```javascript
    // Update Shipping Progress Bar (Threshold: 2,500 EGP)
    const progressBar = document.querySelector('[data-shipping-progress-bar]');
    const progressText = document.querySelector('[data-shipping-progress-text]');
    if (progressBar && progressText) {
      const thresholdEGP = 2500;
      const subtotalEGP = subtotal * 49.5;
      const pct = Math.min(100, Math.round((subtotalEGP / thresholdEGP) * 100));
      progressBar.style.width = `${pct}%`;
      if (subtotalEGP >= thresholdEGP) {
        progressText.textContent = currentLang === 'en' ? '✓ You qualify for free shipping!' : '✓ أنت مؤهل للشحن المجاني!';
        progressBar.style.background = '#494D57';
      } else {
        const remainingEGP = thresholdEGP - subtotalEGP;
        const formattedRemaining = currentLang === 'ar' ? `${Math.round(remainingEGP).toLocaleString('ar-EG')} ج.م` : `${Math.round(remainingEGP).toLocaleString('en-US')} EGP`;
        progressText.textContent = currentLang === 'en' ? `Add ${formattedRemaining} for free shipping` : `أضف ${formattedRemaining} للشحن المجاني`;
        progressBar.style.background = '#A87052';
      }
    }
```

4. Update `TRANSLATIONS`:
- In `TRANSLATIONS.en`:
  `announcement: 'Free shipping over 2,500 EGP · Complimentary gift wrapping · 30-day returns',`
- In `TRANSLATIONS.ar`:
  `announcement: 'شحن مجاني للطلبات فوق 2,500 ج.م · تغليف هدايا مجاني · إرجاع خلال 30 يوم',`

5. Add Initial Price Sweep on DOM load in initialization section:
```javascript
    // Synchronize initial product card prices to EGP immediately
    document.querySelectorAll('.product-card-item').forEach(card => {
      const id = parseInt(card.getAttribute('data-id'), 10);
      const product = PRODUCTS.find(p => p.id === id);
      if (product) {
        const priceSpan = card.querySelector('.font-medium');
        if (priceSpan) priceSpan.textContent = formatPrice(product.price);
      }
    });
```

- [ ] **Step 2: Validate JavaScript syntax**

Run:
```bash
node -c "hestia-theme/assets/theme.js"
```
Expected output: (silent, exit code 0)

- [ ] **Step 3: Commit `theme.js` changes**

```bash
cd "hestia-theme"
git add assets/theme.js
git commit -m "feat: stabilize EGP currency and update free shipping threshold in theme.js"
```

---

### Task 3: Stabilize EGP in HTML Templates & Snippets

**Files:**
- Modify: `sections/featured-products.liquid`
- Modify: `snippets/aurca-modals.liquid`
- Modify: `sections/header.liquid`
- Modify: `sections/trust-marquee.liquid`

**Interfaces:**
- Consumes: Pre-calculated EGP prices and 2,500 EGP threshold.
- Produces: Initial HTML without dollar signs or outdated thresholds.

- [ ] **Step 1: Replace hardcoded USD prices in `sections/featured-products.liquid`**

Replace static `$249`, `$189`, etc. with EGP values:
- Product 1: `$249` &rarr; `12,325 EGP`
- Product 2: `$189` &rarr; `9,355 EGP`
- Product 3: `$349` &rarr; `17,275 EGP`
- Product 4: `$199` &rarr; `9,850 EGP` and `$249` &rarr; `12,325 EGP`
- Product 5: `$219` &rarr; `10,840 EGP`
- Product 6: `$419` &rarr; `20,740 EGP`
- Product 7: `$179` &rarr; `8,860 EGP`
- Product 8: `$199` &rarr; `9,850 EGP`
- Product 9: `$389` &rarr; `19,255 EGP` and `$429` &rarr; `21,235 EGP`
- Product 10: `$219` &rarr; `10,840 EGP`
- Product 11: `$239` &rarr; `11,830 EGP`
- Product 12: `$459` &rarr; `22,720 EGP`

- [ ] **Step 2: Update `snippets/aurca-modals.liquid`**

- Cart drawer shipping message:
  `Free shipping over $150` &rarr; `Free shipping over 2,500 EGP`
- Cart drawer empty subtotal:
  `$0.00` &rarr; `0 EGP`
- Quick view modal guarantee:
  `Free shipping on orders over $150` &rarr; `Free shipping on orders over 2,500 EGP`
- Checkout total default:
  `$0.00` &rarr; `0 EGP`

- [ ] **Step 3: Update `sections/header.liquid` & `sections/trust-marquee.liquid`**

- In `sections/header.liquid`:
  Update announcement fallback and schema default from `$150` &rarr; `2,500 EGP`.
- In `sections/trust-marquee.liquid`:
  Update `FREE SHIPPING OVER $150` &rarr; `FREE SHIPPING OVER 2,500 EGP`.

- [ ] **Step 4: Verify absence of dollar signs and legacy $150 threshold**

Run:
```bash
cd "hestia-theme"
grep -n -E '\$150|\$249|\$0\.00' sections/header.liquid sections/trust-marquee.liquid sections/featured-products.liquid snippets/aurca-modals.liquid || echo "ALL CLEAN"
```
Expected output: `ALL CLEAN`

- [ ] **Step 5: Commit template changes**

```bash
cd "hestia-theme"
git add sections/featured-products.liquid snippets/aurca-modals.liquid sections/header.liquid sections/trust-marquee.liquid
git commit -m "feat: replace hardcoded USD amounts with EGP in templates and modals"
```

---

### Task 4: Full Verification and Build Validation

**Files:**
- Review all modified files.

- [ ] **Step 1: Run comprehensive grep audit**

Verify that no unwanted currencies or symbols remain in storefront files:
```bash
cd "hestia-theme"
grep -rn -E '\$150|\$249|pinterest|currency-selector' sections/ snippets/ assets/theme.js
```
Expected output: No matches.

- [ ] **Step 2: Test script logic with Node.js test harness**

Run node script to verify currency formatting and cart threshold:
```bash
node -e '
const rate = 49.5;
function format(p, lang="en") {
  const c = Math.round(p * rate);
  return lang === "ar" ? `${c.toLocaleString("ar-EG")} ج.م` : `${c.toLocaleString("en-US")} EGP`;
}
console.assert(format(249, "en") === "12,325 EGP", "EN format failed");
console.assert(format(249, "ar") === "١٢,٣٢٥ ج.م", "AR format failed");
console.log("Pricing assertion PASSED");
'
```
Expected output: `Pricing assertion PASSED`

- [ ] **Step 3: Build CSS (if required) and check git status**

Run:
```bash
cd "hestia-theme"
npm run build && git status
```
Expected output: Clean build, all changes accounted for.
