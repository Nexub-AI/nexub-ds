'use client';

// A DataTable column's filter popover, split out so DataTable loads it (and Radix Popover,
// Input, Checkbox) only when a column sets `meta.filter`.

import * as React from 'react';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { Popover } from '../Popover/Popover.js';
import { Input } from '../Input/Input.js';
import { Checkbox } from '../Checkbox/Checkbox.js';
import { Button } from '../Button/Button.js';

export type ColumnFilterType = 'text' | 'select' | 'number-range';

export interface ColumnFilterProps {
  trigger: React.ReactElement;
  type: ColumnFilterType;
  /** The column's name, for the labels. */
  label: string;
  /** text: a string. select: the picked values. number-range: `[min, max]`, either may be undefined. */
  value: unknown;
  /** `undefined` clears the filter. */
  onChange: (value: unknown) => void;
  /** Choices for `select`; called only while the popover is open. */
  getOptions: () => readonly string[];
}

const toNumber = (text: string) => (text === '' || Number.isNaN(Number(text)) ? undefined : Number(text));
// The header handlers (grid arrows, Alt+Arrow reorder) hear events through the portal: keep them out.
const stop = (e: React.SyntheticEvent) => e.stopPropagation();

function Options({ value, onChange, getOptions }: Pick<ColumnFilterProps, 'value' | 'onChange' | 'getOptions'>) {
  const picked = Array.isArray(value) ? (value as string[]) : [];
  return (
    <ul className="flex max-h-60 flex-col gap-1 overflow-y-auto">
      {getOptions().map((option) => (
        <li key={option}>
          <label className="flex min-h-8 items-center gap-2 text-body-sm text-[var(--color-on-surface)]">
            <Checkbox
              checked={picked.includes(option)}
              onCheckedChange={(checked) => {
                const next = checked === true ? [...picked, option] : picked.filter((v) => v !== option);
                onChange(next.length ? next : undefined);
              }}
            />
            {option}
          </label>
        </li>
      ))}
    </ul>
  );
}

export function ColumnFilter({ trigger, type, label, value, onChange, getOptions }: ColumnFilterProps) {
  const messages = useNexubMessages();
  const name = messages.filterColumn(label);
  const [min, max] = Array.isArray(value) ? (value as (number | undefined)[]) : [];
  const range = (lo: number | undefined, hi: number | undefined) => onChange(lo === undefined && hi === undefined ? undefined : [lo, hi]);
  return (
    <Popover.Root>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="start" aria-label={name} className="flex w-56 flex-col gap-3 p-3" onKeyDown={stop} onFocus={stop}>
          {type === 'text' && (
            <Input size="sm" aria-label={name} value={typeof value === 'string' ? value : ''} onChange={(e) => onChange(e.target.value || undefined)} />
          )}
          {type === 'select' && <Options value={value} onChange={onChange} getOptions={getOptions} />}
          {type === 'number-range' && (
            <div className="flex items-center gap-2">
              <Input
                size="sm"
                type="number"
                aria-label={messages.filterMin}
                placeholder={messages.filterMin}
                value={min ?? ''}
                onChange={(e) => range(toNumber(e.target.value), max)}
              />
              <Input
                size="sm"
                type="number"
                aria-label={messages.filterMax}
                placeholder={messages.filterMax}
                value={max ?? ''}
                onChange={(e) => range(min, toNumber(e.target.value))}
              />
            </div>
          )}
          <Button variant="text" size="sm" className="self-start" disabled={value === undefined} onClick={() => onChange(undefined)}>
            {messages.clearFilter}
          </Button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
