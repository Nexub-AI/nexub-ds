'use client'; // docs preview: server pages import every example

import { IconButton } from '@nexub/react';

export default function Example() {
  const icon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>;
  return <IconButton variant="ghost" label="Add item">{icon}</IconButton>;
}
