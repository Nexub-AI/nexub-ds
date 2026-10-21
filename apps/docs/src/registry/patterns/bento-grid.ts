import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'bento-grid',
    title: 'Bento Grid',
    description: 'A grid of card tiles in mixed sizes. Responds to its own width: 1 column, 2 at 480px, 4 at 768px.',
    category: 'Layout',
    package: '@nexub/patterns',
    status: 'beta',
    addedIn: '1.6.0',
    related: ['card', 'stat-card'],
  },
  props: [
    { name: 'BentoGrid children', type: 'ReactNode', required: true, description: '`BentoTile`s. Dense packing back-fills gaps left by large tiles, so visual order can differ from source order.' },
    { name: 'size', type: "'1x1' | '2x1' | '1x2' | '2x2'", default: "'1x1'", required: false, description: 'Tile span, columns × rows. Two-wide spans apply from 2 columns up.' },
    { name: '...Card props', type: 'CardProps', required: false, description: 'A tile is a surface Card (`variant` is fixed); `tone`, `surface` and `effect` pass through.' },
  ],
  examples: [
    {
      title: 'Dashboard',
      code: `<BentoGrid>
  <BentoTile size="2x2">
    <h3 className="text-title-sm">Revenue, last 7 days</h3>
    <RevenueChart />
  </BentoTile>
  <BentoTile><StatTile label="Active users" value="12,480" /></BentoTile>
  <BentoTile><StatTile label="Conversion" value="3.2%" /></BentoTile>
  <BentoTile size="2x1">3 invoices awaiting approval.</BentoTile>
  <BentoTile><StatTile label="Churn" value="0.8%" /></BentoTile>
  <BentoTile><StatTile label="NPS" value="61" /></BentoTile>
</BentoGrid>`,
    },
  ],
  usage: {
    whenToUse: ['Overview pages where a few items deserve more room than the rest.'],
    whenNotToUse: [
      'Lists the user scans in order: dense packing can move tiles out of reading order.',
      'Equal-weight items: use Grid.',
    ],
  },
};

export default entry;
