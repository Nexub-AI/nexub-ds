import type { Metadata } from 'next';
import { DocTable, PageIntro } from '@/components/kit';
import { CodeBlock } from '@/components/docs/CodeBlock';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Migrating to 4.0',
  description: 'What 4.0 removes (the Tailwind 3 preset, Expo SDK 57 support) and how to move off it while still on 3.9.',
};

export default function MigratingTo4Page() {
  return (
    <div className="docs-prose">
      <PageIntro eyebrow="Getting Started" title="Migrating to 4.0" />
      <p>
        4.0 removes only what 3.9 deprecates, and nothing else changes. 3.9 is the release candidate: it warns about
        everything 4.0 removes. Update to 3.9, clear the warnings and the codemod report, and 4.0 is a version bump. No
        component API changes in 4.0.
      </p>

      <h2>What 4.0 removes</h2>
      <DocTable
        head={['Removed', 'Use instead', 'How you find it']}
        rows={[
          [
            <>The Tailwind 3 preset, <code>@nexub/tokens/tailwind</code></>,
            <>Tailwind 4 with <code>@import &quot;@nexub/tokens/tailwind.css&quot;</code></>,
            <>A one-time console warning when the preset loads; <code>nexub-migrate</code> rule <code>tailwind-3-preset</code></>,
          ],
          [
            <>Expo SDK 57 for <code>@nexub/react-native</code></>,
            'Expo SDK 58 or later (React Native 0.86+ stays the minimum)',
            'The peer dependency ranges move to >=58 in 4.0; your package manager reports it',
          ],
        ]}
      />

      <h2>1. Update to 3.9 and run the codemod</h2>
      <CodeBlock lang="bash" code={`npx -p @nexub/tokens nexub-migrate .                    # dry run: report everything
npx -p @nexub/tokens nexub-migrate . --rules tailwind-3-preset
npx -p @nexub/tokens nexub-migrate . --check            # CI: exit 1 if anything is left`} />

      <h2>2. Move to Tailwind 4</h2>
      <p>
        Remove <code>@nexub/tokens/tailwind</code> from <code>presets</code> in <code>tailwind.config.js</code> and
        import the theme from your CSS instead. The utilities keep their names.
      </p>
      <CodeBlock lang="css" code={`@import "tailwindcss";
@import "@nexub/tokens/tailwind.css";
@import "@nexub/themes/base";
@import "@nexub/themes/light";
@import "@nexub/themes/dark";`} />
      <p>
        Not using Tailwind at all? Import <code>@nexub/react/styles.css</code> and nothing in this step applies.
      </p>

      <h2>3. Expo SDK 58</h2>
      <p>
        Upgrade with <code>npx expo install expo@^58.0.0 --fix</code>. The <code>expo-glass-effect</code>,{' '}
        <code>expo-haptics</code> and <code>expo-screen-capture</code> peers follow the SDK version.
      </p>

      <h2>Release policy</h2>
      <p>
        From 3.9 to 4.0 the API is frozen: 3.9 adds no features, only the deprecations above and fixes. The same
        rolling-minor numbering continues after 4.0 (4.1, 4.2 …), and removals only ever happen in a major, after at
        least one minor of warnings.
      </p>
    </div>
  );
}
