/* HESTIA theme JS — vanilla, no dependencies. */
(function () {
  'use strict';

  var money = function (cents) {
    // ponytail: handles {{amount}} / {{amount_no_decimals}} with comma thousands;
    // add the European (dot-thousands) variants only if the store ever switches to one
    var format = window.hestiaMoneyFormat || '${{amount}}';
    var noDecimals = format.indexOf('amount_no_decimals') !== -1;
    var amount = noDecimals ? String(Math.round(cents / 100)) : (cents / 100).toFixed(2);
    var parts = amount.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return format.replace(/\{\{\s*amount[^}]*\}\}/, parts.join('.'));
  };

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.querySelector('[data-menu-open]');
  var menu = document.querySelector('[data-menu]');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      menu.hidden = !menu.hidden;
      menuBtn.textContent = menu.hidden ? 'menu' : 'close';
    });
  }

  /* ---------- Account dropdown ---------- */
  var accountBtn = document.querySelector('[data-account-open]');
  var account = document.querySelector('[data-account]');
  if (accountBtn && account) {
    accountBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      account.hidden = !account.hidden;
      accountBtn.setAttribute('aria-expanded', account.hidden ? 'false' : 'true');
    });
    document.addEventListener('click', function (e) {
      if (!account.hidden && !account.contains(e.target)) {
        account.hidden = true;
        accountBtn.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !account.hidden) {
        account.hidden = true;
        accountBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Dark mode toggle ---------- */
  var themeToggle = document.querySelector('[data-theme-toggle]');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var dark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('hestia:appearance', dark ? 'dark' : 'light');
      document.querySelector('meta[name="theme-color"]').content = dark ? '#2D2D2D' : '#F8F3EE';
    });
  }

  /* ---------- Scroll fade-in ---------- */
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll('.fade-in-section').forEach(function (el) {
    observer.observe(el);
  });

  /* ---------- Carousels (featured products) ---------- */
  document.querySelectorAll('[data-carousel]').forEach(function (track) {
    var section = track.closest('section');
    var step = function () {
      return (track.querySelector(':scope > *') || { offsetWidth: 360 }).offsetWidth + 24;
    };
    var prev = section && section.querySelector('[data-carousel-prev]');
    var next = section && section.querySelector('[data-carousel-next]');
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
  });

  /* ---------- Header cart count ---------- */
  var setCartCount = function (count) {
    var bubble = document.querySelector('[data-cart-count]');
    if (!bubble) return;
    bubble.textContent = count;
    bubble.classList.toggle('hidden', count === 0);
  };

  /* ---------- Quick add (single-variant products) ---------- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-quick-add]');
    if (!btn) return;
    e.preventDefault();
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: Number(btn.dataset.quickAdd), quantity: 1 }),
    })
      .then(function (r) { return r.json(); })
      .then(function () { return fetch('/cart.js').then(function (r) { return r.json(); }); })
      .then(function (cart) { setCartCount(cart.item_count); });
  });

  /* ---------- Product page ---------- */
  var productEl = document.querySelector('[data-product]');
  if (productEl) {
    var variants = JSON.parse(productEl.dataset.productJson || '[]');

    // Gallery thumbs
    var mainImage = productEl.querySelector('[data-main-image]');
    productEl.querySelectorAll('[data-thumb]').forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        if (mainImage) mainImage.src = thumb.dataset.thumb;
        productEl.querySelectorAll('[data-thumb]').forEach(function (t) {
          t.classList.remove('border-primary');
          t.classList.add('border-transparent');
        });
        thumb.classList.add('border-primary');
        thumb.classList.remove('border-transparent');
      });
    });

    // Quantity stepper
    var qty = productEl.querySelector('[data-qty]');
    var minus = productEl.querySelector('[data-qty-minus]');
    var plus = productEl.querySelector('[data-qty-plus]');
    if (minus) minus.addEventListener('click', function () { qty.value = Math.max(1, Number(qty.value) - 1); });
    if (plus) plus.addEventListener('click', function () { qty.value = Number(qty.value) + 1; });

    // Variant resolution from option radios
    var fieldsets = productEl.querySelectorAll('[data-option-index]');
    var resolveVariant = function () {
      var selected = [];
      fieldsets.forEach(function (fs) {
        var checked = fs.querySelector('input:checked');
        selected[Number(fs.dataset.optionIndex)] = checked ? checked.value : null;
        var label = fs.querySelector('[data-option-label]');
        if (label && checked) label.textContent = checked.value;
      });
      return variants.find(function (v) {
        return selected.every(function (val, i) { return v.options[i] === val; });
      });
    };
    fieldsets.forEach(function (fs) {
      fs.addEventListener('change', function () {
        var variant = resolveVariant();
        var idInput = productEl.querySelector('[data-variant-id]');
        var addBtn = productEl.querySelector('[data-add-to-cart]');
        var addLabel = productEl.querySelector('[data-add-label]');
        var price = productEl.querySelector('[data-price]');
        if (!variant) {
          if (addBtn) addBtn.disabled = true;
          if (addLabel) addLabel.textContent = window.hestiaStrings.unavailable;
          return;
        }
        if (idInput) idInput.value = variant.id;
        history.replaceState(null, '', window.location.pathname + '?variant=' + variant.id);
        if (price) price.textContent = money(variant.price);
        if (addBtn) addBtn.disabled = !variant.available;
        if (addLabel) addLabel.textContent = variant.available ? window.hestiaStrings.addToCart : window.hestiaStrings.soldOut;
        if (variant.featured_image && mainImage) mainImage.src = variant.featured_image.src;
      });
    });

    // AJAX add to cart (skip when Buy it Now submits the form for checkout)
    var form = productEl.querySelector('form[action*="/cart/add"]');
    if (form) {
      form.addEventListener('submit', function (e) {
        if (e.submitter && e.submitter.name === 'checkout') return; // let Shopify handle Buy it Now
        e.preventDefault();
        var addBtn = form.querySelector('[data-add-to-cart]');
        var addLabel = form.querySelector('[data-add-label]');
        fetch('/cart/add.js', { method: 'POST', body: new FormData(form) })
          .then(function (r) {
            if (!r.ok) throw new Error('add failed');
            return fetch('/cart.js');
          })
          .then(function (r) { return r.json(); })
          .then(function (cart) {
            setCartCount(cart.item_count);
            if (addLabel) {
              var original = addLabel.textContent;
              addLabel.textContent = window.hestiaStrings.added;
              setTimeout(function () { addLabel.textContent = original; }, 1500);
            }
          })
          .catch(function () { if (addBtn) addBtn.disabled = false; });
      });
    }

    // Exclusive accordions
    var group = productEl.querySelector('[data-accordion-group]');
    if (group) {
      group.querySelectorAll('details').forEach(function (el) {
        el.addEventListener('toggle', function () {
          if (!el.open) return;
          group.querySelectorAll('details').forEach(function (other) {
            if (other !== el) other.removeAttribute('open');
          });
        });
      });
    }
  }

  /* ---------- Cart page ---------- */
  var cartEl = document.querySelector('[data-cart]');
  if (cartEl) {
    var changeLine = function (line, quantity) {
      fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line: line, quantity: quantity }),
      }).then(function () { location.reload(); }); // ponytail: full reload keeps totals/progress bar in sync without a rendering layer
    };
    cartEl.addEventListener('click', function (e) {
      var stepBtn = e.target.closest('[data-line-qty]');
      if (stepBtn) {
        var row = stepBtn.closest('[data-line]');
        var current = Number(row.querySelector('.min-w-\\[20px\\]').textContent);
        changeLine(Number(stepBtn.dataset.lineQty), Math.max(0, current + Number(stepBtn.dataset.delta)));
      }
      var removeBtn = e.target.closest('[data-line-remove]');
      if (removeBtn) changeLine(Number(removeBtn.dataset.lineRemove), 0);
    });
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
  }

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

  /* ---------- Collection filters (mobile toggle) ---------- */
  var filtersToggle = document.querySelector('[data-filters-toggle]');
  var filters = document.querySelector('[data-filters]');
  if (filtersToggle && filters) {
    filtersToggle.addEventListener('click', function () {
      filters.classList.toggle('hidden');
    });
  }
  var sort = document.querySelector('[data-sort]');
  if (sort) {
    sort.addEventListener('change', function () { sort.form.submit(); });
  }
})();
