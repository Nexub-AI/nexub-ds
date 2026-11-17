import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Button, EmptyStatePreset } from '@nexub/react';
import { TransactionDetailPage } from './TransactionDetailPage.js';

const meta: Meta<typeof TransactionDetailPage> = {
  title: 'Patterns/Pages/TransactionDetailPage',
  component: TransactionDetailPage,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof TransactionDetailPage>;

const stateNames = ['Loading', 'Empty', 'Error'] as const;

function DataStatesDemo() {
  const [state, setState] = React.useState<(typeof stateNames)[number]>('Loading');
  return (
    <div>
      <div role="group" aria-label="State" className="flex flex-wrap gap-2 px-4 pt-4">
        {stateNames.map((s) => (
          <Button key={s} size="sm" variant={s === state ? 'tonal' : 'outlined'} aria-pressed={s === state} onClick={() => setState(s)}>
            {s}
          </Button>
        ))}
      </div>
      <TransactionDetailPage
        as="div"
        onBack={() => {}}
        loading={state === 'Loading'}
        emptyState={<EmptyStatePreset kind="noData" title="No transaction" description="Pick a transaction from your activity." />}
        errorState={state === 'Error' ? <EmptyStatePreset kind="serverError" actions={<Button variant="tonal">Retry</Button>} /> : undefined}
      />
    </div>
  );
}

/** 10.5: `loading`, `emptyState` and `errorState` (the error wins). */
export const DataStates: Story = { render: () => <DataStatesDemo /> };
