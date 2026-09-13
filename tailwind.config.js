// Token names mirror the Stitch mockups and Figma site.
// Colors point at CSS vars (src/vars.css) so `.dark` on <html> flips the palette.
const names = [
  'surface', 'surface-dim', 'surface-bright', 'surface-container-lowest',
  'surface-container-low', 'surface-container', 'surface-container-high',
  'surface-container-highest', 'on-surface', 'on-surface-variant',
  'inverse-surface', 'inverse-on-surface', 'outline', 'outline-variant',
  'primary', 'on-primary', 'primary-container', 'on-primary-container',
  'inverse-primary', 'secondary', 'on-secondary', 'secondary-container',
  'on-secondary-container', 'tertiary', 'on-tertiary', 'tertiary-container',
  'on-tertiary-container', 'error', 'on-error', 'error-container',
  'on-error-container', 'primary-fixed', 'primary-fixed-dim', 'secondary-fixed',
  'secondary-fixed-dim', 'tertiary-fixed', 'background', 'on-background',
  'surface-variant', 'cream', 'cream-dark', 'beige', 'blush', 'terracotta', 'copper',
  'warm-brown', 'mauve', 'sage', 'slate', 'charcoal', 'dark', 'maroon', 'burgundy', 'wine', 'silver'
];
const colors = Object.fromEntries(
  names.map((n) => [n, `rgb(var(--c-${n}) / <alpha-value>)`])
);

module.exports = {
  content: ['./layout/**/*.liquid', './sections/**/*.liquid', './snippets/**/*.liquid', './templates/**/*.liquid', './assets/**/*.js'],
  darkMode: 'class',
  theme: {
    extend: {
      colors,
      spacing: {
        'container-max': '1440px', 'section-padding': '120px',
        'margin-mobile': '20px', gutter: '24px', 'margin-desktop': '80px',
      },
      fontFamily: {
        // Display: Cormorant Garamond / Sevone. Section headings: Playfair Display. Body/labels: Inter.
        'display-lg': ['"Sevone"', '"Cormorant Garamond"', 'serif'],
        'display-lg-mobile': ['"Sevone"', '"Cormorant Garamond"', 'serif'],
        'headline-md': ['"Sevone"', '"Cormorant Garamond"', '"Playfair Display"', 'serif'],
        'headline-sm': ['"Sevone"', '"Cormorant Garamond"', '"Playfair Display"', 'serif'],
        'body-lg': ['"Inter"', 'sans-serif'],
        'body-md': ['"Inter"', 'sans-serif'],
        'label-caps': ['"Inter"', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['64px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '500' }],
        'display-lg-mobile': ['40px', { lineHeight: '1.2', fontWeight: '500' }],
        'headline-md': ['32px', { lineHeight: '1.3', fontWeight: '500' }],
        'headline-sm': ['24px', { lineHeight: '1.4', fontWeight: '500' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'label-caps': ['12px', { lineHeight: '1.2', letterSpacing: '0.1em', fontWeight: '600' }],
      },
    },
  },
  plugins: [],
};
