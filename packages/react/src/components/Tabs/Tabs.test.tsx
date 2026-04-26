import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
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
