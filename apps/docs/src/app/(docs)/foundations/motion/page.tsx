import type { Metadata } from 'next';
import { Button } from '@nexub/react';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DocTable, Guidance, PageIntro, Prose, Section } from '@/components/kit';
import { PhoneFrame } from '@/components/platform/PhoneFrame';
import { MotionGallery, SpringCurves, WebDemos } from './MotionGallery';
import { readSprings } from './springs';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Motion & interaction',
  description: 'Spring motion on web and mobile: tokens, a live gallery, state layers, press feedback, page transitions and reduced motion.',
};

const springs = readSprings();
const ms = (family: string, speed: string) => Math.round(springs.find((s) => s.family === family && s.speed === speed)?.durationMs ?? 0);

export default function MotionPage() {
  return (
    <div className="docs-prose">
      <PageIntro
        eyebrow="Foundations"
        title="Motion & interaction"
        lead={
          <>
            Motion is <strong>springs, not durations</strong> (Apple’s fluid interfaces, Material 3’s motion scheme). The same
            nine springs drive the web (CSS <code>linear()</code> easings) and React Native (Reanimated), so a sheet or a toast
            moves the same on every platform. Transitions stay interruptible: a new target retargets from where the element is.
          </>
        }
      />

      <MotionGallery springs={springs}>
        <Section id="springs" title="Springs" className="!mt-0" description="Three families, three speeds. Curves are drawn from the shipped tokens; press a track to run one.">
          <SpringCurves springs={springs} />
          <DocTable
            caption="Spring families"
            head={['Family', 'Use', 'Fast / default / slow']}
            mono={[2]}
            rows={[
              [<code key="s">spatial</code>, 'Position and size: panels, sheets, indicators. Damping 0.9, a hair of settle.', `${ms('spatial', 'fast')} / ${ms('spatial', 'default')} / ${ms('spatial', 'slow')} ms`],
              [<code key="e">effects</code>, 'Opacity and colour. Critically damped: never overshoots.', `${ms('effects', 'fast')} / ${ms('effects', 'default')} / ${ms('effects', 'slow')} ms`],
              [<code key="x">expressive</code>, 'Key moments only: toggles, success, drag release. Damping 0.7–0.8.', `${ms('expressive', 'fast')} / ${ms('expressive', 'default')} / ${ms('expressive', 'slow')} ms`],
            ]}
          />
          <CodeBlock
            lang="css"
            code={`transition: transform var(--motion-spring-spatial-default-duration)
                      var(--motion-spring-spatial-default-easing);
/* Tailwind: duration-spatial-default ease-spatial-default */`}
          />
        </Section>

        <Section id="gallery" title="Gallery: web" description="Every motion in @nexub/react, live. Replay, slow it down, or preview the reduced-motion fallback with the bar above.">
          <WebDemos />
        </Section>
      </MotionGallery>

      <Section id="mobile" title="On iOS & Android" description="@nexub/react-native uses the same springs through Reanimated. Toasts, banners, list rows, chips, the segmented control, sheets and press feedback already move; use the presets for your own views.">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex min-w-0 flex-col gap-4">
            <CodeBlock
              lang="tsx"
              code={`import Animated, { withSpring } from 'react-native-reanimated';
import { nxEnter, nxExit, nxLayout, nxSpring } from '@nexub/react-native';

// Enter and exit on the effects + spatial springs; off under Reduce Motion.
<Animated.View entering={nxEnter('up')} exiting={nxExit('down')} layout={nxLayout()} />

// Lists: rows glide into place when others are added or removed.
<Animated.FlatList itemLayoutAnimation={nxLayout()} … />

// Your own value, on a token spring.
offset.value = withSpring(target, nxSpring('spatial', 'fast'));

// Money: the new figure rises in when the value changes.
<Amount value={balance} currency="SGD" size="display" animate />`}
            />
            <DocTable
              caption="Native motion presets"
              head={['Preset', 'Kinds', 'Use']}
              mono={[0, 1]}
              rows={[
                ['nxEnter(kind, speed)', "'fade' | 'up' | 'down' | 'scale'", 'Views appearing: toasts, banners, new rows.'],
                ['nxExit(kind, speed, rtl)', "'fade' | 'up' | 'down' | 'scale' | 'start' | 'end'", 'Views leaving; exits are faster and never overshoot.'],
                ['nxLayout(speed)', '—', 'Siblings gliding into place after a change.'],
                ['nxSpring(family, speed)', 'spatial | effects | expressive', 'withSpring on your own shared values.'],
              ]}
            />
          </div>
          <div className="flex justify-center">
            <PhoneFrame path="preview/toast" title="Toast motion" height={560} />
          </div>
        </div>
      </Section>

      <Section id="state-layers" title="State layers">
        <Prose>
          Hover, focus and press are an overlay of the control’s own text colour at a fixed opacity, so they read correctly on
          any fill, theme, brand or glass: <code>--state-hover</code> 0.08, <code>--state-focus</code> 0.10,{' '}
          <code>--state-pressed</code> 0.12, <code>--state-dragged</code> 0.16. Add <code>nx-state-layer</code> to any custom
          control. Pressables also scale to 0.97 on a fast spring (<code>nx-press</code>). There is no ripple. On mobile the
          pressed layer and the press spring come with a semantic haptic instead of hover.
        </Prose>
        <div className="flex flex-wrap gap-3">
          <Button variant="filled">Filled</Button>
          <Button variant="tonal">Tonal</Button>
          <Button variant="outlined">Outlined</Button>
          <Button variant="text">Text</Button>
          <Button variant="filled" disabled>
            Disabled
          </Button>
        </div>
      </Section>

      <Section id="enter-exit" title="Enter and exit">
        <Prose>
          Overlays, menus, tooltips and toasts share one set of keyframes. Add <code>nx-motion</code> and the element fades in
          on the effects spring while it moves and scales in on the spatial spring. It runs on Radix’s <code>data-state</code>{' '}
          (<code>open</code> / <code>closed</code>), or on <code>data-motion=&quot;from-…&quot;</code> /{' '}
          <code>&quot;to-…&quot;</code> for anything else. Exits are faster and never overshoot. <code>nx-pop</code> scales
          floating layers from 0.96 with a 4px nudge away from the side they open on; <code>nx-dialog</code> scales from 0.96
          and rises 8px; <code>nx-drawer</code> slides from its edge.
        </Prose>
        <CodeBlock lang="tsx" code={`<div className="nx-motion nx-pop" data-state={open ? 'open' : 'closed'} data-side="bottom">…</div>`} />
      </Section>

      <Section id="lists" title="Lists, stagger and loading">
        <Prose>
          <code>ListTransition</code> grows new items in and collapses removed ones in place (space items with padding, not{' '}
          <code>gap</code>). <code>nx-stagger</code> brings children in 40ms apart; re-key the parent to replay.{' '}
          <code>SkeletonSwap</code> crossfades a skeleton into the content, so loaded data never pops.
        </Prose>
        <CodeBlock
          lang="tsx"
          code={`<ListTransition as="ul" itemAs="li">{items.map((i) => <Row key={i.id} />)}</ListTransition>

<div className="nx-stagger" key={run}>…</div>

<SkeletonSwap loading={isLoading} skeleton={<Skeleton shape="rect" height={120} />}>{content}</SkeletonSwap>`}
        />
      </Section>

      <Section id="cards" title="Cards">
        <Prose>
          <code>Card variant=&quot;interactive&quot;</code> lifts 2px on hover on the spatial spring and moves from elevation 1
          to 2; leaving settles faster on the effects spring. Press sinks it to 0.99. The lift only applies where a real pointer
          hovers, so touch never gets stuck in the hover state. <code>effect=&quot;sheen&quot;</code> is opt-in: a soft light
          follows the pointer. Keep it to one or two hero cards per page.
        </Prose>
      </Section>

      <Section id="page-transitions" title="Page transitions">
        <Prose>
          Opt in with one import. The old page fades out fast; the new one fades in and rises 8px on the spatial spring.
          Single-page apps wrap the route update in <code>startViewTransition</code>; where the browser has no View Transitions
          API it just runs. On mobile the native stack does the push and the back gesture.
        </Prose>
        <CodeBlock
          lang="tsx"
          code={`import '@nexub/themes/view-transitions'; // after the base theme
import { startViewTransition } from '@nexub/react';

startViewTransition(() => navigate('/settings'));`}
        />
      </Section>

      <Section id="scroll" title="Scroll">
        <Prose>
          <code>AppHeader condense</code> shrinks the header from 64 to 52px and lifts it onto elevation 1 over the first 64px of
          page scroll, with a CSS scroll timeline and no JavaScript. On iOS the native large title does the same.
        </Prose>
      </Section>

      <Section id="focus" title="Focus and touch targets">
        <Prose>
          One focus ring for everything: a 3px <code>outline</code> in <code>--color-ring-default</code>, offset 2px, following{' '}
          <code>border-radius</code> and using <code>Highlight</code> in forced-colours mode. On coarse pointers small controls
          get an invisible 44×44px hit area (<code>nx-hit</code>) without changing their size; native controls always reach 44pt.
        </Prose>
      </Section>

      <Section id="reduced-motion" title="Reduced motion">
        <Guidance
          doTitle="Under Reduce Motion"
          dontTitle="Never"
          dos={[
            'Transitions and animations become instant changes.',
            'Overlays, revealed content and list items keep a short crossfade with no travel or scale, so nothing pops in.',
            'Native presets, the press spring and sheets follow the OS setting automatically.',
          ]}
          donts={[
            'Rely on motion alone to convey meaning.',
            'Animate backdrop-filter, or use transition-all.',
            'Loop motion on content people read (shimmer and morph are for loading only).',
          ]}
        />
      </Section>
    </div>
  );
}
