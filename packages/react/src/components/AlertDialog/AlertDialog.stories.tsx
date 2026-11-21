import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { AlertDialog, usePrompt } from './AlertDialog.js';

const meta: Meta = {
  title: 'Overlays/AlertDialog',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button>Delete account</button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay />
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
            <AlertDialog.Description>
              This action cannot be undone. This will permanently delete your account and remove
              all of your data from our servers.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action>Yes, delete account</AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  ),
};

export const TypeToConfirm: Story = {
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button>Delete workspace</button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>Delete acme-prod?</AlertDialog.Title>
          <AlertDialog.Description>All projects, members and billing history go with it. This can’t be undone.</AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Confirm text="acme-prod" />
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action>Delete workspace</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  ),
};

/** 10.6: a bottom sheet below the md breakpoint, the usual centred dialog above. */
export const SheetAuto: Story = {
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button>Delete project</button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay />
        <AlertDialog.Content sheet="auto">
          <AlertDialog.Header>
            <AlertDialog.Title>Delete this project?</AlertDialog.Title>
            <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action>Delete</AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  ),
};

/** 11.2: asks for a reason in place of window.prompt. Open by default so the dialog is visible. */
export const Prompt: Story = {
  render: () => (
    <AlertDialog.Prompt
      defaultOpen
      title="Reject expense claim"
      description="The submitter sees this reason."
      label="Reason"
      placeholder="Missing receipt"
      minLength={5}
      maxLength={200}
      multiline
      tone="destructive"
      confirmLabel="Reject claim"
      onSubmit={() => new Promise((resolve) => setTimeout(resolve, 800))}
    />
  ),
};

function UsePromptDemo() {
  const [prompt, element] = usePrompt();
  const [name, setName] = React.useState<string | null>(null);
  return (
    <div style={{ display: 'grid', gap: 8, justifyItems: 'start' }}>
      <button type="button" onClick={async () => setName(await prompt({ title: 'Rename space', label: 'Name', defaultValue: name ?? 'Q3 plan' }))}>
        Rename…
      </button>
      <span>Answer: {name ?? '—'}</span>
      {element}
    </div>
  );
}

export const UsePrompt: Story = { render: () => <UsePromptDemo /> };
