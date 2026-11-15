import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Stepper } from './Stepper.js';
import { ResizablePanels } from '../ResizablePanels/ResizablePanels.js';
import { ActionBar } from '../ActionBar/ActionBar.js';

const steps = [
  { id: 'account', label: 'Account' },
  { id: 'billing', label: 'Billing' },
  { id: 'team', label: 'Team' },
  { id: 'review', label: 'Review' },
];

describe('Stepper', () => {
  it('marks the current step, reads progress, and only lets linear steps be reached', async () => {
    const onStepChange = vi.fn();
    render(<Stepper aria-label="Setup" steps={steps} current={1} onStepChange={onStepChange} />);
    const current = screen.getByText('Billing').closest('li')!;
    expect(current).toHaveAttribute('aria-current', 'step');
    expect(screen.getByRole('button', { name: 'Step 1 of 4: Account, completed' })).toBeInTheDocument();
    // Billing is current; Team waits until Billing is done.
    expect(screen.queryByRole('button', { name: /Team/ })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Account/ }));
    expect(onStepChange).toHaveBeenCalledWith(0);
  });

  it('nonLinear makes every other step reachable', () => {
    render(<Stepper steps={steps} current={0} onStepChange={() => {}} nonLinear />);
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });
});

describe('ResizablePanels', () => {
  it('keyboard moves the separator within the minimums', async () => {
    const onSizesChange = vi.fn();
    render(
      <ResizablePanels defaultSizes={[30, 70]} minSizes={[20, 20]} onSizesChange={onSizesChange}>
        <div>Nav</div>
        <div>Main</div>
      </ResizablePanels>,
    );
    const handle = screen.getByRole('separator', { name: 'Resize panels' });
    expect(handle).toHaveAttribute('aria-valuenow', '30');
    expect(handle).toHaveAttribute('aria-valuemax', '80');
    handle.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onSizesChange).toHaveBeenLastCalledWith([35, 65]);
    await userEvent.keyboard('{Home}');
    expect(onSizesChange).toHaveBeenLastCalledWith([20, 80]);
    await userEvent.keyboard('{End}{Enter}');
    expect(onSizesChange).toHaveBeenLastCalledWith([30, 70]);
  });
});

describe('ActionBar', () => {
  it('is a region named by its message', () => {
    render(
      <ActionBar message="Unsaved changes">
        <button type="button">Save</button>
      </ActionBar>,
    );
    expect(screen.getByRole('region', { name: 'Unsaved changes' })).toContainElement(screen.getByRole('button', { name: 'Save' }));
  });
});
