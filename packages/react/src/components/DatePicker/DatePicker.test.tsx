import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { fr } from 'date-fns/locale/fr';
import { DatePicker } from './DatePicker.js';
import { NexubProvider, defaultMessages } from '../NexubProvider/NexubProvider.js';

describe('DatePicker', () => {
  it('renders a button trigger', () => {
    render(<DatePicker onChange={vi.fn()} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows placeholder text when no date selected', () => {
    render(<DatePicker onChange={vi.fn()} placeholder="Choose date" />);
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Choose date',
    );
  });

  it('shows formatted date when value is provided', () => {
    const date = new Date(2024, 0, 15); // Jan 15, 2024
    render(<DatePicker value={date} onChange={vi.fn()} />);
    expect(screen.getByRole('button').getAttribute('aria-label')).toMatch(
      /Jan/,
    );
  });

  it('opens popover on click', () => {
    render(<DatePicker onChange={vi.fn()} />);
    fireEvent.click(screen.getByRole('button'));
    // Calendar should be in the document
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<DatePicker disabled onChange={vi.fn()} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('forwards className to the trigger button', () => {
    render(<DatePicker onChange={vi.fn()} className="custom-class" />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});

describe('DatePicker locale + RTL', () => {
  const jan = new Date(2024, 0, 15);
  const withProvider =
    (props: Omit<React.ComponentProps<typeof NexubProvider>, 'children'>) =>
    ({ children }: { children: React.ReactNode }) => <NexubProvider {...props}>{children}</NexubProvider>;

  it.each(['ar', 'he'])('renders dir=rtl on the calendar for %s', (locale) => {
    render(<DatePicker value={jan} onChange={vi.fn()} />, { wrapper: withProvider({ locale }) });
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('grid').closest('[dir]')).toHaveAttribute('dir', 'rtl');
  });

  it('mirrors the nav chevrons in RTL (previous points to the inline start)', () => {
    const navIcons = (locale: string) => {
      const view = render(<DatePicker value={jan} onChange={vi.fn()} />, { wrapper: withProvider({ locale }) });
      fireEvent.click(screen.getByRole('button'));
      const icons = {
        prev: screen.getByRole('button', { name: defaultMessages.previousMonth }).innerHTML,
        next: screen.getByRole('button', { name: defaultMessages.nextMonth }).innerHTML,
      };
      view.unmount();
      return icons;
    };
    const ltr = navIcons('en');
    const rtl = navIcons('ar');
    expect(ltr.prev).not.toBe(ltr.next);
    expect(rtl.prev).toBe(ltr.next);
    expect(rtl.next).toBe(ltr.prev);
  });

  it('uses a date-fns locale for the caption and trigger (prop wins over provider)', () => {
    render(<DatePicker value={jan} onChange={vi.fn()} locale={fr} />, {
      wrapper: withProvider({ locale: 'en' }),
    });
    expect(screen.getByRole('button').getAttribute('aria-label')).toMatch(/janv/);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/janvier 2024/i)).toBeInTheDocument();
  });

  it('takes the date-fns locale from NexubProvider', () => {
    render(<DatePicker value={jan} onChange={vi.fn()} />, { wrapper: withProvider({ locale: 'fr', dateLocale: fr }) });
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/janvier 2024/i)).toBeInTheDocument();
  });

  it('labels nav and days from messages', () => {
    render(<DatePicker value={jan} onChange={vi.fn()} />, {
      wrapper: withProvider({
        messages: { previousMonth: 'Mois précédent', nextMonth: 'Mois suivant', selectedDate: (l) => `${l} (choisi)` },
      }),
    });
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button', { name: 'Mois précédent' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mois suivant' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /\(choisi\)$/ })).toBeInTheDocument();
  });

  it('renders no style attribute on the server', () => {
    expect(renderToString(<DatePicker value={jan} onChange={vi.fn()} locale={fr} />)).not.toContain('style="');
  });
});
