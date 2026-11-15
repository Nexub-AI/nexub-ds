'use client'; // docs preview: server pages import every example

import { SplitButton, DropdownMenu } from '@nexub/react';

export default function Example() {
  return (
    <SplitButton
      menuLabel="More save options"
      menu={
        <>
          <DropdownMenu.Item>Save as draft</DropdownMenu.Item>
          <DropdownMenu.Item>Save a copy</DropdownMenu.Item>
        </>
      }
    >
      Save
    </SplitButton>
  );
}
