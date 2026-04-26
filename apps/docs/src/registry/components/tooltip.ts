import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'tooltip',
    title: 'Tooltip',
    description: 'Floating label that appears on hover. Built on Radix UI Tooltip.',
    category: 'Overlays',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'content', type: 'React.ReactNode', required: true, description: 'Content shown inside the tooltip.' },
    { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'top'", required: false, description: 'Preferred side to open.' },
    { name: 'delayDuration', type: 'number', default: '700', required: false, description: 'Delay in ms before tooltip opens.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Tooltip content="This is a tooltip">
  <Button variant="outline">Hover me</Button>
</Tooltip>`,
    },
    {
      title: 'Sides',
      code: `<div style={{ display: 'flex', gap: '12px' }}>
  <Tooltip content="Top" side="top"><Button size="sm">Top</Button></Tooltip>
  <Tooltip content="Right" side="right"><Button size="sm">Right</Button></Tooltip>
  <Tooltip content="Bottom" side="bottom"><Button size="sm">Bottom</Button></Tooltip>
  <Tooltip content="Left" side="left"><Button size="sm">Left</Button></Tooltip>
</div>`,
    },
  ],
};

export default entry;
