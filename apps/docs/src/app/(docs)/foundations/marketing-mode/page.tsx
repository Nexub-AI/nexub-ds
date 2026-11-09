import type { Metadata } from 'next';
import Link from 'next/link';
import { DocTable, List, PageIntro, Prose, Section } from '@/components/kit';
import { CodeBlock } from '@/components/docs/CodeBlock';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Marketing mode',
  description: 'The look of nexub.com on the same tokens and components as the apps: opt-in, under data-mode="marketing".',
};

export default function MarketingModePage() {
  return (
    <div className="docs-prose">
      <PageIntro
        eyebrow="Foundations"
        title="Marketing mode"
        lead={
          <>
            Marketing pages need more energy than an app: a gradient hero, a glowing main button, cards that lift, numbers
            that count up. Marketing mode adds that on the same tokens and components, the way Material serves both
            Google’s apps and its marketing pages. It is opt-in: everything applies only under{' '}
            <code>data-mode=&quot;marketing&quot;</code>, so an app that never sets it looks exactly as before.
          </>
        }
      />

      <Section id="setup" title="Turn it on">
        <CodeBlock lang="css" code={`/* CSS, after your theme files */
@import "@nexub/themes/marketing";

<html data-mode="marketing">   // or any wrapper`} />
        <Prose>
          The sections live in <code>@nexub/marketing</code>; see the{' '}
          <Link href="/examples/marketing">marketing page example</Link> and{' '}
          <Link href="/getting-started/nextjs">Next.js and server components</Link>.
        </Prose>
      </Section>

      <Section id="what-changes" title="What changes">
        <DocTable
          head={['Piece', 'In marketing mode', 'Elsewhere']}
          rows={[
            [<code key="b">Button variant=&quot;hero&quot;</code>, 'Primary gradient (tones 45 → 40), glow, 2px spring lift', 'A filled button'],
            [<code key="c">Card variant=&quot;showcase&quot;</code>, '24px corners, soft shadow, 6px lift; accent adds a product top edge and tint', 'A flat card'],
            [<code key="e">EyebrowChip variant=&quot;gradient&quot;</code>, 'Primary-tinted gradient; the live dot pings', 'A soft chip; still dot'],
            ['Headings', 'display roles 800, headline roles 700; new display-xl (64/68)', 'Unchanged'],
            ['Motion', 'Reveal, Float, Marquee, rise and count-up', 'Still'],
            [<code key="ct">CTABand</code>, 'The hero gradient', 'Primary band'],
          ]}
        />
        <Prose>
          Values come from the <code>marketing</code> token group in <code>@nexub/tokens</code> (<code>--marketing-*</code>),
          built from palette tones and roles, so dark mode, <code>data-contrast</code> and <code>data-product</code> keep
          working. Use <code>container-marketing</code> (1280px) for page width; apps keep <code>container-nexub</code>{' '}
          (1440px).
        </Prose>
      </Section>

      <Section id="guidelines" title="Guidelines">
        <List
          items={[
            <>
              <strong>Gradients in three places only</strong>: the hero backdrop, the main button and the CTA band.
            </>,
            <>
              <strong>At most one glowing button per screen.</strong> Pair it with an outlined button, never a second hero.
            </>,
            <>
              <strong>Product accents only for product content</strong>: a Payub testimonial, the Bookub card. Not for
              decoration, and never two accents on one card.
            </>,
            <>
              <strong>A motion budget</strong>: one entrance per section (rise or Reveal), at most two floating elements in
              view, one marquee per page plus the footer’s. Loops pause on hover and focus, and everything stops under
              reduced motion.
            </>,
            <>
              <strong>The page keeps one h1</strong>: the Hero’s title. Sections use h2.
            </>,
          ]}
        />
      </Section>

      <Section id="accessibility" title="Accessibility">
        <List
          items={[
            'White on the hero gradient is at least 5.35:1 (tone 45) and 6.45:1 (tone 40); a token test checks it. Tone 50 failed at 4.48:1 and is not used.',
            'Coloured stat numbers use the accent roles, AA on the page surfaces in light, dark and high contrast.',
            'The focus ring is an outline outside the button, so it stays visible over the gradient.',
            'Count-up and Reveal never hide content in the server HTML: they only act on content below the fold once JavaScript runs. Screen readers always get the real number.',
            'Marquee pauses on hover and focus; its repeated copy is aria-hidden and inert.',
          ]}
        />
      </Section>
    </div>
  );
}
