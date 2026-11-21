'use client';

// StageCounter (11.3): a row of selectable stat cards that filters a list.
// Each card is a toggle button (aria-pressed); pressing the selected one again
// clears the filter (null = all). The failed count is said in words too.
import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { useControllableState } from '../../hooks/useControllableState.js';
import { useIntlLocale, useNexubMessages } from '../NexubProvider/NexubProvider.js';

export interface StageCounterStage {
  value: string;
  label: React.ReactNode;
  count: number;
  /** Shown beside the count in the danger tone, e.g. 3 → "3 failed". Hidden at 0. */
  failed?: number;
  /** Colours the count. @default 'default' */
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

interface StageCounterBase extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  stages: StageCounterStage[];
  /** Names the group, e.g. "Filter by stage". */
  'aria-label'?: string;
}

export interface StageCounterSingleProps extends StageCounterBase {
  multiple?: false;
  /** The selected stage, `null` = all. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
}

export interface StageCounterMultipleProps extends StageCounterBase {
  /** Several stages can be selected; an empty array = all. */
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

export type StageCounterProps = StageCounterSingleProps | StageCounterMultipleProps;

const TONE = { default: 'text-on-surface', success: 'text-success', warning: 'text-warning', danger: 'text-error', info: 'text-info' };

export const StageCounter = React.forwardRef<HTMLDivElement, StageCounterProps>(
  ({ stages, multiple, value: valueProp, defaultValue, onValueChange, className, ...props }, ref) => {
    const t = useNexubMessages();
    const locale = useIntlLocale();
    const [value, setValue] = useControllableState<string | null | string[]>({
      value: valueProp,
      defaultValue: defaultValue ?? (multiple ? [] : null),
      onChange: onValueChange as (v: string | null | string[]) => void,
    });
    const picked = Array.isArray(value) ? value : value == null ? [] : [value];
    const toggle = (v: string) => {
      const on = picked.includes(v);
      if (multiple) setValue(on ? picked.filter((p) => p !== v) : [...picked, v]);
      else setValue(on ? null : v);
    };
    return (
      <div ref={ref} role="group" data-nx="stage-counter" className={cn('flex flex-wrap gap-2', className)} {...props}>
        {stages.map((s) => {
          const pressed = picked.includes(s.value);
          return (
            <button
              key={s.value}
              type="button"
              aria-pressed={pressed}
              onClick={() => toggle(s.value)}
              className={cn(
                'flex min-w-32 flex-1 flex-col items-start gap-1 rounded-shape-container border p-3 text-start transition-colors',
                pressed
                  ? 'border-primary bg-primary-container text-on-primary-container'
                  : 'border-outline-variant bg-surface-elevated hover:bg-surface-container-low',
              )}
            >
              <span className={cn('text-label-md', pressed ? 'text-on-primary-container' : 'text-on-surface-variant')}>{s.label}</span>
              <span className="flex flex-wrap items-baseline gap-x-2">
                <span className={cn('text-title-lg tabular-nums', pressed ? 'text-on-primary-container' : TONE[s.tone ?? 'default'])}>
                  {s.count.toLocaleString(locale)}
                </span>
                {!!s.failed && (
                  <span className="text-label-md font-medium tabular-nums text-error">{t.failedCount(s.failed)}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    );
  },
);
StageCounter.displayName = 'StageCounter';
