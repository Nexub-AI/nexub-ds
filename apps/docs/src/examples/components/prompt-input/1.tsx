'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { PromptInput, Chip, IconButton } from '@nexub/react';
import { Paperclip, Globe } from '@nexub/icons';

export default function Example() {
  const [files, setFiles] = React.useState(['q3-report.pdf', 'pricing.csv']);
  return (
    <div className="w-full max-w-[520px]">
      <PromptInput
        placeholder="Ask about these files"
        attachments={
          files.length > 0 &&
          files.map((f) => (
            <Chip key={f} onRemove={() => setFiles((all) => all.filter((x) => x !== f))}>
              {f}
            </Chip>
          ))
        }
        actions={
          <>
            <IconButton size="sm" label="Attach files"><Paperclip /></IconButton>
            <IconButton size="sm" label="Search the web"><Globe /></IconButton>
          </>
        }
      />
    </div>
  );
}
