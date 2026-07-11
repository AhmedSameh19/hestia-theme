# HESTIA Egypt Launch Prep — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all confirmed theme bugs, add the missing merchant-facing essentials (SEO metadata, newsletter feedback, cart note, announcement bar, social links, size-guide hook), retarget the store to the Egyptian market (EGP), remove the blog from the customer surface, and package everything dummy-data-first so real client data can be swapped in later without code changes.

**Architecture:** All work happens inside the existing OS 2.0 theme at the repo root (`hestia-theme/`). No new frameworks, no new dependencies. JS stays in the single vanilla IIFE `assets/theme.js`; styling stays Tailwind-compiled via `npm run build`; merchant-side steps go into `store-data/SETUP.md`. Dummy content is centralized in a "Dummy data register" so the client handoff is one checklist.

**Tech Stack:** Shopify Liquid (OS 2.0), Tailwind CLI, vanilla JS, Shopify CLI (`npx @shopify/cli`), Python 3 (one-off CSV migration script).

## Global Constraints

- Working directory: `/mnt/hdd/Untitled Folder/hestia-theme` (git repo — commit per task).
- After ANY change to `.liquid` files: run `npm run build` (regenerates `assets/theme.css`) and commit the rebuilt CSS with the same commit.
- After every task: `npx -y @shopify/cli theme check --fail-level error` must pass with 0 errors, and `node --check assets/theme.js` must pass.
- Store market: **Egypt only**, currency **EGP**. No currency/language selectors (single market). Storefront language: **English only for now** — Arabic/RTL is an open client question, explicitly out of scope (see Out of Scope).
- ALL new copy, prices, images, and thresholds are **dummy data** — mark every dummy value by listing it in the Dummy data register (Task 10). Do not invent "final-looking" unlisted content.
- Blog/Journal is removed from the customer surface, but `templates/blog.liquid` and `templates/article.liquid` MUST stay on disk — Shopify requires them for theme upload. Do not delete template files.
- Follow existing code style: `ponytail:` comments for deliberate shortcuts, kebab-case data attributes, Tailwind utility classes matching neighboring markup, locale strings via `{{ '…' | t }}` with keys added to `locales/en.default.json`.
- Commit messages follow the repo's existing style: `theme: <what>` / `store-data: <what>`, ending with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

## Out of Scope (decided, do not implement)

- Arabic locale / RTL layout — pending client decision; single `en.default.json` stays.
- Product reviews app, predictive search, wishlist, quick-view, sticky add-to-cart, low-stock indicators, gift-card QR code, password-page notify form, blog comments (blog is removed from surface anyway).
- Currency/language selectors (single-market store).
- Live payment gateways (Paymob/Accept etc.) — SETUP.md notes them for go-live; dev store uses Bogus Gateway.
- Real photography/copy — everything stays dummy until the client delivers.

---

### Task 1: Money formatting from store settings (EGP-ready)

The JS money formatter is hardcoded to `'$' + (cents/100).toFixed(2)` — wrong for an EGP store everywhere JS renders a price (variant switch, future uses). Fix: inject `shop.money_format` from Liquid, format in JS.

**Files:**
- Modify: `layout/theme.liquid:36-43` (the `window.hestiaStrings` script block)
- Modify: `assets/theme.js:5-8` (the `money` function)

**Interfaces:**
- Produces: `window.hestiaMoneyFormat` (string, Shopify money format like `"LE {{amount}}"`), consumed only by `theme.js`. The `money(cents)` JS function signature is unchanged — all existing callers keep working.

- [x] **Step 1: Inject the store money format in `layout/theme.liquid`**

Change the existing script block (lines 36–43) to:

```liquid
    <script>
      window.hestiaStrings = {
        addToCart: {{ 'products.add_to_cart' | t | json }},
        added: {{ 'products.added' | t | json }},
        soldOut: {{ 'products.sold_out' | t | json }},
        unavailable: {{ 'products.unavailable' | t | json }}
      };
      window.hestiaMoneyFormat = {{ shop.money_format | json }};
    </script>
```

- [x] **Step 2: Replace the hardcoded formatter in `assets/theme.js`**

Replace lines 5–8:

```js
  var money = function (cents) {
    // ponytail: handles {{amount}} / {{amount_no_decimals}} with comma thousands;
    // add the European variants only if the store ever switches to one
    var format = window.hestiaMoneyFormat || '${{amount}}';
    var noDecimals = format.indexOf('amount_no_decimals') !== -1;
    var amount = noDecimals ? String(Math.round(cents / 100)) : (cents / 100).toFixed(2);
    var parts = amount.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return format.replace(/\{\{\s*amount[^}]*\}\}/, parts.join('.'));
  };
```

