# Cart Add Bottom-Right Notification Popup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace automatic sidebar cart drawer opening on add-to-cart actions with a non-intrusive, luxury bottom-right notification popup featuring product thumbnail, title, variant, price, "View Bag" button, and auto-dismiss with hover pause.

**Architecture:** Create a dedicated `showCartNotification(item)` function in `assets/theme.js` that renders into the fixed bottom-right container (`#toast-container`). Wire all 4 add-to-bag triggers (Product Page, Collection Quick-Add, Quick View Modal, and Wishlist Add) to call `showCartNotification` instead of `openDrawer('cart')`, while keeping `openDrawer('cart')` fully functional for manual triggers (header cart icon and the popup's "View Bag" button).

**Tech Stack:** Vanilla JavaScript (ES6+), Shopify Ajax Cart API, Tailwind CSS, Node.js assert testing.

## Global Constraints
- Do NOT open the cart drawer sidebar automatically upon adding an item to cart.
- Popup must appear in the bottom-right corner (`fixed bottom-6 right-6 z-[200]`).
- Popup must display product thumbnail image, product title, variant details (if applicable), formatted price, "View Bag" button, and close (✕) button.
- Popup must auto-dismiss after 5 seconds, pausing while hovered and resuming on mouse leave.
- Clicking "View Bag" must dismiss the popup and trigger `openDrawer('cart')`.
- Clicking close (✕) must dismiss the popup immediately.
- Header cart icon (`[data-cart-open]`) must remain fully functional to open the cart drawer on demand.
- Background cart drawer refresh (`refreshCartDrawer()`) and header counter update (`updateHeaderCartCount()`) must continue to execute on cart addition.
- Support bilingual copy and layout for English (LTR) and Arabic (RTL).

---

### Task 1: Create verification test suite for cart notification popup

**Files:**
- Create: `tests/verify-cart-notification.js`
- Modify: `tests/verify-all.js`

**Interfaces:**
- Consumes: `assets/theme.js`
- Produces: Test script ensuring `showCartNotification` exists, 0 automatic `openDrawer('cart')` calls remain on add actions, and all 4 add locations invoke `showCartNotification`.

- [ ] **Step 1: Write the failing test**

Create `tests/verify-cart-notification.js` with comprehensive assertions:
```javascript
const fs = require('fs');
const assert = require('assert');

const themeJs = fs.readFileSync('assets/theme.js', 'utf8');

console.log('Verifying showCartNotification implementation in assets/theme.js...');

// 1. showCartNotification function must be defined
assert(
  themeJs.includes('function showCartNotification('),
  'assets/theme.js missing function showCartNotification(item)'
);

// 2. openDrawer("cart") must NOT be called on add-to-cart actions
// Find matches of openDrawer('cart') in theme.js
const openDrawerMatches = [...themeJs.matchAll(/openDrawer\(['"]cart['"]\)/g)];

// In the original code, there were 5 places:
// - header / [data-cart-open] listener
// - refreshCartDrawer (if wasOpen)
// - aurcaWishToCart
// - [data-quick-add-btn]
// - qvAddBtn
// - product form submit
// After this task, only manual triggers and refreshCartDrawer(if wasOpen) should remain.
// Specifically, aurcaWishToCart, [data-quick-add-btn], qvAddBtn, and form submit should NOT call openDrawer('cart')

// Verify quick-add does not open drawer
const quickAddSection = themeJs.slice(
  themeJs.indexOf('[data-quick-add-btn]'),
  themeJs.indexOf('// Wishlist buttons on cards')
);
assert(
  !quickAddSection.includes("openDrawer('cart')"),
  'Quick-add should not automatically call openDrawer("cart")'
);
assert(
  quickAddSection.includes('showCartNotification'),
  'Quick-add should call showCartNotification'
);

// Verify Quick View does not open drawer
const qvSection = themeJs.slice(
  themeJs.indexOf('const qvAddBtn'),
  themeJs.indexOf('const qvWishBtn')
);
assert(
  !qvSection.includes("openDrawer('cart')"),
  'Quick view add button should not automatically call openDrawer("cart")'
);
assert(
  qvSection.includes('showCartNotification'),
  'Quick view add button should call showCartNotification'
);

// Verify Wishlist add-to-cart does not open drawer
const wishSection = themeJs.slice(
  themeJs.indexOf('window.aurcaWishToCart ='),
  themeJs.indexOf('window.aurcaRemoveWish =')
);
assert(
  !wishSection.includes("openDrawer('cart')"),
  'Wishlist add-to-cart should not automatically call openDrawer("cart")'
);
assert(
  wishSection.includes('showCartNotification'),
  'Wishlist add-to-cart should call showCartNotification'
);

// Verify Product Form submit does not open drawer
const formSection = themeJs.slice(
  themeJs.indexOf("e.submitter.name !== 'add'"),
  themeJs.indexOf('initProductGallery')
);
assert(
  !formSection.includes("openDrawer('cart')"),
  'Product form submit should not automatically call openDrawer("cart")'
);
assert(
  formSection.includes('showCartNotification'),
  'Product form submit should call showCartNotification'
);

// 3. Header cart trigger must still open cart drawer
const headerTrigger = themeJs.slice(
  themeJs.indexOf('[data-cart-open]'),
  themeJs.indexOf('[data-wishlist-open]')
);
assert(
  headerTrigger.includes("openDrawer('cart')"),
  'Header cart button [data-cart-open] must still open cart drawer'
);

// 4. Cart notification UI elements & features
assert(
  themeJs.includes('view-bag') || themeJs.includes('openDrawer(\'cart\')'),
  'showCartNotification must support opening the cart drawer on View Bag click'
);
assert(
  themeJs.includes('mouseenter') && themeJs.includes('mouseleave'),
  'showCartNotification must support pause on hover via mouseenter and mouseleave'
);

console.log('PASS: Cart notification popup verification successful.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify-cart-notification.js`
Expected: FAIL with `AssertionError: assets/theme.js missing function showCartNotification(item)`

- [ ] **Step 3: Update `tests/verify-all.js` to include the new test**

Add `require('./verify-cart-notification.js');` to `tests/verify-all.js`.

- [ ] **Step 4: Commit test file**

```bash
git add tests/verify-cart-notification.js tests/verify-all.js
git commit -m "test: add verification suite for bottom-right cart notification popup"
```

---

### Task 2: Implement `showCartNotification` and wire all 4 add-to-cart touchpoints

**Files:**
- Modify: `assets/theme.js:143-160` (Add `showCartNotification`)
- Modify: `assets/theme.js:415-425` (Update `window.aurcaWishToCart`)
- Modify: `assets/theme.js:955-965` (Update `[data-quick-add-btn]`)
- Modify: `assets/theme.js:1005-1015` (Update `qvAddBtn`)
- Modify: `assets/theme.js:1200-1210` (Update product form submit)

**Interfaces:**
- Consumes: Shopify `/cart/add.js` response item, `currentLang`, `formatPrice`, `openDrawer('cart')`
- Produces: `showCartNotification(item)` UI component rendered in `#toast-container` with 5s dismiss, hover pause, close button, and "View Bag" trigger.

- [ ] **Step 1: Implement `showCartNotification(item)` in `assets/theme.js`**

Add `showCartNotification(item)` right below `showToast()`:
```javascript
  let activeCartNotificationTimeout = null;

  function showCartNotification(item) {
    const container = document.getElementById('toast-container');
    if (!container || !item) return;

    // Clear any existing cart notification and its timer
    const existing = document.getElementById('cart-add-notification');
    if (existing) {
      if (activeCartNotificationTimeout) clearTimeout(activeCartNotificationTimeout);
      existing.remove();
    }

    const title = escapeHtml(item.product_title || item.title || '');
    const variantTitle = (item.variant_title && item.variant_title !== 'Default Title')
      ? escapeHtml(item.variant_title)
      : '';
    const rawPrice = typeof item.price === 'number' ? (item.price > 1000 ? item.price / 100 : item.price) : 0;
    const priceText = formatPrice(rawPrice);
    const imgSrc = item.image || (item.featured_image && item.featured_image.url) || '';
    const isAr = currentLang === 'ar';
    const addedText = isAr ? 'تمت الإضافة للحقيبة' : 'Added to Bag';
    const viewBagText = isAr ? 'عرض الحقيبة' : 'View Bag';

    const card = document.createElement('div');
    card.id = 'cart-add-notification';
    card.className = 'w-[340px] max-w-[calc(100vw-2rem)] bg-[#2D2E2D] text-white p-4 shadow-2xl border border-white/15 pointer-events-auto transition-all duration-300 transform translate-y-4 opacity-0 flex flex-col gap-3 font-sans';
    if (isAr) card.setAttribute('dir', 'rtl');

    card.innerHTML = `
      <div class="flex items-center justify-between border-b border-white/10 pb-2">
        <div class="flex items-center gap-1.5 text-[#A87052] text-[10px] font-medium tracking-widest uppercase">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>${addedText}</span>
        </div>
        <button type="button" data-close-cart-popup class="text-white/40 hover:text-white p-1 transition-colors" aria-label="Close">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="flex gap-3 items-center">
        ${imgSrc ? `<img src="${imgSrc}" alt="${title}" class="w-14 h-14 object-cover rounded-sm bg-white/5 border border-white/10 flex-shrink-0" />` : ''}
        <div class="flex-1 min-w-0">
          <h4 class="text-xs font-serif font-medium text-white truncate leading-snug">${title}</h4>
          ${variantTitle ? `<p class="text-[10px] text-white/60 truncate mt-0.5">${variantTitle}</p>` : ''}
          <div class="flex items-center gap-2 mt-1">
            <span class="text-xs font-medium text-white/90">${priceText}</span>
            ${item.quantity > 1 ? `<span class="text-[10px] text-white/50">× ${item.quantity}</span>` : ''}
          </div>
        </div>
      </div>
      <div class="pt-1">
        <button type="button" data-view-bag-btn class="w-full py-2 px-3 text-[10px] font-medium uppercase tracking-[0.15em] bg-[#A87052] text-white hover:opacity-90 transition-opacity text-center flex items-center justify-center gap-1.5">
          <span>${viewBagText}</span>
          <svg class="w-3 h-3 ${isAr ? 'rotate-180' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    `;

    container.appendChild(card);

    requestAnimationFrame(() => {
      card.classList.remove('translate-y-4', 'opacity-0');
    });

    function dismiss() {
      if (activeCartNotificationTimeout) {
        clearTimeout(activeCartNotificationTimeout);
        activeCartNotificationTimeout = null;
      }
      card.classList.add('translate-y-4', 'opacity-0');
      setTimeout(() => card.remove(), 300);
    }

    function startTimer(duration = 5000) {
      if (activeCartNotificationTimeout) clearTimeout(activeCartNotificationTimeout);
      activeCartNotificationTimeout = setTimeout(() => dismiss(), duration);
    }

    startTimer(5000);

    card.addEventListener('mouseenter', () => {
      if (activeCartNotificationTimeout) {
        clearTimeout(activeCartNotificationTimeout);
        activeCartNotificationTimeout = null;
      }
    });

    card.addEventListener('mouseleave', () => {
      startTimer(3000);
    });

    const closeBtn = card.querySelector('[data-close-cart-popup]');
    if (closeBtn) closeBtn.addEventListener('click', dismiss);

    const viewBagBtn = card.querySelector('[data-view-bag-btn]');
    if (viewBagBtn) {
      viewBagBtn.addEventListener('click', () => {
        dismiss();
        openDrawer('cart');
      });
    }
  }
