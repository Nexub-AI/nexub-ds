import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VisuallyHidden } from './VisuallyHidden.js';

describe('VisuallyHidden', () => {
  it('renders children in the DOM', () => {
    render(<VisuallyHidden>hidden text</VisuallyHidden>);
    expect(screen.getByText('hidden text')).toBeInTheDocument();
  });
});
