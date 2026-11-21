import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SavedViews } from './SavedViews.js';

const meta: Meta = {
  title: 'Components/SavedViews',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <SavedViews
      views={[
        { id: 'mine', name: 'My open deals' },
        { id: 'big', name: 'Over $10k' },
      ]}
      activeId="mine"
      onSelect={() => {}}
      onSave={() => {}}
    />
  ),
};

/** 10.6: a bottom sheet below the md breakpoint, the usual menu above. */
export const SheetAuto: Story = {
  render: () => (
    <SavedViews views={[{ id: 'mine', name: 'My open deals' }]} activeId="mine" onSelect={() => {}} sheet="auto" />
  ),
};

/** 11.5: async save, rename and delete (with a confirm), a default view and a name limit. */
export const AsyncWithDefault: Story = {
  render: function Render() {
    const [views, setViews] = React.useState([
      { id: 'mine', name: 'My open deals' },
      { id: 'big', name: 'Over $10k' },
    ]);
    const [active, setActive] = React.useState<string>();
    const wait = () => new Promise((resolve) => setTimeout(resolve, 800));
    return (
      <SavedViews
        views={views}
        activeId={active}
        defaultView="mine"
        onSelect={setActive}
        maxLength={40}
        confirmDelete
        onSave={async (name) => {
          await wait();
          const id = String(Date.now());
          setViews((v) => [...v, { id, name }]);
          setActive(id);
        }}
        onRename={async (id, name) => {
          await wait();
          setViews((v) => v.map((x) => (x.id === id ? { ...x, name } : x)));
        }}
        onDelete={async (id) => {
          await wait();
          setViews((v) => v.filter((x) => x.id !== id));
          setActive('mine');
        }}
      />
    );
  },
};
