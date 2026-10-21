import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen, act, fireEvent, renderHook } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { NexubProvider, useLocale, useNexubMessages, defaultMessages } from './NexubProvider.js';
import { Tabs } from '../Tabs/Tabs.js';
import { Alert } from '../Alert/Alert.js';
import { Banner } from '../Banner/Banner.js';
import { Chip } from '../Chip/Chip.js';
import { FilterChip } from '../FilterChip/FilterChip.js';
import { Spinner } from '../Spinner/Spinner.js';
import { SearchInput } from '../SearchInput/SearchInput.js';
import { PasswordInput } from '../PasswordInput/PasswordInput.js';
import { NumberInput } from '../NumberInput/NumberInput.js';
import { Pagination } from '../Pagination/Pagination.js';
import { Rating } from '../Rating/Rating.js';
import { AvatarGroup } from '../AvatarGroup/AvatarGroup.js';
import { Avatar } from '../Avatar/Avatar.js';
import { FileUpload } from '../FileUpload/FileUpload.js';
import { Autocomplete } from '../Autocomplete/Autocomplete.js';
import { DatePicker } from '../DatePicker/DatePicker.js';
import { DateRangePicker } from '../DateRangePicker/DateRangePicker.js';
import { CommandPalette } from '../CommandPalette/CommandPalette.js';
import { TopNav } from '../TopNav/TopNav.js';
import { NavigationRail } from '../NavigationRail/NavigationRail.js';
import { Sidebar } from '../Sidebar/Sidebar.js';
import { Breadcrumb } from '../Breadcrumb/Breadcrumb.js';
import { Toaster } from '../Toast/Toaster.js';
import { toast } from '../Toast/useToast.js';
import { NumberTicker } from '../NumberTicker/NumberTicker.js';

const noop = () => {};

afterEach(() => {
  act(() => toast.dismiss());
});

describe('NexubProvider context', () => {
  it('works without a provider: English defaults, en, ltr', () => {
    const { result } = renderHook(() => ({ m: useNexubMessages(), l: useLocale() }));
    expect(result.current.m).toBe(defaultMessages);
    expect(result.current.l).toEqual({ locale: 'en', dir: 'ltr' });
  });

  it('merges message overrides over the defaults', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NexubProvider messages={{ close: 'Fermer' }}>{children}</NexubProvider>
    );
    const { result } = renderHook(() => useNexubMessages(), { wrapper });
    expect(result.current.close).toBe('Fermer');
    expect(result.current.remove).toBe('Remove');
  });

  it.each([
    ['ar', 'rtl'],
    ['he-IL', 'rtl'],
    ['fa', 'rtl'],
    ['ur_PK', 'rtl'],
    ['en-US', 'ltr'],
    ['fr', 'ltr'],
  ])('derives dir for %s → %s', (locale, dir) => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NexubProvider locale={locale}>{children}</NexubProvider>
    );
    expect(renderHook(() => useLocale(), { wrapper }).result.current).toEqual({ locale, dir });
  });

  it('an explicit dir wins over the locale', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NexubProvider locale="ar" dir="ltr">{children}</NexubProvider>
    );
    expect(renderHook(() => useLocale(), { wrapper }).result.current.dir).toBe('ltr');
  });

  it('Radix primitives inherit dir="rtl"', () => {
    render(
      <NexubProvider locale="ar">
        <Tabs.Root defaultValue="a" data-testid="tabs">
          <Tabs.List>
            <Tabs.Trigger value="a">A</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      </NexubProvider>,
    );
    expect(screen.getByTestId('tabs')).toHaveAttribute('dir', 'rtl');
  });

  it('does not touch <html dir>', () => {
    render(<NexubProvider locale="ar">x</NexubProvider>);
    expect(document.documentElement).not.toHaveAttribute('dir');
  });

  it('renders no style attribute (strict CSP)', () => {
    expect(renderToString(<NexubProvider locale="ar"><Spinner /></NexubProvider>)).not.toContain('style="');
  });
});

