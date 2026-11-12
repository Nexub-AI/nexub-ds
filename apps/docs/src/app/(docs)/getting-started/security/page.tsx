import type { Metadata } from 'next';
import Link from 'next/link';
import { DocTable, PageIntro, Prose, Section } from '@/components/kit';
import { CodeBlock } from '@/components/docs/CodeBlock';

export const dynamic = 'force-static';

export const metadata: Metadata = { title: 'Security' };

const threats: React.ReactNode[][] = [
  [
    'Breadcrumb, MediaCard, CardLink, Avatar, pattern and marketing navs',
    'A javascript:, vbscript:, data: or file: URL from a user, CMS or LLM runs script when clicked.',
    'Every href goes through safeHref and every image src through safeSrc. A blocked value renders no link, or the fallback.',
  ],
  ['Citation, SourceChip, SourceList', 'Model-generated source URLs and favicons.', 'safeUrl: absolute http(s) only.'],
  [
    'Dialog, AlertDialog, Sheet, CommandPalette, menus, Select',
    'Radix injects a <style> for scroll lock, which a strict CSP blocks.',
    'scrollLock="class", or a NexubProvider nonce. See Strict CSP.',
  ],
  [
    'ThemeScript',
    'Stored theme values come from localStorage, which any script on the origin can write.',
    'Only known theme, contrast, glass and product values are applied. The script is escaped and takes a nonce.',
  ],
  [
    'PasswordInput',
    'A revealed password reaching cloud spellcheck or autocorrect.',
    'Spellcheck, autocorrect and autocapitalize are always off. autoComplete defaults to current-password.',
  ],
  [
    'FileUpload',
    'accept, maxSize and validate run in the browser and can be bypassed. A file name is attacker text.',
    'Use them for feedback only. Check type (magic bytes), size and content again on the server. Names render as text; only images get a preview, from a blob: URL.',
  ],
  [
    'MessageBubble, StreamingText, ChatPage, Code',
    'Model output or user messages that contain markup, a script or a markdown javascript: link.',
    'Everything is rendered as text. No component parses HTML or markdown, and none uses dangerouslySetInnerHTML.',
  ],
  [
    'DataTable CSV export (toCSV)',
    'A cell that starts with =, +, - or @ runs as a formula when the file is opened in a spreadsheet.',
    'Such cells get a leading apostrophe; quotes, commas and line breaks are escaped (RFC 4180).',
  ],
  [
    'Chart, StatCard, Amount, MoneyInput, NumberInput',
    'Numbers and labels from an API: NaN, Infinity, huge or non-Latin-digit values.',
    'Labels render as text. The inputs only report finite numbers inside their bounds (property-tested).',
  ],
  [
    'Link, Button asChild, Breadcrumb.Link, NavigationMenu.Link',
    'These are primitives: your href goes to the DOM as you wrote it.',
    'Pass safeHref(url) when the value is not yours. React itself blocks javascript: URLs. The data-driven APIs (Breadcrumb.Trail, navs, cards) guard for you.',
  ],
];

