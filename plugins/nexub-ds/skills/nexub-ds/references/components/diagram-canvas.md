# Diagram Canvas

Nodes and edges on a themed, keyboard-accessible canvas: workflows and mind maps, with automatic layout and a "Show as list" text alternative. From `@nexub/diagram`, on React Flow.

- Package: `@nexub/diagram` · Category: Diagram · Status: alpha
- Import: `import { DiagramCanvas } from '@nexub/diagram';` `import '@nexub/diagram/styles.css';`
- Install: `npm install @nexub/diagram @xyflow/react`. `@xyflow/react` (React Flow) is a peer dependency: install it next to `@nexub/diagram`. Load the stylesheet after `@nexub/react`’s.
- Web only: Native apps have no diagram editor: on phones, show the same nodes and connections as a list, as the canvas’s "Show as list" view does.
- Docs: https://nexub-ds-docs.pages.dev/components/diagram-canvas

## When to use

- Free-form graphs people build or edit: workflow editors, automations, pipelines.
- Mind maps: one idea in the middle, branches around it (`layout="mind-map"`).
- Read-only maps of how things connect, where the shape matters (`readOnly`).

## When not to use

- Reporting lines and other strict hierarchies people scan by name: use OrgChart or TreeView.
- Steps in a fixed order: use Stepper or a list.
- An app that can’t take React Flow as a dependency (about 50 kB gzip): DiagramCanvas needs `@xyflow/react` installed next to it.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `aria-label` (required) | `string` |  | Names the canvas (role="application"). Required. |
| `nodes / onNodesChange` | `Node[]` |  | React Flow’s controlled nodes. `type: 'nexub'` renders the Nexub card (DiagramNode) from `data: { title, description, icon, tone }`. |
| `edges / onEdgesChange` | `Edge[]` |  | React Flow’s controlled edges. |
| `defaultNodes / defaultEdges` | `Node[] / Edge[]` |  | Uncontrolled instead: the canvas keeps the state, and `layout` applies once. |
| `onConnect` | `(connection: Connection) => void` |  | Called when a handle is dragged to another node, or a node is picked in the "Connect to…" menu (C). Without it, nodes can’t be connected. |
| `layout` | `'left-right' \| 'mind-map' \| 'none'` | `'none'` | `left-right`: a layered workflow (a tidy tree when the graph is a tree). `mind-map`: a radial tree with edges between facing sides. Runs again when node ids, sizes or links change; moves made since are kept until then. |
| `readOnly` | `boolean` |  | View only: no dragging, connecting, deleting or selecting. Arrow keys still move focus between nodes. |
| `minimap` | `boolean` | `false` | Show the minimap. |
| `controls` | `boolean` | `true` | Show the zoom in, zoom out and fit view buttons. |
| `listView` | `boolean` | `true` | Show the "Show as list" text alternative under the canvas: every node with its connections by name. |
| `labels` | `Partial<DiagramLabels>` |  | Every string the canvas shows or announces, English by default. Pass translations here. |
| `keyboardStep` | `number` |  | Grid step for Alt+Arrow moves, in flow units; Shift moves four steps. Defaults to `snapGrid[0]`, else 16. |
| `nodeTypes` | `NodeTypes` |  | Extra node types; `nexub` (DiagramNode) is always there. |
| `fitView` | `boolean` |  | React Flow’s: fit the nodes into view on first render. Animation is skipped under reduced motion. |
| `className` | `string` |  | Sizes the canvas box (24rem tall by default), e.g. `h-96`. |

## Example: Workflow, left to right

Controlled nodes and edges with `layout="left-right"`. Tab to a node, then try the arrow keys, Alt+arrows, C and Delete.

