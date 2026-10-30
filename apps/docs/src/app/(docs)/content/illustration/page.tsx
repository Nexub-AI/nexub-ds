import type { Metadata } from 'next';
import { Card, Text } from '@nexub/react';
import { CardGrid, Guidance, List, PageIntro, Section } from '@/components/kit';

export const dynamic = 'force-static';
export const metadata: Metadata = { title: 'Illustration: Content' };

const principles = [
  {
    title: 'Purposeful, not decorative',
    desc: 'Every illustration should earn its place. Use visuals to explain something that words alone cannot: empty states, onboarding, complex concepts. Never add an illustration just to fill space.',
  },
  {
    title: 'Inclusive and global',
    desc: 'Characters should reflect a diverse, global audience. Avoid culturally specific gestures, clothing, or settings unless intentional. When in doubt, use abstract or object-based illustrations.',
  },
  {
    title: 'Brand-consistent',
    desc: 'Nexub illustrations use the brand color palette as a base. Accent colors should map to semantic token values where possible so they adapt across light and dark themes.',
  },
  {
    title: 'Minimal and clear',
    desc: 'Keep illustrations simple. A single focal point, limited palette, and clean lines. Detailed and intricate illustrations add cognitive load: simplicity communicates faster.',
  },
];

const whenToUse = [
  { context: 'Empty states', guidance: 'An illustration helps users understand the empty state is intentional and shows them how to take action. Keep it simple and pair it with clear body copy.' },
  { context: 'Onboarding', guidance: 'Welcome screens and feature introductions benefit from an illustration to set the tone and reduce anxiety about starting.' },
  { context: 'Error pages (404, 500)', guidance: 'A subtle, non-alarming illustration softens the experience. Avoid dramatic imagery.' },
  { context: 'Feature callouts', guidance: 'Use to visually anchor a major new feature or empty category in a product.' },
];

export default function IllustrationPage() {
  return (
    <div className="docs-prose">
      <PageIntro
        eyebrow="Content"
        title="Illustration"
        lead="Illustrations are used sparingly across Nexub products to communicate ideas that words alone can't capture: empty states, errors, onboarding. Follow these guidelines to keep the visual language consistent."
      />

      <Section id="principles" title="Principles">
        <CardGrid min={260}>
          {principles.map((p) => (
            <Card key={p.title} className="flex flex-col gap-2 p-5">
              <Text weight="semibold" className="text-[var(--color-on-surface)]">{p.title}</Text>
              <Text size="body-sm" tone="secondary">{p.desc}</Text>
            </Card>
          ))}
        </CardGrid>
      </Section>

      <Section id="when-to-use-illustrations" title="When to use illustrations">
        <div className="grid gap-3">
          {whenToUse.map((w) => (
            <Card key={w.context} className="grid gap-1 p-4 sm:grid-cols-[160px_1fr] sm:gap-4">
              <Text weight="semibold" className="!text-[var(--color-primary)]">{w.context}</Text>
              <Text tone="secondary">{w.guidance}</Text>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="what-to-avoid" title="Do and don't">
        <Guidance
          dos={[
            'Pair every illustration with clear copy and one next action',
            'Use object-based or abstract scenes when people would be culture-specific',
            'Fill shapes with token colours so the asset adapts to light, dark and every brand',
            <>Animate only when it adds clarity (e.g. loading), and respect <code>prefers-reduced-motion</code></>,
          ]}
          donts={[
            'Stock-photo style illustrations: they feel generic and break brand cohesion',
            'Illustrations in data-dense views: tables, dashboards and lists stay clean',
            'Illustrations that repeat the heading: visual and text should complement each other',
            'Dark-only or light-only assets',
          ]}
        />
      </Section>

      <Section id="file-formats" title="File formats">
        <List
          items={[
            <>Use <strong>SVG</strong> for all product illustrations: scalable, small, and styleable with CSS</>,
            <>Export at <strong>1× only</strong>: SVG is resolution-independent</>,
            <>Where SVG is not possible (e.g. complex photographic backgrounds), use <strong>WebP</strong> with a PNG fallback</>,
          ]}
        />
      </Section>
    </div>
  );
}
