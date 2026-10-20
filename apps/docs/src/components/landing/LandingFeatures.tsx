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
      style={{
        borderTop: '1px solid var(--color-outline-variant)',
        borderBottom: '1px solid var(--color-outline-variant)',
      }}
    >
      <Container size="lg" style={{ textAlign: 'center' }}>
        <EyebrowChip tone="info" data-reveal-scroll style={{ marginBottom: '0.75rem' }}>
          What&apos;s inside
        </EyebrowChip>

        <Heading level={2} size="h2" data-reveal-scroll style={{ marginBottom: '3rem' }}>
          Everything you need to ship faster
        </Heading>

        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" gap="20px" style={{ textAlign: 'left' }}>
          {features.map(({ Icon, stat, title, desc }) => (
            <Card key={title} variant="surface" data-reveal-scroll style={{ padding: '1.75rem' }}>
              <span
                aria-hidden="true"
                style={{
                  marginBottom: '1rem',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--color-primary-container)',
                  borderRadius: 'var(--shape-container)',
                  color: 'var(--color-on-primary-container)',
                }}
              >
                <Icon size="md" />
              </span>
              <Text weight="bold" style={{ fontSize: '2rem', lineHeight: 1, marginBottom: '0.25rem', color: 'var(--color-primary)' }}>
                {stat}
              </Text>
              <Heading level={3} size="h6" style={{ marginBottom: '0.5rem' }}>
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
