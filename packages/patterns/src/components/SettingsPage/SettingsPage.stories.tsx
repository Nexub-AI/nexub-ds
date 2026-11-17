import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Button, EmptyStatePreset } from '@nexub/react';
import { SettingsPage } from './SettingsPage.js';

const meta: Meta<typeof SettingsPage> = {
  title: 'Patterns/Pages/SettingsPage',
  component: SettingsPage,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof SettingsPage>;

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
      <SettingsPage
        as="div"
        groups={[]}
        loading={state === 'Loading'}
        emptyState={<EmptyStatePreset kind="noData" title="No settings yet" />}
        errorState={state === 'Error' ? <EmptyStatePreset kind="serverError" actions={<Button variant="tonal">Retry</Button>} /> : undefined}
      />
    </div>
  );
}

/** 10.5: `loading`, `emptyState` and `errorState` (the error wins). */
export const DataStates: Story = { render: () => <DataStatesDemo /> };
