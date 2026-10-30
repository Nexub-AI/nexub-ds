'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, EyebrowChip, Heading, Logo, Text, TextGradient, TopNav } from '@nexub/react';
import { ArrowRight } from '@nexub/icons';
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
    { num: '3', label: 'Platforms: web, iOS, Android' },
  ];

  return (
    <section
      ref={heroRef}
      className="landing-hero relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-8 pb-20 pt-32 text-center [background:var(--gradient-hero-ambient)]"
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

      {/* ── Floating gradient orbs — CSS keyframes (.landing-orb in globals.css) ────── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="landing-orb absolute left-[12%] top-[8%] h-[420px] w-[420px] rounded-full bg-[var(--color-primary)] opacity-[0.07] blur-[80px] [animation-delay:0s] [animation-duration:8s]"
          style={{ ['--orb-y' as string]: '-30px', ['--orb-x' as string]: '15px' }}
        />
        <div
          className="landing-orb absolute bottom-[12%] right-[8%] h-[360px] w-[360px] rounded-full bg-[var(--color-primary)] opacity-[0.06] blur-[70px] [animation-delay:2s] [animation-duration:11s]"
          style={{ ['--orb-y' as string]: '25px', ['--orb-x' as string]: '-20px' }}
        />
        <div
          className="landing-orb absolute right-[20%] top-[20%] h-[280px] w-[280px] rounded-full bg-[var(--color-primary)] opacity-[0.05] blur-[60px] [animation-delay:5s] [animation-duration:14s]"
          style={{ ['--orb-y' as string]: '-18px', ['--orb-x' as string]: '10px' }}
        />
      </div>

      {/* ── Nav strip ─────────────────────────────────────────────────────── */}
      <TopNav.Root surface="glass" className="absolute inset-x-0 top-0 z-10 justify-between gap-6 border-x-0 border-t-0 px-8">
        <Link href="/" aria-label="Nexub Design System home" className="no-underline">
          <Logo size="sm" product="Design System" />
        </Link>

        <div className="landing-nav-links">
          <Button asChild variant="text" size="sm" className="landing-nav-link"><Link href="/getting-started">Docs</Link></Button>
          <Button asChild variant="text" size="sm" className="landing-nav-link"><Link href="/components">Components</Link></Button>
          <Button asChild variant="text" size="sm" className="landing-nav-link"><Link href="/patterns">Patterns</Link></Button>
          <ThemeSwitcher />
        </div>
      </TopNav.Root>

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
