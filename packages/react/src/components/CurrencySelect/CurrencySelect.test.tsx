import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CurrencyField, CurrencySelect, currencyOptions } from './CurrencySelect.js';
import { MoneyInput } from '../MoneyInput/MoneyInput.js';

describe('currencyOptions (11.2)', () => {
  it('builds code, name and symbol from Intl, with priority codes first under a heading', () => {
    const options = currencyOptions('en-US', { currencies: ['eur', 'usd', 'myr'], priority: ['MYR'], priorityLabel: 'Common', restLabel: 'All' });
    expect(options.map((o) => o.value)).toEqual(['MYR', 'EUR', 'USD']);
    expect(options[0]).toMatchObject({ label: 'MYR · Malaysian Ringgit', group: 'Common' });
    expect(options[2]).toMatchObject({ label: 'USD · US Dollar', description: '$', group: 'All' });
    expect(options[2]!.keywords).toContain('$');
  });

  it('lists every code the runtime knows by default', () => {
    expect(currencyOptions('en').length).toBeGreaterThan(100);
  });
});

describe('CurrencySelect and CurrencyField (11.2)', () => {
  it('finds a currency by name and picks its code', async () => {
    const onValueChange = vi.fn();
    render(<CurrencyField label="Currency" locale="en-US" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('combobox', { name: 'Currency' }));
    await userEvent.type(screen.getByPlaceholderText('Search…'), 'singapore');
    await userEvent.click(screen.getByRole('option', { name: /SGD · Singapore Dollar/ }));
    expect(onValueChange).toHaveBeenCalledWith('SGD');
  });

  it('shows the picked currency on the trigger', () => {
    render(<CurrencySelect aria-label="Currency" locale="en-US" currencies={['USD', 'EUR']} value="EUR" />);
    expect(screen.getByRole('combobox', { name: 'Currency' })).toHaveTextContent('EUR · Euro');
  });

  it('sits in the MoneyInput currency slot next to the amount', () => {
    render(
      <MoneyInput
        aria-label="Amount"
        currency="EUR"
        locale="en-US"
        value={12}
        currencySlot={<CurrencySelect aria-label="Currency" locale="en-US" currencies={['USD', 'EUR']} value="EUR" />}
      />,
    );
    expect(screen.getByRole('combobox', { name: 'Currency' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Amount' })).toHaveValue('12.00');
  });
});