```tsx
'use client';

import * as React from 'react';
import { addEdge, applyEdgeChanges, applyNodeChanges, type Connection, type Edge, type EdgeChange, type NodeChange } from '@xyflow/react';
import { DiagramCanvas, type DiagramFlowNode } from '@nexub/diagram';

const step = (id: string, title: string, data: Partial<DiagramFlowNode['data']> = {}): DiagramFlowNode => ({
  id,
  type: 'nexub',
  position: { x: 0, y: 0 }, // layout="left-right" places the nodes
  data: { title, ...data },
});

const initialNodes: DiagramFlowNode[] = [
  step('signup', 'New sign-up', { description: 'Webhook from the website' }),
  step('enrich', 'Enrich profile', { description: 'Company and role lookup' }),
  step('score', 'Score lead', { tone: 'warning', description: 'Model update pending' }),
  step('welcome', 'Send welcome email', { tone: 'good' }),
  step('crm', 'Create CRM record'),
];

const initialEdges: Edge[] = [
  { id: 'signup-enrich', source: 'signup', target: 'enrich' },
  { id: 'signup-welcome', source: 'signup', target: 'welcome' },
  { id: 'enrich-score', source: 'enrich', target: 'score' },
  { id: 'score-crm', source: 'score', target: 'crm' },
];

export default function Example() {
  const [nodes, setNodes] = React.useState(initialNodes);
  const [edges, setEdges] = React.useState(initialEdges);
  const onNodesChange = React.useCallback((changes: NodeChange<DiagramFlowNode>[]) => setNodes((ns) => applyNodeChanges(changes, ns)), []);
  const onEdgesChange = React.useCallback((changes: EdgeChange<Edge>[]) => setEdges((es) => applyEdgeChanges(changes, es)), []);
  const onConnect = React.useCallback((connection: Connection) => setEdges((es) => addEdge(connection, es)), []);

  // minZoom: React Flow's default (0.5) can't fit four columns into a narrow page with fitView.
  return (
    <div className="w-full">
      <DiagramCanvas
        aria-label="Lead onboarding workflow"
        layout="left-right"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        minZoom={0.3}
      />
    </div>
  );
}
```

## Example: Mind map

`layout="mind-map"` and `readOnly`: a radial tree to look at, not edit.

```tsx
'use client';

import type { Edge } from '@xyflow/react';
import { DiagramCanvas, type DiagramFlowNode } from '@nexub/diagram';

const idea = (id: string, title: string): DiagramFlowNode => ({ id, type: 'nexub', position: { x: 0, y: 0 }, data: { title } });

const nodes: DiagramFlowNode[] = [
  idea('launch', 'Product launch'),
  idea('audience', 'Audience'),
  idea('channels', 'Channels'),
  idea('timeline', 'Timeline'),
  idea('teams', 'Small teams'),
  idea('enterprise', 'Enterprise'),
  idea('email', 'Email'),
  idea('events', 'Events'),
  idea('beta', 'Beta in March'),
];

const link = (source: string, target: string): Edge => ({ id: `${source}-${target}`, source, target });
const edges: Edge[] = [
  link('launch', 'audience'),
  link('launch', 'channels'),
  link('launch', 'timeline'),
  link('audience', 'teams'),
  link('audience', 'enterprise'),
  link('channels', 'email'),
  link('channels', 'events'),
  link('timeline', 'beta'),
];

export default function Example() {
  return (
    <div className="w-full">
      <DiagramCanvas aria-label="Launch plan mind map" layout="mind-map" readOnly defaultNodes={nodes} defaultEdges={edges} fitView minZoom={0.3} minimap />
    </div>
  );
}
```

## Accessibility

- Roles: application (the canvas, named by `aria-label`), group with `aria-roledescription="node"` for each node, named by its title, with the keyboard hint as its description, listbox and option (the "Connect to…" menu), Native `<details>` for "Show as list"
- `Tab`: Moves into the canvas onto one node (roving tabindex: the last focused, else the first in reading order), then on to the zoom controls.
- `Arrow keys`: Move focus to the nearest node in that direction.
- `Home / End`: First or last node in reading order (top to bottom, then by line direction; mirrored in RTL).
- `Alt (Option) + Arrow`: Moves the focused node one grid step (`keyboardStep`); with Shift, four. The new position is announced. Off in `readOnly`.
- `C`: Opens the "Connect <node> to…" menu, the keyboard alternative to dragging a handle. Only with `onConnect`.
- `Up / Down, Home / End, a letter`: In the Connect menu: move through the nodes it can connect to; typing a letter jumps to the next title starting with it.
- `Enter / Space`: In the Connect menu: connects to the active node and announces it.
- `Escape / Tab`: Closes the Connect menu; focus returns to the node.
- `Delete / Backspace`: Removes the selection, or the focused node; focus moves to the next node in reading order and the count is announced.
- One node is in the Tab order at a time; focus follows arrow keys, not the DOM order of React Flow’s nodes.
- After a delete, focus goes to the next node (or the previous one at the end), never to the page.
- Focus rings and the 24px handle hit area come from the tokens.
- Each node is read by its title, then its tone ("Warning") as text, then how the keyboard works.
- Connections, moves and deletes are announced in a polite live region.
- "Show as list" lists every node with what it connects to and is connected from, by name: the text alternative to the drawing.
- Tone is never colour alone: a dot plus text for screen readers and the list view, and a border in forced colours.
- Fit view and animated edges respect reduced motion.
- Every string (`labels`) is English by default: they are not in `@nexub/core` messages yet, so pass translations.

Related: [org-chart](org-chart.md), [tree-view](tree-view.md), [kanban](kanban.md)
