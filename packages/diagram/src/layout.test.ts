import { describe, expect, it } from 'vitest';
import { Position, type Edge, type Node } from '@xyflow/react';
import { DEFAULT_NODE_HEIGHT, DEFAULT_NODE_WIDTH, getNodeSize, layoutLayers, layoutTree } from './layout.js';

const node = (id: string, extra: Partial<Node> = {}): Node => ({ id, position: { x: 999, y: 999 }, data: { title: id }, ...extra });
const edge = (source: string, target: string): Edge => ({ id: `${source}-${target}`, source, target });
const pos = (nodes: Node[]) => Object.fromEntries(nodes.map((n) => [n.id, n.position]));

/** Axis-aligned boxes of the laid-out nodes overlap? */
function overlaps(nodes: Node[]): boolean {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i]!;
      const b = nodes[j]!;
      const sa = getNodeSize(a);
      const sb = getNodeSize(b);
      if (a.position.x < b.position.x + sb.width && b.position.x < a.position.x + sa.width && a.position.y < b.position.y + sb.height && b.position.y < a.position.y + sa.height) return true;
    }
  }
  return false;
}

describe('getNodeSize', () => {
  it('prefers measured, then width/height, then the default card', () => {
    expect(getNodeSize({ measured: { width: 10, height: 20 }, width: 1, height: 2 })).toEqual({ width: 10, height: 20 });
    expect(getNodeSize({ width: 30, height: 40 })).toEqual({ width: 30, height: 40 });
    expect(getNodeSize({})).toEqual({ width: DEFAULT_NODE_WIDTH, height: DEFAULT_NODE_HEIGHT });
  });
});

describe('layoutTree left-right', () => {
  const nodes = ['root', 'a', 'b', 'a1', 'a2', 'b1'].map((id) => node(id));
  const edges = [edge('root', 'a'), edge('root', 'b'), edge('a', 'a1'), edge('a', 'a2'), edge('b', 'b1')];

  it('puts each depth in its own column and parents centred on their children', () => {
    const out = layoutTree(nodes, edges, { direction: 'left-right' });
    const p = pos(out);
    expect(p.root!.x).toBe(0);
    expect(p.a!.x).toBe(p.b!.x);
    expect(p.a!.x).toBeGreaterThan(p.root!.x + DEFAULT_NODE_WIDTH);
    expect(p.a1!.x).toBe(p.b1!.x);
    expect(p.a!.y).toBe((p.a1!.y + p.a2!.y) / 2);
    expect(p.root!.y).toBe((p.a!.y + p.b!.y) / 2);
    expect(p.a1!.y).toBeLessThan(p.a2!.y);
    expect(p.a2!.y).toBeLessThan(p.b1!.y);
    expect(overlaps(out)).toBe(false);
  });

  it('is pure: returns new nodes, keeps other fields, sets handle sides', () => {
    const out = layoutTree(nodes, edges, { direction: 'left-right' });
    expect(out).not.toBe(nodes);
    expect(nodes[0]!.position).toEqual({ x: 999, y: 999 });
    expect(out[0]!.data).toBe(nodes[0]!.data);
    expect(out.map((n) => n.id)).toEqual(nodes.map((n) => n.id));
    expect(out.every((n) => n.sourcePosition === Position.Right && n.targetPosition === Position.Left)).toBe(true);
  });

  it('defaults to left-right', () => {
    expect(pos(layoutTree(nodes, edges))).toEqual(pos(layoutTree(nodes, edges, { direction: 'left-right' })));
  });

  it('uses measured sizes for columns and rows', () => {
    const big = [node('r', { measured: { width: 500, height: 300 } }), node('c1'), node('c2')];
    const out = pos(layoutTree(big, [edge('r', 'c1'), edge('r', 'c2')]));
    expect(out.c1!.x).toBeGreaterThanOrEqual(500);
    const laid = layoutTree(big, [edge('r', 'c1'), edge('r', 'c2')]);
    expect(overlaps(laid)).toBe(false);
  });

  it('keeps a tall parent from overlapping the next subtree', () => {
    const nodesT = [node('p', { height: 400 }), node('c'), node('q')];
    const laid = layoutTree(nodesT, [edge('p', 'c')]);
    expect(overlaps(laid)).toBe(false);
  });

  it('stacks a forest and lays out disconnected nodes', () => {
    const out = layoutTree([node('a'), node('b'), node('lonely'), node('c')], [edge('a', 'b'), edge('c', 'b')]);
    const p = pos(out);
    // b hangs under a (its first parent); c and lonely are trees of their own.
    expect(p.b!.x).toBeGreaterThan(p.a!.x);
    expect(p.lonely!.x).toBe(0);
    expect(p.c!.x).toBe(0);
    expect(overlaps(out)).toBe(false);
  });

  it('handles cycles, self-loops, duplicate and dangling edges without throwing', () => {
    const ns = [node('a'), node('b'), node('c')];
    const es = [edge('a', 'b'), edge('b', 'c'), edge('c', 'a'), edge('a', 'a'), edge('a', 'b'), edge('a', 'ghost'), edge('ghost', 'c')];
    const out = layoutTree(ns, es);
    expect(out).toHaveLength(3);
    const p = pos(out);
    expect(p.a!.x).toBeLessThan(p.b!.x);
    expect(p.b!.x).toBeLessThan(p.c!.x);
    expect(overlaps(out)).toBe(false);
  });

  it('returns an empty list for no nodes', () => {
    expect(layoutTree([], [])).toEqual([]);
    expect(layoutTree([], [], { direction: 'radial' })).toEqual([]);
  });
});

