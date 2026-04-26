import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'settings-section',
    title: 'SettingsSection',
    description: 'Grouped settings panel with title, description, and action area.',
    category: 'Layout',
    package: '@nexub/patterns',
    status: 'stable',
  },
  props: [
    { name: 'title', type: 'string', required: true, description: 'Section heading.' },
    { name: 'description', type: 'string', required: false, description: 'Supporting description for the section.' },
    { name: 'children', type: 'React.ReactNode', required: true, description: 'Settings controls.' },
    { name: 'action', type: 'React.ReactNode', required: false, description: 'Primary action (e.g. save button).' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<SettingsSection
  title="Profile"
  description="Update your personal information."
  action={<Button size="sm">Save changes</Button>}
>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
    <Input placeholder="Display name" />
    <Input placeholder="Email address" type="email" />
  </div>
</SettingsSection>`,
    },
  ],
};

export default entry;
