// Copies the web export (dist-web/, from `build:web`) into the docs site:
//   node ../mobile/scripts/copy-web.mjs public/m
// Run from apps/docs before `next build`, which then ships public/m as /m.
// NEXUB_SKIP_MOBILE_WEB=1 skips it (quick local docs builds; previews 404).
import { cpSync, existsSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const src = join(dirname(fileURLToPath(import.meta.url)), '../dist-web');
const dest = resolve(process.argv[2] ?? 'public/m');

rmSync(dest, { recursive: true, force: true });
if (process.env.NEXUB_SKIP_MOBILE_WEB === '1') {
  console.warn('NEXUB_SKIP_MOBILE_WEB=1: React Native previews (/m) are not included.');
  process.exit(0);
}
if (!existsSync(join(src, 'index.html'))) {
  console.error(`No web export at ${src}. Run: pnpm turbo run build:web --filter=@nexub/mobile`);
  process.exit(1);
}
cpSync(src, dest, { recursive: true });
console.log(`Copied the React Native web preview to ${dest}`);
