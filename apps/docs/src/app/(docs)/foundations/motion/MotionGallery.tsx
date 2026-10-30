'use client';

import * as React from 'react';
import {
  Button,
  Card,
  CardLink,
  Collapse,
  Dialog,
  Drawer,
  Fade,
  ListTransition,
  NumberTicker,
  Popover,
  Scale,
  SegmentedControl,
  Skeleton,
  SkeletonSwap,
  Slide,
  Switch,
  Text,
} from '@nexub/react';
import { Play, Plus, X } from '@nexub/icons';
import type { SpringToken } from './springs';

/* ── Controls: replay, slow motion, reduced motion ─────────────────────────── */

interface Ctx {
  run: number;
}
const GalleryCtx = React.createContext<Ctx>({ run: 0 });

export function MotionGallery({ springs, children }: { springs: SpringToken[]; children: React.ReactNode }) {
  const [run, setRun] = React.useState(0);
  const [slow, setSlow] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);

  // Slow motion: every spring token's settle time × 4 inside the gallery.
  const vars = React.useMemo(() => {
    if (!slow) return undefined;
    const v: Record<string, string> = {};
    for (const s of springs) v[`--motion-spring-${s.family}-${s.speed}-duration`] = `${s.durationMs * 4}ms`;
    return v as React.CSSProperties;
  }, [slow, springs]);

  return (
    <GalleryCtx.Provider value={{ run }}>
      <div className="sticky top-[calc(var(--docs-header-height)+8px)] z-10 mb-6 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] px-4 py-3 shadow-elevation-1">
        <Button size="sm" leadingIcon={<Play size={14} />} onClick={() => setRun((r) => r + 1)}>
          Replay all
        </Button>
        <label className="flex items-center gap-2 text-label-lg text-[var(--color-on-surface)]">
          <Switch checked={slow} onCheckedChange={setSlow} aria-label="Slow motion" /> Slow motion (0.25×)
        </label>
        <label className="flex items-center gap-2 text-label-lg text-[var(--color-on-surface)]">
          <Switch checked={reduced} onCheckedChange={setReduced} aria-label="Preview reduced motion" /> Reduced motion
        </label>
        <Text size="caption" tone="muted" className="basis-full">
          The reduced-motion preview applies the CSS fallbacks (no travel or scale; crossfades stay). Components that check{' '}
          <code>prefers-reduced-motion</code> in JavaScript follow your OS setting.
        </Text>
      </div>
      <div className={reduced ? 'docs-reduce-motion' : undefined} style={vars}>
        {children}
      </div>
    </GalleryCtx.Provider>
  );
}

const useRun = () => React.useContext(GalleryCtx).run;

function Demo({ title, token, children, code }: { title: string; token: string; children: React.ReactNode; code?: string }) {
  return (
    <Card className="flex flex-col overflow-hidden p-0">
      <div className="docs-dot-grid flex min-h-[180px] flex-1 items-center justify-center p-6">{children}</div>
      <div className="flex flex-col gap-1 border-t border-[var(--color-outline-variant)] px-4 py-3">
        <Text size="label" weight="semibold" className="text-[var(--color-on-surface)]">{title}</Text>
        <Text size="caption" tone="muted" className="font-mono">{token}</Text>
        {code && <Text size="caption" tone="secondary" className="font-mono">{code}</Text>}
      </div>
    </Card>
  );
}

/* ── Spring curves (from the tokens) ───────────────────────────────────────── */

