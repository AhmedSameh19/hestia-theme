const fs = require('fs');
const assert = require('assert');

const themeJs = fs.readFileSync('assets/theme.js', 'utf8');

console.log('Verifying showCartNotification implementation in assets/theme.js...');

// 1. showCartNotification function must be defined
assert(
  themeJs.includes('function showCartNotification('),
  'assets/theme.js missing function showCartNotification(item)'
);

// 2. Verify quick-add does not open drawer and calls showCartNotification
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

// Verify Quick View does not open drawer and calls showCartNotification
const qvSection = themeJs.slice(
  themeJs.indexOf('const qvAddBtn'),
  themeJs.lastIndexOf('const qvWishBtn')
);
assert(
  !qvSection.includes("openDrawer('cart')"),
  'Quick view add button should not automatically call openDrawer("cart")'
);
assert(
  qvSection.includes('showCartNotification'),
  'Quick view add button should call showCartNotification'
);

// Verify Wishlist add-to-cart does not open drawer and calls showCartNotification
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

// Verify Product Form submit does not open drawer and calls showCartNotification
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
  themeJs.includes('view-bag') || themeJs.includes("openDrawer('cart')"),
  'showCartNotification must support opening the cart drawer on View Bag click'
);
assert(
  themeJs.includes('mouseenter') && themeJs.includes('mouseleave'),
  'showCartNotification must support pause on hover via mouseenter and mouseleave'
);

console.log('PASS: Cart notification popup verification successful.');
