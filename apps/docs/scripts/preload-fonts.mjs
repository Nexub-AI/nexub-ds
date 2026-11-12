// 9.2: no layout shift from the webfont swap. Runs after `next build`: adds a preload for
// the latin Inter and Plus Jakarta Sans files (hashed by Next) to every exported page, so
// they arrive with the render-blocking CSS and the first paint already uses them. The
// metric-matched fallbacks in globals.css stay for slow connections.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('../out/', import.meta.url));
const media = readdirSync(join(out, '_next/static/media'));
const fonts = ['inter-latin-opsz-normal.', 'plus-jakarta-sans-latin-wght-normal.'].map((prefix) => {
  const file = media.find((f) => f.startsWith(prefix) && f.endsWith('.woff2'));
  if (!file) throw new Error(`preload-fonts: no ${prefix}*.woff2 in out/_next/static/media`);
  return `<link rel="preload" href="/_next/static/media/${file}" as="font" type="font/woff2" crossorigin=""/>`;
});
const tags = fonts.join('');

let n = 0;
for (const f of readdirSync(out, { recursive: true, encoding: 'utf8' })) {
  if (!f.endsWith('.html') || f.startsWith('_next') || f.startsWith('m/')) continue;
  const path = join(out, f);
  const html = readFileSync(path, 'utf8');
  if (html.includes(fonts[0]) || !html.includes('<head>')) continue;
  writeFileSync(path, html.replace('<head>', `<head>${tags}`));
  n++;
}
console.log(`preload-fonts: ${n} pages`);
