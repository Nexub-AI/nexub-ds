import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { StatusPage } from './StatusPage.js';

describe('StatusPage', () => {
  it('notFound: one h1, code, default art and a home link', () => {
    const { container } = render(<StatusPage kind="notFound" code="404" homeHref="/" fullScreen />);
    const page = screen.getByRole('main');
    expect(page).toHaveClass('min-h-dvh');
    expect(page.getAttribute('data-nx')).toBe('status-page');
    expect(screen.getAllByRole('heading')).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/');
    expect(container.querySelector('svg[data-kind="notFound"]')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('serverError and offline are alerts with Retry', async () => {
    const onRetry = vi.fn();
    const { rerender } = render(<StatusPage kind="serverError" onRetry={onRetry} homeHref="/" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    expect(screen.queryByRole('link')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledOnce();
    rerender(<StatusPage kind="offline" onRetry={onRetry} />);
    expect(screen.getByRole('alert')).toHaveTextContent('You’re offline');
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('maintenance and noAccess: no default button without a target; Retry is not offered', () => {
    const { rerender } = render(<StatusPage kind="maintenance" as="div" onRetry={() => {}} homeHref="/" />);
    expect(screen.queryByRole('main')).toBeNull();
    expect(screen.getByRole('heading', { level: 1, name: 'Down for maintenance' })).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
    rerender(<StatusPage kind="noAccess" />);
    expect(screen.getByRole('heading', { level: 1, name: 'You don’t have access' })).toBeInTheDocument();
    expect(screen.queryByRole('link')).toBeNull();
    rerender(<StatusPage kind="noAccess" homeHref="/home" />);
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/home');
  });

  it('custom text, actions and illustration replace the defaults', () => {
    const { container, rerender } = render(
      <StatusPage
        kind="serverError"
        title="We hit a snag"
        description="Our team has been told."
        onRetry={() => {}}
        actions={<button type="button">Contact support</button>}
        illustration={<img alt="" src="data:," data-testid="art" />}
      />,
    );
    expect(screen.getByRole('heading', { name: 'We hit a snag' })).toBeInTheDocument();
    expect(screen.getByText('Our team has been told.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Contact support' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull();
    expect(screen.getByTestId('art')).toBeInTheDocument();
    expect(container.querySelector('svg[data-nx="illustration"]')).toBeNull();
    rerender(<StatusPage kind="notFound" illustration={null} homeHref="javascript:alert(1)" />);
    expect(container.querySelector('svg')).toBeNull();
    expect(screen.queryByRole('link')?.getAttribute('href') ?? '').not.toMatch(/^javascript:/i);
  });
});