export default function SecurityPage() {
  return (
    <div className="docs-prose">
      <PageIntro eyebrow="Getting Started" title="Security" lead="What the library guards for you, and what stays your job." />

      <Section id="defaults" title="Secure by default">
        <Prose>
          Components that render values you don&apos;t control (user input, CMS content, LLM output) guard them
          before they reach the DOM. The guards are exported, so your own components can use the same rules.
        </Prose>
        <CodeBlock
          code={`import { safeHref, safeSrc } from '@nexub/react';

safeHref('javascript:alert(1)');    // undefined
safeHref('/settings');              // '/settings'
safeHref('slack://open');           // allowed in 7.x
safeHref(url, { strict: true });    // web, mailto, tel and sms only (the 8.0 default)
safeSrc('data:image/png;base64,…'); // allowed: an <img> can't run script`}
        />
      </Section>

      <Section id="threats" title="Threat model by component">
        <Prose>
          Every component that renders a URL, a file, or text from a user, a CMS or a model. Since 9.6 an XSS corpus
          (15 hostile URLs, 10 markup and template payloads) runs against each of these props in{' '}
          <code>@nexub/react</code>, <code>@nexub/patterns</code> and <code>@nexub/marketing</code>, with menus
          opened first. After each render the DOM is audited: no injected element, no event-handler attribute, no
          link outside http(s), mailto, tel and sms, and no source outside http(s), blob and <code>data:image/</code>.
        </Prose>
        <DocTable head={['Component', 'Risk', 'What Nexub does']} rows={threats} />
      </Section>

      <Section id="csp" title="Content-Security-Policy">
        <Prose>
          Nexub works without <code>&apos;unsafe-inline&apos;</code> scripts and, with a nonce or{' '}
          <code>scrollLock=&quot;class&quot;</code>, without inline style elements.{' '}
          <Link href="/getting-started/strict-csp">Strict CSP</Link> has the per-component details.
        </Prose>
        <Prose>
          This site runs that way. Its script policy is a per-request nonce with <code>&apos;strict-dynamic&apos;</code>{' '}
          and nothing else, and Trusted Types is enforced: a string can&apos;t reach <code>innerHTML</code>,{' '}
          <code>script.src</code> or <code>eval</code>. A test loads every page of the site under the production
          policy and fails on any violation, which is also the proof that the library needs no inline script and
          makes no Trusted Types violation. Two exceptions remain, and neither can run script:{' '}
          <code>style-src-attr &apos;unsafe-inline&apos;</code> for server-rendered <code>style</code> attributes, and
          the React Native web preview under <code>/m</code>, whose runtime injects its own style elements.
        </Prose>
      </Section>

      <Section id="resilience" title="Resilience">
        <Prose>
          Since 9.5, the code that reads what a person or a model hands it is tested with generated input, not only
          examples. Property-based tests (fast-check) cover <code>parseMoney</code> in eight locales, <code>safeHref</code>{' '}
          and <code>safeSrc</code> against schemes hidden with tabs, newlines, control characters and mixed case, seed
          colours, CSV export, and typed entry in NumberInput, OTPInput, MoneyInput and DatePicker.
        </Prose>
        <DocTable
          head={['Check', 'What it does', 'When']}
          rows={[
            ['Property tests', 'Random input for every parser and typed field. A counterexample fails the build with the seed to replay it.', 'Every PR'],
            ['Leak test', 'Mounts and unmounts every story 1,000 times. Listeners, timers, DOM nodes and heap must not grow.', 'Every PR'],
            ['Docs soak', 'One browser session of navigation, search and theme switches: no error, no reload, flat memory.', '1 minute per PR, 30 minutes nightly'],
            ['Mobile soak', 'One iOS app session of screens, toasts, dialogs and sheets: no crash, flat memory.', '30 minutes nightly'],
          ]}
        />
        <Prose>
          The page templates (<code>PageFrame</code> and every page built on it) and React Native&apos;s{' '}
          <code>ScreenContainer</code> catch a render error in their content. The header and navigation stay up and the
          content shows &ldquo;Something went wrong&rdquo; with Retry. Pass <code>onError</code> to report it and{' '}
          <code>errorFallback</code> to draw your own.
        </Prose>
        <CodeBlock
          code={`<DashboardPage
  title="Home"
  onError={(error, info) => Sentry.captureException(error, { extra: info })}
  errorFallback={({ reset }) => <MyError onRetry={reset} />}
  {...data}
/>`}
        />
      </Section>

      <Section id="reporting" title="Reporting a vulnerability">
        <Prose>
          Report privately through GitHub Security Advisories on{' '}
          <a href="https://github.com/Nexub-AI/nexub-ds/security/advisories/new">Nexub-AI/nexub-ds</a>, not in a
          public issue. Fixes ship as a patch on the latest version.
        </Prose>
      </Section>
    </div>
  );
}
