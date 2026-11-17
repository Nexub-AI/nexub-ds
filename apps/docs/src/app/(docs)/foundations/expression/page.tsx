import type { Metadata } from 'next';
import { Aurora, Avatar, Badge, Button, Card, Checkbox, IconChip, Input, Progress, Switch } from '@nexub/react';
import { Wallet } from '@nexub/icons';
import { AppSample } from '@/components/docs/ExpressionAppSample';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { List, PageIntro, Prose, Section } from '@/components/kit';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Expression: Calm and Vivid',
  description: 'Vivid is an opt-in expressive layer: accent gradients, a soft glow, tinted depth and an aurora, all from your colour roles.',
};

function Sample({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="m-0 text-label-md text-[var(--color-on-surface-variant)]">{label}</p>
      <div className="flex flex-wrap gap-2">
        <Button>Save changes</Button>
        <Button variant="tonal">Preview</Button>
        <Button variant="outlined">Cancel</Button>
      </div>
      <Card variant="interactive" className="p-4">
        <p className="m-0 text-title-sm">Monthly revenue</p>
        <p className="m-0 text-body-sm text-[var(--color-on-surface-variant)]">$68,420 · up 11%</p>
      </Card>
      <Input aria-label={`Workspace name (${label})`} placeholder="Workspace name" />
      <div className="flex items-center gap-4">
        <Switch aria-label={`Notifications (${label})`} defaultChecked />
        <Checkbox aria-label={`Remember me (${label})`} defaultChecked />
        <Badge>New</Badge>
      </div>
      <Progress value={64} aria-label={`Setup progress (${label})`} />
    </div>
  );
}

