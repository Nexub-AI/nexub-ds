'use client';

import * as React from 'react';
import type { MatrixDef } from '@/registry/types';
import { renderPlayground, hasPlaygroundRenderer } from './PlaygroundRegistry';

interface Props {
  slug: string;
  def: MatrixDef;
}

export function VariantMatrix({ slug, def }: Props) {
  if (!hasPlaygroundRenderer(slug)) return null;

  const { rowsProp, rows, colsProp, cols, fixed = {}, childrenDefault } = def;
  const childKey = 'children';

  return (
    <div
      style={{
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        marginBottom: '1.5rem',
        background: 'var(--color-bg-default)',
      }}
    >
      <div
        style={{
          padding: '8px 12px',
          borderBottom: '1px solid var(--color-border-default)',
          background: 'var(--color-bg-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--color-text-secondary)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          Variants ×{' '}
          <span style={{ fontFamily: 'var(--font-family-mono)' }}>{rowsProp}</span> /{' '}
          <span style={{ fontFamily: 'var(--font-family-mono)' }}>{colsProp}</span>
        </span>
        <span
          style={{
            fontSize: '0.7rem',
            color: 'var(--color-text-subtle)',
            fontFamily: 'var(--font-family-mono)',
          }}
        >
          {rows.length} × {cols.length}
        </span>
      </div>

      <div className="docs-matrix-scroll">
        <table
          className="docs-matrix-table"
          style={{
            borderCollapse: 'separate',
            borderSpacing: 0,
            width: '100%',
            fontSize: '0.78rem',
            fontFamily: 'var(--font-family-sans)',
          }}
        >
          <thead>
            <tr>
              <th style={cornerStyle}>
                <span
                  style={{
                    fontFamily: 'var(--font-family-mono)',
                    color: 'var(--color-text-subtle)',
                    fontWeight: 600,
                  }}
                >
                  {rowsProp} ↓ / {colsProp} →
                </span>
              </th>
              {cols.map((c) => (
                <th key={c} style={headStyle}>
                  <span style={{ fontFamily: 'var(--font-family-mono)' }}>{c}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r}>
                <th scope="row" style={rowHeadStyle}>
                  <span style={{ fontFamily: 'var(--font-family-mono)' }}>{r}</span>
                </th>
                {cols.map((c) => {
                  const props = {
                    ...fixed,
                    [rowsProp]: r,
                    [colsProp]: c,
                    [childKey]: childrenDefault ?? r,
                  };
                  return (
                    <td key={c} style={cellStyle}>
                      <div
                        style={{
                          minHeight: 56,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 8,
                        }}
                      >
                        {renderPlayground(slug, props)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const headStyle: React.CSSProperties = {
  padding: '8px 12px',
  background: 'var(--color-bg-subtle)',
  borderBottom: '1px solid var(--color-border-default)',
  borderLeft: '1px solid var(--color-border-subtle)',
  textAlign: 'center',
  color: 'var(--color-text-muted)',
  fontWeight: 600,
};

const cornerStyle: React.CSSProperties = {
  ...headStyle,
  textAlign: 'left',
  borderLeft: 'none',
  whiteSpace: 'nowrap',
};

const rowHeadStyle: React.CSSProperties = {
  padding: '8px 12px',
  background: 'var(--color-bg-subtle)',
  borderBottom: '1px solid var(--color-border-subtle)',
  borderRight: '1px solid var(--color-border-subtle)',
  textAlign: 'left',
  color: 'var(--color-text-muted)',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  position: 'sticky',
  left: 0,
};

const cellStyle: React.CSSProperties = {
  padding: 0,
  borderBottom: '1px solid var(--color-border-subtle)',
  borderLeft: '1px solid var(--color-border-subtle)',
  background: 'var(--color-bg-default)',
};
