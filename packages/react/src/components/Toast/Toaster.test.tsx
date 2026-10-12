import * as React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Toaster } from './Toaster.js';
import { toast } from './useToast.js';

afterEach(() => {
  act(() => toast.dismiss());
});

describe('Toaster', () => {
  it('renders the toast action and calls it', () => {
    const onClick = vi.fn();
    render(<Toaster />);
    act(() => {
      toast.custom('Message archived', { action: { label: 'Undo', onClick } });
    });
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