- [x] **Step 3: Verify**

```bash
node --check assets/theme.js
node -e "
var window = { hestiaMoneyFormat: 'LE {{amount}}' };
$(sed -n '5,14p' assets/theme.js | sed 's/^  var money =/var money =/')
console.assert(money(1250000) === 'LE 12,500.00', money(1250000));
window.hestiaMoneyFormat = 'LE {{amount_no_decimals}}';
console.assert(money(1250000) === 'LE 12,500', money(1250000));
console.log('money OK');
"
```
Expected: `money OK` with no assertion output. (If the sed line range drifted, paste the function body into the `-e` string manually — the assertion values are what matter.)

- [x] **Step 4: Build + theme check**

```bash
npm run build
npx -y @shopify/cli theme check --fail-level error
```
Expected: build "Done", 0 errors.

- [x] **Step 5: Commit**

```bash
git add layout/theme.liquid assets/theme.js assets/theme.css
git commit -m "theme: money formatting from shop.money_format (EGP-ready)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Color swatch fallback (fix blank swatches)

`sections/main-product.liquid:65` feeds a handleized value (`champagne`) into CSS `background-color` — invalid for most brand color names, so swatches render blank when no native Shopify swatch is configured.

**Files:**
- Modify: `sections/main-product.liquid:63-65`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: nothing consumed elsewhere. Native admin swatches (`value.swatch.color`), when configured later, still win.

- [x] **Step 1: Replace the swatch style with a brand-color map**

Replace the current `{%- if is_color -%}` branch (lines 63–65):

```liquid
                    {%- if is_color -%}
                      {%- comment -%} ponytail: dummy brand palette map; native swatches set in admin override this {%- endcomment -%}
                      {%- assign swatch_color = value.swatch.color -%}
                      {%- if swatch_color == blank -%}
                        {%- assign value_handle = value | handle -%}
                        {%- case value_handle -%}
                          {%- when 'champagne' -%}{%- assign swatch_color = '#F0E2C6' -%}
                          {%- when 'terracotta' -%}{%- assign swatch_color = '#C97B63' -%}
                          {%- when 'charcoal' -%}{%- assign swatch_color = '#2D2D2D' -%}
                          {%- when 'sage' -%}{%- assign swatch_color = '#A9B29B' -%}
                          {%- when 'ivory' -%}{%- assign swatch_color = '#FFFFF0' -%}
                          {%- when 'sand' -%}{%- assign swatch_color = '#DCC9B6' -%}
                          {%- when 'taupe' -%}{%- assign swatch_color = '#B9A08E' -%}
                          {%- else -%}{%- assign swatch_color = '#DCC9B6' -%}
                        {%- endcase -%}
                      {%- endif -%}
                      <span class="block w-8 h-8 rounded-full ring-1 ring-outline-variant peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-primary transition-soft"
                            style="background-color: {{ swatch_color }};" title="{{ value }}"></span>
```

(The `{%- else -%}` pill branch and everything after it stays unchanged.)

- [x] **Step 2: Verify, build, commit**

```bash
grep -c 'swatch_color' sections/main-product.liquid   # expect >= 4
npm run build && npx -y @shopify/cli theme check --fail-level error
git add sections/main-product.liquid assets/theme.css
git commit -m "theme: brand-color fallback map for variant swatches

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Newsletter success/error feedback

The footer `{% form 'customer' %}` submits fine but renders no confirmation — customers can't tell signup worked.

**Files:**
- Modify: `sections/footer.liquid:10-18`
- Modify: `locales/en.default.json` (add `general.subscribe_success`)

**Interfaces:**
- Produces: locale key `general.subscribe_success` (string).

- [x] **Step 1: Add the locale key**

In `locales/en.default.json`, inside the existing `"general"` object, add:

```json
    "subscribe_success": "Thank you for subscribing — welcome to the inner circle."
```

- [x] **Step 2: Render success/error states in `sections/footer.liquid`**

Replace lines 10–18 (the form block):

```liquid
      {% form 'customer', class: 'max-w-md' %}
        {%- if form.posted_successfully? -%}
          <p class="font-body-md text-sage">{{ 'general.subscribe_success' | t }}</p>
        {%- else -%}
          {{ form.errors | default_errors }}
          <div class="flex gap-4">
            <input type="hidden" name="contact[tags]" value="newsletter">
            <input type="email" name="contact[email]" required value="{{ form.email }}"
                   class="flex-1 bg-transparent border-b border-primary-fixed/30 py-3 text-primary-fixed placeholder:text-primary-fixed/40 focus:outline-none focus:border-primary-fixed transition-colors"
                   placeholder="{{ 'general.email_placeholder' | t }}">
            <button type="submit" class="font-label-caps text-label-caps text-primary-fixed hover:text-white transition-colors tracking-widest uppercase">
              {{ 'general.subscribe' | t }}
            </button>
          </div>
        {%- endif -%}
      {% endform %}
```

