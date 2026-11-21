import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { CurrencyField, CurrencySelect } from './CurrencySelect.js';
import { MoneyInput } from '../MoneyInput/MoneyInput.js';

const meta: Meta<typeof CurrencyField> = {
  title: 'Forms/CurrencySelect',
  component: CurrencyField,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof CurrencyField>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>('USD');
    return (
      <div style={{ maxWidth: 360 }}>
        <CurrencyField
          label="Billing currency"
          description="Invoices are issued in this currency"
          locale="en-US"
          priority={['USD', 'EUR', 'MYR', 'SGD']}
          priorityLabel="Common"
          restLabel="All currencies"
          value={value}
          onValueChange={setValue}
        />
      </div>
    );
  },
};

export const InMoneyInput: Story = {
  render: () => {
    const [currency, setCurrency] = React.useState('EUR');
    const [amount, setAmount] = React.useState<number | null>(1250);
    return (
      <div style={{ maxWidth: 420 }}>
        <MoneyInput
          aria-label="Amount"
          currency={currency}
          locale="en-US"
          value={amount}
          onValueChange={setAmount}
          currencySlot={
            <CurrencySelect aria-label="Currency" locale="en-US" currencies={['USD', 'EUR', 'GBP', 'MYR', 'SGD']} value={currency} onValueChange={(c) => c && setCurrency(c)} />
          }
        />
      </div>
    );
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
      <CurrencyField label="Invalid" locale="en-US" error="Pick a currency" required />
      <CurrencyField label="Read-only" locale="en-US" readOnly defaultValue="GBP" />
      <CurrencyField label="Disabled" locale="en-US" disabled defaultValue="JPY" />
    </div>
  ),
};
