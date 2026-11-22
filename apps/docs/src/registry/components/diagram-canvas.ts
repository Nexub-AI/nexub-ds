import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'diagram-canvas',
    title: 'Diagram Canvas',
    description: 'Nodes and edges on a themed, keyboard-accessible canvas: workflows and mind maps, with automatic layout and a "Show as list" text alternative. From `@nexub/diagram`, on React Flow.',
    category: 'Diagram',
    package: '@nexub/diagram',
    status: 'alpha',
    addedIn: '11.6.0',
    related: ['org-chart', 'tree-view', 'kanban'],
    webOnly: 'Native apps have no diagram editor: on phones, show the same nodes and connections as a list, as the canvas’s "Show as list" view does.',
  },
  usage: {
    whenToUse: [
      'Free-form graphs people build or edit: workflow editors, automations, pipelines.',
      'Mind maps: one idea in the middle, branches around it (`layout="mind-map"`).',
      'Read-only maps of how things connect, where the shape matters (`readOnly`).',
    ],
    whenNotToUse: [
      'Reporting lines and other strict hierarchies people scan by name: use OrgChart or TreeView.',
      'Steps in a fixed order: use Stepper or a list.',
      'An app that can’t take React Flow as a dependency (about 50 kB gzip): DiagramCanvas needs `@xyflow/react` installed next to it.',
    ],
  },
  props: [
    { name: 'aria-label', type: 'string', required: true, description: 'Names the canvas (role="application"). Required.' },
    { name: 'nodes / onNodesChange', type: 'Node[]', description: 'React Flow’s controlled nodes. `type: \'nexub\'` renders the Nexub card (DiagramNode) from `data: { title, description, icon, tone }`.' },
    { name: 'edges / onEdgesChange', type: 'Edge[]', description: 'React Flow’s controlled edges.' },
    { name: 'defaultNodes / defaultEdges', type: 'Node[] / Edge[]', description: 'Uncontrolled instead: the canvas keeps the state, and `layout` applies once.' },
    { name: 'onConnect', type: '(connection: Connection) => void', description: 'Called when a handle is dragged to another node, or a node is picked in the "Connect to…" menu (C). Without it, nodes can’t be connected.' },
    { name: 'layout', type: "'left-right' | 'mind-map' | 'none'", default: "'none'", description: '`left-right`: a layered workflow (a tidy tree when the graph is a tree). `mind-map`: a radial tree with edges between facing sides. Runs again when node ids, sizes or links change; moves made since are kept until then.' },
    { name: 'readOnly', type: 'boolean', description: 'View only: no dragging, connecting, deleting or selecting. Arrow keys still move focus between nodes.' },
    { name: 'minimap', type: 'boolean', default: 'false', description: 'Show the minimap.' },
    { name: 'controls', type: 'boolean', default: 'true', description: 'Show the zoom in, zoom out and fit view buttons.' },
    { name: 'listView', type: 'boolean', default: 'true', description: 'Show the "Show as list" text alternative under the canvas: every node with its connections by name.' },
    { name: 'labels', type: 'Partial<DiagramLabels>', description: 'Every string the canvas shows or announces, English by default. Pass translations here.' },
    { name: 'keyboardStep', type: 'number', description: 'Grid step for Alt+Arrow moves, in flow units; Shift moves four steps. Defaults to `snapGrid[0]`, else 16.' },
    { name: 'nodeTypes', type: 'NodeTypes', description: 'Extra node types; `nexub` (DiagramNode) is always there.' },
    { name: 'fitView', type: 'boolean', description: 'React Flow’s: fit the nodes into view on first render. Animation is skipped under reduced motion.' },
    { name: 'className', type: 'string', description: 'Sizes the canvas box (24rem tall by default), e.g. `h-96`.' },
  ],
  examples: [
    { title: 'Workflow, left to right', description: 'Controlled nodes and edges with `layout="left-right"`. Tab to a node, then try the arrow keys, Alt+arrows, C and Delete.' },
    { title: 'Mind map', description: '`layout="mind-map"` and `readOnly`: a radial tree to look at, not edit.' },
  ],
  a11y: {
    roles: [
      'application (the canvas, named by `aria-label`)',
      'group with `aria-roledescription="node"` for each node, named by its title, with the keyboard hint as its description',
      'listbox and option (the "Connect to…" menu)',
      'Native `<details>` for "Show as list"',
    ],
    keyboard: [
      { key: 'Tab', description: 'Moves into the canvas onto one node (roving tabindex: the last focused, else the first in reading order), then on to the zoom controls.' },
      { key: 'Arrow keys', description: 'Move focus to the nearest node in that direction.' },
      { key: 'Home / End', description: 'First or last node in reading order (top to bottom, then by line direction; mirrored in RTL).' },
      { key: 'Alt (Option) + Arrow', description: 'Moves the focused node one grid step (`keyboardStep`); with Shift, four. The new position is announced. Off in `readOnly`.' },
      { key: 'C', description: 'Opens the "Connect <node> to…" menu, the keyboard alternative to dragging a handle. Only with `onConnect`.' },
      { key: 'Up / Down, Home / End, a letter', description: 'In the Connect menu: move through the nodes it can connect to; typing a letter jumps to the next title starting with it.' },
      { key: 'Enter / Space', description: 'In the Connect menu: connects to the active node and announces it.' },
      { key: 'Escape / Tab', description: 'Closes the Connect menu; focus returns to the node.' },
      { key: 'Delete / Backspace', description: 'Removes the selection, or the focused node; focus moves to the next node in reading order and the count is announced.' },
    ],
    focus: [
      'One node is in the Tab order at a time; focus follows arrow keys, not the DOM order of React Flow’s nodes.',
      'After a delete, focus goes to the next node (or the previous one at the end), never to the page.',
      'Focus rings and the 24px handle hit area come from the tokens.',
    ],
    screenReader: [
      'Each node is read by its title, then its tone ("Warning") as text, then how the keyboard works.',
      'Connections, moves and deletes are announced in a polite live region.',
      '"Show as list" lists every node with what it connects to and is connected from, by name: the text alternative to the drawing.',
    ],
    notes: [
      'Tone is never colour alone: a dot plus text for screen readers and the list view, and a border in forced colours.',
      'Fit view and animated edges respect reduced motion.',
      'Every string (`labels`) is English by default: they are not in `@nexub/core` messages yet, so pass translations.',
    ],
  },
};

export default entry;