- [x] **Step 3: Verify, build, commit**

```bash
python3 -c "import json; json.load(open('locales/en.default.json')); print('locale JSON OK')"
npm run build && npx -y @shopify/cli theme check --fail-level error
git add sections/footer.liquid locales/en.default.json assets/theme.css
git commit -m "theme: newsletter success and error feedback

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Variant URL sync on the product page

Variant selection never writes `?variant=` to the URL, so shared links can't preselect a color/size. Liquid already honors `?variant=` on load (all selected-state markup uses `product.selected_or_first_available_variant` / `option.selected_value`), so only the write side is missing.

**Files:**
- Modify: `assets/theme.js:121-139` (the fieldset change handler)

**Interfaces:**
- Consumes: existing `resolveVariant()` in the same block.
- Produces: nothing consumed elsewhere.

- [x] **Step 1: Add `history.replaceState` after a successful variant resolution**

Inside the `fs.addEventListener('change', …)` handler, right after `if (idInput) idInput.value = variant.id;` (theme.js:133), add:

```js
        history.replaceState(null, '', window.location.pathname + '?variant=' + variant.id);
```

- [x] **Step 2: Verify, commit**

```bash
node --check assets/theme.js
grep -n 'replaceState' assets/theme.js   # expect 1 hit inside the product block
git add assets/theme.js
git commit -m "theme: sync ?variant= URL on option change

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
(No Liquid changed — no build needed.)

---

### Task 5: Address form province/state field

`snippets/address-fields.liquid` has no province field and the country `data-default` is never applied — saved addresses are incomplete for countries with required provinces (Egypt has governorates in Shopify's country data).

**Files:**
- Modify: `snippets/address-fields.liquid:13-18`
- Modify: `assets/theme.js` (new block after the cart-page block, before "Collection filters")
- Modify: `locales/en.default.json` (add `customers.province`)

**Interfaces:**
- Consumes: Shopify's `all_country_option_tags` (each `<option>` carries `data-provinces` JSON — platform behavior).
- Produces: locale key `customers.province`; form fields `address[country]`, `address[province]`.

- [x] **Step 1: Add the locale key**

In `locales/en.default.json`, inside the existing `"customers"` object, add:

```json
    "province": "Governorate / Province"
```

- [x] **Step 2: Add the province select and default attributes to the snippet**

Replace lines 13–18 of `snippets/address-fields.liquid`:

```liquid
<div class="grid grid-cols-2 gap-4">
  <select name="address[country]" data-address-country data-default="{{ form.country }}" class="{{ input_class }}">
    {{ all_country_option_tags }}
  </select>
  <select name="address[province]" data-address-province data-default="{{ form.province }}" class="{{ input_class }} hidden" aria-label="{{ 'customers.province' | t }}"></select>
</div>
<div class="grid grid-cols-2 gap-4">
  <input type="tel" name="address[phone]" value="{{ form.phone }}" placeholder="{{ 'customers.phone' | t }}" class="{{ input_class }}">
</div>
```

- [x] **Step 3: Wire country → province in `assets/theme.js`**

Add after the cart-page block (after line 201, before the Collection-filters block):

```js
  /* ---------- Address forms (country -> province) ---------- */
  document.querySelectorAll('[data-address-country]').forEach(function (country) {
    var province = country.closest('form').querySelector('[data-address-province]');
    if (!province) return;
    var update = function () {
      var opt = country.options[country.selectedIndex];
      var provinces = JSON.parse(opt.getAttribute('data-provinces') || '[]');
      province.innerHTML = provinces.map(function (p) {
        return '<option value="' + p[0] + '">' + p[1] + '</option>';
      }).join('');
      province.classList.toggle('hidden', provinces.length === 0);
      if (province.dataset.default) province.value = province.dataset.default;
    };
    if (country.dataset.default) country.value = country.dataset.default;
    country.addEventListener('change', update);
    update();
  });
```

- [x] **Step 4: Verify, build, commit**

```bash
node --check assets/theme.js
python3 -c "import json; json.load(open('locales/en.default.json')); print('locale JSON OK')"
npm run build && npx -y @shopify/cli theme check --fail-level error
git add snippets/address-fields.liquid assets/theme.js locales/en.default.json assets/theme.css
git commit -m "theme: province field + country wiring in address forms

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Open Graph / Twitter tags + JSON-LD structured data

Head has canonical + meta description but no social-share metadata and no structured data. Note: the skip-to-content link already exists (`theme.liquid:50`) — do NOT re-add it.

**Files:**
- Modify: `layout/theme.liquid` (head, after the meta description block at line 17)
- Modify: `sections/main-product.liquid` (append JSON-LD at end of file, before `{% schema %}`)

**Interfaces:**
- Consumes: Shopify globals `page_title`, `page_description`, `page_image`, `canonical_url`, `shop`, and the `structured_data` Liquid filter.
- Produces: nothing consumed by other tasks.

- [x] **Step 1: Add OG/Twitter tags and Organization JSON-LD to `layout/theme.liquid`**

Insert after the `{% if page_description %}` block (line 17):

```liquid
    <meta property="og:site_name" content="{{ shop.name }}">
    <meta property="og:type" content="{% if request.page_type == 'product' %}product{% else %}website{% endif %}">
    <meta property="og:title" content="{{ page_title | escape }}">
    <meta property="og:url" content="{{ canonical_url }}">
    {% if page_description %}<meta property="og:description" content="{{ page_description | escape }}">{% endif %}
    {% if page_image %}
      <meta property="og:image" content="https:{{ page_image | image_url: width: 1200 }}">
      <meta name="twitter:card" content="summary_large_image">
    {% else %}
      <meta name="twitter:card" content="summary">
    {% endif %}
    {% if request.page_type == 'index' %}
      <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": {{ shop.name | json }},
          "url": {{ shop.url | json }},
          "logo": {{ 'logo-monogram.png' | asset_url | prepend: 'https:' | json }}
        }
      </script>
    {% endif %}
