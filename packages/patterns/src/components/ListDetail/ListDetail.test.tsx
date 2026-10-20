import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ListDetail } from './ListDetail.js';

// jsdom has no container queries; these check structure and the narrow-mode
// switch. The side-by-side layout is covered by the visual suite.
describe('ListDetail', () => {
  it('renders labelled list and detail regions', () => {
    render(<ListDetail list={<p>Inbox</p>} detail={<p>Message</p>} listLabel="Messages" detailLabel="Message" />);
    expect(screen.getByRole('region', { name: 'Messages' })).toHaveTextContent('Inbox');
    expect(screen.getByRole('region', { name: 'Message' })).toHaveTextContent('Message');
  });

  it('swaps which pane shows when narrow, and backs out', async () => {
    const onBack = vi.fn();
    const { rerender } = render(<ListDetail list="L" detail="D" listLabel="L" detailLabel="D" onBack={onBack} />);
    expect(screen.getByRole('region', { name: 'L' })).toHaveClass('flex');
    expect(screen.getByRole('region', { name: 'D' })).toHaveClass('hidden');

    rerender(<ListDetail list="L" detail="D" listLabel="L" detailLabel="D" onBack={onBack} showDetail />);
    expect(screen.getByRole('region', { name: 'L' })).toHaveClass('hidden');
    await userEvent.setup().click(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
