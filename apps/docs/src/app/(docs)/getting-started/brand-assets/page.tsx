import type { Metadata } from 'next';
import { PageIntro } from '@/components/kit';
import { CodeBlock } from '@/components/docs/CodeBlock';
import * as fs from 'node:fs';
import * as path from 'node:path';

export const dynamic = 'force-static';

export const metadata: Metadata = { title: 'Using the brand assets' };

// Same ids as PRODUCTS in packages/brand/scripts/build-assets.mjs.
const apps = [
  ['', 'Nexub (hub)'], ['account', 'Account'], ['command-hub', 'Command Hub'], ['admin', 'Admin'],
  ['people', 'People'], ['payhub', 'PayHub'], ['commerce', 'Commerce'], ['contracts', 'Contracts'],
  ['leap', 'Leap'], ['founder-hub', 'Founder Hub'], ['mind', 'Mind'], ['go', 'Go'], ['verify', 'Verify'],
] as const;

// Read at build time and inline, so the docs need no copy of the brand assets.
const tile = (file: string) =>
  'data:image/svg+xml;base64,' +
  fs.readFileSync(path.resolve(process.cwd(), '../../packages/brand/assets', file)).toString('base64');

function AppTiles() {
  return (
    <ul className="not-prose grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
      {apps.map(([id, name]) => {
        const base = id ? `app-icon-${id}` : 'app-icon';
        return (
          <li key={base} className="flex flex-col items-center gap-2 rounded-shape-container bg-[var(--color-surface-container-low)] p-4">
            <div className="flex gap-2">
              <img src={tile(`${base}.svg`)} alt={`${name} app icon, dark`} width={56} height={56} />
              <img src={tile(`${base}-light.svg`)} alt={`${name} app icon, light`} width={56} height={56} />
            </div>
            <span className="text-label-md">{name}</span>
            <code className="text-label-sm">{base}.svg</code>
          </li>
        );
      })}
    </ul>
  );
}

