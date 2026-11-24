import * as React from 'react';
import {
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  useStore,
  useStoreApi,
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
  type NodeTypes,
  type XYPosition,
} from '@xyflow/react';
import { ConnectMenu } from './ConnectMenu.js';
import { DiagramContext, type DiagramContextValue } from './context.js';
import { DiagramListView } from './DiagramListView.js';
import { DiagramNode } from './DiagramNode.js';
import { arrowDirections, flowOrder, nearestInDirection, nodeTitle, type NodeBox } from './keyboard.js';
import { useNexubMessages } from '@nexub/react/NexubProvider';
import { diagramLabelsFrom } from './labels.js';
import { getNodeSize, layoutLayers, layoutTree } from './layout.js';
import type { DiagramCanvasProps, DiagramLabels, DiagramLayout } from './types.js';
import { cx } from './cx.js';

const builtinNodeTypes: NodeTypes = { nexub: DiagramNode };
const DEFAULT_STEP = 16;
const NODE_SELECTOR = '.react-flow__node';
const EDGE_SELECTOR = '.react-flow__edge';

/* ── Layout ───────────────────────────────────────────────────────────────── */

type Placement = Map<string, Pick<Node, 'position' | 'sourcePosition' | 'targetPosition'>>;

/** A tree: no node has two parents and following edges never comes back. */
function isForest(nodes: readonly Node[], edges: readonly Edge[]): boolean {
  const ids = new Set(nodes.map((n) => n.id));
  const parent = new Map<string, string>();
  for (const e of edges) {
    if (!ids.has(e.source) || !ids.has(e.target)) continue;
    if (e.source === e.target || parent.has(e.target)) return false;
    parent.set(e.target, e.source);
  }
  for (const start of parent.keys()) {
    const seen = new Set<string>();
    for (let id: string | undefined = start; id !== undefined; id = parent.get(id)) {
      if (seen.has(id)) return false;
      seen.add(id);
    }
  }
  return true;
}

function runLayout(layout: Exclude<DiagramLayout, 'none'>, nodes: readonly Node[], edges: readonly Edge[]): Placement {
  const laid =
    layout === 'mind-map'
      ? layoutTree(nodes, edges, { direction: 'radial' })
      : isForest(nodes, edges)
        ? layoutTree(nodes, edges, { direction: 'left-right' })
        : layoutLayers(nodes, edges);
  return new Map(laid.map((n) => [n.id, { position: n.position, sourcePosition: n.sourcePosition, targetPosition: n.targetPosition }]));
}

/** What a layout depends on: node ids and sizes, and the links. Positions are not part of it. */
function layoutSignature(nodes: readonly Node[], edges: readonly Edge[]): string {
  const n = nodes.map((node) => {
    const s = getNodeSize(node);
    return `${node.id}:${s.width}x${s.height}`;
  });
  const e = edges.map((edge) => `${edge.source}>${edge.target}`);
  return `${n.join('|')}#${e.join('|')}`;
}

function withAriaLabel<N extends Node>(node: N): N {
  return node.ariaLabel ? node : { ...node, ariaLabel: nodeTitle(node) };
}

/**
 * Mind maps: edges between two DiagramNodes attach to the sides that face each other
 * (DiagramNode renders a handle on every side in this layout, ids `s-<side>` / `t-<side>`).
 * Edges that name their own handles, or touch other node types, are left alone.
 */
function withFacingHandles<E extends Edge>(edges: readonly E[] | undefined, nodes: readonly Node[] | undefined): E[] | undefined {
  if (!edges || !nodes) return edges as E[] | undefined;
  const byId = new Map(nodes.map((n) => [n.id, n] as const));
  const centre = (n: Node) => {
    const s = getNodeSize(n);
    return { x: n.position.x + s.width / 2, y: n.position.y + s.height / 2 };
  };
  return edges.map((e) => {
    const a = byId.get(e.source);
    const b = byId.get(e.target);
    if (!a || !b || a.type !== 'nexub' || b.type !== 'nexub' || e.sourceHandle || e.targetHandle) return e;
    const ca = centre(a);
    const cb = centre(b);
    const dx = cb.x - ca.x;
    const dy = cb.y - ca.y;
    const [from, to] = Math.abs(dx) >= Math.abs(dy) ? (dx >= 0 ? ['right', 'left'] : ['left', 'right']) : dy >= 0 ? ['bottom', 'top'] : ['top', 'bottom'];
    return { ...e, sourceHandle: `s-${from}`, targetHandle: `t-${to}` };
  });
}

