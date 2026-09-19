/**
 * Aurca Luxury Homewear — Complete Client Application & Storefront Scripts
 * Replicating https://strong-chef-63840685.figma.site/
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. CATALOG & CONSTANTS (from Figma application code)
     ========================================================================== */
  const IMAGES = {
    hero: 'https://images.unsplash.com/photo-1771620886948-3887ba3223f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1800',
    womenHero: 'https://images.unsplash.com/photo-1766056278944-ca0e4f49e61f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    menHero: 'https://images.unsplash.com/photo-1736697421338-c361795c7191?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    excHero: 'https://images.unsplash.com/photo-1778731525489-020d49e8e1a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    lifestyle1: 'https://images.unsplash.com/photo-1766876767264-0c6d73891a7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    lifestyle2: 'https://images.unsplash.com/photo-1639905517739-abec6b616041?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    lifestyle3: 'https://images.unsplash.com/photo-1506377170913-e1d634babf96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    lifestyle4: 'https://images.unsplash.com/photo-1594735974070-b678995b9f09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    lifestyle5: 'https://images.unsplash.com/photo-1666964613986-ee204609abbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    morning: 'https://images.unsplash.com/photo-1552858725-a19e7fcd3ac4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    living: 'https://images.unsplash.com/photo-1738407274756-25325763dd4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    prod1: 'https://images.unsplash.com/photo-1766056278944-ca0e4f49e61f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    prod2: 'https://images.unsplash.com/photo-1766056278967-c0646b1bfd67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    prod3: 'https://images.unsplash.com/photo-1766056278825-55168658f120?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    prod4: 'https://images.unsplash.com/photo-1766056278842-b754f1e093c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    prod5: 'https://images.unsplash.com/photo-1718963892337-b6729c302b8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    prod6: 'https://images.unsplash.com/photo-1584061606850-a57652a323a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'
  };

  const PRODUCTS = [
    { id: 1, name: 'Midnight Silk Set', cat: 'Women', price: 12326, originalPrice: null, tag: 'Bestseller', img: IMAGES.prod1, colors: ['#1a2240', '#9E6E7A', '#B87150'], fabric: 'Mulberry Silk' },
    { id: 2, name: 'Morning Bloom', cat: 'Women', price: 9356, originalPrice: null, tag: 'New', img: IMAGES.prod2, colors: ['#D4C8B4', '#9E6E7A', '#3D4147'], fabric: 'Premium Modal' },
    { id: 3, name: 'Lavender Reverie', cat: 'Together', price: 17276, originalPrice: null, tag: 'Together', img: IMAGES.prod3, colors: ['#C9BADC', '#F5F0EA', '#5C1C2A'], fabric: 'Mulberry Silk' },
    { id: 4, name: 'Cloud White', cat: 'Women', price: 9851, originalPrice: 12326, tag: null, img: IMAGES.prod4, colors: ['#F5F0EA', '#E8D5C9', '#9E6E7A'], fabric: 'Organic Cotton' },
    { id: 5, name: 'Dusk Robe', cat: 'Men', price: 10841, originalPrice: null, tag: 'New', img: IMAGES.prod5, colors: ['#3D4147', '#B87150', '#C0BFC0'], fabric: 'Velour Cotton' },
    { id: 6, name: 'Noir Prestige', cat: 'Together', price: 20741, originalPrice: null, tag: 'Together', img: IMAGES.prod6, colors: ['#1E1E1E', '#B87150', '#F5F0EA'], fabric: 'Cashmere Blend' },
    { id: 7, name: 'Ivory Embrace', cat: 'Women', price: 8861, originalPrice: null, tag: null, img: IMAGES.prod4, colors: ['#F5F0EA', '#D4C8B4', '#9E6E7A'], fabric: 'Organic Cotton' },
    { id: 8, name: 'Slate Essential', cat: 'Men', price: 9851, originalPrice: null, tag: null, img: IMAGES.prod5, colors: ['#3D4147', '#1E1E1E', '#C0BFC0'], fabric: 'Premium Modal' },
    { id: 9, name: 'Rose Atelier', cat: 'Together', price: 19256, originalPrice: 21236, tag: 'Together', img: IMAGES.prod3, colors: ['#9E6E7A', '#F5F0EA', '#5C1C2A'], fabric: 'Mulberry Silk' },
    { id: 10, name: 'Pearl Morning', cat: 'Women', price: 10841, originalPrice: null, tag: null, img: IMAGES.prod2, colors: ['#F5F0EA', '#D4C8B4', '#B87150'], fabric: 'Premium Modal' },
    { id: 11, name: 'Onyx Classic', cat: 'Men', price: 11831, originalPrice: null, tag: null, img: IMAGES.prod6, colors: ['#1E1E1E', '#3D4147', '#B87150'], fabric: 'Velour Cotton' },
    { id: 12, name: 'Champagne Dreams', cat: 'Together', price: 22721, originalPrice: null, tag: 'Together', img: IMAGES.prod1, colors: ['#D4C8B4', '#F5F0EA', '#5C1C2A'], fabric: 'Cashmere Blend' }
  ];


  const TRANSLATIONS = {
    en: {
      women: 'Women', men: 'Men', together: 'Together', lookbook: 'Lookbook',
      search: 'Search', account: 'Account', wishlist: 'Wishlist',
      addToBag: 'Add to Bag', addedToBag: '✓ Added to Bag', sizeGuide: 'Size guide',
      support: 'Support & Help', comingSoon: 'Coming Soon', proceedCheckout: 'Proceed to Checkout',
      continueShopping: 'Continue Shopping', yourBag: 'Your Bag', yourWishlist: 'Your Wishlist',
      followInstagram: 'Follow on Instagram', lifeInAurca: 'Life in Aurca',
      featuredPieces: 'Featured Pieces', shopByCollection: 'Shop by Collection',
      explore: 'Explore', viewAll: 'View All →', viewAllProducts: 'View All Products',
      curatedForYou: 'Curated for You', customerLove: 'Customer Love', whatCustomersSay: 'What Our Customers Say',
      joinCircle: 'Join the Circle', newsletterHeading: 'New arrivals & exclusive offers',
      subscribe: 'Subscribe', inCircle: "You're in the circle.",
      collections: 'Collections', company: 'Company', help: 'Help',
      announcement: 'Free shipping over 2,500 EGP · Complimentary gift wrapping · 30-day returns',
      tab_all: 'All', tab_women: 'Women', tab_men: 'Men', tab_together: 'Together',
      loadMore: 'Load More', newArrivals: 'New Arrivals', limitedEdition: 'Limited Edition',
      women_sub: 'The Feminine Edit', men_sub: 'The Essential Range', together_sub: 'The Luxury Reserve',
      brandTagline: 'Luxury homewear for the sacred hours between waking and sleeping. Est. 2018.',
      subtotal: 'Subtotal', taxesNote: 'Taxes & shipping calculated at checkout.',
      bagEmpty: 'Your bag is empty', bagEmptySub: 'Explore our curated collections of luxury silk and cotton homewear.',
      wishlistEmpty: 'Your wishlist is empty', wishlistEmptySub: 'Save your favorite pieces by clicking the heart icon while browsing.',
      exploreCollections: 'Explore Collections'
    },
    ar: {
      women: 'نساء', men: 'رجال', together: 'معاً', lookbook: 'معرض',
      search: 'بحث', account: 'حسابي', wishlist: 'المفضلة',
      addToBag: 'أضف للحقيبة', addedToBag: '✓ تمت الإضافة', sizeGuide: 'دليل المقاسات',
      support: 'الدعم والمساعدة', comingSoon: 'قريباً', proceedCheckout: 'المتابعة للدفع',
      continueShopping: 'متابعة التسوق', yourBag: 'حقيبتك', yourWishlist: 'قائمة أمنياتك',
      followInstagram: 'تابعنا على إنستغرام', lifeInAurca: 'حياة أوركا',
      featuredPieces: 'القطع المميزة', shopByCollection: 'تسوّق حسب المجموعة',
      explore: 'استكشف', viewAll: 'عرض الكل ←', viewAllProducts: 'عرض جميع المنتجات',
      curatedForYou: 'مختارة لك', customerLove: 'آراء العملاء', whatCustomersSay: 'ما يقوله عملاؤنا',
      joinCircle: 'انضم إلى مجتمعنا', newsletterHeading: 'تشكيلات جديدة وعروض حصرية',
      subscribe: 'اشتراك', inCircle: 'أصبحت جزءاً من مجتمعنا.',
      collections: 'المجموعات', company: 'الشركة', help: 'المساعدة',
      announcement: 'شحن مجاني للطلبات فوق 2,500 ج.م · تغليف هدايا مجاني · إرجاع خلال 30 يوم',
      tab_all: 'الكل', tab_women: 'نساء', tab_men: 'رجال', tab_together: 'معاً',
      loadMore: 'تحميل المزيد', newArrivals: 'وصول جديد', limitedEdition: 'إصدار محدود',
      women_sub: 'المجموعة النسائية', men_sub: 'المجموعة الأساسية', together_sub: 'المجموعة المشتركة',
      brandTagline: 'أزياء منزلية فاخرة للساعات المقدسة بين اليقظة والنوم. تأسست 2018.',
      subtotal: 'المجموع الفرعي', taxesNote: 'يتم احتساب الضرائب والشحن عند إتمام الطلب.',
      bagEmpty: 'حقيبة التسوق فارغة', bagEmptySub: 'استكشف مجموعاتنا المميزة من الحرير والقطن العضوي الفاخر.',
      wishlistEmpty: 'قائمة المفضلة فارغة', wishlistEmptySub: 'احفظ قطعك المفضلة بالنقر على أيقونة القلب أثناء التصفح.',
      exploreCollections: 'استكشف المجموعات'
    }
  };

  /* ==========================================================================
     2. APP STATE
     ========================================================================== */
  // The cart itself is real Shopify state (routes.cart_add_url etc., set in
  // layout/theme.liquid) — no client-side cart array. Only wishlist is local,
  // since Shopify has no native wishlist concept.
  const ROUTES = window.routes || {
    root_url: '/', cart_add_url: '/cart/add', cart_change_url: '/cart/change', cart_url: '/cart'
  };

  let wishlist = [];
  try {
    wishlist = JSON.parse(localStorage.getItem('aurca_wishlist') || '[]');
  } catch (e) {
    wishlist = [];
  }

  let currentLang = localStorage.getItem('aurca:lang') || 'en';
  let currentCurrency = 'EGP';
  localStorage.setItem('aurca:currency', 'EGP');
  let currentFilter = 'All';
  let visibleCount = 6;

  /* ==========================================================================
     3. HELPER FUNCTIONS
     ========================================================================== */
  // Safe for both text-node and quoted-attribute contexts — the DOM
  // textContent->innerHTML round trip only escapes &, <, > (not quotes), which
  // isn't enough for the href="${...}" / alt="${...}" usages below.
  function escapeHtml(str) {
    return (str == null ? '' : String(str))
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatPrice(amount) {
    const rounded = Math.round(amount || 0);
    if (currentLang === 'ar') {
      return `${rounded.toLocaleString('ar-EG')} ج.م`;
    }
    return `${rounded.toLocaleString('en-US')} EGP`;
  }

  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'px-5 py-3 text-xs font-medium text-white shadow-2xl transition-all duration-300 transform translate-y-4 opacity-0 flex items-center gap-2 pointer-events-auto';
    toast.style.background = type === 'info' ? '#494D57' : '#A87052';
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('translate-y-4', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  function saveWishlist() {
    localStorage.setItem('aurca_wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
  }

  /* ==========================================================================
     REAL SHOPIFY CART (AJAX API) — replaces the old client-only demo cart.
     ========================================================================== */
  async function shopifyFetch(url, options) {
    const res = await fetch(url, Object.assign(
      { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } },
      options
    ));
    if (!res.ok) {
      let message = 'Something went wrong.';
      try {
        const data = await res.json();
        message = data.description || data.message || message;
      } catch (e) { /* non-JSON error body */ }
      throw new Error(message);
    }
    return res.json();
  }

  function cartAddItems(items) {
    return shopifyFetch(`${ROUTES.cart_add_url}.js`, { method: 'POST', body: JSON.stringify({ items }) });
  }

  function cartChangeLine(line, quantity) {
    return shopifyFetch(`${ROUTES.cart_change_url}.js`, { method: 'POST', body: JSON.stringify({ line, quantity }) });
  }

  async function updateHeaderCartCount() {
    try {
      const cartData = await shopifyFetch('/cart.js', { method: 'GET' });
      document.querySelectorAll('[data-cart-count]').forEach(badge => {
        badge.textContent = cartData.item_count;
        badge.classList.toggle('hidden', cartData.item_count === 0);
      });
    } catch (e) { /* header badge is a nicety, not worth surfacing an error for */ }
  }

  function bindCartDrawerEvents() {
    document.querySelectorAll('#modal-cart-drawer [data-close-drawer]').forEach(el => {
      el.addEventListener('click', () => closeDrawer(el.getAttribute('data-close-drawer')));
    });
    document.querySelectorAll('#modal-cart-drawer [data-drawer-qty]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const line = parseInt(btn.getAttribute('data-drawer-qty'), 10);
        const delta = parseInt(btn.getAttribute('data-delta'), 10);
        const qtyEl = btn.parentElement.querySelector('span');
        const currentQty = parseInt(qtyEl?.textContent || '1', 10);
        try {
          await cartChangeLine(line, currentQty + delta);
          await refreshCartDrawer();
        } catch (e) {
          showToast(e.message, 'info');
        }
      });
    });
    document.querySelectorAll('#modal-cart-drawer [data-drawer-remove]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const line = parseInt(btn.getAttribute('data-drawer-remove'), 10);
        try {
          await cartChangeLine(line, 0);
          await refreshCartDrawer();
        } catch (e) {
          showToast(e.message, 'info');
        }
      });
    });
  }

  // Re-fetches sections/cart-drawer.liquid via Shopify's Section Rendering API so the
  // drawer always shows the real cart, then rebinds its (freshly replaced) buttons.
  async function refreshCartDrawer() {
    try {
      const res = await fetch(`${ROUTES.root_url}?section_id=cart-drawer`);
      const html = await res.text();
      const existing = document.getElementById('modal-cart-drawer');
      const wasOpen = existing ? !existing.hidden : false;
      if (existing) {
        existing.outerHTML = html;
        bindCartDrawerEvents();
        if (wasOpen) openDrawer('cart');
      }
    } catch (e) { /* leave the stale drawer in place rather than break the page */ }
    updateHeaderCartCount();
  }

  // Resolves the exact variant a product card's selected size pill(s) point to.
  // "Together" cards have two independent size-selector-groups (Her / Him); this
  // matches against both by their option position (data-option-index).
  function resolveVariantFromCard(card) {
    let variants = [];
    try { variants = JSON.parse(card.dataset.variantsJson || '[]'); } catch (e) { return null; }
    if (variants.length <= 1) return variants[0] || null;
    const selected = {};
    card.querySelectorAll('.size-selector-group').forEach(group => {
      const idx = group.getAttribute('data-option-index');
      const active = group.querySelector('.size-pill.active-size');
      if (active) selected[idx] = active.getAttribute('data-size');
    });
    return variants.find(v => Object.keys(selected).every(idx => v[`option${parseInt(idx, 10) + 1}`] === selected[idx])) || null;
  }

  /* ==========================================================================
     4. TRANSLATION & LANGUAGE TOGGLE
     ========================================================================== */
  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('aurca:lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);

    // Update lang button text in header
    document.querySelectorAll('[data-lang-text]').forEach(el => {
      el.textContent = lang === 'en' ? 'عربي' : 'EN';
    });

    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;

    // Translate standard text nodes
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // Translate placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.placeholder = dict[key];
      }
    });

    // Update dynamic drawer headers and badges
    updateWishlistUI();
  }


  /* ==========================================================================
     6. WISHLIST MANAGEMENT & DRAWER
     ========================================================================== */
  // Shared by every heart icon (product cards + quick view) so "wished" always
  // means the same filled, copper heart everywhere.
  function setWishlistIconState(btn, isWished) {
    const svg = btn.querySelector('svg');
    if (isWished) {
      btn.classList.add('text-[#A87052]');
      btn.classList.remove('text-[#494D57]');
      if (svg) svg.setAttribute('fill', 'currentColor');
    } else {
      btn.classList.remove('text-[#A87052]');
      btn.classList.add('text-[#494D57]');
      if (svg) svg.setAttribute('fill', 'none');
    }
  }

  // Restartable heart "pop" — plays on every add, even if clicked again before
  // the previous run finished.
  function pulseWishlistIcon(btn) {
    btn.classList.remove('wishlist-pop');
    void btn.offsetWidth; // force reflow so the animation can replay
    btn.classList.add('wishlist-pop');
  }

  function toggleWishlist(productId, handle) {
    const id = parseInt(productId, 10);
    const idx = wishlist.findIndex(w => w.id === id);
    if (idx !== -1) {
      wishlist.splice(idx, 1);
      showToast(currentLang === 'en' ? 'Removed from wishlist' : 'أُزيل من المفضلة', 'info');
    } else {
      wishlist.push({ id, handle });
      showToast(currentLang === 'en' ? 'Saved to wishlist' : 'تمت الإضافة للمفضلة');
    }
    saveWishlist();
  }

  async function updateWishlistUI() {
    // Update count in header
    document.querySelectorAll('[data-wishlist-count]').forEach(badge => {
      badge.textContent = wishlist.length;
      badge.classList.toggle('hidden', wishlist.length === 0);
    });

    // Update Drawer count
    const drawerCountEl = document.querySelector('[data-drawer-wishlist-count]');
    if (drawerCountEl) drawerCountEl.textContent = wishlist.length;

    // Update heart icons on cards
    document.querySelectorAll('[data-wishlist-toggle]').forEach(btn => {
      const id = parseInt(btn.getAttribute('data-wishlist-toggle'), 10);
      setWishlistIconState(btn, wishlist.some(w => w.id === id));
    });

    // Render Wishlist Drawer — fetches each wishlisted product's real data by handle
    const container = document.querySelector('[data-drawer-wishlist-items]');
    const emptyState = document.querySelector('[data-drawer-wishlist-empty]');

    if (!container) return;

    if (wishlist.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.hidden = false;
      return;
    }

    if (emptyState) emptyState.hidden = true;

    const products = await Promise.all(
      wishlist.map(w => w.handle
        ? fetch(`/products/${w.handle}.js`).then(r => (r.ok ? r.json() : null)).catch(() => null)
        : Promise.resolve(null))
    );

    container.innerHTML = wishlist.map((w, i) => {
      const p = products[i];
      if (!p) return '';
      const img = p.featured_image || (p.images && p.images[0]) || '';
      const url = escapeHtml(p.url);
      const title = escapeHtml(p.title);
      return `
        <div class="flex gap-4 py-4 items-center">
          <a href="${url}" class="w-16 h-20 bg-[#E5D7CD] shrink-0 block overflow-hidden">
            ${img ? `<img src="${escapeHtml(img)}" alt="${title}" class="w-full h-full object-cover">` : ''}
          </a>
          <div class="flex-1 min-w-0">
            <h4 class="font-display text-sm font-light truncate"><a href="${url}">${title}</a></h4>
            <span class="text-xs font-medium">${formatPrice(p.price / 100)}</span>
          </div>
          <button type="button" class="px-3 py-1.5 bg-[#A87052] text-white text-[9px] tracking-[0.18em] uppercase font-medium hover:opacity-85" onclick="window.aurcaWishToCart(${w.id})">
            Add
          </button>
          <button type="button" class="p-1 hover:text-red-500 transition-colors" onclick="window.aurcaRemoveWish(${w.id})" aria-label="Remove wishlist item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      `;
    }).join('');
  }

  window.aurcaWishToCart = async function (id) {
    const entry = wishlist.find(w => w.id === id);
    if (!entry || !entry.handle) return;
    try {
      const product = await fetch(`/products/${entry.handle}.js`).then(r => r.json());
      // ponytail: adds the first available variant sight-unseen (no size/color picker
      // from the wishlist row) — open the product page to choose options precisely.
      const variant = product.variants.find(v => v.available) || product.variants[0];
      if (!variant) return;
      await cartAddItems([{ id: variant.id, quantity: 1 }]);
      await refreshCartDrawer();
      showToast(currentLang === 'en' ? 'Added to bag' : 'تمت الإضافة للحقيبة');
      openDrawer('cart');
    } catch (e) {
      showToast(currentLang === 'en' ? 'Could not add to bag' : 'تعذّرت الإضافة للحقيبة', 'info');
    }
  };

  window.aurcaRemoveWish = function (id) {
    toggleWishlist(id);
  };

  /* ==========================================================================
     7. MODAL HELPERS (OPEN / CLOSE)
     ========================================================================== */
  function openModal(id) {
    const modal = document.getElementById(`modal-${id}`);
    if (!modal) return;
    modal.hidden = false;
    modal.removeAttribute('hidden');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal(id) {
    const modal = document.getElementById(`modal-${id}`);
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute('hidden', '');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  function openDrawer(type) {
    const drawer = document.getElementById(`modal-${type}-drawer`);
    if (!drawer) return;
    drawer.hidden = false;
    drawer.removeAttribute('hidden');
    drawer.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer(type) {
    const drawer = document.getElementById(`modal-${type}-drawer`);
    if (!drawer) return;
    drawer.hidden = true;
    drawer.setAttribute('hidden', '');
    drawer.style.display = 'none';
    document.body.style.overflow = '';
  }

  /* ==========================================================================
     8. QUICK VIEW MODAL LOGIC — fetches the real product (by handle) via
     Shopify's /products/{handle}.js AJAX endpoint. Replaces the old version
     that read from the 12-item fake PRODUCTS array.
     ========================================================================== */
  let qvProduct = null;
  let qvSelectedOptions = [];
  let qvQty = 1;

  const COLOR_SWATCHES = {
    copper: '#A87052', terracotta: '#A87052', charcoal: '#494D57', slate: '#494D57',
    dark: '#2D2E2D', mauve: '#97606C', burgundy: '#4A1A28', blush: '#E5D7CD',
    sand: '#E5D7CD', silver: '#BCBCBC', champagne: '#F8F6F1', cream: '#F8F6F1',
    sage: '#A9B29B', ivory: '#FFFFF0', taupe: '#B9A08E'
  };

  function swatchColorFor(value) {
    const handle = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return COLOR_SWATCHES[handle] || '#A87052';
  }

  function qvResolveVariant() {
    if (!qvProduct) return null;
    if (qvProduct.variants.length === 1) return qvProduct.variants[0];
    return qvProduct.variants.find(v =>
      qvSelectedOptions.every((val, idx) => val == null || v[`option${idx + 1}`] === val)
    ) || null;
  }

  function qvRenderAddState() {
    if (!qvProduct) return;
    const variant = qvResolveVariant();
    const priceEl = document.getElementById('qv-price');
    const compareEl = document.getElementById('qv-compare');
    const refPrice = variant ? variant.price : qvProduct.price;
    if (priceEl) priceEl.textContent = formatPrice(refPrice / 100);
    if (compareEl) {
      const comparePrice = variant ? variant.compare_at_price : qvProduct.compare_at_price;
      if (comparePrice && comparePrice > refPrice) {
        compareEl.textContent = formatPrice(comparePrice / 100);
        compareEl.classList.remove('hidden');
      } else {
        compareEl.classList.add('hidden');
      }
    }
    const addBtn = document.getElementById('qv-add-btn');
    if (addBtn) {
      const strings = window.hestiaStrings || {};
      if (!variant) {
        addBtn.disabled = true;
        addBtn.textContent = strings.unavailable || 'Unavailable';
      } else if (!variant.available) {
        addBtn.disabled = true;
        addBtn.textContent = strings.soldOut || 'Sold out';
      } else {
        addBtn.disabled = false;
        addBtn.textContent = strings.addToCart || 'Add to Cart';
      }
    }
    if (variant && variant.featured_image) {
      const mainImg = document.getElementById('qv-main-img');
      if (mainImg) mainImg.src = variant.featured_image.src || variant.featured_image;
    }
  }

  function qvRenderOptions() {
    const wrap = document.getElementById('qv-options');
    if (!wrap || !qvProduct) return;
    wrap.innerHTML = '';
    qvProduct.options.forEach((option, idx) => {
      const isColor = option.name === 'Color' || option.name === 'Colour';
      const group = document.createElement('div');
      const label = document.createElement('label');
      label.className = 'block text-[9px] tracking-[0.25em] uppercase font-semibold text-[#2D2E2D] dark:text-[#F0EDE8] mb-2';
      label.textContent = option.name;
      group.appendChild(label);
      const row = document.createElement('div');
      row.className = 'flex gap-2 flex-wrap';
      option.values.forEach(value => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isActive = qvSelectedOptions[idx] === value;
        if (isColor) {
          btn.className = `w-8 h-8 rounded-full border transition-colors ${isActive ? 'ring-2 ring-offset-2 ring-[#A87052] border-transparent' : 'border-black/20'}`;
          btn.style.background = swatchColorFor(value);
          btn.title = value;
        } else {
          btn.className = `min-w-[2.5rem] h-10 px-3 border text-xs font-medium transition-colors ${isActive ? 'border-[#A87052] bg-[#A87052] text-white' : 'border-black/15 dark:border-white/15 hover:border-[#A87052]'}`;
          btn.textContent = value;
        }
        btn.addEventListener('click', () => {
          qvSelectedOptions[idx] = value;
          qvRenderOptions();
          qvRenderAddState();
        });
        row.appendChild(btn);
      });
      group.appendChild(row);
      wrap.appendChild(group);
    });
  }

  async function openQuickView(handle) {
    if (!handle) return;
    try {
      qvProduct = await fetch(`/products/${handle}.js`).then(r => r.json());
    } catch (e) {
      showToast(currentLang === 'en' ? 'Could not load that product' : 'تعذّر تحميل هذا المنتج', 'info');
      return;
    }

    const firstVariant = qvProduct.variants[0] || {};
    qvSelectedOptions = [firstVariant.option1, firstVariant.option2, firstVariant.option3].filter(v => v != null);
    qvQty = 1;

    const images = qvProduct.images || [];
    const mainImg = document.getElementById('qv-main-img');
    if (mainImg) mainImg.src = qvProduct.featured_image || images[0] || '';

    const thumbsContainer = document.getElementById('qv-thumbnails');
    if (thumbsContainer) {
      thumbsContainer.innerHTML = images.slice(0, 4).map((src, idx) => `
        <button type="button" class="aspect-[3/4] overflow-hidden border ${idx === 0 ? 'border-[#A87052]' : 'border-transparent'} hover:border-[#A87052] transition-colors" data-qv-thumb="${escapeHtml(src)}">
          <img src="${escapeHtml(src)}" class="w-full h-full object-cover">
        </button>
      `).join('');
      thumbsContainer.querySelectorAll('[data-qv-thumb]').forEach(btn => {
        btn.addEventListener('click', () => {
          if (mainImg) mainImg.src = btn.getAttribute('data-qv-thumb');
          thumbsContainer.querySelectorAll('button').forEach(b => b.classList.add('border-transparent'));
          thumbsContainer.querySelectorAll('button').forEach(b => b.classList.remove('border-[#A87052]'));
          btn.classList.add('border-[#A87052]');
          btn.classList.remove('border-transparent');
        });
      });
    }

    const eyebrow = document.getElementById('qv-eyebrow');
    if (eyebrow) eyebrow.textContent = qvProduct.type || qvProduct.vendor || '';

    const title = document.getElementById('qv-title');
    if (title) title.textContent = qvProduct.title;

    const body = document.getElementById('qv-body');
    if (body) body.textContent = (qvProduct.description || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 220);

    // ponytail: /products/{handle}.js doesn't expose metafields (fabric & care lives
    // there) — the care accordion stays on the full product page, one click away.
    const careWrap = document.getElementById('qv-care-wrap');
    if (careWrap) careWrap.hidden = true;

    qvRenderOptions();
    qvRenderAddState();

    const qvWishBtn = document.getElementById('qv-wish-btn');
    if (qvWishBtn) setWishlistIconState(qvWishBtn, wishlist.some(w => w.id === qvProduct.id));

    const qtyEl = document.getElementById('qv-qty');
    if (qtyEl) qtyEl.textContent = '1';

    openModal('quickview');
  }

  /* ==========================================================================
     9. HERO SLIDER AUTO-ADVANCE & CONTROLS
     ========================================================================== */
  function initHeroSlider() {
    const slider = document.querySelector('[data-hero-slider]');
    if (!slider) return;

    const slides = slider.querySelectorAll('[data-slide]');
    const dots = slider.querySelectorAll('[data-hero-dot]');
    const currentCounter = slider.querySelector('[data-hero-current]');
    let currentIndex = 0;
    let timer = null;

    function goToSlide(idx) {
      currentIndex = (idx + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        if (i === currentIndex) {
          slide.classList.remove('opacity-0', 'z-0');
          slide.classList.add('opacity-100', 'z-10');
        } else {
          slide.classList.remove('opacity-100', 'z-10');
          slide.classList.add('opacity-0', 'z-0');
        }
      });

      dots.forEach((dot, i) => {
        if (i === currentIndex) {
          dot.style.width = '28px';
          dot.style.background = 'white';
        } else {
          dot.style.width = '10px';
          dot.style.background = 'rgba(255,255,255,0.38)';
        }
      });

      if (currentCounter) {
        currentCounter.textContent = String(currentIndex + 1).padStart(2, '0');
      }
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(() => goToSlide(currentIndex + 1), 5500);
    }

    const prevBtn = slider.querySelector('[data-hero-prev]');
    const nextBtn = slider.querySelector('[data-hero-next]');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        startTimer();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        startTimer();
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goToSlide(i);
        startTimer();
      });
    });

    startTimer();
  }

  /* ==========================================================================
     10. PRODUCT FILTERS & LOAD MORE
     ========================================================================== */
  function initProductTabs() {
    const tabs = document.querySelectorAll('[data-product-tab]');
    const cards = document.querySelectorAll('.product-card-item');
    const loadMoreBtn = document.querySelector('[data-load-more]');

    // Real cards (snippets/product-card.liquid) carry their category on the nested
    // .product-card element as data-product-cat, not on this wrapper.
    function cardCategory(card) {
      return card.getAttribute('data-cat') || card.querySelector('[data-product-cat]')?.getAttribute('data-product-cat');
    }

    function applyFilter(tabName) {
      currentFilter = tabName;
      visibleCount = 6;

      tabs.forEach(btn => {
        const name = btn.getAttribute('data-product-tab');
        if (name === tabName) {
          btn.style.background = '#A87052';
          btn.style.color = 'white';
        } else {
          btn.style.background = 'transparent';
          btn.style.color = '#494D57';
        }
      });

      let matchCount = 0;
      cards.forEach(card => {
        const cat = cardCategory(card);
        const matches = (tabName === 'All' || cat === tabName);
        if (matches) {
          matchCount++;
          if (matchCount <= visibleCount) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        } else {
          card.classList.add('hidden');
        }
      });

      if (loadMoreBtn) {
        loadMoreBtn.hidden = matchCount <= visibleCount;
      }

      const featuredGrid = document.querySelector('[data-featured-grid]');
      if (featuredGrid) {
        featuredGrid.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }

    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        applyFilter(btn.getAttribute('data-product-tab'));
      });
    });

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        visibleCount += 6;
        let matchCount = 0;
        cards.forEach(card => {
          const cat = cardCategory(card);
          const matches = (currentFilter === 'All' || cat === currentFilter);
          if (matches) {
            matchCount++;
            if (matchCount <= visibleCount) {
              card.classList.remove('hidden');
            }
          }
        });
        if (matchCount <= visibleCount) {
          loadMoreBtn.hidden = true;
        }
      });
    }

  }

  /* ==========================================================================
     11. SEARCH MODAL LOGIC
     ========================================================================== */
  function initSearchModal() {
    const input = document.getElementById('search-modal-input');
    const results = document.getElementById('search-modal-results');
    if (!input || !results) return;

    function renderSearchResults(query = '') {
      const q = query.trim().toLowerCase();
      let matched = PRODUCTS;
      if (q) {
        matched = PRODUCTS.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.cat.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q)
        );
      }

      if (matched.length === 0) {
        results.innerHTML = `
          <div class="py-8 text-center text-xs text-[#494D57] dark:text-[#9A9690]">
            No pieces found matching "${query}". Try searching for Silk, Robe, or Women.
          </div>
        `;
        return;
      }

      results.innerHTML = matched.slice(0, 8).map(p => `
        <div class="flex items-center gap-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 px-2 cursor-pointer transition-colors" onclick="window.aurcaOpenQuickView(${p.id});">
          <img src="${p.img}" class="w-12 h-14 object-cover bg-[#E5D7CD] shrink-0">
          <div class="flex-1 min-w-0">
            <h4 class="font-display text-sm font-light truncate">${p.name}</h4>
            <p class="text-[9px] text-[#494D57] dark:text-[#9A9690]">${p.cat} · ${p.fabric}</p>
          </div>
          <span class="text-xs font-medium">${formatPrice(p.price)}</span>
        </div>
      `).join('');
    }

    input.addEventListener('input', (e) => renderSearchResults(e.target.value));

    document.querySelectorAll('[data-search-chip]').forEach(chip => {
      chip.addEventListener('click', () => {
        const val = chip.getAttribute('data-search-chip');
        input.value = val === 'All' ? '' : val;
        renderSearchResults(input.value);
      });
    });

    renderSearchResults('');
  }

  window.aurcaOpenQuickView = function (id) {
    closeModal('search');
    openQuickView(id);
  };

  /* ==========================================================================
     12. EVENT LISTENERS SETUP
     ========================================================================== */
  function initEventListeners() {
    // Drawer open triggers
    document.querySelectorAll('[data-cart-open]').forEach(el => {
      el.addEventListener('click', (e) => { e.preventDefault(); openDrawer('cart'); });
    });

    document.querySelectorAll('[data-wishlist-open]').forEach(el => {
      el.addEventListener('click', (e) => { e.preventDefault(); openDrawer('wishlist'); });
    });

    // Drawer close triggers
    document.querySelectorAll('[data-close-drawer]').forEach(el => {
      el.addEventListener('click', () => {
        closeDrawer(el.getAttribute('data-close-drawer'));
      });
    });

    // Modal close triggers
    document.querySelectorAll('[data-close-modal]').forEach(el => {
      el.addEventListener('click', () => {
        closeModal(el.getAttribute('data-close-modal'));
      });
    });

    // Search open
    document.querySelectorAll('[data-search-open]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('search');
        const input = document.getElementById('search-modal-input');
        if (input) setTimeout(() => input.focus(), 50);
      });
    });

    // Account open
    document.querySelectorAll('[data-account-open]').forEach(el => {
      el.addEventListener('click', (e) => { e.preventDefault(); openModal('account'); });
    });

    // Size guide open
    document.querySelectorAll('[data-size-guide-open]').forEach(el => {
      el.addEventListener('click', (e) => { e.preventDefault(); openModal('sizeguide'); });
    });

    // Support open
    document.querySelectorAll('[data-support-open]').forEach(el => {
      el.addEventListener('click', (e) => { e.preventDefault(); openModal('support'); });
    });

    // Coming soon open
    document.querySelectorAll('[data-coming-soon]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const title = el.getAttribute('data-coming-soon');
        const titleEl = document.getElementById('comingsoon-title');
        if (titleEl && title) titleEl.textContent = title;
        openModal('comingsoon');
      });
    });

    // Ask a question triggers on product cards
    document.querySelectorAll('[data-ask-question]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const prodName = el.getAttribute('data-ask-question');
        const nameEl = document.getElementById('ask-product-name');
        if (nameEl) nameEl.textContent = `Regarding: ${prodName}`;
        openModal('askquestion');
      });
    });

    // Quick View triggers on cards
    document.querySelectorAll('[data-open-quickview]').forEach(wrap => {
      wrap.addEventListener('click', () => {
        const id = wrap.getAttribute('data-open-quickview');
        openQuickView(id);
      });
    });

    // Quick size pills + real add-to-cart on Shopify product cards
    // (snippets/product-card.liquid). Each size-selector-group (e.g. Her / Him on
    // "together" pieces) toggles its own active pill independently; resolveVariantFromCard
    // reads whichever pill is active in each group to find the exact variant to add.
    document.querySelectorAll('.size-selector-group').forEach(group => {
      group.querySelectorAll('.size-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          group.querySelectorAll('.size-pill').forEach(b => {
            b.classList.remove('active-size', 'bg-[#A87052]');
            b.classList.add('bg-white/10');
          });
          btn.classList.add('active-size', 'bg-[#A87052]');
          btn.classList.remove('bg-white/10');
        });
      });
    });

    document.querySelectorAll('[data-quick-add-btn]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const card = btn.closest('.product-card');
        const variant = card ? resolveVariantFromCard(card) : null;
        if (!variant) {
          showToast(currentLang === 'en' ? 'Please select a size' : 'يرجى اختيار مقاس', 'info');
          return;
        }
        if (!variant.available) {
          showToast(currentLang === 'en' ? 'That size is sold out' : 'هذا المقاس غير متوفر', 'info');
          return;
        }
        try {
          await cartAddItems([{ id: variant.id, quantity: 1 }]);
          await refreshCartDrawer();
          showToast(currentLang === 'en' ? 'Added to bag' : 'تمت الإضافة للحقيبة');
          openDrawer('cart');
        } catch (err) {
          showToast(err.message, 'info');
        }
      });
    });

    // Wishlist buttons on cards
    document.querySelectorAll('[data-wishlist-toggle]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-wishlist-toggle');
        const handle = btn.getAttribute('data-wishlist-handle');
        const wasWished = wishlist.some(w => w.id === parseInt(id, 10));
        toggleWishlist(id, handle);
        if (!wasWished) pulseWishlistIcon(btn);
      });
    });

    // Quick View Modal qty & add — option pills are (re)built by qvRenderOptions()
    // itself each time the modal opens, since they depend on the fetched product.
    const qvPlus = document.getElementById('qv-qty-plus');
    const qvMinus = document.getElementById('qv-qty-minus');
    const qvQtyEl = document.getElementById('qv-qty');
    if (qvPlus && qvMinus && qvQtyEl) {
      qvPlus.addEventListener('click', () => {
        qvQty += 1;
        qvQtyEl.textContent = qvQty;
      });
      qvMinus.addEventListener('click', () => {
        if (qvQty > 1) {
          qvQty -= 1;
          qvQtyEl.textContent = qvQty;
        }
      });
    }

    const qvAddBtn = document.getElementById('qv-add-btn');
    if (qvAddBtn) {
      qvAddBtn.addEventListener('click', async () => {
        const variant = qvResolveVariant();
        if (!qvProduct || !variant || !variant.available) return;
        try {
          await cartAddItems([{ id: variant.id, quantity: qvQty }]);
          await refreshCartDrawer();
          showToast(currentLang === 'en' ? `"${qvProduct.title}" added to bag` : `تمت إضافة "${qvProduct.title}" للحقيبة`);
          closeModal('quickview');
          openDrawer('cart');
        } catch (err) {
          showToast(err.message, 'info');
        }
      });
    }

    const qvWishBtn = document.getElementById('qv-wish-btn');
    if (qvWishBtn) {
      qvWishBtn.addEventListener('click', () => {
        if (!qvProduct) return;
        const wasWished = wishlist.some(w => w.id === qvProduct.id);
        toggleWishlist(qvProduct.id, qvProduct.handle);
        setWishlistIconState(qvWishBtn, !wasWished);
        if (!wasWished) pulseWishlistIcon(qvWishBtn);
      });
    }

    // Language Toggle
    document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const nextLang = currentLang === 'en' ? 'ar' : 'en';
        applyLanguage(nextLang);
      });
    });

    // Dark Mode Toggle
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('aurca:appearance', isDark ? 'dark' : 'light');
        localStorage.setItem('hestia:appearance', isDark ? 'dark' : 'light');
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) metaTheme.content = isDark ? '#141414' : '#F8F6F1';
      });
    });


    // Mobile menu toggle
    const menuBtn = document.querySelector('[data-menu-open]');
    const mobileMenu = document.querySelector('[data-menu]');
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', () => {
        mobileMenu.hidden = !mobileMenu.hidden;
      });
    }

    // Newsletter submit handler
    document.querySelectorAll('[data-newsletter-form]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        form.hidden = true;
        const success = form.parentElement.querySelector('[data-newsletter-success]');
        if (success) success.hidden = false;
        showToast(currentLang === 'en' ? "You're in the circle." : 'أصبحت جزءاً من مجتمعنا.');
      });
    });

    // Cookie consent handler
    const cookieBanner = document.getElementById('cookie-consent-banner');
    if (cookieBanner) {
      if (!localStorage.getItem('aurca_cookie')) {
        cookieBanner.hidden = false;
        cookieBanner.removeAttribute('hidden');
        cookieBanner.style.display = 'block';
        document.getElementById('cookie-accept-btn')?.addEventListener('click', () => {
          localStorage.setItem('aurca_cookie', '1');
          cookieBanner.hidden = true;
          cookieBanner.setAttribute('hidden', '');
          cookieBanner.style.display = 'none';
        });
        document.getElementById('cookie-decline-btn')?.addEventListener('click', () => {
          localStorage.setItem('aurca_cookie', '0');
          cookieBanner.hidden = true;
          cookieBanner.setAttribute('hidden', '');
          cookieBanner.style.display = 'none';
        });
      } else {
        cookieBanner.hidden = true;
        cookieBanner.setAttribute('hidden', '');
        cookieBanner.style.display = 'none';
      }
    }

    // Ask question form submit
    const askForm = document.getElementById('ask-question-form');
    if (askForm) {
      askForm.addEventListener('submit', (e) => {
        e.preventDefault();
        askForm.hidden = true;
        const success = document.getElementById('ask-question-success');
        if (success) success.hidden = false;
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        ['quickview', 'search', 'sizeguide', 'askquestion', 'support', 'account', 'comingsoon', 'lightbox'].forEach(closeModal);
        ['cart', 'wishlist'].forEach(closeDrawer);
      }
    });
  }

  /* ==========================================================================
     12a. PRODUCT PAGE VARIANT PICKER (sections/main-product.liquid)
     Was pure static markup — selecting Size/Color never updated the price, the
     hidden variant id, or whether Add to Cart was enabled, so submitting always
     added whatever variant happened to render first. Wires it to the real
     variants embedded via data-product-json (same pattern as product-card.liquid).
     ========================================================================== */
  function initProductForm() {
    document.querySelectorAll('[data-product]').forEach(root => {
      let variants = [];
      try { variants = JSON.parse(root.dataset.productJson || '[]'); } catch (e) { return; }
      if (!variants.length) return;

      const variantIdInput = root.querySelector('[data-variant-id]');
      const priceWrap = root.querySelector('[data-price]');
      const addBtn = root.querySelector('[data-add-to-cart]');
      const addLabel = addBtn ? addBtn.querySelector('[data-add-label]') : null;
      const form = root.querySelector('form');
      const qtyInput = root.querySelector('[data-qty]');
      const qtyPlus = root.querySelector('[data-qty-plus]');
      const qtyMinus = root.querySelector('[data-qty-minus]');

      function currentVariant() {
        if (variants.length === 1) return variants[0];
        const selected = [];
        root.querySelectorAll('fieldset[data-option-index]').forEach(fieldset => {
          const idx = parseInt(fieldset.getAttribute('data-option-index'), 10);
          const checked = fieldset.querySelector('input[type="radio"]:checked');
          if (checked) selected[idx] = checked.value;
        });
        return variants.find(v => selected.every((val, idx) => val == null || v[`option${idx + 1}`] === val)) || null;
      }

      function render() {
        const variant = currentVariant();
        if (variantIdInput) variantIdInput.value = variant ? variant.id : '';

        if (variant && variant.featured_image) {
          const mainImg = root.querySelector('[data-main-image]');
          if (mainImg) mainImg.src = variant.featured_image.src || variant.featured_image;
        }

        if (priceWrap && variant) {
          const hasCompare = variant.compare_at_price > variant.price;
          priceWrap.innerHTML = hasCompare
            ? `<span class="flex gap-2 items-center"><span class="font-body-md text-on-surface-variant">${formatPrice(variant.price / 100)}</span><s class="font-body-md text-[14px] text-outline">${formatPrice(variant.compare_at_price / 100)}</s></span>`
            : `<span class="font-body-md text-on-surface-variant">${formatPrice(variant.price / 100)}</span>`;
        }

        const strings = window.hestiaStrings || {};
        if (addBtn) {
          const available = !!(variant && variant.available);
          addBtn.disabled = !available;
          if (addLabel) addLabel.textContent = !variant ? (strings.unavailable || 'Unavailable') : (available ? (strings.addToCart || 'Add to Cart') : (strings.soldOut || 'Sold out'));
        }

        root.querySelectorAll('fieldset[data-option-index]').forEach(fieldset => {
          const label = fieldset.querySelector('[data-option-label]');
          const checked = fieldset.querySelector('input[type="radio"]:checked');
          if (label && checked) label.textContent = checked.value;
        });
      }

      root.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', render);
      });

      if (qtyInput && qtyPlus && qtyMinus) {
        qtyPlus.addEventListener('click', () => {
          qtyInput.value = Math.max(1, (parseInt(qtyInput.value, 10) || 1) + 1);
        });
        qtyMinus.addEventListener('click', () => {
          qtyInput.value = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1);
        });
      }

      // AJAX-enhance "Add to Cart" only — a "Buy it Now" button (name="checkout") in
      // the same form should still submit natively straight to checkout.
      if (form) {
        form.addEventListener('submit', async (e) => {
          // Unknown submitter (older browser) or the "Buy it Now" button — let it
          // submit natively. The hidden variant id is already kept in sync above,
          // so a plain POST still adds/checks out the correct variant either way.
          if (!e.submitter || e.submitter.name !== 'add') return;
          const variant = currentVariant();
          if (!variant || !variant.available) return;
          e.preventDefault();
          const qty = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;
          if (addBtn) addBtn.disabled = true;
          try {
            await cartAddItems([{ id: variant.id, quantity: qty }]);
            await refreshCartDrawer();
            showToast(currentLang === 'en' ? 'Added to bag' : 'تمت الإضافة للحقيبة');
            openDrawer('cart');
          } catch (err) {
            showToast(err.message, 'info');
            form.submit();
          } finally {
            render();
          }
        });
      }

      render();
    });
  }

  /* ==========================================================================
     12a1b. PRODUCT IMAGE GALLERY + LIGHTBOX (sections/main-product.liquid)
     Thumbnails had markup but no click handler at all (dead buttons). Adds
     that, plus a full-screen lightbox to zoom through every product image.
     ========================================================================== */
  function initProductGallery() {
    const openBtn = document.querySelector('[data-gallery-open]');
    const mainImg = document.querySelector('[data-main-image]');
    const thumbs = Array.from(document.querySelectorAll('[data-thumb]'));

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const src = thumb.getAttribute('data-thumb-src');
        const alt = thumb.getAttribute('data-thumb-alt');
        if (mainImg && src) {
          mainImg.src = src;
          if (alt) mainImg.alt = alt;
        }
        thumbs.forEach(t => {
          t.classList.remove('border-primary');
          t.classList.add('border-transparent');
        });
        thumb.classList.add('border-primary');
        thumb.classList.remove('border-transparent');
        if (openBtn) openBtn.dataset.currentIndex = thumb.getAttribute('data-gallery-index');
      });
    });

    if (!openBtn) return;
    let gallery = [];
    try { gallery = JSON.parse(openBtn.getAttribute('data-gallery-json') || '[]'); } catch (e) { gallery = []; }
    if (!gallery.length) return;

    const lightbox = document.getElementById('modal-lightbox');
    if (!lightbox) return;
    const lightboxImg = lightbox.querySelector('[data-lightbox-image]');
    const counter = lightbox.querySelector('[data-lightbox-counter]');
    const prevBtn = lightbox.querySelector('[data-lightbox-prev]');
    const nextBtn = lightbox.querySelector('[data-lightbox-next]');
    let index = 0;

    function renderLightbox() {
      const item = gallery[index];
      if (!item || !lightboxImg) return;
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt || '';
      lightboxImg.classList.remove('scale-[1.75]');
      if (counter) counter.textContent = `${index + 1} / ${gallery.length}`;
    }

    const hasMultiple = gallery.length > 1;
    if (prevBtn) prevBtn.hidden = !hasMultiple;
    if (nextBtn) nextBtn.hidden = !hasMultiple;

    openBtn.addEventListener('click', () => {
      index = parseInt(openBtn.dataset.currentIndex || '0', 10) || 0;
      renderLightbox();
      openModal('lightbox');
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        index = (index - 1 + gallery.length) % gallery.length;
        renderLightbox();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        index = (index + 1) % gallery.length;
        renderLightbox();
      });
    }
    if (lightboxImg) {
      lightboxImg.addEventListener('click', () => {
        lightboxImg.classList.toggle('scale-[1.75]');
      });
    }

    document.addEventListener('keydown', (e) => {
      if (lightbox.hidden || !hasMultiple) return;
      if (e.key === 'ArrowLeft') { index = (index - 1 + gallery.length) % gallery.length; renderLightbox(); }
      if (e.key === 'ArrowRight') { index = (index + 1) % gallery.length; renderLightbox(); }
    });
  }

  /* ==========================================================================
     12a2. FULL CART PAGE (sections/main-cart.liquid) — same unwired-buttons bug
     as the drawer had: qty +/- and remove did nothing. Reloads after a change
     rather than re-rendering in place, since this is a full page, not a drawer.
     ========================================================================== */
  function initCartPage() {
    const root = document.querySelector('[data-cart]');
    if (!root) return;

    root.querySelectorAll('[data-line-qty]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const line = parseInt(btn.getAttribute('data-line-qty'), 10);
        const delta = parseInt(btn.getAttribute('data-delta'), 10);
        const qtyEl = btn.parentElement.querySelector('span');
        const currentQty = parseInt(qtyEl?.textContent || '1', 10);
        try {
          await cartChangeLine(line, currentQty + delta);
          window.location.reload();
        } catch (e) {
          showToast(e.message, 'info');
        }
      });
    });

    root.querySelectorAll('[data-line-remove]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const line = parseInt(btn.getAttribute('data-line-remove'), 10);
        try {
          await cartChangeLine(line, 0);
          window.location.reload();
        } catch (e) {
          showToast(e.message, 'info');
        }
      });
    });

    const noteField = root.querySelector('[data-cart-note]');
    if (noteField) {
      noteField.addEventListener('blur', () => {
        shopifyFetch('/cart/update.js', { method: 'POST', body: JSON.stringify({ note: noteField.value }) }).catch(() => {});
      });
    }
  }

  /* ==========================================================================
     12b. COLLECTION FILTERS DRAWER (mobile)
     ========================================================================== */
  function initCollectionFilters() {
    const aside = document.querySelector('[data-filters]');
    const backdrop = document.querySelector('[data-filters-backdrop]');
    if (!aside || !backdrop) return;

    function openFilters() {
      aside.classList.remove('-translate-x-full');
      backdrop.hidden = false;
      document.body.style.overflow = 'hidden';
    }

    function closeFilters() {
      aside.classList.add('-translate-x-full');
      backdrop.hidden = true;
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-filters-toggle]').forEach(btn => {
      btn.addEventListener('click', openFilters);
    });
    document.querySelectorAll('[data-filters-close]').forEach(btn => {
      btn.addEventListener('click', closeFilters);
    });
    backdrop.addEventListener('click', closeFilters);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeFilters();
    });
  }

  /* ==========================================================================
     12c. COLLECTION FILTERING & SORTING — entirely client-side (sections/main-
     collection.liquid). Every product on the page already carries its tags,
     price, title and created-at as data attributes; checking a filter or
     changing sort just shows/hides/reorders the already-rendered cards, with
     no page reload and no server round trip.
     ========================================================================== */
  function initProductFilters() {
    const root = document.querySelector('[data-collection-filters]');
    const grid = root ? root.querySelector('[data-product-grid]') : null;
    if (!root || !grid) return;

    const items = Array.from(grid.querySelectorAll('.product-filter-item'));
    const originalOrder = items.slice();
    const checkboxes = Array.from(root.querySelectorAll('[data-filter-checkbox]'));
    const noResults = root.querySelector('[data-no-results]');
    const activeWrap = root.querySelector('[data-active-filters]');
    const activeChips = root.querySelector('[data-active-filter-chips]');
    const clearBtn = root.querySelector('[data-clear-filters]');
    const filtersBadge = root.querySelector('[data-filters-badge]');
    const sortSelect = root.querySelector('[data-sort]');

    const itemTags = new Map();
    items.forEach(item => {
      const tags = (item.getAttribute('data-tags') || '').split(',').map(t => t.trim()).filter(Boolean);
      itemTags.set(item, tags);
    });

    // Fill in each checkbox's product count from the actually-rendered cards —
    // cheaper and always-accurate versus computing it server-side in Liquid.
    checkboxes.forEach(cb => {
      const tag = cb.getAttribute('data-filter-tag');
      const count = items.filter(item => itemTags.get(item).includes(tag)).length;
      const option = cb.closest('[data-filter-option]');
      const countEl = option ? option.querySelector('[data-filter-count]') : null;
      if (countEl) countEl.textContent = `(${count})`;
      if (count === 0) {
        cb.disabled = true;
        if (option) option.classList.add('opacity-40');
      }
    });

    function groupOf(checkbox) {
      return checkbox.getAttribute('data-filter-tag').split(':')[0];
    }

    function applyFilters() {
      const checked = checkboxes.filter(cb => cb.checked);
      const byGroup = {};
      checked.forEach(cb => {
        const group = groupOf(cb);
        (byGroup[group] = byGroup[group] || []).push(cb.getAttribute('data-filter-tag'));
      });
      const groups = Object.values(byGroup);

      let visibleCount = 0;
      items.forEach(item => {
        const tags = itemTags.get(item);
        const matches = groups.every(groupTags => groupTags.some(tag => tags.includes(tag)));
        item.hidden = !matches;
        if (matches) visibleCount += 1;
      });

      if (noResults) noResults.hidden = visibleCount > 0;
      grid.hidden = visibleCount === 0;
      if (filtersBadge) filtersBadge.hidden = checked.length === 0;

      if (!activeWrap) return;
      if (checked.length === 0) {
        activeWrap.hidden = true;
        return;
      }
      activeWrap.hidden = false;
      if (activeChips) {
        activeChips.innerHTML = '';
        checked.forEach(cb => {
          const labelSpan = cb.closest('label')?.querySelector('span');
          const label = (labelSpan ? labelSpan.textContent : '').replace(/\s*\(\d+\)\s*$/, '').trim();
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'inline-flex items-center gap-2 rounded-full border border-outline-variant pl-4 pr-3 py-1.5 font-body-md text-[13px] text-primary hover:border-terracotta transition-colors';
          chip.innerHTML = `${escapeHtml(label)} <span class="material-symbols-outlined text-[15px]" aria-hidden="true">close</span>`;
          chip.addEventListener('click', () => {
            cb.checked = false;
            applyFilters();
          });
          activeChips.appendChild(chip);
        });
      }
    }

    checkboxes.forEach(cb => cb.addEventListener('change', applyFilters));

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        checkboxes.forEach(cb => { cb.checked = false; });
        applyFilters();
      });
    }

    function applySort() {
      const value = sortSelect.value;
      if (value === 'manual') {
        originalOrder.forEach(item => grid.appendChild(item));
        return;
      }
      const [key, dir] = value.split('-');
      const factor = dir === 'descending' ? -1 : 1;
      const sorted = items.slice().sort((a, b) => {
        if (key === 'title') {
          return (a.getAttribute('data-title') || '').localeCompare(b.getAttribute('data-title') || '') * factor;
        }
        if (key === 'price') {
          return ((parseFloat(a.getAttribute('data-price')) || 0) - (parseFloat(b.getAttribute('data-price')) || 0)) * factor;
        }
        if (key === 'created') {
          return ((parseInt(a.getAttribute('data-created'), 10) || 0) - (parseInt(b.getAttribute('data-created'), 10) || 0)) * factor;
        }
        return 0;
      });
      sorted.forEach(item => grid.appendChild(item));
    }

    if (sortSelect) sortSelect.addEventListener('change', applySort);

    applyFilters();
  }

  /* ==========================================================================
     13. INITIALIZATION ON DOM READY
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    ['quickview', 'search', 'sizeguide', 'askquestion', 'support', 'account', 'comingsoon', 'lightbox'].forEach(closeModal);
    ['cart', 'wishlist'].forEach(closeDrawer);
    initHeroSlider();
    initProductTabs();
    initSearchModal();
    initCollectionFilters();
    initProductFilters();
    initProductForm();
    initProductGallery();
    initCartPage();
    initEventListeners();
    bindCartDrawerEvents();
    applyLanguage(currentLang);
    updateWishlistUI();
  });
})();