export function SpringCurves({ springs }: { springs: SpringToken[] }) {
  const run = useRun();
  const [local, setLocal] = React.useState(0);
  const families = ['spatial', 'effects', 'expressive'] as const;
  const W = 220;
  const H = 120;
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {families.map((f) => {
        const s = springs.find((x) => x.family === f && x.speed === 'default');
        if (!s) return null;
        const max = Math.max(1.05, ...s.points);
        const pts = s.points.map((p, i) => `${(i / (s.points.length - 1)) * W},${H - (p / max) * (H - 8) - 4}`).join(' ');
        return (
          <Card key={f} className="flex flex-col gap-3 p-4">
            <div className="flex items-baseline justify-between">
              <Text weight="semibold" className="capitalize text-[var(--color-on-surface)]">{f}</Text>
              <Text size="caption" tone="muted" className="font-mono">{Math.round(s.durationMs)} ms</Text>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="h-[120px] w-full overflow-visible" role="img" aria-label={`${f} spring curve`}>
              <line x1="0" x2={W} y1={H - (1 / max) * (H - 8) - 4} y2={H - (1 / max) * (H - 8) - 4} stroke="var(--color-outline-variant)" strokeDasharray="3 3" />
              <polyline points={pts} fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinejoin="round" />
            </svg>
            <button
              type="button"
              onClick={() => setLocal((n) => n + 1)}
              className="nx-state-layer relative h-10 overflow-hidden rounded-shape-control bg-[var(--color-surface-container-high)]"
              aria-label={`Run the ${f} spring`}
            >
              <span
                key={`${run}-${local}`}
                className="docs-spring-dot absolute start-1 top-1 h-8 w-8 rounded-full bg-[var(--color-primary)]"
                style={{ animationDuration: `var(--motion-spring-${f}-default-duration)`, animationTimingFunction: `var(--motion-spring-${f}-default-easing)` }}
              />
            </button>
          </Card>
        );
      })}
    </div>
  );
}

/* ── Web demos ─────────────────────────────────────────────────────────────── */

