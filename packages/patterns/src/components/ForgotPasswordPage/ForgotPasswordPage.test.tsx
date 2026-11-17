import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { ForgotPasswordPage } from './index.js';

afterEach(() => vi.useRealTimers());

describe('ForgotPasswordPage', () => {
  it('asks for the email and announces a bad one', async () => {
    const onSubmit = vi.fn();
    const onBack = vi.fn();
    render(<ForgotPasswordPage onSubmit={onSubmit} onBackToSignIn={onBack} error="Too many attempts" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Reset your password' })).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Too many attempts');
    const email = screen.getByLabelText(/^Email/);
    await userEvent.type(email, 'mei');
    await userEvent.click(screen.getByRole('button', { name: 'Send reset link' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(email).toHaveFocus();
    await userEvent.click(screen.getByRole('button', { name: 'Back to sign in' }));
    expect(onBack).toHaveBeenCalled();
  });

  it('confirms without saying whether the account exists', async () => {
    const onSubmit = vi.fn(() => Promise.resolve());
    render(<ForgotPasswordPage onSubmit={onSubmit} defaultEmail=" mei@example.com " logo={<span>Logo</span>} />);
    await userEvent.click(screen.getByRole('button', { name: 'Send reset link' }));
    expect(onSubmit).toHaveBeenCalledWith('mei@example.com');
    expect(await screen.findByRole('heading', { level: 1, name: 'Check your email' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('If an account exists for mei@example.com, we sent a link to reset your password.');
    expect(screen.queryByRole('button', { name: /Resend/ })).not.toBeInTheDocument();
  });

  it('stays on the form when sending fails', async () => {
    render(<ForgotPasswordPage onSubmit={() => Promise.reject(new Error('offline'))} defaultEmail="mei@example.com" loading={false} />);
    await userEvent.click(screen.getByRole('button', { name: 'Send reset link' }));
    expect(await screen.findByRole('button', { name: 'Send reset link' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Reset your password' })).toBeInTheDocument();
  });

  it('lets the user resend after the cooldown, then waits again', async () => {
    vi.useFakeTimers();
    let t = 1_000;
    const onResend = vi.fn();
    render(
      <ForgotPasswordPage as="div" sent defaultEmail="mei@example.com" onSubmit={() => {}} onResend={onResend} onBackToSignIn={() => {}} now={() => t} error="Could not send" />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Could not send');
    expect(screen.getByText(/Resend email in/)).toHaveTextContent('Resend email in 0:30');
    expect(screen.queryByRole('button', { name: 'Resend email' })).not.toBeInTheDocument();
    t += 30_000;
    act(() => vi.advanceTimersByTime(1_000));
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Resend email' })));
    expect(onResend).toHaveBeenCalledWith('mei@example.com');
    expect(screen.getByText(/Resend email in/)).toHaveTextContent('0:30');
    expect(screen.getByRole('button', { name: 'Back to sign in' })).toBeInTheDocument();
  });

  it('renders both views on the server with the full wait', () => {
    expect(renderToString(<ForgotPasswordPage onSubmit={() => {}} />)).toContain('Reset your password');
    const html = renderToString(<ForgotPasswordPage sent onSubmit={() => {}} onResend={() => {}} resendAfter={90} />);
    expect(html).toContain('1:30');
  });
});
