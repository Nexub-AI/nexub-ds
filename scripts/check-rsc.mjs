// Server-rendering check (10.1): a fresh Next 15 App Router app renders Hero, StatBand,
// CTABand and MarketingFooter as React Server Components, and that page hands the browser
// no design system component: no @nexub module is a client reference on it, except the one
// deliberate island, NumberTicker (a numeric StatBandItem counts up when it scrolls into view).
//   node scripts/check-rsc.mjs     after `pnpm turbo build --filter='./packages/*'`
// The app is written to a temp folder outside the workspace: Next comes from npm, the
// @nexub packages are linked from packages/*, so the check runs against this build.
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const app = mkdtempSync(join(tmpdir(), 'nexub-rsc-'));
const write = (file, text) => (mkdirSync(dirname(join(app, file)), { recursive: true }), writeFileSync(join(app, file), text));

write('package.json', JSON.stringify({ name: 'nexub-rsc-check', private: true, type: 'module' }));
write('next.config.mjs', `export default { experimental: { optimizePackageImports: ['@nexub/react', '@nexub/marketing'] }, outputFileTracingRoot: ${JSON.stringify(root)} };\n`);
write('app/layout.jsx', `export default function Layout({ children }) {\n  return <html lang="en" data-mode="marketing"><body>{children}</body></html>;\n}\n`);
write(
  'app/page.jsx',
  `import { CTABand, Hero, MarketingFooter, StatBand, StatBandItem } from '@nexub/marketing';

export default function Page() {
  return (
    <main>
      <Hero division="os" eyebrow="Nexub OS" title="Rendered on the server" description="No client JS for these sections." />
      <StatBand><StatBandItem value={2000} suffix="+" label="Teams" /></StatBand>
      <CTABand division="os" title="Start today" />
      <MarketingFooter tools={['Slack', 'Xero']} columns={[{ title: 'Company', links: [{ label: 'About', href: '/about' }] }]} bottom="Nexub" />
    </main>
  );
}
`,
);

try {
  execFileSync('npm', ['install', 'next@15', 'react@19', 'react-dom@19', '--ignore-scripts', '--no-audit', '--no-fund', '--loglevel=error'], { cwd: app, stdio: 'inherit' });
  mkdirSync(join(app, 'node_modules/@nexub'), { recursive: true });
  for (const pkg of readdirSync(join(root, 'packages'))) symlinkSync(join(root, 'packages', pkg), join(app, 'node_modules/@nexub', pkg));
  execFileSync(join(app, 'node_modules/.bin/next'), ['build'], { cwd: app, stdio: 'inherit', env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' } });

  const html = readFileSync(join(app, '.next/server/app/index.html'), 'utf8');
  const missing = ['Rendered on the server', '2,000', 'Start today', 'About', 'data-division="os"'].filter((t) => !html.includes(t));
  if (missing.length) throw new Error(`not in the server-rendered HTML: ${missing.join(', ')}`);

  // Every module the page hands to the browser as a client component.
  const manifest = readFileSync(join(app, '.next/server/app/page_client-reference-manifest.js'), 'utf8');
  const ISLANDS = /\/NumberTicker\//;
  const ds = [...new Set([...manifest.matchAll(/"([^"]*(?:@nexub|packages)\/(?:react|marketing|patterns|icons|core)\/[^"]*)"/g)].map((m) => m[1]))].filter((m) => !ISLANDS.test(m));
  if (ds.length) throw new Error(`the page ships design system client modules:\n  ${ds.join('\n  ')}`);
  console.log('✓ Hero, StatBand, CTABand and MarketingFooter render as server components; the only @nexub client module on the page is NumberTicker.');
} finally {
  rmSync(app, { recursive: true, force: true });
}
