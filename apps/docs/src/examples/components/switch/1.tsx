'use client'; // docs preview: server pages import every example

import { Switch } from '@nexub/react';

export default function Example() {
  return <div className="flex gap-4 flex-wrap items-center justify-center"><Switch size="sm" defaultChecked /><Switch size="md" defaultChecked /><Switch size="lg" defaultChecked /></div>;
}
