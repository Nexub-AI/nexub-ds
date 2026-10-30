import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@nexub/react';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { CardGrid, DocTable, Guidance, Note, PageIntro, Prose, Section } from '@/components/kit';
import { componentEntries } from '@/registry/index';
import { mobileOnly, nativeTwins } from '@/registry/native';
import { PhoneFrame } from '@/components/platform/PhoneFrame';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'React Native',
  description: '@nexub/react-native for Expo and React Native apps: setup, the web-to-native map, rules.',
};

const titleOf = (slug: string) => componentEntries.find((e) => e.meta.slug === slug)?.meta.title ?? slug;

export default function ReactNativePage() {
  return (
    <div className="docs-prose">
      <PageIntro
        eyebrow="Getting started"
        title="React Native"
        badges={<Badge tone="warning" variant="soft">alpha</Badge>}
        lead={
          <>
            <code>@nexub/react-native</code> brings Nexub to iOS and Android apps built with Expo or bare React Native. Same
            tokens, product brands and prop names as <code>@nexub/react</code>, so one design change ships to web and mobile.
          </>
        }
      />

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex min-w-0 flex-col">
          <Section id="native-chrome" title="Native chrome, Nexub content" className="!mt-0">
            <Prose>
              The operating system draws the navigation: tab bar, stack header and back gesture, action sheets, date pickers
              and iOS 26 Liquid Glass. Nexub colours it, so apps feel native on each platform. Everything people read and tap
              inside a screen (lists, cards, buttons, inputs, money) is drawn by Nexub and looks the same on iOS, Android and
              the web.
            </Prose>
          </Section>

          <Section id="install" title="Install">
            <CodeBlock lang="bash" code="npx expo install @nexub/react-native react-native-reanimated react-native-worklets react-native-svg react-native-safe-area-context expo-font" />
            <Prose>
              Optional: <code>expo-haptics</code> (haptics), <code>expo-glass-effect</code> (Liquid Glass on iOS 26+),{' '}
              <code>expo-screen-capture</code> (<code>PrivacyShield</code>) and{' '}
              <code>@react-native-community/datetimepicker</code> (<code>DateTimeField</code>). Supported: Expo SDK 57+ /
              React Native 0.86+.
            </Prose>
          </Section>
        </div>
        <div className="flex justify-center">
          <PhoneFrame path="preview/home" title="Payub home" height={600} />
        </div>
      </div>

      <Section id="set-up" title="Set up">
      <CodeBlock
        lang="tsx"
        code={`import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { NexubNativeProvider, ToastProvider, nexubFonts, useNexubNavigation } from '@nexub/react-native';

function Screens() {
  const nav = useNexubNavigation();
  return <Stack screenOptions={nav.stack} />;
}

export default function RootLayout() {
  const [ready] = useFonts(nexubFonts);
  if (!ready) return null;
  return (
    <NexubNativeProvider product="payub">
      <ToastProvider>
        <Screens />
      </ToastProvider>
    </NexubNativeProvider>
  );
}`}
      />
        <Prose>
          <code>product</code> picks the brand (Leap, Bookub, Payub, Founderub); <code>seed</code> white-labels any other.
          Light/dark, contrast, Reduce Motion and Reduce Transparency follow the OS unless you set them.
        </Prose>
      </Section>

      <Section
        id="web-to-native"
        title="Web → native"
        description="Every web component with a native twin. Open one to see both platforms side by side and how they differ."
      >
        <DocTable
          caption="Web components and their React Native twins"
          head={['@nexub/react', '@nexub/react-native', 'Differences']}
          rows={Object.entries(nativeTwins).map(([slug, t]) => [
            <Link key="w" href={`/components/${slug}#mobile`} className="font-medium text-[var(--color-primary)] no-underline hover:underline">
              {titleOf(slug)}
            </Link>,
            <code key="n" className="font-mono text-body-sm">{t.name}</code>,
            t.differences.length ? `${t.differences.length} (${t.differences.map((d) => d.aspect.toLowerCase()).join(', ')})` : 'None',
          ])}
        />
      </Section>

      <Section id="mobile-only" title="Mobile only" description="Components that only make sense on a phone.">
        <CardGrid min={220}>
          {mobileOnly.map((m) => (
            <Link
              key={m.slug}
              href={`/components/native/${m.slug}`}
              className="nx-state-layer flex flex-col gap-1 rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] p-4 no-underline"
            >
              <span className="text-title-sm text-[var(--color-on-surface)]">{m.title}</span>
              <span className="text-body-sm text-[var(--color-on-surface-variant)]">{m.description}</span>
            </Link>
          ))}
        </CardGrid>
        <Note title="Screens">
          Full screens (sign-in, activity, transaction detail, settings, chat, paywall and more) live in{' '}
          <code>@nexub/react-native/patterns</code>. Each one is on the matching <Link href="/patterns">pattern page</Link> next to its
          web version.
        </Note>
      </Section>

      <Section id="rules" title="Rules the components follow">
        <Guidance
          doTitle="Built in"
          dontTitle="Avoid"
          dos={[
            <>Every control reaches a 44pt touch target; primary actions use <code>size=&quot;lg&quot;</code>.</>,
            'Text scales with the system size; on iOS each role follows its Dynamic Type curve.',
            'A list row is one screen-reader element; swipe and long-press actions are also accessibility actions.',
            <>Money screens hide balances with <code>SensitiveValue</code>, cover the app switcher with <code>PrivacyShield</code> and enter codes with <code>OTPInput</code> (SMS autofill).</>,
          ]}
          donts={[
            'Haptics on plain taps, or as the only feedback.',
            'Glass on content: it is for the control layer only, and turns solid when the user reduces transparency.',
            'Web patterns on phones: no hover, no split buttons, no popover menus; use sheets and long-press.',
            'Dialogs for forms: use a BottomSheet or a screen.',
          ]}
        />
      </Section>
    </div>
  );
}
