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
      className="border border-[var(--color-outline-variant)] rounded-shape-container overflow-hidden mb-6 bg-[var(--color-surface)]"
    >
      <div
        className="py-2 px-3 border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] flex items-center justify-between gap-3"
      >
        <span
          className="text-label-sm font-bold text-[var(--color-on-surface-variant)] tracking-wider uppercase"
        >
          Variants ×{' '}
          <span className="font-mono">{rowsProp}</span> /{' '}
          <span className="font-mono">{colsProp}</span>
        </span>
        <span
          className="text-[0.7rem] text-[var(--color-outline)] font-mono"
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
                  className="font-mono text-[var(--color-outline)] font-semibold"
                >
                  {rowsProp} ↓ / {colsProp} →
                </span>
              </th>
              {cols.map((c) => (
                <th key={c} style={headStyle}>
                  <span className="font-mono">{c}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r}>
                <th scope="row" style={rowHeadStyle}>
                  <span className="font-mono">{r}</span>
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
                        className="min-h-[56px] flex items-center justify-center p-2"
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
  background: 'var(--color-surface-container-low)',
  borderBottom: '1px solid var(--color-outline-variant)',
  borderLeft: '1px solid var(--color-surface-container-high)',
  textAlign: 'center',
  color: 'var(--color-on-surface-muted)',
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
  background: 'var(--color-surface-container-low)',
  borderBottom: '1px solid var(--color-surface-container-high)',
  borderRight: '1px solid var(--color-surface-container-high)',
  textAlign: 'left',
  color: 'var(--color-on-surface-muted)',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  position: 'sticky',
  left: 0,
};

const cellStyle: React.CSSProperties = {
  padding: 0,
  borderBottom: '1px solid var(--color-surface-container-high)',
  borderLeft: '1px solid var(--color-surface-container-high)',
  background: 'var(--color-surface)',
};
