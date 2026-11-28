import type { Metadata } from 'next';
import { Badge } from '@nexub/react';
import { DocTable, Note, PageIntro, Prose, Section } from '@/components/kit';
import { CodeBlock } from '@/components/docs/CodeBlock';
import data from '@/registry/adoption.generated.json';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Adoption',
  description:
    'How the Nexub apps use the design system: a health scorecard per app, the admin-ui stopgaps still in use, and what the 12.7 usage scan found for 13.x.',
};

type App = (typeof data.apps)[number];
const G = data.grade;
const TONE = { A: 'success', B: 'info', C: 'warning', D: 'danger' } as const;
const n = (x: number) => x.toLocaleString('en');

function behind(version: string | null) {
  if (!version) return '—';
  const [maj = 0, min = 0] = version.split('.').map(Number);
  const [lmaj = 0, lmin = 0] = data.latest.split('.').map(Number);
  if (maj < lmaj) return `${version} (major ${lmaj - maj} behind)`;
  if (min < lmin) return `${version} (${lmin - min} minor${lmin - min === 1 ? '' : 's'} behind)`;
  return `${version} (latest)`;
}

const apps = [...data.apps].sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
const sha = (s: string | undefined) => (s ? s.slice(0, 7) : '—');

function scoreRow(a: App) {
  return [
    a.name,
    <Badge key="g" tone={TONE[a.grade as keyof typeof TONE]} variant="soft" size="sm">
      {a.grade} · {a.points}
    </Badge>,
    behind(a.version),
    `${a.componentsDirect} / ${a.componentsWithWrappers}`,
    `${n(a.overrides)} (${a.restylesPer100} per 100 uses)`,
    String(a.copies),
    String(a.deprecated),
    String(a.stopgaps),
  ];
}

