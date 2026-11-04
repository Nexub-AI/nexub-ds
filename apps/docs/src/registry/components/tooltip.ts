import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'tooltip',
    title: 'Tooltip',
    description: 'Floating label that appears on hover. Built on Radix UI Tooltip.',
    category: 'Overlays',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'content', type: 'React.ReactNode', required: true, description: 'Content shown inside the tooltip.' },
    { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'top'", required: false, description: 'Preferred side to open.' },
    { name: 'delayDuration', type: 'number', default: '700', required: false, description: 'Delay in ms before tooltip opens.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Sides',
    },
  ],
};

export default entry;
