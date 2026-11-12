import type { Metadata } from 'next';
import { PageIntro } from '@/components/kit';
import { CodeBlock } from '@/components/docs/CodeBlock';

export const dynamic = 'force-static';

export const metadata: Metadata = { title: 'Strict CSP' };

export default function StrictCspPage() {
  return (
    <div className="docs-prose">
      <PageIntro eyebrow="Getting Started" title="Strict CSP" />
      <p>
        Nexub DS works under a strict Content-Security-Policy with no <code>&apos;unsafe-inline&apos;</code>,
        hashes or nonces:
      </p>
      <CodeBlock lang="bash" code={`default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'`} />
      <p>
        <code>@nexub/react</code> injects no <code>&lt;style&gt;</code> tags of its own, and its CSS ships
        in <code>@nexub/themes</code>. A few components use Radix primitives that inject one when they open;
        the table says how to use those.
      </p>

      <h2>Components</h2>
      <p>
        Everything not listed here is CSP-safe as-is, including <code>SettingsLayout</code>,{' '}
        <code>Popover</code>, <code>DatePicker</code>, <code>Combobox</code>, <code>Tooltip</code> and{' '}
        <code>Toast</code>.
      </p>
      <table>
        <thead>
          <tr><th>Component</th><th>What happens</th><th>Use it safely</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Sheet</code> / <code>Drawer</code></td>
            <td>The default scroll lock injects a <code>&lt;style&gt;</code> sized to the scrollbar, so no hash can allow it.</td>
            <td>Pass <code>scrollLock=&quot;class&quot;</code> on <code>Root</code>. <code>SettingsLayout</code> does this for its phone menu.</td>
          </tr>
          <tr>
            <td><code>DropdownMenu</code>, <code>ContextMenu</code></td>
            <td>In the default modal mode, the scroll lock injects a <code>&lt;style&gt;</code>.</td>
            <td>Pass <code>modal={'{false}'}</code> on <code>Root</code>.</td>
          </tr>
          <tr>
            <td><code>Dialog</code>, <code>AlertDialog</code>, <code>CommandPalette</code></td>
            <td>The default scroll lock injects a <code>&lt;style&gt;</code>.</td>
            <td>Pass <code>scrollLock=&quot;class&quot;</code> on <code>Root</code> (7.2+). It becomes the default in 8.0.</td>
          </tr>
          <tr>
            <td><code>Select</code></td>
            <td>Radix always adds a scroll-lock <code>&lt;style&gt;</code>; without a nonce it&apos;s blocked (a console error, and the page behind can scroll).</td>
            <td>Pass your nonce to <code>NexubProvider</code> (below), or accept the console error.</td>
          </tr>
          <tr>
            <td><code>ScrollArea</code>, <code>Select</code></td>
            <td>Radix adds a fixed <code>&lt;style&gt;</code> that hides the native scrollbar. <code>@nexub/themes/base</code> ships the same rule, so it looks right; the blocked tag only logs a console error.</td>
            <td>Nothing to do. To silence the error, allow the hash the browser prints in it.</td>
          </tr>
        </tbody>
      </table>
      <CodeBlock code={`<Sheet.Root open={open} onOpenChange={setOpen} direction="left" scrollLock="class">
  <Sheet.Portal>
    <Sheet.Overlay />
    <Sheet.Content side="left">…</Sheet.Content>
  </Sheet.Portal>
</Sheet.Root>`} />
      <p>
        <code>scrollLock=&quot;class&quot;</code> adds <code>nexub-scroll-lock</code> (from{' '}
        <code>@nexub/themes/base</code>) to <code>&lt;html&gt;</code> while the overlay is shown. The sheet
        is still modal: focus stays inside, the rest of the page is hidden from screen readers, and Escape
        or a click outside closes it.
      </p>

      <h2>With a nonce</h2>
      <p>
        If your server sends a per-request nonce, give it to <code>NexubProvider</code>. Every
        <code>&lt;style&gt;</code> a Radix overlay injects then carries it, so all overlays work in their
        default modes under <code>style-src-elem &apos;nonce-…&apos;</code> without <code>&apos;unsafe-inline&apos;</code>:
      </p>
      <CodeBlock code={`<NexubProvider nonce={nonce}>{children}</NexubProvider>`} />
      <p>
        React <code>style</code> attributes are separate: allow them with{' '}
        <code>style-src-attr &apos;unsafe-inline&apos;</code>, which can&apos;t load or run anything.
      </p>

      <h2>Fonts</h2>
      <p>
        <code>@nexub/themes/base</code> bundles Inter and Plus Jakarta Sans. Every font file it references is over
        8 KB, so Vite (4 KB limit) and webpack (8 KB) emit real files instead of <code>data:</code> URLs,
        and <code>font-src &apos;self&apos;</code> works with default settings.
      </p>
      <p>To make sure no font is ever inlined, including your own, add this to your Vite config:</p>
      <CodeBlock code={`// vite.config.ts
export default defineConfig({
  build: {
    // Never inline fonts as data: URLs (font-src 'self'); other assets keep the default.
    assetsInlineLimit: (file) => (/\\.(woff2?|ttf|otf)$/.test(file) ? false : undefined),
  },
});`} />
      <p>
        <code>assetsInlineLimit: 0</code> also works but turns inlining off for every asset.
      </p>
      <p>
        To use the system font instead, override the font token. Browsers only download a font a page
        uses, so the bundled one is never fetched:
      </p>
      <CodeBlock lang="css" code={`:root {
  --font-family-sans: ui-sans-serif, system-ui, sans-serif;
}`} />

      <h2>Images</h2>
      <p>
        Vite inlines small images as <code>data:</code> URLs, which <code>img-src &apos;self&apos; data:</code>{' '}
        allows. Serve <code>@nexub/brand</code> files from your own origin (see{' '}
        <a href="/getting-started/brand-assets">Using the brand assets</a>).
      </p>

      <h2>Inline style attributes</h2>
      <p>
        Some components set positions and sizes through React&apos;s <code>style</code> prop. In the browser
        that goes through the CSSOM, which CSP allows. Server-rendered HTML is different: a{' '}
        <code>style=&quot;…&quot;</code> attribute in the markup is blocked. Client-rendered apps (like a Vite
        SPA) aren&apos;t affected.
      </p>
      <p>
        So components render scale values as classes, and server HTML has no <code>style</code>{' '}
        attribute for them. A test enforces this.
      </p>
      <table>
        <thead>
          <tr><th>Component</th><th>Classes (no style attribute)</th><th>Inline style (blocked in server HTML)</th></tr>
        </thead>
        <tbody>
          <tr><td><code>Stack</code>, <code>Flex</code>, <code>Grid</code></td><td>Numeric <code>gap</code> on the spacing scale, common <code>align</code>/<code>justify</code>, <code>cols</code>/<code>rows</code> 1–12</td><td>Arbitrary strings, e.g. <code>gap=&quot;13px&quot;</code></td></tr>
          <tr><td><code>Text</code></td><td><code>lineClamp</code> 1–6</td><td><code>lineClamp</code> 7 and up</td></tr>
          <tr><td><code>AspectRatio</code></td><td>1, 16/9, 4/3, 3/2, 21/9, 9/16, 3/4, 2/3</td><td>Any other ratio</td></tr>
          <tr><td><code>Skeleton</code></td><td>Shape defaults</td><td>Explicit <code>width</code>/<code>height</code></td></tr>
          <tr><td><code>GradientDivider</code></td><td><code>height</code> 1–4</td><td>Thicker dividers</td></tr>
          <tr><td><code>Progress</code></td><td colSpan={2}>The fill width is set through the CSSOM after hydration, so the bar fills in on load.</td></tr>
          <tr><td><code>Fade</code>, <code>Collapse</code>, <code>Scale</code>, <code>Slide</code></td><td colSpan={2}>Animate through inline style. Under strict CSP the first paint has no animation; later transitions work.</td></tr>
        </tbody>
      </table>
      <p>
        Radix sets a few internal styles of its own (Slider thumb position, the hidden form input behind
        Switch and Checkbox, the Popover anchor, Toast&apos;s screen-reader announcer).
      </p>

      <h2>Trusted Types</h2>
      <p>
        Nexub works with <code>require-trusted-types-for &apos;script&apos;</code> enforced. The library never
        passes markup to <code>innerHTML</code>, never sets a script URL and never evaluates a string. One thing
        needs a rule: React writes the text of the <code>&lt;style&gt;</code> elements Radix injects (Select,
        ScrollArea) through <code>innerHTML</code>. That text is CSS with no tags in it, so a{' '}
        <code>default</code> policy that only lets tag-free strings through covers it without opening the sink:
      </p>
      <CodeBlock
        lang="javascript"
        code={`// Before any other script. Header: trusted-types default; require-trusted-types-for 'script'
trustedTypes.createPolicy('default', {
  // Text with no "<" can't create an element. Markup is refused.
  createHTML: (s) => {
    if (!s.includes('<')) return s;
    throw new TypeError('markup refused');
  },
  // Your bundler's chunk loader, if it sets script.src (Turbopack does).
  createScriptURL: (u) => {
    const url = new URL(u, location.href);
    if (url.origin === location.origin && url.pathname.startsWith('/_next/static/')) return u;
    throw new TypeError('script URL refused');
  },
});`}
      />
      <p>
        This site uses that policy, plus one allowed third-party script URL for its feedback form. With{' '}
        <code>scrollLock=&quot;class&quot;</code> the overlays inject no style element at all.
      </p>
    </div>
  );
}
