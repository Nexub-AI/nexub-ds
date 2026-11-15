'use client';

import * as React from 'react';
import { Select } from '@nexub/react';

interface VersionSelectProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onValueChange: (value: string) => void;
}

/** A labelled Select, used by the migration guides and the changelog. */
export function VersionSelect({ label, value, options, onValueChange }: VersionSelectProps) {
  const id = React.useId();
  return (
    <div className="flex flex-col gap-1">
      <span id={id} className="text-label-sm font-medium text-[var(--color-on-surface-muted)]">
        {label}
      </span>
      <Select.Root value={value} onValueChange={onValueChange}>
        <Select.Trigger aria-labelledby={id} className="w-[180px]">
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          {options.map((o) => (
            <Select.Item key={o.value} value={o.value}>
              {o.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  );
}
