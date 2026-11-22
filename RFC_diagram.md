# RFC: @nexub/diagram — a themed diagram canvas on React Flow

<!-- The text of the RFC issue (GOVERNANCE.md → RFC process). Open a GitHub issue with this title and the body below. -->

Open for comments for at least **3 working days** from the day this issue is opened. A maintainer then records the decision here (accepted, accepted with changes, or declined) and closes the issue. Planned in `ROADMAP_11.x.md` (gap #34, 11.4). The roadmap already records the owner's choice of approach (decision 3: wrap React Flow as an optional peer, not a canvas of our own); this RFC covers the API of the new package, which GOVERNANCE.md requires for every new package.

## Decision

**Accepted with changes** on 2026-11-22 by the owner. RFC issue #713 was opened 2026-11-21 with no comments; the owner accepted it before the 3 working days had run, waiving the rest of the comment period. Changes to the text below:

1. It ships in **11.6**, not 11.4 (11.4 shipped before the decision).
2. `tone` is a field of a node's `data` (`default` / `good` / `warning` / `danger`), not a `DiagramCanvas` prop.
3. The size budgets measure `@nexub/diagram`'s own code with `@xyflow/react` left external; React Flow is an optional peer, so only apps that draw diagrams pay for it.

## Problem

Two products draw node-and-edge diagrams by hand: the Mind mind map and the Command Hub Studio workflow editor. Each has its own canvas with its own node look, no keyboard access, and colours outside the design tokens. The platform's gaps doc lists this as gap #34.

## Proposal

A new package, **`@nexub/diagram`** (`packages/diagram`), that wraps **React Flow** (`@xyflow/react`) as an **optional peer dependency**: apps that draw diagrams install it; `@nexub/react` does not depend on it. The package gives:

- themed nodes, edges, handles, minimap and controls on the design tokens (light, dark, forced colours, every product accent);
- keyboard access: Tab and arrow keys move focus between nodes, Arrow keys with a modifier move the focused node, a "Connect to…" menu creates an edge without dragging, Delete removes the selection;
- a layout helper for mind maps (radial / left-right tree) and left-to-right workflows, with no layout dependency (a small tidy-tree for trees, a layered layout for DAGs).

## API

```tsx
import { DiagramCanvas, DiagramNode, layoutTree } from '@nexub/diagram';
import '@nexub/diagram/styles.css';

<DiagramCanvas
  aria-label="Onboarding workflow"
  nodes={nodes}            // React Flow nodes; `type: 'nexub'` renders DiagramNode
  edges={edges}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onConnect={onConnect}
  minimap                  // boolean, default false
  controls                 // zoom and fit buttons, default true
  readOnly={false}
  layout="left-right"      // 'left-right' | 'mind-map' | 'none' (default)
/>
```

- `DiagramCanvas`: React Flow's props plus `layout`, `readOnly`, `minimap`, `controls`, `aria-label`, `tone` per node (`default` / `good` / `warning` / `danger`).
- `DiagramNode`: a card node (title, description, icon, status tone, handles on the sides).
- `layoutTree(nodes, edges, { direction })`, `layoutLayers(nodes, edges)`: pure functions returning positioned nodes.

Status `alpha`.

## Accessibility

React Flow's own keyboard support (focusable nodes and edges, `aria-label`s) plus the additions above: a roving focus order by layout position, an announced "Connect to…" menu as the keyboard alternative to dragging a handle, visible focus rings from the tokens, 24px minimum handles, reduced motion for animated edges and fit-view. The canvas has a text alternative: a "Show as list" view of the nodes and their connections (as `tableView` on charts in 11.3).

## Web + native parity

Web only. Native has no diagram editor; mobile shows the list view.

## Alternatives

- **A canvas of our own**: decided against by the owner (roadmap decision 3): far more work for panning, zooming, hit-testing and touch.
- **React Flow directly, styled per app**: each app themes and adds keyboard access again; the point of the gap is one shared look.
- **A hard dependency of `@nexub/react`**: adds about 50 kB gzip to every app; an optional peer in its own package keeps it out.

## Migration

None: a new package. Needs a `dependency-policy.json` entry for the `@xyflow/react` peer (MIT), its own size budget, and the reference screens (Mind mind map, Command Hub Studio) checked before `beta`.
