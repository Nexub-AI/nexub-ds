'use client'; // docs preview: server pages import every example

import { ButtonGroup, Button } from '@nexub/react';

export default function Example() {
  return (
    <ButtonGroup orientation="vertical">
      <Button variant="outlined">Option A</Button>
      <Button variant="outlined">Option B</Button>
      <Button variant="outlined">Option C</Button>
    </ButtonGroup>
  );
}
