'use client'; // docs preview: server pages import every example

import { Toolbar } from '@nexub/react';

export default function Example() {
  return (
    <Toolbar.Root aria-label="Text formatting">
      <Toolbar.ToggleGroup type="multiple" aria-label="Text style">
        <Toolbar.ToggleItem value="bold" aria-label="Bold"><strong>B</strong></Toolbar.ToggleItem>
        <Toolbar.ToggleItem value="italic" aria-label="Italic"><em>I</em></Toolbar.ToggleItem>
        <Toolbar.ToggleItem value="underline" aria-label="Underline"><span className="underline">U</span></Toolbar.ToggleItem>
      </Toolbar.ToggleGroup>
      <Toolbar.Separator />
      <Toolbar.ToggleGroup type="single" defaultValue="left" aria-label="Alignment">
        <Toolbar.ToggleItem value="left" aria-label="Align left">L</Toolbar.ToggleItem>
        <Toolbar.ToggleItem value="center" aria-label="Align centre">C</Toolbar.ToggleItem>
        <Toolbar.ToggleItem value="right" aria-label="Align right">R</Toolbar.ToggleItem>
      </Toolbar.ToggleGroup>
      <Toolbar.Separator />
      <Toolbar.Button>Clear formatting</Toolbar.Button>
    </Toolbar.Root>
  );
}
