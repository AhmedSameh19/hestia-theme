const fs = require('fs');
const assert = require('assert');

console.log('Verifying featured carousel...');
require('./verify-featured-carousel.js');

console.log('Verifying testimonials carousel...');
require('./verify-testimonials-carousel.js');

console.log('Verifying cart notification popup...');
require('./verify-cart-notification.js');

console.log('Verifying logos...');
require('./verify-logos.js');

console.log('Verifying compiled CSS assets...');
const css = fs.readFileSync('assets/theme.css', 'utf8');
assert(css.includes('72vw'), 'assets/theme.css missing 72vw utility');
assert(css.includes('82vw'), 'assets/theme.css missing 82vw utility');

console.log('ALL VERIFICATIONS PASSED SUCCESSFULLY.');

