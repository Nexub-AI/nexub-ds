import Link from 'next/link';
import Image from 'next/image';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { componentEntries, patternEntries } from '@/registry/index';
import { ThemeSwitcher } from '@/components/docs/ThemeSwitcher';
import {
  Button,
  Badge,
  Input,
  Spinner,
  Stack,
} from '@nexub/react';
import { Search } from '@nexub/icons';

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

/* ── Feature cards data ───────────────────────────────────────────────────── */
const features = [
  {
    icon: '◈',
    stat: `${componentEntries.length}+`,
    title: 'Components',
    desc: 'Accessible, token-driven React components built on Radix UI primitives. Every edge case handled.',
  },
  {
    icon: '⬡',
    stat: '100%',
    title: 'TypeScript',
    desc: 'Fully typed from props to theme tokens. Autocomplete, type safety, zero any-casting.',
  },
  {
    icon: '◐',
    stat: '5',
    title: 'Brand themes',
    desc: 'Light, dark, and 4 product brands (Leap, Bookub, Payub, Founderub) — all CSS, zero runtime.',
  },
  {
    icon: '⊞',
    stat: `${patternEntries.length}`,
    title: 'Patterns',
    desc: 'Composable UI patterns for real SaaS flows: stat cards, auth, settings, activity feeds.',
  },
];

export default function HomePage() {
  const version = getVersion();

  return (
    <main style={{ background: 'var(--color-bg-default)', color: 'var(--color-text-primary)' }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="landing-hero"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '8rem 2rem 5rem',
          background: 'var(--gradient-hero-ambient)',
          position: 'relative',
        }}
      >
        {/* Nav strip */}
        <nav
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: '1.25rem 2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--color-border-default)',
            background: 'color-mix(in srgb, var(--color-bg-default) 80%, transparent)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Image src="/nexub-icon.svg" alt="Nexub" width={39} height={28} priority style={{ display: 'block' }} />
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
              Nexub<span style={{ color: 'var(--color-brand-primary-500)' }}> DS</span>
            </span>
          </div>

          <div className="landing-nav-links">
            <Link href="/getting-started" className="landing-nav-link" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Docs</Link>
            <Link href="/components" className="landing-nav-link" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Components</Link>
            <Link href="/patterns" className="landing-nav-link" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Patterns</Link>
            <ThemeSwitcher />
          </div>
        </nav>

        {/* Eyebrow */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 14px',
            marginBottom: '1.75rem',
            background: 'var(--color-semantic-info-bg)',
            border: '1px solid var(--color-semantic-info-border)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--color-semantic-info-default)',
            letterSpacing: '0.02em',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
          v{version} · {componentEntries.length} components · {patternEntries.length} patterns
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 'clamp(2.75rem, 7vw, 5rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.035em',
            marginBottom: '1.25rem',
            maxWidth: '860px',
            background: 'linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-brand-primary-500) 55%, var(--color-brand-primary-400) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Design system for<br />ambitious SaaS teams
        </h1>

        {/* Sub */}
        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--color-text-secondary)',
            maxWidth: '520px',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
          }}
        >
          A complete library of accessible, token-driven React components and patterns.
          Build faster, ship consistently, look great everywhere.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link
            href="/getting-started"
            style={{
              padding: '13px 30px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--gradient-button-primary)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9375rem',
              textDecoration: 'none',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            Get started →
          </Link>
          <Link
            href="/components"
            style={{
              padding: '13px 30px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-bg-raised)',
              border: '1px solid var(--color-border-default)',
              color: 'var(--color-text-primary)',
              fontWeight: 600,
              fontSize: '0.9375rem',
              textDecoration: 'none',
            }}
          >
            Browse components
          </Link>
        </div>

        {/* Stats strip */}
        <div
          className="landing-stats"
          style={{ display: 'flex', gap: '48px', marginTop: '4.5rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {[
            { num: `${componentEntries.length}+`, label: 'Components' },
            { num: `${patternEntries.length}`, label: 'Patterns' },
            { num: '5', label: 'Brand themes' },
            { num: '100%', label: 'TypeScript' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-brand-primary-500)' }}>{s.num}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 500, marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature strip ─────────────────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--color-bg-subtle)',
          borderTop: '1px solid var(--color-border-default)',
          borderBottom: '1px solid var(--color-border-default)',
          padding: '5rem 2rem',
        }}
      >
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          {/* Section label */}
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-brand-primary-500)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>
            What&apos;s inside
          </p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, textAlign: 'center', letterSpacing: '-0.02em', marginBottom: '3rem', color: 'var(--color-text-primary)' }}>
            Everything you need to ship faster
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
              gap: '20px',
            }}
          >
            {features.map((f) => (
              <div
                key={f.title}
                style={{
                  background: 'var(--color-bg-raised)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.75rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div
                  style={{
                    fontSize: '1.5rem',
                    marginBottom: '1rem',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--color-semantic-info-bg)',
                    border: '1px solid var(--color-semantic-info-border)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'var(--color-brand-primary-500)',
                  }}
                >
                  {f.icon}
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-brand-primary-500)', lineHeight: 1, marginBottom: '0.25rem' }}>
                  {f.stat}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                  {f.title}
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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

          {/* Live demos */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center', alignItems: 'center' }}>
            {/* Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'rgba(240,246,252,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Button</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button variant="primary" size="md">Primary</Button>
                <Button variant="outline" size="md">Outline</Button>
                <Button variant="ghost" size="md">Ghost</Button>
              </div>
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'rgba(240,246,252,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Badge</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Badge tone="info">Info</Badge>
                <Badge tone="success">Success</Badge>
                <Badge tone="warning">Warning</Badge>
                <Badge tone="danger">Danger</Badge>
              </div>
            </div>

            {/* Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'rgba(240,246,252,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Input</div>
              <div style={{ width: '200px' }}>
                <Input placeholder="Search components…" leadingIcon={<Search size="sm" />} />
              </div>
            </div>

            {/* Spinner */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'rgba(240,246,252,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Spinner</div>
              <Stack direction="row" gap="md" align="center">
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
              </Stack>
            </div>
          </div>
        </div>
      </section>

      {/* ── "Dogfoods itself" callout ─────────────────────────────────────── */}
      <section
        style={{
          padding: '5rem 2rem',
          background: 'var(--color-bg-default)',
          borderBottom: '1px solid var(--color-border-default)',
        }}
      >
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            padding: '2.5rem',
            background: 'var(--color-bg-subtle)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-2xl)',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '2px 10px',
                marginBottom: '0.75rem',
                background: 'var(--color-semantic-success-bg)',
                border: '1px solid var(--color-semantic-success-border)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--color-semantic-success-default)',
                letterSpacing: '0.04em',
              }}
            >
              ✓ Dogfood
            </div>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>
              This site is built with Nexub DS
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.7, maxWidth: '460px' }}>
              Every header, sidebar, badge, button, and code block you see here is a real{' '}
              <code style={{ fontFamily: 'var(--font-family-mono)', fontSize: '0.82em', background: 'var(--color-bg-muted)', padding: '1px 5px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-default)' }}>@nexub/react</code>{' '}
              component. We eat our own cooking.
            </p>
          </div>
          <Link
            href="/getting-started"
            style={{
              padding: '11px 24px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-brand-primary-500)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            Start building →
          </Link>
        </div>
      </section>

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
