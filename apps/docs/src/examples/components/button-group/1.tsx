'use client'; // docs preview: server pages import every example

import { ButtonGroup, Button } from '@nexub/react';

export default function Example() {
  return (
    <ButtonGroup attached>
      <Button variant="outlined">Left</Button>
      <Button variant="outlined">Center</Button>
      <Button variant="outlined">Right</Button>
    </ButtonGroup>
  );
}
