import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { addEdge, applyEdgeChanges, applyNodeChanges, type Connection, type Edge, type EdgeChange, type NodeChange } from '@xyflow/react';
import { DiagramCanvas, type DiagramCanvasProps, type DiagramFlowNode } from './index.js';
// The package stylesheet (React Flow's base CSS themed on the tokens, plus this package's utilities).
import './styles.css';

const meta: Meta<typeof DiagramCanvas> = {
  title: 'Components/DiagramCanvas',
  component: DiagramCanvas,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof meta>;

// Visual baselines are recorded from these: fixed viewports (no fitView), no animated edges.

const n = (id: string, title: string, data: Partial<DiagramFlowNode['data']> = {}): DiagramFlowNode => ({
  id,
  type: 'nexub',
  position: { x: 0, y: 0 },
  data: { title, ...data },
});
const e = (source: string, target: string): Edge => ({ id: `${source}-${target}`, source, target });

const workflowNodes = [
  n('trigger', 'New sign-up', { description: 'Webhook from the website' }),
  n('enrich', 'Enrich profile', { description: 'Company and role lookup' }),
  n('score', 'Score lead'),
  n('welcome', 'Send welcome email'),
  n('notify', 'Notify sales', { description: 'Only for scores above 80' }),
  n('crm', 'Create CRM record'),
];
const workflowEdges = [e('trigger', 'enrich'), e('trigger', 'welcome'), e('enrich', 'score'), e('score', 'notify'), e('score', 'crm'), e('welcome', 'crm')];

/** Controlled state, as an app would hold it. */
function Editable({ initialNodes, initialEdges, ...props }: Omit<DiagramCanvasProps<DiagramFlowNode, Edge>, 'nodes' | 'edges'> & { initialNodes: DiagramFlowNode[]; initialEdges: Edge[] }) {
  const [nodes, setNodes] = React.useState(initialNodes);
  const [edges, setEdges] = React.useState(initialEdges);
  const onNodesChange = React.useCallback((c: NodeChange<DiagramFlowNode>[]) => setNodes((ns) => applyNodeChanges(c, ns)), []);
  const onEdgesChange = React.useCallback((c: EdgeChange<Edge>[]) => setEdges((es) => applyEdgeChanges(c, es)), []);
  const onConnect = React.useCallback((c: Connection) => setEdges((es) => addEdge(c, es)), []);
  return <DiagramCanvas<DiagramFlowNode, Edge> {...props} nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} />;
}

/** A left-to-right workflow. Tab to a node; arrow keys move focus, Alt+arrows move it, C connects, Delete removes. */
export const Default: Story = {
  render: () => (
    <Editable
      aria-label="Lead onboarding workflow"
      style={{ height: '30rem' }}
      layout="left-right"
      initialNodes={workflowNodes}
      initialEdges={workflowEdges}
      defaultViewport={{ x: 24, y: 40, zoom: 0.7 }}
    />
  ),
};

const mindNodes = [
  n('root', 'Product launch'),
  n('audience', 'Audience'),
  n('channels', 'Channels'),
  n('timeline', 'Timeline'),
  n('budget', 'Budget'),
  n('smb', 'Small teams'),
  n('ent', 'Enterprise'),
  n('email', 'Email'),
  n('social', 'Social'),
  n('events', 'Events'),
  n('beta', 'Beta in March'),
  n('ga', 'GA in May'),
];
const mindEdges = [
  e('root', 'audience'),
  e('root', 'channels'),
  e('root', 'timeline'),
  e('root', 'budget'),
  e('audience', 'smb'),
  e('audience', 'ent'),
  e('channels', 'email'),
  e('channels', 'social'),
  e('channels', 'events'),
  e('timeline', 'beta'),
  e('timeline', 'ga'),
];

/** A radial mind map: the root in the middle, each level on a ring. */
export const MindMap: Story = {
  render: () => (
    <Editable
      aria-label="Product launch mind map"
      style={{ height: '30rem' }}
      layout="mind-map"
      initialNodes={mindNodes}
      initialEdges={mindEdges}
      minZoom={0.25}
      defaultViewport={{ x: 480, y: 250, zoom: 0.4 }}
    />
  ),
};

/** View only: focus still moves with the arrow keys; nothing can be dragged, connected or deleted. */
export const ReadOnly: Story = {
  render: () => (
    <DiagramCanvas
      aria-label="Lead onboarding workflow, view only"
      style={{ height: '30rem' }}
      readOnly
      layout="left-right"
      nodes={workflowNodes}
      edges={workflowEdges}
      // Zoom 0.5, not 0.7: read-only hides the handle dots, which elsewhere cover where an edge
      // starts, so at 0.7 that start sat on a fraction of a pixel and its anti-aliasing varied
      // between runs (3 pixels, forced colours). At 0.5 every position is a whole or half pixel.
      defaultViewport={{ x: 24, y: 40, zoom: 0.5 }}
    />
  ),
};

const check = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M3 8.5l3 3 7-7" />
  </svg>
);
const alert = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" width="16" height="16">
    <path d="M8 4v5M8 11.5v.5" />
  </svg>
);

/** The four tones: a stripe, a dot and a text equivalent (a border style in forced colours). */
export const Tones: Story = {
  render: () => (
    <Editable
      aria-label="Deployment pipeline"
      style={{ height: '20rem' }}
      layout="left-right"
      initialNodes={[
        n('build', 'Build', { tone: 'good', description: 'Passed in 2 min', icon: check }),
        n('test', 'Tests', { tone: 'warning', description: '3 flaky tests', icon: alert }),
        n('deploy', 'Deploy', { tone: 'danger', description: 'Health check failed', icon: alert }),
        n('notify', 'Notify', { tone: 'default', description: 'Waiting' }),
      ]}
      initialEdges={[e('build', 'test'), e('test', 'deploy'), e('deploy', 'notify')]}
      defaultViewport={{ x: 24, y: 80, zoom: 0.8 }}
    />
  ),
};

/** With the minimap (bottom right) and the zoom controls (bottom left). */
export const Minimap: Story = {
  render: () => (
    <Editable
      aria-label="Lead onboarding workflow with minimap"
      style={{ height: '30rem' }}
      layout="left-right"
      minimap
      initialNodes={workflowNodes}
      initialEdges={workflowEdges}
      defaultViewport={{ x: 24, y: 40, zoom: 0.7 }}
    />
  ),
};
