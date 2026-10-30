import * as fs from 'node:fs';
import * as path from 'node:path';
import { Container, EyebrowChip, Heading, Link, Section, Text } from '@nexub/react';
import { componentEntries, patternEntries } from '@/registry/index';
import { LandingHero } from '@/components/landing/LandingHero';
import { LandingFeatures } from '@/components/landing/LandingFeatures';
import { LandingShowcase } from '@/components/landing/LandingShowcase';
import { LandingCallout } from '@/components/landing/LandingCallout';

function getVersion(): string {
  const candidates = [
    path.join(process.cwd(), 'packages/react/package.json'),
    path.join(process.cwd(), '../../packages/react/package.json'),
    process.env.INIT_CWD ? path.join(process.env.INIT_CWD, 'packages/react/package.json') : '',
  ].filter(Boolean);

  for (const pkgPath of candidates) {
    try {
      if (fs.existsSync(pkgPath)) {
        return (JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as { version: string }).version;
      }
    } catch { /* try next */ }
  }
  return '0.0.2';
}

export default function HomePage() {
  const version = getVersion();

  return (
    <main className="bg-[var(--color-surface)] text-[var(--color-on-surface)]">

      {/* ── Animated Hero (client) ────────────────────────────────────────── */}
      <LandingHero
        version={version}
        componentCount={componentEntries.length}
        patternCount={patternEntries.length}
      />

      {/* ── Animated Feature strip (client) ──────────────────────────────── */}
      <LandingFeatures />

      {/* ── Live component showcase ────────────────────────────────────────── */}
      <Section
        paddingY="md"
        tone="muted"
        className="border-b border-[var(--color-outline-variant)]"
      >
        <Container size="md" className="text-center">
          <EyebrowChip tone="info" className="mb-3">
            Built with Nexub DS
          </EyebrowChip>
          <Heading level={2} size="h3" className="mb-3">
            Real components, live in your browser
          </Heading>
          <Text tone="muted" className="mx-auto mb-12 max-w-[480px]">
            Every component is interactive, themeable, and accessible out of the box.
          </Text>
          <LandingShowcase />
        </Container>
      </Section>

      {/* ── Animated Callout (client) ─────────────────────────────────────── */}
      <LandingCallout />

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <Text
        asChild
        size="caption"
        tone="muted"
        className="border-t border-[var(--color-outline-variant)] py-6 px-8 text-center"
      >
        <footer>
          Built on <Text asChild size="caption" weight="semibold" className="text-[var(--color-primary)]"><span>Nexub Design System</span></Text>
          {' '}·{' '}
          © {new Date().getFullYear()} Nexub Pte. Ltd., Singapore 🇸🇬
          {' '}·{' '}
          Crafted by{' '}
          <Link href="https://github.com/sasinex" target="_blank" rel="noopener noreferrer">
            Sasidharan
          </Link>
          {' '}— shipped with vibe coding energy ⚡
        </footer>
      </Text>
    </main>
  );
}
