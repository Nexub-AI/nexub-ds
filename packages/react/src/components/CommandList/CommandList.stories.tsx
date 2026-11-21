import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Bell, Folder, Settings } from '@nexub/icons';
import { Button } from '../Button/Button.js';
import { Dialog } from '../Dialog/Dialog.js';
import { CommandList, type CommandListItem } from './CommandList.js';

const meta: Meta<typeof CommandList> = {
  title: 'Navigation/CommandList',
  component: CommandList,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof CommandList>;

const items: CommandListItem[] = [
  { value: 'projects', label: 'Projects', description: 'All workspace projects', icon: <Folder size="sm" />, group: 'Go to', shortcut: ['G', 'P'] },
  { value: 'notifications', label: 'Notifications', icon: <Bell size="sm" />, group: 'Go to', shortcut: ['G', 'N'] },
  { value: 'settings', label: 'Settings', keywords: ['preferences'], icon: <Settings size="sm" />, group: 'Go to', shortcut: ['⌘', ','] },
  { value: 'archive', label: 'Archive', description: 'Read-only', group: 'Folders' },
  { value: 'finance', label: 'Finance', group: 'Folders' },
  { value: 'legal', label: 'Legal', group: 'Folders', disabled: true },
];

export const Default: Story = {
  render: () => {
    const [picked, setPicked] = React.useState<string>();
    return (
      <div style={{ maxWidth: 480 }}>
        <CommandList label="Jump to" items={items} onSelect={setPicked} autoFocus={false} />
        <p style={{ marginTop: 16 }}>Picked: {picked ?? '—'}</p>
      </div>
    );
  },
};

/** Inside a Dialog: the list has no dialog of its own. Pick an item to close. */
export const InDialog: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [folder, setFolder] = React.useState<string>();
    return (
      <>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <Button>Move to folder{folder ? ` (${folder})` : ''}</Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay />
            <Dialog.Content aria-describedby={undefined}>
              <Dialog.Header>
                <Dialog.Title>Move to folder</Dialog.Title>
              </Dialog.Header>
              <CommandList
                label="Folders"
                placeholder="Find a folder…"
                items={items.filter((i) => i.group === 'Folders')}
                onSelect={(value) => {
                  setFolder(value);
                  setOpen(false);
                }}
              />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </>
    );
  },
};

/** Server search: `onSearch` turns off local filtering; `loading` shows a busy row. */
export const AsyncSearch: Story = {
  render: () => {
    const all = ['Acme Corp', 'Apex Labs', 'Nexub Pte Ltd', 'Zeta Holdings'].map((label, i) => ({ value: `c${i}`, label }));
    const [results, setResults] = React.useState<CommandListItem[]>(all);
    const [loading, setLoading] = React.useState(false);
    const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    return (
      <div style={{ maxWidth: 480 }}>
        <CommandList
          label="Companies"
          items={results}
          loading={loading}
          autoFocus={false}
          onSearch={(text) => {
            clearTimeout(timer.current);
            setLoading(true);
            timer.current = setTimeout(() => {
              setResults(all.filter((o) => o.label.toLowerCase().includes(text.toLowerCase())));
              setLoading(false);
            }, 300);
          }}
        />
      </div>
    );
  },
};
