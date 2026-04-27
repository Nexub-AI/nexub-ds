import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'avatar-group',
    title: 'Avatar Group',
    description: 'Stacked group of avatars with overflow count.',
    category: 'Avatar',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'max', type: 'number', default: '4', required: false, description: 'Maximum number of avatars shown before an overflow count is rendered.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", required: false, description: 'Controls avatar dimensions for all children.' },
    { name: 'spacing', type: "'tight' | 'normal'", default: "'normal'", required: false, description: 'Controls the overlap amount between stacked avatars.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<AvatarGroup max={3}>
  <Avatar name="Alice" />
  <Avatar name="Bob" />
  <Avatar name="Carol" />
  <Avatar name="Dave" />
</AvatarGroup>`,
    },
  ],
};

export default entry;
