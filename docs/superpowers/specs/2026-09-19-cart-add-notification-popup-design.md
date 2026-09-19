# Cart Add Bottom-Right Notification Popup Design Spec

## Overview
Currently, adding an item to the cart (from the product page, collection quick-add buttons, quick-view modal, or wishlist) automatically opens the full sidebar cart drawer (`openDrawer('cart')`). 

This specification defines replacing that intrusive sidebar open with a non-intrusive, luxury bottom-right notification popup. The popup alerts the shopper with rich product information, auto-dismisses after 5 seconds (pausing while hovered), and provides a direct "View Bag" action button to open the cart drawer on demand.

---

## 1. User Experience & Goals
- **No Automatic Sidebar Opening**: When adding an item, the cart drawer remains closed so the user stays in their browsing or buying flow without disruption.
- **Rich Feedback**: A sleek floating card appears in the bottom-right corner showing:
  - Added product thumbnail image
  - Product title
  - Selected variant details (Size / Color)
  - Price & quantity
  - "View Bag" button to open the cart drawer if desired
  - Close button (✕) for instant manual dismissal
- **Hover-Aware Timer**: The popup auto-dismisses after 5 seconds, but pauses whenever the user hovers their mouse over the card, resuming when they move away.
- **Header Cart Count Sync**: Background updates (`refreshCartDrawer()` and `updateHeaderCartCount()`) continue to run smoothly so the header cart icon stays accurate.
- **Bilingual & Responsive**: Adapts seamlessly to mobile and desktop, supporting English (LTR) and Arabic (RTL) typography and layout.

---

## 2. Architecture & Components

### 2.1 DOM & Container
- Uses `#toast-container` (or a dedicated `#cart-popup-container`) located in `snippets/aurca-modals.liquid`.
- Positioned fixed at `bottom-6 right-6 z-[200] pointer-events-none`.
- Popups inside the container have `pointer-events-auto` so buttons and hover events function properly.
- Responsive handling: On narrow mobile viewports (< 480px), width expands with `max-w-[calc(100vw-2rem)]` and appropriate safe-area padding.

### 2.2 Visual Design & Tokens
- **Background**: Deep charcoal `#2D2E2D` with subtle white border (`border border-white/10`) and elevation shadow (`shadow-2xl`).
- **Typography**:
  - Success header: Text `[10px]` uppercase tracking-widest with a terracotta `#A87052` checkmark icon.
  - Title: Text `12px` font-serif font-medium text-white truncate.
  - Variant: Text `10px` text-white/60.
  - Price: Formatted currency using `formatPrice()`.
- **Image**: 56×56px square thumbnail, `object-cover rounded-sm border border-white/5`.
- **Buttons**:
  - "View Bag" / "عرض الحقيبة": Terracotta `#A87052` button, white text, hover opacity 90%. Clicking it dismisses the popup and invokes `openDrawer('cart')`.
  - Close button (✕): Compact icon button in the corner (`text-white/40 hover:text-white`).

### 2.3 Event Lifecycle & Timing
1. **Creation**:
   - `showCartNotification(item)` builds the notification DOM element.
   - Any prior cart popup is smoothly removed or replaced to prevent visual clutter.
   - Smooth entrance animation: `translate-y-4 opacity-0` transitioning to `translate-y-0 opacity-100` over 300ms.
2. **Auto-Dismissal**:
   - Starts a 5,000ms timer.
   - `mouseenter` listener clears the timer.
   - `mouseleave` listener starts a new timer (remaining or fresh 3,000ms).
3. **Manual Dismissal**:
   - Clicking (✕) clears the timer and executes exit animation (`translate-y-2 opacity-0` over 250ms), then removes the DOM element.
4. **"View Bag" Click**:
   - Immediately dismisses the popup and calls `openDrawer('cart')`.

---

## 3. Data Flow & Integration Points

In `assets/theme.js`, 4 locations trigger cart addition. Each is updated to pass item details to `showCartNotification()` and remove `openDrawer('cart')`:

1. **Collection / Featured Products Quick-Add (`[data-quick-add-btn]`)**:
   - Currently: `await cartAddItems(...)`, `await refreshCartDrawer()`, `showToast(...)`, `openDrawer('cart')`.
   - Update: Call `showCartNotification(res.items?.[0] || fallbackItem)`. Remove `openDrawer('cart')`.
2. **Product Page PDP Form (`form.addEventListener('submit')`)**:
   - Currently: `await cartAddItems(...)`, `await refreshCartDrawer()`, `showToast(...)`, `openDrawer('cart')`.
   - Update: Call `showCartNotification(res.items?.[0] || fallbackItem)`. Remove `openDrawer('cart')`.
3. **Quick View Modal (`qvAddBtn.addEventListener('click')`)**:
   - Currently: `await cartAddItems(...)`, `await refreshCartDrawer()`, `closeModal('quickview')`, `openDrawer('cart')`.
   - Update: Close quick view modal, then call `showCartNotification(res.items?.[0] || fallbackItem)`. Remove `openDrawer('cart')`.
4. **Wishlist Drawer (`aurcaWishToCart`)**:
   - Currently: `await cartAddItems(...)`, `await refreshCartDrawer()`, `showToast(...)`, `openDrawer('cart')`.
   - Update: Call `showCartNotification(res.items?.[0] || fallbackItem)`. Remove `openDrawer('cart')`.

*Note: Header cart icon (`[data-cart-open]`) retains `openDrawer('cart')` so shoppers can always open the drawer deliberately.*

---

## 4. Fallback & Edge Cases
- **No image available**: If variant or product image URL is missing, a minimal placeholder or elegant text-only card is rendered gracefully without broken image icons.
- **Multiple variants / Default Title**: If the variant title is `"Default Title"`, omit the variant line to keep the popup uncluttered.
- **RTL Support**: If `currentLang === 'ar'`, labels translate cleanly:
  - Header: `"تمت الإضافة للحقيبة"`
  - View Bag button: `"عرض الحقيبة"`
  - Layout mirrors with standard RTL flex flow.
- **Network / API failure**: Existing error handling (`showToast(err.message, 'info')`) remains unchanged to notify users of out-of-stock or network errors.

---

## 5. Verification & Testing Plan
1. **Automated / Scripted Checks**:
   - Verify all 4 add-to-cart locations in `assets/theme.js` invoke `showCartNotification` and no longer call `openDrawer('cart')`.
   - Verify `openDrawer('cart')` is still called on `[data-cart-open]` and on the popup's "View Bag" button.
   - Run existing test suite (`node tests/verify-all.js` or equivalent) to ensure no regressions.
2. **Interactive / DOM Checks**:
   - Verify HTML structure, styling classes, hover listeners, timer cancellation, and dismiss animation.
