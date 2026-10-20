'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeSwitcher } from '@/components/docs/ThemeSwitcher';

interface LandingHeroProps {
  version: string;
  componentCount: number;
  patternCount: number;
}

export function LandingHero({ version, componentCount, patternCount }: LandingHeroProps) {
  const heroRef = React.useRef<HTMLElement>(null);
  const [cursor, setCursor] = React.useState({ x: 0, y: 0, active: false });

  React.useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top, active: true });
    };
    const onLeave = () => setCursor((c) => ({ ...c, active: false }));
    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);
    return () => {
      hero.removeEventListener('mousemove', onMove);
      hero.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const stats = [
    { num: `${componentCount}`, label: 'Components' },
    { num: `${patternCount}`, label: 'Patterns' },
    { num: '5', label: 'Brand themes' },
    { num: '100%', label: 'TypeScript' },
  ];

  return (
    <section
      ref={heroRef}
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
        overflow: 'hidden',
      }}
    >
      {/* ── Cursor spotlight (pure client, no SSR impact) ─────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          opacity: cursor.active ? 1 : 0,
          transition: 'opacity 0.3s ease',
          background: `radial-gradient(600px circle at ${cursor.x}px ${cursor.y}px, color-mix(in srgb, var(--color-primary) 8%, transparent) 0%, transparent 70%)`,
        }}
      />

      {/* ── Floating gradient orbs — CSS keyframes (.landing-orb in globals.css) ────── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div
          className="landing-orb"
          style={{
            ['--orb-y' as string]: '-30px',
            ['--orb-x' as string]: '15px',
            animationDuration: '8s',
            animationDelay: '0s',
            position: 'absolute',
            top: '8%',
            left: '12%',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: 'var(--color-primary)',
            opacity: 0.07,
            filter: 'blur(80px)',
          }}
        />
        <div
          className="landing-orb"
          style={{
            ['--orb-y' as string]: '25px',
            ['--orb-x' as string]: '-20px',
            animationDuration: '11s',
            animationDelay: '2s',
            position: 'absolute',
            bottom: '12%',
            right: '8%',
            width: '360px',
            height: '360px',
            borderRadius: '50%',
            background: 'var(--color-primary)',
            opacity: 0.06,
            filter: 'blur(70px)',
          }}
        />
        <div
          className="landing-orb"
          style={{
            ['--orb-y' as string]: '-18px',
            ['--orb-x' as string]: '10px',
            animationDuration: '14s',
            animationDelay: '5s',
            position: 'absolute',
            top: '20%',
            right: '20%',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'var(--color-primary)',
            opacity: 0.05,
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* ── Nav strip ─────────────────────────────────────────────────────── */}
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
          borderBottom: '1px solid var(--color-outline-variant)',
          background: 'color-mix(in srgb, var(--color-surface) 80%, transparent)',
          backdropFilter: 'blur(10px)',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Static nav logo */}
          <Image
            src="/nexub-icon.svg"
            alt="Nexub"
            width={39}
            height={28}
            priority
            style={{ display: 'block' }}
          />
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-on-surface)' }}>
            Nexub<span style={{ color: 'var(--color-primary)' }}> DS</span>
          </span>
        </div>

        <div className="landing-nav-links">
          <Link href="/getting-started" className="landing-nav-link" style={{ color: 'var(--color-on-surface-variant)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Docs</Link>
          <Link href="/components" className="landing-nav-link" style={{ color: 'var(--color-on-surface-variant)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Components</Link>
          <Link href="/patterns" className="landing-nav-link" style={{ color: 'var(--color-on-surface-variant)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Patterns</Link>
          <ThemeSwitcher />
        </div>
      </nav>

      {/* ── Hero icon with orbital rings ──────────────────────────────────── */}
      <div className="hero-icon-wrap" style={{ position: 'relative', zIndex: 2 }}>
        {/* Soft glow behind the icon */}
        <div
          style={{
            position: 'absolute',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--color-primary)',
            opacity: 0.18,
            filter: 'blur(24px)',
          }}
        />
        {/* The icon itself */}
        <Image
          src="/nexub-icon.svg"
          alt="Nexub"
          width={72}
          height={52}
          priority
          style={{ display: 'block', position: 'relative', zIndex: 2 }}
        />
        {/* Orbital rings */}
        <div className="logo-ring logo-ring-1" />
        <div className="logo-ring logo-ring-2" />
      </div>

      {/* ── Eyebrow — CSS animation, SSR-safe ─────────────────────────────── */}
      <div
        className="hero-anim-1"
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 14px',
          marginBottom: '1.75rem',
          background: 'var(--color-info-container)',
          border: '1px solid color-mix(in srgb, var(--color-info) 35%, transparent)',
          borderRadius: 'var(--shape-control)',
          fontSize: '0.78rem',
          fontWeight: 600,
          color: 'var(--color-info)',
          letterSpacing: '0.02em',
        }}
      >
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
        v{version} · {componentCount} components · {patternCount} patterns
      </div>

      {/* ── Headline — CSS animation ───────────────────────────────────────── */}
      <h1
        className="hero-anim-2"
        style={{
          position: 'relative',
          zIndex: 2,
          fontSize: 'clamp(2.75rem, 7vw, 5rem)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.035em',
          marginBottom: '1.25rem',
          maxWidth: '860px',
          background: 'linear-gradient(135deg, var(--color-on-surface) 0%, var(--color-primary) 55%, var(--color-primary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Design system for<br />ambitious SaaS teams
      </h1>

      {/* ── Subheading — CSS animation ────────────────────────────────────── */}
      <p
        className="hero-anim-3"
        style={{
          position: 'relative',
          zIndex: 2,
          fontSize: '1.125rem',
          color: 'var(--color-on-surface-variant)',
          maxWidth: '520px',
          lineHeight: 1.7,
          marginBottom: '2.5rem',
        }}
      >
        A complete library of accessible, token-driven React components and patterns.
        Build faster, ship consistently, look great everywhere.
      </p>

      {/* ── CTAs — CSS animation ──────────────────────────────────────────── */}
      <div
        className="hero-anim-4"
        style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <Link
          href="/getting-started"
          className="landing-cta-shimmer"
          style={{
            padding: '13px 30px',
            borderRadius: 'var(--shape-container)',
            background: 'var(--gradient-button-primary)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.9375rem',
            textDecoration: 'none',
            boxShadow: 'var(--elevation-2)',
            display: 'inline-block',
          }}
        >
          Get started →
        </Link>
        <Link
          href="/components"
          style={{
            padding: '13px 30px',
            borderRadius: 'var(--shape-container)',
            background: 'var(--color-surface-elevated)',
            border: '1px solid var(--color-outline-variant)',
            color: 'var(--color-on-surface)',
            fontWeight: 600,
            fontSize: '0.9375rem',
            textDecoration: 'none',
          }}
        >
          Browse components
        </Link>
      </div>

      {/* ── Stats strip — CSS animation ───────────────────────────────────── */}
      <div
        className="landing-stats hero-stats"
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          gap: '48px',
          marginTop: '4.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {stats.map((s) => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>{s.num}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-on-surface-muted)', fontWeight: 500, marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