/* ── Hooks ────────────────────────────────────────────────────────────────── */

/** True when a ReactFlowProvider is already above (the hook only reads context, then throws without one). */
function useHasFlowProvider(): boolean {
  try {
    useStoreApi();
    return true;
  } catch {
    return false;
  }
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return reduced;
}

/* ── DiagramCanvas ────────────────────────────────────────────────────────── */

/**
 * A themed, keyboard-accessible diagram canvas on React Flow. Takes React Flow's props
 * (controlled `nodes`/`edges` with `onNodesChange`/`onEdgesChange`/`onConnect`, or
 * `defaultNodes`/`defaultEdges`), plus automatic `layout`, `readOnly`, `minimap` and
 * `controls`, and renders a "Show as list" text alternative under the canvas.
 * `className` and `style` size the canvas box (24rem tall by default).
 *
 * Keyboard, on a focused node: arrow keys move focus to the nearest node that way, Home
 * and End to the first and last in reading order; Alt (Option) + arrow moves the node one
 * grid step (Shift: four); C opens the "Connect to…" menu; Delete or Backspace removes
 * the selection (or the focused node). In `readOnly` only focus moves.
 *
 * Uses the ReactFlowProvider above it when there is one, else its own.
 *
 * @alpha
 */
export function DiagramCanvas<N extends Node = Node, E extends Edge = Edge>(props: DiagramCanvasProps<N, E>) {
  const { nodes, edges, defaultNodes, layout = 'none', onNodesChange } = props;
  const hasProvider = useHasFlowProvider();

  // Controlled: re-run the layout when the signature changes, keep moves as offsets until then.
  const cache = React.useRef<{ key: string; placement: Placement | null }>({ key: '', placement: null });
  const signature = layout !== 'none' && nodes ? `${layout}@${layoutSignature(nodes, edges ?? [])}` : '';
  if (cache.current.key !== signature) {
    cache.current = { key: signature, placement: signature && nodes ? runLayout(layout as Exclude<DiagramLayout, 'none'>, nodes, edges ?? []) : null };
  }
  const placement = cache.current.placement;
  const [offsets, setOffsets] = React.useState<{ key: string; map: Map<string, XYPosition> }>({ key: '', map: new Map() });
  const offsetMap = offsets.key === signature ? offsets.map : null;

  const renderedNodes = React.useMemo(() => {
    if (!nodes) return undefined;
    return nodes.map((n) => {
      const p = placement?.get(n.id);
      if (!p) return withAriaLabel(n);
      const o = offsetMap?.get(n.id);
      return withAriaLabel({
        ...n,
        position: o ? { x: p.position.x + o.x, y: p.position.y + o.y } : p.position,
        sourcePosition: p.sourcePosition,
        targetPosition: p.targetPosition,
      });
    });
  }, [nodes, placement, offsetMap]);

  // Uncontrolled: lay the default nodes out once.
  const [initialDefaultNodes] = React.useState(() => {
    if (!defaultNodes) return undefined;
    if (layout === 'none') return defaultNodes.map(withAriaLabel);
    const p = runLayout(layout, defaultNodes, props.defaultEdges ?? []);
    return defaultNodes.map((n) => withAriaLabel({ ...n, ...p.get(n.id) }));
  });

  const renderedEdges = React.useMemo(() => (layout === 'mind-map' ? withFacingHandles(edges, renderedNodes) : edges), [layout, edges, renderedNodes]);
  const [initialDefaultEdges] = React.useState(() =>
    layout === 'mind-map' ? withFacingHandles(props.defaultEdges, initialDefaultNodes) : props.defaultEdges,
  );

  const handleNodesChange = React.useCallback(
    (changes: NodeChange<N>[]) => {
      if (placement) {
        const moved = changes.filter((c) => c.type === 'position' && c.position && placement.has(c.id));
        if (moved.length) {
          setOffsets((prev) => {
            const map = new Map(prev.key === signature ? prev.map : undefined);
            for (const c of moved) {
              if (c.type !== 'position' || !c.position) continue;
              const base = placement.get(c.id)!.position;
              map.set(c.id, { x: c.position.x - base.x, y: c.position.y - base.y });
            }
            return { key: signature, map };
          });
        }
      }
      onNodesChange?.(changes);
    },
    [placement, signature, onNodesChange],
  );

  const inner = (
    <DiagramCanvasInner
      {...(props as unknown as DiagramCanvasProps)}
      nodes={renderedNodes}
      edges={renderedEdges as Edge[] | undefined}
      defaultNodes={initialDefaultNodes}
      defaultEdges={initialDefaultEdges as Edge[] | undefined}
      onNodesChange={handleNodesChange as unknown as DiagramCanvasProps['onNodesChange']}
    />
  );
  if (hasProvider) return inner;
  return (
    <ReactFlowProvider
      initialNodes={renderedNodes}
      initialEdges={renderedEdges}
      defaultNodes={initialDefaultNodes}
      defaultEdges={initialDefaultEdges}
      initialWidth={props.width}
      initialHeight={props.height}
      fitView={props.fitView}
      initialFitViewOptions={props.fitViewOptions}
      initialMinZoom={props.minZoom}
      initialMaxZoom={props.maxZoom}
      nodeOrigin={props.nodeOrigin}
      nodeExtent={props.nodeExtent}
    >
      {inner}
    </ReactFlowProvider>
  );
}

