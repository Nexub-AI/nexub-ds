import type { Metadata } from 'next';
import { PageIntro } from '@/components/kit';
import { CodeBlock } from '@/components/docs/CodeBlock';

export const dynamic = 'force-static';

export const metadata: Metadata = { title: 'Use without Tailwind' };

export default function WithoutTailwindPage() {
  return (
    <div className="docs-prose">
      <PageIntro eyebrow="Getting Started" title="Use without Tailwind" />
      <p>
        <code>@nexub/react</code> ships its styles prebuilt. Import one stylesheet and the components work in
        any React app, with no Tailwind, preset or <code>content</code> globs.
      </p>
      <CodeBlock code={`// app entry (layout.tsx, main.tsx …)
import '@nexub/react/styles.css';`} />
      <p>
        It has everything the components need: the light and dark themes, glass, the product brands
        (<code>data-product=&quot;payub&quot;</code> and the rest), the Plus Jakarta Sans font, and the
        utility classes the components use. It&apos;s about 43 kB gzipped, and browsers download only the font
        subsets a page uses.
      </p>

      <p>
        Using <code>@nexub/patterns</code> too? Add its stylesheet after the react one. It only carries the
        classes the patterns add (about 5 kB gzipped):
      </p>
      <CodeBlock code={`import '@nexub/react/styles.css';
import '@nexub/patterns/styles.css';`} />

      <h2>Your CSS still wins</h2>
      <p>
        Since 12.0 everything in the stylesheet sits in one <code>nexub</code> cascade layer (
        <code>nexub.theme</code>, <code>nexub.base</code>, <code>nexub.components</code>,{' '}
        <code>nexub.utilities</code>). Import it before your own CSS and every style of yours beats it, including
        the small CSS reset it carries, without <code>!important</code>: unlayered, in your Tailwind layers or in
        any other layer.
      </p>
      <p>
        A layer ranks by where it is first named, so load the stylesheet first, or name it first at the top of
        your own CSS with <code>@layer nexub;</code>. Named after your layers, <code>nexub</code> would rank
        above them. <code>@nexub/patterns/styles.css</code> uses the same layer, so that one line covers both.
        Coming from 11.x? See <a href="/getting-started/migrating-to-12">Migrating to 12.0</a>.
      </p>
      <CodeBlock lang="css" code={`/* your app's CSS, first line */
@layer nexub;`} />

      <h2>Already using Tailwind?</h2>
      <p>
        Keep the Tailwind v4 setup from <a href="/getting-started">Getting Started</a>. Tailwind then generates the
        classes alongside yours, so you don&apos;t need this stylesheet, and importing both only duplicates CSS.
      </p>

      <h2>Bigger text for people who ask for it (rem)</h2>
      <p>
        Since 3.0, spacing, radius, type and control heights are in rem, with or without Tailwind. At the
        browser default (16px) they match the px values. When someone raises their default font size, text,
        spacing and controls grow together, so nothing clips. Hairlines, pill shapes, shadows, icon sizes
        and breakpoints stay in px.
      </p>
      <p>
        Don&apos;t set a px font size on <code>html</code>: it pins rem to that size. If your app sets{' '}
        <code>html {'{ font-size: 62.5% }'}</code>, everything shrinks with it, so drop that rule.{' '}
        <code>@nexub/tokens/css/rem</code>, the opt-in layer from 2.6, is now empty; you can remove the import.
      </p>
    </div>
  );
}
