import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KeyboardShortcut } from './KeyboardShortcut.js';

describe('KeyboardShortcut', () => {
  it('renders all keys', () => {
    render(<KeyboardShortcut keys={['Ctrl', 'K']} />);
    expect(screen.getByText('Ctrl')).toBeInTheDocument();
    expect(screen.getByText('K')).toBeInTheDocument();
  });

  it('renders separators between keys', () => {
    render(<KeyboardShortcut keys={['Ctrl', 'Shift', 'P']} />);
    const separators = screen.getAllByText('+');
    expect(separators).toHaveLength(2);
  });

  it('renders a single key without separator', () => {
    render(<KeyboardShortcut keys={['Enter']} />);
    expect(screen.getByText('Enter')).toBeInTheDocument();
    expect(screen.queryByText('+')).not.toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<KeyboardShortcut keys={['A']} className="custom" />);
    const el = document.querySelector('.custom');
    expect(el).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<KeyboardShortcut ref={ref} keys={['A']} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
