import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Avatar, Button, IconButton, Logo, Switch } from '@nexub/react';
import { Bell, Lock, Moon, User } from '@nexub/icons';
import { AppLauncher } from '../AppLauncher/AppLauncher.js';
import { AppHeader } from '../AppHeader/AppHeader.js';
import { SettingsLayout, SettingsRow } from './SettingsLayout.js';

const items = [
  { id: 'profile', label: 'Profile', icon: <User size="sm" />, href: '#profile' },
  { id: 'security', label: 'Security', icon: <Lock size="sm" />, href: '#security' },
  { id: 'notifications', label: 'Notifications', icon: <Bell size="sm" />, href: '#notifications' },
];

const pages: Record<string, { title: string; description: string }> = {
  profile: { title: 'Profile', description: 'How you appear across Nexub apps.' },
  security: { title: 'Security', description: 'Sign-in methods and active sessions.' },
  notifications: { title: 'Notifications', description: 'Choose what we email you about.' },
};

function MyAccount({ appHeader = false, navFooter }: { appHeader?: boolean; navFooter?: React.ReactNode }) {
  const [active, setActive] = React.useState('profile');
  const page = pages[active]!;
  return (
    <SettingsLayout
      items={items}
      activeId={active}
      navFooter={navFooter}
      onSelect={(item) => setActive(item.id)}
      header={
        appHeader
          ? (menu) => (
              <AppHeader
                menu={menu}
                productName="Account"
                showThemeSwitch={false}
                apps={[{ id: 'account', name: 'Account', href: '#', current: true }]}
                user={{ name: 'Sam Lee', email: 'sam@example.com' }}
                onSignOut={() => {}}
              />
            )
          : undefined
      }
      logo={<Logo product="Account" size="sm" />}
      actions={
        <>
          <IconButton label="Toggle theme">
            <Moon size="md" aria-hidden="true" />
          </IconButton>
          <AppLauncher
            apps={[
              { id: 'account', name: 'Account', href: '#', current: true },
              { id: 'hub', name: 'Command Hub', href: '#' },
            ]}
          />
          <Avatar name="Sam Lee" size="sm" />
        </>
      }
      title={page.title}
      description={page.description}
    >
      <SettingsLayout.Section title="Personal details">
        <SettingsRow label="Name" value="Sam Lee" action={<Button variant="outline" size="sm">Edit</Button>} />
        <SettingsRow
          label="Email"
          description="Used to sign in"
          value="sam.lee+a-very-long-address@example.com"
          action={<Button variant="outline" size="sm">Change</Button>}
        />
      </SettingsLayout.Section>
      <SettingsLayout.Section title="Preferences" description="Applies on every device.">
        <SettingsRow label="Product updates" value="Monthly" action={<Switch aria-label="Product updates" defaultChecked />} />
      </SettingsLayout.Section>
    </SettingsLayout>
  );
}

const meta: Meta = {
  title: 'Patterns/SettingsLayout',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <MyAccount />,
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

/** Under 768px the sidebar becomes a menu button that opens a left Sheet. Rows stack. */
export const Phone375: Story = {
  name: 'Phone (375px)',
  parameters: {
    viewport: {
      viewports: { phone375: { name: 'Phone 375', styles: { width: '375px', height: '812px' } } },
      defaultViewport: 'phone375',
    },
  },
};

/** `header` swaps the built-in top bar for an `AppHeader`; the section menu goes in its menu slot. */
export const WithAppHeader: Story = { render: () => <MyAccount appHeader /> };

export const WithAppHeaderPhone: Story = {
  name: 'With AppHeader (375px)',
  render: () => <MyAccount appHeader />,
  parameters: Phone375.parameters,
};

/** `navFooter` stays pinned at the bottom of the section sidebar (and the phone menu) while the items scroll. */
export const WithNavFooter: Story = { render: () => <MyAccount navFooter="v1.2.0 · Updated 21 Oct 2026" /> };

export const WithNavFooterPhone: Story = {
  name: 'With nav footer (375px)',
  render: () => <MyAccount navFooter="v1.2.0 · Updated 21 Oct 2026" />,
  parameters: Phone375.parameters,
};