export default function BrandAssetsPage() {
  return (
    <div className="docs-prose">
      <PageIntro eyebrow="Getting Started" title="Using the brand assets" />
      <p>
        <code>@nexub/brand</code> ships the official Nexub files: the mark, the app icon tiles, PNG icons
        and the favicon. Use these instead of keeping your own copies. They come from the same master
        artwork as <code>&lt;Logo&gt;</code>; nothing is redrawn.
      </p>
      <CodeBlock lang="bash" code={`pnpm add @nexub/brand`} />

      <h2>App icons</h2>
      <p>
        Every Nexub app gets the same tile and the same violet, with its own line glyph: dark glass for
        dark themes, plain white (<code>-light.svg</code>) for light themes. Apps differ by shape, never by
        colour. Each also ships as 192 and 512 px PNGs, plus iOS and
        Android icons under <code>mobile/</code>.
      </p>
      <AppTiles />

      <h2>What&apos;s in the package</h2>
      <table>
        <thead>
          <tr><th>File</th><th>Use it for</th></tr>
        </thead>
        <tbody>
          <tr><td><code>nexub-mark.svg</code></td><td>The mark in brand colours.</td></tr>
          <tr><td><code>nexub-mark-mono.svg</code></td><td>Single-colour mark (<code>fill=&quot;currentColor&quot;</code>).</td></tr>
          <tr><td><code>app-icon.svg</code></td><td>App icon: the dark glass tile with the mark in violet. SVG favicon, launcher tiles.</td></tr>
          <tr><td><code>app-icon-192.png</code>, <code>app-icon-512.png</code></td><td>Web manifest icons, <code>apple-touch-icon</code>.</td></tr>
          <tr><td><code>app-icon-account.svg</code>, <code>-192.png</code>, <code>-512.png</code></td><td>The Account tile: same tile, person glyph.</td></tr>
          <tr><td><code>favicon.ico</code></td><td>16, 32 and 48 px favicon.</td></tr>
        </tbody>
      </table>
      <p>
        Every file is at <code>@nexub/brand/&lt;file&gt;</code>. Inside React UI, prefer{' '}
        <code>&lt;Logo&gt;</code> and <code>&lt;NexubMark&gt;</code>: they render the same mark inline,
        with no extra request.
      </p>
      <p>
        Why a separate package: the files are static and need no build, so an app that only wants a favicon
        doesn&apos;t install React, and the version still moves in lockstep with the other{' '}
        <code>@nexub/*</code> packages.
      </p>

      <h2>Vite: import from code</h2>
      <p>Importing a file gives you a hashed URL, and Vite copies the file into the build.</p>
      <CodeBlock code={`import hubIcon from '@nexub/brand/app-icon.svg';
import accountIcon from '@nexub/brand/app-icon-account.svg';

<AppLauncher apps={[
  { id: 'hub', name: 'Command Hub', href: 'https://hub.nexub.ai', icon: hubIcon },
  { id: 'account', name: 'Account', href: 'https://account.nexub.ai', icon: accountIcon, current: true },
]} />`} />
      <p>
        Vite inlines imports under 4 KB as <code>data:</code> URLs. <code>img-src &apos;self&apos; data:</code>{' '}
        allows that; if your policy has no <code>data:</code>, see{' '}
        <a href="/getting-started/strict-csp">Strict CSP</a>.
      </p>

      <h2>Vite: copy into <code>public/</code></h2>
      <p>
        <code>index.html</code> and the web manifest need fixed URLs, so copy the files into{' '}
        <code>public/brand/</code> before dev and build. Add <code>public/brand/</code> to{' '}
        <code>.gitignore</code>: it&apos;s build output, not a copy you maintain.
      </p>
      <CodeBlock lang="json" code={`// package.json
"scripts": {
  "brand": "node -e \\"require('fs').cpSync('node_modules/@nexub/brand/assets', 'public/brand', { recursive: true })\\"",
  "predev": "pnpm brand",
  "prebuild": "pnpm brand"
}`} />
      <CodeBlock lang="html" code={`<!-- index.html -->
<link rel="icon" href="/brand/favicon.ico" sizes="48x48" />
<link rel="icon" href="/brand/app-icon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/brand/app-icon-192.png" />
<link rel="manifest" href="/manifest.webmanifest" />`} />

      <h2>Web manifest</h2>
      <CodeBlock lang="json" code={`// public/manifest.webmanifest
{
  "name": "Nexub Command Hub",
  "short_name": "Command Hub",
  "icons": [
    { "src": "/brand/app-icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/brand/app-icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}`} />
      <p>For the Account app, use the <code>app-icon-account*</code> files in these places.</p>

      <h2>Plain static serving</h2>
      <p>
        With no bundler, copy the files next to your HTML in your deploy step (the same{' '}
        <code>cpSync</code> line, with your output folder, e.g. <code>dist/brand</code>) and reference them
        as <code>/brand/&lt;file&gt;</code>. Self-hosted files are same-origin, so a strict{' '}
        <code>img-src &apos;self&apos;</code> needs no change.
      </p>

      <h2>A tile for another product</h2>
      <p>Every product uses the same tile with its own glyph; don&apos;t edit the tile. In the nexub-ds repo:</p>
      <ol>
        <li>
          Draw the glyph as line art on a 24 × 24 grid, the same way Lucide icons are drawn: paths, circles and
          rects only, with no colours, fills or stroke attributes. The build draws it in violet with a 1.6 stroke
          and round ends. Save it as <code>packages/brand/glyphs/&lt;product&gt;.svg</code> (see{' '}
          <code>glyphs/payhub.svg</code>).
        </li>
        <li>
          Add <code>&apos;&lt;product&gt;&apos;</code> to <code>PRODUCTS</code> in{' '}
          <code>packages/brand/scripts/build-assets.mjs</code>, and to the list at the top of this page.
        </li>
        <li>
          Run <code>pnpm --filter @nexub/brand build:assets</code>, commit{' '}
          <code>assets/app-icon-&lt;product&gt;*</code>, and release. The tile then ships as{' '}
          <code>@nexub/brand/app-icon-&lt;product&gt;.svg</code> plus 192 and 512 px PNGs.
        </li>
      </ol>
    </div>
  );
}
