import * as React from 'react';
import type { ComponentEntry } from '@/registry/types';
import { CopyButton } from './CopyButton';

interface Props {
  entry: ComponentEntry;
}

export function ComponentHero({ entry }: Props) {
  const { meta } = entry;
  const importLine = `import { ${meta.title} } from '${meta.package}';`;

  return (
    <div data-reveal style={{ marginBottom: '1.5rem' }}>
      <p
        style={{
          fontSize: '0.78rem',
          fontWeight: 600,
          color: 'var(--color-primary)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: '0.5rem',
        }}
      >
        Components · {meta.category}
      </p>

      <div className="docs-hero-bar" aria-hidden="true" />

      <div className="docs-page-header" style={{ marginTop: '0.75rem' }}>
        <h1 style={{ margin: 0 }}>{meta.title}</h1>
        <div className="docs-page-header-badges">
          {meta.status === 'stable' && <Badge tone="success">Stable</Badge>}
          {meta.status === 'beta' && <Badge tone="warning">Beta</Badge>}
          {meta.status === 'deprecated' && <Badge tone="danger">Deprecated</Badge>}
          <Badge tone="info" mono>{meta.package}</Badge>
          {meta.addedIn && (
            <Badge tone="muted" mono>
              {meta.updatedIn ? `v${meta.addedIn} → v${meta.updatedIn}` : `Added in v${meta.addedIn}`}
            </Badge>
          )}
        </div>
      </div>

      <p style={{ marginTop: '0.5rem' }}>{meta.description}</p>

      {/* Inline copy-import strip */}
      <div
        className="docs-snippet"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 8px 6px 12px',
          borderRadius: 'var(--shape-field)',
          background: 'var(--docs-snippet-bg)',
          color: 'var(--docs-snippet-fg)',
          border: '1px solid var(--docs-snippet-border)',
          fontFamily: 'var(--font-family-mono)',
          fontSize: '0.78rem',
          marginTop: '0.25rem',
        }}
      >
        <code style={{ background: 'transparent', border: 'none', padding: 0, color: 'inherit' }}>
          {importLine}
        </code>
        <CopyButton text={importLine} />
      </div>
    </div>
  );
}

function Badge({
  tone,
  mono,
  children,
}: {
  tone: 'success' | 'warning' | 'danger' | 'info' | 'muted';
  mono?: boolean;
  children: React.ReactNode;
}) {
  const map = {
    success: {
      bg: 'var(--color-success-container)',
      fg: 'var(--color-success)',
      border: 'color-mix(in srgb, var(--color-success) 35%, transparent)',
    },
    warning: {
      bg: 'var(--color-warning-container)',
      fg: 'var(--color-warning)',
      border: 'color-mix(in srgb, var(--color-warning) 35%, transparent)',
    },
    danger: {
      bg: 'var(--color-error-container)',
      fg: 'var(--color-error)',
      border: 'color-mix(in srgb, var(--color-error) 35%, transparent)',
    },
    info: {
      bg: 'var(--color-info-container)',
      fg: 'var(--color-info)',
      border: 'color-mix(in srgb, var(--color-info) 35%, transparent)',
    },
    muted: {
      bg: 'var(--color-surface-container-high)',
      fg: 'var(--color-on-surface-muted)',
      border: 'var(--color-outline-variant)',
    },
  } as const;
  const c = map[tone];
  return (
    <span
      style={{
        padding: '2px 8px',
        borderRadius: 'var(--shape-control)',
        background: c.bg,
        color: c.fg,
        border: `1px solid ${c.border}`,
        fontSize: '0.7rem',
        fontWeight: 600,
        ...(mono ? { fontFamily: 'var(--font-family-mono)' } : null),
      }}
    >
      {children}
    </span>
  );
}
