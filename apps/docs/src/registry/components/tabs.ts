import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'tabs',
    title: 'Tabs',
    description: 'Layered content panels switched by tab triggers. Built on Radix UI Tabs.',
    category: 'Navigation',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'defaultValue', type: 'string', required: false, description: 'Initially active tab value (uncontrolled).' },
    { name: 'value', type: 'string', required: false, description: 'Controlled active tab value.' },
    { name: 'onValueChange', type: '(value: string) => void', required: false, description: 'Callback when active tab changes.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", required: false, description: 'Layout direction of the tab list.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Tabs.Root defaultValue="account">
  <Tabs.List>
    <Tabs.Trigger value="account">Account</Tabs.Trigger>
    <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
    <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="account">
    <Text>Account settings content.</Text>
  </Tabs.Content>
  <Tabs.Content value="billing">
    <Text>Billing details content.</Text>
  </Tabs.Content>
  <Tabs.Content value="notifications">
    <Text>Notification preferences content.</Text>
  </Tabs.Content>
</Tabs.Root>`,
    },
  ],
};

export default entry;
