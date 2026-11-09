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
    'accept, maxSize and validate run in the browser and can be bypassed.',
    'Use them for feedback only. Check type (magic bytes), size and content again on the server.',
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

      <Section id="threats" title="Risky components">
        <DocTable head={['Component', 'Risk', 'What Nexub does']} rows={threats} />
      </Section>

      <Section id="csp" title="Content-Security-Policy">
        <Prose>
          Nexub works without <code>&apos;unsafe-inline&apos;</code> scripts and, with a nonce or{' '}
          <code>scrollLock=&quot;class&quot;</code>, without inline style elements.{' '}
          <Link href="/getting-started/strict-csp">Strict CSP</Link> has the per-component details.
        </Prose>
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
