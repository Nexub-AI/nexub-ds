import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@nexub/react';
import { DocTable, Note, PageIntro } from '@/components/kit';
import { CodeBlock } from '@/components/docs/CodeBlock';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '10.0 release status',
  description: 'The 10.0 release candidate (9.9 on the next tag) and where each 10.0 exit criterion stands.',
};

// Checked by hand against CI on this date; update the rows and the date together.
const CHECKED = '13 November 2026';
type State = 'met' | 'not met' | 'in progress';
const TONE = { met: 'success', 'not met': 'danger', 'in progress': 'warning' } as const;

const CRITERIA: { area: string; criterion: string; state: State; now: string }[] = [
  {
    area: 'Bugs',
    criterion: 'No open P1 or P2 bug, and no glitch issue older than 14 days',
    state: 'met',
    now: 'No open bug or glitch issue. The six open issues are component proposals.',
  },
  {
    area: 'Tests',
    criterion: 'Every exported web and React Native component has unit, SSR, StrictMode and visual tests; coverage at the ratchet; nothing quarantined',
    state: 'met',
    now: 'All four are blocking CI checks. The quarantine list is empty and can only shrink.',
  },
  {
    area: 'Flakes',
    criterion: 'Under 0.5% flaky runs over the last 100 CI runs on development',
    state: 'not met',
    now: '5 of the last 100 runs failed (5%): 3 in visual regression and 2 in the WebKit suite, all on 12 November.',
  },
  {
    area: 'Browsers',
    criterion: 'Visual and interaction suites pass on Chromium, WebKit and Firefox, and on iOS and Android for React Native',
    state: 'met',
    now: 'All three engines and both mobile platforms are blocking checks, and passed for 9.8.',
  },
  {
    area: 'Accessibility',
    criterion: 'No axe violation; forced-colors, RTL, 200% and 400% zoom and reduced-motion baselines pass',
    state: 'met',
    now: 'Blocking CI checks, with no exceptions listed.',
  },
  {
    area: 'Performance',
    criterion: 'CLS 0 on docs pages, INP under 200 ms, frame-time budgets pass, bundle sizes under 95% of budget',
    state: 'met',
    now: 'Lighthouse, frame-time and size budgets are blocking checks.',
  },
  {
    area: 'Resilience',
    criterion: 'Mounting each component 1,000 times leaks nothing; a 30-minute soak shows no error and no heap growth',
    state: 'met',
    now: 'The leak test has no exceptions. The first nightly 30-minute soak passed on 13 November.',
  },
  {
    area: 'Security',
    criterion: 'CodeQL: no high or critical alert. OpenSSF Scorecard 8 or more. SBOM and provenance on every release. Trusted Types enforced on docs. Security review findings closed',
    state: 'not met',
    now: 'Scorecard is 7.8. Everything else holds: 0 CodeQL alerts, signed and attested releases since 9.7, and all 13 review findings closed.',
  },
  {
    area: 'Soak',
    criterion: 'The release candidate runs on the next tag for 4 weeks in real apps with no regression',
    state: 'in progress',
    now: 'Starts when 9.9.0 is published to next. Four weeks from 13 November is 11 December.',
  },
];

export default function ReleaseStatusPage() {
  return (
    <div className="docs-prose">
      <PageIntro eyebrow="Getting Started" title="10.0 release status">
        9.9 is the release candidate for 10.0. This page lists what 10.0 is waiting for.
      </PageIntro>
      <p>
        10.0 has no date. It ships when every row below is met, and not before. It adds nothing and removes nothing:
        see <Link href="/getting-started/migrating-to-10">Migrating to 10.0</Link>.
      </p>

      <h2>Try the release candidate</h2>
      <p>
        9.9 is published under the <code>next</code> tag. A plain <code>npm install</code> still gives you 9.8 until
        10.0 is out.
      </p>
      <CodeBlock lang="bash" code={`npm install @nexub/react@next @nexub/themes@next @nexub/tokens@next @nexub/icons@next`} />
      <p>
        All <code>@nexub</code> packages share one version, so move every one you use to <code>next</code> together.
        Found a regression? <a href="https://github.com/Nexub-AI/nexub-ds/issues/new/choose">Open an issue</a>: during
        the freeze, only fixes that block 10.0 are merged.
      </p>

      <h2>Exit criteria</h2>
      <p>Last checked on {CHECKED}.</p>
      <DocTable
        head={['Area', '10.0 needs', 'Status', 'Now']}
        rows={CRITERIA.map((c) => [
          c.area,
          c.criterion,
          <Badge key="s" tone={TONE[c.state]}>{c.state === 'met' ? 'Met' : c.state === 'not met' ? 'Not met' : 'In progress'}</Badge>,
          c.now,
        ])}
      />
      <Note tone="info" title="After 10.0">
        Versions follow semver from 10.0: after 10.9 comes 10.10, and a breaking change needs a new major with a
        proposal and a migration guide. A minor ships every 3 to 4 weeks, and each one spends a week on{' '}
        <code>next</code> first.
      </Note>
    </div>
  );
}