```

- [x] **Step 2: Add Product JSON-LD to `sections/main-product.liquid`**

At the end of the file, immediately before `{% schema %}`:

```liquid
<script type="application/ld+json">
  {{ product | structured_data }}
</script>
```

- [x] **Step 3: Verify, build, commit**

```bash
npm run build && npx -y @shopify/cli theme check --fail-level error
grep -c 'og:' layout/theme.liquid          # expect 6
grep -c 'structured_data' sections/main-product.liquid   # expect 1
git add layout/theme.liquid sections/main-product.liquid assets/theme.css
git commit -m "theme: OG/Twitter meta + Product and Organization JSON-LD

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: Cart order-note field

**Files:**
- Modify: `sections/main-cart.liquid` (summary aside, above the checkout form at line 88)
- Modify: `assets/theme.js` (inside the existing cart block, after `cartEl.addEventListener('click', …)`)
- Modify: `locales/en.default.json` (add `cart.note_label`)

**Interfaces:**
- Consumes: Shopify AJAX API `/cart/update.js`.
- Produces: locale key `cart.note_label`.

- [x] **Step 1: Add the locale key**

In `locales/en.default.json`, inside the existing `"cart"` object, add:

```json
    "note_label": "Order note (optional)"
```

- [x] **Step 2: Add the textarea to `sections/main-cart.liquid`**

Insert before `<form action="{{ routes.cart_url }}" method="post">` (line 88):

```liquid
          <label class="block mb-6">
            <span class="font-label-caps text-label-caps uppercase text-on-surface-variant block mb-2">{{ 'cart.note_label' | t }}</span>
            <textarea data-cart-note rows="3"
                      class="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body-md focus:ring-1 focus:ring-terracotta outline-none">{{ cart.note }}</textarea>
          </label>
```

- [x] **Step 3: Persist the note in `assets/theme.js`**

Inside the `if (cartEl) { … }` block, after the click listener (theme.js:200), add:

```js
    var note = cartEl.querySelector('[data-cart-note]');
    if (note) {
      note.addEventListener('change', function () {
        fetch('/cart/update.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ note: note.value }),
        });
      });
    }
```

- [x] **Step 4: Verify, build, commit**

