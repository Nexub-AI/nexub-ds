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
