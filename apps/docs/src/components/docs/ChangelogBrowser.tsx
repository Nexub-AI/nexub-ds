'use client';

import * as React from 'react';
import { VersionSelect } from './VersionSelect';

interface ChangelogBrowserProps {
  /** Newest first; `node` is that release's rendered notes. */
  releases: { version: string; node: React.ReactNode }[];
}

const seriesOf = (v: string) => `${v.split('.')[0]}.x`;

/**
 * Pick a series (5.x), then a version in it; one release shows at a time.
 * Every release is still in the static HTML (hidden), so search engines and
 * old #v1.2.0 links keep working.
 */
export function ChangelogBrowser({ releases }: ChangelogBrowserProps) {
  const [version, setVersion] = React.useState(releases[0]?.version ?? '');

  React.useEffect(() => {
    const fromHash = decodeURIComponent(window.location.hash.replace(/^#v/, ''));
    if (releases.some((r) => r.version === fromHash)) setVersion(fromHash);
  }, [releases]);

  const select = (v: string) => {
    setVersion(v);
    history.replaceState(null, '', `#v${v}`);
  };

  const series = [...new Set(releases.map((r) => seriesOf(r.version)))];
  const current = seriesOf(version);
  const inSeries = releases.filter((r) => seriesOf(r.version) === current);

  return (
    <>
      <div className="not-prose mb-8 flex flex-wrap items-end gap-4">
        <VersionSelect
          label="Series"
          value={current}
          options={series.map((s) => ({ value: s, label: s }))}
          // Newest release in the chosen series.
          onValueChange={(s) => select(releases.find((r) => seriesOf(r.version) === s)!.version)}
        />
        <VersionSelect
          label="Version"
          value={version}
          options={inSeries.map((r) => ({
            value: r.version,
            label: r === releases[0] ? `${r.version} (latest)` : r.version,
          }))}
          onValueChange={select}
        />
      </div>
      {releases.map((r) => (
        <div key={r.version} hidden={r.version !== version}>
          {r.node}
        </div>
      ))}
    </>
  );
}
