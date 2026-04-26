import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'user-card',
    title: 'UserCard',
    description: 'User profile card displaying avatar, name, role, and optional actions.',
    category: 'People',
    package: '@nexub/patterns',
    status: 'stable',
  },
  props: [
    { name: 'name', type: 'string', required: true, description: 'User display name.' },
    { name: 'email', type: 'string', required: false, description: 'User email address.' },
    { name: 'role', type: 'string', required: false, description: 'Job title or role label.' },
    { name: 'avatar', type: 'string', required: false, description: 'URL for avatar image.' },
    { name: 'actions', type: 'React.ReactNode', required: false, description: 'Action buttons or menu.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<UserCard
  name="Alex Morgan"
  email="alex@nexub.io"
  role="Design Lead"
/>`,
    },
  ],
};

export default entry;
