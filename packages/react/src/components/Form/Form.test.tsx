import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Form } from './Form.js';
import { FormField } from '../FormField/FormField.js';
import { Input } from '../Input/Input.js';
import { Fieldset } from '../Fieldset/Fieldset.js';

function Field({ name, ...props }: { name: string } & React.ComponentProps<typeof Input>) {
  return (
    <FormField.Root name={name}>
      <FormField.Label>{name}</FormField.Label>
      <FormField.Control>
        <Input {...props} />
      </FormField.Control>
      <FormField.Error />
    </FormField.Root>
  );
}

describe('Form', () => {
  it('blocks submit, shows native + custom errors in field order, focuses the first, clears on edit', async () => {
    const onSubmit = vi.fn();
    const onInvalidSubmit = vi.fn();
    render(
      <Form
        onSubmit={onSubmit}
        onInvalidSubmit={onInvalidSubmit}
        validate={(data) => ({ email: data.get('email') === 'taken@x.io' && 'Already in use' })}
      >
        <Field name="name" required />
        <Field name="email" type="email" />
        <button type="submit">Save</button>
      </Form>,
    );
    await userEvent.type(screen.getByLabelText('email'), 'taken@x.io');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSubmit).not.toHaveBeenCalled();
    const name = screen.getByLabelText('name', { selector: 'input' });
    expect(name).toHaveFocus();
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Already in use')).toBeInTheDocument();
    expect(onInvalidSubmit.mock.calls[0]![0].map((e: { name: string }) => e.name)).toEqual(['name', 'email']);

    await userEvent.type(name, 'Ada');
    expect(name).not.toHaveAttribute('aria-invalid');
    await userEvent.clear(screen.getByLabelText('email'));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).toHaveBeenCalledOnce();
    expect((onSubmit.mock.calls[0]![0] as FormData).get('name')).toBe('Ada');
  });

  it('is busy while an async submit runs', async () => {
    let resolve!: () => void;
    render(
      <Form aria-label="f" onSubmit={() => new Promise<void>((r) => (resolve = r))}>
        <button type="submit">Go</button>
      </Form>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('form')).toHaveAttribute('aria-busy', 'true');
    resolve();
    await vi.waitFor(() => expect(screen.getByRole('form')).not.toHaveAttribute('aria-busy'));
  });

  it('Fieldset names its group and disables its controls', () => {
    render(
      <Fieldset legend="Billing" description="Shown on invoices" disabled>
        <input aria-label="VAT" />
      </Fieldset>,
    );
    const group = screen.getByRole('group', { name: 'Billing' });
    expect(group).toHaveAccessibleDescription('Shown on invoices');
    expect(screen.getByLabelText('VAT')).toBeDisabled();
  });
});
