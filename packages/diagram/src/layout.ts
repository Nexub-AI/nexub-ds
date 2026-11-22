// Pure layout helpers: no dependency, no DOM. Each returns new node objects with a
// new `position` (top-left corner, as React Flow expects) and handle sides that
// match the layout; every other field of a node is kept as it was.
import type { Edge, Node, XYPosition } from '@xyflow/react';
import { Position } from '@xyflow/react';

/** Card width used when a node has no `measured`, `width` or `height` yet. @alpha */
export const DEFAULT_NODE_WIDTH = 240;
/** Card height used when a node has no `measured`, `width` or `height` yet. @alpha */
export const DEFAULT_NODE_HEIGHT = 72;

/** Space between neighbouring nodes in a column (or ring), and between columns (or rings). */
const SIBLING_GAP = 24;
const RANK_GAP = 80;
/** Space between separate trees of a forest, and between disconnected parts. */
const TREE_GAP = 48;

/**
 * Options for {@link layoutTree}.
 * @alpha
 */
export interface LayoutTreeOptions {
  /** `left-right`: a tidy tree, roots at the start, children in the next column. `radial`: roots in the middle, each depth on a ring (mind maps). */
  direction: 'left-right' | 'radial';
}

/** The size layouts use for a node: React Flow's measured size, then `width`/`height`, then the default card. @alpha */
export function getNodeSize(node: Pick<Node, 'measured' | 'width' | 'height'>): { width: number; height: number } {
  return {
    width: node.measured?.width ?? node.width ?? DEFAULT_NODE_WIDTH,
    height: node.measured?.height ?? node.height ?? DEFAULT_NODE_HEIGHT,
  };
}

/** Out-edges between known nodes, in edge order, without self-loops or repeats. */
function adjacency(nodes: readonly Node[], edges: readonly Edge[]) {
  const ids = new Set(nodes.map((n) => n.id));
  const out = new Map<string, string[]>();
  const into = new Map<string, string[]>();
  for (const n of nodes) {
    out.set(n.id, []);
    into.set(n.id, []);
  }
  for (const e of edges) {
    if (!ids.has(e.source) || !ids.has(e.target) || e.source === e.target) continue;
    const o = out.get(e.source)!;
    if (o.includes(e.target)) continue;
    o.push(e.target);
    into.get(e.target)!.push(e.source);
  }
  return { out, into };
}

/* ── Tree ─────────────────────────────────────────────────────────────────── */

interface TreeNode {
  id: string;
  depth: number;
  children: TreeNode[];
}

/**
 * A spanning forest of the graph: roots are the nodes with no incoming edge (in input
 * order); each node hangs under the first node that reaches it breadth-first. Nodes only
 * reachable through a cycle, or with every in-edge from a cycle, start a tree of their own.
 */
function spanningForest(nodes: readonly Node[], edges: readonly Edge[]): TreeNode[] {
  const { out, into } = adjacency(nodes, edges);
  const seen = new Set<string>();
  const forest: TreeNode[] = [];
  const grow = (rootId: string) => {
    const root: TreeNode = { id: rootId, depth: 0, children: [] };
    seen.add(rootId);
    const queue = [root];
    for (let i = 0; i < queue.length; i++) {
      const t = queue[i]!;
      for (const c of out.get(t.id)!) {
        if (seen.has(c)) continue;
        seen.add(c);
        const child: TreeNode = { id: c, depth: t.depth + 1, children: [] };
        t.children.push(child);
        queue.push(child);
      }
    }
    forest.push(root);
  };
  for (const n of nodes) if (into.get(n.id)!.length === 0) grow(n.id);
  // Whatever is left sits on a cycle (or below one): start from the first in input order.
  for (const n of nodes) if (!seen.has(n.id)) grow(n.id);
  return forest;
}

function walk(t: TreeNode, fn: (t: TreeNode) => void) {
  fn(t);
  t.children.forEach((c) => walk(c, fn));
}

/**
 * Lays nodes out as a tree (or a forest): a tidy left-to-right tree, or a radial one
 * for mind maps. Edges pick the parent; extra edges (a second parent, a cycle) are kept
 * but do not move nodes. Never throws: cycles and disconnected nodes become their own trees.
 *
 * @alpha
 */
