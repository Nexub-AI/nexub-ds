'use client'; // docs preview: server pages import every example

import { Avatar, Badge, CATEGORY_COLORS, IconChip } from '@nexub/react';
import { CreditCard } from '@nexub/icons';

export default function Example() {
  return (
    <div className="flex flex-col gap-3">
      {CATEGORY_COLORS.map((c) => (
        <div key={c} className="flex items-center gap-4">
          <IconChip category={c}>
            <CreditCard />
          </IconChip>
          <Badge category={c} variant="soft">
            {c}
          </Badge>
          <Avatar category={c} name="Ada Lovelace" />
        </div>
      ))}
    </div>
  );
}
