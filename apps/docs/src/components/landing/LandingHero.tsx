'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Aurora, Button, EyebrowChip, Heading, SegmentedControl, Text, TextGradient, useScopedSeed } from '@nexub/react';
import { ArrowRight } from '@nexub/icons';

interface LandingHeroProps {
  version: string;
  componentCount: number;
  patternCount: number;
}

export function LandingHero({ version, componentCount, patternCount }: LandingHeroProps) {
  const heroRef = React.useRef<HTMLElement>(null);
  const [cursor, setCursor] = React.useState({ x: 0, y: 0, active: false });
  // 4.7 remix: a brand seed recolours the hero live (CSSOM, so CSP-safe), and
  // Calm/Vivid switches the page's expression (on <html>; Vivid is the 5.0 default).
  const [seed, setSeed] = React.useState<string | null>(null);
  const [expression, setExpression] = React.useState<'calm' | 'vivid'>('vivid');
  useScopedSeed(heroRef, seed);
  useScopedSeed(heroRef, seed, { target: 'tertiary' });
  React.useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-expression', expression);
    return () => html.setAttribute('data-expression', 'vivid');
  }, [expression]);

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
    { num: '3', label: 'Platforms: web, iOS, Android' },
  ];

  return (
    <section
      ref={heroRef}
      className="landing-hero relative isolate flex min-h-[calc(100vh-var(--docs-header-height))] flex-col items-center justify-center overflow-hidden px-8 pb-20 pt-16 text-center [background:var(--gradient-hero-ambient)]"
    >
      {/* ── Cursor spotlight (pure client, no SSR impact) ─────────────────── */}
      <div
        aria-hidden="true"
        className={
          'pointer-events-none absolute inset-0 z-[1] transition-opacity duration-effects-default ' +
          (cursor.active ? 'opacity-100' : 'opacity-0')
        }
        style={{
          background: `radial-gradient(600px circle at ${cursor.x}px ${cursor.y}px, color-mix(in srgb, var(--color-primary) 8%, transparent) 0%, transparent 70%)`,
        }}
      />

      {/* ── Aurora (the library component; richer under Vivid) ─────────────── */}
      {/* A full-screen hero needs a quieter aurora than a card. */}
      <Aurora className="[--nx-aurora-strength:0.2]!" />

      {/* ── Hero icon with orbital rings ──────────────────────────────────── */}
      <div className="hero-icon-wrap relative z-[2]">
        <div aria-hidden="true" className="absolute h-20 w-20 rounded-full bg-[var(--color-primary)] opacity-[0.18] blur-[24px]" />
        <Image src="/nexub-icon.svg" alt="Nexub" width={72} height={52} priority className="relative z-[2] block" />
        <div className="logo-ring logo-ring-1" />
        <div className="logo-ring logo-ring-2" />
      </div>

      {/* ── Eyebrow — CSS animation, SSR-safe ─────────────────────────────── */}
      <EyebrowChip tone="info" className="hero-anim-1 relative z-[2] mb-7">
        v{version} · {componentCount} components · {patternCount} patterns
      </EyebrowChip>

      {/* ── Headline — CSS animation ───────────────────────────────────────── */}
      <Heading
        level={1}
        size="display"
        className="hero-anim-2 relative z-[2] mb-5 max-w-[860px] text-[clamp(2.75rem,7vw,5rem)] leading-[1.05] tracking-[-0.035em]"
      >
        Design system for<br />
        {/* Calm override of the brand rainbow: ink to primary. */}
        <TextGradient className="[background-image:linear-gradient(135deg,var(--color-on-surface)_0%,var(--color-primary)_70%)]">
          ambitious SaaS teams
        </TextGradient>
      </Heading>

      {/* ── Subheading — CSS animation ────────────────────────────────────── */}
      <Text size="body-lg" tone="secondary" className="hero-anim-3 relative z-[2] mb-10 max-w-[540px]">
        Accessible, token-driven components and patterns for React on the web and React Native on iOS and Android.
        One set of tokens, two platforms, every product brand.
      </Text>

      {/* ── CTAs — CSS animation ──────────────────────────────────────────── */}
      <div className="hero-anim-4 relative z-[2] flex flex-wrap justify-center gap-3">
        <Button asChild variant="filled" size="lg" className="landing-cta-shimmer">
          <Link href="/getting-started">Get started <ArrowRight size="sm" aria-hidden="true" /></Link>
        </Button>
        <Button asChild variant="outlined" size="lg">
          <Link href="/components">Browse components</Link>
        </Button>
      </div>

      {/* ── Remix: try a brand colour and the expression layer ────────────── */}
      <div className="hero-anim-4 relative z-[2] mt-8 flex flex-wrap items-center justify-center gap-3">
        <span className="text-label-md text-[var(--color-on-surface-variant)]">Remix this page</span>
        <div role="group" aria-label="Brand colour" className="flex gap-1.5">
          {[null, '#e4572e', '#0f9d58', '#7b1fa2', '#ffb300', '#00897b'].map((c) => (
            <button
              key={c ?? 'nexub'}
              type="button"
              aria-pressed={seed === c}
              aria-label={c ? `Use ${c}` : 'Nexub blue'}
              onClick={() => setSeed(c)}
              ref={(el) => el?.style.setProperty('background', c ?? 'var(--color-primary)')}
              className="size-7 rounded-full border-2 border-[var(--color-surface)] outline-offset-2 aria-pressed:outline-2 aria-pressed:outline-solid aria-pressed:outline-[var(--color-on-surface)]"
            />
          ))}
        </div>
        <SegmentedControl.Root aria-label="Expression" size="sm" value={expression} onValueChange={(v) => v && setExpression(v as 'calm' | 'vivid')}>
          <SegmentedControl.Item value="calm">Calm</SegmentedControl.Item>
          <SegmentedControl.Item value="vivid">Vivid</SegmentedControl.Item>
        </SegmentedControl.Root>
        <Link href="/foundations/theme-builder" className="text-label-md">Open the theme builder</Link>
      </div>

      {/* ── Stats strip — CSS animation ───────────────────────────────────── */}
      <div className="landing-stats hero-stats relative z-[2] mt-[4.5rem] flex flex-wrap justify-center gap-12">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <Text size="body" weight="bold" className="text-[2rem] leading-tight text-[var(--color-primary)]">{s.num}</Text>
            <Text size="caption" tone="muted" weight="medium" className="mt-0.5">{s.label}</Text>
          </div>
        ))}
      </div>
    </section>
  );
}
