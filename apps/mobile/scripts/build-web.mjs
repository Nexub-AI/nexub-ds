// Exports the showcase app for the web under /m (experiments.baseUrl, set by
// app.config.js only for this build: on native it would break routes that start
// with the base, e.g. /mobile)
// into dist-web/, for the docs site to serve at nexub.design/m/…
//
// The export is a single-page app (one index.html). Static hosts only serve
// files that exist, so every route the docs link to gets a copy of index.html
// at its own path (preview/button.html, preview/pattern/activity.html, …);
// expo-router reads the URL and renders the right screen.
//
// Run through turbo (`build:web`, cached): pnpm --filter @nexub/docs build does.
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist-web');

rmSync(out, { recursive: true, force: true });
execFileSync(join(root, 'node_modules/.bin/expo'), ['export', '--platform', 'web', '--output-dir', 'dist-web'], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, CI: '1', EXPO_NO_TELEMETRY: '1', NEXUB_WEB_BASE_URL: '/m' },
});

const manifest = JSON.parse(readFileSync(join(root, 'preview-manifest.json'), 'utf8'));
const routes = [
  ...['foundations', 'actions', 'inputs', 'lists', 'feedback', 'mobile', 'patterns'],
  ...Object.keys(manifest.patterns).map((n) => `patterns/${n}`),
  ...Object.values(manifest.components).map((c) => c.path.slice(manifest.base.length + 1)),
  ...Object.values(manifest.patterns).map((p) => p.path.slice(manifest.base.length + 1)),
];
const index = join(out, 'index.html');
for (const route of routes) {
  const file = join(out, `${route}.html`);
  mkdirSync(dirname(file), { recursive: true });
  copyFileSync(index, file);
}

const size = (dir) =>
  readdirSync(dir).reduce((n, f) => {
    const p = join(dir, f);
    return n + (statSync(p).isDirectory() ? size(p) : statSync(p).size);
  }, 0);
console.log(`dist-web: ${routes.length} route pages, ${(size(out) / 1e6).toFixed(1)} MB`);
if (!existsSync(join(out, 'preview/button.html'))) throw new Error('preview pages missing');
