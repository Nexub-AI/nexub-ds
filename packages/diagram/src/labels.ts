import type { NexubMessages } from '@nexub/react/NexubProvider';
import type { DiagramLabels } from './types.js';

/** English defaults for {@link DiagramLabels}. @alpha */
export const defaultDiagramLabels: DiagramLabels = {
  showAsList: 'Show as list',
  connectsTo: 'Connects to',
  connectedFrom: 'Connected from',
  noConnections: 'No connections',
  connectTo: (title) => `Connect ${title} to…`,
  noTargets: 'No other nodes to connect to',
  nodeHint: 'Arrow keys move between nodes. Alt and an arrow key moves the node. Press C to connect it to another node, Delete to remove it.',
  nodeHintReadOnly: 'Arrow keys move between nodes.',
  connected: (source, target) => `Connected ${source} to ${target}`,
  moved: (title, x, y) => `Moved ${title} to ${x}, ${y}`,
  deleted: (count) => (count === 1 ? 'Deleted 1 item' : `Deleted ${count} items`),
  tones: { good: 'Good', warning: 'Warning', danger: 'Problem' },
  controls: 'Zoom controls',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  fitView: 'Fit view',
  minimap: 'Minimap',
};

/**
 * 11.7: the labels with `NexubProvider`'s `diagram…` messages on top, so a translated provider
 * covers the canvas with the rest of the app. DiagramCanvas's `labels` prop goes on top of this.
 */
export function diagramLabelsFrom(m: Partial<NexubMessages>): DiagramLabels {
  // `showAsList` ← `diagramShowAsList`, and so on; tones ← `diagramToneGood`, ….
  const from = (key: string) => (m as Record<string, unknown>)[`diagram${key[0]!.toUpperCase()}${key.slice(1)}`];
  const out = { ...defaultDiagramLabels, tones: { ...defaultDiagramLabels.tones } } as Record<string, unknown> & DiagramLabels;
  for (const key of Object.keys(out)) if (key !== 'tones') out[key] = from(key) ?? out[key];
  for (const tone of ['good', 'warning', 'danger'] as const) out.tones[tone] = (from(`tone${tone[0]!.toUpperCase()}${tone.slice(1)}`) as string | undefined) ?? out.tones[tone];
  return out;
}
