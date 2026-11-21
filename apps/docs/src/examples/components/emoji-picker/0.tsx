'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { EmojiPicker } from '@nexub/react';

export default function Example() {
  const [emoji, setEmoji] = React.useState<string | null>('🚀');
  return <EmojiPicker aria-label="Space icon" value={emoji} onValueChange={setEmoji} />;
}
