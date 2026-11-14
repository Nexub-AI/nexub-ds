import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@nexub/react';
import { DocTable, Note, PageIntro } from '@/components/kit';
import { CodeBlock } from '@/components/docs/CodeBlock';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '10.0 release status',
  description: '10.0 is released. Where each 10.0 exit criterion stood on release day, including the three that were not met.',
};

// Checked by hand against CI on this date; update the rows and the date together.
const CHECKED = '14 November 2026';
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
    now: '5 of the last 100 runs failed, all on 12 November and all from bugs fixed since. The 17 completed runs after the last failure passed. Tracked until 100 in a row pass.',
  },
  {
    area: 'Browsers',
    criterion: 'Visual and interaction suites pass on Chromium, WebKit and Firefox, and on iOS and Android for React Native',
    state: 'met',
    now: 'All three engines and both mobile platforms are blocking checks, and passed for 10.0.',
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
    now: 'Scorecard is 7.8: the Code-Review check needs a second reviewer on pull requests. Everything else holds: 0 CodeQL alerts, signed and attested releases since 9.7, and all 13 review findings closed.',
  },
  {
    area: 'Soak',
    criterion: 'The release candidate runs on the next tag for 4 weeks in real apps with no regression',
    state: 'not met',
    now: 'Cut short. 9.9 was on next for 1 day (13 to 14 November). It changed no component since 9.8, which the pilot apps already ran in production.',
  },
];

export default function ReleaseStatusPage() {
  return (
    <div className="docs-prose">
      <PageIntro eyebrow="Getting Started" title="10.0 release status">
        10.0 is released. This page records where each exit criterion stood on release day.
      </PageIntro>
      <p>
        10.0 shipped on {CHECKED} with three criteria not met: flakes, the Scorecard score and the 4-week soak. They
        were waived so that apps could move to 10 now, because 10.0 is 9.9 with no component change. Flakes and
        Scorecard are still tracked. 10.0 adds nothing and removes nothing: see{' '}
        <Link href="/getting-started/migrating-to-10">Migrating to 10.0</Link>.
      </p>

      <h2>Install 10.0</h2>
      <CodeBlock lang="bash" code={`npm install @nexub/react@latest @nexub/themes@latest @nexub/tokens@latest @nexub/icons@latest`} />
      <p>
        All <code>@nexub</code> packages share one version, so move every one you use together. Found a regression?{' '}
        <a href="https://github.com/Nexub-AI/nexub-ds/issues/new/choose">Open an issue</a>.
      </p>

      <h2>Exit criteria on release day</h2>
      <p>Checked on {CHECKED}.</p>
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
        proposal and a migration guide. A minor ships every 3 to 4 weeks.
      </Note>
    </div>
  );
}