export function WebDemos() {
  const run = useRun();
  const [items, setItems] = React.useState([1, 2, 3]);
  const next = React.useRef(4);
  const [loading, setLoading] = React.useState(true);
  const [n, setN] = React.useState(12480);
  const [shown, setShown] = React.useState(true);
  const [seg, setSeg] = React.useState('week');

  React.useEffect(() => {
    if (!run) return;
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 900);
    setN((v) => v + Math.round(Math.random() * 4000));
    setShown(false);
    const s = setTimeout(() => setShown(true), 50);
    return () => {
      clearTimeout(t);
      clearTimeout(s);
    };
  }, [run]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <Demo title="Dialog" token="nx-motion nx-dialog · effects + spatial" code="Exit is faster, never overshoots">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button variant="tonal">Open dialog</Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay />
            <Dialog.Content>
              <Dialog.Title>Spring in, faster out</Dialog.Title>
              <Dialog.Description>Scales from 0.96 and rises 8px on the spatial spring; fades on the effects spring.</Dialog.Description>
              <div className="mt-4 flex justify-end">
                <Dialog.Close asChild>
                  <Button>Close</Button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </Demo>

      <Demo title="Popover" token="nx-motion nx-pop · grows from its trigger">
        <Popover.Root>
          <Popover.Trigger asChild>
            <Button variant="outlined">Open popover</Button>
          </Popover.Trigger>
          <Popover.Content className="w-60 p-4">
            <Text>Scales from 0.96 with a 4px nudge away from the side it opens on.</Text>
          </Popover.Content>
        </Popover.Root>
      </Demo>

      <Demo title="Drawer" token="nx-drawer · spatial spring from its edge">
        <Drawer.Root>
          <Drawer.Trigger asChild>
            <Button variant="outlined">Open drawer</Button>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay />
            <Drawer.Content side="right" className="w-80 p-6">
              <Drawer.Title>Filters</Drawer.Title>
              <Drawer.Description>Slides in on the spatial spring; the scrim fades on the effects spring.</Drawer.Description>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </Demo>

      <Demo title="Stagger" token="nx-stagger · 40 ms apart" code="Re-key the parent to replay">
        <div key={run} className="nx-stagger grid w-full max-w-[260px] grid-cols-3 gap-2">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-12 rounded-shape-control bg-[var(--color-primary-container)]" />
          ))}
        </div>
      </Demo>

      <Demo title="List add and remove" token="ListTransition · rows grow in, collapse out">
        <div className="flex w-full max-w-[260px] flex-col gap-2">
          <ListTransition as="ul" itemAs="li" className="m-0 list-none p-0">
            {items.map((i) => (
              <div key={i} className="pb-1.5">
                <div className="flex items-center justify-between rounded-shape-control bg-[var(--color-surface-container-high)] py-2 pe-1 ps-3">
                  <Text size="body-sm">Payment #{i}</Text>
                  <button
                    type="button"
                    aria-label={`Remove payment ${i}`}
                    className="nx-state-layer grid h-7 w-7 place-items-center rounded-full text-[var(--color-on-surface-variant)]"
                    onClick={() => setItems((xs) => xs.filter((x) => x !== i))}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </ListTransition>
          <Button size="sm" variant="text" leadingIcon={<Plus size={14} />} onClick={() => setItems((xs) => [...xs, next.current++])}>
            Add
          </Button>
        </div>
      </Demo>

      <Demo title="Skeleton to content" token="SkeletonSwap · crossfade">
        <div className="flex w-full max-w-[260px] flex-col gap-3">
          <SkeletonSwap loading={loading} skeleton={<Skeleton shape="rect" height={64} />}>
            <div className="flex h-16 items-center gap-3 rounded-shape-control bg-[var(--color-surface-container-high)] px-3">
              <div className="h-10 w-10 rounded-full bg-[var(--color-tertiary-container)]" />
              <Text size="body-sm">Mei Tan sent you S$42.50</Text>
            </div>
          </SkeletonSwap>
          <Button size="sm" variant="text" onClick={() => setLoading((l) => !l)}>
            {loading ? 'Load' : 'Reset'}
          </Button>
        </div>
      </Demo>

      <Demo title="Number ticker" token="NumberTicker · digits roll on the spatial spring">
        <div className="flex flex-col items-center gap-3">
          <NumberTicker value={n} format={{ style: 'currency', currency: 'SGD' }} locale="en-SG" className="text-headline-sm text-[var(--color-on-surface)]" />
          <Button size="sm" variant="outlined" onClick={() => setN((v) => v + Math.round(Math.random() * 4000 - 1500))}>
            Change
          </Button>
        </div>
      </Demo>

      <Demo title="Sliding indicator" token="SegmentedControl · spatial spring">
        <SegmentedControl.Root aria-label="Period" value={seg} onValueChange={(v) => v && setSeg(v)}>
          <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
          <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
          <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
        </SegmentedControl.Root>
      </Demo>

      <Demo title="Press and lift" token="nx-press 0.97 · nx-lift 2px" code="Hover and press">
        <div className="flex flex-col items-center gap-4">
          <Button>Press me</Button>
          <Card variant="interactive" className="w-48 p-4">
            <CardLink href="#press-and-lift">
              <Text weight="semibold">Hover this card</Text>
            </CardLink>
          </Card>
        </div>
      </Demo>

      <Demo title="Fade · Slide · Scale · Collapse" token="Motion primitives · on springs">
        <div className="flex w-full max-w-[280px] flex-col items-center gap-3">
          <div className="grid w-full grid-cols-3 gap-2">
            <Fade in={shown}><div className="h-10 rounded-shape-control bg-[var(--color-secondary-container)]" /></Fade>
            <Slide in={shown} direction="up"><div className="h-10 rounded-shape-control bg-[var(--color-secondary-container)]" /></Slide>
            <Scale in={shown}><div className="h-10 rounded-shape-control bg-[var(--color-secondary-container)]" /></Scale>
          </div>
          <Collapse in={shown} className="w-full">
            <div className="rounded-shape-control bg-[var(--color-surface-container-high)] p-3">
              <Text size="body-sm">Collapse animates height on the spatial spring.</Text>
            </div>
          </Collapse>
          <Button size="sm" variant="text" onClick={() => setShown((s) => !s)}>
            {shown ? 'Hide' : 'Show'}
          </Button>
        </div>
      </Demo>
    </div>
  );
}