```bash
node --check assets/theme.js
python3 -c "import json; json.load(open('locales/en.default.json')); print('locale JSON OK')"
npm run build && npx -y @shopify/cli theme check --fail-level error
git add sections/main-cart.liquid assets/theme.js locales/en.default.json assets/theme.css
git commit -m "theme: cart order-note field persisted via cart/update.js

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 8: Announcement bar (header) + social links (footer)

**Files:**
- Modify: `sections/header.liquid` (bar markup at top of section + one schema setting)
- Modify: `sections/footer.liquid` (bottom bar at lines 35–40 + three schema settings)

**Interfaces:**
- Produces: section settings `header.announcement`, `footer.social_instagram`, `footer.social_facebook`, `footer.social_tiktok`.

- [x] **Step 1: Announcement bar in `sections/header.liquid`**

At the very top of the section file (line 1, before the existing header markup), add:

```liquid
{%- if section.settings.announcement != blank -%}
  <div class="bg-sage text-charcoal text-center py-2 px-margin-mobile font-label-caps text-[11px] uppercase tracking-widest">
    {{ section.settings.announcement }}
  </div>
{%- endif -%}
```

And add to the `settings` array in the schema:

```json
    { "type": "text", "id": "announcement", "label": "Announcement bar text", "default": "Free delivery across Egypt on orders over LE 2,500 — dummy copy" }
```

Note: the header is `fixed`-positioned and `main` has `pt-20` (`theme.liquid:55`). After adding the bar, verify at runtime that it doesn't overlap content; if the bar sits inside the fixed wrapper, no offset change is needed. If content is obscured, the accepted fix is moving the bar markup ABOVE the fixed header `<div>` inside the same section file.

- [x] **Step 2: Social links in `sections/footer.liquid`**

Replace the bottom bar (lines 35–40):

```liquid
  <div class="px-margin-mobile md:px-margin-desktop py-8 border-t border-primary-fixed/10 max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
    <p class="font-label-caps text-[10px] text-primary-fixed/60 tracking-widest uppercase">
      &copy; {{ 'now' | date: '%Y' }} {{ shop.name }}. {{ powered_by_link }}
    </p>
    <div class="flex items-center gap-6">
      {%- if section.settings.social_instagram != blank -%}
        <a href="{{ section.settings.social_instagram }}" aria-label="Instagram" class="text-primary-fixed/60 hover:text-white transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
        </a>
      {%- endif -%}
      {%- if section.settings.social_facebook != blank -%}
        <a href="{{ section.settings.social_facebook }}" aria-label="Facebook" class="text-primary-fixed/60 hover:text-white transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.7c0-.9.3-1.6 1.7-1.6h1.5V3.2c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.9H8v3.2h2.8v8h2.7z"/></svg>
        </a>
      {%- endif -%}
      {%- if section.settings.social_tiktok != blank -%}
        <a href="{{ section.settings.social_tiktok }}" aria-label="TikTok" class="text-primary-fixed/60 hover:text-white transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 3c.4 2.1 1.8 3.5 3.9 3.6v3c-1.5 0-2.8-.5-3.9-1.3v5.7c0 3.6-2.6 5.9-5.7 5.9-3 0-5.4-2.2-5.4-5.3 0-3 2.3-5.3 5.5-5.3.3 0 .7 0 1 .1v3.1c-.3-.1-.6-.2-1-.2-1.4 0-2.5 1-2.5 2.4 0 1.4 1.1 2.3 2.4 2.3 1.5 0 2.6-1 2.6-2.9V3h3.1z"/></svg>
        </a>
      {%- endif -%}
      <img width="752" height="1000" src="{{ 'logo-monogram.png' | asset_url }}" alt="" class="w-6 h-6 object-contain opacity-30 invert">
    </div>
  </div>
```

And add to the footer schema `settings` array:

```json
    { "type": "url", "id": "social_instagram", "label": "Instagram URL" },
    { "type": "url", "id": "social_facebook", "label": "Facebook URL" },
    { "type": "url", "id": "social_tiktok", "label": "TikTok URL" }
```

- [x] **Step 3: Verify, build, commit**

```bash
npm run build && npx -y @shopify/cli theme check --fail-level error
git add sections/header.liquid sections/footer.liquid assets/theme.css
git commit -m "theme: announcement bar + footer social links

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 9: Remove blog from the customer surface + size-guide link + product-only search

Blog/Journal is dropped per client. Template files stay (Shopify upload requirement); every customer-visible path to the blog goes. Search becomes product-only (blog articles would otherwise still surface). While in the PDP, add the size-guide page hook.

**Files:**
- Modify: `templates/search.liquid:3-24`
- Modify: `sections/main-product.liquid` (size option legend, ~line 53)
- Modify: `store-data/SETUP.md` (§3 Navigation)
- Modify: `locales/en.default.json` (add `products.size_guide`)

