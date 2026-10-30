'use client';

import * as React from 'react';
import { Badge } from '@nexub/react';
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
      className="overflow-hidden rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface)]"
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
        <Badge size="sm" variant="outline" className="font-mono">
          {rows.length} × {cols.length}
        </Badge>
      </div>

      <div className="docs-matrix-scroll">
        <table className="docs-matrix-table w-full border-separate border-spacing-0 font-sans text-label-md">
          <thead>
            <tr>
              <th className={cornerClass}>
                <span className="font-mono font-semibold text-[var(--color-on-surface-muted)]">
                  {rowsProp} ↓ / {colsProp} →
                </span>
              </th>
              {cols.map((c) => (
                <th key={c} className={headClass}>
                  <span className="font-mono">{c}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r}>
                <th scope="row" className={rowHeadClass}>
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
                    <td key={c} className={cellClass}>
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

const headBase =
  'bg-[var(--color-surface-container-low)] px-3 py-2 font-semibold text-[var(--color-on-surface-muted)] border-b border-[var(--color-outline-variant)]';
const headClass = headBase + ' text-center border-s border-[var(--color-surface-container-high)]';
const cornerClass = headBase + ' text-start whitespace-nowrap';
const rowHeadClass =
  'sticky start-0 whitespace-nowrap bg-[var(--color-surface-container-low)] px-3 py-2 text-start font-semibold text-[var(--color-on-surface-muted)] border-b border-e border-[var(--color-surface-container-high)]';
const cellClass = 'p-0 bg-[var(--color-surface)] border-b border-s border-[var(--color-surface-container-high)]';
