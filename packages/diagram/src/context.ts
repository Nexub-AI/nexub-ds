import * as React from 'react';
import type { DiagramLabels, DiagramLayout } from './types.js';
import { defaultDiagramLabels } from './labels.js';

export interface DiagramContextValue {
  layout: DiagramLayout;
  readOnly: boolean;
  labels: DiagramLabels;
  /** Opens the Connect menu for a node; undefined when connecting is off. */
  openConnect?: (nodeId: string) => void;
}

/** What `DiagramNode` reads from `DiagramCanvas`; the defaults apply under a plain `<ReactFlow>`. */
export const DiagramContext = React.createContext<DiagramContextValue>({
  layout: 'none',
  readOnly: false,
  labels: defaultDiagramLabels,
});
