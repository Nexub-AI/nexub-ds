import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Paperclip } from '@nexub/icons';
import { PromptInput, type PromptInputStatus } from './PromptInput.js';
import { Chip } from '../Chip/Chip.js';
import { IconButton } from '../IconButton/IconButton.js';
import { Switch } from '../Switch/Switch.js';

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
