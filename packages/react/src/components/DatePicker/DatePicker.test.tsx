import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { fr } from 'date-fns/locale/fr';
import { DatePicker } from './DatePicker.js';
import { NexubProvider, defaultMessages } from '../NexubProvider/NexubProvider.js';

describe('DatePicker', () => {
  it('renders a button trigger', () => {
    render(<DatePicker onValueChange={vi.fn()} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows placeholder text when no date selected', () => {
    render(<DatePicker onValueChange={vi.fn()} placeholder="Choose date" />);
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Choose date',
    );
  });

  it('shows formatted date when value is provided', () => {
    const date = new Date(2024, 0, 15); // Jan 15, 2024
    render(<DatePicker value={date} onValueChange={vi.fn()} />);
    expect(screen.getByRole('button').getAttribute('aria-label')).toMatch(
      /Jan/,
    );
  });

  it('opens popover on click', () => {
    render(<DatePicker onValueChange={vi.fn()} />);
    fireEvent.click(screen.getByRole('button'));
    // Calendar should be in the document
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<DatePicker disabled onValueChange={vi.fn()} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('forwards className to the trigger button', () => {
    render(<DatePicker onValueChange={vi.fn()} className="custom-class" />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});

describe('DatePicker locale + RTL', () => {
  const jan = new Date(2024, 0, 15);
  const withProvider =
    (props: Omit<React.ComponentProps<typeof NexubProvider>, 'children'>) =>
    ({ children }: { children: React.ReactNode }) => <NexubProvider {...props}>{children}</NexubProvider>;

  it.each(['ar', 'he'])('renders dir=rtl on the calendar for %s', (locale) => {
    render(<DatePicker value={jan} onValueChange={vi.fn()} />, { wrapper: withProvider({ locale }) });
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('grid').closest('[dir]')).toHaveAttribute('dir', 'rtl');
  });

  it('mirrors the nav chevrons in RTL (previous points to the inline start)', () => {
    const navIcons = (locale: string) => {
      const view = render(<DatePicker value={jan} onValueChange={vi.fn()} />, { wrapper: withProvider({ locale }) });
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
    render(<DatePicker value={jan} onValueChange={vi.fn()} locale={fr} />, {
      wrapper: withProvider({ locale: 'en' }),
    });
    expect(screen.getByRole('button').getAttribute('aria-label')).toMatch(/janv/);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/janvier 2024/i)).toBeInTheDocument();
  });

  it('takes the date-fns locale from NexubProvider', () => {
    render(<DatePicker value={jan} onValueChange={vi.fn()} />, { wrapper: withProvider({ locale: 'fr', dateLocale: fr }) });
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/janvier 2024/i)).toBeInTheDocument();
  });

  it('labels nav and days from messages', () => {
    render(<DatePicker value={jan} onValueChange={vi.fn()} />, {
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
    expect(renderToString(<DatePicker value={jan} onValueChange={vi.fn()} locale={fr} />)).not.toContain('style="');
  });
});

describe('DatePicker 7.5', () => {
  it('typeable: Enter that confirms an IME composition does not commit (9.3)', () => {
    const onChange = vi.fn();
    render(<DatePicker typeable aria-label="Due" onValueChange={onChange} />);
    const input = screen.getByRole('textbox', { name: 'Due' });
    fireEvent.change(input, { target: { value: '01/15/2024' } });
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('typeable: Enter commits a valid typed date', () => {
    const onChange = vi.fn();
    render(<DatePicker typeable aria-label="Due" onValueChange={onChange} />);
    const input = screen.getByRole('textbox', { name: 'Due' });
    fireEvent.change(input, { target: { value: '01/15/2024' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith(new Date(2024, 0, 15));
  });

  it('typeable: invalid or disabled text stays, is aria-invalid and leaves the value', () => {
    const onChange = vi.fn();
    render(<DatePicker typeable aria-label="Due" onValueChange={onChange} disabledDates={{ dayOfWeek: [0, 6] }} />);
    const input = screen.getByRole('textbox', { name: 'Due' });
    fireEvent.change(input, { target: { value: 'nope' } });
    fireEvent.blur(input);
    expect(input).toHaveValue('nope');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    fireEvent.change(input, { target: { value: '01/13/2024' } }); // a Saturday
    fireEvent.blur(input);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('presets set the value and close', () => {
    const onChange = vi.fn();
    const date = new Date(2024, 0, 22);
    render(<DatePicker onValueChange={onChange} presets={[{ label: 'In a week', date }]} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button', { name: 'In a week' }));
    expect(onChange).toHaveBeenCalledWith(date);
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });

  it('disabledDates disables matching days', () => {
    render(<DatePicker value={new Date(2024, 0, 15)} disabledDates={{ dayOfWeek: [0, 6] }} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button', { name: /January 13, 2024/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /January 15, 2024/ })).toBeEnabled();
  });
});

describe('DatePicker 10.4', () => {
  it('size: md by default, sm on request', () => {
    const { rerender } = render(<DatePicker />);
    expect(screen.getByRole('button')).toHaveClass('h-control-md', 'px-3.5', 'text-body-md');
    rerender(<DatePicker size="sm" />);
    expect(screen.getByRole('button')).toHaveClass('h-control-sm', 'text-body-sm');
  });

  it('readOnly: the calendar cannot open', () => {
    render(<DatePicker readOnly value={new Date(2024, 0, 15)} />);
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('data-readonly');
    expect(trigger).not.toBeDisabled();
    fireEvent.click(trigger);
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });

  it('readOnly + typeable: the input is read-only and the calendar button is off', () => {
    render(<DatePicker readOnly typeable aria-label="Due" value={new Date(2024, 0, 15)} />);
    expect(screen.getByLabelText('Due')).toHaveAttribute('readonly');
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('invalid marks the trigger', () => {
    render(<DatePicker invalid />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-invalid', 'true');
  });

  it('day cells follow the density variable and use tabular numbers', () => {
    render(<DatePicker value={new Date(2024, 0, 15)} />);
    fireEvent.click(screen.getByRole('button'));
    const day = screen.getAllByRole('button').find((b) => b.textContent === '15')!;
    expect(day).toHaveClass('h-[var(--day-cell,2rem)]', 'w-[var(--day-cell,2rem)]', 'tabular-nums');
  });
});

describe('DatePicker sheet (10.6)', () => {
  const sheetAttr = () => document.querySelector('[data-nx-sheet]')?.getAttribute('data-nx-sheet') ?? null;

  it('sheet={false} keeps the popover (11.0)', () => {
    render(<DatePicker aria-label="When" sheet={false} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(sheetAttr()).toBeNull();
  });

  it('marks the calendar popover with data-nx-sheet="auto" by default (11.0), and still closes', () => {
    const { unmount } = render(<DatePicker aria-label="When" />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(sheetAttr()).toBe('auto');
    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    unmount();

    render(<DatePicker aria-label="When" sheet="auto" />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('grid').closest('[data-nx-sheet]')).toHaveAttribute('data-nx-sheet', 'auto');
  });
});
