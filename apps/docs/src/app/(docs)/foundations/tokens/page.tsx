import type { Metadata } from 'next';
import tokens from '@nexub/tokens/json';
import component from '@nexub/tokens/json/component';
import { native } from '@nexub/tokens/native';
import Link from 'next/link';
import { PageIntro, Prose, Section } from '@/components/kit';
import { buildTokenRows } from '@/lib/token-rows';
import { TokenExplorer } from './TokenExplorer';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Tokens',
  description: 'Every design token in one searchable table: colour roles with their light and dark values, component tokens and the reference scales.',
};

// Built once, at build time, from the same files @nexub/tokens publishes.
const rows = buildTokenRows({
  tokens: tokens as Record<string, string>,
  roles: native.color.roles.standard,
  component: component as Record<string, unknown>,
});

export default function TokensPage() {
  return (
    <div className="docs-prose">
      <PageIntro
        eyebrow="Foundations"
        title="Tokens"
        lead={`All ${rows.length} design tokens, as CSS custom properties. Search by name or value, filter by tier or category, and click a name to copy it.`}
      />
      <Section id="tiers" title="Three tiers">
        <Prose>
          <strong>Semantic roles</strong> (<code>--color-primary</code>) are what components and your own code should
          use: each one is a <code>light-dark()</code> pair that follows the theme, the contrast level and the brand.{' '}
          <strong>Component</strong> tokens (<code>--button-filled-bg</code>) are unset by default and restyle one
          component below the element you set them on; the value shown is the fallback the component reads.{' '}
          <strong>Reference</strong> tokens are the raw scales behind both: palettes, spacing, sizes, type, motion.
        </Prose>
      </Section>
      <Section id="figma" title="Use the tokens in Figma">
        <Prose>
          <code>@nexub/tokens/figma/variables/*.tokens.json</code> is these tiers as W3C Design Tokens (DTCG) JSON for
          Figma&apos;s native variables import: a Primitives collection (reference palette, spacing, radius, type
          scale), a Product collection with a mode per brand, and a Color collection whose roles alias the primitives,
          with light, dark and contrast modes. Drag the files into collections of those names; after a release, use{' '}
          <strong>Import mode</strong> on each mode to update. Steps and files are on the{' '}
          <Link href="/getting-started/figma#variables">Figma</Link> page. The files are built and checked in CI from
          the same source as the CSS, so they can&apos;t drift.
        </Prose>
      </Section>
      <Section id="all-tokens" title="All tokens" description="Light and dark values are the roles at standard contrast.">
        <TokenExplorer rows={rows} />
      </Section>
    </div>
  );
}
