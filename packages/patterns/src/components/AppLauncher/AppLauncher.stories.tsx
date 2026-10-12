import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { AppLauncher, type AppLauncherApp } from './AppLauncher.js';

// In an app: import hubIcon from '@nexub/brand/app-icon.svg' (see @nexub/brand README).
const tile = (name: string) => new URL(`../../../../brand/assets/${name}`, import.meta.url).href;

const apps: AppLauncherApp[] = [
  { id: 'hub', name: 'Command Hub', href: '#hub', icon: tile('app-icon.svg'), current: true },
  { id: 'account', name: 'Account', href: '#account', icon: tile('app-icon-account.svg') },
  { id: 'bookub', name: 'Bookub', href: '#bookub' },
  { id: 'payub', name: 'Payub', href: '#payub', icon: '/missing-icon.svg' },
  { id: 'founderub', name: 'Founderub', href: '#founderub' },
];

const meta: Meta<typeof AppLauncher> = {
  title: 'Patterns/AppLauncher',
  component: AppLauncher,
  tags: ['autodocs'],
  args: { apps },
  decorators: [
    (Story) => (
      <div className="flex justify-end p-4" style={{ minHeight: 420 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof AppLauncher>;

/** Several apps. Bookub and Founderub have no icon, Payub's fails to load: all fall back to initials. */
export const Default: Story = {};

export const Glass: Story = {
  args: { surface: 'glass' },
  decorators: [
    (Story) => (
      <div
        className="flex w-full justify-end rounded-xl p-4"
        style={{ background: 'var(--gradient-brand)', minHeight: 420 }}
      >
        <Story />
      </div>
    ),
  ],
};

export const ClientSideRouting: Story = {
  render: (args) => {
    const [last, setLast] = React.useState<string>('none');
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-[var(--color-text-muted)]">onNavigate: {last}</span>
        <AppLauncher {...args} onNavigate={(app) => setLast(app.name)} />
      </div>
    );
  },
};

/** No apps: renders nothing. */
export const Empty: Story = { args: { apps: [] } };
