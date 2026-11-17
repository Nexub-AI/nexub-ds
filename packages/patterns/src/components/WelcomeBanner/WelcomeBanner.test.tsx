import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { WelcomeBanner } from './WelcomeBanner.js';

describe('WelcomeBanner', () => {
  it('is a region named by its title, with description, actions and decorative media', () => {
    render(
      <WelcomeBanner
        title="Welcome back, Mei"
        description="You have 2 bills due this week."
        actions={<button type="button">Review bills</button>}
        media={<svg data-testid="art" />}
      />,
    );
    const banner = screen.getByRole('region', { name: 'Welcome back, Mei' });
    expect(banner.getAttribute('data-nx')).toBe('welcome-banner');
    expect(screen.getByRole('heading', { level: 2, name: 'Welcome back, Mei' })).toBeInTheDocument();
    expect(screen.getByText('You have 2 bills due this week.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Review bills' })).toBeInTheDocument();
    expect(screen.getByTestId('art').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('button', { name: 'Dismiss' })).toBeNull();
  });

  it('calls onDismiss from the close button; level sets the heading', async () => {
    const onDismiss = vi.fn();
    render(<WelcomeBanner title="Set up your account" level={3} onDismiss={onDismiss} />);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});
