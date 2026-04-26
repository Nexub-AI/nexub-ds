import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'info-list',
    title: 'InfoList',
    description: 'Key–value list for displaying structured metadata or details.',
    category: 'Data',
    package: '@nexub/patterns',
    status: 'stable',
  },
  props: [
    { name: 'label', type: 'string', required: true, description: 'The key label.' },
    { name: 'value', type: 'React.ReactNode', required: true, description: 'The displayed value.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<InfoList.Root>
  <InfoList.Item label="Plan" value="Pro" />
  <InfoList.Item label="Status" value={<Badge tone="success">Active</Badge>} />
  <InfoList.Item label="Member since" value="Jan 2024" />
  <InfoList.Item label="Team size" value="12 members" />
</InfoList.Root>`,
    },
  ],
};

export default entry;