describe('layoutTree radial', () => {
  it('centres the root and puts the first child to its right and a second to its left', () => {
    const out = layoutTree([node('root'), node('a'), node('b')], [edge('root', 'a'), edge('root', 'b')], { direction: 'radial' });
    const p = pos(out);
    const centre = (id: string) => ({ x: p[id]!.x + DEFAULT_NODE_WIDTH / 2, y: p[id]!.y + DEFAULT_NODE_HEIGHT / 2 });
    expect(centre('a').x).toBeGreaterThan(centre('root').x);
    expect(centre('b').x).toBeLessThan(centre('root').x);
    expect(Math.abs(centre('a').y - centre('root').y)).toBeLessThan(1);
    const byId = Object.fromEntries(out.map((n) => [n.id, n]));
    expect(byId.a!.targetPosition).toBe(Position.Left);
    expect(byId.a!.sourcePosition).toBe(Position.Right);
    expect(byId.b!.targetPosition).toBe(Position.Right);
    expect(byId.b!.sourcePosition).toBe(Position.Left);
    expect(byId.root!.sourcePosition).toBe(Position.Right);
  });

  it('puts deeper nodes on wider rings without overlaps', () => {
    const ids = ['r', 'a', 'b', 'c', 'd', 'a1', 'a2', 'b1', 'c1', 'c2', 'c3', 'd1'];
    const es = [edge('r', 'a'), edge('r', 'b'), edge('r', 'c'), edge('r', 'd'), edge('a', 'a1'), edge('a', 'a2'), edge('b', 'b1'), edge('c', 'c1'), edge('c', 'c2'), edge('c', 'c3'), edge('d', 'd1')];
    const out = layoutTree(ids.map((id) => node(id)), es, { direction: 'radial' });
    const p = pos(out);
    const r0 = { x: p.r!.x + DEFAULT_NODE_WIDTH / 2, y: p.r!.y + DEFAULT_NODE_HEIGHT / 2 };
    const dist = (id: string) => Math.hypot(p[id]!.x + DEFAULT_NODE_WIDTH / 2 - r0.x, p[id]!.y + DEFAULT_NODE_HEIGHT / 2 - r0.y);
    expect(dist('a1')).toBeGreaterThan(dist('a'));
    expect(Math.round(dist('a'))).toBe(Math.round(dist('c')));
    expect(overlaps(out)).toBe(false);
    // Vertical neighbours get top/bottom handles.
    const sides = new Set(out.map((n) => n.targetPosition));
    expect(sides.has(Position.Top) || sides.has(Position.Bottom)).toBe(true);
  });

  it('places separate trees side by side and survives cycles', () => {
    const out = layoutTree([node('a'), node('b'), node('x'), node('y')], [edge('a', 'b'), edge('b', 'a'), edge('x', 'y')], { direction: 'radial' });
    expect(out).toHaveLength(4);
    expect(overlaps(out)).toBe(false);
  });

  it('lays out a single node at the origin', () => {
    const [only] = layoutTree([node('solo')], [], { direction: 'radial' });
    expect(only!.position).toEqual({ x: -DEFAULT_NODE_WIDTH / 2, y: -DEFAULT_NODE_HEIGHT / 2 });
  });
});

