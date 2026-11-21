'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { ColorPicker } from '@nexub/react';

export default function Example() {
  const [color, setColor] = React.useState('#777777');
  return <ColorPicker aria-label="Text colour" value={color} onValueChange={setColor} contrastAgainst="#ffffff" />;
}
