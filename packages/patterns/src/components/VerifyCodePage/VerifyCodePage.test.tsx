import * as React from 'react';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { VerifyCodePage } from './index.js';

afterEach(() => vi.useRealTimers());

describe('VerifyCodePage', () => {
  it('names where the code went and submits as soon as the code is full', async () => {
    const onComplete = vi.fn();
    render(<VerifyCodePage destination="+65 •••• 4821" onComplete={onComplete} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Enter the code' })).toBeInTheDocument();
    expect(screen.getByText('We sent a 6-digit code to +65 •••• 4821.')).toBeInTheDocument();
    const boxes = within(screen.getByRole('group', { name: 'Verification code' })).getAllByRole('textbox');
    expect(boxes).toHaveLength(6);
    expect(boxes[0]).toHaveAttribute('autocomplete', 'one-time-code');
    const submit = screen.getByRole('button', { name: 'Continue' });
    expect(submit).toBeDisabled();
    await userEvent.click(boxes[0]!);
    await userEvent.keyboard('123456');
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith('123456');
    await userEvent.click(submit);
    expect(onComplete).toHaveBeenCalledTimes(2);
  });

  it('clears the boxes and returns to the first on an error; read-only while checking', async () => {
    const { rerender } = render(<VerifyCodePage as="div" destination="m•••@example.com" length={4} onComplete={() => {}} title="Two-step verification" description="Check your inbox." submitLabel="Verify" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Two-step verification' })).toBeInTheDocument();
    expect(screen.getByText('Check your inbox.')).toBeInTheDocument();
    const boxes = screen.getAllByRole('textbox');
    await userEvent.click(boxes[0]!);
    await userEvent.keyboard('1234');
    rerender(<VerifyCodePage as="div" destination="m•••@example.com" length={4} onComplete={() => {}} loading submitLabel="Verify" />);
    expect(boxes[0]).toHaveAttribute('readonly');
    rerender(<VerifyCodePage as="div" destination="m•••@example.com" length={4} onComplete={() => {}} error="That code is not right" submitLabel="Verify" />);
    expect(await screen.findByRole('alert')).toHaveTextContent('That code is not right');
    await waitFor(() => expect(boxes[0]).toHaveFocus());
    expect(boxes.map((b) => (b as HTMLInputElement).value).join('')).toBe('');
    expect(boxes[0]).toHaveFocus();
    expect(boxes[0]).toHaveAttribute('aria-invalid', 'true');
    // Submitting with the code incomplete does nothing.
    fireEvent.submit(boxes[0]!.closest('form')!);
  });

  it('counts down to Resend, sends, and counts again; a failed resend stays ready', async () => {
    vi.useFakeTimers();
    let t = 5_000;
    const onResend = vi.fn<() => Promise<void>>(() => Promise.resolve());
    render(<VerifyCodePage destination="+65 •••• 4821" onComplete={() => {}} onResend={onResend} now={() => t} expiresAt={5_000 + 600_000} />);
    expect(screen.getByText(/Resend code in/)).toHaveTextContent('Resend code in 0:30');
    expect(screen.getByText(/Code expires in/)).toHaveTextContent('10:00');
    t += 3_000;
    act(() => vi.advanceTimersByTime(1_000));
    expect(screen.getByText(/Resend code in/)).toHaveTextContent('Resend code in 0:27');
    t += 27_000;
    act(() => vi.advanceTimersByTime(1_000));
    onResend.mockImplementationOnce(() => Promise.reject(new Error('offline')));
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Resend code' })));
    expect(screen.getByRole('button', { name: 'Resend code' })).toBeInTheDocument();
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Resend code' })));
    expect(onResend).toHaveBeenCalledTimes(2);
    expect(screen.getByText(/Resend code in/)).toHaveTextContent('Resend code in 0:30');
  });

  it('offers Resend at once without a cooldown, a different destination and other methods', async () => {
    const onChange = vi.fn();
    const onMethod = vi.fn();
    render(
      <VerifyCodePage
        destination="+65 •••• 4821"
        onComplete={() => {}}
        onResend={() => {}}
        resendAfter={0}
        onChangeDestination={onChange}
        methods={[
          { id: 'app', label: 'Use an authenticator app' },
          { id: 'recovery', label: 'Use a recovery code' },
        ]}
        onMethodChange={onMethod}
      />,
    );
    expect(screen.getByRole('button', { name: 'Resend code' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Use a different number' }));
    expect(onChange).toHaveBeenCalled();
    const nav = screen.getByRole('navigation', { name: 'Other ways to verify' });
    await userEvent.click(within(nav).getByRole('button', { name: 'Use a recovery code' }));
    expect(onMethod).toHaveBeenCalledWith('recovery');
  });

  it('shows no footer or method list when there is nothing to offer', () => {
    render(<VerifyCodePage destination="x" onComplete={() => {}} methods={[]} />);
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(screen.queryByText(/Resend/)).not.toBeInTheDocument();
  });
});