```

- [ ] **Step 2: Wire `window.aurcaWishToCart`**

In `assets/theme.js`, update:
```javascript
      const res = await cartAddItems([{ id: variant.id, quantity: 1 }]);
      await refreshCartDrawer();
      const addedItem = (res && res.items && res.items[0]) || {
        title: product.title,
        price: variant.price,
        image: variant.featured_image ? variant.featured_image.src : (product.images && product.images[0]),
        variant_title: variant.title,
        quantity: 1
      };
      showCartNotification(addedItem);
```
Remove `openDrawer('cart');` and old `showToast()`.

- [ ] **Step 3: Wire `[data-quick-add-btn]`**

In `assets/theme.js`, update:
```javascript
        try {
          const res = await cartAddItems([{ id: variant.id, quantity: 1 }]);
          await refreshCartDrawer();
          const cardTitle = card.querySelector('h3, [data-product-title]')?.textContent?.trim();
          const cardImg = card.querySelector('img')?.src;
          const addedItem = (res && res.items && res.items[0]) || {
            title: cardTitle || 'Product',
            price: variant.price,
            image: cardImg,
            variant_title: variant.title,
            quantity: 1
          };
          showCartNotification(addedItem);
        } catch (err) {
          showToast(err.message, 'info');
        }
```
Remove `openDrawer('cart');` and old `showToast()`.

- [ ] **Step 4: Wire `qvAddBtn`**

In `assets/theme.js`, update:
```javascript
        try {
          const res = await cartAddItems([{ id: variant.id, quantity: qvQty }]);
          await refreshCartDrawer();
          closeModal('quickview');
          const addedItem = (res && res.items && res.items[0]) || {
            title: qvProduct.title,
            price: variant.price,
            image: variant.featured_image ? variant.featured_image.src : (qvProduct.images && qvProduct.images[0]),
            variant_title: variant.title,
            quantity: qvQty
          };
          showCartNotification(addedItem);
        } catch (err) {
          showToast(err.message, 'info');
        }
