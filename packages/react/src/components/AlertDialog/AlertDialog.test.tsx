import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { AlertDialog } from './AlertDialog.js';

function TestAlertDialog({
  onAction,
  onCancel,
}: {
  onAction?: () => void;
  onCancel?: () => void;
}) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>Open Alert</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay />
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>Are you sure?</AlertDialog.Title>
            <AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Cancel onClick={onCancel}>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action onClick={onAction}>Confirm</AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

describe('AlertDialog', () => {
  it('renders trigger button', () => {
    render(<TestAlertDialog />);
    expect(screen.getByText('Open Alert')).toBeInTheDocument();
  });

  it('opens dialog on trigger click', async () => {
    const user = userEvent.setup();
    render(<TestAlertDialog />);

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    await user.click(screen.getByText('Open Alert'));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('fires action callback when Action is clicked', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<TestAlertDialog onAction={onAction} />);

    await user.click(screen.getByText('Open Alert'));
    await user.click(screen.getByText('Confirm'));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('fires cancel callback when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<TestAlertDialog onCancel={onCancel} />);

    await user.click(screen.getByText('Open Alert'));
    await user.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    render(<TestAlertDialog />);

    await user.click(screen.getByText('Open Alert'));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  });

  it('closes when Cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<TestAlertDialog />);

    await user.click(screen.getByText('Open Alert'));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();

    await user.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  });

  it('closes when Action is clicked', async () => {
    const user = userEvent.setup();
    render(<TestAlertDialog />);

    await user.click(screen.getByText('Open Alert'));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();

    await user.click(screen.getByText('Confirm'));
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  });
});

describe('AlertDialog.Confirm', () => {
  it('keeps the action disabled until the text is typed', async () => {
    const onAction = vi.fn();
    render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Content>
          <AlertDialog.Title>Delete workspace?</AlertDialog.Title>
          <AlertDialog.Description>This can't be undone.</AlertDialog.Description>
          <AlertDialog.Confirm text="acme-prod" />
          <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action onClick={onAction}>Delete</AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>,
    );
    const del = screen.getByRole('button', { name: 'Delete' });
    expect(del).toBeDisabled();
    const input = screen.getByLabelText('Type acme-prod to confirm');
    await userEvent.type(input, 'acme-pro');
    expect(del).toBeDisabled();
    await userEvent.type(input, 'd ');
    expect(del).toBeEnabled();
    await userEvent.click(del);
    expect(onAction).toHaveBeenCalled();
  });
});
