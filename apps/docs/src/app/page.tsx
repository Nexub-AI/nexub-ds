import Link from 'next/link';
import Image from 'next/image';
import { componentEntries, patternEntries } from '@/registry/index';
import { ThemeSwitcher } from '@/components/docs/ThemeSwitcher';

export default function HomePage() {
  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '4rem 2rem',
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link href="/getting-started" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Docs</Link>
            <Link href="/components" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Components</Link>
            <Link href="/patterns" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Patterns</Link>
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
            marginBottom: '1.5rem',
            background: 'var(--color-semantic-info-bg)',
            border: '1px solid var(--color-semantic-info-border)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--color-semantic-info-default)',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: 'var(--color-semantic-info-default)',
              display: 'inline-block',
            }}
          />
          Now in v0.0.1 — {componentEntries.length}+ components, {patternEntries.length} patterns
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem',
            maxWidth: '800px',
            background: 'linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-brand-primary-500) 60%, var(--color-brand-primary-400) 100%)',
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
            maxWidth: '540px',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
          }}
        >
          A complete library of accessible, token-driven React components and patterns.
          Build faster, ship consistently.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link
            href="/getting-started"
            style={{
              padding: '12px 28px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--gradient-button-primary)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9375rem',
              textDecoration: 'none',
              boxShadow: 'var(--shadow-md)',
              transition: 'opacity var(--duration-fast) var(--ease-out)',
            }}
          >
            Get started →
          </Link>
          <Link
            href="/components"
            style={{
              padding: '12px 28px',
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
        <div style={{ display: 'flex', gap: '48px', marginTop: '5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { num: `${componentEntries.length}+`, label: 'Components' },
            { num: `${patternEntries.length}`, label: 'Patterns' },
            { num: '5', label: 'Brand themes' },
            { num: '100%', label: 'TypeScript' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-brand-primary-500)' }}>{s.num}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
