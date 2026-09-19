const fs = require('fs');
const assert = require('assert');

const liquid = fs.readFileSync('sections/featured-products.liquid', 'utf8');
const cardSnippet = fs.readFileSync('snippets/product-card.liquid', 'utf8');
const js = fs.readFileSync('assets/theme.js', 'utf8');

// 1. Check container has mobile flex + scroll-snap + no-scrollbar + desktop md:grid
const containerMatch = liquid.match(/<div data-featured-grid class="([^"]+)">/);
assert(containerMatch, 'featured-grid container not found');
const containerClass = containerMatch[1];
assert(containerClass.includes('overflow-x-auto'), 'Missing overflow-x-auto');
assert(containerClass.includes('snap-x'), 'Missing snap-x');
assert(containerClass.includes('snap-mandatory'), 'Missing snap-mandatory');
assert(containerClass.includes('scroll-smooth'), 'Missing scroll-smooth');
assert(containerClass.includes('no-scrollbar'), 'Missing no-scrollbar');
assert(containerClass.includes('md:grid'), 'Missing md:grid');
assert(containerClass.includes('md:grid-cols-3'), 'Missing md:grid-cols-3');
assert(containerClass.includes('-mx-6 px-6 md:mx-0 md:px-0'), 'Missing edge bleed margins');

// 2. Check product card wrapper has mobile peek width and snap-start
const cardMatches = liquid.match(/class="[^"]*product-card-item[^"]*"/g);
assert(cardMatches && cardMatches.length >= 1, `Expected at least 1 product-card-item pattern, found ${cardMatches ? cardMatches.length : 0}`);
cardMatches.forEach((cls, idx) => {
  assert(cls.includes('w-[72vw]'), `Card ${idx + 1} missing w-[72vw]`);
  assert(cls.includes('shrink-0'), `Card ${idx + 1} missing shrink-0`);
  assert(cls.includes('snap-start'), `Card ${idx + 1} missing snap-start`);
  assert(cls.includes('md:w-auto'), `Card ${idx + 1} missing md:w-auto`);
});

// 3. Check product card snippet has responsive aspect ratio (aspect-square on mobile, 3/4 on desktop)
assert(cardSnippet.includes('aspect-square md:aspect-[3/4]'), 'Product card missing aspect-square md:aspect-[3/4]');
assert(!cardSnippet.includes('style="aspect-ratio: 3/4;"'), 'Product card still has hardcoded 3/4 aspect-ratio style');

// 4. Check theme.js resets scroll to 0 in applyFilter
assert(js.includes("data-featured-grid"), 'theme.js missing data-featured-grid query');
assert(js.includes("scrollTo({ left: 0"), 'theme.js missing scrollTo reset');

console.log('PASS: Featured Products mobile carousel verification successful.');
