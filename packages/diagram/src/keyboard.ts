// Spatial keyboard helpers: the reading order of nodes and the nearest node in a direction.
import type { Node } from '@xyflow/react';

export interface NodeBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export const arrowDirections: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

/** Rows closer than this (in flow units) count as one row. */
const ROW_TOLERANCE = 8;

/** Reading order: top to bottom, then start to end (right to left in RTL). */
export function readingOrder(boxes: readonly NodeBox[], rtl = false): string[] {
  return [...boxes]
    .sort((a, b) => {
      if (Math.abs(a.y - b.y) > ROW_TOLERANCE) return a.y - b.y;
      return rtl ? b.x + b.width - (a.x + a.width) : a.x - b.x;
    })
    .map((b) => b.id);
}

/**
 * The node to move focus to from `fromId` in `direction`: among nodes whose centre lies
 * that way, the one closest along the arrow, with sideways distance counting double so
 * a node straight ahead beats a nearer one off to the side. Undefined when there is none.
 */
export function nearestInDirection(boxes: readonly NodeBox[], fromId: string, direction: Direction): string | undefined {
  const from = boxes.find((b) => b.id === fromId);
  if (!from) return undefined;
  const cx = from.x + from.width / 2;
  const cy = from.y + from.height / 2;
  let best: string | undefined;
  let bestScore = Infinity;
  for (const b of boxes) {
    if (b.id === fromId) continue;
    const dx = b.x + b.width / 2 - cx;
    const dy = b.y + b.height / 2 - cy;
    const [main, side] = direction === 'left' ? [-dx, dy] : direction === 'right' ? [dx, dy] : direction === 'up' ? [-dy, dx] : [dy, dx];
    if (main <= 0) continue;
    const score = main + 2 * Math.abs(side);
    if (score < bestScore) {
      bestScore = score;
      best = b.id;
    }
  }
  return best;
}

/** A node's name: `data.title`, then `data.label` (React Flow's built-in nodes), then its id. */
export function nodeTitle(node: Pick<Node, 'id' | 'data' | 'ariaLabel'> | undefined): string {
  if (!node) return '';
  const d = node.data as Record<string, unknown> | undefined;
  if (typeof d?.title === 'string' && d.title) return d.title;
  if (typeof d?.label === 'string' && d.label) return d.label;
  return node.ariaLabel || node.id;
}
