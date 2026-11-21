import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SwitchField, CheckboxField, CheckboxGroupField } from './ChoiceFields.js';
import { Text } from '../Text/Text.js';

describe('SwitchField (11.1)', () => {
  it('labels the switch, describes it, and toggles from the label', async () => {
    const onCheckedChange = vi.fn();
    render(<SwitchField label="Online store" description="Shows the shop to buyers" onCheckedChange={onCheckedChange} />);
    const sw = screen.getByRole('switch', { name: 'Online store' });
    expect(sw).toHaveAccessibleDescription('Shows the shop to buyers');
    await userEvent.click(screen.getByText('Online store'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('layout="start" puts the switch before the label; an error marks it invalid', () => {
    render(<SwitchField label="Notify" layout="start" error="Turn this on to continue" />);
    const sw = screen.getByRole('switch', { name: 'Notify' });
    const label = screen.getByText('Notify');
    expect(sw.compareDocumentPosition(label) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(sw).toHaveAttribute('aria-invalid', 'true');
    expect(sw).toHaveAccessibleDescription('Turn this on to continue');
  });
});

describe('CheckboxField (11.1)', () => {
  it('labels the box, shows the aside, supports indeterminate', async () => {
    const onCheckedChange = vi.fn();
    const { rerender } = render(<CheckboxField label="Gift wrap" aside="$4.00" description="Paper and ribbon" onCheckedChange={onCheckedChange} />);
    const box = screen.getByRole('checkbox', { name: 'Gift wrap' });
    expect(screen.getByText('$4.00')).toBeInTheDocument();
    expect(box).toHaveAccessibleDescription('Paper and ribbon');
    await userEvent.click(screen.getByText('Gift wrap'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    rerender(<CheckboxField label="All rows" checked="indeterminate" />);
    expect(screen.getByRole('checkbox', { name: 'All rows' })).toHaveAttribute('aria-checked', 'mixed');
  });
});

describe('CheckboxGroupField (11.1)', () => {
  const options = [
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS', description: 'Carrier rates apply' },
    { value: 'push', label: 'Push', disabled: true },
  ];

  it('a fieldset named by its legend; picks add and remove values', async () => {
    const onValueChange = vi.fn();
    render(<CheckboxGroupField label="Channels" required options={options} defaultValue={['email']} onValueChange={onValueChange} />);
    expect(screen.getByRole('group', { name: 'Channels' })).toHaveAttribute('aria-required', 'true');
    await userEvent.click(screen.getByRole('checkbox', { name: 'SMS' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['email', 'sms']);
    await userEvent.click(screen.getByRole('checkbox', { name: 'Email' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['sms']);
    expect(screen.getByRole('checkbox', { name: 'Push' })).toBeDisabled();
  });

  it('one error for the group, every box marked invalid', () => {
    render(<CheckboxGroupField label="Channels" options={options} value={[]} error="Pick at least one" />);
    expect(screen.getByRole('group', { name: 'Channels' })).toHaveAccessibleDescription('Pick at least one');
    expect(screen.getByRole('checkbox', { name: 'Email' })).toHaveAttribute('aria-invalid', 'true');
  });
});

describe('Text status tones (11.1)', () => {
  it('danger, success and warning use the status roles', () => {
    render(
      <>
        <Text tone="danger">Failed</Text>
        <Text tone="success">Saved</Text>
        <Text tone="warning">Due soon</Text>
      </>,
    );
    expect(screen.getByText('Failed')).toHaveClass('text-error');
    expect(screen.getByText('Saved')).toHaveClass('text-success');
    expect(screen.getByText('Due soon')).toHaveClass('text-warning');
  });
});
