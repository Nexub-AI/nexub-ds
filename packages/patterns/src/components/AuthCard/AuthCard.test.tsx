import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { AuthCard } from './AuthCard.js';

describe('AuthCard', () => {
  it('renders title as h1', () => {
    render(
      <AuthCard title="Sign in">
        <input placeholder="Email" />
      </AuthCard>,
    );
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toBe('Sign in');
  });

  it('renders children inside the card body', () => {
    render(
      <AuthCard title="Login">
        <button data-testid="submit-btn">Submit</button>
      </AuthCard>,
    );
    expect(screen.getByTestId('submit-btn')).toBeDefined();
  });

  it('renders logo when provided', () => {
    render(
      <AuthCard title="Login" logo={<img data-testid="logo" src="/logo.svg" alt="Logo" />}>
        <span>body</span>
      </AuthCard>,
    );
    expect(screen.getByTestId('logo')).toBeDefined();
  });

  it('does not render logo container when logo is omitted', () => {
    const { container } = render(
      <AuthCard title="Login">
        <span>body</span>
      </AuthCard>,
    );
    // no img should be present
    expect(container.querySelectorAll('img').length).toBe(0);
  });

  it('renders description when provided', () => {
    render(
      <AuthCard title="Login" description="Welcome back!">
        <span>body</span>
      </AuthCard>,
    );
    expect(screen.getByText('Welcome back!')).toBeDefined();
  });

  it('does not render description element when omitted', () => {
    render(
      <AuthCard title="Login">
        <span>body</span>
      </AuthCard>,
    );
    expect(screen.queryByText('Welcome back!')).toBeNull();
  });

  it('renders footer when provided', () => {
    render(
      <AuthCard
        title="Login"
        footer={<a data-testid="back-link" href="/signup">Create account</a>}
      >
        <span>body</span>
      </AuthCard>,
    );
    expect(screen.getByTestId('back-link')).toBeDefined();
  });

  it('does not render footer container when footer is omitted', () => {
    const { container } = render(
      <AuthCard title="Login">
        <span>body</span>
      </AuthCard>,
    );
    expect(container.querySelectorAll('a').length).toBe(0);
  });

  it('forwards className to root element', () => {
    const { container } = render(
      <AuthCard title="Login" className="auth-custom">
        <span>body</span>
      </AuthCard>,
    );
    expect(container.firstElementChild?.classList.contains('auth-custom')).toBe(true);
  });
});