```
Remove `openDrawer('cart');` and old `showToast()`.

- [ ] **Step 5: Wire Product Form Submit**

In `assets/theme.js`, update:
```javascript
          try {
            const res = await cartAddItems([{ id: variant.id, quantity: qty }]);
            await refreshCartDrawer();
            const productTitleEl = document.querySelector('h1, [data-product-title]');
            const mainImgEl = document.querySelector('[data-main-image]');
            const addedItem = (res && res.items && res.items[0]) || {
              title: productTitleEl ? productTitleEl.textContent.trim() : 'Product',
              price: variant.price,
              image: mainImgEl ? mainImgEl.src : '',
              variant_title: variant.title,
              quantity: qty
            };
            showCartNotification(addedItem);
          } catch (err) {
            showToast(err.message, 'info');
            form.submit();
          } finally {
            render();
          }
```
Remove `openDrawer('cart');` and old `showToast()`.

- [ ] **Step 6: Run tests and syntax check**

Run:
```bash
node --check assets/theme.js
node tests/verify-cart-notification.js
node tests/verify-all.js
```
Expected: All pass.

- [ ] **Step 7: Commit changes**

```bash
git add assets/theme.js
git commit -m "feat: show bottom-right notification popup instead of opening cart sidebar on add to cart"
```

---

### Task 3: Comprehensive Verification and Regression Checks

**Files:**
- Test: `tests/verify-all.js`
- Test: `tests/verify-cart-notification.js`

- [ ] **Step 1: Run complete test suite**

Run: `node tests/verify-all.js`
Expected: ALL VERIFICATIONS PASSED SUCCESSFULLY.

- [ ] **Step 2: Verify git diff is clean and targeted**

Run: `git diff HEAD~1`
Confirm no unintended modifications or residual debug code.
