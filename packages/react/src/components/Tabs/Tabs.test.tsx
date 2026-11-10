import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Tabs } from './Tabs.js';

function TestTabs() {
  return (
    <Tabs.Root defaultValue="tab1">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Tab One</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Tab Two</Tabs.Trigger>
        <Tabs.Trigger value="tab3">Tab Three</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">Content One</Tabs.Content>
      <Tabs.Content value="tab2">Content Two</Tabs.Content>
      <Tabs.Content value="tab3">Content Three</Tabs.Content>
    </Tabs.Root>
  );
}

describe('Tabs', () => {
  it('renders tab list', () => {
    render(<TestTabs />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab One' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab Two' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab Three' })).toBeInTheDocument();
  });

  it('shows the default tab content', () => {
    render(<TestTabs />);
    expect(screen.getByText('Content One')).toBeInTheDocument();
  });

  it('clicking a trigger shows its content', async () => {
    const user = userEvent.setup();
    render(<TestTabs />);

    await user.click(screen.getByRole('tab', { name: 'Tab Two' }));
    expect(screen.getByText('Content Two')).toBeInTheDocument();
  });

  it('ArrowRight navigates to the next tab', async () => {
    const user = userEvent.setup();
    render(<TestTabs />);

    const tabOne = screen.getByRole('tab', { name: 'Tab One' });
    tabOne.focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('tab', { name: 'Tab Two' })).toHaveFocus();
  });

  it('forwards className on Root', () => {
    render(
      <Tabs.Root defaultValue="a" className="custom-tabs">
        <Tabs.List>
          <Tabs.Trigger value="a">A</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="a">A content</Tabs.Content>
      </Tabs.Root>,
    );
    expect(document.querySelector('.custom-tabs')).toBeInTheDocument();
  });

  it('forwards ref on Root', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Tabs.Root ref={ref} defaultValue="a">
        <Tabs.List>
          <Tabs.Trigger value="a">A</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="a">A content</Tabs.Content>
      </Tabs.Root>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('Tabs.Content display', () => {
  it('keeps the inactive-hidden class even when the consumer passes a display class', () => {
    render(
      <Tabs.Root defaultValue="a">
        <Tabs.List>
          <Tabs.Trigger value="a">A</Tabs.Trigger>
          <Tabs.Trigger value="b">B</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="a" className="flex">Panel A</Tabs.Content>
        <Tabs.Content value="b" className="flex md:grid" data-testid="b">Panel B</Tabs.Content>
      </Tabs.Root>,
    );
    const inactive = screen.getByTestId('b');
    expect(inactive).toHaveAttribute('data-state', 'inactive');
    expect(inactive.className).toContain('data-[state=inactive]:!hidden');
    expect(inactive.className).toContain('flex');
  });

  it('variant="pill" marks the list and keeps the triggers above the thumb', () => {
    render(
      <Tabs.Root defaultValue="a">
        <Tabs.List variant="pill">
          <Tabs.Trigger value="a">A</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>,
    );
    expect(screen.getByRole('tablist')).toHaveAttribute('data-variant', 'pill');
    expect(screen.getByRole('tab')).toHaveClass('z-10');
  });

  it('scrolls a newly active tab into view inside the list', async () => {
    const user = userEvent.setup();
    render(<TestTabs />);
    const list = screen.getByRole('tablist');
    const scrollBy = vi.fn();
    list.scrollBy = scrollBy as never;
    list.getBoundingClientRect = () => ({ left: 0, right: 100, top: 0, bottom: 40 }) as DOMRect;
    screen.getByRole('tab', { name: 'Tab Three' }).getBoundingClientRect = () =>
      ({ left: 120, right: 180, top: 0, bottom: 40 }) as DOMRect;
    await user.click(screen.getByRole('tab', { name: 'Tab Three' }));
    expect(scrollBy).toHaveBeenCalledWith(expect.objectContaining({ left: 80, top: 0 }));
  });
});