/* ── Inside the provider ──────────────────────────────────────────────────── */

function DiagramCanvasInner(props: DiagramCanvasProps) {
  const {
    'aria-label': ariaLabel,
    layout = 'none',
    readOnly = false,
    minimap = false,
    controls = true,
    listView = true,
    nodeTypes,
    labels: labelOverrides,
    keyboardStep,
    className,
    style,
    children,
    ariaLabelConfig,
    fitViewOptions,
    deleteKeyCode,
    onConnect,
    isValidConnection,
    nodesConnectable,
    nodesDraggable,
    ...flowProps
  } = props;

  const messages = useNexubMessages();
  const labels = React.useMemo<DiagramLabels>(() => ({ ...diagramLabelsFrom(messages), ...labelOverrides }), [messages, labelOverrides]);
  const store = useStoreApi();
  const { deleteElements } = useReactFlow();
  const storeNodes = useStore((s) => s.nodes);
  const storeEdges = useStore((s) => s.edges);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [activeEdgeId, setActiveEdgeId] = React.useState<string | null>(null);
  const [connectFrom, setConnectFrom] = React.useState<string | null>(null);
  const [announcement, setAnnouncement] = React.useState('');
  /** Where focus goes after the next render: a node, or an edge (a node or edge just went). */
  const pendingFocus = React.useRef<{ edge?: boolean; id: string } | null>(null);
  /** Ids passed to deleteElements and not removed yet. */
  const deleting = React.useRef({ nodes: new Set<string>(), edges: new Set<string>() });
  const reducedMotion = usePrefersReducedMotion();

  const canConnect = !readOnly && !!onConnect && nodesConnectable !== false;
  const ownDelete = !readOnly && deleteKeyCode === undefined;
  const allNodeTypes = React.useMemo(() => ({ ...nodeTypes, ...builtinNodeTypes }), [nodeTypes]);

  const isRtl = () => rootRef.current?.closest('[dir]')?.getAttribute('dir') === 'rtl';

  /** Every visible node with its absolute box, from the store (measured sizes when known). */
  const boxes = React.useCallback((): NodeBox[] => {
    const { nodeLookup } = store.getState();
    const out: NodeBox[] = [];
    for (const n of store.getState().nodes) {
      const internal = nodeLookup.get(n.id);
      if (n.hidden || !internal) continue;
      const s = getNodeSize(internal);
      const p = internal.internals.positionAbsolute;
      out.push({ id: n.id, x: p.x, y: p.y, width: s.width, height: s.height });
    }
    return out;
  }, [store]);

  // storeNodes is the dependency: the order follows the nodes' positions (and, in a mind map, the edges).
  const order = React.useMemo(
    () => flowOrder(boxes(), layout, storeEdges, isRtl()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [boxes, storeNodes, storeEdges, layout],
  );
  const effectiveActive = activeId && order.includes(activeId) ? activeId : order[0];

  // 11.9: edges in the order of their nodes (source, then target), for the edges' own Tab stop.
  const edgeOrder = React.useMemo(() => {
    const rank = new Map(order.map((id, i) => [id, i]));
    return storeEdges
      .filter((e) => !e.hidden && rank.has(e.source) && rank.has(e.target))
      .sort((a, b) => rank.get(a.source)! - rank.get(b.source)! || rank.get(a.target)! - rank.get(b.target)!)
      .map((e) => e.id);
  }, [storeEdges, order]);
  const effectiveEdge = activeEdgeId && edgeOrder.includes(activeEdgeId) ? activeEdgeId : edgeOrder[0];

  const elementOf = (selector: string, id: string) =>
    Array.from(rootRef.current?.querySelectorAll<HTMLElement>(selector) ?? []).find((el) => el.getAttribute('data-id') === id);
  const nodeElement = (id: string) => elementOf(NODE_SELECTOR, id);

  const focusNode = (id: string) => {
    setActiveId(id);
    nodeElement(id)?.focus();
  };
  const focusEdge = (id: string) => {
    setActiveEdgeId(id);
    elementOf(EDGE_SELECTOR, id)?.focus();
  };

  const titleOf = (id: string) => nodeTitle(store.getState().nodeLookup.get(id));

  // Roving tabindex: one node in the Tab order (the last focused, else the first in reading
  // order), and one edge (11.9: every edge used to be a Tab stop of its own, before the nodes).
  // React Flow renders tabIndex=0 on every node and edge and never rewrites an unchanged prop.
  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>(NODE_SELECTOR).forEach((el) => {
      if (el.getAttribute('tabindex') === null) return;
      el.tabIndex = el.getAttribute('data-id') === effectiveActive ? 0 : -1;
    });
    const edgeById = new Map(storeEdges.map((e) => [e.id, e] as const));
    root.querySelectorAll<SVGElement>(EDGE_SELECTOR).forEach((el) => {
      const id = el.getAttribute('data-id');
      const edge = id === null ? undefined : edgeById.get(id);
      if (!edge) return;
      if (el.getAttribute('tabindex') !== null) el.tabIndex = id === effectiveEdge ? 0 : -1;
      // 11.9: named by the nodes' titles; React Flow's default names them by id ("Edge from n1 to n2").
      if (edge.ariaLabel === undefined || edge.ariaLabel === '') el.setAttribute('aria-label', labels.edge(titleOf(edge.source), titleOf(edge.target)));
      // Each edge sits in an <svg> of its own, which browsers expose as an image around it.
      const svg = el.parentElement;
      if (svg?.localName === 'svg' && svg.getAttribute('role') !== 'none') svg.setAttribute('role', 'none');
    });
    for (const id of deleting.current.edges) if (!edgeById.has(id)) deleting.current.edges.delete(id);
    for (const id of deleting.current.nodes) if (!order.includes(id)) deleting.current.nodes.delete(id);
    let pending = pendingFocus.current;
    // The edge focus was to go to went too (two quick deletes): the first edge left, else the first node.
    if (pending?.edge && !edgeById.has(pending.id)) pending = pendingFocus.current = edgeOrder[0] ? { edge: true, id: edgeOrder[0] } : order[0] ? { id: order[0] } : null;
    if (pending) {
      const el = elementOf(pending.edge ? EDGE_SELECTOR : NODE_SELECTOR, pending.id);
      if (el) {
        pendingFocus.current = null;
        el.focus();
      }
    }
  });

  /**
   * Polite, into the region below. The same text twice in a row (two single deletes) changes
   * the region all the same, with a trailing no-break space, so it is announced again.
   */
  const announce = (text: string) => setAnnouncement((prev) => (prev === text ? `${text}\u00a0` : text));

  /** The item after `id` in `list` that `keep` allows, else the one before it. */
  const neighbour = (list: readonly string[], id: string, keep: (id: string) => boolean) => {
    const i = list.indexOf(id);
    return list.slice(i + 1).find(keep) ?? [...list.slice(0, Math.max(0, i))].reverse().find(keep);
  };

  /** Delete: the selection, else the focused node or edge. Focus moves on to a neighbour. */
  const deleteSelection = (focused: { node?: string; edge?: string } = {}) => {
    const state = store.getState();
    let nodesToDelete = state.nodes.filter((n) => n.selected && n.deletable !== false);
    let edgesToDelete = state.edges.filter((e) => e.selected && e.deletable !== false);
    if (!nodesToDelete.length && !edgesToDelete.length) {
      if (focused.node) nodesToDelete = state.nodes.filter((n) => n.id === focused.node && n.deletable !== false);
      else if (focused.edge) edgesToDelete = state.edges.filter((e) => e.id === focused.edge && e.deletable !== false);
    }
    if (!nodesToDelete.length && !edgesToDelete.length) return;
    // Deletes still in flight (a quick second Delete) count as gone.
    const goneNodes = new Set([...nodesToDelete.map((n) => n.id), ...deleting.current.nodes]);
    if (focused.node && goneNodes.has(focused.node)) {
      // The next node in reading order (or the previous one at the end).
      const next = neighbour(order, focused.node, (id) => !goneNodes.has(id));
      pendingFocus.current = next ? { id: next } : null;
      if (next) setActiveId(next);
    } else if (focused.edge && edgesToDelete.some((e) => e.id === focused.edge)) {
      // The next edge that stays (an edge goes with either of its nodes), else a node.
      const goneEdges = new Set([...edgesToDelete.map((e) => e.id), ...deleting.current.edges]);
      const byId = new Map(state.edges.map((e) => [e.id, e] as const));
      const stays = (id: string) => {
        const edge = byId.get(id);
        return !!edge && !goneEdges.has(id) && !goneNodes.has(edge.source) && !goneNodes.has(edge.target);
      };
      const next = neighbour(edgeOrder, focused.edge, stays);
      const node = next ? undefined : order.find((id) => !goneNodes.has(id));
      pendingFocus.current = next ? { edge: true, id: next } : node ? { id: node } : null;
      if (next) setActiveEdgeId(next);
    }
    const inFlight = { nodes: nodesToDelete.map((n) => n.id), edges: edgesToDelete.map((e) => e.id) };
    inFlight.nodes.forEach((id) => deleting.current.nodes.add(id));
    inFlight.edges.forEach((id) => deleting.current.edges.add(id));
    void deleteElements({ nodes: nodesToDelete, edges: edgesToDelete }).then(({ deletedNodes, deletedEdges }) => {
      // What onBeforeDelete kept stays; the rest leaves the set once it is out of the store (the effect).
      const nodesGone = new Set(deletedNodes.map((n) => n.id));
      const edgesGone = new Set(deletedEdges.map((e) => e.id));
      inFlight.nodes.forEach((id) => !nodesGone.has(id) && deleting.current.nodes.delete(id));
      inFlight.edges.forEach((id) => !edgesGone.has(id) && deleting.current.edges.delete(id));
      const count = deletedNodes.length + deletedEdges.length;
      if (count) announce(labels.deleted(count, deletedNodes.map((n) => nodeTitle(n))));
    });
  };

  const onEdgeKeyDown = (e: React.KeyboardEvent, id: string) => {
    const direction = arrowDirections[e.key];
    if ((direction || e.key === 'Home' || e.key === 'End') && !e.altKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      e.stopPropagation();
      const i = edgeOrder.indexOf(id);
      const back = direction === 'up' || direction === 'left';
      const target =
        e.key === 'Home'
          ? edgeOrder[0]
          : e.key === 'End'
            ? edgeOrder[edgeOrder.length - 1]
            : edgeOrder[back ? Math.max(0, i - 1) : Math.min(edgeOrder.length - 1, i + 1)];
      if (target) focusEdge(target);
      return;
    }
    if ((e.key === 'Delete' || e.key === 'Backspace') && ownDelete) {
      e.preventDefault();
      e.stopPropagation();
      deleteSelection({ edge: id });
    }
  };

  const onNodeKeyDown = (e: React.KeyboardEvent, id: string) => {
    const direction = arrowDirections[e.key];
    if (direction && !e.altKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      e.stopPropagation();
      const next = nearestInDirection(boxes(), id, direction);
      if (next) focusNode(next);
      return;
    }
    if ((e.key === 'Home' || e.key === 'End') && !e.altKey) {
      e.preventDefault();
      e.stopPropagation();
      const target = e.key === 'Home' ? order[0] : order[order.length - 1];
      if (target) focusNode(target);
      return;
    }
    if (readOnly) {
      // React Flow's own arrow moves, too, are off.
      if (direction) e.stopPropagation();
      return;
    }
    if (direction && e.altKey) {
      e.preventDefault();
      e.stopPropagation();
      const state = store.getState();
      const internal = state.nodeLookup.get(id);
      if (!internal) return;
      const draggable = internal.draggable ?? state.nodesDraggable;
      if (!draggable) return;
      const step = (keyboardStep ?? (flowProps.snapToGrid ? flowProps.snapGrid?.[0] : undefined) ?? DEFAULT_STEP) * (e.shiftKey ? 4 : 1);
      const dx = direction === 'left' ? -step : direction === 'right' ? step : 0;
      const dy = direction === 'up' ? -step : direction === 'down' ? step : 0;
      const position = { x: internal.position.x + dx, y: internal.position.y + dy };
      state.triggerNodeChanges([{ id, type: 'position', position, dragging: false }]);
      announce(labels.moved(nodeTitle(internal), Math.round(position.x), Math.round(position.y)));
      return;
    }
    if ((e.key === 'c' || e.key === 'C') && !e.altKey && !e.ctrlKey && !e.metaKey && canConnect) {
      const internal = store.getState().nodeLookup.get(id);
      if (internal?.connectable === false) return;
      e.preventDefault();
      e.stopPropagation();
      setConnectFrom(id);
      return;
    }
    if ((e.key === 'Delete' || e.key === 'Backspace') && ownDelete) {
      e.preventDefault();
      e.stopPropagation();
      deleteSelection({ node: id });
    }
  };

  const onKeyDownCapture = (e: React.KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-diagram-connect-menu]')) return;
    if (target.matches?.(NODE_SELECTOR)) {
      const id = target.getAttribute('data-id');
      if (id) onNodeKeyDown(e, id);
      return;
    }
    const edge = target.closest?.(EDGE_SELECTOR);
    if (edge && target.closest('.react-flow')) {
      const id = edge.getAttribute('data-id');
      if (id) onEdgeKeyDown(e, id);
      return;
    }
    // The pane: Delete removes the selection.
    if ((e.key === 'Delete' || e.key === 'Backspace') && ownDelete && target.closest('.react-flow') && !target.closest('input, textarea, [contenteditable="true"]')) {
      e.preventDefault();
      deleteSelection();
    }
  };

  const onFocusCapture = (e: React.FocusEvent) => {
    const target = e.target as HTMLElement;
    if (target.matches?.(NODE_SELECTOR)) {
      const id = target.getAttribute('data-id');
      if (id && id !== activeId) setActiveId(id);
      return;
    }
    const edgeId = target.closest?.(EDGE_SELECTOR)?.getAttribute('data-id');
    if (edgeId && edgeId !== activeEdgeId) setActiveEdgeId(edgeId);
  };

  const closeConnect = (refocus = true) => {
    const from = connectFrom;
    setConnectFrom(null);
    if (refocus && from) pendingFocus.current = { id: from };
  };

  const pickTarget = (target: string) => {
    if (!connectFrom) return;
    const connection: Connection = { source: connectFrom, target, sourceHandle: null, targetHandle: null };
    if (isValidConnection && !isValidConnection(connection)) return;
    onConnect?.(connection);
    announce(labels.connected(titleOf(connectFrom), titleOf(target)));
    closeConnect();
  };

  const connectOptions = React.useMemo(() => {
    if (!connectFrom) return [];
    const linked = new Set(storeEdges.filter((e) => e.source === connectFrom).map((e) => e.target));
    const byId = new Map(storeNodes.map((n) => [n.id, n] as const));
    return order.filter((id) => id !== connectFrom && !linked.has(id)).map((id) => ({ id, title: nodeTitle(byId.get(id)) }));
  }, [connectFrom, storeEdges, storeNodes, order]);

  const context = React.useMemo<DiagramContextValue>(
    () => ({ layout, readOnly, labels, openConnect: canConnect ? (id: string) => setConnectFrom(id) : undefined }),
    [layout, readOnly, labels, canConnect],
  );

  const fitOptions = reducedMotion ? { ...fitViewOptions, duration: 0 } : fitViewOptions;
  const hint = readOnly ? labels.nodeHintReadOnly : labels.nodeHint;
  const edgeHint = readOnly ? labels.edgeHintReadOnly : labels.edgeHint;

  return (
    <DiagramContext.Provider value={context}>
      <div className="nx-diagram flex flex-col gap-2" data-readonly={readOnly ? '' : undefined} data-layout={layout}>
        <div ref={rootRef} className={cx('nx-diagram-canvas relative', className)} style={style} onKeyDownCapture={onKeyDownCapture} onFocusCapture={onFocusCapture}>
          <ReactFlow
            {...flowProps}
            aria-label={ariaLabel}
            nodeTypes={allNodeTypes}
            fitViewOptions={fitOptions}
            onConnect={readOnly ? undefined : onConnect}
            isValidConnection={isValidConnection}
            nodesDraggable={readOnly ? false : nodesDraggable}
            nodesConnectable={readOnly ? false : nodesConnectable}
            elementsSelectable={readOnly ? false : flowProps.elementsSelectable}
            edgesReconnectable={readOnly ? false : flowProps.edgesReconnectable}
            connectOnClick={readOnly ? false : flowProps.connectOnClick}
            deleteKeyCode={readOnly ? null : deleteKeyCode === undefined ? null : deleteKeyCode}
            ariaLabelConfig={{
              'node.a11yDescription.default': hint,
              'node.a11yDescription.keyboardDisabled': hint,
              'edge.a11yDescription.default': edgeHint,
              'controls.ariaLabel': labels.controls,
              'controls.zoomIn.ariaLabel': labels.zoomIn,
              'controls.zoomOut.ariaLabel': labels.zoomOut,
              'controls.fitView.ariaLabel': labels.fitView,
              'minimap.ariaLabel': labels.minimap,
              ...ariaLabelConfig,
            }}
          >
            {controls ? <Controls showInteractive={false} fitViewOptions={fitOptions} /> : null}
            {minimap ? <MiniMap pannable zoomable /> : null}
            {children}
          </ReactFlow>
          {connectFrom ? (
            <ConnectMenu
              label={labels.connectTo(titleOf(connectFrom))}
              emptyLabel={labels.noTargets}
              options={connectOptions}
              onPick={pickTarget}
              onClose={closeConnect}
            />
          ) : null}
          <div aria-live="polite" aria-atomic="true" className="sr-only" data-diagram-live="">
            {announcement}
          </div>
        </div>
        {listView ? <DiagramListView nodes={storeNodes} edges={storeEdges} order={order} labels={labels} /> : null}
      </div>
    </DiagramContext.Provider>
  );
}
