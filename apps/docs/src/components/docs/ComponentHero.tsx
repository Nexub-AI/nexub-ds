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
          color: 'var(--color-brand-primary-500)',
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
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 8px 6px 12px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--docs-code-bg)',
          color: '#e1e4e8',
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
      bg: 'var(--color-semantic-success-bg)',
      fg: 'var(--color-semantic-success-default)',
      border: 'var(--color-semantic-success-border)',
    },
    warning: {
      bg: 'var(--color-semantic-warning-bg)',
      fg: 'var(--color-semantic-warning-default)',
      border: 'var(--color-semantic-warning-border)',
    },
    danger: {
      bg: 'var(--color-semantic-error-bg)',
      fg: 'var(--color-semantic-error-default)',
      border: 'var(--color-semantic-error-border)',
    },
    info: {
      bg: 'var(--color-semantic-info-bg)',
      fg: 'var(--color-semantic-info-default)',
      border: 'var(--color-semantic-info-border)',
    },
    muted: {
      bg: 'var(--color-bg-muted)',
      fg: 'var(--color-text-muted)',
      border: 'var(--color-border-default)',
    },
  } as const;
  const c = map[tone];
  return (
    <span
      style={{
        padding: '2px 8px',
        borderRadius: 'var(--radius-full)',
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