describe('layoutLayers', () => {
  it('layers by longest path', () => {
    // a → b → c and a → c: c goes in layer 2, not 1.
    const out = pos(layoutLayers([node('a'), node('b'), node('c')], [edge('a', 'b'), edge('b', 'c'), edge('a', 'c')]));
    expect(out.a!.x).toBe(0);
    expect(out.b!.x).toBeGreaterThan(out.a!.x);
    expect(out.c!.x).toBeGreaterThan(out.b!.x);
  });

  it('orders a layer by barycentre to remove crossings', () => {
    // Inputs listed so a naive order would cross: a1→b2, a2→b1.
    const ns = [node('a1'), node('a2'), node('b1'), node('b2')];
    const out = pos(layoutLayers(ns, [edge('a1', 'b2'), edge('a2', 'b1')]));
    const aFirst = out.a1!.y < out.a2!.y;
    const bFirst = out.b2!.y < out.b1!.y;
    expect(aFirst).toBe(bFirst);
  });

  it('centres shorter layers on the tallest one', () => {
    const out = pos(layoutLayers([node('s'), node('m1'), node('m2'), node('m3')], [edge('s', 'm1'), edge('s', 'm2'), edge('s', 'm3')]));
    expect(out.s!.y).toBe(out.m2!.y);
  });

  it('breaks cycles and keeps disconnected nodes in the first layer', () => {
    const ns = [node('a'), node('b'), node('c'), node('alone')];
    const out = layoutLayers(ns, [edge('a', 'b'), edge('b', 'c'), edge('c', 'a'), edge('b', 'b')]);
    const p = pos(out);
    expect(p.a!.x).toBeLessThan(p.b!.x);
    expect(p.b!.x).toBeLessThan(p.c!.x);
    expect(p.alone!.x).toBe(0);
    expect(overlaps(out)).toBe(false);
    expect(out.every((n) => n.sourcePosition === Position.Right && n.targetPosition === Position.Left)).toBe(true);
  });

  it('handles a fully cyclic graph and no nodes', () => {
    expect(layoutLayers([node('a'), node('b')], [edge('a', 'b'), edge('b', 'a')])).toHaveLength(2);
    expect(layoutLayers([], [])).toEqual([]);
  });

  it('uses measured widths for the columns', () => {
    const out = pos(layoutLayers([node('a', { measured: { width: 400, height: 50 } }), node('b')], [edge('a', 'b')]));
    expect(out.b!.x).toBeGreaterThanOrEqual(400);
  });

  it('is deterministic', () => {
    const ns = ['a', 'b', 'c', 'd', 'e'].map((id) => node(id));
    const es = [edge('a', 'c'), edge('b', 'c'), edge('c', 'd'), edge('a', 'e'), edge('e', 'd')];
    expect(pos(layoutLayers(ns, es))).toEqual(pos(layoutLayers(ns, es)));
  });
});
