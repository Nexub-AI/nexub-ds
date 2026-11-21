import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Stepper } from './Stepper.js';

describe('Stepper statuses (11.4)', () => {
  it('reads each status after the label and marks error, warning, skipped and cancelled', () => {
    const { container } = render(
      <Stepper
        aria-label="Payout"
        current={2}
        steps={[
          { label: 'Details', status: 'complete' },
          { label: 'Identity', status: 'skipped' },
          { label: 'Bank check', status: 'error', description: <a href="#retry">Bank rejected the account</a> },
          { label: 'Review', status: 'warning' },
          { label: 'Payout', status: 'cancelled' },
        ]}
      />,
    );
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('completed');
    expect(items[1]).toHaveTextContent('skipped');
    expect(items[2]).toHaveTextContent('problem');
    expect(items[3]).toHaveTextContent('needs attention');
    expect(items[4]).toHaveTextContent('cancelled');
    // An explicit status wins over `current`: step 3 is an error, not the current step.
    expect(items[2]).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: 'Bank rejected the account' })).toBeInTheDocument();
    expect(container.querySelector('.line-through')).toHaveTextContent('Payout');
  });

  it('every step complete without current={-1}', () => {
    render(<Stepper current={3} steps={['A', 'B', 'C'].map((label) => ({ label, status: 'complete' as const }))} />);
    for (const item of screen.getAllByRole('listitem')) expect(item).toHaveTextContent('completed');
    expect(screen.getAllByRole('listitem').some((li) => li.hasAttribute('aria-current'))).toBe(false);
  });

  it('renders step actions, and skipped steps do not block the next one', async () => {
    const onStepChange = vi.fn();
    render(
      <Stepper
        current={0}
        onStepChange={onStepChange}
        steps={[
          { label: 'Upload', status: 'error', actions: <button type="button">Retry upload</button> },
          { label: 'Optional', status: 'skipped' },
          { label: 'Confirm' },
        ]}
      />,
    );
    expect(screen.getByRole('button', { name: 'Retry upload' })).toBeInTheDocument();
    // The first open step is the failed one, so it is reachable.
    await userEvent.click(screen.getByRole('button', { name: /Upload/ }));
    expect(onStepChange).toHaveBeenCalledWith(0);
  });

  it('without statuses the 11.3 behaviour is unchanged', () => {
    render(<Stepper current={1} steps={[{ label: 'One' }, { label: 'Two' }, { label: 'Three' }]} />);
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('completed');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[2]).not.toHaveTextContent('completed');
  });
});
