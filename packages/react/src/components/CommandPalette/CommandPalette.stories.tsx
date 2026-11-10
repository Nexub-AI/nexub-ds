import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { CommandPalette } from './CommandPalette.js';

const meta: Meta = {
  title: 'Navigation/CommandPalette',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <CommandPalette.Root open>
      <CommandPalette.Input placeholder="Type a command or search…" />
      <CommandPalette.List>
        <CommandPalette.Empty>No results found.</CommandPalette.Empty>

        <CommandPalette.Group heading="Navigation">
          <CommandPalette.Item onSelect={() => {}}>
            <span style={{ marginRight: '8px' }}>📊</span>
            Go to Dashboard
          </CommandPalette.Item>
          <CommandPalette.Item onSelect={() => {}}>
            <span style={{ marginRight: '8px' }}>📈</span>
            Go to Analytics
          </CommandPalette.Item>
          <CommandPalette.Item onSelect={() => {}}>
            <span style={{ marginRight: '8px' }}>⚙️</span>
            Go to Settings
          </CommandPalette.Item>
        </CommandPalette.Group>

        <CommandPalette.Separator />

        <CommandPalette.Group heading="Actions">
          <CommandPalette.Item onSelect={() => {}}>
            <span style={{ marginRight: '8px' }}>➕</span>
            Create new project
          </CommandPalette.Item>
          <CommandPalette.Item onSelect={() => {}}>
            <span style={{ marginRight: '8px' }}>📤</span>
            Export report
          </CommandPalette.Item>
          <CommandPalette.Item onSelect={() => {}}>
            <span style={{ marginRight: '8px' }}>🔗</span>
            Invite team member
          </CommandPalette.Item>
        </CommandPalette.Group>
      </CommandPalette.List>
    </CommandPalette.Root>
  ),
};

/** Pick "Projects…" to open a page; Backspace on an empty query goes back. Picks are kept as recents. */
export const PagesAndRecents: Story = {
  render: () => (
    <CommandPalette.Root open recentKey="storybook-palette-recents">
      <CommandPalette.Input placeholder="Type a command or search…" />
      <CommandPalette.List>
        <CommandPalette.Empty>No results found.</CommandPalette.Empty>
        <CommandPalette.Page>
          <CommandPalette.Group heading="Actions">
            <CommandPalette.Item page="projects">Projects…</CommandPalette.Item>
            <CommandPalette.Item onSelect={() => {}}>Export report</CommandPalette.Item>
          </CommandPalette.Group>
        </CommandPalette.Page>
        <CommandPalette.Page id="projects" title="Projects">
          <CommandPalette.Item onSelect={() => {}}>Nexub</CommandPalette.Item>
          <CommandPalette.Item onSelect={() => {}}>Payub</CommandPalette.Item>
        </CommandPalette.Page>
      </CommandPalette.List>
    </CommandPalette.Root>
  ),
};

export const Loading: Story = {
  render: () => (
    <CommandPalette.Root open loading>
      <CommandPalette.Input placeholder="Search people…" />
      <CommandPalette.List>
        <CommandPalette.Empty>No results found.</CommandPalette.Empty>
      </CommandPalette.List>
    </CommandPalette.Root>
  ),
};
