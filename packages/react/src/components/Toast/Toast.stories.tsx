import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { toast, Toaster } from './index.js';
import { Button } from '../Button/index.js';

const meta: Meta = {
  title: 'Feedback/Toast',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

function ToastDemo() {
  return (
    <div className="flex flex-col items-start gap-2 p-4">
      <Button onClick={() => toast.success('Saved!')}>Show success toast</Button>
      <Button tone="danger" onClick={() => toast.error('Something went wrong.', { description: 'Please try again.' })}>
        Show error toast
      </Button>
      <Button
        variant="tonal"
        onClick={() => toast.info('New update available', { description: 'Refresh to get the latest version.' })}
      >
        Show info toast
      </Button>
      <Toaster />
    </div>
  );
}

export const Default: Story = {
  render: () => <ToastDemo />,
};

const samples = [
  () => toast.success('Saved'),
  () => toast.info('New update available', { description: 'Refresh to get the latest version.' }),
  () =>
    toast.error('Upload failed', {
      description: 'The file is larger than 25 MB. Compress it or split it into parts, then try again.',
    }),
  () => toast.custom('Message archived', { action: { label: 'Undo', onClick: () => {} } }),
  () => toast.warning('Storage almost full', { description: '92% of your quota is used.' }),
];

/** Fire several toasts: they stack, newest in front. Hover or tab into the stack to fan it out (timers pause meanwhile). */
export const Stacked: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 p-4">
      <Button onClick={() => samples[Math.floor(Math.random() * samples.length)]!()}>Fire one</Button>
      <Button variant="outline" onClick={() => samples.forEach((fire, i) => setTimeout(fire, i * 250))}>
        Fire five
      </Button>
      <Button variant="ghost" onClick={() => toast.dismiss()}>
        Clear
      </Button>
      <Toaster />
    </div>
  ),
};

export const StackedExpanded: Story = {
  name: 'Stacked (expand)',
  render: () => (
    <div className="flex flex-wrap gap-2 p-4">
      <Button onClick={() => samples.forEach((fire) => fire())}>Fire five</Button>
      <Toaster expand visibleToasts={4} />
    </div>
  ),
};

const initialRows = ['Invoice #1042', 'Invoice #1043', 'Invoice #1044', 'Invoice #1045'];

function UndoDeleteDemo() {
  const [rows, setRows] = React.useState(initialRows);
  const [log, setLog] = React.useState<string[]>([]);

  const remove = (row: string) => {
    const index = rows.indexOf(row);
    // Optimistic: hide it now, delete for real only when the toast commits.
    setRows((r) => r.filter((x) => x !== row));
    toast.undoable(`${row} deleted`, {
      onUndo: () =>
        setRows((r) => (r.includes(row) ? r : [...r.slice(0, index), row, ...r.slice(index)])),
      onCommit: () => setLog((l) => [...l, `DELETE ${row}`]),
    });
  };

  return (
    <div className="flex w-[360px] flex-col gap-3 p-4">
      <ul className="flex flex-col gap-1">
        {rows.map((row) => (
          <li key={row} className="flex items-center justify-between gap-2 text-body-md">
            {row}
            <Button size="sm" variant="ghost" onClick={() => remove(row)}>
              Delete
            </Button>
          </li>
        ))}
      </ul>
      <Button variant="outline" size="sm" onClick={() => setRows(initialRows)}>
        Reset rows
      </Button>
      <p className="text-body-sm text-[var(--color-on-surface-muted)]">Committed: {log.join(', ') || 'none'}</p>
      <Toaster />
    </div>
  );
}

/** `toast.undoable`: Undo restores the row; any other close (timer, swipe, ×) commits the delete, once. */
export const UndoDelete: Story = {
  name: 'Undo delete',
  render: () => <UndoDeleteDemo />,
};