export function layoutTree<N extends Node>(nodes: readonly N[], edges: readonly Edge[], options: LayoutTreeOptions = { direction: 'left-right' }): N[] {
  if (nodes.length === 0) return [];
  const byId = new Map(nodes.map((n) => [n.id, n] as const));
  const size = (id: string) => getNodeSize(byId.get(id)!);
  const forest = spanningForest(nodes, edges);
  const placed = new Map<string, { position: XYPosition; source: Position; target: Position }>();

  if (options.direction === 'radial') {
    // The first tree keeps its root at the origin; the others line up to its right.
    let nextX: number | undefined;
    for (const root of forest) {
      const local = radialTree(root, size);
      let minX = Infinity;
      let maxX = -Infinity;
      for (const [id, c] of local) {
        const s = size(id);
        minX = Math.min(minX, c.x - s.width / 2);
        maxX = Math.max(maxX, c.x + s.width / 2);
      }
      const shift = nextX === undefined ? 0 : nextX - minX;
      const rootCentre = local.get(root.id)!;
      for (const [id, c] of local) {
        const s = size(id);
        const sides = radialSides(c.x - rootCentre.x, c.y - rootCentre.y, id === root.id);
        placed.set(id, { position: { x: c.x + shift - s.width / 2, y: c.y - s.height / 2 }, ...sides });
      }
      nextX = maxX + shift + TREE_GAP;
    }
  } else {
    // Column x: each depth is as wide as its widest node.
    const colWidth: number[] = [];
    forest.forEach((r) =>
      walk(r, (t) => {
        colWidth[t.depth] = Math.max(colWidth[t.depth] ?? 0, size(t.id).width);
      }),
    );
    const colX: number[] = [];
    colWidth.reduce((x, w, d) => ((colX[d] = x), x + w + RANK_GAP), 0);
    // Rows: leaves take the next free slot top to bottom; a parent sits centred on its children.
    let cursor = 0;
    const centreY = new Map<string, number>();
    const place = (t: TreeNode): number => {
      const h = size(t.id).height;
      let cy: number;
      if (t.children.length === 0) {
        cy = cursor + h / 2;
        cursor += h + SIBLING_GAP;
      } else {
        const ys = t.children.map(place);
        cy = (ys[0]! + ys[ys.length - 1]!) / 2;
        // A parent taller than its stacked children would overlap the next subtree.
        cursor = Math.max(cursor, cy + h / 2 + SIBLING_GAP);
      }
      centreY.set(t.id, cy);
      return cy;
    };
    forest.forEach((r, i) => {
      if (i > 0) cursor += TREE_GAP - SIBLING_GAP;
      place(r);
      walk(r, (t) => {
        const s = size(t.id);
        placed.set(t.id, {
          position: { x: colX[t.depth]!, y: centreY.get(t.id)! - s.height / 2 },
          source: Position.Right,
          target: Position.Left,
        });
      });
    });
  }

  return nodes.map((n) => {
    const p = placed.get(n.id)!;
    return { ...n, position: p.position, sourcePosition: p.source, targetPosition: p.target };
  });
}

/** Centres of a radial tree around (0, 0): each subtree gets an angle share by its leaf count. */
function radialTree(root: TreeNode, size: (id: string) => { width: number; height: number }) {
  const leaves = new Map<TreeNode, number>();
  const countLeaves = (t: TreeNode): number => {
    const n = t.children.length === 0 ? 1 : t.children.reduce((s, c) => s + countLeaves(c), 0);
    leaves.set(t, n);
    return n;
  };
  countLeaves(root);
  // Ring radius per depth: far enough from the previous ring, and long enough that the
  // ring's nodes fit around it side by side.
  const perDepth: TreeNode[][] = [];
  walk(root, (t) => (perDepth[t.depth] ??= []).push(t));
  const diag = (id: string) => {
    const s = size(id);
    return Math.hypot(s.width, s.height);
  };
  const radius: number[] = [0];
  for (let d = 1; d < perDepth.length; d++) {
    const ring = perDepth[d]!;
    const maxDiag = Math.max(...ring.map((t) => diag(t.id)));
    const prevDiag = Math.max(...perDepth[d - 1]!.map((t) => diag(t.id)));
    const step = radius[d - 1]! + (prevDiag + maxDiag) / 2 + SIBLING_GAP;
    const around = (ring.reduce((s, t) => s + diag(t.id), 0) + ring.length * SIBLING_GAP) / (2 * Math.PI);
    radius[d] = Math.max(step, around);
  }
  const centres = new Map<string, XYPosition>();
  const place = (t: TreeNode, from: number, to: number) => {
    const angle = (from + to) / 2;
    const r = radius[t.depth]!;
    centres.set(t.id, { x: Math.round(r * Math.cos(angle)), y: Math.round(r * Math.sin(angle)) });
    let start = from;
    for (const c of t.children) {
      const share = ((to - from) * leaves.get(c)!) / leaves.get(t)!;
      place(c, start, start + share);
      start += share;
    }
  };
  // Turn the circle so the first child sits straight to the right (two children: right and left).
  const first = root.children[0];
  const start = first ? -(Math.PI * leaves.get(first)!) / leaves.get(root)! : 0;
  place(root, start, start + 2 * Math.PI);
  centres.set(root.id, { x: 0, y: 0 });
  return centres;
}

