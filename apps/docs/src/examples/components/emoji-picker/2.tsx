'use client'; // docs preview: server pages import every example

import { EmojiPicker } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-wrap gap-4">
      <EmojiPicker aria-label="Invalid" invalid />
      <EmojiPicker aria-label="Read-only" readOnly defaultValue="📚" />
      <EmojiPicker aria-label="Disabled" disabled defaultValue="🎯" />
    </div>
  );
}
