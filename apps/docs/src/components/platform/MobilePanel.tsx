import * as React from 'react';
import { Badge } from '@nexub/react';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { InlineCode } from '@/components/docs/PropsTable';
import { DocTable, Note, Prose, Section } from '@/components/kit';
import { NATIVE_STATUS, nativePropsFor, type PlatformDifference } from '@/registry/native';
import type { ComponentStatus } from '@/registry/types';
import { StatusBadge } from '@/components/docs/StatusBadge';
import { DeviceShots } from './DeviceShots';
import { PhoneFrame } from './PhoneFrame';

/** The Mobile side of a component or pattern page. */
export function MobilePanel({
  name,
  title,
  preview,
  code,
  differences = [],
  webAlternative,
  intro,
  pkg = '@nexub/react-native',
  status = NATIVE_STATUS,
}: {
  /** Export name(s) in @nexub/react-native, e.g. "Button" or "ToastProvider + useToast". */
  name: string;
  title: string;
  /** Preview path under /m, e.g. `preview/button`. */
  preview: string;
  code: string;
  differences?: PlatformDifference[];
  webAlternative?: string;
  intro?: React.ReactNode;
  pkg?: string;
  status?: ComponentStatus;
}) {
  const primary = (name.split(/\s[+/]\s/)[0] ?? name).trim();
  const props = nativePropsFor(primary);
  const importLine = `import { ${name.split(/\s[+/]\s/).map((n) => n.trim()).join(', ')} } from '${pkg}';`;

  return (
    <div className="flex flex-col">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="soft" tone="info">{pkg}</Badge>
            <StatusBadge status={status} />
            {webAlternative && <Badge variant="outline">Web: {webAlternative}</Badge>}
          </div>
          {intro && <Prose>{intro}</Prose>}
          <CodeBlock lang="tsx" code={code.startsWith('import ') ? code : `${importLine}\n\n${code}`} />
          {differences.length > 0 && (
            <Section id="differences" title="Web vs mobile" level={3} description="Same tokens and prop names. Where the platforms differ:">
              <DocTable
                caption={`${title}: web vs mobile`}
                head={['', 'Web', 'iOS & Android']}
                rows={differences.map((d) => [
                  <strong key="a" className="whitespace-nowrap">{d.aspect}</strong>,
                  <InlineCode key="w" text={d.web} />,
                  <InlineCode key="m" text={d.mobile} />,
                ])}
              />
            </Section>
          )}
        </div>
        <div className="flex justify-center lg:sticky lg:top-24">
          <PhoneFrame path={preview} title={title} />
        </div>
      </div>

      <DeviceShots preview={preview} title={title} />

      {props.length > 0 && (
        <Section id="native-props" title={`${primary} props`} level={3}>
          <DocTable
            caption={`${primary} props (React Native)`}
            head={['Prop', 'Type', 'Default', 'Description']}
            mono={[1, 2]}
            rows={props.map((p) => [
              <span key="n" className="flex flex-wrap items-center gap-1.5 whitespace-nowrap font-mono text-body-sm font-semibold text-[var(--color-primary)]">
                {p.name}
                {p.required && <Badge size="sm" tone="danger" variant="soft">required</Badge>}
              </span>,
              <span key="t" className="text-[var(--color-on-surface-variant)]">{p.type}</span>,
              <span key="d" className="text-[var(--color-on-surface-muted)]">{p.default ?? '—'}</span>,
              p.description ? <InlineCode key="x" text={p.description} /> : <span key="x" className="text-[var(--color-on-surface-muted)]">—</span>,
            ])}
          />
        </Section>
      )}
    </div>
  );
}

export function NoMobileTwin({ title }: { title: string }) {
  return (
    <Note title="Web only">
      {title} has no @nexub/react-native twin. On phones, follow the platform pattern instead, or compose it from the native
      components listed on the React Native page.
    </Note>
  );
}
