import { Card, Container, EyebrowChip, Grid, Heading, Section, Text } from '@nexub/react';
import { Code, Layers, Package, Sparkles } from '@nexub/icons';
import { componentEntries, patternEntries } from '@/registry/index';

const features = [
  {
    Icon: Package,
    stat: `${componentEntries.length}`,
    title: 'Components',
    desc: 'Accessible, token-driven React components built on Radix UI primitives. Every edge case handled.',
  },
  {
    Icon: Code,
    stat: '100%',
    title: 'TypeScript',
    desc: 'Fully typed from props to theme tokens. Autocomplete, type safety, zero any-casting.',
  },
  {
    Icon: Sparkles,
    stat: '5',
    title: 'Brand themes',
    desc: 'Light, dark, and 4 product brands (Leap, Bookub, Payub, Founderub) — all CSS, zero runtime.',
  },
  {
    Icon: Layers,
    stat: `${patternEntries.length}`,
    title: 'Patterns',
    desc: 'Composable UI patterns for real SaaS flows: stat cards, auth, settings, activity feeds.',
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
          Everything you need to ship faster
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
              <Text weight="bold" className="text-[2rem] leading-none mb-1 text-[var(--color-primary)]">
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
