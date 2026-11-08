'use client';

import * as React from 'react';
import { Sortable } from '@nexub/react';

export default function Example() {
  const [widgets, setWidgets] = React.useState(['Revenue', 'Active users', 'Churn', 'Support tickets']);
  return (
    <Sortable aria-label="Dashboard widgets" items={widgets} getId={(w) => w} getLabel={(w) => w} onReorder={setWidgets} className="w-full max-w-sm">
      {(w) => w}
    </Sortable>
  );
}