**Interfaces:**
- Consumes: Shopify search `type=product` query param; `pages['size-guide']` (page created in Task 10's SETUP.md).
- Produces: locale key `products.size_guide`.

- [x] **Step 1: Product-only search in `templates/search.liquid`**

Add inside the form (after the `q` input, line 5):

```liquid
    <input type="hidden" name="type" value="product">
```

And simplify the results loop (lines 14–23) — the non-product branch is now dead:

```liquid
        {% for item in search.results %}
          {% render 'product-card', product: item %}
        {% endfor %}
```

- [x] **Step 2: Size-guide link on the PDP**

In `sections/main-product.liquid`, replace the `<legend>` block (lines 53–55):

```liquid
              <legend class="font-label-caps text-label-caps text-on-surface-variant uppercase mb-4 flex w-full items-baseline justify-between gap-4">
                <span>{{ option.name }}: <span data-option-label>{{ option.selected_value }}</span></span>
                {%- if option.name == 'Size' and pages['size-guide'] != blank -%}
                  <a href="{{ pages['size-guide'].url }}" class="underline underline-offset-4 hover:text-primary normal-case">{{ 'products.size_guide' | t }}</a>
                {%- endif -%}
              </legend>
```

Add to `locales/en.default.json` inside `"products"`:

```json
    "size_guide": "Size guide"
```

- [x] **Step 3: Remove Journal from `store-data/SETUP.md` navigation (§3)**

- Main menu list becomes: 1. Shop → `/collections/all`, 2. Collections → `/collections`, 3. About → `/pages/about`.
- Footer menu line: drop "Journal"; keep Shop, Collections, About + policy pages.
- Delete the `> Note:` paragraph's blog sentence — replace the whole note with: `> Note: /pages/about must exist first — create an **About** page (Admin → Content → Pages) before linking to it, or the link will 404.`

- [x] **Step 4: Verify, build, commit**

```bash
python3 -c "import json; json.load(open('locales/en.default.json')); print('locale JSON OK')"
grep -c 'blogs/news' store-data/SETUP.md   # expect 0
npm run build && npx -y @shopify/cli theme check --fail-level error
git add templates/search.liquid sections/main-product.liquid store-data/SETUP.md locales/en.default.json assets/theme.css
git commit -m "theme: product-only search, size-guide link, drop Journal from nav

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 10: Egypt dummy-data package (CSV prices in EGP, fabric-care metafields, image archive, EGP copy defaults, SETUP.md overhaul)

Everything here is dummy data — the deliverable includes a register the client fills in later.

**Files:**
- Modify: `store-data/products.csv` (prices → EGP, new metafield column)
- Create: `store-data/images/` (archived copies of the 10 external product images)
- Modify: `sections/main-cart.liquid` (schema: `free_shipping_threshold` default 150 → 2500)
- Modify: `sections/main-product.liquid` (schema: `shipping_text` default → EGP copy)
- Modify: `store-data/SETUP.md` (Egypt store settings, metafield definition, policies, pages, dummy register)

**Interfaces:**
- Consumes: `product.metafields.custom.fabric_care` (already read by `sections/main-product.liquid:108`), cart threshold semantics ("store currency units", `main-cart.liquid` schema).
- Produces: CSV column header exactly `Fabric & Care (product.metafields.custom.fabric_care)`; SETUP.md instructs creating the metafield definition with namespace/key `custom.fabric_care`, type "Multi-line text".

- [x] **Step 1: Convert CSV prices to EGP and add the fabric-care metafield column**

Run this from the theme root:

```python
import csv

path = 'store-data/products.csv'
# ponytail: dummy EGP prices, round premium-feeling numbers — client supplies real pricing
prices = {  # handle: (price, compare_at or '')
    'pure-silk-slip': ('12000.00', ''), 'silk-robe': ('16000.00', ''),
    'silk-pajama-set': ('22500.00', ''), 'silk-camisole': ('6000.00', '8000.00'),
    'silk-sleep-mask': ('2200.00', ''), 'silk-shorts': ('4800.00', ''),
    'organic-linen-set': ('9200.00', ''), 'waffle-knit-robe': ('6000.00', ''),
    'cashmere-essential': ('19500.00', ''), 'linen-throw': ('7500.00', ''),
}
care = {  # dummy copy — client supplies real care instructions
    'Silk': 'DUMMY: 100% mulberry silk. Dry clean or gentle cold hand wash. Do not tumble dry. Cool iron on reverse.',
    'Linen': 'DUMMY: 100% organic linen. Machine wash cold, gentle cycle. Line dry. Warm iron while damp.',
    'Cotton': 'DUMMY: 100% organic cotton waffle knit. Machine wash warm. Tumble dry low.',
    'Cashmere': 'DUMMY: 100% grade-A cashmere. Hand wash cold with wool detergent. Dry flat away from sunlight.',
}
rows = list(csv.reader(open(path, newline='')))
header = rows[0]
COL = 'Fabric & Care (product.metafields.custom.fabric_care)'
if COL not in header:
    header.append(COL)
hi, ti = header.index('Handle'), header.index('Tags')
pi, ci = header.index('Variant Price'), header.index('Variant Compare At Price')
for r in rows[1:]:
    while len(r) < len(header):
        r.append('')
    h = r[hi]
    if r[pi]:
        r[pi] = prices[h][0]
        if r[ci]:
            r[ci] = prices[h][1]
    if r[ti]:  # first row of each product carries tags + metafield
        fabric = next((t.split(':')[1] for t in r[ti].split(', ') if t.startswith('fabric:')), None)
        r[header.index(COL)] = care.get(fabric, '')
with open(path, 'w', newline='') as f:
    csv.writer(f).writerows(rows)
print('CSV updated')
```

Save as a heredoc and run: `python3 - <<'EOF' … EOF`. Expected output: `CSV updated`.

- [x] **Step 2: Verify the CSV**

```bash
python3 -c "
import csv
rows = list(csv.DictReader(open('store-data/products.csv')))
col = 'Fabric & Care (product.metafields.custom.fabric_care)'
assert all(float(r['Variant Price']) >= 2000 for r in rows if r['Variant Price']), 'EGP prices missing'
assert sum(1 for r in rows if r.get(col)) == 10, 'metafield rows'
assert all(r[col].startswith('DUMMY:') for r in rows if r.get(col)), 'dummy marker'
print('CSV OK:', len(rows), 'rows')
"
git diff --stat store-data/products.csv
```
Expected: `CSV OK`, and the diff touches only price/compare-at/metafield/header cells.

- [x] **Step 3: Archive the external product images (link-rot insurance)**

```bash
mkdir -p store-data/images
python3 -c "
import csv, urllib.request
for r in csv.DictReader(open('store-data/products.csv')):
    if r['Image Src']:
        urllib.request.urlretrieve(r['Image Src'], 'store-data/images/' + r['Handle'] + '.png')
        print('saved', r['Handle'])
"
ls store-data/images | wc -l   # expect 10
```
These are dummy AI images on a third-party CDN that can expire; the archive keeps demos working. CSV keeps the URLs (Shopify import needs public URLs). If a URL is already dead, note it in the commit message and continue — the archive is best-effort.

- [x] **Step 4: EGP defaults in section schemas**

In `sections/main-cart.liquid` schema: change `"default": 150` to `"default": 2500` on `free_shipping_threshold`.

In `sections/main-product.liquid` schema: change the `shipping_text` default to:

```json
    { "type": "richtext", "id": "shipping_text", "label": "Shipping accordion text", "default": "<p>DUMMY: Free delivery across Egypt on orders over LE 2,500. Cairo &amp; Giza 1–2 business days, all other governorates 2–4. Returns accepted within 14 days in original, unworn condition.</p>" }
```

- [x] **Step 5: Overhaul `store-data/SETUP.md` for Egypt**

Apply these edits (keep existing section numbering flow; renumber as needed):

1. New **§0 Store settings (Egypt)** before the CSV import section:

```markdown
## 0. Store settings (Egypt)

1. Admin → **Settings** → **Store details** → Store currency: **EGP** (must be set
   BEFORE importing products — prices in the CSV are EGP).
2. Admin → **Settings** → **Markets**: keep a single market, **Egypt** only.
   Remove/deactivate any international market.
3. Admin → **Settings** → **Shipping and delivery** → create one profile, zone
   **Egypt**, with dummy rates (client to confirm):
   - Standard — Cairo & Giza: LE 70, 1–2 business days
   - Standard — all other governorates: LE 100, 2–4 business days
   - Free shipping: orders over LE 2,500 (matches the cart progress bar and
     announcement bar defaults)
4. Admin → **Settings** → **Taxes and duties**: Egypt VAT is 14% — confirm with
   the client's accountant whether prices are tax-inclusive; set
   "Include tax in prices" accordingly (dummy default: inclusive).
```

2. In the CSV import section, add: *"Re-import with **Overwrite existing products** checked if products were imported before this revision (prices are now EGP; size tags and fabric-care metafields were added)."*

3. New metafield section (before the CSV import step order — definition must exist first):

```markdown
## 0b. Metafield definition (before CSV import)

Admin → **Settings** → **Custom data** → **Products** → **Add definition**:
- Name: **Fabric & Care**, Namespace and key: `custom.fabric_care`,
  Type: **Multi-line text**, one entry per product.
The CSV contains a `Fabric & Care (product.metafields.custom.fabric_care)`
column that populates this on import. Values are DUMMY copy.
```

4. Navigation section: already Journal-free after Task 9; add Size guide + policies to the footer menu list.

5. New **Pages & policies** section:

```markdown
## X. Pages & policies (all DUMMY copy — replace with client content)

1. Admin → **Settings** → **Policies** → click **Create from template** for
   Refund, Privacy, and Terms of service. Mark each with a leading line
   "DUMMY — pending legal review." Shopify links them at checkout automatically.
2. Admin → **Content** → **Pages** → create:
   - **About** (handle `about`) — 2 short dummy paragraphs about the brand.
   - **Size Guide** (handle `size-guide` — must match exactly; the product page
     links to it) — a dummy table: XS (EU 34) / S (36) / M (38) / L (40) / XL (42)
     with bust/waist/hip cm columns.
   - **Contact** (handle `contact`) — the theme injects a contact form on this
     handle automatically; body text is one dummy line.
3. Add Shipping/Returns/Privacy links to one of the footer menus.
```

6. Payments section: keep Bogus Gateway for dev; add: *"For go-live in Egypt, the client will need a local provider — Paymob or PayTabs via the Shopify App Store (Shopify Payments is not available in Egypt). Decision pending client."*

7. New final section — the handoff checklist:

```markdown
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
```

- [x] **Step 6: Verify, build, commit**

```bash
npm run build && npx -y @shopify/cli theme check --fail-level error
grep -c 'DUMMY' store-data/SETUP.md    # expect >= 3
git add store-data/ sections/main-cart.liquid sections/main-product.liquid assets/theme.css
git commit -m "store-data: Egypt package — EGP prices, fabric-care metafields, image archive, SETUP overhaul

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 11: End-to-end verification against the dev store

Same harness as the previous plan's Task 3 (`docs/plans/2026-07-10-functional-store-plan.md`), extended for this work. Produce PASS / FAIL / BLOCKED-on-admin per check.

**Files:**
- Create: `docs/plans/2026-07-11-egypt-launch-verification.md` (the report)

- [x] **Step 1: Start the dev server**

```bash
NODE_OPTIONS="--dns-result-order=ipv4first" npx -y @shopify/cli theme dev --store hestia-home-wear.myshopify.com --theme-editor-sync
```
Run in background from the theme root; wait for `http://127.0.0.1:9292`.

- [x] **Step 2: Run the checks**

| # | Check | How |
|---|---|---|
| 1 | OG tags + Organization JSON-LD on home | `curl -s 127.0.0.1:9292/ \| grep -c 'og:'` ≥ 5; `grep -c 'application/ld+json'` ≥ 1 |
| 2 | Announcement bar renders, doesn't overlap hero | curl for the bar text + screenshot/manual check of overlap note in Task 8 |
| 3 | Newsletter form shows the success branch after post | `curl -s -d 'form_type=customer&contact[email]=test@example.com&contact[tags]=newsletter' 127.0.0.1:9292/contact` then GET with the challenge/redirect — if blocked by captcha, mark MANUAL |
| 4 | Product page: swatches have non-blank `background-color: #`, Product JSON-LD present, size-guide link present iff page exists | `curl -s <product-url> \| grep -o 'background-color: #[0-9A-F]*' \| head` |
| 5 | `?variant=` deep link preselects variant | curl `<product-url>?variant=<id>` and grep for `checked` on the matching option value |
| 6 | Prices render as EGP everywhere (Liquid) | `curl -s 127.0.0.1:9292/collections/all \| grep -c 'LE\|EGP\|E£'` > 0 — BLOCKED until admin currency + re-import done |
| 7 | Cart: note textarea present; JS money in browser console: `window.hestiaMoneyFormat` non-`$` | curl + manual console check |
| 8 | Search returns only products | `curl -s '127.0.0.1:9292/search?q=silk&type=product' \| grep -c 'product-card'` matches result count |
| 9 | Address form shows Governorate select for Egypt | curl `/account/addresses` (needs login — mark MANUAL if blocked) |
| 10 | No Journal/blog links anywhere | `curl -s 127.0.0.1:9292/ \| grep -ci 'journal\|/blogs/'` = 0 (after admin menu update) |

- [x] **Step 3: Write the report, fix any FAIL (smallest diff), rebuild, re-verify, commit**

```bash
git add docs/plans/2026-07-11-egypt-launch-verification.md
git commit -m "docs: Egypt launch e2e verification report

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
