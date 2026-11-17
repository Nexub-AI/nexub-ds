import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SignUpPage } from './index.js';

const terms = 'I agree to the Terms';

async function fill() {
  await userEvent.type(screen.getByLabelText(/^Name/), ' Mei Tan ');
  await userEvent.type(screen.getByLabelText(/^Email/), 'mei@example.com');
  await userEvent.type(screen.getByLabelText(/^Password/), 'Abcdef12');
  await userEvent.click(screen.getByRole('checkbox', { name: /I agree/ }));
}

describe('SignUpPage', () => {
  it('has one h1, labelled fields with autofill hints, the social slot and the sign-in link', async () => {
    const onSignIn = vi.fn();
    render(
      <SignUpPage
        onSubmit={() => {}}
        termsLabel={terms}
        onSignIn={onSignIn}
        social={<button type="button">Continue with a passkey</button>}
        logo={<span>Logo</span>}
        description="It takes a minute."
        error="That email is already in use"
      />,
    );
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: 'Create your account' })).toBeInTheDocument();
    expect(screen.getByText('It takes a minute.')).toBeInTheDocument();
    expect(screen.getByLabelText(/^Name/)).toHaveAttribute('autocomplete', 'name');
    expect(screen.getByLabelText(/^Email/)).toHaveAttribute('autocomplete', 'email');
    expect(screen.getByLabelText(/^Password/)).toHaveAttribute('autocomplete', 'new-password');
    expect(screen.getByLabelText(/^Name/)).toHaveAttribute('aria-required', 'true');
    expect(screen.getByRole('button', { name: 'Continue with a passkey' })).toBeInTheDocument();
    expect(screen.getByText('or')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('That email is already in use');
    expect(screen.queryByLabelText(/Phone number/)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(onSignIn).toHaveBeenCalled();
  });

  it('checks a field when it loses focus and clears the message once it is right', async () => {
    render(<SignUpPage as="div" onSubmit={() => {}} termsLabel={terms} />);
    expect(screen.queryByRole('main')).not.toBeInTheDocument();
    const email = screen.getByLabelText(/^Email/);
    await userEvent.type(email, 'mei');
    expect(screen.queryByText('Enter a valid email address')).not.toBeInTheDocument();
    await userEvent.tab();
    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
    expect(email).toHaveAttribute('aria-invalid', 'true');
    await userEvent.type(email, '@example.com');
    expect(screen.queryByText('Enter a valid email address')).not.toBeInTheDocument();
  });

  it('says the password strength in words as it changes', async () => {
    render(<SignUpPage onSubmit={() => {}} termsLabel={terms} />);
    const password = screen.getByLabelText(/^Password/);
    await userEvent.type(password, 'abc');
    const live = screen.getByText('Password strength: Weak');
    expect(live).toHaveAttribute('aria-live', 'polite');
    await userEvent.type(password, 'defgh');
    expect(live).toHaveTextContent('Password strength: Weak');
    await userEvent.type(password, 'A');
    expect(live).toHaveTextContent('Password strength: Fair');
    await userEvent.type(password, '1');
    expect(live).toHaveTextContent('Password strength: Good');
    await userEvent.type(password, 'more');
    expect(live).toHaveTextContent('Password strength: Strong');
  });

  it('lists every problem on an invalid submit, with links to the fields', async () => {
    const onSubmit = vi.fn();
    render(<SignUpPage onSubmit={onSubmit} termsLabel={terms} phone />);
    await userEvent.type(screen.getByLabelText(/Phone number/), '98');
    await userEvent.click(screen.getByRole('button', { name: 'Create an account' }));
    expect(onSubmit).not.toHaveBeenCalled();
    const summary = screen.getByRole('alert', { name: 'There is a problem' });
    expect(summary).toHaveFocus();
    expect(within(summary).getAllByRole('link').map((a) => a.textContent)).toEqual([
      'Enter your name',
      'Enter a valid email address',
      'Choose a stronger password',
      'Enter a valid phone number',
      'Accept the terms to continue',
    ]);
    await userEvent.click(within(summary).getByRole('link', { name: 'Enter your name' }));
    expect(screen.getByLabelText(/^Name/)).toHaveFocus();
    await userEvent.click(within(summary).getByRole('link', { name: 'Accept the terms to continue' }));
    expect(screen.getByRole('checkbox')).toHaveFocus();
  });

  it('submits trimmed values, with the phone number only when asked for and entered', async () => {
    let finish!: () => void;
    const onSubmit = vi.fn(() => new Promise<void>((r) => (finish = r)));
    const { unmount } = render(<SignUpPage onSubmit={onSubmit} termsLabel={terms} phone defaultCountry="IN" submitLabel="Join" title="Join us" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Join us' })).toBeInTheDocument();
    await fill();
    await userEvent.click(screen.getByRole('button', { name: 'Join' }));
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Mei Tan', email: 'mei@example.com', password: 'Abcdef12' });
    // Waiting on the promise: the button is busy.
    expect(screen.getByRole('button', { name: /Join/ })).toHaveAttribute('aria-busy', 'true');
    finish();
    await screen.findByRole('button', { name: 'Join' });
    await userEvent.type(screen.getByLabelText(/Phone number/), '9847012345');
    await userEvent.click(screen.getByRole('button', { name: /Join/ }));
    expect(onSubmit).toHaveBeenLastCalledWith({ name: 'Mei Tan', email: 'mei@example.com', password: 'Abcdef12', phone: '+919847012345' });
    expect(screen.queryByRole('alert', { name: 'There is a problem' })).not.toBeInTheDocument();
    unmount();
  });

  it('takes its own password rules and shows loading', async () => {
    const onSubmit = vi.fn();
    const { rerender } = render(<SignUpPage onSubmit={onSubmit} termsLabel={terms} passwordRules={[(p) => p.length >= 4]} />);
    await userEvent.type(screen.getByLabelText(/^Name/), 'Mei');
    await userEvent.type(screen.getByLabelText(/^Email/), 'mei@example.com');
    await userEvent.type(screen.getByLabelText(/^Password/), 'abcd');
    expect(screen.getByText('Password strength: Strong')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('checkbox'));
    await userEvent.click(screen.getByRole('button', { name: 'Create an account' }));
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Mei', email: 'mei@example.com', password: 'abcd' });
    rerender(<SignUpPage onSubmit={onSubmit} termsLabel={terms} passwordRules={[]} loading />);
    expect(screen.getByRole('button', { name: /Create an account/ })).toHaveAttribute('aria-busy', 'true');
  });

  it('renders on the server', () => {
    expect(renderToString(<SignUpPage onSubmit={() => {}} termsLabel={terms} phone />)).toContain('Create your account');
  });
});
