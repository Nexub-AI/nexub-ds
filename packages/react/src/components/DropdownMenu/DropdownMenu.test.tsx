import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DropdownMenu } from './DropdownMenu.js';

function TestDropdownMenu({ onItemClick }: { onItemClick?: () => void }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content>
          <DropdownMenu.Label>Actions</DropdownMenu.Label>
          <DropdownMenu.Item onSelect={onItemClick}>Edit</DropdownMenu.Item>
          <DropdownMenu.Item onSelect={onItemClick}>Duplicate</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item onSelect={onItemClick} disabled>
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

describe('DropdownMenu', () => {
  it('renders trigger button', () => {
    render(<TestDropdownMenu />);
    expect(screen.getByText('Open Menu')).toBeInTheDocument();
  });

  it('opens menu on trigger click', async () => {
    const user = userEvent.setup();
    render(<TestDropdownMenu />);

    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    await user.click(screen.getByText('Open Menu'));
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Duplicate')).toBeInTheDocument();
  });

  it('fires onSelect when item is clicked', async () => {
    const user = userEvent.setup();
    const onItemClick = vi.fn();
    render(<TestDropdownMenu onItemClick={onItemClick} />);

    await user.click(screen.getByText('Open Menu'));
    await user.click(screen.getByText('Edit'));
    expect(onItemClick).toHaveBeenCalledTimes(1);
  });

  it('closes menu on Escape key', async () => {
    const user = userEvent.setup();
    render(<TestDropdownMenu />);

    await user.click(screen.getByText('Open Menu'));
    expect(screen.getByText('Edit')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    });
  });

  it('renders label and separator', async () => {
    const user = userEvent.setup();
    render(<TestDropdownMenu />);

    await user.click(screen.getByText('Open Menu'));
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('disabled item is not interactive', async () => {
    const user = userEvent.setup();
    const onItemClick = vi.fn();
    render(<TestDropdownMenu onItemClick={onItemClick} />);

    await user.click(screen.getByText('Open Menu'));
    const deleteItem = screen.getByText('Delete');
    expect(deleteItem.closest('[data-disabled]')).toBeTruthy();
  });
});

describe('DropdownMenu sheet (10.6)', () => {
  const sheetAttr = () => document.querySelector('[data-nx-sheet]')?.getAttribute('data-nx-sheet') ?? null;
  const Menu = ({ sheet }: { sheet?: boolean | 'auto' }) => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>Sheet trigger</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content sheet={sheet}>
          <DropdownMenu.Item>Sheet item</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );

  it('sheet={false} keeps the popover (11.0)', async () => {
    render(<Menu sheet={false} />);
    await userEvent.setup().click(screen.getByText('Sheet trigger'));
    expect(await screen.findByText('Sheet item')).toBeInTheDocument();
    expect(sheetAttr()).toBeNull();
  });

  it('marks the content with data-nx-sheet="auto" by default (11.0), and still opens and closes', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Menu />);
    await user.click(screen.getByText('Sheet trigger'));
    expect(await screen.findByText('Sheet item')).toBeInTheDocument();
    expect(sheetAttr()).toBe('auto');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByText('Sheet item')).not.toBeInTheDocument());
    unmount();

    render(<Menu sheet="auto" />);
    await user.click(screen.getByText('Sheet trigger'));
    expect((await screen.findByText('Sheet item')).closest('[data-nx-sheet]')).toHaveAttribute('data-nx-sheet', 'auto');
  });
});

describe('indicator (12.2)', () => {
  function ThemeMenu({ indicator }: { indicator?: 'start' | 'end' }) {
    const [theme, setTheme] = React.useState('dark');
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>Theme</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.RadioGroup value={theme} onValueChange={setTheme}>
              <DropdownMenu.RadioItem value="light" indicator={indicator}><svg data-testid="icon-light" />Light</DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="dark" indicator={indicator}><svg data-testid="icon-dark" />Dark</DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>
            <DropdownMenu.CheckboxItem checked indicator={indicator}>Compact</DropdownMenu.CheckboxItem>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    );
  }

  it('defaults to the leading indicator slot (unchanged)', async () => {
    render(<ThemeMenu />);
    await userEvent.setup().click(screen.getByText('Theme'));
    const dark = await screen.findByRole('menuitemradio', { name: 'Dark' });
    expect(dark).toHaveClass('ps-8');
    expect(dark.firstElementChild).toHaveAttribute('data-nx-indicator', 'start');
    expect(dark.querySelector('[data-nx-indicator="end"]')).toBeNull();
  });

  it('indicator="end" puts the tick after the label at the inline end, with no leading slot', async () => {
    render(<ThemeMenu indicator="end" />);
    await userEvent.setup().click(screen.getByText('Theme'));
    const light = await screen.findByRole('menuitemradio', { name: 'Light' });
    const dark = screen.getByRole('menuitemradio', { name: 'Dark' });
    expect(light).toHaveAttribute('aria-checked', 'false');
    expect(dark).toHaveAttribute('aria-checked', 'true');
    expect(dark).not.toHaveClass('ps-8');
    // The icon comes first, the tick last (ms-auto pushes it to the inline end).
    expect(dark.firstElementChild).toBe(screen.getByTestId('icon-dark'));
    const tick = dark.lastElementChild!;
    expect(tick).toHaveAttribute('data-nx-indicator', 'end');
    expect(tick).toHaveClass('ms-auto');
    expect(tick.querySelector('svg')).not.toBeNull();
    expect(light.lastElementChild!.querySelector('svg')).toBeNull();
    expect(dark.querySelector('[data-nx-indicator="start"]')).toBeNull();

    const compact = screen.getByRole('menuitemcheckbox', { name: 'Compact' });
    expect(compact).toHaveAttribute('aria-checked', 'true');
    expect(compact.lastElementChild).toHaveAttribute('data-nx-indicator', 'end');
  });

  it('indicator="end" still selects with the keyboard', async () => {
    const user = userEvent.setup();
    render(<ThemeMenu indicator="end" />);
    await user.click(screen.getByText('Theme'));
    await screen.findByRole('menuitemradio', { name: 'Light' });
    await user.keyboard('{ArrowDown}{Enter}');
    await user.click(screen.getByText('Theme'));
    expect(await screen.findByRole('menuitemradio', { name: 'Light' })).toHaveAttribute('aria-checked', 'true');
  });
});
