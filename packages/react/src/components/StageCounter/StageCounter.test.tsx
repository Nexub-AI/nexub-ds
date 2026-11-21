import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { describe, it, expect, vi } from 'vitest';
import { StageCounter } from './StageCounter.js';

const stages = [
  { value: 'queued', label: 'Queued', count: 12 },
  { value: 'running', label: 'Running', count: 4, tone: 'info' as const },
  { value: 'done', label: 'Done', count: 1280, failed: 3 },
];

describe('StageCounter', () => {
  it('is a named group of toggle buttons with counts and a spoken failed count', async () => {
    const { container } = render(<StageCounter aria-label="Filter by stage" stages={stages} />);
    expect(screen.getByRole('group', { name: 'Filter by stage' })).toBeInTheDocument();
    const done = screen.getByRole('button', { name: /Done/ });
    expect(done).toHaveAttribute('aria-pressed', 'false');
    expect(done).toHaveTextContent('1,280');
    expect(screen.getByText('3 failed')).toHaveClass('text-error');
    const { violations } = await axe.run(container, { rules: { 'color-contrast': { enabled: false }, region: { enabled: false } } });
    expect(violations.map((v) => v.id)).toEqual([]);
  });

  it('selects one stage and clears it on a second press (null = all)', async () => {
    const onValueChange = vi.fn();
    render(<StageCounter aria-label="Stages" stages={stages} defaultValue="queued" onValueChange={onValueChange} />);
    expect(screen.getByRole('button', { name: /Queued/ })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(screen.getByRole('button', { name: /Running/ }));
    expect(onValueChange).toHaveBeenLastCalledWith('running');
    expect(screen.getByRole('button', { name: /Queued/ })).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(screen.getByRole('button', { name: /Running/ }));
    expect(onValueChange).toHaveBeenLastCalledWith(null);
    expect(screen.getByRole('button', { name: /Running/ })).toHaveAttribute('aria-pressed', 'false');
  });

  it('is controllable, and takes several values with multiple', async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<StageCounter aria-label="Stages" stages={stages} value={null} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('button', { name: /Done/ }));
    expect(onValueChange).toHaveBeenLastCalledWith('done');
    expect(screen.getByRole('button', { name: /Done/ })).toHaveAttribute('aria-pressed', 'false');
    rerender(<StageCounter aria-label="Stages" stages={stages} multiple value={['queued']} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('button', { name: /Done/ }));
    expect(onValueChange).toHaveBeenLastCalledWith(['queued', 'done']);
    await userEvent.click(screen.getByRole('button', { name: /Queued/ }));
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });
});
