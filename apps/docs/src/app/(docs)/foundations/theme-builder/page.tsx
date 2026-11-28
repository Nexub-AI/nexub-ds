import type { Metadata } from 'next';
import Link from 'next/link';
import { tokens } from '@nexub/tokens';
import { native } from '@nexub/tokens/native';
import { List, PageIntro, Prose, Section } from '@/components/kit';
import { pickNeutrals } from '@/lib/brand-builder';
import { ThemeBuilder } from './ThemeBuilder';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Theme builder',
  description: 'Pick one brand colour, check its contrast live, preview real components, and export the theme as CSS, Tailwind v4, React Native or design tokens.',
};

// Read at build time, passed down as a few hundred bytes: the client never loads the token files.
const neutrals = pickNeutrals(native.color.roles);
const products = (['leap', 'bookub', 'payub', 'founderub'] as const).map((id) => ({
  id,
  label: id[0]!.toUpperCase() + id.slice(1),
  seed: tokens.color.accent[id]['500'],
}));

export default function ThemeBuilderPage() {
  return (
    <div className="docs-prose">
      <PageIntro
        eyebrow="Foundations"
        title="Theme builder"
        lead={
          <>
            Your brand builder. Pick one brand colour. Nexub turns it into the full accent family for light and dark
            at standard, medium and high contrast, checks every text pair against WCAG as you go, previews real
            components in it, and gives you the theme as CSS, Tailwind v4, React Native or design tokens. Like
            Material&apos;s theme builder, the seed is a starting hue, not a fixed swatch: a light yellow becomes a
            readable olive.
          </>
        }
      />

      <Section id="build" title="Build a theme">
        <ThemeBuilder neutrals={neutrals} products={products} />
      </Section>

      <Section id="how" title="How it works">
        <List
          items={[
            <>The seed becomes an HCT tonal palette, and each role takes a fixed tone, so contrast is arithmetic: the same tone gaps that make the built-in brands pass make yours pass.</>,
            <><strong>Primary</strong> recolours the app accent (buttons, focus, links). <strong>Product brand</strong> recolours the tertiary family that <code>data-product</code> brands use. A product preset starts from that Nexub product&apos;s colour.</>,
            <>Neutrals, surfaces, status colours and the chart palettes stay on Nexub, so error, success and data stay recognisable across brands.</>,
            <>The CSS export carries all three contrast levels and <code>prefers-contrast: more</code>, so the contrast switch works with your brand like it does with ours. The Tailwind v4 block is for Tailwind projects without the Nexub token CSS.</>,
          ]}
        />
        <Prose>
          The same functions are in code: <code>createSeedStylesheet</code>, <code>createSeedThemeCss</code>,{' '}
          <code>createSeedTheme</code>, <code>createSeedRoles</code>, <code>createSeedTokens</code> and{' '}
          <code>contrastRatio</code> from <code>@nexub/tokens/seed</code>. See{' '}
          <Link href="/foundations/colors">Colors</Link> for the role system.
        </Prose>
      </Section>
    </div>
  );
}
