import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FormField } from './FormField.js';
import { Input } from '../Input/Input.js';

function TestField({
  invalid = false,
  required = false,
}: {
  invalid?: boolean;
  required?: boolean;
}) {
  return (
    <FormField.Root id="email" name="email" invalid={invalid} required={required}>
      <FormField.Label>Email</FormField.Label>
      <FormField.Control>
        <Input />
      </FormField.Control>
      <FormField.Description>We will never share your email.</FormField.Description>
      <FormField.Error>Invalid email address.</FormField.Error>
    </FormField.Root>
  );
}

describe('FormField', () => {
  it('renders label associated with control', () => {
    render(<TestField />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<TestField />);
    expect(screen.getByText('We will never share your email.')).toBeInTheDocument();
  });

  it('does not render error when not invalid', () => {
    render(<TestField />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders error message when invalid', () => {
    render(<TestField invalid />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Invalid email address.')).toBeInTheDocument();
  });

  it('wires aria-describedby on control', () => {
    render(<TestField />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby');
  });

  it('sets aria-required on control when required', () => {
    render(<TestField required />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-required', 'true');
  });
});
