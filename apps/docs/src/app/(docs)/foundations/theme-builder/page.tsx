import type { Metadata } from 'next';
import Link from 'next/link';
import { List, PageIntro, Prose, Section } from '@/components/kit';
import { ThemeBuilder } from './ThemeBuilder';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Theme builder',
  description: 'Pick one brand colour and get a contrast-checked theme for light, dark and every contrast level, exported as CSS, React, React Native or design tokens.',
};

export default function ThemeBuilderPage() {
  return (
    <div className="docs-prose">
      <PageIntro
        eyebrow="Foundations"
        title="Theme builder"
        lead={
          <>
            Pick one brand colour. Nexub turns it into the full accent family for light and dark at standard, medium and
            high contrast, checks every text pair against WCAG, and gives you the theme as CSS, React, React Native or
            design tokens. Like Material&apos;s theme builder, the seed is a starting hue, not a fixed swatch: a light
            yellow becomes a readable olive.
          </>
        }
      />

      <Section id="build" title="Build a theme">
        <ThemeBuilder />
      </Section>

      <Section id="how" title="How it works">
        <List
          items={[
            <>The seed becomes an HCT tonal palette, and each role takes a fixed tone, so contrast is arithmetic: the same tone gaps that make the built-in brands pass make yours pass.</>,
            <><strong>Primary</strong> recolours the app accent (buttons, focus, links). <strong>Product brand</strong> recolours the tertiary family that <code>data-product</code> brands use.</>,
            <>Neutrals, surfaces, status colours and the chart palettes stay on Nexub, so error, success and data stay recognisable across brands.</>,
            <>The CSS export carries all three contrast levels and <code>prefers-contrast: more</code>, so the contrast switch works with your brand like it does with ours.</>,
          ]}
        />
        <Prose>
          The same functions are in code: <code>createSeedStylesheet</code>, <code>createSeedTheme</code>,{' '}
          <code>createSeedRoles</code>, <code>createSeedTokens</code> and <code>contrastRatio</code> from{' '}
          <code>@nexub/tokens/seed</code>. See <Link href="/foundations/colors">Colors</Link> for the role system.
        </Prose>
      </Section>
    </div>
  );
}
