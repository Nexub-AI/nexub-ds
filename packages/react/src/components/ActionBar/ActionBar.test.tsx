import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ActionBar } from './ActionBar.js';

describe('ActionBar', () => {
  it('is a region named by a string message, announced politely', () => {
    render(<ActionBar message="Unsaved changes"><button type="button">Save</button></ActionBar>);
    const region = screen.getByRole('region', { name: 'Unsaved changes' });
    expect(screen.getByText('Unsaved changes')).toHaveAttribute('aria-live', 'polite');
    expect(region).toContainElement(screen.getByRole('button', { name: 'Save' }));
  });

  it('aria-label wins over the message; a node message names nothing', () => {
    const { rerender } = render(<ActionBar message="Unsaved changes" aria-label="Form actions" />);
    expect(screen.getByRole('region', { name: 'Form actions' })).toBeInTheDocument();
    rerender(<ActionBar message={<b>3 changes</b>} />);
    expect(screen.getByRole('region')).not.toHaveAttribute('aria-label');
  });

  it('without a message there is no live region and actions sit at the end', () => {
    const { container } = render(<ActionBar aria-label="Actions"><button type="button">Save</button></ActionBar>);
    expect(container.querySelector('[aria-live]')).toBeNull();
    expect(screen.getByRole('button').parentElement).toHaveClass('ms-auto');
  });

  it('children stay interactive; ref and className forward', async () => {
    const onSave = vi.fn();
    const ref = React.createRef<HTMLDivElement>();
    render(<ActionBar ref={ref} className="x" message="Unsaved"><button type="button" onClick={onSave}>Save</button></ActionBar>);
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSave).toHaveBeenCalledOnce();
    expect(ref.current).toHaveClass('x', 'sticky');
  });
});
