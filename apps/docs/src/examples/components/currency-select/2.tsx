'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { CurrencySelect, MoneyInput } from '@nexub/react';

export default function Example() {
  const [currency, setCurrency] = React.useState('EUR');
  const [amount, setAmount] = React.useState<number | null>(1250);
  return (
    <div className="w-full max-w-md">
      <MoneyInput
        aria-label="Amount"
        currency={currency}
        value={amount}
        onValueChange={setAmount}
        currencySlot={<CurrencySelect aria-label="Currency" value={currency} onValueChange={(c) => c && setCurrency(c)} />}
      />
    </div>
  );
}
