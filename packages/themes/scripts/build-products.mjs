// Writes the division and app themes from the token map
// (@nexub/tokens tokens/product/divisions.json + the accent scales in color.json):
//   src/divisions.css       @nexub/themes/divisions     all five [data-division]
//   src/divisions/<d>.css   @nexub/themes/divisions/<d> one division
//   src/products.css        @nexub/themes/products      every [data-product] app key and alias
// Run `pnpm --filter @nexub/themes build:products` after changing the map or a
// scale; products.test.mjs fails if the committed files are stale.
import { mkdirSync, writeFileSync } from 'node:fs';
import { DIVISIONS, divisionCss, divisionsCss, productsCss } from '../../tokens/scripts/generate.mjs';

export const files = () => ({
  'divisions.css': divisionsCss(),
  'products.css': productsCss(),
  ...Object.fromEntries(DIVISIONS.map((d) => [`divisions/${d}.css`, divisionCss(d)])),
});

if (import.meta.url === `file://${process.argv[1]}`) {
  mkdirSync(new URL('../src/divisions/', import.meta.url), { recursive: true });
  for (const [name, css] of Object.entries(files())) writeFileSync(new URL(`../src/${name}`, import.meta.url), css);
  console.log(`✓ wrote ${Object.keys(files()).length} theme files`);
}
