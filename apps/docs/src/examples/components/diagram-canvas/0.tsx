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
