import type * as React from 'react';
import type { Edge, Node, ReactFlowProps } from '@xyflow/react';

/**
 * Status colour of a {@link DiagramNodeData | diagram node}. Always paired with a text
 * equivalent for screen readers, and a border style in forced colours.
 * @alpha
 */
export type DiagramNodeTone = 'default' | 'good' | 'warning' | 'danger';

/**
 * `data` of a node with `type: 'nexub'` (rendered by `DiagramNode`).
 * @alpha
 */
export interface DiagramNodeData extends Record<string, unknown> {
  /** The card's heading; also the node's accessible name and its name in the list view. */
  title: string;
  description?: string;
  /** Decorative icon before the title (hidden from screen readers). */
  icon?: React.ReactNode;
  /** @default 'default' */
  tone?: DiagramNodeTone;
}

/**
 * A React Flow node rendered by `DiagramNode`.
 * @alpha
 */
export type DiagramFlowNode = Node<DiagramNodeData, 'nexub'>;

/**
 * How `DiagramCanvas` positions nodes: `left-right` (layered workflow, or a tidy tree when
 * the graph is a tree), `mind-map` (radial tree), or `none` (use the nodes' own positions).
 * @alpha
 */
export type DiagramLayout = 'left-right' | 'mind-map' | 'none';

/**
 * Every user-facing string of `DiagramCanvas`, in English by default. These are not in
 * `@nexub/core` messages yet, so pass translations here.
 * @alpha
 */
export interface DiagramLabels {
  /** The list view's disclosure. */
  showAsList: string;
  /** In the list view, before a node's outgoing connections. */
  connectsTo: string;
  /** In the list view, before a node's incoming connections. */
  connectedFrom: string;
  /** In the list view, for a node with no connections. */
  noConnections: string;
  /** The button on a focused node, and the Connect menu's name: "Connect Fetch data to…". */
  connectTo: (title: string) => string;
  /** The Connect menu when every other node is already connected. */
  noTargets: string;
  /** Read with every node: how the keyboard works. */
  nodeHint: string;
  /** Read with every node when `readOnly`. */
  nodeHintReadOnly: string;
  /** Live announcements. */
  connected: (source: string, target: string) => string;
  moved: (title: string, x: number, y: number) => string;
  deleted: (count: number) => string;
  /** Text equivalents of the tones (screen readers and the list view). */
  tones: Record<Exclude<DiagramNodeTone, 'default'>, string>;
  /** The zoom controls. */
  controls: string;
  zoomIn: string;
  zoomOut: string;
  fitView: string;
  minimap: string;
}

/** @alpha */
export interface DiagramCanvasProps<N extends Node = Node, E extends Edge = Edge>
  extends Omit<ReactFlowProps<N, E>, 'aria-label' | 'nodeTypes'> {
  /** Names the canvas (role="application"). Required. */
  'aria-label': string;
  /**
   * Positions nodes automatically when nodes or edges change (their ids, sizes or links).
   * Moves made since (drag, Alt+Arrow) are kept until the next change. With uncontrolled
   * `defaultNodes`, the layout is applied once.
   * @default 'none'
   */
  layout?: DiagramLayout;
  /** View only: no dragging, connecting, deleting or selecting. Arrow keys still move focus. */
  readOnly?: boolean;
  /** Show the minimap. @default false */
  minimap?: boolean;
  /** Show the zoom in, zoom out and fit view buttons. @default true */
  controls?: boolean;
  /** Extra node types; `nexub` (DiagramNode) is always there. */
  nodeTypes?: ReactFlowProps<N, E>['nodeTypes'];
  /** Show the "Show as list" text alternative under the canvas. @default true */
  listView?: boolean;
  /** Translated strings (English by default). */
  labels?: Partial<DiagramLabels>;
  /** Grid step for Alt+Arrow moves, in flow units; Shift moves four steps. Defaults to `snapGrid[0]`, else 16. */
  keyboardStep?: number;
}
