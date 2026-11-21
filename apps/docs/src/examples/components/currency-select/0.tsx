'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { CurrencySelect } from '@nexub/react';

export default function Example() {
  const [currency, setCurrency] = React.useState<string | null>('EUR');
  return (
    <div className="w-full max-w-xs">
      <CurrencySelect aria-label="Currency" value={currency} onValueChange={setCurrency} />
    </div>
  );
}
