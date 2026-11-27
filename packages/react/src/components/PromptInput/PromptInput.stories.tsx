import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Paperclip } from '@nexub/icons';
import { PromptInput, type PromptInputStatus } from './PromptInput.js';
import { Chip } from '../Chip/Chip.js';
import { IconButton } from '../IconButton/IconButton.js';
import { Switch } from '../Switch/Switch.js';
import { Button } from '../Button/Button.js';
import type { CommandListItem } from '../CommandList/CommandList.js';

const meta: Meta<typeof PromptInput> = {
  title: 'AI/PromptInput',
  component: PromptInput,
  tags: ['autodocs'],
  decorators: [(Story) => <div className="max-w-2xl">{Story()}</div>],
};

export default meta;

type Story = StoryObj<typeof PromptInput>;

export const Default: Story = {
  args: { placeholder: 'Ask anything', maxRows: 8 },
};

export const Glass: Story = {
  args: { placeholder: 'Ask anything', surface: 'glass' },
};

export const Disabled: Story = {
  args: { placeholder: 'Ask anything', disabled: true },
};

export const WithAttachmentsAndStreaming: Story = {
  render: function Render() {
    const [files, setFiles] = React.useState(['Q3-report.pdf', 'pricing.csv']);
    const [status, setStatus] = React.useState<PromptInputStatus>('idle');
    const [log, setLog] = React.useState<string[]>([]);
    return (
      <div className="flex flex-col gap-4">
        <label className="inline-flex items-center gap-2 text-body-md">
          <Switch
            checked={status === 'streaming'}
            onCheckedChange={(on) => setStatus(on ? 'streaming' : 'idle')}
          />
          Streaming
        </label>
        <PromptInput
          placeholder="Ask about these files"
          status={status}
          onSubmit={(v) => {
            setLog((l) => [...l, v]);
            setStatus('streaming');
          }}
          onStop={() => setStatus('idle')}
          attachments={
            files.length > 0 &&
            files.map((f) => (
              <Chip key={f} onRemove={() => setFiles((fs) => fs.filter((x) => x !== f))}>
                {f}
              </Chip>
            ))
          }
          actions={
            <IconButton label="Attach file" size="sm">
              <Paperclip size="sm" />
            </IconButton>
          }
        />
        {log.length > 0 && (
          <ul className="text-body-sm text-[var(--color-on-surface-variant)]">
            {log.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        )}
      </div>
    );
  },
};

/** 11.5: a visible Send label, Cmd/Ctrl+Enter to send, a hint and an error. */
export const LabelHintAndError: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <PromptInput placeholder="Write a long answer" sendLabel="Send" submitOn="mod-enter" hint="Visible to everyone in the thread." />
      <PromptInput placeholder="Ask anything" defaultValue="A very long prompt" error="Shorten your message to 4,000 characters." />
    </div>
  ),
};

const slashCommands: CommandListItem[] = [
  { value: 'remind', label: 'Remind me', description: 'Remind me later, e.g. /remind tomorrow 9am', shortcut: ['⌘', 'R'] },
  { value: 'summarize', label: 'Summarize', description: 'Summarize this thread', keywords: ['tldr'], shortcut: ['⌘', 'S'] },
  { value: 'translate', label: 'Translate', description: 'Translate the last reply', shortcut: ['⌘', 'T'] },
  { value: 'archive', label: 'Archive', description: 'Not available in this thread', disabled: true },
];

/**
 * 12.2: type "/" to open the commands above the field. ↑/↓ move, Enter or Tab picks, Esc closes.
 * The text after the command's id arrives as `args`; the field clears after a pick.
 */
export const SlashCommands: Story = {
  render: function Render() {
    const [log, setLog] = React.useState<string[]>([]);
    return (
      <div className="flex flex-col gap-4 pt-72">
        <PromptInput
          placeholder="Type / for commands"
          commands={slashCommands}
          onCommand={(value, args) => setLog((l) => [...l, `/${value} (args: “${args}”)`])}
          onSubmit={(v) => setLog((l) => [...l, `message: ${v}`])}
        />
        {log.length > 0 && (
          <ul className="text-body-sm text-[var(--color-on-surface-variant)]">
            {log.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        )}
      </div>
    );
  },
};

const replies = ['Approve', 'Reject', 'Ask for details', 'Remind me tomorrow', 'Show the invoice'];

/** 12.2: quick replies above the field; on a phone the row scrolls sideways instead of wrapping. */
export const QuickReplyChips: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: function Render() {
    const [value, setValue] = React.useState('');
    return (
      // Phone width (360px) even where the viewport addon doesn't apply, e.g. the visual tests.
      <div className="max-w-90">
        <PromptInput
          placeholder="Reply"
          value={value}
          onValueChange={setValue}
          onSubmit={() => setValue('')}
          chips={replies.map((r) => (
            <Button key={r} size="sm" variant="tonal" onClick={() => setValue(r)}>
              {r}
            </Button>
          ))}
        />
      </div>
    );
  },
};
