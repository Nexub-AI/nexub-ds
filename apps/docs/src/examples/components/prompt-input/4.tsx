'use client'; // docs preview: server pages import every example

import { PromptInput, toast, type CommandListItem } from '@nexub/react';

const commands: CommandListItem[] = [
  { value: 'remind', label: 'Remind me', description: 'e.g. /remind tomorrow 9am', shortcut: ['⌘', 'R'] },
  { value: 'summarize', label: 'Summarize', description: 'Summarize this thread', keywords: ['tldr'] },
  { value: 'translate', label: 'Translate', description: 'Translate the last reply' },
];

export default function Example() {
  return (
    <div className="w-full max-w-130 pt-48">
      <PromptInput
        placeholder="Type / for commands"
        commands={commands}
        onCommand={(value, args) => toast.info(args ? `/${value} with “${args}”` : `/${value}`)}
        onSubmit={(text) => toast.success(`Sent: ${text}`)}
      />
    </div>
  );
}
