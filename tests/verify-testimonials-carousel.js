const fs = require('fs');
const assert = require('assert');

const liquid = fs.readFileSync('sections/testimonial.liquid', 'utf8');

// 1. Check container has mobile flex + scroll-snap + no-scrollbar + desktop md:grid
assert(
  liquid.includes('flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar md:grid md:grid-cols-3 gap-4 pb-4 -mx-6 px-6 md:mx-0 md:px-0'),
  'Testimonial container classes missing or incorrect'
);

// 2. Check 3 review cards have mobile peek width and snap-start
const cardMatches = liquid.match(/class="[^"]*w-\[82vw\][^"]*"/g);
assert(cardMatches && cardMatches.length === 3, `Expected 3 cards with w-[82vw], found ${cardMatches ? cardMatches.length : 0}`);
cardMatches.forEach((cls, idx) => {
  assert(cls.includes('shrink-0'), `Testimonial card ${idx + 1} missing shrink-0`);
  assert(cls.includes('snap-start'), `Testimonial card ${idx + 1} missing snap-start`);
  assert(cls.includes('md:w-auto'), `Testimonial card ${idx + 1} missing md:w-auto`);
});

console.log('PASS: Testimonials mobile carousel verification successful.');
