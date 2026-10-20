import Link from 'next/link';
import { Button, Card, Code, Container, Heading, Section, Text } from '@nexub/react';
import { ArrowRight } from '@nexub/icons';

export function LandingCallout() {
  return (
    <Section paddingY="md" data-reveal-scroll style={{ borderBottom: '1px solid var(--color-outline-variant)' }}>
      <Container size="md">
        <Card
          variant="surface"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            padding: '2.5rem',
          }}
        >
          <div>
            <Heading level={2} size="h4" style={{ marginBottom: '0.5rem' }}>
              This site is built with Nexub DS
            </Heading>
            <Text size="body-sm" tone="muted" style={{ maxWidth: '460px' }}>
              Every header, sidebar, badge, button, and code block you see here is a real{' '}
              <Code inline>@nexub/react</Code> component. We eat our own cooking.
            </Text>
          </div>
          <Button asChild variant="filled" size="lg">
            <Link href="/getting-started">Start building <ArrowRight size="sm" aria-hidden="true" /></Link>
          </Button>
        </Card>
      </Container>
    </Section>
  );
}
