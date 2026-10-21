import type { Metadata } from 'next';
import { CodeBlock } from '@/components/docs/CodeBlock';

export const dynamic = 'force-static';

export const metadata: Metadata = { title: 'Upgrading to 1.8' };

// Before → after for markup and behaviour an app's tests or selectors can see.
// Sources: packages/*/CHANGELOG.md (1.6.0, 1.7.0).
const changes: { what: string; before: string; after: string; todo: string }[] = [
  {
    what: 'ToggleGroup, SegmentedControl',
    before: 'role="group", items with aria-pressed',
    after: 'single-select: role="radiogroup", items role="radio" + aria-checked; multi-select: role="toolbar"',
    todo: "Query getByRole('radiogroup') / getByRole('radio', { name }) and assert aria-checked.",
  },
  {
    what: 'Button loading (and status="loading")',
    before: 'native disabled; focus lost',
    after: 'aria-disabled="true"; focus stays, clicks are blocked, the change is announced; width holds',
    todo: 'Assert toHaveAttribute(\'aria-disabled\', \'true\') instead of toBeDisabled(). Don’t rely on focus moving away.',
  },
  {
    what: 'FileUpload dropzone',
    before: 'div role="button" with nested buttons',
    after: 'a native <label> wrapping the file input; one control named by its visible text',
    todo: 'Query getByLabelText(…) (the visible text), not getByRole(\'button\'). userEvent.upload on that input.',
  },
  {
    what: 'ActivityFeed',
    before: 'role="feed"',
    after: 'a plain list (ul / li)',
    todo: "Query getByRole('list') / getAllByRole('listitem').",
  },
  {
    what: 'Avatar without name',
    before: 'role="img" with no name',
    after: 'aria-hidden (decorative)',
    todo: 'Pass name when the avatar carries meaning; otherwise stop querying it by role.',
  },
  {
    what: 'Heading, Label, HelperText tone',
    before: 'inline style="color: …"',
    after: 'a colour class (no style attribute)',
    todo: 'Snapshot / toHaveStyle checks on colour change; assert the class or computed colour.',
  },
  {
    what: 'Stack, Flex, Grid',
    before: 'inline style for gap, align, justify, cols, rows',
    after: 'Tailwind classes for on-scale values; off-scale values still use inline style',
    todo: 'Update snapshots. Use scale values (gap={4}) to keep server HTML style-free.',
  },
  {
    what: 'Brand tones (leap, bookub, payub, founderub)',
    before: 'fell back to the default text colour',
    after: 'tint the text in Heading, Label, HelperText and EyebrowChip',
    todo: 'Check contrast where you used a brand tone and expected neutral text.',
  },
  {
    what: 'Toaster',
    before: 'every toast listed',
    after: 'newest on top, older ones stacked behind; fan out on hover/focus; closed toasts leave the store',
    todo: 'Pass expand to keep them fanned out; visibleToasts sets how many render (default 3). Tests that count toasts: count open ones.',
  },
  {
    what: 'tailwindcss-animate',
    before: 'components used animate-in / fade-in classes',
    after: 'components animate with nx-motion (themes/base.css)',
    todo: 'Nothing for components. The preset still registers the plugin for your own classes; prefer nx-motion.',
  },
];

const aliases: [legacy: string, role: string][] = [
  ['--color-bg-default / -subtle / -muted', '--color-surface / -surface-container-low / -surface-container-high'],
  ['--color-bg-raised, --color-surface-raised', '--color-surface-elevated'],
  ['--color-text-primary / -secondary / -muted', '--color-on-surface / -on-surface-variant / -on-surface-muted'],
  ['--color-text-link', '--color-primary'],
  ['--color-border-default / -strong / -input', '--color-outline-variant / -outline / -outline'],
  ['--color-semantic-{tone}-default', '--color-{tone}'],
  ['--color-semantic-{tone}-bg / -strong', '--color-{tone}-container / -on-{tone}-container'],
  ['--color-bg-inverse / --color-text-inverse', '--color-inverse-surface / -inverse-on-surface'],
];

