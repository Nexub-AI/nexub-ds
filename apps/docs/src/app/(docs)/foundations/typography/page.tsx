import type { Metadata } from 'next';
import { Card, Text } from '@nexub/react';
import { PageIntro, Prose, Section } from '@/components/kit';

export const dynamic = 'force-static';

export const metadata: Metadata = { title: 'Typography' };

// The 15 type roles (--type-<role>-*, Tailwind text-<role>). Display and
// headline use the brand face; the rest use Inter. Literal class names so
// Tailwind generates them.
const typeScale: { name: string; className: string }[] = [
  { name: 'display-lg', className: 'text-display-lg font-display' },
  { name: 'display-md', className: 'text-display-md font-display' },
  { name: 'display-sm', className: 'text-display-sm font-display' },
  { name: 'headline-lg', className: 'text-headline-lg font-display' },
  { name: 'headline-md', className: 'text-headline-md font-display' },
  { name: 'headline-sm', className: 'text-headline-sm font-display' },
  { name: 'title-lg', className: 'text-title-lg' },
  { name: 'title-md', className: 'text-title-md' },
  { name: 'title-sm', className: 'text-title-sm' },
  { name: 'body-lg', className: 'text-body-lg' },
  { name: 'body-md', className: 'text-body-md' },
  { name: 'body-sm', className: 'text-body-sm' },
  { name: 'label-lg', className: 'text-label-lg' },
  { name: 'label-md', className: 'text-label-md' },
  { name: 'label-sm', className: 'text-label-sm' },
];

const families = [
  { name: '--font-family-sans', sample: 'Inter: the interface typeface', className: 'font-sans' },
  { name: '--font-family-display', sample: 'Plus Jakarta Sans: display and headlines', className: 'font-display' },
  { name: '--font-family-mono', sample: 'Monospace: for code and data', className: 'font-mono' },
];

const weights = [
  { name: 'regular', value: 400, className: 'font-normal' },
  { name: 'medium', value: 500, className: 'font-medium' },
  { name: 'semibold', value: 600, className: 'font-semibold' },
  { name: 'bold', value: 700, className: 'font-bold' },
  { name: 'extrabold', value: 800, className: 'font-extrabold' },
];

export default function TypographyPage() {
  return (
    <div className="docs-prose">
      <PageIntro
        eyebrow="Foundations"
        title="Typography"
        lead={
          <>
            Nexub uses <strong>Inter</strong> for interface text and <strong>Plus Jakarta Sans</strong> for display and
            headline text (<code>--font-family-display</code>; headings use it by default). Both ship with{' '}
            <code>@nexub/themes</code>: importing <code>@nexub/themes/base</code> self-hosts the variable fonts (Inter with
            its optical-size axis; both normal and italic), so every app gets them with no extra setup. Code uses the
            monospace stack in <code>--font-family-mono</code>. On React Native, <code>nexubFonts</code> loads the same
            families as static weights.
          </>
        }
      />

      <Section id="type-roles" title="Type roles">
        <Prose>
          Use roles, not sizes: <code>className=&quot;text-title-md&quot;</code> sets size, line height, tracking and
          weight together. Headings (<code>h1</code>–<code>h6</code>) default to the display face with{' '}
          <code>text-wrap: balance</code>; numbers in data use <code>tabular-nums</code>.
        </Prose>
        <div className="flex flex-col">
          {typeScale.map((t) => (
            <div
              key={t.name}
              className="grid grid-cols-[96px_1fr] items-center gap-4 border-b border-[var(--color-outline-variant)] py-3 md:grid-cols-[120px_1fr_160px]"
            >
              <code className="font-mono text-label-sm text-[var(--color-primary)]">{t.name}</code>
              <span className={'truncate text-[var(--color-on-surface)] ' + t.className}>The quick brown fox</span>
              <span className="hidden font-mono text-label-sm text-[var(--color-on-surface-muted)] md:block">text-{t.name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="font-families" title="Font families">
        <div className="flex flex-col gap-3">
          {families.map((f) => (
            <Card key={f.name} className="flex flex-col gap-1.5 p-4">
              <code className="font-mono text-label-sm text-[var(--color-on-surface-muted)]">{f.name}</code>
              <span className={'text-title-lg text-[var(--color-on-surface)] ' + f.className}>{f.sample}</span>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="font-weights" title="Font weights">
        <div className="flex flex-col gap-2">
          {weights.map((w) => (
            <div key={w.name} className="flex items-center gap-4">
              <code className="w-[160px] shrink-0 font-mono text-label-sm text-[var(--color-on-surface-muted)]">
                --font-weight-{w.name}
              </code>
              <Text className={'text-[var(--color-on-surface)] ' + w.className}>
                {w.value}: {w.name.charAt(0).toUpperCase() + w.name.slice(1)}
              </Text>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
