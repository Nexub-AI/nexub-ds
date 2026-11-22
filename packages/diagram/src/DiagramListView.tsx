// The canvas's text alternative, as `tableView` on charts (11.3): a native <details>
// under the drawing listing every node with its connections by name.
import * as React from 'react';
import type { Edge, Node } from '@xyflow/react';
import type { DiagramLabels, DiagramNodeTone } from './types.js';
import { nodeTitle } from './keyboard.js';

export interface DiagramListViewProps {
  nodes: readonly Node[];
  edges: readonly Edge[];
  /** Node ids in reading order. */
  order: readonly string[];
  labels: DiagramLabels;
}

export function DiagramListView({ nodes, edges, order, labels }: DiagramListViewProps) {
  const byId = new Map(nodes.map((n) => [n.id, n] as const));
  const titles = (ids: string[]) => ids.map((id) => nodeTitle(byId.get(id))).join(', ');
  return (
    <details data-diagram-list="" className="text-body-sm">
      <summary className="nx-state-layer inline-flex cursor-pointer select-none items-center gap-1 rounded-shape-control px-2 py-1 text-label-md text-primary">
        {labels.showAsList}
      </summary>
      <ul className="mt-2 flex flex-col gap-2 ps-2">
        {order.map((id) => {
          const node = byId.get(id);
          if (!node) return null;
          const out = edges.filter((e) => e.source === id && byId.has(e.target)).map((e) => e.target);
          const into = edges.filter((e) => e.target === id && byId.has(e.source)).map((e) => e.source);
          const tone = (node.data as { tone?: DiagramNodeTone } | undefined)?.tone;
          return (
            <li key={id} className="text-on-surface">
              <span className="text-label-lg">{nodeTitle(node)}</span>
              {tone && tone !== 'default' && labels.tones[tone] ? <span className="text-on-surface-variant"> ({labels.tones[tone]})</span> : null}
              <ul className="ps-4 text-on-surface-variant">
                {out.length ? (
                  <li>
                    {labels.connectsTo}: {titles(out)}
                  </li>
                ) : null}
                {into.length ? (
                  <li>
                    {labels.connectedFrom}: {titles(into)}
                  </li>
                ) : null}
                {!out.length && !into.length ? <li>{labels.noConnections}</li> : null}
              </ul>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
