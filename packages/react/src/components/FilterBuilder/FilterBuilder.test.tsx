import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { FilterBuilder, countFilters, type FilterField, type FilterGroup } from './FilterBuilder.js';

const fields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'amount', label: 'Amount', type: 'number' },
];

function Harness({ onChange }: { onChange: (g: FilterGroup) => void }) {
  const [value, setValue] = React.useState<FilterGroup>({ id: 'root', combinator: 'and', rules: [] });
  return (
    <FilterBuilder
      fields={fields}
      value={value}
      onValueChange={(g) => {
        setValue(g);
        onChange(g);
      }}
    />
  );
}

describe('FilterBuilder', () => {
  it('adds a rule, takes a value, nests a group and switches AND/OR', async () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    const root = screen.getByRole('group', { name: 'Filters, match all' });
    expect(root).toBeInTheDocument();

    await userEvent.click(screen.getAllByRole('button', { name: 'Add filter' })[0]!);
    expect(screen.getByRole('combobox', { name: 'Field' })).toHaveTextContent('Name');
    expect(screen.getByRole('combobox', { name: 'Condition' })).toHaveTextContent('contains');
    await userEvent.type(screen.getByRole('textbox', { name: 'Value' }), 'acme');
    let last = onChange.mock.lastCall![0] as FilterGroup;
    expect(last.rules[0]).toMatchObject({ field: 'name', operator: 'contains', value: 'acme' });

    await userEvent.click(screen.getByRole('button', { name: 'Add group' }));
    expect(screen.getAllByRole('group', { name: /Filters, match/ })).toHaveLength(2);
    // One level deep by default: the nested group can't add another.
    expect(screen.getAllByRole('button', { name: 'Add group' })).toHaveLength(1);

    await userEvent.click(screen.getAllByRole('radio', { name: 'Any' })[0]!);
    last = onChange.mock.lastCall![0] as FilterGroup;
    expect(last.combinator).toBe('or');
    expect(JSON.parse(JSON.stringify(last))).toEqual(last); // plain JSON

    await userEvent.click(screen.getByRole('button', { name: 'Remove group' }));
    expect(screen.getAllByRole('group', { name: /Filters, match/ })).toHaveLength(1);
  });

  it('shows each keystroke in the value field at once and reports every edit', async () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Add filter' }));
    onChange.mockClear();
    const input = screen.getByRole('textbox', { name: 'Value' }) as HTMLInputElement;
    for (const [i, ch] of [...'acme'].entries()) {
      await userEvent.type(input, ch);
      expect(input.value).toBe('acme'.slice(0, i + 1));
    }
    expect(onChange.mock.calls.map(([g]) => (g as FilterGroup).rules[0]).map((r) => (r as { value: string }).value)).toEqual([
      'a',
      'ac',
      'acm',
      'acme',
    ]);
    // Edits apply to the latest value: adding a rule keeps the typed text.
    await userEvent.click(screen.getByRole('button', { name: 'Add filter' }));
    const last = onChange.mock.lastCall![0] as FilterGroup;
    expect(last.rules).toHaveLength(2);
    expect(last.rules[0]).toMatchObject({ value: 'acme' });
  });

  it('countFilters counts filled rules, nested ones and "is empty"', () => {
    const g: FilterGroup = {
      id: 'a',
      combinator: 'and',
      rules: [
        { id: '1', field: 'name', operator: 'contains', value: 'x' },
        { id: '2', field: 'name', operator: 'contains', value: '' },
        { id: '3', field: 'name', operator: 'isEmpty', value: '' },
        { id: 'b', combinator: 'or', rules: [{ id: '4', field: 'amount', operator: 'greaterThan', value: '5' }] },
      ],
    };
    expect(countFilters(g)).toBe(3);
  });
});
