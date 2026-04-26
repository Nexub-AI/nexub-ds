import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'avatar',
    title: 'Avatar',
    description: 'Displays a user\'s profile picture with initials fallback.',
    category: 'Avatar',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'src', type: 'string', required: false, description: 'URL of the profile image.' },
    { name: 'name', type: 'string', required: false, description: 'Full name used to generate initials when no image is provided.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", required: false, description: 'Controls avatar dimensions.' },
    { name: 'badge', type: 'boolean', required: false, description: 'Shows a status badge on the avatar.' },
    { name: 'badgeColor', type: 'string', required: false, description: 'Colour of the status badge.' },
    { name: 'fallback', type: 'ReactNode', required: false, description: 'Custom fallback rendered when the image fails to load and no name is provided.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Avatar name="Alex Johnson" />`,
    },
    {
      title: 'Sizes',
      code: `<div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
  <Avatar size="xs" name="Alex Johnson" />
  <Avatar size="sm" name="Alex Johnson" />
  <Avatar size="md" name="Alex Johnson" />
  <Avatar size="lg" name="Alex Johnson" />
  <Avatar size="xl" name="Alex Johnson" />
</div>`,
    },
    {
      title: 'With image',
      code: `<Avatar src="https://i.pravatar.cc/150?img=1" name="Alex Johnson" />`,
    },
    {
      title: 'With badge',
      code: `<Avatar name="Online User" badge badgeColor="green" />`,
    },
  ],
};

export default entry;
