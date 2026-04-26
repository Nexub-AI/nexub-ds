import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'skeleton',
    title: 'Skeleton',
    description: 'Placeholder loading animation that mimics content layout.',
    category: 'Loading States',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'shape', type: "'line' | 'rect' | 'circle'", default: "'line'", required: false, description: 'Shape of the skeleton placeholder.' },
    { name: 'width', type: 'string | number', required: false, description: 'Width of the skeleton element.' },
    { name: 'height', type: 'string | number', required: false, description: 'Height of the skeleton element.' },
    { name: 'animated', type: 'boolean', default: 'true', required: false, description: 'Enables the shimmer animation.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '280px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
  <Skeleton shape="circle" width={40} height={40} />
  <Skeleton shape="line" width="60%" height={12} />
  <Skeleton shape="line" width="100%" height={12} />
  <Skeleton shape="line" width="80%" height={12} />
  <Skeleton shape="rect" width="100%" height={80} />
</div>`,
    },
    {
      title: 'Shapes',
      code: `<div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
  <Skeleton shape="line" width={120} height={12} />
  <Skeleton shape="rect" width={80} height={60} />
  <Skeleton shape="circle" width={40} height={40} />
</div>`,
    },
  ],
};

export default entry;
