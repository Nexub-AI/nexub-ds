'use client';

/**
 * Docs page kit: every docs page is built from these plus @nexub/react, so the
 * site itself follows the design system (no hand-rolled inline styles).
 */
import * as React from 'react';
import { Alert, Badge, Card, Heading, Table, Text } from '@nexub/react';
import { Check, X } from '@nexub/icons';

/* ── Page intro ─────────────────────────────────────────────────────────────── */

export function PageIntro({
  eyebrow,
  title,
  lead,
  badges,
  children,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  badges?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-10 flex flex-col gap-3" data-reveal>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Heading level={1} className="docs-title">
          {title}
        </Heading>
        {badges && <div className="flex flex-wrap items-center gap-2">{badges}</div>}
      </div>
      {lead && (
        <Text size="body-lg" tone="secondary" className="max-w-[68ch]">
          {lead}
        </Text>
      )}
      {children}
    </header>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <Text size="label" weight="semibold" className="uppercase tracking-wider !text-[var(--color-primary)]">
      {children}
    </Text>
  );
}

/* ── Sections ───────────────────────────────────────────────────────────────── */

export function Section({
  id,
  title,
  description,
  level = 2,
  children,
  className,
}: {
  id?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  level?: 2 | 3;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section data-reveal className={(level === 2 ? 'mt-14 ' : 'mt-8 ') + 'flex flex-col gap-4 ' + (className ?? '')}>
      <div className="flex flex-col gap-1.5">
        <Heading id={id} level={level} className={level === 2 ? 'docs-h2 scroll-mt-24' : 'docs-h3 scroll-mt-24'}>
          {title}
        </Heading>
        {description && (
          <Text tone="secondary" className="max-w-[72ch]">
            {description}
          </Text>
        )}
      </div>
      {children}
    </section>
  );
}

/** Body copy at the docs reading size and measure. */
export function Prose({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Text size="body-lg" tone="secondary" className={'max-w-[72ch] [&_strong]:text-[var(--color-on-surface)] ' + (className ?? '')}>
      {children}
    </Text>
  );
}

/* ── Tables ─────────────────────────────────────────────────────────────────── */

export function DocTable({
  head,
  rows,
  caption,
  mono = [],
}: {
  head: React.ReactNode[];
  rows: React.ReactNode[][];
  caption?: string;
  /** Column indexes rendered in the mono face (token names, props, code). */
  mono?: number[];
}) {
  return (
    <div className="overflow-x-auto rounded-shape-container border border-[var(--color-outline-variant)]">
      <Table.Root>
        {caption && <Table.Caption className="sr-only">{caption}</Table.Caption>}
        <Table.Header>
          <Table.Row>
            {head.map((h, i) => (
              <Table.Head key={i}>{h}</Table.Head>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((r, i) => (
            <Table.Row key={i}>
              {r.map((c, j) => (
                <Table.Cell key={j} className={mono.includes(j) ? 'font-mono text-body-sm' : 'text-body-md'}>
                  {c}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}

/* ── Guidance: Do / Don't ───────────────────────────────────────────────────── */

export function Guidance({
  doTitle = 'Do',
  dontTitle = "Don't",
  dos,
  donts,
}: {
  doTitle?: string;
  dontTitle?: string;
  dos: React.ReactNode[];
  donts: React.ReactNode[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <GuidanceCard tone="success" title={doTitle} items={dos} />
      <GuidanceCard tone="danger" title={dontTitle} items={donts} />
    </div>
  );
}

function GuidanceCard({ tone, title, items }: { tone: 'success' | 'danger'; title: string; items: React.ReactNode[] }) {
  const Icon = tone === 'success' ? Check : X;
  const accent = tone === 'success' ? 'var(--color-success)' : 'var(--color-error)';
  return (
    <Card className="flex flex-col overflow-hidden p-0">
      <div className="h-1" style={{ background: accent }} aria-hidden="true" />
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-2">
          <Badge tone={tone} variant="soft" leadingIcon={<Icon size={12} strokeWidth={3} aria-hidden="true" />}>
            {title}
          </Badge>
        </div>
        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2.5">
              <Icon size={16} strokeWidth={2.5} className="mt-[3px] shrink-0" style={{ color: accent }} aria-hidden="true" />
              <Text className="text-[var(--color-on-surface)]">{item}</Text>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

/* ── Notes ──────────────────────────────────────────────────────────────────── */

export function Note({
  tone = 'info',
  title,
  children,
}: {
  tone?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <Alert tone={tone} title={title}>
      {children}
    </Alert>
  );
}

/* ── Cards grid ─────────────────────────────────────────────────────────────── */

export function CardGrid({ children, min = 240 }: { children: React.ReactNode; min?: number }) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(${min}px, 100%), 1fr))` }}>
      {children}
    </div>
  );
}