export default function ExpressionPage() {
  return (
    <div className="docs-prose">
      <PageIntro
        eyebrow="Foundations"
        title="Expression: Calm and Vivid"
        lead={
          <>
            Calm is the default: tonal surfaces and one accent, made for long working sessions. Vivid is an opt-in
            expressive layer for moments that should feel alive: onboarding, dashboards, consumer screens. It adds an accent
            gradient, a soft glow, depth tinted with your brand and an aurora, all derived from your colour roles, so it
            follows dark mode, contrast levels, product brands and seeded themes.
          </>
        }
      />

      <Section id="compare" title="Side by side">
        <div className="not-prose grid gap-4 md:grid-cols-2">
          <div className="rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-5">
            <Sample label="Calm" />
          </div>
          <div data-expression="vivid" className="rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-5">
            <Sample label="Vivid" />
          </div>
        </div>
        <Prose>Hover the buttons and the card in the Vivid column: the gradient brightens, the glow grows and the card picks up an accent edge.</Prose>
      </Section>

      <Section id="app" title="In an app">
        <Prose>
          Since 10.3 Vivid also reaches the surfaces people look at most in an app. The page title is heavier and its{' '}
          <code>wash</code> panel carries the accent. The active navigation item is tinted and marked by a bar that slides
          between items. Stat cards lift on hover, bars fade toward the baseline, and rows share one hover tint. Tables and
          forms get nothing else: they stay calm.
        </Prose>
        <div className="not-prose grid gap-4 lg:grid-cols-2">
          <AppSample label="Calm" />
          <div data-expression="vivid">
            <AppSample label="Vivid" />
          </div>
        </div>
        <Prose>
          The filled main button is the gradient one, so keep it to one per screen and make the other actions{' '}
          <code>tonal</code>. A tonal button takes a tone for a soft, coloured action:{' '}
          <code>{'<Button variant="tonal" tone="success">'}</code>.
        </Prose>
      </Section>

      <Section id="category" title="Category colours">
        <Prose>
          Eight named colours for things that need telling apart but carry no status: projects, teams, spending
          categories. Each follows a chart series, so a category keeps its colour between a chip and a chart, and every pair
          is checked for 4.5:1 in light and dark. Use them through the <code>category</code> prop of{' '}
          <code>IconChip</code>, <code>Badge</code>, <code>Avatar</code> and <code>StatCard</code>. Status still uses{' '}
          <code>tone</code>.
        </Prose>
        <div className="not-prose flex flex-wrap items-center gap-3">
          {(['blue', 'amber', 'emerald', 'pink', 'violet', 'cyan', 'red', 'lime'] as const).map((c) => (
            <span key={c} className="flex items-center gap-2">
              <IconChip category={c} size="sm">
                <Wallet />
              </IconChip>
              <Badge category={c} variant="soft">
                {c}
              </Badge>
            </span>
          ))}
          <Avatar name="Ada Lovelace" category="auto" />
          <Avatar name="Grace Hopper" category="auto" />
        </div>
        <Prose>
          <code>{'<Avatar category="auto">'}</code> picks a stable colour from the name, so a list of people is easier to
          scan.
        </Prose>
      </Section>

      <Section id="product-accent" title="The product accent">
        <Prose>
          Every Nexub app looks like Nexub. An app is recognised by its icon and name, plus one accent colour in a few fixed
          places. Set <code>data-product</code> (or <code>data-division</code>) once, with{' '}
          <code>@nexub/themes/products</code> loaded, and these places follow it. Everything else stays on the shared
          primary.
        </Prose>
        <List
          items={[
            'The product icon chip: `<IconChip category="accent">`, and the same on Badge and Avatar.',
            'The active navigation item in Sidebar and NavigationRail, with its marker.',
            'The page header wash and the welcome banner.',
            'Illustrations (from 10.5).',
            'Not buttons, links, form controls or charts. Chart colours are tuned to stay apart for colour-blind readers, so a chart keeps its palette in every app.',
          ]}
        />
        <CodeBlock lang="html" code={`<html data-product="payub">   <!-- the whole app -->`} />
        <Prose>Or scope one part of a shared shell:</Prose>
        <CodeBlock lang="tsx" code={`<>
  <AppHeader accent="payub" />
  <Sidebar.Root accent="payub">{items}</Sidebar.Root>
  <AppLauncher apps={[{ id: 'pay', name: 'Payub', href: '/pay', accent: 'payub' }]} />
</>`} />
        <Prose>
          <code>ThemeProvider</code> now accepts every app key in the product map, not only the first four. The four
          hand-written files (<code>@nexub/themes/leap</code>, <code>/bookub</code>, <code>/payub</code>,{' '}
          <code>/founderub</code>) were removed in 11.0: <code>@nexub/themes/products</code> covers the same keys.
        </Prose>
      </Section>

      <Section id="aurora" title="Aurora">
        <div data-expression="vivid" className="not-prose relative isolate flex flex-col items-center gap-3 overflow-hidden rounded-shape-container px-6 py-16 text-center">
          <Aurora />
          <p className="m-0 text-headline-md text-[var(--color-on-surface)]">Welcome back, Sam</p>
          <p className="m-0 text-body-md text-[var(--color-on-surface)]">Three invoices were paid while you were away.</p>
          <Button>See activity</Button>
        </div>
      </Section>

      <Section id="shape" title="Shape and glass">
        <Prose>
          Add <code>data-shape=&quot;squircle&quot;</code> to an area for continuous, Apple-style corners where the browser supports
          CSS <code>corner-shape</code>. Under Vivid, glass surfaces get a specular edge that catches light like a lens; elsewhere
          add the <code>nx-glass-edge</code> class.
        </Prose>
      </Section>

      <Section id="setup" title="Turn it on">
        <Prose>
          Since 5.0, Vivid is the default: <code>ThemeProvider</code> sets <code>data-expression=&quot;vivid&quot;</code> on{' '}
          <code>&lt;html&gt;</code> when the app has not set one. Import the stylesheet after your theme files, and set the
          attribute in your server HTML too so the first paint is already Vivid.
        </Prose>
        <CodeBlock lang="css" code={`@import "@nexub/themes/vivid";   /* after your theme files */`} />
        <CodeBlock lang="html" code={`<html data-expression="vivid">   <!-- the default from 5.0 -->
<html data-expression="calm">    <!-- keep the Calm look -->`} />
        <Prose>
          Or pass <code>defaultExpression=&quot;calm&quot;</code> to <code>ThemeProvider</code>. Without ThemeProvider, set the
          attribute yourself; a <code>&lt;section data-expression=&quot;vivid&quot;&gt;</code> still opts in one area of a Calm app.
        </Prose>
      </Section>

      <Section id="rules" title="Rules">
        <List
          items={[
            'Colour and motion go on landmarks and moments: the page header, navigation, key figures, a success. Working surfaces (tables, forms) stay calm.',
            'One expressive moment per screen. Use Vivid where emotion helps (a first value, a success, a hero), not on dense tables or forms people fill in all day.',
            'Every colour comes from a role, so contrast holds: gradients run between two roles of the same tone, and on-primary text keeps 4.5:1.',
            'Text over an Aurora uses on-surface, not on-surface-variant: the colour fields lower the contrast of secondary text.',
            'High contrast turns gradients into flat fills and removes the glow. Reduced motion stops the aurora drifting.',
            'It changes how components look, never what they do or how they read to assistive tech.',
          ]}
        />
      </Section>
    </div>
  );
}
