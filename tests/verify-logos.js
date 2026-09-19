const fs = require('fs');
const assert = require('assert');

const header = fs.readFileSync('sections/header.liquid', 'utf8');
const footer = fs.readFileSync('sections/footer.liquid', 'utf8');

// 1. Header checks
assert(header.includes("logo-wordmark-cream.svg"), 'Header missing logo-wordmark-cream.svg');
assert(!header.includes("logo-monogram-copper.svg"), 'Header still references padded logo-monogram-copper.svg');
assert(header.includes("h-9") && header.includes("md:h-11"), 'Header missing responsive height classes h-9 md:h-11');
assert(header.includes("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"), 'Header logo not absolutely centered');

// 2. Footer checks
assert(footer.includes("logo-wordmark-cream.svg"), 'Footer missing logo-wordmark-cream.svg');
assert(!footer.includes("logo-monogram-dark.svg"), 'Footer still references padded logo-monogram-dark.svg');
assert(footer.includes("h-7") && footer.includes("md:h-8"), 'Footer missing responsive height classes h-7 md:h-8');

console.log('PASS: Aurca logo verification successful.');
