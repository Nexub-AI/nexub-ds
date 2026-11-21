'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Button, EmojiPickerPanel, Popover } from '@nexub/react';

export default function Example() {
  const [reaction, setReaction] = React.useState('👍');
  const [open, setOpen] = React.useState(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button variant="outlined">React {reaction}</Button>
      </Popover.Trigger>
      <Popover.Content className="p-0">
        <EmojiPickerPanel
          aria-label="Reactions"
          value={reaction}
          onValueChange={(e) => {
            setReaction(e);
            setOpen(false);
          }}
        />
      </Popover.Content>
    </Popover.Root>
  );
}
