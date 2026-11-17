import type { Meta } from '@storybook/react';
import * as React from 'react';
import { EmptyStatePreset } from '@nexub/react';
import { ListDetail } from './ListDetail.js';

const meta: Meta = { title: 'Patterns/ListDetail' };
export default meta;

const messages = ['Quarterly report', 'Design review notes', 'Invoice #4821', 'Team offsite'];

function Demo({ width }: { width: number }) {
  const [selected, setSelected] = React.useState<number | null>(0);
  return (
    <div style={{ width, height: 320, border: '1px solid var(--color-outline-variant)', borderRadius: 16, overflow: 'hidden' }}>
      <ListDetail
        listLabel="Messages"
        detailLabel="Message"
        showDetail={selected !== null && width < 720}
        onBack={() => setSelected(null)}
        list={
          <ul className="p-2">
            {messages.map((m, i) => (
              <li key={m}>
                <button
                  type="button"
                  onClick={() => setSelected(i)}
                  aria-current={selected === i || undefined}
                  className="nx-state-layer relative w-full rounded-shape-container px-3 py-2.5 text-left text-body-sm text-[var(--color-on-surface)] aria-[current]:bg-[var(--color-secondary-container)] aria-[current]:text-[var(--color-on-secondary-container)]"
                >
                  {m}
                </button>
              </li>
            ))}
          </ul>
        }
        detail={
          <div className="p-6">
            <h2 className="text-headline-sm">{selected === null ? 'Nothing selected' : messages[selected]}</h2>
            <p className="mt-2 text-body-md text-[var(--color-on-surface-variant)]">
              The detail pane flexes; the list keeps a fixed width.
            </p>
          </div>
        }
      />
    </div>
  );
}

/** At 720px+ the panes sit side by side (a container query, not the viewport). */
export const Wide = () => <Demo width={900} />;

/** Narrow: one pane at a time, with a back button. */
export const Narrow = () => <Demo width={375} />;

/** 10.5: `loading`, `emptyState` and `errorState` fill the list pane (the error wins). */
export const DataStates = () => (
  <div className="grid w-full max-w-4xl grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-6">
    {(['Loading', 'Empty', 'Error'] as const).map((state) => (
      <div key={state} className="flex min-w-0 flex-col gap-2">
        <p className="m-0 text-label-md text-[var(--color-on-surface-variant)]">{state}</p>
        <div className="h-96 overflow-hidden rounded-shape-container border border-[var(--color-outline-variant)]">
          <ListDetail
            listLabel={`Messages, ${state.toLowerCase()}`}
            detailLabel={`Message, ${state.toLowerCase()}`}
            list={null}
            detail={null}
            loading={state === 'Loading'}
            emptyState={state === 'Empty' ? <EmptyStatePreset kind="noData" size="sm" /> : undefined}
            errorState={state === 'Error' ? <EmptyStatePreset kind="serverError" size="sm" /> : undefined}
          />
        </div>
      </div>
    ))}
  </div>
);
