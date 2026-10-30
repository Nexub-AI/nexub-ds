import type { Metadata } from 'next';
import { PageIntro } from '@/components/kit';
import { CodeBlock } from '@/components/docs/CodeBlock';

export const dynamic = 'force-static';

export const metadata: Metadata = { title: 'Using the brand assets' };

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

      <h2>What&apos;s in the package</h2>
      <table>
        <thead>
          <tr><th>File</th><th>Use it for</th></tr>
        </thead>
        <tbody>
          <tr><td><code>nexub-mark.svg</code></td><td>The mark in brand colours.</td></tr>
          <tr><td><code>nexub-mark-mono.svg</code></td><td>Single-colour mark (<code>fill=&quot;currentColor&quot;</code>).</td></tr>
          <tr><td><code>app-icon.svg</code></td><td>App icon: the black glass tile with the mark. SVG favicon, launcher tiles.</td></tr>
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
          Draw the glyph as an SVG fragment in the 512 × 512 tile space and save it as{' '}
          <code>packages/brand/glyphs/&lt;product&gt;.svg</code>. Keep it inside roughly x/y 90–422, where
          the mark sits. Put gradients in a <code>&lt;defs&gt;</code> with <code>id=&quot;glyph&quot;</code>{' '}
          (see <code>glyphs/account.svg</code>).
        </li>
        <li>
          Add <code>{`{ id: '<product>', glyph: read('glyphs/<product>.svg'), halo: '<hex>' }`}</code> to{' '}
          <code>PRODUCTS</code> in <code>packages/brand/scripts/build-assets.mjs</code>. <code>halo</code>{' '}
          tints the glow behind the glyph.
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
