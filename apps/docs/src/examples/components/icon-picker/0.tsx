'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { IconPicker } from '@nexub/react';

export default function Example() {
  const [icon, setIcon] = React.useState<string | null>('CalendarDays');
  return <IconPicker aria-label="Menu icon" value={icon} onValueChange={setIcon} />;
}
