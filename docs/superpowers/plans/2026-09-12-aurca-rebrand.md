# Aurca Rebrand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand this Shopify theme from "Hestia" to "Aurca" and redesign its homepage sections to match https://strong-chef-63840685.figma.site/, on the same store/catalog.

**Architecture:** No new subsystems — this reuses the theme's existing token pipeline (`gen-vars.js` → `src/vars.css` → Tailwind), existing dark-mode mechanism, and existing section files (`sections/*.liquid`), editing their markup/copy/schema defaults in place. Two genuinely new pieces: an Instagram/UGC grid section and a localStorage-backed wishlist (no backend, no new dependency).

**Tech Stack:** Shopify Liquid, Tailwind CSS 3 (utility classes, no new plugins), vanilla JS (`assets/theme.js`, no framework), Shopify CLI (`shopify theme dev`) for live preview.

**Spec:** `docs/superpowers/specs/2026-09-12-aurca-rebrand-design.md`

## Global Constraints

- Same product catalog/collections — no new collection structure (spec §"Same store, just rebranded").
- Store is Egypt-only/EGP-only (`store-data/SETUP.md`) — currency selector is cosmetic/theme-side only, do not assume other markets exist (spec §6).
- Products ship without photos (flat color-block via `snippets/swatch.liquid`) — new card design must degrade gracefully to that fallback (spec §6).
- No Arabic translation/RTL this pass — drop the `عربي` control entirely, do not ship it inert (spec §5).
- Do not rename internal-only JS identifiers/localStorage keys (`hestia:appearance`, `hestiaStrings`, `RV_KEY`) — no user-visible impact (spec "Out of scope").
- Do not touch `snippets/swatch.liquid`'s color hex map — tied to existing product tag data, not brand identity (spec "Out of scope").
- Verify every task with `npm run build` (must exit 0) and a visual check via `npx shopify theme dev` before committing.
- Ship both light and dark palettes for every new color decision (dark mode toggle already exists, only token values change).

---

### Task 1: Rebrand color tokens

**Files:**
- Modify: `gen-vars.js` (the `light`, `dark`, `brand` objects, lines 3–38)
- Generated (do not hand-edit): `src/vars.css`

**Interfaces:**
- Produces: `--c-terracotta`, `--c-charcoal`, `--c-cream`, `--c-beige`, `--c-warm-brown`, `--c-maroon` (new) CSS custom properties consumed by every section via Tailwind's `colors` map in `tailwind.config.js` (already wired, no change needed there for colors).

- [ ] **Step 1: Update the `brand` object in `gen-vars.js`**

Replace lines 34–38:

```js
// Brand card (Aurca asset kit) — anchor tokens, identical in both modes
const brand = {
  cream: '#F8F6F1', beige: '#E5D7CD', terracotta: '#A87052',
  'warm-brown': '#97606C', sage: '#494D57', charcoal: '#2D2E2D',
  maroon: '#4A1A28',
};
```

(`sage` keeps its token name so no markup using `bg-sage`/`text-sage` needs renaming, but now points at the Aurca slate `#494D57` instead of a green — the spec found no green in the Aurca palette. `maroon` is new, for sale/limited-edition badges.)

- [ ] **Step 2: Update `light.background` and `light.primary-container` to the new cream**

