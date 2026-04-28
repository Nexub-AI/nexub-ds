#!/usr/bin/env node
/**
 * Copies apps/docs/pages-functions/ → apps/docs/out/functions/ after
 * `next build`. Cloudflare Pages auto-detects out/functions/ at deploy time
 * and compiles them into Workers — but Next's static export wipes the out/
 * directory on every build, so we keep the source in a sibling folder and
 * inject it just before deploy.
 *
 * No deps. Idempotent. Run as part of `pnpm --filter docs build`.
 */

import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, '../pages-functions');
const DEST = resolve(__dirname, '../out/functions');

if (!existsSync(SRC)) {
  console.warn(`[copy-pages-functions] no source at ${SRC} — skipping.`);
  process.exit(0);
}

if (!existsSync(resolve(DEST, '..'))) {
  console.error(
    `[copy-pages-functions] expected next build output at ${resolve(DEST, '..')} — did you run \`next build\` first?`,
  );
  process.exit(1);
}

if (existsSync(DEST)) rmSync(DEST, { recursive: true, force: true });
mkdirSync(DEST, { recursive: true });
cpSync(SRC, DEST, { recursive: true });
console.log(`[copy-pages-functions] copied ${SRC} → ${DEST}`);
