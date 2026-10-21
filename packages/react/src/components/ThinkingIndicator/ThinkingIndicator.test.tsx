import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThinkingIndicator } from './ThinkingIndicator.js';

describe('ThinkingIndicator', () => {
  it('is a polite live status with the default label in the DOM', () => {
    render(<ThinkingIndicator />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveTextContent('Thinking');
    expect(status.querySelector('.nx-morph')).toHaveAttribute('aria-hidden', 'true');
  });

  it('takes a custom label, messages and size', () => {
    const { rerender } = render(<ThinkingIndicator label="Searching the web" size="sm" />);
    expect(screen.getByRole('status')).toHaveTextContent('Searching the web');
    rerender(<ThinkingIndicator messages={{ thinking: 'Réflexion' }} />);
    expect(screen.getByRole('status')).toHaveTextContent('Réflexion');
  });

  it('label={null} hides the text visually but keeps it announced', () => {
    render(<ThinkingIndicator label={null} />);
    expect(screen.getByText('Thinking')).toHaveClass('sr-only');
  });

  it('renders no style attribute', () => {
    expect(renderToString(<ThinkingIndicator size="sm" />)).not.toMatch(/ style="/);
  });
});