In the `light` object (lines 3–20), change:
```js
'primary-container': '#f8f6f1',
```
and
```js
background: '#f8f6f1', 'on-background': '#1b1c1c', 'surface-variant': '#e4e2e1',
```
(replacing the old `#f8f3ee`/`#f8f3ee` values with the new cream hex — keep every other key in `light` unchanged, they're structural M3 roles, not brand-specific.)

- [ ] **Step 3: Update `dark.primary-container` and `dark.background` to the new charcoal**

In the `dark` object, change:
```js
'primary-container': '#6F5648',
```
to
```js
'primary-container': '#97606C',
```
and
```js
background: '#2D2D2D', 'on-background': '#F8F3EE', 'surface-variant': '#494740',
```
to
```js
background: '#2D2E2D', 'on-background': '#F8F6F1', 'surface-variant': '#494D57',
```

- [ ] **Step 4: Regenerate and build**

```bash
node gen-vars.js && npm run build
```

Expected: `src/vars.css written` then a clean Tailwind build (exit 0). Open `src/vars.css` and confirm `--c-terracotta: 168 112 82;` (rgb of `#A87052`) appears under `:root`.

- [ ] **Step 5: Visual check**

```bash
npx shopify theme dev
```
Load the preview homepage — the hero CTA pills, "Bestseller" badge, and footer background should now read clay/terracotta instead of the old rust-orange, and the beige footer should read warmer/pinker. Toggle dark mode via the header button and confirm charcoal stays near-black with no washed-out gray.

- [ ] **Step 6: Commit**

```bash
git add gen-vars.js src/vars.css
git commit -m "Rebrand color tokens to Aurca palette"
```

---

### Task 2: Fonts — Inter body, Playfair Display headings

**Files:**
- Modify: `layout/theme.liquid:55` (Google Fonts link)
- Modify: `tailwind.config.js:36-45` (`fontFamily` map)

**Interfaces:**
- Produces: `.font-headline-md`, `.font-headline-sm` now resolve to Playfair Display; `.font-body-lg`, `.font-body-md`, `.font-label-caps` resolve to Inter. `.font-display-lg`/`.font-display-lg-mobile` (hero italic) stay Cormorant Garamond — no change to that mapping.

- [ ] **Step 1: Swap the Google Fonts link**

In `layout/theme.liquid`, replace line 55:
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
```
with:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Playfair+Display:wght@500;600;700&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Update `tailwind.config.js` fontFamily map**

Replace lines 36–44:
```js
fontFamily: {
  // Display: Cormorant Garamond (self-hosted). Section headings: Playfair Display. Body/labels: Inter.
  'display-lg': ['"Cormorant Garamond"', 'serif'],
  'display-lg-mobile': ['"Cormorant Garamond"', 'serif'],
  'headline-md': ['"Playfair Display"', 'serif'],
  'headline-sm': ['"Playfair Display"', 'serif'],
  'body-lg': ['"Inter"', 'sans-serif'],
  'body-md': ['"Inter"', 'sans-serif'],
  'label-caps': ['"Inter"', 'sans-serif'],
},
```

- [ ] **Step 3: Build and verify**

```bash
npm run build
```
Expected: exit 0 (Tailwind doesn't validate font names, so this only checks the build pipeline itself didn't break).

- [ ] **Step 4: Visual check**

`npx shopify theme dev` — confirm section headings ("Shop by Collection", "Featured Pieces", "What Our Customers Say") render in Playfair Display's sharper serif (visibly different from the softer Cormorant Garamond hero italic), and body copy/nav/buttons render in Inter (not the old DM Sans geometric sans).

- [ ] **Step 5: Commit**

```bash
git add layout/theme.liquid tailwind.config.js
git commit -m "Switch body font to Inter and headings to Playfair Display"
```

---

### Task 3: Sort and ship the Aurca logo assets

**Files:**
- Create: `assets/logo-wordmark-cream.svg`, `assets/logo-wordmark-clay.svg`, `assets/logo-monogram.svg`, `assets/logo-monogram-clay.svg`
- Delete: `assets/logo-monogram.png`, `assets/logo-monogram-cream-bg.png`, `assets/logo-wordmark-cream.png`
- Modify: `sections/header.liquid:12-27`, `sections/footer.liquid:4-20,74`, `sections/brand-banner.liquid:2-7`, `layout/theme.liquid:8,37`, `config/settings_schema.json` (favicon info text)

**Interfaces:**
- Produces: theme `asset_url` references `logo-wordmark-cream.svg` / `logo-wordmark-clay.svg` / `logo-monogram.svg` used across header, footer, brand-banner, favicon, and JSON-LD.

- [ ] **Step 1: Identify and copy the source files**

From `aurca assets/`, per the spec's viewBox/fill inspection:
```bash
cd "/mnt/hdd/Untitled Folder/hestia-theme"
cp "aurca assets/Asset 1.svg" assets/logo-wordmark-cream.svg   # viewBox 322.22×64.75, fill #fff
cp "aurca assets/Asset 3.svg" assets/logo-wordmark-clay.svg    # viewBox 322.22×64.75, fill #a87052
cp "aurca assets/Asset 6.svg" assets/logo-monogram.svg         # viewBox 213.34×213.34, fill #fff
cp "aurca assets/Asset 8.svg" assets/logo-monogram-clay.svg    # viewBox 213.34×213.34, fill #a87052
```

- [ ] **Step 2: Open each copied file and sanity-check it renders**

```bash
for f in assets/logo-wordmark-cream.svg assets/logo-wordmark-clay.svg assets/logo-monogram.svg assets/logo-monogram-clay.svg; do
  echo "$f: $(grep -o 'viewBox="[^"]*"' "$f")"
done
```
Expected: the two wordmark files report `viewBox="0 0 322.22 64.75"`, the two monogram files report `viewBox="0 0 213.34 213.34"`. If any file is actually a pattern/illustration instead (wrong pick), re-inspect `aurca assets/` fills with `grep -o 'fill: #[0-9a-fA-F]*'` on the candidate and swap the source filename in Step 1.

- [ ] **Step 3: Replace the header's inline HESTIA wordmark**

In `sections/header.liquid`, replace lines 12–28 (the whole `<a>` block including the inline `<svg>` and its `{%- else -%}` fallback):

```liquid
      <a class="block h-8 max-w-0 group-[.scrolled]:max-w-52 overflow-hidden opacity-0 pointer-events-none group-[.scrolled]:opacity-100 group-[.scrolled]:pointer-events-auto transition-all duration-300" href="{{ routes.root_url }}">
        {%- if section.settings.logo -%}
          <img width="{{ section.settings.logo.width }}" height="{{ section.settings.logo.height }}" src="{{ section.settings.logo | image_url: height: 64 }}" alt="{{ shop.name }}" class="h-full w-auto object-contain">
        {%- else -%}
          {%- comment -%} Aurca wordmark — dark:hidden picks the clay mark once scrolled/light, light mode/dark mode both stay legible {%- endcomment -%}
          <img src="{{ 'logo-wordmark-clay.svg' | asset_url }}" alt="{{ shop.name }}" width="322" height="65" class="h-full w-auto object-contain dark:hidden">
          <img src="{{ 'logo-wordmark-cream.svg' | asset_url }}" alt="{{ shop.name }}" width="322" height="65" class="h-full w-auto object-contain hidden dark:block">
        {%- endif -%}
      </a>
```

Also update line 130's schema info text:
```json
{ "type": "image_picker", "id": "logo", "label": "Logo", "info": "Defaults to the Aurca wordmark" },
```

- [ ] **Step 4: Replace the footer's inline HESTIA wordmark**

In `sections/footer.liquid`, replace lines 4–20:
```liquid
      {%- if section.settings.wordmark -%}
        <img width="{{ section.settings.wordmark.width }}" height="{{ section.settings.wordmark.height }}" src="{{ section.settings.wordmark | image_url: width: 480 }}" alt="{{ shop.name }}" class="h-12 w-auto object-contain mb-4">
      {%- else -%}
        {%- comment -%} Aurca wordmark, clay fill reads on the beige/light footer and dark-mode charcoal alike {%- endcomment -%}
        <img src="{{ 'logo-wordmark-clay.svg' | asset_url }}" alt="{{ shop.name }}" width="322" height="65" class="h-12 w-auto object-contain mb-4">
      {%- endif -%}
```
Update line 83's schema info text: `"info": "Defaults to the Aurca wordmark"`.

Replace line 74 (the small monogram watermark next to socials):
```liquid
      <img width="213" height="213" src="{{ 'logo-monogram.svg' | asset_url }}" alt="" class="w-6 h-6 object-contain opacity-30">
```

- [ ] **Step 5: Replace the brand-banner watermark**

In `sections/brand-banner.liquid`, replace lines 2–7 (both `logo-monogram.png` references) with `logo-monogram.svg`, keeping the same classes:
```liquid
  <div class="absolute right-[-10%] top-1/2 -translate-y-1/2 opacity-10 w-[500px] h-[500px]">
    <img width="213" height="213" src="{{ 'logo-monogram.svg' | asset_url }}" alt="" class="w-full h-full object-contain invert" loading="lazy">
  </div>
  <div class="max-w-4xl mx-auto px-margin-mobile text-center relative z-10">
    <div class="mb-8 flex justify-center">
      <img width="213" height="213" src="{{ 'logo-monogram.svg' | asset_url }}" alt="" class="w-12 h-12 object-contain invert opacity-60" loading="lazy">
    </div>
```

- [ ] **Step 6: Update the favicon and JSON-LD logo references**

In `layout/theme.liquid` line 8:
```liquid
<link rel="icon" type="image/png" href="{{ settings.favicon | default: 'logo-monogram-clay.svg' | asset_url }}">
```
Line 37 (inside the `index` JSON-LD block):
```liquid
"logo": {{ 'logo-monogram-clay.svg' | asset_url | prepend: 'https:' | json }}
```
And in `config/settings_schema.json`, update the favicon setting's info text from "Defaults to the Xi monogram" to "Defaults to the Aurca monogram".

- [ ] **Step 7: Delete the now-unused PNG logos**

```bash
git rm assets/logo-monogram.png assets/logo-monogram-cream-bg.png assets/logo-wordmark-cream.png
```

- [ ] **Step 8: Build and visual check**

```bash
npm run build && npx shopify theme dev
```
Confirm the header wordmark, footer wordmark, footer monogram watermark, and brand-banner watermark all render (no broken image icons) in both light and dark mode, and the browser tab favicon updates.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Swap Hestia PNG logos for Aurca SVG wordmark/monogram"
```

---

### Task 4: Brand copy sweep (Hestia → Aurca)

**Files:**
- Modify: `config/settings_schema.json:4,6`, `sections/brand-banner.liquid:26`, `sections/footer.liquid:84`, `package.json:2`

**Interfaces:** none (copy-only).

- [ ] **Step 1: Update theme metadata**

In `config/settings_schema.json`, change:
```json
"theme_name": "Aurca",
```
and
```json
"theme_author": "AURCA",
```

- [ ] **Step 2: Update the brand-banner default copy**

In `sections/brand-banner.liquid` line 26, replace the `text` setting's default:
```json
{ "type": "textarea", "id": "text", "label": "Text", "default": "Aurca is a domestic sanctuary brand. We believe the home is a sacred space, and what you wear should reflect the tranquility you seek within your four walls. Every piece is designed to be lived in, washed, and cherished for years to come." },
```
Also update the `heading` default on line 25 to match the reference site's register:
```json
{ "type": "text", "id": "heading", "label": "Heading", "default": "Dressed for the Hours Between" },
```

- [ ] **Step 3: Update the footer newsletter default copy**

In `sections/footer.liquid` line 84, replace the default:
```json
{ "type": "textarea", "id": "newsletter_text", "label": "Newsletter text", "default": "Luxury homewear for the sacred hours between waking and sleeping. Est. 2018." },
```

- [ ] **Step 4: Update `package.json`**

```json
"name": "aurca-theme",
```

- [ ] **Step 5: Grep to confirm no remaining user-facing "Hestia" strings**

```bash
grep -rn -i "hestia" config/ sections/ layout/ templates/ locales/ package.json | grep -vi "hestia:appearance\|hestiaStrings\|hestiaMoneyFormat"
```
Expected: no output (all remaining `hestia*` hits are the internal JS identifiers explicitly out of scope per the Global Constraints).

- [ ] **Step 6: Commit**

```bash
git add config/settings_schema.json sections/brand-banner.liquid sections/footer.liquid package.json
git commit -m "Sweep brand copy from Hestia to Aurca"
```

---

### Task 5: Announcement bar + header nav/currency, drop language switcher

**Files:**
- Modify: `sections/header.liquid:1-8,39-43`

**Interfaces:**
- Produces: a static announcement strip above the nav (not the existing `section.settings.announcement` single-line bar — that setting stays for merchant-editable text, but gets a new default matching the reference).
- Consumes: `localization.available_countries`/`localization.country` (Shopify's native localization objects) for the currency form.

- [ ] **Step 1: Give the announcement bar the reference copy as its default**

In `sections/header.liquid`, update the schema default (line 132):
```json
{ "type": "text", "id": "announcement", "label": "Announcement bar text", "default": "Free shipping over $150 · Complimentary gift wrapping · 30-day returns" }
```
(Leave the `$150` in USD as shipped copy for now — the merchant edits this field directly for EGP amounts; it's merchant-editable text, not hardcoded logic.)

- [ ] **Step 2: Restyle the announcement bar div to the new dark/clay treatment**

Replace line 4:
```liquid
    <div class="bg-charcoal text-cream text-center py-2 px-margin-mobile font-label-caps text-[11px] uppercase tracking-widest">
```
(was `bg-sage text-charcoal` — the reference shows a near-black bar with light text, not the old sage-on-charcoal combination.)

- [ ] **Step 3: Add a currency form next to the existing icon row**

Replace line 39 (`<div class="flex items-center gap-6">`) — insert a currency `<details>`/`<form>` immediately after it opens, before the dark-mode toggle button:

```liquid
    <div class="flex items-center gap-6">
      {%- if localization.available_countries.size > 1 -%}
        <details class="relative group/currency">
          <summary class="list-none cursor-pointer font-label-caps text-label-caps text-cream group-[.scrolled]:text-on-surface-variant transition-colors">{{ localization.country.currency.iso_code }}</summary>
          {% form 'localization' %}
            <div class="absolute right-0 top-full mt-2 bg-surface border border-outline-variant/30 rounded-xl shadow-lg py-2 z-50 min-w-[100px]">
              {%- for country in localization.available_countries -%}
                <button type="submit" name="country_code" value="{{ country.iso_code }}"
                        class="w-full text-left px-4 py-2 font-label-caps text-label-caps hover:bg-surface-container {% if country.iso_code == localization.country.iso_code %}text-primary{% else %}text-on-surface-variant{% endif %}">
                  {{ country.currency.iso_code }}
                </button>
              {%- endfor -%}
            </div>
          {% endform %}
        </details>
      {%- endif -%}
      <button data-theme-toggle class="material-symbols-outlined text-cream group-[.scrolled]:text-on-surface-variant group-[.scrolled]:hover:text-primary transition-colors" aria-label="{{ 'general.toggle_theme' | t }}">
```
(The `{%- if localization.available_countries.size > 1 -%}` guard means this renders nothing extra on the current single-market EGP store — it activates automatically the moment more markets exist, per spec §6, with zero further theme changes.)

- [ ] **Step 4: Confirm there is no language switcher to remove**

```bash
grep -n "عربي\|available_languages\|language" sections/header.liquid
```
Expected: no output — the current theme never had one built (only the Figma mock shows it), so there's nothing to delete; this step is a verification, not an edit.

- [ ] **Step 5: Build and visual check**

```bash
npm run build && npx shopify theme dev
```
Confirm the announcement bar reads the new copy on a near-black strip, and the header icon row shows no currency control (single-market guard hides it) — this is expected and correct for the current store.

- [ ] **Step 6: Commit**

```bash
git add sections/header.liquid
git commit -m "Restyle announcement bar and add market-aware currency selector"
```

---

### Task 6: New trust-marquee section (scrolling ticker strip)

**Files:**
- Create: `sections/trust-marquee.liquid`

**Interfaces:**
- Produces: a `trust-marquee` section type for `templates/index.json` (Task 13).
- Consumes: the existing `.animate-marquee`/`@keyframes marquee` CSS already defined in `src/theme.css` (confirmed present — no new CSS needed, this section only needed markup).

**Note:** the design spec's §4 table mapped this to `sections/brand-banner.liquid`, but that file is a centered brand-story block (heading + paragraph + link), not a horizontal scrolling ticker — it doesn't fit this content shape and stays out of the homepage per Task 13. This is a new, separate section instead.

- [ ] **Step 1: Confirm the marquee animation utility already exists**

```bash
grep -n "animate-marquee\|@keyframes marquee" "/mnt/hdd/Untitled Folder/hestia-theme/src/theme.css"
```
Expected: both present (they were seen during spec research). If missing, add before writing the section:
```css
@keyframes marquee {
  0% { transform: translate(0); }
  to { transform: translate(-50%); }
}
.animate-marquee { animation: 28s linear infinite marquee; }
```

- [ ] **Step 2: Write the section file**

```liquid
{%- comment -%}
  Scrolling trust-strip ticker (Free Shipping / Handcrafted With Love / etc).
  Two copies of the same list rendered back to back — .animate-marquee scrolls
  exactly 50% (one full list-width) so the loop is seamless.
{%- endcomment -%}
<section class="bg-charcoal text-cream py-4 overflow-hidden fade-in-section" aria-label="{{ section.settings.heading | default: 'Store benefits' }}">
  <div class="flex w-max animate-marquee">
    {%- assign items = section.settings.items | split: '|' -%}
    {%- for rep in (1..2) -%}
      <div class="flex items-center shrink-0">
        {%- for item in items -%}
          <span class="font-label-caps text-label-caps uppercase tracking-widest px-8 whitespace-nowrap">{{ item | strip }}</span>
          <span class="text-cream/40" aria-hidden="true">&bull;</span>
        {%- endfor -%}
      </div>
    {%- endfor -%}
  </div>
</section>

{% schema %}
{
  "name": "Trust marquee",
  "settings": [
    {
      "type": "textarea",
      "id": "items",
      "label": "Items (pipe-separated)",
      "default": "Free Shipping Over $150|Handcrafted With Love|New Arrivals Weekly|Ethically Sourced Fabrics|Complimentary Gift Wrapping|Free Returns Within 30 Days"
    }
  ],
  "presets": [{ "name": "Trust marquee" }]
}
{% endschema %}
```

- [ ] **Step 3: Build and visual check**

```bash
npm run build && npx shopify theme dev
```
Confirm a near-black strip scrolls the six items continuously left with no visible seam/jump at the loop point, in both light and dark mode (it's a fixed dark strip regardless of site mode, matching the reference).

- [ ] **Step 4: Commit**

```bash
git add sections/trust-marquee.liquid
git commit -m "Add new trust-marquee ticker section"
```

---

### Task 7: Hero — headline/subhead/CTA per slide

**Files:**
- Modify: `sections/slider.liquid` (whole file)

**Interfaces:**
- Consumes: existing `assets/slider-1.jpg`…`slider-5.jpg` (no new photography supplied — spec §6 confirms reuse of existing lifestyle photography).
- Produces: a `data-slide-index`/`data-slide-count` pair theme.js can read for a counter (new — theme.js change is Step 4 below).

- [ ] **Step 1: Add per-slide copy as a lookup array and render headline/subhead/CTA over each slide**

Replace the whole file:

```liquid
{%- comment -%}
  Home carousel — native CSS scroll-snap does the swiping (no arrows),
  theme.js auto-advances every 5s. Slides ship as theme assets.
  Per-slide copy lives in `slides` below — ponytail: hardcoded, add
  blocks/schema settings if the merchant ever needs to edit this from the editor.
{%- endcomment -%}
<section class="fade-in-section">
  <div class="relative">
  {%- comment -%} h-svh: full first screen, no gap below; svh so mobile URL-bar collapse doesn't resize it {%- endcomment -%}
  <div data-slider class="flex overflow-x-auto snap-x snap-mandatory no-scrollbar w-full h-svh">
    {%- comment -%} Clones of the last/first slide at each end make the loop seamless; theme.js teleports off them {%- endcomment -%}
    <img src="{{ 'slider-5.jpg' | asset_url }}" alt="" aria-hidden="true" width="2400" height="1350"
         class="w-full h-full object-cover shrink-0 snap-center" loading="lazy">
    {%- assign eyebrows = 'Women\'s Essentials,Men\'s Essentials,Together Edition,New Collection — 2024,Limited Edition' | split: ',' -%}
    {%- assign headlines = 'Graceful silhouettes, made to be lived in.,Refined comfort, without compromise.,Shared mornings, shared ease.,Dressed for the Hours Between,Quiet luxury for every hour.' | split: ',' -%}
    {%- assign subheads = 'From mulberry silk to organic cotton — every piece shaped around a woman who actually lives.,Premium natural fabrics in precise cuts. Ease and elegance, at every hour.,Matching sets for the moments you share.,Luxurious pyjamas and homewear for morning rituals, afternoon ease, and quiet evenings.,Our most considered pieces, in limited runs.' | split: ',' -%}
    {%- assign ctas = 'Explore Women\'s,Explore Men\'s,Explore Together,Shop the Collection,Explore Limited Edition' | split: ',' -%}
    {%- assign cta_links = '/collections/women,/collections/men,/collections/together,/collections/all,/collections/all' | split: ',' -%}
    {%- for i in (1..5) -%}
      {%- assign idx = forloop.index0 -%}
      {%- assign img = 'slider-' | append: forloop.index | append: '.jpg' -%}
      <div class="relative w-full h-full shrink-0 snap-center">
        <img src="{{ img | asset_url }}" alt="{{ shop.name }} lookbook {{ forloop.index }}"
             width="2400" height="1350"
             class="w-full h-full object-cover"
             {% if forloop.first %}fetchpriority="high"{% else %}loading="lazy"{% endif %}>
        <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>
        <div class="absolute inset-0 flex items-center">
          <div class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
            <div class="max-w-xl">
              <span class="font-label-caps text-label-caps uppercase text-cream/80 tracking-widest mb-4 block">{{ eyebrows[idx] }}</span>
              <h1 class="font-display-lg text-display-lg-mobile md:text-display-lg text-cream mb-6 italic">{{ headlines[idx] }}</h1>
              <p class="font-body-lg text-cream/90 max-w-md mb-8">{{ subheads[idx] }}</p>
              <a href="{{ cta_links[idx] }}" class="inline-block bg-terracotta text-white px-8 py-4 font-label-caps text-label-caps uppercase tracking-widest hover:brightness-110 transition-all">
                {{ ctas[idx] }} &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    {%- endfor -%}
    <img src="{{ 'slider-1.jpg' | asset_url }}" alt="" aria-hidden="true" width="2400" height="1350"
         class="w-full h-full object-cover shrink-0 snap-center" loading="lazy">
  </div>
  <script>
    // Position on the real first slide before paint, so the leading clone never flashes
    (function () {
      var s = document.querySelector('[data-slider]');
      s.scrollLeft = s.clientWidth;
    })();
  </script>

  <div data-slide-counter class="absolute bottom-8 right-8 z-10 font-label-caps text-label-caps text-cream tracking-widest">
    <span data-slide-current>01</span> <span class="opacity-50">— 05</span>
  </div>
  </div>

  {%- comment -%} Brand pattern ribbon separating the slider from the page (see .pattern-divider) {%- endcomment -%}
  <div class="pattern-divider h-12 bg-surface my-[5px]" aria-hidden="true"></div>

  {%- comment -%} Lifestyle triptych (branding/after the slider) — links to the three lines, zoom on hover {%- endcomment -%}
  <div class="grid grid-cols-3 gap-[5px]">
    {%- assign trip_alts = 'Women,Men,Together' | split: ',' -%}
    {%- for i in (1..3) -%}
      {%- assign trip = 'triptych-' | append: forloop.index | append: '.jpg' -%}
      <a href="/collections/{{ trip_alts[forloop.index0] | downcase }}" class="bento-card-zoom block overflow-hidden">
        <img src="{{ trip | asset_url }}" alt="{{ shop.name }} — {{ trip_alts[forloop.index0] }}"
             width="960" height="1620" loading="lazy" class="w-full h-auto object-cover">
      </a>
    {%- endfor -%}
  </div>

  <div class="pattern-divider h-12 bg-surface my-[5px]" aria-hidden="true"></div>
</section>

{% schema %}
{
  "name": "Slider",
  "settings": [],
  "presets": [{ "name": "Slider" }]
}
{% endschema %}
```

(This drops the old bottom Men/Women/Together glass-button row — those links now live in the "Shop by Collection" section below, and duplicating them in the hero read as redundant against the reference, which shows one CTA per slide, not three persistent buttons.)

- [ ] **Step 2: Add the slide-counter update to `theme.js`**

Find the slider auto-advance logic in `assets/theme.js` (search for `data-slider` — it's near the top, alongside the scroll-snap position script). Add, immediately after the existing slider auto-advance interval is set up:

```js
  var counterEl = document.querySelector('[data-slide-current]');
  if (slider && counterEl) {
    var updateCounter = function () {
      var slides = slider.children.length - 2; // minus the two clones
      var index = Math.round(slider.scrollLeft / slider.clientWidth) - 1;
      index = ((index % slides) + slides) % slides;
      counterEl.textContent = String(index + 1).padStart(2, '0');
    };
    slider.addEventListener('scroll', updateCounter);
    updateCounter();
  }
```
Use the actual local variable name theme.js already gave `document.querySelector('[data-slider]')` in that function (read the surrounding code first — do not redeclare `slider` if it's already in scope under a different name).

- [ ] **Step 3: Build and visual check**

```bash
npm run build && npx shopify theme dev
```
Confirm each slide shows an eyebrow label, italic headline, subhead, and one CTA button; the bottom-right counter advances as slides scroll/auto-advance.

- [ ] **Step 4: Commit**

```bash
git add sections/slider.liquid assets/theme.js
git commit -m "Redesign hero slider with per-slide headline/subhead/CTA and counter"
```

---

### Task 8: "Shop by Collection" — badges + eyebrow copy

**Files:**
- Modify: `sections/category-bento.liquid`

**Interfaces:** none new — extends existing block schema with two optional text fields.

- [ ] **Step 1: Add `badge` and `eyebrow` settings to the `category` block schema**

In the `blocks[0].settings` array (around line 63), add two entries before `title`:
```json
        { "type": "text", "id": "badge", "label": "Badge (optional)", "info": "e.g. New Arrivals, Limited Edition" },
        { "type": "text", "id": "eyebrow", "label": "Eyebrow", "info": "e.g. The Feminine Edit" },
```

- [ ] **Step 2: Render the badge and eyebrow in both card layouts**

In the first `<a>` block (2-card row, around line 21), replace:
```liquid
        <div class="absolute bottom-8 left-8">
          <span class="font-label-caps text-label-caps text-white mb-2 block tracking-widest">{{ forloop.index | prepend: '0' }}</span>
          <h3 class="font-headline-sm text-headline-sm text-white">{{ block.settings.title | default: block.settings.collection.title }}</h3>
        </div>
```
with:
```liquid
        {%- if block.settings.badge != blank -%}
          <span class="absolute top-6 left-6 bg-maroon text-white px-3 py-1 font-label-caps text-[10px] tracking-widest uppercase">{{ block.settings.badge }}</span>
        {%- endif -%}
        <div class="absolute bottom-8 left-8">
          {%- if block.settings.eyebrow != blank -%}
            <span class="font-label-caps text-label-caps text-white/70 mb-2 block tracking-widest uppercase">{{ block.settings.eyebrow }}</span>
          {%- endif -%}
          <h3 class="font-headline-sm text-headline-sm text-white mb-2">{{ block.settings.title | default: block.settings.collection.title }}</h3>
          <span class="font-label-caps text-label-caps text-white/90 uppercase tracking-widest border-b border-white/50 pb-1">{{ 'general.explore' | t }} &rarr;</span>
        </div>
```
(Drop the `01`/`02` numeral label — the reference uses badge+eyebrow instead of numbering.)

- [ ] **Step 3: Add the `general.explore` locale string**

In `locales/en.default.json`, inside `"general"`, add:
```json
    "explore": "Explore",
```

- [ ] **Step 4: Update the preset defaults to match the reference copy**

In the schema `presets[0].blocks` (around line 74), give each block its own settings:
```json
    {
      "name": "Category bento",
      "blocks": [
        { "type": "category", "settings": { "title": "Women", "eyebrow": "The Feminine Edit", "badge": "New Arrivals" } },
        { "type": "category", "settings": { "title": "Men", "eyebrow": "The Essential Range" } },
        { "type": "category", "settings": { "title": "Together", "eyebrow": "The Luxury Reserve", "badge": "Limited Edition" } }
      ]
    }
```
Also update the section-level `heading`/`link_label` defaults (lines 56–57) to match the reference: `"default": "Shop by Collection"` and `"default": "View All"`.

- [ ] **Step 5: Build and visual check**

```bash
npm run build && npx shopify theme dev
```
Confirm the Women/Together cards show a maroon badge chip top-left, and all three show an eyebrow line + "Explore →" instead of the old `01`/`02` numeral.

- [ ] **Step 6: Commit**

```bash
git add sections/category-bento.liquid locales/en.default.json
git commit -m "Add badge/eyebrow treatment to Shop by Collection cards"
```

---

### Task 9: "Featured Pieces" — filter pills, product-card badges/swatches/wishlist

**Files:**
- Modify: `sections/featured-products.liquid`
- Modify: `snippets/product-card.liquid`
- Modify: `assets/theme.js` (filter pill click handling + wishlist)
- Modify: `locales/en.default.json`

**Interfaces:**
- Produces: `localStorage['aurca:wishlist']` (array of product IDs), `window.aurcaWishlist.has(id)` / `.toggle(id)` helper other snippets could reuse (none do yet — kept minimal).
- Consumes: product `type` (Women/Men/Together) for filter-pill matching — this store already tags products `men`/`women`/`together` per `store-data/SETUP.md`; the pills filter on that tag.

- [ ] **Step 1: Add the filter pill row to `featured-products.liquid`**

Replace the section's opening heading block (lines 2–19) to add an eyebrow + filter pills under the heading:

```liquid
  <div class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-16">
    <div class="text-center mb-8">
      {%- if section.settings.eyebrow != blank -%}
        <span class="font-label-caps text-label-caps uppercase text-on-secondary-container mb-4 block">{{ section.settings.eyebrow }}</span>
      {%- endif -%}
      <h2 class="font-headline-md text-headline-md">{{ section.settings.heading }}</h2>
    </div>
    <div data-product-filters class="flex justify-center gap-2">
      <button type="button" data-filter="all" class="is-active font-label-caps text-label-caps uppercase px-5 py-2 border border-outline-variant data-[active=true]:bg-terracotta data-[active=true]:text-white data-[active=true]:border-terracotta" data-active="true">{{ 'general.all' | t }}</button>
      <button type="button" data-filter="women" class="font-label-caps text-label-caps uppercase px-5 py-2 border border-outline-variant hover:border-primary">{{ 'general.women' | t }}</button>
      <button type="button" data-filter="men" class="font-label-caps text-label-caps uppercase px-5 py-2 border border-outline-variant hover:border-primary">{{ 'general.men' | t }}</button>
      <button type="button" data-filter="together" class="font-label-caps text-label-caps uppercase px-5 py-2 border border-outline-variant hover:border-primary">{{ 'general.together' | t }}</button>
    </div>
  </div>
```

Keep the carousel prev/next buttons — move them to float at the section's outer edges via existing markup below, unchanged.

- [ ] **Step 2: Tag each product card with its type for filtering**

In the `{%- for product in products limit: section.settings.limit -%}` loop, wrap each card's outer `<div>` with a `data-product-type`:
```liquid
        <div class="min-w-[280px] md:min-w-[360px] snap-start group" data-product-type="{% if product.tags contains 'women' %}women{% elsif product.tags contains 'men' %}men{% elsif product.tags contains 'together' %}together{% else %}all{% endif %}">
          {% render 'product-card', product: product, show_quick_add: true %}
        </div>
```
(Route this loop through `product-card.liquid` instead of the inline `<h4>`/`{% render 'price' %}` pair it currently has — the card snippet is where badges/swatches/wishlist get added in Step 4, and reusing it avoids duplicating that markup here.)

- [ ] **Step 3: Add locale strings for the filter labels**

In `locales/en.default.json`, inside `"general"`, add:
```json
    "all": "All",
    "women": "Women",
    "men": "Men",
    "together": "Together",
```

- [ ] **Step 4: Extend `product-card.liquid` with eyebrow, wishlist heart, and color-swatch dots**

Replace the whole file:

```liquid
{%- comment -%}
  Product card per the Aurca mockup. Accepts: product, show_quick_add (bool)
{%- endcomment -%}
<div class="product-card group relative">
  <div class="relative mb-6">
    <a href="{{ product.url }}" class="block aspect-[3/4] overflow-hidden rounded-xl bg-primary-container product-shadow relative">
      {%- if product.available == false -%}
        <span class="absolute top-4 left-4 z-10 bg-charcoal text-white px-3 py-1 rounded-full font-label-caps text-[10px] tracking-widest uppercase">{{ 'products.sold_out' | t }}</span>
      {%- elsif product.compare_at_price > product.price -%}
        <span class="absolute top-4 left-4 z-10 bg-maroon text-white px-3 py-1 rounded-full font-label-caps text-[10px] tracking-widest uppercase">-{{ product.compare_at_price | minus: product.price | times: 100 | divided_by: product.compare_at_price }}%</span>
      {%- elsif product.created_at > 'now' | date: '%s' | minus: 2592000 -%}
        <span class="absolute top-4 left-4 z-10 bg-terracotta text-white px-3 py-1 rounded-full font-label-caps text-[10px] tracking-widest uppercase">{{ 'products.new' | t }}</span>
      {%- endif -%}
      {%- if product.featured_image -%}
        <img width="{{ product.featured_image.width }}" height="{{ product.featured_image.height }}" src="{{ product.featured_image | image_url: width: 720 }}"
             srcset="{{ product.featured_image | image_url: width: 360 }} 360w, {{ product.featured_image | image_url: width: 720 }} 720w"
             sizes="(min-width: 768px) 360px, 90vw"
             alt="{{ product.featured_image.alt | escape }}" loading="lazy"
             class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
      {%- else -%}
        {% render 'swatch', item: product %}
      {%- endif -%}
    </a>
    <button type="button" data-wishlist-toggle="{{ product.id }}" class="wishlist-btn absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-surface/80 backdrop-blur-sm flex items-center justify-center" aria-label="{{ 'products.add_to_wishlist' | t }}" aria-pressed="false">
      <span class="material-symbols-outlined icon-fill text-[18px]">favorite</span>
    </button>
    {%- if show_quick_add and product.variants.size == 1 and product.available -%}
      <button type="button" data-quick-add="{{ product.first_available_variant.id }}"
              class="quick-add-btn opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 focus-visible:opacity-100 focus-visible:translate-y-0 absolute bottom-6 left-6 right-6 bg-terracotta text-white py-3 rounded-xl font-label-caps text-label-caps uppercase transition-all duration-300 hover:brightness-90">
        {{ 'products.quick_add' | t }}
      </button>
    {%- endif -%}
  </div>
  <div class="space-y-1">
    {%- if product.type != blank or product.vendor != blank -%}
      <p class="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-widest">{{ product.type }}{% if product.type != blank and product.vendor != blank %} · {% endif %}{{ product.vendor }}</p>
    {%- endif -%}
    <h3 class="font-headline-sm text-headline-sm text-primary"><a href="{{ product.url }}">{{ product.title }}</a></h3>
    {% render 'price', item: product %}
    {%- if product.options_with_values.size > 0 -%}
      {%- for option in product.options_with_values -%}
        {%- if option.name == 'Color' -%}
          <div class="flex gap-1 pt-1">
            {%- for value in option.values limit: 4 -%}
              <span class="w-3 h-3 rounded-full border border-outline-variant/50" style="background-color: {{ value | handleize | replace: '-', '' }}"></span>
            {%- endfor -%}
          </div>
        {%- endif -%}
      {%- endfor -%}
    {%- endif -%}
    <a href="{{ product.url }}#ask-a-question" class="block font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest underline pt-1">{{ 'products.ask_a_question' | t }}</a>
  </div>
</div>
```

(The color-swatch `background-color` uses the option value as a raw CSS color keyword when it's already a color name — this only renders correctly for options whose values are literal CSS colors, e.g. "navy", "cream"; it's a best-effort visual, not a lookup table, matching the ladder's "don't build a mapping table for a decoration" call. `products.new` badge threshold matches "New" only for products created in the last 30 days — a reasonable proxy since there's no merchant-facing "is new" flag in this catalog.)

- [ ] **Step 5: Add the new locale strings**

In `locales/en.default.json`, inside `"products"`, add:
```json
    "new": "New",
    "add_to_wishlist": "Add to wishlist",
    "ask_a_question": "Ask a question",
```

- [ ] **Step 6: Add filter-pill and wishlist JS to `assets/theme.js`**

Append to the end of the file (before the closing IIFE brace, alongside the other `document.querySelectorAll` wiring near the bottom):

```js
  // Featured Pieces filter pills
  var filterBar = document.querySelector('[data-product-filters]');
  if (filterBar) {
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-filter]');
      if (!btn) return;
      filterBar.querySelectorAll('[data-filter]').forEach(function (b) {
        b.dataset.active = 'false';
      });
      btn.dataset.active = 'true';
      var type = btn.dataset.filter;
      document.querySelectorAll('[data-product-type]').forEach(function (card) {
        var show = type === 'all' || card.dataset.productType === type;
        card.style.display = show ? '' : 'none';
      });
    });
  }

  // Wishlist — localStorage-only, no backend
  var WISHLIST_KEY = 'aurca:wishlist';
  var getWishlist = function () {
    try { return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]'); } catch (e) { return []; }
  };
  var setWishlistButtonState = function (btn, active) {
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    btn.classList.toggle('text-terracotta', active);
  };
  document.querySelectorAll('[data-wishlist-toggle]').forEach(function (btn) {
    var id = btn.getAttribute('data-wishlist-toggle');
    setWishlistButtonState(btn, getWishlist().indexOf(id) !== -1);
  });
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-wishlist-toggle]');
    if (!btn) return;
    var id = btn.getAttribute('data-wishlist-toggle');
    var list = getWishlist();
    var i = list.indexOf(id);
    if (i === -1) { list.push(id); } else { list.splice(i, 1); }
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    setWishlistButtonState(btn, i === -1);
  });
```

- [ ] **Step 7: Update section schema defaults**

In `sections/featured-products.liquid` schema, change:
```json
{ "type": "text", "id": "eyebrow", "label": "Eyebrow", "default": "Curated for you" },
{ "type": "text", "id": "heading", "label": "Heading", "default": "Featured Pieces" },
```

- [ ] **Step 8: Build and visual check**

```bash
npm run build && npx shopify theme dev
```
Click each filter pill and confirm cards for other types hide/show; click the wishlist heart on a card and confirm it turns terracotta and stays that way after a page reload (localStorage persists); confirm sold-out/-%/New badges render correctly against real catalog data.

- [ ] **Step 9: Commit**

```bash
git add sections/featured-products.liquid snippets/product-card.liquid assets/theme.js locales/en.default.json
git commit -m "Add filter pills, wishlist, and richer badges to Featured Pieces"
```

---

### Task 10: New "Life in Aurca" Instagram/UGC grid section

**Files:**
- Create: `sections/instagram-grid.liquid`

**Interfaces:**
- Produces: a `instagram-grid` section type, addable via the theme editor and referenced by handle in `templates/index.json` (Task 11).
- Consumes: theme asset images the merchant uploads via `image_picker` blocks (no hardcoded filenames — unlike the hero, this section has no existing photography to reuse, so it ships block-driven from the start).

- [ ] **Step 1: Write the section file**

```liquid
{%- comment -%}
  "Life in Aurca" UGC/Instagram-style masonry grid. Each block is one photo;
  the first block renders large (spans 2 rows), the rest render as a 2-col grid —
  matches the reference site's asymmetric layout. Merchant-editable via blocks
  (no product/Instagram API dependency).
{%- endcomment -%}
<section class="py-section-padding px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto fade-in-section">
  <div class="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4">
    <div>
      <span class="font-label-caps text-label-caps uppercase text-on-secondary-container mb-4 block">{{ section.settings.eyebrow }}</span>
      <h2 class="font-headline-md text-headline-md">{{ section.settings.heading }}</h2>
    </div>
    {%- if section.settings.instagram_url != blank -%}
      <a class="font-label-caps text-label-caps uppercase text-on-surface-variant border-b border-outline-variant hover:border-primary transition-colors pb-1"
         href="{{ section.settings.instagram_url }}">{{ section.settings.link_label }}</a>
    {%- endif -%}
  </div>

  <div class="grid grid-cols-2 md:grid-cols-3 gap-gutter">
    {%- for block in section.blocks -%}
      <a href="{{ section.settings.instagram_url | default: '#' }}"
         class="relative overflow-hidden rounded-2xl bento-card-zoom block {% if forloop.first %}col-span-2 row-span-2 aspect-square md:aspect-auto{% else %}aspect-square{% endif %}"
         {{ block.shopify_attributes }}>
        {%- if block.settings.image -%}
          <img width="{{ block.settings.image.width }}" height="{{ block.settings.image.height }}" src="{{ block.settings.image | image_url: width: 800 }}" alt="{{ block.settings.caption | escape }}" loading="lazy" class="w-full h-full object-cover">
        {%- else -%}
          {{ 'lifestyle-1' | placeholder_svg_tag: 'w-full h-full object-cover' }}
        {%- endif -%}
        {%- if block.settings.caption != blank -%}
          <div class="absolute bottom-4 left-4">
            {%- if block.settings.tag != blank -%}
              <span class="font-label-caps text-[10px] text-white/80 uppercase tracking-widest block mb-1">{{ block.settings.tag }}</span>
            {%- endif -%}
            <span class="font-headline-sm text-[16px] text-white">{{ block.settings.caption }}</span>
          </div>
        {%- endif -%}
      </a>
    {%- endfor -%}
  </div>
</section>

{% schema %}
{
  "name": "Instagram grid",
  "max_blocks": 6,
  "settings": [
    { "type": "text", "id": "eyebrow", "label": "Eyebrow", "default": "@aurca" },
    { "type": "text", "id": "heading", "label": "Heading", "default": "Life in Aurca" },
    { "type": "url", "id": "instagram_url", "label": "Instagram URL" },
    { "type": "text", "id": "link_label", "label": "Link label", "default": "Follow on Instagram" }
  ],
  "blocks": [
    {
      "type": "photo",
      "name": "Photo",
      "settings": [
        { "type": "image_picker", "id": "image", "label": "Image" },
        { "type": "text", "id": "tag", "label": "Tag (optional)", "info": "e.g. Women · Silk Edit" },
        { "type": "text", "id": "caption", "label": "Caption", "info": "e.g. Morning Ritual" }
      ]
    }
  ],
  "presets": [
    {
      "name": "Instagram grid",
      "blocks": [
        { "type": "photo" }, { "type": "photo" }, { "type": "photo" },
        { "type": "photo" }, { "type": "photo" }
      ]
    }
  ]
}
{% endschema %}
```

- [ ] **Step 2: Build and verify the section registers**

```bash
npm run build && npx shopify theme dev
```
In the theme editor, add an "Instagram grid" section to the home page and confirm it appears in the section picker with 5 placeholder photo blocks (rendering the `lifestyle-1` placeholder SVG since no images are uploaded yet).

- [ ] **Step 3: Commit**

```bash
git add sections/instagram-grid.liquid
git commit -m "Add new Instagram/UGC grid section"
```

---

### Task 11: Testimonials — star rating + reference copy

**Files:**
- Modify: `sections/testimonial.liquid`

**Interfaces:** none new.

- [ ] **Step 1: Add a star-rating row above the quote**

Replace lines 1–6:
```liquid
<section class="py-section-padding px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center fade-in-section">
  <div class="max-w-3xl mx-auto">
    <span class="font-label-caps text-label-caps uppercase text-on-secondary-container mb-4 block">{{ 'general.customer_love' | t }}</span>
    <div class="flex justify-center gap-1 mb-6 text-terracotta" aria-hidden="true">
      {%- for i in (1..5) -%}<span class="material-symbols-outlined icon-fill text-[18px]">star</span>{%- endfor -%}
    </div>
    <blockquote class="font-headline-md text-headline-md mb-8 leading-snug text-primary">
      &ldquo;{{ section.settings.quote }}&rdquo;
    </blockquote>
```

- [ ] **Step 2: Add the `general.customer_love` locale string**

In `locales/en.default.json`, inside `"general"`:
```json
    "customer_love": "Customer Love",
```

- [ ] **Step 3: Update the schema default quote/author to the reference copy**

```json
{ "type": "textarea", "id": "quote", "label": "Quote", "default": "The Midnight Silk Set is the most luxurious thing I own. Every morning feels like a five-star ritual." },
{ "type": "text", "id": "author", "label": "Author", "default": "Isabelle M." },
{ "type": "text", "id": "author_note", "label": "Author note", "default": "Paris, France" },
```

- [ ] **Step 4: Build and visual check**

```bash
npm run build && npx shopify theme dev
```
Confirm 5 filled stars render in terracotta above the quote.

- [ ] **Step 5: Commit**

```bash
git add sections/testimonial.liquid locales/en.default.json
git commit -m "Add star rating and reference copy to testimonial section"
```

---

### Task 12: Footer redesign — link columns, payment icons, tagline

**Files:**
- Modify: `sections/footer.liquid`

**Interfaces:** none new — extends existing `menu_1`/`menu_2`/`menu_3` link-list settings (already present, just needs a payment-icon row and grid-column relabeling).

- [ ] **Step 1: Rename the three menu columns' fallback titles to match the reference structure**

The section already loops `menu_1`/`menu_2`/`menu_3` link lists and reads each menu's own `.title` for the column heading (line 45), so column headings ("Collections" / "Company" / "Help") come from whatever the merchant names each Shopify menu — no code change needed there. Instead, update the linked-list `label` hints in the schema (lines 85–87) so the merchant picks the right menus:
```json
{ "type": "link_list", "id": "menu_1", "label": "Menu 1 (Collections)", "default": "footer" },
{ "type": "link_list", "id": "menu_2", "label": "Menu 2 (Company)" },
{ "type": "link_list", "id": "menu_3", "label": "Menu 3 (Help)" },
```

- [ ] **Step 2: Add a payment-icon row below the existing social icons**

In the social-icons `<div>` (around line 58), after the existing Instagram/Facebook/TikTok `{%- if -%}` blocks and before the closing monogram `<img>` (line 74), the row already exists — add a payment-icons row as a new line directly below the whole `<div class="flex items-center gap-6">...</div>` block (i.e. as a sibling, still inside the flex-row wrapper at line 54):

```liquid
    <div class="flex items-center gap-3 opacity-60" aria-hidden="true">
      <span class="font-label-caps text-[9px] uppercase tracking-widest border border-charcoal/30 rounded px-2 py-1">Visa</span>
      <span class="font-label-caps text-[9px] uppercase tracking-widest border border-charcoal/30 rounded px-2 py-1">MC</span>
      <span class="font-label-caps text-[9px] uppercase tracking-widest border border-charcoal/30 rounded px-2 py-1">Amex</span>
    </div>
```
(Text badges, not brand-mark icons — Visa/Mastercard/Amex logos are trademarked assets the theme shouldn't embed without a license; this matches how the rest of the footer already renders text-based labels for untrademarked content.)

- [ ] **Step 3: Build and visual check**

```bash
npm run build && npx shopify theme dev
```
Confirm the footer shows Collections/Company/Help columns (once the merchant's 3 menus are assigned in the theme editor) and a payment-badge row next to the social icons.

- [ ] **Step 4: Commit**

```bash
git add sections/footer.liquid
git commit -m "Relabel footer menu columns and add payment badges"
```

---

### Task 13: Wire all sections into the homepage template

**Files:**
- Modify: `templates/index.json`

**Interfaces:** none — pure configuration.

- [ ] **Step 1: Add every section (existing + new) to the homepage in reference order**

Replace the whole file:
```json
{
  "sections": {
    "slider": { "type": "slider" },
    "marquee": { "type": "trust-marquee" },
    "categories": { "type": "category-bento" },
    "featured": { "type": "featured-products" },
    "testimonial": { "type": "testimonial" },
    "instagram": { "type": "instagram-grid" }
  },
  "order": ["slider", "marquee", "categories", "featured", "testimonial", "instagram"]
}
```
(`brand-banner` is deliberately left out of the default homepage order — the reference site doesn't show it as a homepage section; it stays available in the section picker for merchants who want it on other pages.)

- [ ] **Step 2: Build and visual check**

```bash
npm run build && npx shopify theme dev
```
Load the homepage and confirm all 6 sections render in order: hero slider → trust marquee → Shop by Collection → Featured Pieces → testimonial → Life in Aurca → (footer, from the layout).

- [ ] **Step 3: Commit**

```bash
git add templates/index.json
git commit -m "Add category-bento, testimonial, and instagram-grid to homepage"
```

---

### Task 14: Final full-site QA pass

**Files:** none (verification only).

- [ ] **Step 1: Full build from clean**

```bash
rm -f assets/theme.css src/vars.css
node gen-vars.js && npm run build
```
Expected: both files regenerate, `npm run build` exits 0.

- [ ] **Step 2: Full homepage walkthrough in both color modes**

```bash
npx shopify theme dev
```
In the browser: load homepage in light mode, screenshot; toggle dark mode, screenshot; toggle a Featured Pieces filter pill; click a wishlist heart and reload to confirm persistence; open the mobile menu (resize to <768px) and confirm nav links/wordmark still render correctly at the new logo aspect ratio.

- [ ] **Step 3: Check a non-homepage page for token/font bleed-through**

Visit `/products/<any-handle>` and `/cart` — confirm they pick up the new clay/cream tokens and Inter/Playfair fonts automatically (they use the same shared `layout/theme.liquid` and Tailwind classes, no page-specific work required per spec §4), with no leftover DM Sans/old terracotta orange visible.

- [ ] **Step 4: Grep for stray old-brand hex values**

```bash
grep -rn "C97B63\|DCC9B6\|6F5648\|A9B29B" assets/ sections/ snippets/ src/ | grep -v node_modules
```
Expected: no output — every old-brand hex should now be gone from theme-authored files (a hit here means a section still hardcodes an old color inline instead of using the token, and needs fixing before this task is done).

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "Aurca rebrand: final QA pass" --allow-empty
```
(Empty-allowed in case Steps 1–4 found nothing to fix — this commit marks the rebrand complete in history even if no files changed in this task.)
