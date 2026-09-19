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

  const PRODUCT_DETAILS = {
    1: {
      tagline: 'A midnight reverie in the finest silk.',
      body: 'Cut from hand-loomed mulberry silk, the Midnight Silk Set moves with extraordinary softness. Each panel is hand-finished with flat-fell seams and mother-of-pearl buttons. A study in restrained opulence.',
      care: ['Hand wash cold', 'Lay flat to dry', 'Cool iron inside out', 'Do not bleach']
    },
    2: {
      tagline: 'Morning light, bottled in fabric.',
      body: 'Premium modal — four times softer than cotton — in a relaxed wide-leg silhouette. The Morning Bloom set breathes through warm afternoons and holds its shape wash after wash.',
      care: ['Machine wash 30°C', 'Tumble dry low', 'Cool iron', 'Do not wring']
    },
    3: {
      tagline: 'Designed to be worn together.',
      body: "The Lavender Reverie is Aurca's signature couples set — matching cuts from a single bolt of hand-dyed mulberry silk. Offered in a shared palette, designed to complement without mirroring.",
      care: ['Hand wash cold', 'Lay flat to dry', 'Store folded, not hung', 'Dry away from sunlight']
    },
    4: {
      tagline: 'Effortless ivory from dawn to dusk.',
      body: 'Woven from GOTS-certified organic cotton, Cloud White is weightless, breathable, and quietly beautiful. The relaxed wide leg and smocked waistband adapt gracefully from morning to evening.',
      care: ['Machine wash 30°C', 'Tumble dry low', 'Warm iron', 'Do not bleach']
    },
    5: {
      tagline: 'The essential robe, made extraordinary.',
      body: 'Structured in velour-weight cotton that holds its nap through years of wear. The Dusk Robe features an inside-stitched belt, deep pockets, and a shawl collar that drapes without effort.',
      care: ['Machine wash 40°C', 'Tumble dry medium', 'Cool iron collar only', 'Do not dry clean']
    },
    6: {
      tagline: 'Couture at the threshold of sleep.',
      body: 'Cashmere blended with finest merino for drape without weight. The Noir Prestige set is produced in runs of 50 per colour — a quiet luxury made rarer by design.',
      care: ['Dry clean only', 'Store folded in cloth bag', 'Air between wears', 'Remove pills with cashmere comb']
    },
    7: {
      tagline: 'Ivory warmth for the quietest hours.',
      body: 'Our most relaxed silhouette in GOTS-certified organic cotton. The Ivory Embrace set features elastic-free cuffing, a full-length leg, and a loose-fit top that never clings.',
      care: ['Machine wash 30°C', 'Tumble dry low', 'Warm iron', 'Do not bleach']
    },
    8: {
      tagline: 'The understated essential, perfected.',
      body: 'Premium modal in a precise tailored cut — the Slate Essential set prioritises comfort without sacrificing structure. Fitted enough for evenings, relaxed enough for mornings.',
      care: ['Machine wash 30°C', 'Tumble dry low', 'Cool iron', 'Do not wring']
    },
    9: {
      tagline: 'A quiet romance in silk.',
      body: 'Rose Atelier blends a dusty mauve silk top with wide-leg ivory trousers — designed as a Together Edition piece but equally striking worn individually.',
      care: ['Hand wash cold', 'Lay flat to dry', 'Store folded, not hung', 'Dry away from sunlight']
    },
    10: {
      tagline: 'The lightest morning you can wear.',
      body: 'Pearl Morning in premium modal feels like a second skin by the second wear. A relaxed top with wide lace trim meets a fluid wide-leg trouser in this soft, luminous palette.',
      care: ['Machine wash 30°C', 'Tumble dry low', 'Cool iron', 'Do not wring']
    },
    11: {
      tagline: 'Black, structured, quietly refined.',
      body: 'Onyx Classic in velour-weight cotton offers deep coverage and a luxe hand-feel. The shawl collar and copper monogram detail mark it as distinctly Aurca.',
      care: ['Machine wash 40°C', 'Tumble dry medium', 'Cool iron collar only', 'Do not dry clean']
    },
    12: {
      tagline: 'Reserved for the rarest evenings.',
      body: 'Champagne Dreams arrives in a cashmere-silk blend woven to our highest thread specification. Produced once per season in a single colourway — this is Aurca at its most exceptional.',
      care: ['Dry clean only', 'Store folded in cloth bag', 'Air between wears', 'Remove pills with cashmere comb']
    }
  };

  const PRODUCT_GALLERIES = {
    1: [IMAGES.prod1, IMAGES.prod2, IMAGES.morning, IMAGES.lifestyle1],
    2: [IMAGES.prod2, IMAGES.prod4, IMAGES.lifestyle1, IMAGES.morning],
    3: [IMAGES.prod3, IMAGES.prod1, IMAGES.lifestyle4, IMAGES.lifestyle5],
    4: [IMAGES.prod4, IMAGES.prod1, IMAGES.morning, IMAGES.lifestyle1],
    5: [IMAGES.prod5, IMAGES.prod6, IMAGES.living, IMAGES.lifestyle2],
    6: [IMAGES.prod6, IMAGES.prod5, IMAGES.lifestyle2, IMAGES.living],
    7: [IMAGES.prod4, IMAGES.prod2, IMAGES.lifestyle1, IMAGES.morning],
    8: [IMAGES.prod5, IMAGES.prod6, IMAGES.lifestyle3, IMAGES.living],
    9: [IMAGES.prod3, IMAGES.prod6, IMAGES.lifestyle5, IMAGES.lifestyle4],
    10: [IMAGES.prod2, IMAGES.prod4, IMAGES.morning, IMAGES.lifestyle1],
    11: [IMAGES.prod6, IMAGES.prod5, IMAGES.living, IMAGES.lifestyle3],
    12: [IMAGES.prod1, IMAGES.prod3, IMAGES.lifestyle4, IMAGES.lifestyle5]
  };


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
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('aurca_cart') || '[]');
  } catch (e) {
    cart = [];
  }

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

  function saveCart() {
    localStorage.setItem('aurca_cart', JSON.stringify(cart));
    updateCartUI();
  }

  function saveWishlist() {
    localStorage.setItem('aurca_wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
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
    updateCartUI();
    updateWishlistUI();
  }

  /* ==========================================================================
     5. CART MANAGEMENT & DRAWER
     ========================================================================== */
  function addToCart(product, size = 'M') {
    const existing = cart.find(item => item.id === product.id && item.size === size);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        size: size,
        qty: 1,
        fabric: product.fabric
      });
    }
    saveCart();
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
    showToast(currentLang === 'en' ? `"${product.name}" added to bag` : `تمت إضافة "${product.name}" للحقيبة`);
    openDrawer('cart');
  }

  function updateCartQty(id, size, delta) {
    const item = cart.find(i => i.id === id && i.size === size);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => !(i.id === id && i.size === size));
    }
    saveCart();
  }

  function removeCartItem(id, size) {
    cart = cart.filter(i => !(i.id === id && i.size === size));
    saveCart();
  }

  function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Update Header cart count badges
    document.querySelectorAll('[data-cart-count]').forEach(badge => {
      badge.textContent = totalCount;
      if (totalCount > 0) {
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    });

    // Update Drawer cart count
    const drawerCountEl = document.querySelector('[data-drawer-cart-count]');
    if (drawerCountEl) drawerCountEl.textContent = totalCount;

    // Update Drawer Subtotal
    const subtotalEl = document.querySelector('[data-drawer-cart-subtotal]');
    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);

    // Update Shipping Progress Bar (Threshold: 2,500 EGP)
    const progressBar = document.querySelector('[data-shipping-progress-bar]');
    const progressText = document.querySelector('[data-shipping-progress-text]');
    if (progressBar && progressText) {
      const threshold = 2500;
      const pct = Math.min(100, Math.round((subtotal / threshold) * 100));
      progressBar.style.width = `${pct}%`;
      if (subtotal >= threshold) {
        progressText.textContent = currentLang === 'en' ? '✓ You qualify for free shipping!' : '✓ أنت مؤهل للشحن المجاني!';
        progressBar.style.background = '#494D57';
      } else {
        const remaining = threshold - subtotal;
        const formattedRemaining = formatPrice(remaining);
        progressText.textContent = currentLang === 'en' ? `Add ${formattedRemaining} for free shipping` : `أضف ${formattedRemaining} للشحن المجاني`;
        progressBar.style.background = '#A87052';
      }
    }

    // Render Items
    const itemsContainer = document.querySelector('[data-drawer-cart-items]');
    const emptyState = document.querySelector('[data-drawer-cart-empty]');
    const footerWrap = document.querySelector('[data-drawer-cart-footer]');

    if (!itemsContainer) return;

    if (cart.length === 0) {
      itemsContainer.innerHTML = '';
      if (emptyState) emptyState.hidden = false;
      if (footerWrap) footerWrap.hidden = true;
      return;
    }

    if (emptyState) emptyState.hidden = true;
    if (footerWrap) footerWrap.hidden = false;

    itemsContainer.innerHTML = cart.map(item => `
      <div class="flex gap-4 py-4 items-center">
        <img src="${item.img}" alt="${item.name}" class="w-16 h-20 object-cover bg-[#E5D7CD] shrink-0">
        <div class="flex-1 min-w-0">
          <h4 class="font-display text-sm font-light truncate">${item.name}</h4>
          <p class="text-[10px] text-[#494D57] dark:text-[#9A9690] mb-1">${item.fabric} · Size: ${item.size}</p>
          <span class="text-xs font-medium">${formatPrice(item.price)}</span>
        </div>
        <div class="flex items-center gap-2 border border-black/15 dark:border-white/15 px-2 py-1">
          <button type="button" class="text-xs px-1 hover:text-[#A87052]" onclick="window.aurcaUpdateQty(${item.id}, '${item.size}', -1)">-</button>
          <span class="text-xs font-medium w-4 text-center">${item.qty}</span>
          <button type="button" class="text-xs px-1 hover:text-[#A87052]" onclick="window.aurcaUpdateQty(${item.id}, '${item.size}', 1)">+</button>
        </div>
        <button type="button" class="p-1 hover:text-red-500 transition-colors" onclick="window.aurcaRemoveItem(${item.id}, '${item.size}')" aria-label="Remove item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
    `).join('');
  }

  // Global hooks for inline event handlers
  window.aurcaUpdateQty = updateCartQty;
  window.aurcaRemoveItem = removeCartItem;

  /* ==========================================================================
     6. WISHLIST MANAGEMENT & DRAWER
     ========================================================================== */
  function toggleWishlist(productId) {
    const id = parseInt(productId, 10);
    const idx = wishlist.indexOf(id);
    const product = PRODUCTS.find(p => p.id === id);
    if (idx !== -1) {
      wishlist.splice(idx, 1);
      showToast(currentLang === 'en' ? 'Removed from wishlist' : 'أُزيل من المفضلة', 'info');
    } else {
      wishlist.push(id);
      showToast(currentLang === 'en' ? `"${product?.name || 'Item'}" saved to wishlist` : `تمت إضافة القطعة للمفضلة`);
    }
    saveWishlist();
  }

  function updateWishlistUI() {
    // Update count in header
    document.querySelectorAll('[data-wishlist-count]').forEach(badge => {
      badge.textContent = wishlist.length;
      if (wishlist.length > 0) {
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    });

    // Update Drawer count
    const drawerCountEl = document.querySelector('[data-drawer-wishlist-count]');
    if (drawerCountEl) drawerCountEl.textContent = wishlist.length;

    // Update heart icons on cards
    document.querySelectorAll('[data-wishlist-toggle]').forEach(btn => {
      const id = parseInt(btn.getAttribute('data-wishlist-toggle'), 10);
      const isWished = wishlist.includes(id);
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
    });

    // Render Wishlist Drawer
    const container = document.querySelector('[data-drawer-wishlist-items]');
    const emptyState = document.querySelector('[data-drawer-wishlist-empty]');

    if (!container) return;

    if (wishlist.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.hidden = false;
      return;
    }

    if (emptyState) emptyState.hidden = true;

    const wishedProducts = wishlist.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
    container.innerHTML = wishedProducts.map(p => `
      <div class="flex gap-4 py-4 items-center">
        <img src="${p.img}" alt="${p.name}" class="w-16 h-20 object-cover bg-[#E5D7CD] shrink-0">
        <div class="flex-1 min-w-0">
          <h4 class="font-display text-sm font-light truncate">${p.name}</h4>
          <p class="text-[10px] text-[#494D57] dark:text-[#9A9690] mb-1">${p.cat} · ${p.fabric}</p>
          <span class="text-xs font-medium">${formatPrice(p.price)}</span>
        </div>
        <button type="button" class="px-3 py-1.5 bg-[#A87052] text-white text-[9px] tracking-[0.18em] uppercase font-medium hover:opacity-85" onclick="window.aurcaWishToCart(${p.id})">
          Add
        </button>
        <button type="button" class="p-1 hover:text-red-500 transition-colors" onclick="window.aurcaRemoveWish(${p.id})" aria-label="Remove wishlist item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
    `).join('');
  }

  window.aurcaWishToCart = function (id) {
    const product = PRODUCTS.find(p => p.id === id);
    if (product) addToCart(product, 'M');
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
     8. QUICK VIEW MODAL LOGIC
     ========================================================================== */
  let activeQuickViewProduct = null;
  let activeQuickViewSize = 'M';
  let activeQuickViewQty = 1;

  function openQuickView(productId) {
    const id = parseInt(productId, 10);
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;

    activeQuickViewProduct = product;
    activeQuickViewSize = 'M';
    activeQuickViewQty = 1;

    const details = PRODUCT_DETAILS[id] || {
      tagline: 'Refined comfort, without compromise.',
      body: 'Woven with exceptional craftsmanship for effortless mornings and peaceful nights.',
      care: ['Hand wash cold', 'Lay flat to dry', 'Cool iron']
    };

    const gallery = PRODUCT_GALLERIES[id] || [product.img, IMAGES.prod2, IMAGES.morning, IMAGES.lifestyle1];

    // Populate Fields
    const mainImg = document.getElementById('qv-main-img');
    if (mainImg) mainImg.src = gallery[0];

    const thumbsContainer = document.getElementById('qv-thumbnails');
    if (thumbsContainer) {
      thumbsContainer.innerHTML = gallery.map((imgSrc, idx) => `
        <button type="button" class="aspect-[3/4] overflow-hidden border ${idx === 0 ? 'border-[#A87052]' : 'border-transparent'} hover:border-[#A87052] transition-colors" onclick="document.getElementById('qv-main-img').src='${imgSrc}'">
          <img src="${imgSrc}" class="w-full h-full object-cover">
        </button>
      `).join('');
    }

    const eyebrow = document.getElementById('qv-eyebrow');
    if (eyebrow) eyebrow.textContent = `${product.cat} · ${product.fabric}`;

    const title = document.getElementById('qv-title');
    if (title) title.textContent = product.name;

    const price = document.getElementById('qv-price');
    if (price) price.textContent = formatPrice(product.price);

    const compare = document.getElementById('qv-compare');
    if (compare) {
      if (product.originalPrice) {
        compare.textContent = formatPrice(product.originalPrice);
        compare.classList.remove('hidden');
      } else {
        compare.classList.add('hidden');
      }
    }

    const tagline = document.getElementById('qv-tagline');
    if (tagline) tagline.textContent = details.tagline;

    const body = document.getElementById('qv-body');
    if (body) body.textContent = details.body;

    const careList = document.getElementById('qv-care-list');
    if (careList) {
      careList.innerHTML = details.care.map(c => `<li class="flex items-center gap-1.5">&bull; ${c}</li>`).join('');
    }

    const colorsWrap = document.getElementById('qv-colors');
    if (colorsWrap) {
      colorsWrap.innerHTML = product.colors.map((c, i) => `
        <button type="button" class="w-4 h-4 rounded-full border border-black/20 ${i === 0 ? 'ring-2 ring-offset-2 ring-[#A87052]' : ''}" style="background: ${c};" onclick="this.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('ring-2','ring-offset-2','ring-[#A87052]')); this.classList.add('ring-2','ring-offset-2','ring-[#A87052]');"></button>
      `).join('');
    }

    // Reset size buttons
    document.querySelectorAll('.qv-size-btn').forEach(btn => {
      const s = btn.getAttribute('data-qv-size');
      if (s === 'M') {
        btn.className = 'qv-size-btn w-10 h-10 border text-xs font-medium transition-colors border-[#A87052] bg-[#A87052] text-white';
      } else {
        btn.className = 'qv-size-btn w-10 h-10 border text-xs font-medium transition-colors border-black/15 dark:border-white/15 hover:border-[#A87052]';
      }
    });

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
        const cat = card.getAttribute('data-cat');
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
          const cat = card.getAttribute('data-cat');
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

    // Handle deep navigation links with [data-nav-filter]
    document.querySelectorAll('[data-nav-filter]').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetFilter = link.getAttribute('data-nav-filter');
        if (targetFilter) {
          applyFilter(targetFilter);
          const targetSection = document.getElementById('featured-products');
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
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

    // Quick size buttons on cards
    document.querySelectorAll('.product-card-item').forEach(card => {
      let selectedSize = 'M';
      card.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          card.querySelectorAll('.size-btn').forEach(b => {
            b.classList.remove('active-size', 'bg-[#A87052]');
            b.classList.add('bg-white/10');
          });
          btn.classList.add('active-size', 'bg-[#A87052]');
          btn.classList.remove('bg-white/10');
          selectedSize = btn.getAttribute('data-size');
        });
      });

      const addBtn = card.querySelector('[data-quick-add]');
      if (addBtn) {
        addBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = parseInt(addBtn.getAttribute('data-quick-add'), 10);
          const product = PRODUCTS.find(p => p.id === id);
          if (product) addToCart(product, selectedSize);
        });
      }
    });

    // Wishlist buttons on cards
    document.querySelectorAll('[data-wishlist-toggle]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-wishlist-toggle');
        toggleWishlist(id);
      });
    });

    // Quick View Modal options & add
    document.querySelectorAll('[data-qv-size]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-qv-size]').forEach(b => {
          b.className = 'qv-size-btn w-10 h-10 border text-xs font-medium transition-colors border-black/15 dark:border-white/15 hover:border-[#A87052]';
        });
        btn.className = 'qv-size-btn w-10 h-10 border text-xs font-medium transition-colors border-[#A87052] bg-[#A87052] text-white';
        activeQuickViewSize = btn.getAttribute('data-qv-size');
      });
    });

    const qvPlus = document.getElementById('qv-qty-plus');
    const qvMinus = document.getElementById('qv-qty-minus');
    const qvQty = document.getElementById('qv-qty');
    if (qvPlus && qvMinus && qvQty) {
      qvPlus.addEventListener('click', () => {
        activeQuickViewQty += 1;
        qvQty.textContent = activeQuickViewQty;
      });
      qvMinus.addEventListener('click', () => {
        if (activeQuickViewQty > 1) {
          activeQuickViewQty -= 1;
          qvQty.textContent = activeQuickViewQty;
        }
      });
    }

    const qvAddBtn = document.getElementById('qv-add-btn');
    if (qvAddBtn) {
      qvAddBtn.addEventListener('click', () => {
        if (!activeQuickViewProduct) return;
        for (let i = 0; i < activeQuickViewQty; i++) {
          addToCart(activeQuickViewProduct, activeQuickViewSize);
        }
        closeModal('quickview');
      });
    }

    const qvWishBtn = document.getElementById('qv-wish-btn');
    if (qvWishBtn) {
      qvWishBtn.addEventListener('click', () => {
        if (activeQuickViewProduct) {
          toggleWishlist(activeQuickViewProduct.id);
        }
      });
    }

    // Checkout Modal trigger from Drawer
    const drawerCheckoutBtn = document.querySelector('[data-drawer-checkout-btn]');
    if (drawerCheckoutBtn) {
      drawerCheckoutBtn.addEventListener('click', () => {
        closeDrawer('cart');
        const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const totalItemsEl = document.getElementById('checkout-total-items');
        const totalPriceEl = document.getElementById('checkout-total-price');
        if (totalItemsEl) totalItemsEl.textContent = `${totalCount} item${totalCount === 1 ? '' : 's'}`;
        if (totalPriceEl) totalPriceEl.textContent = formatPrice(subtotal);
        openModal('checkout');
      });
    }

    // Checkout Confirmation
    const checkoutConfirmBtn = document.getElementById('checkout-confirm-btn');
    if (checkoutConfirmBtn) {
      checkoutConfirmBtn.addEventListener('click', () => {
        cart = [];
        saveCart();
        closeModal('checkout');
        showToast(currentLang === 'en' ? 'Order placed successfully! 🎉' : 'تم تأكيد طلبك بنجاح! 🎉');
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

    // Synchronize initial product card prices to EGP immediately
    document.querySelectorAll('.product-card-item').forEach(card => {
      const id = parseInt(card.getAttribute('data-id'), 10);
      const product = PRODUCTS.find(p => p.id === id);
      if (product) {
        const priceSpan = card.querySelector('.font-medium');
        if (priceSpan) priceSpan.textContent = formatPrice(product.price);
      }
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
        ['quickview', 'search', 'sizeguide', 'askquestion', 'support', 'account', 'comingsoon', 'checkout'].forEach(closeModal);
        ['cart', 'wishlist'].forEach(closeDrawer);
      }
    });
  }

  /* ==========================================================================
     13. INITIALIZATION ON DOM READY
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    ['quickview', 'search', 'sizeguide', 'askquestion', 'support', 'account', 'comingsoon', 'checkout'].forEach(closeModal);
    ['cart', 'wishlist'].forEach(closeDrawer);
    initHeroSlider();
    initProductTabs();
    initSearchModal();
    initEventListeners();
    applyLanguage(currentLang);
    updateCartUI();
    updateWishlistUI();
  });
})();
