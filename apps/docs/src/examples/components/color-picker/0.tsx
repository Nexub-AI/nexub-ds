'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { ColorPicker } from '@nexub/react';

export default function Example() {
  const [color, setColor] = React.useState('#2563eb');
  return <ColorPicker aria-label="Label colour" value={color} onValueChange={setColor} />;
}
