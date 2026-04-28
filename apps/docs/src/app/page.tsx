import * as fs from 'node:fs';
import * as path from 'node:path';
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
    <main style={{ background: 'var(--color-bg-default)', color: 'var(--color-text-primary)' }}>

      {/* ── Animated Hero (client) ────────────────────────────────────────── */}
      <LandingHero
        version={version}
        componentCount={componentEntries.length}
        patternCount={patternEntries.length}
      />

      {/* ── Animated Feature strip (client) ──────────────────────────────── */}
      <LandingFeatures />

      {/* ── Live component showcase ────────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--docs-code-bg, #0d1117)',
          padding: '5rem 2rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-brand-primary-400)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Built with Nexub DS
          </p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 800, color: '#f0f6fc', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Real components, live in your browser
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(240,246,252,0.55)', maxWidth: '480px', margin: '0 auto 3rem', lineHeight: 1.7 }}>
            Every component is interactive, themeable, and accessible out of the box.
          </p>
          <LandingShowcase />
        </div>
      </section>

      {/* ── Animated Callout (client) ─────────────────────────────────────── */}
      <LandingCallout />

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid var(--color-border-default)',
          padding: '1.5rem 2rem',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: '0.78rem',
          lineHeight: 1.6,
        }}
      >
        Built on{' '}
        <span style={{ color: 'var(--color-brand-primary-500)', fontWeight: 600 }}>Nexub Design System</span>
        {' '}·{' '}
        © {new Date().getFullYear()} Nexub Pte. Ltd., Singapore 🇸🇬
        {' '}·{' '}
        Crafted by{' '}
        <a
          href="https://github.com/sasinex"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-brand-primary-500)', textDecoration: 'none', fontWeight: 500 }}
        >
          Sasidharan
        </a>
        {' '}— shipped with vibe coding energy ⚡
      </footer>
    </main>
  );
}