describe('Intl locale fallback', () => {
  it('formats with the provider locale when no prop is given', () => {
    render(
      <NexubProvider locale="de-DE">
        <NumberTicker value={1234.5} data-testid="n" />
      </NexubProvider>,
    );
    expect(screen.getByTestId('n')).toHaveTextContent('1.234,5');
  });

  it('an explicit locale prop wins', () => {
    render(
      <NexubProvider locale="de-DE">
        <NumberTicker value={1234.5} locale="en-US" data-testid="n" />
      </NexubProvider>,
    );
    expect(screen.getByTestId('n')).toHaveTextContent('1,234.5');
  });

  it('DatePicker formats with the provider locale', () => {
    render(
      <NexubProvider locale="de-DE">
        <DatePicker value={new Date(2026, 0, 15)} />
      </NexubProvider>,
    );
    expect(screen.getByRole('button')).toHaveTextContent('15.01.2026');
  });
});

describe('English defaults still render', () => {
  it('dismiss / remove / clear / password / steppers / spinner', () => {
    render(
      <>
        <Alert onClose={noop}>a</Alert>
        <Banner onClose={noop}>b</Banner>
        <Chip onRemove={noop}>c</Chip>
        <FilterChip onRemove={noop}>f</FilterChip>
        <SearchInput defaultValue="q" />
        <PasswordInput />
        <NumberInput showSteppers />
        <Spinner />
      </>,
    );
    for (const name of ['Dismiss alert', 'Dismiss banner', 'Remove', 'Remove filter', 'Clear search', 'Show password', 'Increment', 'Decrement']) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument();
    }
    fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Loading…' })).toBeInTheDocument();
  });

  it('pagination, rating, avatar overflow', () => {
    render(
      <>
        <Pagination page={2} totalItems={100} pageSize={10} onPageChange={noop} />
        <Rating />
        <AvatarGroup max={1}>
          <Avatar name="A" />
          <Avatar name="B" />
          <Avatar name="C" />
        </AvatarGroup>
      </>,
    );
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 3' })).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: 'Rating' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '1 star' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '2 stars' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '2 more' })).toBeInTheDocument();
  });

  it('file upload', () => {
    render(
      <FileUpload.Root>
        <FileUpload.Dropzone />
        <FileUpload.List>
          <FileUpload.Item index={0} />
        </FileUpload.List>
      </FileUpload.Root>,
    );
    const input = screen.getByLabelText('Click to upload or drag and drop');
    expect(input).toHaveAttribute('type', 'file');
    fireEvent.change(input, { target: { files: [new File(['x'], 'a.txt')] } });
    expect(screen.getByRole('button', { name: 'Remove a.txt' })).toBeInTheDocument();
  });

  it('navigation landmarks and breadcrumb', () => {
    render(
      <>
        <TopNav.Menu />
        <NavigationRail.Root />
        <Sidebar.Root />
        <Breadcrumb.Root>
          <Breadcrumb.Ellipsis />
        </Breadcrumb.Root>
      </>,
    );
    expect(screen.getAllByRole('navigation', { name: 'Main' })).toHaveLength(2);
    expect(screen.getByRole('navigation', { name: 'Sidebar' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toHaveTextContent('More');
  });

  it('pickers and autocomplete', () => {
    render(
      <>
        <DatePicker />
        <DateRangePicker />
        <Autocomplete options={[]} loading />
      </>,
    );
    expect(screen.getByRole('button', { name: 'Pick a date' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pick a date range' })).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText('Search…').length).toBeGreaterThan(0);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('command palette', () => {
    render(
      <CommandPalette.Root open>
        <div />
      </CommandPalette.Root>,
    );
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument();
  });

  it('toaster close, region and undo', () => {
    render(<Toaster />);
    act(() => { toast.undoable('Deleted', { onUndo: noop }); });
    expect(screen.getByRole('region', { name: /Notifications/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
  });
});

describe('overrides through the provider', () => {
  it('translates component strings; explicit props still win', () => {
    render(
      <NexubProvider locale="fr" messages={{ dismissAlert: 'Fermer l’alerte', goToPage: (n) => `Page ${n}`, loading: 'Chargement…' }}>
        <Alert onClose={noop}>a</Alert>
        <Pagination page={1} totalItems={30} pageSize={10} onPageChange={noop} />
        <Spinner />
        <Spinner label="Envoi…" />
      </NexubProvider>,
    );
    expect(screen.getByRole('button', { name: 'Fermer l’alerte' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 2' })).toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Chargement…' })).toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Envoi…' })).toBeInTheDocument();
  });
});
