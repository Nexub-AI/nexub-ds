import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import * as React from 'react';
import { ErrorSummary, useFormErrors } from './ErrorSummary.js';

const errors = [
  { id: 'email', message: 'Enter an email address' },
  { id: 'password', message: 'Password must be 8 characters or more' },
];

describe('ErrorSummary', () => {
  it('renders nothing without errors', () => {
    const { container } = render(<ErrorSummary errors={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('is an alert labelled by its heading, with a link per error', () => {
    render(<ErrorSummary errors={errors} />);
    const alert = screen.getByRole('alert', { name: 'There is a problem' });
    expect(alert).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('link', { name: 'Enter an email address' })).toHaveAttribute('href', '#email');
  });

  it('takes focus when errors arrive, and again for each new errors array', () => {
    const { rerender } = render(
      <>
        <input id="email" />
        <ErrorSummary errors={[]} />
      </>,
    );
    rerender(
      <>
        <input id="email" />
        <ErrorSummary errors={errors} />
      </>,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveFocus();
    screen.getByRole('textbox').focus();
    rerender(
      <>
        <input id="email" />
        <ErrorSummary errors={errors} />
      </>,
    );
    expect(screen.getByRole('textbox')).toHaveFocus(); // same array: no focus steal
    rerender(
      <>
        <input id="email" />
        <ErrorSummary errors={[...errors]} />
      </>,
    );
    expect(alert).toHaveFocus();
  });

  it('a link focuses its field and reports it', () => {
    const onFocusField = vi.fn();
    render(
      <>
        <ErrorSummary errors={errors} onFocusField={onFocusField} />
        <input id="email" />
      </>,
    );
    const link = screen.getByRole('link', { name: 'Enter an email address' });
    const notPrevented = fireEvent.click(link);
    expect(notPrevented).toBe(false);
    expect(document.getElementById('email')).toHaveFocus();
    expect(onFocusField).toHaveBeenCalledWith('email');
  });

  it('renders no inline style (strict CSP)', () => {
    expect(renderToString(<ErrorSummary errors={errors} />)).not.toContain('style="');
  });
});

describe('useFormErrors', () => {
  it('lists set errors and wires field/message ids', () => {
    const map = { email: 'Enter an email address', name: undefined };
    const { result } = renderHook(() => useFormErrors(map));
    expect(result.current.errors).toEqual([{ id: 'email', message: 'Enter an email address' }]);
    expect(result.current.fieldProps('email')).toEqual({
      id: 'email',
      'aria-invalid': true,
      'aria-describedby': 'email-error',
    });
    expect(result.current.fieldProps('name')).toEqual({
      id: 'name',
      'aria-invalid': undefined,
      'aria-describedby': undefined,
    });
    expect(result.current.errorProps('email')).toEqual({ id: 'email-error' });
  });

  it('keeps the errors array stable for the same map', () => {
    const map = { email: 'x' };
    const { result, rerender } = renderHook(() => useFormErrors(map));
    const first = result.current.errors;
    rerender();
    expect(result.current.errors).toBe(first);
  });
});
