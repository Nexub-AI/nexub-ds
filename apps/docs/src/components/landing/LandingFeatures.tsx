import { Card, Container, EyebrowChip, Grid, Heading, Section, Text } from '@nexub/react';
import { Code, Layers, Package, Sparkles } from '@nexub/icons';
import { componentEntries, patternEntries } from '@/registry/index';
import { templateEntries } from '@/registry/templates';

const features = [
  {
    Icon: Package,
    stat: `${componentEntries.length}`,
    title: 'Components',
    desc: 'Accessible React components on Radix primitives, styled only with tokens. Most have a React Native twin.',
  },
  {
    Icon: Layers,
    stat: `${patternEntries.length}`,
    title: 'Patterns',
    desc: 'Blocks for real product flows: stat cards, auth, settings, filters, activity feeds.',
  },
  {
    Icon: Code,
    stat: `${templateEntries.length}`,
    title: 'Page templates',
    desc: 'Whole pages you pass data to: dashboard, sign-up, tables, booking, invoices. Responsive, most with a native screen.',
  },
  {
    Icon: Sparkles,
    stat: '5',
    title: 'Brand themes',
    desc: 'Nexub and four product brands, light and dark, three contrast levels. All CSS, or one colour through the theme builder.',
  },
];

export function LandingFeatures() {
  return (
    <Section
      paddingY="md"
      tone="subtle"
      className="border-t border-[var(--color-outline-variant)] border-b"
    >
      <Container size="lg" className="text-center">
        <EyebrowChip tone="info" data-reveal-scroll className="mb-3">
          What&apos;s inside
        </EyebrowChip>

        <Heading level={2} size="h2" data-reveal-scroll className="mb-12">
          Components, patterns and whole pages
        </Heading>

        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 text-start" gap="20px">
          {features.map(({ Icon, stat, title, desc }) => (
            <Card key={title} variant="surface" data-reveal-scroll className="p-7">
              <span
                aria-hidden="true"
                className="mb-4 w-[44px] h-[44px] flex items-center justify-center bg-[var(--color-primary-container)] rounded-shape-container text-[var(--color-on-primary-container)]"
              >
                <Icon size="md" />
              </span>
              <Text weight="bold" className="text-headline-lg leading-none mb-1 text-[var(--color-primary)]">
                {stat}
              </Text>
              <Heading level={3} size="h6" className="mb-2">
                {title}
              </Heading>
              <Text size="body-sm" tone="muted">
                {desc}
              </Text>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