/** Handle sides for a radial node: the target faces the middle, the source faces away. */
function radialSides(dx: number, dy: number, isRoot: boolean): { source: Position; target: Position } {
  if (isRoot) return { source: Position.Right, target: Position.Left };
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0 ? { source: Position.Right, target: Position.Left } : { source: Position.Left, target: Position.Right };
  }
  return dy >= 0 ? { source: Position.Bottom, target: Position.Top } : { source: Position.Top, target: Position.Bottom };
}

/* ── Layers ───────────────────────────────────────────────────────────────── */

/** Barycentre sweeps (down then up) used to order each layer. */
const SWEEPS = 4;

/**
 * Lays a directed graph out in left-to-right layers (workflows, pipelines): longest-path
 * layering, then barycentre ordering within each layer to cut edge crossings. Cycles are
 * broken by ignoring the edges that close them (depth-first back edges); disconnected
 * nodes land in the first layer. Never throws.
 *
 * @alpha
 */
export function layoutLayers<N extends Node>(nodes: readonly N[], edges: readonly Edge[]): N[] {
  if (nodes.length === 0) return [];
  const { out } = adjacency(nodes, edges);
  // 1. Break cycles: drop depth-first back edges (visit in input order, so it is stable).
  const state = new Map<string, 1 | 2>();
  const dagOut = new Map<string, string[]>(nodes.map((n) => [n.id, []]));
  const visit = (id: string) => {
    state.set(id, 1);
    for (const t of out.get(id)!) {
      const s = state.get(t);
      if (s === 1) continue; // back edge: closes a cycle
      dagOut.get(id)!.push(t);
      if (s === undefined) visit(t);
    }
    state.set(id, 2);
  };
  for (const n of nodes) if (!state.has(n.id)) visit(n.id);
  const dagIn = new Map<string, string[]>(nodes.map((n) => [n.id, []]));
  for (const [s, ts] of dagOut) for (const t of ts) dagIn.get(t)!.push(s);

  // 2. Longest-path layering in topological order (Kahn).
  const layerOf = new Map<string, number>();
  const indeg = new Map(nodes.map((n) => [n.id, dagIn.get(n.id)!.length]));
  const queue = nodes.filter((n) => indeg.get(n.id) === 0).map((n) => n.id);
  for (let i = 0; i < queue.length; i++) {
    const id = queue[i]!;
    const l = Math.max(0, ...dagIn.get(id)!.map((p) => layerOf.get(p)! + 1));
    layerOf.set(id, l);
    for (const t of dagOut.get(id)!) {
      indeg.set(t, indeg.get(t)! - 1);
      if (indeg.get(t) === 0) queue.push(t);
    }
  }
  const layers: string[][] = [];
  for (const n of nodes) (layers[layerOf.get(n.id)!] ??= []).push(n.id);

  // 3. Barycentre ordering: sort each layer by the mean relative position of its
  //    neighbours in the other layers; a node with none keeps its place.
  const rank = new Map<string, number>();
  const rerank = () => layers.forEach((layer) => layer.forEach((id, i) => rank.set(id, layer.length > 1 ? i / (layer.length - 1) : 0.5)));
  rerank();
  const sortBy = (layer: string[], neighbours: (id: string) => string[]) => {
    const keyed = layer.map((id, i) => {
      const ns = neighbours(id);
      const bc = ns.length ? ns.reduce((s, n) => s + rank.get(n)!, 0) / ns.length : rank.get(id)!;
      return { id, bc, i };
    });
    keyed.sort((a, b) => a.bc - b.bc || a.i - b.i);
    keyed.forEach((k, i) => (layer[i] = k.id));
    rerank();
  };
  for (let s = 0; s < SWEEPS; s++) {
    for (let l = 1; l < layers.length; l++) sortBy(layers[l]!, (id) => dagIn.get(id)!);
    for (let l = layers.length - 2; l >= 0; l--) sortBy(layers[l]!, (id) => dagOut.get(id)!);
  }

  // 4. Coordinates: columns as wide as their widest node; each column centred on the tallest.
  const byId = new Map(nodes.map((n) => [n.id, n] as const));
  const size = (id: string) => getNodeSize(byId.get(id)!);
  const colHeight = layers.map((layer) => layer.reduce((h, id) => h + size(id).height, 0) + SIBLING_GAP * (layer.length - 1));
  const tallest = Math.max(...colHeight);
  const placed = new Map<string, XYPosition>();
  let x = 0;
  layers.forEach((layer, l) => {
    let y = (tallest - colHeight[l]!) / 2;
    let width = 0;
    for (const id of layer) {
      const s = size(id);
      placed.set(id, { x, y });
      y += s.height + SIBLING_GAP;
      width = Math.max(width, s.width);
    }
    x += width + RANK_GAP;
  });

  return nodes.map((n) => ({ ...n, position: placed.get(n.id)!, sourcePosition: Position.Right, targetPosition: Position.Left }));
}