export default function UpgradingPage() {
  return (
    <div className="docs-prose">
      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
        Getting Started
      </p>
      <h1>Upgrading to 1.8</h1>
      <p>
        For apps on <code>@nexub/*</code> 1.5.x. Nothing was removed and no prop was renamed, but 1.6 and 1.7
        changed some markup and roles that tests and selectors see, and added conventions worth adopting.
      </p>

      <h2>1. Update</h2>
      <p>All <code>@nexub/*</code> packages share one version; update them together.</p>
      <CodeBlock lang="bash" code={`pnpm add @nexub/react@^1.8 @nexub/patterns@^1.8 @nexub/themes@^1.8 @nexub/tokens@^1.8 @nexub/icons@^1.8`} />
      <p>
        Peer dependencies are unchanged: <code>react</code> and <code>react-dom</code> 18 or 19, and{' '}
        <code>@nexub/tokens</code>. Keep the Tailwind preset and <code>content</code> globs from{' '}
        <a href="/getting-started">Getting Started</a>.
      </p>

      <h2>2. Fix tests and selectors</h2>
      <table>
        <thead>
          <tr><th>Component</th><th>Before (1.5)</th><th>After (1.6+)</th><th>What to do</th></tr>
        </thead>
        <tbody>
          {changes.map((c) => (
            <tr key={c.what}>
              <td><strong>{c.what}</strong></td>
              <td>{c.before}</td>
              <td>{c.after}</td>
              <td>{c.todo}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <CodeBlock code={`// 1.5
screen.getByRole('group', { name: 'View' });
expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();

// 1.6+
screen.getByRole('radiogroup', { name: 'View' });
expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('aria-disabled', 'true');`} />

      <h2>3. Adopt the new conventions</h2>

      <h3>Colour roles</h3>
      <p>
        Use role names (<code>--color-surface</code>, <code>--color-on-surface</code>,{' '}
        <code>--color-primary</code>, <code>*-container</code>, <code>outline</code>…) and the Tailwind colours
        of the same name. The legacy names in <code>@nexub/themes/light</code> still work as aliases, so this
        can be gradual. <a href="/foundations/colors">Colors</a> lists every role.
      </p>
      <table>
        <thead>
          <tr><th>Legacy</th><th>Role</th></tr>
        </thead>
        <tbody>
          {aliases.map(([legacy, role]) => (
            <tr key={legacy}>
              <td><code>{legacy}</code></td>
              <td><code>{role}</code></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Brand accents are roles too: <code>--color-leap</code>, <code>--color-on-leap</code>,{' '}
        <code>--color-leap-container</code> (same for <code>bookub</code>, <code>payub</code>,{' '}
        <code>founderub</code>). For charts use <code>--color-chart-1..8</code> (categorical),{' '}
        <code>chart-seq-1..7</code> and <code>chart-div-1..7</code>.
      </p>

      <h3>Logical classes for right-to-left</h3>
      <p>
        Components flip with <code>dir</code>; your layout should too. Replace <code>ml-</code>/<code>mr-</code>{' '}
        with <code>ms-</code>/<code>me-</code>, <code>pl-</code>/<code>pr-</code> with <code>ps-</code>/
        <code>pe-</code>, <code>left-</code>/<code>right-</code> with <code>start-</code>/<code>end-</code>,{' '}
        <code>border-l</code>/<code>-r</code> with <code>border-s</code>/<code>-e</code>,{' '}
        <code>rounded-l</code>/<code>-r</code> with <code>rounded-s</code>/<code>-e</code>, and{' '}
        <code>text-left</code>/<code>-right</code> with <code>text-start</code>/<code>-end</code>.
      </p>

      <h3>NexubProvider</h3>
      <p>
        One provider for <code>locale</code> (Intl formatting), <code>dir</code>, <code>messages</code>{' '}
        (every built-in string) and <code>dateLocale</code> (date-fns locale for the pickers). Optional;
        without it you get English and left-to-right. See <a href="/getting-started/internationalization">Internationalization</a>.
      </p>
      <CodeBlock code={`<NexubProvider locale="fr" messages={fr} dateLocale={frLocale}>
  {children}
</NexubProvider>`} />

      <h3>Strict CSP</h3>
      <p>
        Server HTML from layout and text components carries no <code>style</code> attribute when you use scale
        values, so <code>style-src &apos;self&apos;</code> works without <code>&apos;unsafe-inline&apos;</code>.
        Pass <code>scrollLock=&quot;class&quot;</code> to <code>Sheet</code>/<code>Drawer</code>, and a{' '}
        <code>nonce</code> to <code>ThemeScript</code>. Details in <a href="/getting-started/strict-csp">Strict CSP</a>.
      </p>

      <h3>Motion tokens</h3>
      <p>
        Animate your own overlays with <code>nx-motion nx-pop</code> (or <code>nx-dialog</code>) on Radix&apos;s{' '}
        <code>data-state</code> instead of <code>animate-in</code> classes, and time transitions with the spring
        tokens: <code>duration-spatial-default ease-spatial-default</code> for movement,{' '}
        <code>duration-effects-fast ease-effects-fast</code> for opacity and colour. Exits should be faster than
        enters, and every animation needs a <code>motion-reduce:</code> fallback. See{' '}
        <a href="/foundations/motion">Motion &amp; interaction</a>.
      </p>

      <h3>Touch targets</h3>
      <p>
        Button, IconButton, Checkbox, Radio and Switch get a 44×44px hit area on touch screens. Add{' '}
        <code>nx-hit</code> to your own small controls and keep 44px between their centres.
      </p>

      <h2>4. Automate it: nexub-migrate</h2>
      <p>
        <code>@nexub/tokens</code> 1.8.0 ships a codemod. It is a dry run by default and prints what it would
        change.
      </p>
      <CodeBlock lang="bash" code={`npx nexub-migrate src           # dry run: report changes
npx nexub-migrate src --write   # apply them
npx nexub-migrate src --check   # CI: exit 1 if anything is left`} />
      <table>
        <thead>
          <tr><th>Rule</th><th>What it does</th></tr>
        </thead>
        <tbody>
          <tr><td><code>legacy-tokens</code></td><td>Legacy colour names → roles, in CSS variables and Tailwind classes.</td></tr>
          <tr><td><code>logical-classes</code></td><td>Physical Tailwind classes (<code>ml-</code>, <code>pr-</code>, <code>left-</code>, <code>text-left</code>…) → logical ones.</td></tr>
          <tr><td><code>tw-animate</code></td><td>Reports <code>tailwindcss-animate</code> classes to replace with <code>nx-motion</code>. Report only.</td></tr>
          <tr><td><code>opacity-modifier</code></td><td>Opacity modifiers on role colours (<code>bg-primary/50</code>, <code>bg-[var(--color-primary)]/50</code>), which Tailwind 3 silently drops.</td></tr>
        </tbody>
      </table>
      <p>Run your tests after <code>--write</code>, and review the diff: it rewrites class strings, not logic.</p>
    </div>
  );
}
