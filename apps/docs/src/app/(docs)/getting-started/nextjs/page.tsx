import type { Metadata } from 'next';
import { List, Note, PageIntro, Prose, Section } from '@/components/kit';
import { CodeBlock } from '@/components/docs/CodeBlock';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Next.js and server components',
  description: 'Use Nexub DS in a Next.js App Router app: server components, per-component imports, next/font and Tailwind 4.',
};

export default function NextjsPage() {
  return (
    <div className="docs-prose">
      <PageIntro
        eyebrow="Getting Started"
        title="Next.js and server components"
        lead={
          <>
            Since 3.1, <code>@nexub/react</code> and <code>@nexub/marketing</code> ship one file per module, each with its
            own <code>&apos;use client&apos;</code> or none. Presentational components (Heading, Text, Container, Section,
            Stack, Badge, EyebrowChip, Logo, Float, Marquee and the marketing sections) render as React Server Components;
            interactive ones stay client components.
          </>
        }
      />

      <Section id="css" title="CSS with Tailwind 4">
        <CodeBlock lang="css" code={`/* app/globals.css */
@import "tailwindcss";
@import "@nexub/tokens/tailwind.css";
@import "@nexub/themes/core" layer(base);      /* resets, no fonts, no page backdrop */
@import "@nexub/themes/light" layer(base);
@import "@nexub/themes/dark" layer(base);
@import "@nexub/themes/marketing" layer(base); /* marketing pages only */
@source "../node_modules/@nexub/react/dist";
@source "../node_modules/@nexub/marketing/dist";`} />
        <Note>
          Don’t also import <code>@nexub/react/styles.css</code>: it is the prebuilt CSS for apps without Tailwind and
          brings a second preflight.
        </Note>
      </Section>

      <Section id="fonts" title="Fonts from next/font">
        <Prose>
          <code>@nexub/themes/base</code> self-hosts Inter and Plus Jakarta Sans; <code>@nexub/themes/core</code> leaves
          fonts to you. With <code>next/font</code>, name its variables after the tokens:
        </Prose>
        <CodeBlock lang="tsx" code={`import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
const sans = Inter({ subsets: ['latin'], variable: '--font-family-sans' });
const display = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-family-display' });

<html className={\`\${sans.variable} \${display.variable}\`}>…</html>`} />
      </Section>

      <Section id="imports" title="Import per component">
        <Prose>
          Next.js sends every client component a barrel import can reach to the browser. Import each component from its
          own entry point, or let Next.js do it for you:
        </Prose>
        <CodeBlock lang="tsx" code={`import { Button } from '@nexub/react/Button';
import { Hero } from '@nexub/marketing/Hero';
import { cn } from '@nexub/react/cn';

// or, keeping barrel imports:
// next.config.mjs
export default {
  experimental: { optimizePackageImports: ['@nexub/react', '@nexub/marketing', '@nexub/icons'] },
};`} />
        <Prose>
          Measured in a fresh Next.js 15.5 app with Hero, StatBand and CTABand: 181 kB of page JavaScript through barrels,
          19.4 kB either way above, with only Button and NumberTicker sent to the browser.
        </Prose>
      </Section>

      <Section id="rules" title="Server component rules">
        <List
          items={[
            <>
              Compound components (<code>Accordion.Root</code>, <code>TopNav.Root</code>, <code>DropdownMenu.Root</code>)
              are client components: use them inside your own <code>&apos;use client&apos;</code> file, or use the
              sections that wrap them (<code>FAQ</code>, <code>MarketingNav</code>).
            </>,
            <>
              Helpers exported next to a client component (<code>buttonVariants</code>, <code>cardVariants</code>) can’t
              be called in a server component. <code>cn</code> can.
            </>,
            <>
              Event handlers (<code>onClick</code>) need a client component; a link (<code>Button asChild</code> around
              an <code>a</code>) does not.
            </>,
          ]}
        />
      </Section>
    </div>
  );
}
