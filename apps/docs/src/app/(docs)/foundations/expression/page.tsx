import type { Metadata } from 'next';
import { Aurora, Badge, Button, Card, Checkbox, Input, Progress, Switch } from '@nexub/react';
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
