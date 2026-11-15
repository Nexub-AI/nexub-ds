import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Fieldset } from './Fieldset.js';

describe('Fieldset', () => {
  it('the legend names the group and the description describes it', () => {
    render(
      <Fieldset legend="Billing address" description="Where invoices go.">
        <input aria-label="Street" />
      </Fieldset>,
    );
    const group = screen.getByRole('group', { name: 'Billing address' });
    expect(group).toHaveAccessibleDescription('Where invoices go.');
    expect(group).toContainElement(screen.getByLabelText('Street'));
  });

  it('no description, no aria-describedby', () => {
    render(<Fieldset legend="Plan" />);
    expect(screen.getByRole('group', { name: 'Plan' })).not.toHaveAttribute('aria-describedby');
  });

  it('disabled disables every control inside, natively', async () => {
    render(
      <Fieldset legend="Plan" disabled>
        <input aria-label="Seats" />
        <button type="button">Apply</button>
      </Fieldset>,
    );
    expect(screen.getByLabelText('Seats')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
    await userEvent.type(screen.getByLabelText('Seats'), '3');
    expect(screen.getByLabelText('Seats')).toHaveValue('');
  });

  it('forwards ref and native attributes', () => {
    const ref = React.createRef<HTMLFieldSetElement>();
    render(<Fieldset ref={ref} legend="Plan" name="plan" className="x" />);
    expect(ref.current).toBeInstanceOf(HTMLFieldSetElement);
    expect(ref.current).toHaveAttribute('name', 'plan');
    expect(ref.current).toHaveClass('x');
  });
});
