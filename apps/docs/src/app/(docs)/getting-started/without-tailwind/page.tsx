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
        (<code>data-product=&quot;payub&quot;</code> and the rest), the Inter and Plus Jakarta Sans fonts, and the
        utility classes the components use. It&apos;s about 31 kB gzipped, and browsers download only the font
        subsets a page uses.
      </p>

      <p>
        Using <code>@nexub/patterns</code> too? Add its stylesheet after the react one. It only carries the
        classes the patterns add (about 4 kB gzipped):
      </p>
      <CodeBlock code={`import '@nexub/react/styles.css';
import '@nexub/patterns/styles.css';`} />

      <h2>Your CSS still wins</h2>
      <p>
        Everything in the stylesheet sits in CSS cascade layers (<code>theme</code>, <code>base</code>,{' '}
        <code>components</code>, <code>utilities</code>). Styles outside a layer always beat layered ones,
        so your own CSS overrides ours, including the small CSS reset it carries, without{' '}
        <code>!important</code> or extra specificity.
      </p>

      <h2>Already using Tailwind?</h2>
      <p>
        Keep the preset setup from <a href="/getting-started">Getting Started</a>. Tailwind then generates the
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
