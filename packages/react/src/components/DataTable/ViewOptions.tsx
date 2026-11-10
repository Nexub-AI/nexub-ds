'use client';

// DataTable's "View" menu, split out so DataTable loads it (and Radix DropdownMenu)
// only when `viewOptions` is set.

import * as React from 'react';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { DropdownMenu } from '../DropdownMenu/DropdownMenu.js';
import type { DataTableDensity } from './DataTable.js';

export interface ViewOptionsProps {
  trigger: React.ReactElement;
  density: DataTableDensity;
  onDensityChange: (density: DataTableDensity) => void;
  /** Hideable columns. */
  columns: { id: string; label: string; visible: boolean; toggle: (visible: boolean) => void }[];
}

export function ViewOptions({ trigger, density, onDensityChange, columns }: ViewOptionsProps) {
  const messages = useNexubMessages();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Label>{messages.density}</DropdownMenu.Label>
        <DropdownMenu.RadioGroup value={density} onValueChange={(v) => onDensityChange(v as DataTableDensity)}>
          <DropdownMenu.RadioItem value="comfortable">{messages.comfortable}</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="compact">{messages.compact}</DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
        <DropdownMenu.Separator />
        <DropdownMenu.Label>{messages.columns}</DropdownMenu.Label>
        {columns.map((c) => (
          <DropdownMenu.CheckboxItem
            key={c.id}
            checked={c.visible}
            onCheckedChange={(v) => c.toggle(v === true)}
            // Keep the menu open while toggling several columns.
            onSelect={(e) => e.preventDefault()}
          >
            {c.label}
          </DropdownMenu.CheckboxItem>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
