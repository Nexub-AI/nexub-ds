import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Autocomplete } from './Autocomplete.js';

const options = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
];

describe('Autocomplete', () => {
  it('renders without crashing', () => {
    render(<Autocomplete options={options} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders the input with placeholder', () => {
    render(<Autocomplete options={options} placeholder="Type to search" />);
    expect(screen.getByPlaceholderText('Type to search')).toBeInTheDocument();
  });

  it('renders option items', () => {
    render(<Autocomplete options={options} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Vue')).toBeInTheDocument();
    expect(screen.getByText('Svelte')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Autocomplete options={options} loading />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Autocomplete options={options} className="custom-autocomplete" />);
    expect(document.querySelector('.custom-autocomplete')).toBeInTheDocument();
  });
});
