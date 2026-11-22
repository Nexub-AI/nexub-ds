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