export default function AdoptionPage() {
  const codemods = data.findings.codemods.slice(0, 8);
  return (
    <div className="docs-prose">
      <PageIntro
        eyebrow="Components"
        title="Adoption"
        lead={
          <>
            How the Nexub apps use the design system, from the 12.7 usage scan: one scorecard per app, the
            admin-ui stopgaps that are still imported, and the workarounds that feed the 13.x plan.
          </>
        }
      />
      <Prose>
        Scanned on {data.scannedOn} against {data.latest}, the latest release then. Sources:{' '}
        {data.sources.map((s, i) => (
          <span key={s.repo}>
            {i ? ', ' : ''}
            <code>{s.repo}</code> at <code>{sha(s.sha)}</code> ({s.branch})
          </span>
        ))}
        . Only counts and component and prop names are published here.
      </Prose>

      <Section id="scorecard" title="Scorecard">
        <DocTable
          caption="Health scorecard per app"
          head={['App', 'Grade', 'Nexub version', 'Components (direct / with admin-ui)', 'Overrides', 'Copies', 'Deprecated APIs', 'Stopgaps left']}
          rows={apps.map(scoreRow)}
        />
        {data.notScored.length > 0 && (
          <Prose>
            Not scored:{' '}
            {data.notScored.map((s, i) => (
              <span key={s.name}>
                {i ? '; ' : ''}
                {s.name} ({s.reason.replace(/\.$/, '')})
              </span>
            ))}
            . matchub is pre-production and not scanned.
          </Prose>
        )}
      </Section>

      <Section id="grade" title="How the grade works">
        <Prose>Each app starts at 100 points and loses points for each of these, up to the cap shown:</Prose>
        <DocTable
          caption="Grade rule"
          head={['Measure', 'Points off', 'Cap']}
          rows={[
            ['Nexub version behind the latest', `${G.perMinorBehind} per minor; ${G.perMajorBehind} per major`, `${G.minorCap} for minors; ${G.majorCap} for majors`],
            ['Deprecated or removed APIs in use', `${G.perDeprecated} each`, String(G.deprecatedCap)],
            ['Copies of Nexub parts', `${G.perCopy} each`, String(G.copyCap)],
            ['Overrides per 100 component uses', `${G.perRestylePer100} per override per 100 uses`, String(G.restyleCap)],
            ['admin-ui stopgaps still imported', `${G.perStopgap} per stopgap`, String(G.stopgapCap)],
          ]}
        />
        <Prose>
          Grade {G.bands.map(([g, min], i) => (i < G.bands.length - 1 ? `${g} from ${min}` : `${g} below ${G.bands[i - 1]?.[1]}`)).join(', ')}. The
          number of components an app uses is shown but not graded: using more parts is not better by itself.
        </Prose>
        <Note tone="info" title="What each column counts">
          <strong>Components</strong>: distinct Nexub components the app renders itself, and with the ones it gets
          through the platform&apos;s <code>@nexub/admin-ui</code> wrappers (read from that package&apos;s source).{' '}
          <strong>Overrides</strong>: a <code>className</code> that restyles a Nexub component (padding, colour,
          border, radius, type; classes that only place it, such as margin, width or flex, are left out), a{' '}
          <code>style</code> prop on one, CSS or Tailwind that targets <code>.nx-*</code> classes, and app code that
          redefines a Nexub custom property. <strong>Copies</strong> (a heuristic): a local component with the name of a
          Nexub component that draws its own markup, or one that sets an ARIA role a Nexub part owns, such as{' '}
          <code>role=&quot;dialog&quot;</code>. <strong>Deprecated APIs</strong>: what the <code>nexub-migrate</code>{' '}
          rules for removed and deprecated APIs find. Test and story files are not counted.
        </Note>
      </Section>

      <Section id="admin-ui" title="admin-ui tracker">
        <Prose>
          The <code>@nexub/admin-ui</code> stopgaps that an 11.x minor made redundant, and the apps that still import
          each one. Most now render their Nexub replacement, so moving an app over is an import change plus a few prop
          renames.
        </Prose>
        <DocTable
          caption="admin-ui stopgaps and the apps still using them"
          head={['Stopgap', 'Replaced by', 'Since', 'In admin-ui today', 'Imports', 'Apps still using it']}
          rows={data.stopgaps.map((s) => [
            <code key="n">{s.name}</code>,
            s.replacement,
            s.since,
            s.kind === 'pattern' ? 'App code' : !s.inAdminUi ? 'Deleted' : s.wraps.length ? `Wraps ${s.wraps.join(', ')}` : 'Own code',
            String(s.uses),
            s.apps.length ? `${s.apps.length}: ${s.apps.join(', ')}` : 'None',
          ])}
        />
      </Section>

      <Section id="findings" title="Findings for 13.x">
        <Prose>
          The workarounds the scan found most often. The first table is work a codemod can do today, because a Nexub
          prop or part already covers it. The second needs a design-system change first.
        </Prose>
        <Section id="codemods" title="Codemod candidates" level={3}>
          <DocTable
            caption="Codemod candidates"
            head={['Fix', 'Uses', 'Apps']}
            rows={codemods.map((f) => [f.fix, n(f.count), String(f.apps)])}
          />
        </Section>
        <Section id="gaps" title="Repeated workarounds with no prop yet" level={3}>
          <DocTable
            caption="Workarounds with no prop yet"
            head={['Workaround', 'Uses', 'Apps']}
            rows={data.findings.gaps.map((f) => [f.gap, n(f.count), String(f.apps)])}
          />
        </Section>
        <Section id="restyled" title="Most restyled components" level={3}>
          <DocTable
            caption="Most restyled components"
            head={['Component', 'Restyling classNames', 'Apps']}
            mono={[0]}
            rows={data.findings.restyled.map((f) => [f.name, n(f.count), String(f.apps)])}
          />
        </Section>
        <Section id="copies" title="Copies of Nexub parts" level={3}>
          <DocTable
            caption="Copies of Nexub parts"
            head={['Part', 'Copies', 'Apps']}
            mono={[0]}
            rows={data.findings.copies.map((f) => [f.name, String(f.count), String(f.apps)])}
          />
          <Prose>
            Native elements that have a Nexub part (not graded: a plain <code>&lt;button&gt;</code> is often right):{' '}
            {data.findings.native.map((f) => `${f.name} ${f.count}`).join(', ')}.
          </Prose>
        </Section>
      </Section>

      <Section id="run" title="Scan your own app">
        <Prose>
          The same scan ships in <code>@nexub/tokens</code>. Pass each app folder; <code>--wrapper</code> names a
          workspace package that wraps Nexub parts, so its users count as indirect users.
        </Prose>
        <CodeBlock
          lang="bash"
          code={`npx -p @nexub/tokens nexub-usage --apps apps/web apps/admin --wrapper packages/ui
npx -p @nexub/tokens nexub-usage --apps apps/web --json   # components, props, overrides, copies, deprecated APIs`}
        />
      </Section>
    </div>
  );
}
