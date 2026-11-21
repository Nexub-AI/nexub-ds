'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { CurrencyField } from '@nexub/react';

export default function Example() {
  const [currency, setCurrency] = React.useState<string | null>('USD');
  return (
    <div className="w-full max-w-sm">
      <CurrencyField
        label="Billing currency"
        description="Invoices are issued in this currency"
        priority={['USD', 'EUR', 'GBP', 'MYR', 'SGD']}
        priorityLabel="Common"
        restLabel="All currencies"
        value={currency}
        onValueChange={setCurrency}
      />
    </div>
  );
}
